"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("@gitroom/backend/api/routes/auth.controller");
const auth_service_1 = require("@gitroom/backend/services/auth/auth.service");
const users_controller_1 = require("@gitroom/backend/api/routes/users.controller");
const auth_middleware_1 = require("@gitroom/backend/services/auth/auth.middleware");
const stripe_controller_1 = require("@gitroom/backend/api/routes/stripe.controller");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const analytics_controller_1 = require("@gitroom/backend/api/routes/analytics.controller");
const permissions_guard_1 = require("@gitroom/backend/services/auth/permissions/permissions.guard");
const permissions_service_1 = require("@gitroom/backend/services/auth/permissions/permissions.service");
const integrations_controller_1 = require("@gitroom/backend/api/routes/integrations.controller");
const integration_manager_1 = require("@gitroom/nestjs-libraries/integrations/integration.manager");
const settings_controller_1 = require("@gitroom/backend/api/routes/settings.controller");
const posts_controller_1 = require("@gitroom/backend/api/routes/posts.controller");
const media_controller_1 = require("@gitroom/backend/api/routes/media.controller");
const upload_module_1 = require("@gitroom/nestjs-libraries/upload/upload.module");
const billing_controller_1 = require("@gitroom/backend/api/routes/billing.controller");
const notifications_controller_1 = require("@gitroom/backend/api/routes/notifications.controller");
const marketplace_controller_1 = require("@gitroom/backend/api/routes/marketplace.controller");
const messages_controller_1 = require("@gitroom/backend/api/routes/messages.controller");
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
const extract_content_service_1 = require("@gitroom/nestjs-libraries/openai/extract.content.service");
const codes_service_1 = require("@gitroom/nestjs-libraries/services/codes.service");
const copilot_controller_1 = require("@gitroom/backend/api/routes/copilot.controller");
const agencies_controller_1 = require("@gitroom/backend/api/routes/agencies.controller");
const public_controller_1 = require("@gitroom/backend/api/routes/public.controller");
const root_controller_1 = require("@gitroom/backend/api/routes/root.controller");
const track_service_1 = require("@gitroom/nestjs-libraries/track/track.service");
const short_link_service_1 = require("@gitroom/nestjs-libraries/short-linking/short.link.service");
const nowpayments_1 = require("@gitroom/nestjs-libraries/crypto/nowpayments");
const webhooks_controller_1 = require("@gitroom/backend/api/routes/webhooks.controller");
const signature_controller_1 = require("@gitroom/backend/api/routes/signature.controller");
const autopost_controller_1 = require("@gitroom/backend/api/routes/autopost.controller");
const mcp_service_1 = require("@gitroom/nestjs-libraries/mcp/mcp.service");
const mcp_controller_1 = require("@gitroom/backend/api/routes/mcp.controller");
const sets_controller_1 = require("@gitroom/backend/api/routes/sets.controller");
const third_party_controller_1 = require("@gitroom/backend/api/routes/third-party.controller");
const monitor_controller_1 = require("@gitroom/backend/api/routes/monitor.controller");
const media_reference_module_1 = require("@gitroom/backend/services/media/media-reference.module");
const authenticatedController = [
    users_controller_1.UsersController,
    analytics_controller_1.AnalyticsController,
    integrations_controller_1.IntegrationsController,
    settings_controller_1.SettingsController,
    posts_controller_1.PostsController,
    media_controller_1.MediaController,
    billing_controller_1.BillingController,
    notifications_controller_1.NotificationsController,
    marketplace_controller_1.MarketplaceController,
    messages_controller_1.MessagesController,
    copilot_controller_1.CopilotController,
    agencies_controller_1.AgenciesController,
    webhooks_controller_1.WebhookController,
    signature_controller_1.SignatureController,
    autopost_controller_1.AutopostController,
    sets_controller_1.SetsController,
    third_party_controller_1.ThirdPartyController,
];
let ApiModule = class ApiModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes(...authenticatedController);
    }
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [upload_module_1.UploadModule, media_reference_module_1.MediaReferenceModule],
        controllers: [
            root_controller_1.RootController,
            stripe_controller_1.StripeController,
            auth_controller_1.AuthController,
            public_controller_1.PublicController,
            mcp_controller_1.McpController,
            monitor_controller_1.MonitorController,
            ...authenticatedController,
        ],
        providers: [
            auth_service_1.AuthService,
            stripe_service_1.StripeService,
            openai_service_1.OpenaiService,
            extract_content_service_1.ExtractContentService,
            auth_middleware_1.AuthMiddleware,
            permissions_guard_1.PoliciesGuard,
            permissions_service_1.PermissionsService,
            codes_service_1.CodesService,
            integration_manager_1.IntegrationManager,
            track_service_1.TrackService,
            short_link_service_1.ShortLinkService,
            nowpayments_1.Nowpayments,
            mcp_service_1.McpService,
        ],
        get exports() {
            return [...this.imports, ...this.providers];
        },
    })
], ApiModule);
//# sourceMappingURL=api.module.js.map