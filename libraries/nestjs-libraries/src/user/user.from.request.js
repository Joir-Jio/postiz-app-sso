"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserFromRequest = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserFromRequest = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=user.from.request.js.map