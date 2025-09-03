"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILTER = void 0;
const core_1 = require("@nestjs/core");
const setup_1 = require("@sentry/nestjs/setup");
exports.FILTER = {
    provide: core_1.APP_FILTER,
    useClass: setup_1.SentryGlobalFilter,
};
//# sourceMappingURL=sentry.exception.js.map