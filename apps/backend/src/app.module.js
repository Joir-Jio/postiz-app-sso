"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const database_module_1 = require("@gitroom/nestjs-libraries/database/prisma/database.module");
const api_module_1 = require("@gitroom/backend/api/api.module");
const core_1 = require("@nestjs/core");
const permissions_guard_1 = require("@gitroom/backend/services/auth/permissions/permissions.guard");
const bull_mq_module_1 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/bull.mq.module");
const public_api_module_1 = require("@gitroom/backend/public-api/public.api.module");
const throttler_provider_1 = require("@gitroom/nestjs-libraries/throttler/throttler.provider");
const throttler_1 = require("@nestjs/throttler");
const agent_module_1 = require("@gitroom/nestjs-libraries/agent/agent.module");
const mcp_module_1 = require("@gitroom/backend/mcp/mcp.module");
const thirdparty_module_1 = require("@gitroom/nestjs-libraries/3rdparties/thirdparty.module");
const video_module_1 = require("@gitroom/nestjs-libraries/videos/video.module");
const setup_1 = require("@sentry/nestjs/setup");
const sentry_exception_1 = require("@gitroom/nestjs-libraries/sentry/sentry.exception");
const sso_module_1 = require("@gitroom/backend/services/sso/sso.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            setup_1.SentryModule.forRoot(),
            bull_mq_module_1.BullMqModule,
            database_module_1.DatabaseModule,
            api_module_1.ApiModule,
            public_api_module_1.PublicApiModule,
            agent_module_1.AgentModule,
            mcp_module_1.McpModule,
            thirdparty_module_1.ThirdPartyModule,
            video_module_1.VideoModule,
            sso_module_1.SsoModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 3600000,
                    limit: process.env.API_LIMIT ? Number(process.env.API_LIMIT) : 30,
                },
            ]),
        ],
        controllers: [],
        providers: [
            sentry_exception_1.FILTER,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_provider_1.ThrottlerBehindProxyGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PoliciesGuard,
            }
        ],
        exports: [
            bull_mq_module_1.BullMqModule,
            database_module_1.DatabaseModule,
            api_module_1.ApiModule,
            public_api_module_1.PublicApiModule,
            agent_module_1.AgentModule,
            mcp_module_1.McpModule,
            throttler_1.ThrottlerModule,
            sso_module_1.SsoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map