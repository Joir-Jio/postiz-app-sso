"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationManager = exports.socialIntegrationList = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const x_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/x.provider");
const linkedin_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/linkedin.provider");
const reddit_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/reddit.provider");
const dev_to_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/dev.to.provider");
const hashnode_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/hashnode.provider");
const medium_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/medium.provider");
const facebook_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/facebook.provider");
const instagram_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/instagram.provider");
const youtube_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/youtube.provider");
const tiktok_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/tiktok.provider");
const pinterest_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/pinterest.provider");
const dribbble_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/dribbble.provider");
const linkedin_page_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/linkedin.page.provider");
const threads_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/threads.provider");
const discord_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/discord.provider");
const slack_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/slack.provider");
const mastodon_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/mastodon.provider");
const bluesky_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/bluesky.provider");
const lemmy_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/lemmy.provider");
const instagram_standalone_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/instagram.standalone.provider");
const farcaster_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/farcaster.provider");
const telegram_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/telegram.provider");
const nostr_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/nostr.provider");
const vk_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/vk.provider");
const wordpress_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/wordpress.provider");
exports.socialIntegrationList = [
    new x_provider_1.XProvider(),
    new linkedin_provider_1.LinkedinProvider(),
    new linkedin_page_provider_1.LinkedinPageProvider(),
    new reddit_provider_1.RedditProvider(),
    new instagram_provider_1.InstagramProvider(),
    new instagram_standalone_provider_1.InstagramStandaloneProvider(),
    new facebook_provider_1.FacebookProvider(),
    new threads_provider_1.ThreadsProvider(),
    new youtube_provider_1.YoutubeProvider(),
    new tiktok_provider_1.TiktokProvider(),
    new pinterest_provider_1.PinterestProvider(),
    new dribbble_provider_1.DribbbleProvider(),
    new discord_provider_1.DiscordProvider(),
    new slack_provider_1.SlackProvider(),
    new mastodon_provider_1.MastodonProvider(),
    new bluesky_provider_1.BlueskyProvider(),
    new lemmy_provider_1.LemmyProvider(),
    new farcaster_provider_1.FarcasterProvider(),
    new telegram_provider_1.TelegramProvider(),
    new nostr_provider_1.NostrProvider(),
    new vk_provider_1.VkProvider(),
    new medium_provider_1.MediumProvider(),
    new dev_to_provider_1.DevToProvider(),
    new hashnode_provider_1.HashnodeProvider(),
    new wordpress_provider_1.WordpressProvider(),
];
let IntegrationManager = class IntegrationManager {
    async getAllIntegrations() {
        return {
            social: await Promise.all(exports.socialIntegrationList.map(async (p) => (Object.assign({ name: p.name, identifier: p.identifier, toolTip: p.toolTip, editor: p.editor, isExternal: !!p.externalUrl, isWeb3: !!p.isWeb3 }, (p.customFields ? { customFields: await p.customFields() } : {}))))),
            article: [],
        };
    }
    getAllPlugs() {
        return exports.socialIntegrationList
            .map((p) => {
            return {
                name: p.name,
                identifier: p.identifier,
                plugs: (Reflect.getMetadata('custom:plug', p.constructor.prototype) || [])
                    .filter((f) => !f.disabled)
                    .map((p) => (Object.assign(Object.assign({}, p), { fields: p.fields.map((c) => {
                        var _a;
                        return (Object.assign(Object.assign({}, c), { validation: (_a = c === null || c === void 0 ? void 0 : c.validation) === null || _a === void 0 ? void 0 : _a.toString() }));
                    }) }))),
            };
        })
            .filter((f) => f.plugs.length);
    }
    getInternalPlugs(providerName) {
        const p = exports.socialIntegrationList.find((p) => p.identifier === providerName);
        return {
            internalPlugs: (Reflect.getMetadata('custom:internal_plug', p.constructor.prototype) || []).filter((f) => !f.disabled) || [],
        };
    }
    getAllowedSocialsIntegrations() {
        return exports.socialIntegrationList.map((p) => p.identifier);
    }
    getSocialIntegration(integration) {
        return exports.socialIntegrationList.find((i) => i.identifier === integration);
    }
};
exports.IntegrationManager = IntegrationManager;
exports.IntegrationManager = IntegrationManager = tslib_1.__decorate([
    (0, common_1.Injectable)()
], IntegrationManager);
//# sourceMappingURL=integration.manager.js.map