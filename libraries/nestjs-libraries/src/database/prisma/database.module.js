"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const organization_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
const users_service_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.service");
const users_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.repository");
const stars_service_1 = require("@gitroom/nestjs-libraries/database/prisma/stars/stars.service");
const stars_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/stars/stars.repository");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
const subscription_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.repository");
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const integration_service_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.service");
const integration_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.repository");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const posts_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.repository");
const integration_manager_1 = require("@gitroom/nestjs-libraries/integrations/integration.manager");
const media_service_1 = require("@gitroom/nestjs-libraries/database/prisma/media/media.service");
const media_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/media/media.repository");
const notifications_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notifications.repository");
const email_service_1 = require("@gitroom/nestjs-libraries/services/email.service");
const item_user_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/item.user.repository");
const item_user_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/item.user.service");
const messages_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service");
const messages_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/messages.repository");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const extract_content_service_1 = require("@gitroom/nestjs-libraries/openai/extract.content.service");
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
const agencies_service_1 = require("@gitroom/nestjs-libraries/database/prisma/agencies/agencies.service");
const agencies_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/agencies/agencies.repository");
const track_service_1 = require("@gitroom/nestjs-libraries/track/track.service");
const short_link_service_1 = require("@gitroom/nestjs-libraries/short-linking/short.link.service");
const webhooks_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.repository");
const webhooks_service_1 = require("@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.service");
const signature_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/signatures/signature.repository");
const signature_service_1 = require("@gitroom/nestjs-libraries/database/prisma/signatures/signature.service");
const autopost_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/autopost/autopost.repository");
const autopost_service_1 = require("@gitroom/nestjs-libraries/database/prisma/autopost/autopost.service");
const sets_service_1 = require("@gitroom/nestjs-libraries/database/prisma/sets/sets.service");
const sets_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/sets/sets.repository");
const third_party_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/third-party/third-party.repository");
const third_party_service_1 = require("@gitroom/nestjs-libraries/database/prisma/third-party/third-party.service");
const video_manager_1 = require("@gitroom/nestjs-libraries/videos/video.manager");
const fal_service_1 = require("@gitroom/nestjs-libraries/openai/fal.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        controllers: [],
        providers: [
            prisma_service_1.PrismaService,
            prisma_service_1.PrismaRepository,
            prisma_service_1.PrismaTransaction,
            users_service_1.UsersService,
            users_repository_1.UsersRepository,
            organization_service_1.OrganizationService,
            organization_repository_1.OrganizationRepository,
            stars_service_1.StarsService,
            stars_repository_1.StarsRepository,
            subscription_service_1.SubscriptionService,
            subscription_repository_1.SubscriptionRepository,
            notification_service_1.NotificationService,
            notifications_repository_1.NotificationsRepository,
            webhooks_repository_1.WebhooksRepository,
            webhooks_service_1.WebhooksService,
            integration_service_1.IntegrationService,
            integration_repository_1.IntegrationRepository,
            posts_service_1.PostsService,
            posts_repository_1.PostsRepository,
            stripe_service_1.StripeService,
            messages_repository_1.MessagesRepository,
            signature_repository_1.SignatureRepository,
            autopost_repository_1.AutopostRepository,
            autopost_service_1.AutopostService,
            signature_service_1.SignatureService,
            media_service_1.MediaService,
            media_repository_1.MediaRepository,
            item_user_repository_1.ItemUserRepository,
            agencies_service_1.AgenciesService,
            agencies_repository_1.AgenciesRepository,
            item_user_service_1.ItemUserService,
            messages_service_1.MessagesService,
            integration_manager_1.IntegrationManager,
            extract_content_service_1.ExtractContentService,
            openai_service_1.OpenaiService,
            fal_service_1.FalService,
            email_service_1.EmailService,
            track_service_1.TrackService,
            short_link_service_1.ShortLinkService,
            sets_service_1.SetsService,
            sets_repository_1.SetsRepository,
            third_party_repository_1.ThirdPartyRepository,
            third_party_service_1.ThirdPartyService,
            video_manager_1.VideoManager,
        ],
        get exports() {
            return this.providers;
        },
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map