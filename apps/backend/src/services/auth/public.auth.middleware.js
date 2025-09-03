"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAuthMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
const exception_filter_1 = require("@gitroom/nestjs-libraries/services/exception.filter");
let PublicAuthMiddleware = class PublicAuthMiddleware {
    constructor(_organizationService) {
        this._organizationService = _organizationService;
    }
    async use(req, res, next) {
        const auth = (req.headers.authorization ||
            req.headers.Authorization);
        if (!auth) {
            res.status(common_1.HttpStatus.UNAUTHORIZED).json({ msg: 'No API Key found' });
            return;
        }
        try {
            const org = await this._organizationService.getOrgByApiKey(auth);
            if (!org) {
                res.status(common_1.HttpStatus.UNAUTHORIZED).json({ msg: 'Invalid API key' });
                return;
            }
            if (!!process.env.STRIPE_SECRET_KEY && !org.subscription) {
                res
                    .status(common_1.HttpStatus.UNAUTHORIZED)
                    .json({ msg: 'No subscription found' });
                return;
            }
            req.org = Object.assign(Object.assign({}, org), { users: [{ users: { role: 'SUPERADMIN' } }] });
        }
        catch (err) {
            throw new exception_filter_1.HttpForbiddenException();
        }
        next();
    }
};
exports.PublicAuthMiddleware = PublicAuthMiddleware;
exports.PublicAuthMiddleware = PublicAuthMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [organization_service_1.OrganizationService])
], PublicAuthMiddleware);
//# sourceMappingURL=public.auth.middleware.js.map