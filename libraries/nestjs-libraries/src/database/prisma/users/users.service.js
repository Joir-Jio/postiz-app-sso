"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const users_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.repository");
const organization_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository");
let UsersService = class UsersService {
    constructor(_usersRepository, _organizationRepository) {
        this._usersRepository = _usersRepository;
        this._organizationRepository = _organizationRepository;
    }
    getUserByEmail(email) {
        return this._usersRepository.getUserByEmail(email);
    }
    getUserById(id) {
        return this._usersRepository.getUserById(id);
    }
    getImpersonateUser(name) {
        return this._organizationRepository.getImpersonateUser(name);
    }
    getUserByProvider(providerId, provider) {
        return this._usersRepository.getUserByProvider(providerId, provider);
    }
    activateUser(id) {
        return this._usersRepository.activateUser(id);
    }
    updatePassword(id, password) {
        return this._usersRepository.updatePassword(id, password);
    }
    changeAudienceSize(userId, audience) {
        return this._usersRepository.changeAudienceSize(userId, audience);
    }
    changeMarketplaceActive(userId, active) {
        return this._usersRepository.changeMarketplaceActive(userId, active);
    }
    getMarketplacePeople(orgId, userId, body) {
        return this._usersRepository.getMarketplacePeople(orgId, userId, body);
    }
    getPersonal(userId) {
        return this._usersRepository.getPersonal(userId);
    }
    changePersonal(userId, body) {
        return this._usersRepository.changePersonal(userId, body);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [users_repository_1.UsersRepository,
        organization_repository_1.OrganizationRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map