"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const webhooks_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.repository");
const redis_service_1 = require("@gitroom/nestjs-libraries/redis/redis.service");
const client_1 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/client");
const posts_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.repository");
let WebhooksService = class WebhooksService {
    constructor(_webhooksRepository, _postsRepository, _workerServiceProducer) {
        this._webhooksRepository = _webhooksRepository;
        this._postsRepository = _postsRepository;
        this._workerServiceProducer = _workerServiceProducer;
    }
    getTotal(orgId) {
        return this._webhooksRepository.getTotal(orgId);
    }
    getWebhooks(orgId) {
        return this._webhooksRepository.getWebhooks(orgId);
    }
    createWebhook(orgId, body) {
        return this._webhooksRepository.createWebhook(orgId, body);
    }
    deleteWebhook(orgId, id) {
        return this._webhooksRepository.deleteWebhook(orgId, id);
    }
    async digestWebhooks(orgId, since) {
        const date = new Date().toISOString();
        await redis_service_1.ioRedis.watch('webhook_' + orgId);
        const value = await redis_service_1.ioRedis.get('webhook_' + orgId);
        if (value) {
            return;
        }
        await redis_service_1.ioRedis
            .multi()
            .set('webhook_' + orgId, date)
            .expire('webhook_' + orgId, 60)
            .exec();
        this._workerServiceProducer.emit('webhooks', {
            id: 'digest_' + orgId,
            options: {
                delay: 60000,
            },
            payload: {
                org: orgId,
                since,
            },
        });
    }
    async fireWebhooks(orgId, since) {
        const list = await this._postsRepository.getPostsSince(orgId, since);
        const webhooks = await this._webhooksRepository.getWebhooks(orgId);
        const sendList = [];
        for (const webhook of webhooks) {
            const toSend = [];
            if (webhook.integrations.length === 0) {
                toSend.push(...list);
            }
            else {
                toSend.push(...list.filter((post) => webhook.integrations.some((i) => i.integration.id === post.integration.id)));
            }
            if (toSend.length) {
                sendList.push({
                    url: webhook.url,
                    data: toSend,
                });
            }
        }
        return Promise.all(sendList.map(async (s) => {
            try {
                await fetch(s.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(s.data),
                });
            }
            catch (e) {
            }
        }));
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [webhooks_repository_1.WebhooksRepository,
        posts_repository_1.PostsRepository,
        client_1.BullMqClient])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map