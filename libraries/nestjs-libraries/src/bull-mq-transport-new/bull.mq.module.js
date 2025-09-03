"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const client_1 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/client");
let BullMqModule = class BullMqModule {
};
exports.BullMqModule = BullMqModule;
exports.BullMqModule = BullMqModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [client_1.BullMqClient],
        exports: [client_1.BullMqClient],
    })
], BullMqModule);
//# sourceMappingURL=bull.mq.module.js.map