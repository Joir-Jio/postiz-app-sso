"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("@gitroom/backend/services/auth/auth.service");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const permissions_guard_1 = require("@gitroom/backend/services/auth/permissions/permissions.guard");
const permissions_service_1 = require("@gitroom/backend/services/auth/permissions/permissions.service");
const integration_manager_1 = require("@gitroom/nestjs-libraries/integrations/integration.manager");
const upload_module_1 = require("@gitroom/nestjs-libraries/upload/upload.module");
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
const extract_content_service_1 = require("@gitroom/nestjs-libraries/openai/extract.content.service");
const codes_service_1 = require("@gitroom/nestjs-libraries/services/codes.service");
const public_integrations_controller_1 = require("@gitroom/backend/public-api/routes/v1/public.integrations.controller");
const public_auth_middleware_1 = require("@gitroom/backend/services/auth/public.auth.middleware");
const authenticatedController = [public_integrations_controller_1.PublicIntegrationsController];
let PublicApiModule = class PublicApiModule {
    configure(consumer) {
        consumer.apply(public_auth_middleware_1.PublicAuthMiddleware).forRoutes(...authenticatedController);
    }
};
exports.PublicApiModule = PublicApiModule;
exports.PublicApiModule = PublicApiModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [upload_module_1.UploadModule],
        controllers: [...authenticatedController],
        providers: [
            auth_service_1.AuthService,
            stripe_service_1.StripeService,
            openai_service_1.OpenaiService,
            extract_content_service_1.ExtractContentService,
            permissions_guard_1.PoliciesGuard,
            permissions_service_1.PermissionsService,
            codes_service_1.CodesService,
            integration_manager_1.IntegrationManager,
        ],
        get exports() {
            return [...this.imports, ...this.providers];
        },
    })
], PublicApiModule);
//# sourceMappingURL=public.api.module.js.map