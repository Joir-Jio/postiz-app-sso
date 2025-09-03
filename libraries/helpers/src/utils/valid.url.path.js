"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidUrlPath = exports.ValidUrlExtension = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
let ValidUrlExtension = class ValidUrlExtension {
    validate(text, args) {
        return ((text === null || text === void 0 ? void 0 : text.endsWith('.png')) ||
            (text === null || text === void 0 ? void 0 : text.endsWith('.jpg')) ||
            (text === null || text === void 0 ? void 0 : text.endsWith('.jpeg')) ||
            (text === null || text === void 0 ? void 0 : text.endsWith('.gif')) ||
            (text === null || text === void 0 ? void 0 : text.endsWith('.mp4')));
    }
    defaultMessage(args) {
        return ('File must have a valid extension: .png, .jpg, .jpeg, .gif, or .mp4');
    }
};
exports.ValidUrlExtension = ValidUrlExtension;
exports.ValidUrlExtension = ValidUrlExtension = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'checkValidExtension', async: false })
], ValidUrlExtension);
let ValidUrlPath = class ValidUrlPath {
    validate(text, args) {
        if (!process.env.RESTRICT_UPLOAD_DOMAINS) {
            return true;
        }
        return ((text || 'invalid url').indexOf(process.env.RESTRICT_UPLOAD_DOMAINS) > -1);
    }
    defaultMessage(args) {
        return ('URL must contain the domain: ' + process.env.RESTRICT_UPLOAD_DOMAINS);
    }
};
exports.ValidUrlPath = ValidUrlPath;
exports.ValidUrlPath = ValidUrlPath = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'checkValidPath', async: false })
], ValidUrlPath);
//# sourceMappingURL=valid.url.path.js.map