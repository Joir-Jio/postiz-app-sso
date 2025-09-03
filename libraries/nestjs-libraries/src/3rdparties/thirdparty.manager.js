"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyManager = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const thirdparty_interface_1 = require("@gitroom/nestjs-libraries/3rdparties/thirdparty.interface");
const core_1 = require("@nestjs/core");
const third_party_service_1 = require("@gitroom/nestjs-libraries/database/prisma/third-party/third-party.service");
let ThirdPartyManager = class ThirdPartyManager {
    constructor(_moduleRef, _thirdPartyService) {
        this._moduleRef = _moduleRef;
        this._thirdPartyService = _thirdPartyService;
    }
    getAllThirdParties() {
        return (Reflect.getMetadata('third:party', thirdparty_interface_1.ThirdPartyAbstract) || []).map((p) => ({
            identifier: p.identifier,
            title: p.title,
            description: p.description,
            fields: p.fields || [],
        }));
    }
    getThirdPartyByName(identifier) {
        const thirdParty = (Reflect.getMetadata('third:party', thirdparty_interface_1.ThirdPartyAbstract) || []).find((p) => p.identifier === identifier);
        return Object.assign(Object.assign({}, thirdParty), { instance: this._moduleRef.get(thirdParty.target) });
    }
    deleteIntegration(org, id) {
        return this._thirdPartyService.deleteIntegration(org, id);
    }
    getIntegrationById(org, id) {
        return this._thirdPartyService.getIntegrationById(org, id);
    }
    getAllThirdPartiesByOrganization(org) {
        return this._thirdPartyService.getAllThirdPartiesByOrganization(org);
    }
    saveIntegration(org, identifier, apiKey, data) {
        return this._thirdPartyService.saveIntegration(org, identifier, apiKey, data);
    }
};
exports.ThirdPartyManager = ThirdPartyManager;
exports.ThirdPartyManager = ThirdPartyManager = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.ModuleRef,
        third_party_service_1.ThirdPartyService])
], ThirdPartyManager);
//# sourceMappingURL=thirdparty.manager.js.map