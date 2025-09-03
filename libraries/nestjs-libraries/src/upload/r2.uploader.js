"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleR2Upload;
exports.simpleUpload = simpleUpload;
exports.createMultipartUpload = createMultipartUpload;
exports.prepareUploadParts = prepareUploadParts;
exports.listParts = listParts;
exports.completeMultipartUpload = completeMultipartUpload;
exports.abortMultipartUpload = abortMultipartUpload;
exports.signPart = signPart;
const tslib_1 = require("tslib");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const path_1 = tslib_1.__importDefault(require("path"));
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ACCESS_KEY, CLOUDFLARE_SECRET_ACCESS_KEY, CLOUDFLARE_BUCKETNAME, CLOUDFLARE_BUCKET_URL, } = process.env;
const R2 = new client_s3_1.S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_KEY,
        secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
    },
});
function generateRandomString() {
    return (0, make_is_1.makeId)(20);
}
async function handleR2Upload(endpoint, req, res) {
    switch (endpoint) {
        case 'create-multipart-upload':
            return createMultipartUpload(req, res);
        case 'prepare-upload-parts':
            return prepareUploadParts(req, res);
        case 'complete-multipart-upload':
            return completeMultipartUpload(req, res);
        case 'list-parts':
            return listParts(req, res);
        case 'abort-multipart-upload':
            return abortMultipartUpload(req, res);
        case 'sign-part':
            return signPart(req, res);
    }
    return res.status(404).end();
}
async function simpleUpload(data, originalFilename, contentType) {
    const fileExtension = path_1.default.extname(originalFilename);
    const randomFilename = generateRandomString() + fileExtension;
    const params = {
        Bucket: CLOUDFLARE_BUCKETNAME,
        Key: randomFilename,
        Body: data,
        ContentType: contentType,
    };
    const command = new client_s3_1.PutObjectCommand(Object.assign({}, params));
    await R2.send(command);
    return CLOUDFLARE_BUCKET_URL + '/' + randomFilename;
}
async function createMultipartUpload(req, res) {
    const { file, fileHash, contentType } = req.body;
    const fileExtension = path_1.default.extname(file.name);
    const randomFilename = generateRandomString() + fileExtension;
    try {
        const params = {
            Bucket: CLOUDFLARE_BUCKETNAME,
            Key: `${randomFilename}`,
            ContentType: contentType,
            Metadata: {
                'x-amz-meta-file-hash': fileHash,
            },
        };
        const command = new client_s3_1.CreateMultipartUploadCommand(Object.assign({}, params));
        const response = await R2.send(command);
        return res.status(200).json({
            uploadId: response.UploadId,
            key: response.Key,
        });
    }
    catch (err) {
        console.log('Error', err);
        return res.status(500).json({ source: { status: 500 } });
    }
}
async function prepareUploadParts(req, res) {
    const { partData } = req.body;
    const parts = partData.parts;
    const response = {
        presignedUrls: {},
    };
    for (const part of parts) {
        try {
            const params = {
                Bucket: CLOUDFLARE_BUCKETNAME,
                Key: partData.key,
                PartNumber: part.number,
                UploadId: partData.uploadId,
            };
            const command = new client_s3_1.UploadPartCommand(Object.assign({}, params));
            const url = await (0, s3_request_presigner_1.getSignedUrl)(R2, command, { expiresIn: 3600 });
            response.presignedUrls[part.number] = url;
        }
        catch (err) {
            console.log('Error', err);
            return res.status(500).json(err);
        }
    }
    return res.status(200).json(response);
}
async function listParts(req, res) {
    const { key, uploadId } = req.body;
    try {
        const params = {
            Bucket: CLOUDFLARE_BUCKETNAME,
            Key: key,
            UploadId: uploadId,
        };
        const command = new client_s3_1.ListPartsCommand(Object.assign({}, params));
        const response = await R2.send(command);
        return res.status(200).json(response['Parts']);
    }
    catch (err) {
        console.log('Error', err);
        return res.status(500).json(err);
    }
}
async function completeMultipartUpload(req, res) {
    var _a;
    const { key, uploadId, parts } = req.body;
    try {
        const params = {
            Bucket: CLOUDFLARE_BUCKETNAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        };
        const command = new client_s3_1.CompleteMultipartUploadCommand({
            Bucket: CLOUDFLARE_BUCKETNAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        });
        const response = await R2.send(command);
        response.Location =
            process.env.CLOUDFLARE_BUCKET_URL +
                '/' +
                ((_a = response === null || response === void 0 ? void 0 : response.Location) === null || _a === void 0 ? void 0 : _a.split('/').at(-1));
        return response;
    }
    catch (err) {
        console.log('Error', err);
        return res.status(500).json(err);
    }
}
async function abortMultipartUpload(req, res) {
    const { key, uploadId } = req.body;
    try {
        const params = {
            Bucket: CLOUDFLARE_BUCKETNAME,
            Key: key,
            UploadId: uploadId,
        };
        const command = new client_s3_1.AbortMultipartUploadCommand(Object.assign({}, params));
        const response = await R2.send(command);
        return res.status(200).json(response);
    }
    catch (err) {
        console.log('Error', err);
        return res.status(500).json(err);
    }
}
async function signPart(req, res) {
    const { key, uploadId } = req.body;
    const partNumber = parseInt(req.body.partNumber);
    const params = {
        Bucket: CLOUDFLARE_BUCKETNAME,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
        Expires: 3600,
    };
    const command = new client_s3_1.UploadPartCommand(Object.assign({}, params));
    const url = await (0, s3_request_presigner_1.getSignedUrl)(R2, command, { expiresIn: 3600 });
    return res.status(200).json({
        url: url,
    });
}
//# sourceMappingURL=r2.uploader.js.map