"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const organization_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository");
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
let OrganizationService = class OrganizationService {
    constructor(_organizationRepository, _notificationsService) {
        this._organizationRepository = _organizationRepository;
        this._notificationsService = _notificationsService;
    }
    async createOrgAndUser(body, ip, userAgent) {
        return this._organizationRepository.createOrgAndUser(body, this._notificationsService.hasEmailProvider(), ip, userAgent);
    }
    async getCount() {
        return this._organizationRepository.getCount();
    }
    addUserToOrg(userId, id, orgId, role) {
        return this._organizationRepository.addUserToOrg(userId, id, orgId, role);
    }
    getOrgById(id) {
        return this._organizationRepository.getOrgById(id);
    }
    getOrgByApiKey(api) {
        return this._organizationRepository.getOrgByApiKey(api);
    }
    getUserOrg(id) {
        return this._organizationRepository.getUserOrg(id);
    }
    getOrgsByUserId(userId) {
        return this._organizationRepository.getOrgsByUserId(userId);
    }
    updateApiKey(orgId) {
        return this._organizationRepository.updateApiKey(orgId);
    }
    getTeam(orgId) {
        return this._organizationRepository.getTeam(orgId);
    }
    getOrgByCustomerId(customerId) {
        return this._organizationRepository.getOrgByCustomerId(customerId);
    }
    async inviteTeamMember(orgId, body) {
        const timeLimit = (0, dayjs_1.default)().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
        const id = (0, make_is_1.makeId)(5);
        const url = process.env.FRONTEND_URL +
            `/?org=${auth_service_1.AuthService.signJWT(Object.assign(Object.assign({}, body), { orgId, timeLimit, id }))}`;
        if (body.sendEmail) {
            await this._notificationsService.sendEmail(body.email, 'You have been invited to join an organization', `You have been invited to join an organization. Click <a href="${url}">here</a> to join.<br />The link will expire in 1 hour.`);
        }
        return { url };
    }
    async deleteTeamMember(org, userId) {
        const userOrgs = await this._organizationRepository.getOrgsByUserId(userId);
        const findOrgToDelete = userOrgs.find((orgUser) => orgUser.id === org.id);
        if (!findOrgToDelete) {
            throw new Error('User is not part of this organization');
        }
        const myRole = org.users[0].role;
        const userRole = findOrgToDelete.users[0].role;
        const myLevel = myRole === 'USER' ? 0 : myRole === 'ADMIN' ? 1 : 2;
        const userLevel = userRole === 'USER' ? 0 : userRole === 'ADMIN' ? 1 : 2;
        if (myLevel < userLevel) {
            throw new Error('You do not have permission to delete this user');
        }
        return this._organizationRepository.deleteTeamMember(org.id, userId);
    }
    disableOrEnableNonSuperAdminUsers(orgId, disable) {
        return this._organizationRepository.disableOrEnableNonSuperAdminUsers(orgId, disable);
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [organization_repository_1.OrganizationRepository,
        notification_service_1.NotificationService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map