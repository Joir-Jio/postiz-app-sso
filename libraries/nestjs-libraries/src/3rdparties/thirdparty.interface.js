"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyAbstract = void 0;
exports.ThirdParty = ThirdParty;
const common_1 = require("@nestjs/common");
class ThirdPartyAbstract {
}
exports.ThirdPartyAbstract = ThirdPartyAbstract;
function ThirdParty(params) {
    return function (target) {
        (0, common_1.Injectable)()(target);
        const existingMetadata = Reflect.getMetadata('third:party', ThirdPartyAbstract) || [];
        existingMetadata.push(Object.assign({ target }, params));
        Reflect.defineMetadata('third:party', existingMetadata, ThirdPartyAbstract);
    };
}
//# sourceMappingURL=thirdparty.interface.js.map