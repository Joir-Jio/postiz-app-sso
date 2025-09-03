"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCSStorage = void 0;
const tslib_1 = require("tslib");
const storage_1 = require("@google-cloud/storage");
require("multer");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const mime_types_1 = tslib_1.__importDefault(require("mime-types"));
const mime_1 = require("mime");
const path = tslib_1.__importStar(require("path"));
class GCSStorage {
    constructor(config) {
        this._pathCache = new Map();
        this._metadataCache = new Map();
        this.PATH_CACHE_TTL = 5 * 60 * 1000;
        this.METADATA_CACHE_TTL = 2 * 60 * 1000;
        this._config = Object.assign({ maxRetries: 3, requestTimeout: 30000, signedUrlExpiry: 3600, enableCaching: true, allowFileReference: true, maxFileSize: 500 * 1024 * 1024 }, config);
        const storageOptions = {
            projectId: this._config.projectId,
            maxRetries: this._config.maxRetries,
            timeout: this._config.requestTimeout,
        };
        if (this._config.keyFilename) {
            storageOptions.keyFilename = this._config.keyFilename;
        }
        else if (this._config.credentials) {
            storageOptions.credentials = this._config.credentials;
        }
        this._storage = new storage_1.Storage(storageOptions);
        this._bucket = this._storage.bucket(this._config.bucketName);
        if (!this._config.allowedPathPatterns) {
            this._config.allowedPathPatterns = [
                '^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+(-DEV)?/\\d+/[^/]+$',
                '^[a-zA-Z0-9_-]+/\\d+/[^/]+$',
                '^[a-zA-Z0-9_-]+/[^/]+$',
            ];
        }
    }
    validateFilePath(filePath, userId) {
        const cacheKey = `${filePath}:${userId || 'anonymous'}`;
        if (this._config.enableCaching && this._pathCache.has(cacheKey)) {
            const cached = this._pathCache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.PATH_CACHE_TTL) {
                return cached.result;
            }
            this._pathCache.delete(cacheKey);
        }
        const result = {
            isValid: false,
            sanitizedPath: '',
            errors: []
        };
        try {
            let sanitizedPath = filePath.trim().replace(/^\/+|\/+$/g, '');
            if (sanitizedPath.includes('..') || sanitizedPath.includes('//')) {
                result.errors.push('Path traversal detected');
                return this.cachePathResult(cacheKey, result);
            }
            sanitizedPath = sanitizedPath.replace(/\\/g, '/');
            const isPatternMatch = this._config.allowedPathPatterns.some(pattern => {
                return new RegExp(pattern).test(sanitizedPath);
            });
            if (!isPatternMatch) {
                result.errors.push('Path does not match allowed patterns');
                return this.cachePathResult(cacheKey, result);
            }
            const pathParts = sanitizedPath.split('/');
            if (pathParts.length >= 2) {
                const userFolder = pathParts[1];
                result.userFolder = userFolder.replace('-DEV', '');
                result.isDev = userFolder.endsWith('-DEV');
                if (userId && !userFolder.startsWith(userId)) {
                    result.errors.push('User ID does not match path');
                    return this.cachePathResult(cacheKey, result);
                }
            }
            result.isValid = true;
            result.sanitizedPath = sanitizedPath;
        }
        catch (error) {
            result.errors.push(`Path validation error: ${error}`);
        }
        return this.cachePathResult(cacheKey, result);
    }
    cachePathResult(cacheKey, result) {
        if (this._config.enableCaching) {
            this._pathCache.set(cacheKey, { result, timestamp: Date.now() });
        }
        return result;
    }
    async getFileMetadata(filePath, useCache = true) {
        const cacheKey = filePath;
        if (useCache && this._config.enableCaching && this._metadataCache.has(cacheKey)) {
            const cached = this._metadataCache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.METADATA_CACHE_TTL) {
                return cached.metadata;
            }
            this._metadataCache.delete(cacheKey);
        }
        const file = this._bucket.file(filePath);
        try {
            const [metadata] = await file.getMetadata();
            const [exists] = await file.exists();
            const fileMetadata = {
                name: metadata.name || path.basename(filePath),
                size: parseInt(String(metadata.size || '0')),
                contentType: metadata.contentType || 'application/octet-stream',
                lastModified: new Date(metadata.updated || metadata.timeCreated),
                etag: metadata.etag || '',
                exists,
                isPublic: false,
            };
            if (this._config.enableCaching) {
                this._metadataCache.set(cacheKey, { metadata: fileMetadata, timestamp: Date.now() });
            }
            return fileMetadata;
        }
        catch (error) {
            const fileMetadata = {
                name: path.basename(filePath),
                size: 0,
                contentType: 'application/octet-stream',
                lastModified: new Date(),
                etag: '',
                exists: false,
            };
            return fileMetadata;
        }
    }
    async generateSignedUrl(filePath, action = 'read') {
        try {
            const file = this._bucket.file(filePath);
            const [signedUrl] = await file.getSignedUrl({
                action,
                expires: Date.now() + (this._config.signedUrlExpiry * 1000),
                version: 'v4',
            });
            return signedUrl;
        }
        catch (error) {
            throw new Error(`Failed to generate signed URL: ${error}`);
        }
    }
    async referenceFile(options) {
        var _a;
        if (!this._config.allowFileReference) {
            throw new Error('File referencing is not enabled');
        }
        const pathValidation = this.validateFilePath(options.filePath, options.userId);
        if (!pathValidation.isValid) {
            throw new Error(`Invalid file path: ${(_a = pathValidation.errors) === null || _a === void 0 ? void 0 : _a.join(', ')}`);
        }
        const metadata = await this.getFileMetadata(pathValidation.sanitizedPath);
        if (!metadata.exists) {
            throw new Error(`File does not exist: ${pathValidation.sanitizedPath}`);
        }
        if (!options.skipSizeCheck && metadata.size > this._config.maxFileSize) {
            throw new Error(`File too large: ${metadata.size} bytes (max: ${this._config.maxFileSize} bytes)`);
        }
        const signedUrl = await this.generateSignedUrl(pathValidation.sanitizedPath);
        const referencedFile = {
            filename: metadata.name,
            mimetype: metadata.contentType,
            size: metadata.size,
            originalname: metadata.name,
            fieldname: 'file',
            path: signedUrl,
            destination: signedUrl,
            encoding: '7bit',
            gcsPath: pathValidation.sanitizedPath,
            bucketName: this._config.bucketName,
            isReference: true,
            lastModified: metadata.lastModified,
            etag: metadata.etag,
            buffer: Buffer.alloc(0),
            stream: null,
        };
        return referencedFile;
    }
    async uploadSimple(path) {
        try {
            const loadImage = await fetch(path);
            if (!loadImage.ok) {
                throw new Error(`Failed to fetch image: ${loadImage.statusText}`);
            }
            const contentType = loadImage.headers.get('content-type') || 'application/octet-stream';
            const extension = (0, mime_1.getExtension)(contentType) || 'bin';
            const id = (0, make_is_1.makeId)(10);
            const fileName = `${id}.${extension}`;
            const file = this._bucket.file(fileName);
            const buffer = Buffer.from(await loadImage.arrayBuffer());
            const stream = file.createWriteStream({
                metadata: {
                    contentType,
                    cacheControl: this._config.cacheMaxAge ? `public, max-age=${this._config.cacheMaxAge}` : undefined,
                },
                public: true,
                validation: 'crc32c',
            });
            await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('finish', resolve);
                stream.end(buffer);
            });
            if (this._config.publicBaseUrl) {
                return `${this._config.publicBaseUrl}/${fileName}`;
            }
            else {
                return `https://storage.cloud.google.com/${this._config.bucketName}/${fileName}`;
            }
        }
        catch (error) {
            throw new Error(`Failed to upload simple file: ${error}`);
        }
    }
    async uploadFile(file) {
        try {
            const id = (0, make_is_1.makeId)(10);
            const extension = mime_types_1.default.extension(file.mimetype) || 'bin';
            const fileName = `${id}.${extension}`;
            const gcsFile = this._bucket.file(fileName);
            const stream = gcsFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    originalName: file.originalname,
                    cacheControl: this._config.cacheMaxAge ? `public, max-age=${this._config.cacheMaxAge}` : undefined,
                },
                public: true,
                validation: 'crc32c',
            });
            await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('finish', resolve);
                stream.end(file.buffer);
            });
            const publicUrl = this._config.publicBaseUrl
                ? `${this._config.publicBaseUrl}/${fileName}`
                : `https://storage.cloud.google.com/${this._config.bucketName}/${fileName}`;
            return {
                filename: fileName,
                mimetype: file.mimetype,
                size: file.size,
                buffer: file.buffer,
                originalname: file.originalname,
                fieldname: file.fieldname,
                path: publicUrl,
                destination: publicUrl,
                encoding: file.encoding,
                stream: file.buffer,
                bucketName: this._config.bucketName,
                isReference: false,
            };
        }
        catch (error) {
            throw new Error(`Failed to upload file: ${error}`);
        }
    }
    async removeFile(filePath) {
        try {
            let fileName = filePath;
            if (filePath.includes('storage.googleapis.com') || filePath.includes('storage.cloud.google.com')) {
                const url = new URL(filePath);
                fileName = url.pathname.split('/').slice(2).join('/');
            }
            else if (this._config.publicBaseUrl && filePath.startsWith(this._config.publicBaseUrl)) {
                fileName = filePath.replace(`${this._config.publicBaseUrl}/`, '');
            }
            else if (filePath.startsWith('/')) {
                fileName = filePath.substring(1);
            }
            const file = this._bucket.file(fileName);
            const [exists] = await file.exists();
            if (exists) {
                await file.delete();
                this._metadataCache.delete(fileName);
                for (const [key, value] of this._pathCache.entries()) {
                    if (value.result.sanitizedPath === fileName) {
                        this._pathCache.delete(key);
                    }
                }
            }
        }
        catch (error) {
            console.warn(`Failed to remove file ${filePath}: ${error}`);
        }
    }
    async fileExists(filePath) {
        try {
            const metadata = await this.getFileMetadata(filePath);
            return metadata.exists;
        }
        catch (error) {
            return false;
        }
    }
    async getFileInfo(filePath, userId) {
        var _a;
        if (this._config.allowFileReference) {
            const pathValidation = this.validateFilePath(filePath, userId);
            if (!pathValidation.isValid) {
                throw new Error(`Invalid file path: ${(_a = pathValidation.errors) === null || _a === void 0 ? void 0 : _a.join(', ')}`);
            }
            filePath = pathValidation.sanitizedPath;
        }
        const metadata = await this.getFileMetadata(filePath);
        if (metadata.exists) {
            metadata.signedUrl = await this.generateSignedUrl(filePath);
        }
        return metadata;
    }
    async listFiles(prefix, userId, maxResults = 100) {
        var _a;
        if (this._config.allowFileReference && userId) {
            const pathValidation = this.validateFilePath(prefix + '/', userId);
            if (!pathValidation.isValid) {
                throw new Error(`Invalid path prefix: ${(_a = pathValidation.errors) === null || _a === void 0 ? void 0 : _a.join(', ')}`);
            }
            prefix = pathValidation.sanitizedPath.replace(/\/$/, '');
        }
        try {
            const [files] = await this._bucket.getFiles({
                prefix: prefix,
                maxResults: maxResults,
            });
            const fileInfos = [];
            for (const file of files) {
                const [metadata] = await file.getMetadata();
                fileInfos.push({
                    name: metadata.name || '',
                    size: parseInt(String(metadata.size || '0')),
                    contentType: metadata.contentType || 'application/octet-stream',
                    lastModified: new Date(metadata.updated || metadata.timeCreated),
                    etag: metadata.etag || '',
                    exists: true,
                });
            }
            return fileInfos;
        }
        catch (error) {
            throw new Error(`Failed to list files: ${error}`);
        }
    }
    clearCaches() {
        this._pathCache.clear();
        this._metadataCache.clear();
    }
    getCacheStats() {
        return {
            pathCache: this._pathCache.size,
            metadataCache: this._metadataCache.size,
        };
    }
    getConfig() {
        const _a = this._config, { credentials, keyFilename } = _a, safeConfig = tslib_1.__rest(_a, ["credentials", "keyFilename"]);
        return safeConfig;
    }
}
exports.GCSStorage = GCSStorage;
exports.default = GCSStorage;
//# sourceMappingURL=gcs.storage.js.map