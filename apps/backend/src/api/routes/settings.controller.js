"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const stars_service_1 = require("@gitroom/nestjs-libraries/database/prisma/stars/stars.service");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
const add_team_member_dto_1 = require("@gitroom/nestjs-libraries/dtos/settings/add.team.member.dto");
const swagger_1 = require("@nestjs/swagger");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
let SettingsController = class SettingsController {
    constructor(_starsService, _organizationService) {
        this._starsService = _starsService;
        this._organizationService = _organizationService;
    }
    async getConnectedGithubAccounts(org) {
        return {
            github: (await this._starsService.getGitHubRepositoriesByOrgId(org.id)).map((repo) => ({
                id: repo.id,
                login: repo.login,
            })),
        };
    }
    async addGitHub(org, code) {
        if (!code) {
            throw new Error('No code provided');
        }
        await this._starsService.addGitHub(org.id, code);
    }
    authUrl() {
        return {
            url: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=${encodeURIComponent('user:email')}&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/settings`)}`,
        };
    }
    async getOrganizations(org, id) {
        return {
            organizations: await this._starsService.getOrganizations(org.id, id),
        };
    }
    async getRepositories(org, id, github) {
        return {
            repositories: await this._starsService.getRepositoriesOfOrganization(org.id, id, github),
        };
    }
    async updateGitHubLogin(org, id, login) {
        return this._starsService.updateGitHubLogin(org.id, id, login);
    }
    async deleteRepository(org, id) {
        return this._starsService.deleteRepository(org.id, id);
    }
    async getTeam(org) {
        return this._organizationService.getTeam(org.id);
    }
    async inviteTeamMember(org, body) {
        return this._organizationService.inviteTeamMember(org.id, body);
    }
    deleteTeamMember(org, id) {
        return this._organizationService.deleteTeamMember(org, id);
    }
};
exports.SettingsController = SettingsController;
tslib_1.__decorate([
    (0, common_1.Get)('/github'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "getConnectedGithubAccounts", null);
tslib_1.__decorate([
    (0, common_1.Post)('/github'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)('code')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "addGitHub", null);
tslib_1.__decorate([
    (0, common_1.Get)('/github/url'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], SettingsController.prototype, "authUrl", null);
tslib_1.__decorate([
    (0, common_1.Get)('/organizations/:id'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "getOrganizations", null);
tslib_1.__decorate([
    (0, common_1.Get)('/organizations/:id/:github'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Param)('github')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "getRepositories", null);
tslib_1.__decorate([
    (0, common_1.Post)('/organizations/:id'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)('login')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "updateGitHubLogin", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/repository/:id'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "deleteRepository", null);
tslib_1.__decorate([
    (0, common_1.Get)('/team'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.TEAM_MEMBERS], [permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "getTeam", null);
tslib_1.__decorate([
    (0, common_1.Post)('/team'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.TEAM_MEMBERS], [permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, add_team_member_dto_1.AddTeamMemberDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingsController.prototype, "inviteTeamMember", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/team/:id'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.TEAM_MEMBERS], [permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], SettingsController.prototype, "deleteTeamMember", null);
exports.SettingsController = SettingsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, common_1.Controller)('/settings'),
    tslib_1.__metadata("design:paramtypes", [stars_service_1.StarsService,
        organization_service_1.OrganizationService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map