"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const thirdparty_manager_1 = require("@gitroom/nestjs-libraries/3rdparties/thirdparty.manager");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
const media_service_1 = require("@gitroom/nestjs-libraries/database/prisma/media/media.service");
let ThirdPartyController = class ThirdPartyController {
    constructor(_thirdPartyManager, _mediaService) {
        this._thirdPartyManager = _thirdPartyManager;
        this._mediaService = _mediaService;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    async getThirdPartyList() {
        return this._thirdPartyManager.getAllThirdParties();
    }
    async getSavedThirdParty(organization) {
        return Promise.all((await this._thirdPartyManager.getAllThirdPartiesByOrganization(organization.id)).map((thirdParty) => {
            const { description, fields, position, title, identifier } = this._thirdPartyManager.getThirdPartyByName(thirdParty.identifier);
            return Object.assign(Object.assign({}, thirdParty), { title,
                position,
                fields,
                description });
        }));
    }
    deleteById(organization, id) {
        return this._thirdPartyManager.deleteIntegration(organization.id, id);
    }
    async generate(organization, id, data) {
        var _a;
        const thirdParty = await this._thirdPartyManager.getIntegrationById(organization.id, id);
        if (!thirdParty) {
            throw new common_1.HttpException('Integration not found', 404);
        }
        const thirdPartyInstance = this._thirdPartyManager.getThirdPartyByName(thirdParty.identifier);
        if (!thirdPartyInstance) {
            throw new common_1.HttpException('Invalid identifier', 400);
        }
        const loadedData = await ((_a = thirdPartyInstance === null || thirdPartyInstance === void 0 ? void 0 : thirdPartyInstance.instance) === null || _a === void 0 ? void 0 : _a.sendData(auth_service_1.AuthService.fixedDecryption(thirdParty.apiKey), data));
        const file = await this.storage.uploadSimple(loadedData);
        return this._mediaService.saveFile(organization.id, file.split('/').pop(), file);
    }
    async callFunction(organization, id, functionName, data) {
        var _a;
        const thirdParty = await this._thirdPartyManager.getIntegrationById(organization.id, id);
        if (!thirdParty) {
            throw new common_1.HttpException('Integration not found', 404);
        }
        const thirdPartyInstance = this._thirdPartyManager.getThirdPartyByName(thirdParty.identifier);
        if (!thirdPartyInstance) {
            throw new common_1.HttpException('Invalid identifier', 400);
        }
        return (_a = thirdPartyInstance === null || thirdPartyInstance === void 0 ? void 0 : thirdPartyInstance.instance) === null || _a === void 0 ? void 0 : _a[functionName](auth_service_1.AuthService.fixedDecryption(thirdParty.apiKey), data);
    }
    async addApiKey(organization, identifier, api) {
        const thirdParty = this._thirdPartyManager.getThirdPartyByName(identifier);
        if (!thirdParty) {
            throw new common_1.HttpException('Invalid identifier', 400);
        }
        const connect = await thirdParty.instance.checkConnection(api);
        if (!connect) {
            throw new common_1.HttpException('Invalid API key', 400);
        }
        try {
            const save = await this._thirdPartyManager.saveIntegration(organization.id, identifier, api, {
                name: connect.name,
                username: connect.username,
                id: connect.id,
            });
            return {
                id: save.id,
            };
        }
        catch (e) {
            console.log(e);
            throw new common_1.HttpException('Integration Already Exists', 400);
        }
    }
};
exports.ThirdPartyController = ThirdPartyController;
tslib_1.__decorate([
    (0, common_1.Get)('/list'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "getThirdPartyList", null);
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "getSavedThirdParty", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], ThirdPartyController.prototype, "deleteById", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:id/submit'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "generate", null);
tslib_1.__decorate([
    (0, common_1.Post)('/function/:id/:functionName'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Param)('functionName')),
    tslib_1.__param(3, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "callFunction", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:identifier'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('identifier')),
    tslib_1.__param(2, (0, common_1.Body)('api')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "addApiKey", null);
exports.ThirdPartyController = ThirdPartyController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Third Party'),
    (0, common_1.Controller)('/third-party'),
    tslib_1.__metadata("design:paramtypes", [thirdparty_manager_1.ThirdPartyManager,
        media_service_1.MediaService])
], ThirdPartyController);
//# sourceMappingURL=third-party.controller.js.map