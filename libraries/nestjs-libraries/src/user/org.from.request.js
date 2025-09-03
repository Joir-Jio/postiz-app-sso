"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrgFromRequest = void 0;
const common_1 = require("@nestjs/common");
exports.GetOrgFromRequest = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.org;
});
//# sourceMappingURL=org.from.request.js.map