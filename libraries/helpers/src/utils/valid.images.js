"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidContent = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const striptags_1 = tslib_1.__importDefault(require("striptags"));
let ValidContent = class ValidContent {
    validate(contentRaw, args) {
        var _a, _b, _c;
        const content = (0, striptags_1.default)(contentRaw || '');
        if ((!((_a = args === null || args === void 0 ? void 0 : args.object) === null || _a === void 0 ? void 0 : _a.image) || !Array.isArray((_b = args === null || args === void 0 ? void 0 : args.object) === null || _b === void 0 ? void 0 : _b.image) || !((_c = args === null || args === void 0 ? void 0 : args.object) === null || _c === void 0 ? void 0 : _c.image.length)) &&
            (!content || typeof content !== 'string' || (content === null || content === void 0 ? void 0 : content.trim()) === '')) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return ' If images do not exist, content must be a non-empty string.';
    }
};
exports.ValidContent = ValidContent;
exports.ValidContent = ValidContent = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'validateContent', async: false })
], ValidContent);
//# sourceMappingURL=valid.images.js.map