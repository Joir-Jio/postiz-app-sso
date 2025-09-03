"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareStorage = void 0;
const tslib_1 = require("tslib");
const client_s3_1 = require("@aws-sdk/client-s3");
require("multer");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const mime_types_1 = tslib_1.__importDefault(require("mime-types"));
const mime_1 = require("mime");
class CloudflareStorage {
    constructor(accountID, accessKey, secretKey, region, _bucketName, _uploadUrl) {
        this.region = region;
        this._bucketName = _bucketName;
        this._uploadUrl = _uploadUrl;
        this._client = new client_s3_1.S3Client({
            endpoint: `https://${accountID}.r2.cloudflarestorage.com`,
            region,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
            requestChecksumCalculation: 'WHEN_REQUIRED',
        });
        this._client.middlewareStack.add((next) => async (args) => {
            const request = args.request;
            const headers = request.headers;
            delete headers['x-amz-checksum-crc32'];
            delete headers['x-amz-checksum-crc32c'];
            delete headers['x-amz-checksum-sha1'];
            delete headers['x-amz-checksum-sha256'];
            request.headers = headers;
            Object.entries(request.headers).forEach(([key, value]) => {
                if (!request.headers) {
                    request.headers = {};
                }
                request.headers[key] = value;
            });
            return next(args);
        }, { step: 'build', name: 'customHeaders' });
    }
    async uploadSimple(path) {
        var _a, _b;
        const loadImage = await fetch(path);
        const contentType = ((_a = loadImage === null || loadImage === void 0 ? void 0 : loadImage.headers) === null || _a === void 0 ? void 0 : _a.get('content-type')) ||
            ((_b = loadImage === null || loadImage === void 0 ? void 0 : loadImage.headers) === null || _b === void 0 ? void 0 : _b.get('Content-Type'));
        const extension = (0, mime_1.getExtension)(contentType);
        const id = (0, make_is_1.makeId)(10);
        const params = {
            Bucket: this._bucketName,
            Key: `${id}.${extension}`,
            Body: Buffer.from(await loadImage.arrayBuffer()),
            ContentType: contentType,
            ChecksumMode: 'DISABLED',
        };
        const command = new client_s3_1.PutObjectCommand(Object.assign({}, params));
        await this._client.send(command);
        return `${this._uploadUrl}/${id}.${extension}`;
    }
    async uploadFile(file) {
        const id = (0, make_is_1.makeId)(10);
        const extension = mime_types_1.default.extension(file.mimetype) || '';
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this._bucketName,
            ACL: 'public-read',
            Key: `${id}.${extension}`,
            Body: file.buffer,
        });
        await this._client.send(command);
        return {
            filename: `${id}.${extension}`,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
            originalname: `${id}.${extension}`,
            fieldname: 'file',
            path: `${this._uploadUrl}/${id}.${extension}`,
            destination: `${this._uploadUrl}/${id}.${extension}`,
            encoding: '7bit',
            stream: file.buffer,
        };
    }
    async removeFile(filePath) {
    }
}
exports.CloudflareStorage = CloudflareStorage;
exports.default = CloudflareStorage;
//# sourceMappingURL=cloudflare.storage.js.map