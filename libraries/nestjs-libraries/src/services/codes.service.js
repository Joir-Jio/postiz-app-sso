"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
let CodesService = class CodesService {
    generateCodes(providerToken) {
        try {
            const decrypt = auth_service_1.AuthService.fixedDecryption(providerToken);
            return [...new Array(10000)]
                .map((_, index) => {
                return auth_service_1.AuthService.fixedEncryption(`${decrypt}:${index}`);
            })
                .join('\n');
        }
        catch (error) {
            return '';
        }
    }
};
exports.CodesService = CodesService;
exports.CodesService = CodesService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CodesService);
//# sourceMappingURL=codes.service.js.map