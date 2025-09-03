"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = exports.HttpForbiddenException = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const auth_middleware_1 = require("@gitroom/backend/services/auth/auth.middleware");
class HttpForbiddenException extends common_1.HttpException {
    constructor() {
        super('Forbidden', 403);
    }
}
exports.HttpForbiddenException = HttpForbiddenException;
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        (0, auth_middleware_1.removeAuth)(response);
        return response.status(401).send();
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = tslib_1.__decorate([
    (0, common_1.Catch)(HttpForbiddenException)
], HttpExceptionFilter);
//# sourceMappingURL=exception.filter.js.map