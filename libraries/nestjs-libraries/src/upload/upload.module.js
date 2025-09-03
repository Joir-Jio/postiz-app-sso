"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const upload_factory_1 = require("./upload.factory");
const custom_upload_validation_1 = require("@gitroom/nestjs-libraries/upload/custom.upload.validation");
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [upload_factory_1.UploadFactory, custom_upload_validation_1.CustomFileValidationPipe],
        exports: [upload_factory_1.UploadFactory, custom_upload_validation_1.CustomFileValidationPipe],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map