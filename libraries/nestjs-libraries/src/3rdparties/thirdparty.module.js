"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const heygen_provider_1 = require("@gitroom/nestjs-libraries/3rdparties/heygen/heygen.provider");
const thirdparty_manager_1 = require("@gitroom/nestjs-libraries/3rdparties/thirdparty.manager");
let ThirdPartyModule = class ThirdPartyModule {
};
exports.ThirdPartyModule = ThirdPartyModule;
exports.ThirdPartyModule = ThirdPartyModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [heygen_provider_1.HeygenProvider, thirdparty_manager_1.ThirdPartyManager],
        get exports() {
            return this.providers;
        },
    })
], ThirdPartyModule);
//# sourceMappingURL=thirdparty.module.js.map