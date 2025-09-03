"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFileValidationPipe = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let CustomFileValidationPipe = class CustomFileValidationPipe {
    async transform(value) {
        if (!value) {
            throw 'No file provided.';
        }
        if (!value.mimetype) {
            return value;
        }
        const maxSize = this.getMaxSize(value.mimetype);
        const validation = (value.mimetype.startsWith('image/') ||
            value.mimetype.startsWith('video/mp4')) &&
            value.size <= maxSize;
        if (validation) {
            return value;
        }
        throw new common_1.BadRequestException(`File size exceeds the maximum allowed size of ${maxSize} bytes.`);
    }
    getMaxSize(mimeType) {
        if (mimeType.startsWith('image/')) {
            return 10 * 1024 * 1024;
        }
        else if (mimeType.startsWith('video/')) {
            return 1024 * 1024 * 1024;
        }
        else {
            throw new common_1.BadRequestException('Unsupported file type.');
        }
    }
};
exports.CustomFileValidationPipe = CustomFileValidationPipe;
exports.CustomFileValidationPipe = CustomFileValidationPipe = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CustomFileValidationPipe);
//# sourceMappingURL=custom.upload.validation.js.map