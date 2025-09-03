"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
const tslib_1 = require("tslib");
const ability_1 = require("@casl/ability");
const common_1 = require("@nestjs/common");
const pricing_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const integration_service_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.service");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const webhooks_service_1 = require("@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.service");
const permission_exception_class_1 = require("./permission.exception.class");
let PermissionsService = class PermissionsService {
    constructor(_subscriptionService, _postsService, _integrationService, _webhooksService) {
        this._subscriptionService = _subscriptionService;
        this._postsService = _postsService;
        this._integrationService = _integrationService;
        this._webhooksService = _webhooksService;
    }
    async getPackageOptions(orgId) {
        const subscription = await this._subscriptionService.getSubscriptionByOrganizationId(orgId);
        const tier = (subscription === null || subscription === void 0 ? void 0 : subscription.subscriptionTier) ||
            (!process.env.STRIPE_PUBLISHABLE_KEY ? 'PRO' : 'FREE');
        const _a = pricing_1.pricing[tier], { channel } = _a, all = tslib_1.__rest(_a, ["channel"]);
        return {
            subscription,
            options: Object.assign(Object.assign({}, all), { channel: tier === 'FREE' ? channel : -10 }),
        };
    }
    async check(orgId, created_at, permission, requestedPermission) {
        var _a;
        const { can, build } = new ability_1.AbilityBuilder(ability_1.Ability);
        if (requestedPermission.length === 0 ||
            !process.env.STRIPE_PUBLISHABLE_KEY) {
            for (const [action, section] of requestedPermission) {
                can(action, section);
            }
            return build({
                detectSubjectType: (item) => item.constructor,
            });
        }
        const { subscription, options } = await this.getPackageOptions(orgId);
        for (const [action, section] of requestedPermission) {
            if (section === permission_exception_class_1.Sections.CHANNEL) {
                const totalChannels = (await this._integrationService.getIntegrationsList(orgId)).filter((f) => !f.refreshNeeded).length;
                if ((options.channel && options.channel > totalChannels) ||
                    ((subscription === null || subscription === void 0 ? void 0 : subscription.totalChannels) || 0) > totalChannels) {
                    can(action, section);
                    continue;
                }
            }
            if (section === permission_exception_class_1.Sections.WEBHOOKS) {
                const totalWebhooks = await this._webhooksService.getTotal(orgId);
                if (totalWebhooks < options.webhooks) {
                    can(permission_exception_class_1.AuthorizationActions.Create, section);
                    continue;
                }
            }
            if (section === permission_exception_class_1.Sections.POSTS_PER_MONTH) {
                const createdAt = ((_a = (await this._subscriptionService.getSubscription(orgId))) === null || _a === void 0 ? void 0 : _a.createdAt) ||
                    created_at;
                const totalMonthPast = Math.abs((0, dayjs_1.default)(createdAt).diff((0, dayjs_1.default)(), 'month'));
                const checkFrom = (0, dayjs_1.default)(createdAt).add(totalMonthPast, 'month');
                const count = await this._postsService.countPostsFromDay(orgId, checkFrom.toDate());
                if (count < options.posts_per_month) {
                    can(action, section);
                    continue;
                }
            }
            if (section === permission_exception_class_1.Sections.TEAM_MEMBERS && options.team_members) {
                can(action, section);
                continue;
            }
            if (section === permission_exception_class_1.Sections.ADMIN &&
                ['ADMIN', 'SUPERADMIN'].includes(permission)) {
                can(action, section);
                continue;
            }
            if (section === permission_exception_class_1.Sections.COMMUNITY_FEATURES &&
                options.community_features) {
                can(action, section);
                continue;
            }
            if (section === permission_exception_class_1.Sections.FEATURED_BY_GITROOM &&
                options.featured_by_gitroom) {
                can(action, section);
                continue;
            }
            if (section === permission_exception_class_1.Sections.AI && options.ai) {
                can(action, section);
                continue;
            }
            if (section === permission_exception_class_1.Sections.IMPORT_FROM_CHANNELS &&
                options.import_from_channels) {
                can(action, section);
            }
        }
        return build({
            detectSubjectType: (item) => item.constructor,
        });
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        posts_service_1.PostsService,
        integration_service_1.IntegrationService,
        webhooks_service_1.WebhooksService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map