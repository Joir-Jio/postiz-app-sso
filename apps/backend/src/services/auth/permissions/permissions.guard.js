"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_service_1 = require("@gitroom/backend/services/auth/permissions/permissions.service");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const permission_exception_class_1 = require("./permission.exception.class");
let PoliciesGuard = class PoliciesGuard {
    constructor(_reflector, _authorizationService) {
        this._reflector = _reflector;
        this._authorizationService = _authorizationService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.path.indexOf('/auth') > -1 ||
            request.path.indexOf('/stripe') > -1) {
            return true;
        }
        const policyHandlers = this._reflector.get(permissions_ability_1.CHECK_POLICIES_KEY, context.getHandler()) || [];
        if (!policyHandlers || !policyHandlers.length) {
            return true;
        }
        const { org } = request;
        const ability = await this._authorizationService.check(org.id, org.createdAt, org.users[0].role, policyHandlers);
        const item = policyHandlers.find((handler) => !this.execPolicyHandler(handler, ability));
        if (item) {
            throw new permission_exception_class_1.SubscriptionException({
                section: item[1],
                action: item[0],
            });
        }
        return true;
    }
    execPolicyHandler(handler, ability) {
        return ability.can(handler[0], handler[1]);
    }
};
exports.PoliciesGuard = PoliciesGuard;
exports.PoliciesGuard = PoliciesGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector,
        permissions_service_1.PermissionsService])
], PoliciesGuard);
//# sourceMappingURL=permissions.guard.js.map