"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const mime_1 = tslib_1.__importDefault(require("mime"));
const path_1 = require("path");
const axios_1 = tslib_1.__importDefault(require("axios"));
class LocalStorage {
    constructor(uploadDirectory) {
        this.uploadDirectory = uploadDirectory;
    }
    async uploadSimple(path) {
        var _a, _b;
        const loadImage = await axios_1.default.get(path, { responseType: 'arraybuffer' });
        const contentType = ((_a = loadImage === null || loadImage === void 0 ? void 0 : loadImage.headers) === null || _a === void 0 ? void 0 : _a['content-type']) ||
            ((_b = loadImage === null || loadImage === void 0 ? void 0 : loadImage.headers) === null || _b === void 0 ? void 0 : _b['Content-Type']);
        const findExtension = mime_1.default.getExtension(contentType);
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const innerPath = `/${year}/${month}/${day}`;
        const dir = `${this.uploadDirectory}${innerPath}`;
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        const filePath = `${dir}/${randomName}.${findExtension}`;
        const publicPath = `${innerPath}/${randomName}.${findExtension}`;
        (0, fs_1.writeFileSync)(filePath, loadImage.data);
        return process.env.FRONTEND_URL + '/uploads' + publicPath;
    }
    async uploadFile(file) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const innerPath = `/${year}/${month}/${day}`;
        const dir = `${this.uploadDirectory}${innerPath}`;
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        const filePath = `${dir}/${randomName}${(0, path_1.extname)(file.originalname)}`;
        const publicPath = `${innerPath}/${randomName}${(0, path_1.extname)(file.originalname)}`;
        (0, fs_1.writeFileSync)(filePath, file.buffer);
        return {
            filename: `${randomName}${(0, path_1.extname)(file.originalname)}`,
            path: process.env.FRONTEND_URL + '/uploads' + publicPath,
            mimetype: file.mimetype,
            originalname: file.originalname,
        };
    }
    async removeFile(filePath) {
        return new Promise((resolve, reject) => {
            (0, fs_1.unlink)(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=local.storage.js.map