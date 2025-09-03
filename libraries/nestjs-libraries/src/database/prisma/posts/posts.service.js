"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const posts_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.repository");
const create_post_dto_1 = require("@gitroom/nestjs-libraries/dtos/posts/create.post.dto");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const integration_manager_1 = require("@gitroom/nestjs-libraries/integrations/integration.manager");
const client_1 = require("@prisma/client");
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const lodash_1 = require("lodash");
const messages_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const integration_service_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.service");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const client_2 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/client");
const timer_1 = require("@gitroom/helpers/utils/timer");
const utc_1 = tslib_1.__importDefault(require("dayjs/plugin/utc"));
const media_service_1 = require("@gitroom/nestjs-libraries/database/prisma/media/media.service");
const short_link_service_1 = require("@gitroom/nestjs-libraries/short-linking/short.link.service");
const webhooks_service_1 = require("@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.service");
const axios_1 = tslib_1.__importDefault(require("axios"));
const sharp_1 = tslib_1.__importDefault(require("sharp"));
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
const stream_1 = require("stream");
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
const strip_html_validation_1 = require("@gitroom/helpers/utils/strip.html.validation");
dayjs_1.default.extend(utc_1.default);
let PostsService = class PostsService {
    constructor(_postRepository, _workerServiceProducer, _integrationManager, _notificationService, _messagesService, _stripeService, _integrationService, _mediaService, _shortLinkService, _webhookService, openaiService) {
        this._postRepository = _postRepository;
        this._workerServiceProducer = _workerServiceProducer;
        this._integrationManager = _integrationManager;
        this._notificationService = _notificationService;
        this._messagesService = _messagesService;
        this._stripeService = _stripeService;
        this._integrationService = _integrationService;
        this._mediaService = _mediaService;
        this._shortLinkService = _shortLinkService;
        this._webhookService = _webhookService;
        this.openaiService = openaiService;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    checkPending15minutesBack() {
        return this._postRepository.checkPending15minutesBack();
    }
    searchForMissingThreeHoursPosts() {
        return this._postRepository.searchForMissingThreeHoursPosts();
    }
    async getStatistics(orgId, id) {
        const getPost = await this.getPostsRecursively(id, true, orgId, true);
        const content = getPost.map((p) => p.content);
        const shortLinksTracking = await this._shortLinkService.getStatistics(content);
        return {
            clicks: shortLinksTracking,
        };
    }
    async mapTypeToPost(body, organization, replaceDraft = false) {
        var _a;
        if (!((_a = body === null || body === void 0 ? void 0 : body.posts) === null || _a === void 0 ? void 0 : _a.every((p) => { var _a; return (_a = p === null || p === void 0 ? void 0 : p.integration) === null || _a === void 0 ? void 0 : _a.id; }))) {
            throw new common_1.BadRequestException('All posts must have an integration id');
        }
        const mappedValues = Object.assign(Object.assign({}, body), { type: replaceDraft ? 'schedule' : body.type, posts: await Promise.all(body.posts.map(async (post) => {
                const integration = await this._integrationService.getIntegrationById(organization, post.integration.id);
                if (!integration) {
                    throw new common_1.BadRequestException(`Integration with id ${post.integration.id} not found`);
                }
                return Object.assign(Object.assign({}, post), { settings: Object.assign(Object.assign({}, (post.settings || {})), { __type: integration.providerIdentifier }) });
            })) });
        const validationPipe = new common_1.ValidationPipe({
            skipMissingProperties: false,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        });
        return await validationPipe.transform(mappedValues, {
            type: 'body',
            metatype: create_post_dto_1.CreatePostDto,
        });
    }
    async getPostsRecursively(id, includeIntegration = false, orgId, isFirst) {
        var _a, _b, _c;
        const post = await this._postRepository.getPost(id, includeIntegration, orgId, isFirst);
        if (!post) {
            return [];
        }
        return [
            post,
            ...(((_a = post === null || post === void 0 ? void 0 : post.childrenPost) === null || _a === void 0 ? void 0 : _a.length)
                ? await this.getPostsRecursively((_c = (_b = post === null || post === void 0 ? void 0 : post.childrenPost) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id, false, orgId, false)
                : []),
        ];
    }
    async getPosts(orgId, query) {
        return this._postRepository.getPosts(orgId, query);
    }
    async updateMedia(id, imagesList, convertToJPEG = false) {
        try {
            let imageUpdateNeeded = false;
            const getImageList = await Promise.all((await Promise.all((imagesList || []).map(async (p) => {
                if (!p.path && p.id) {
                    imageUpdateNeeded = true;
                    return this._mediaService.getMediaById(p.id);
                }
                return p;
            })))
                .map((m) => {
                return Object.assign(Object.assign({}, m), { url: m.path.indexOf('http') === -1
                        ? process.env.FRONTEND_URL +
                            '/' +
                            process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY +
                            m.path
                        : m.path, type: 'image', path: m.path.indexOf('http') === -1
                        ? process.env.UPLOAD_DIRECTORY + m.path
                        : m.path });
            })
                .map(async (m) => {
                if (!convertToJPEG) {
                    return m;
                }
                if (m.path.indexOf('.png') > -1) {
                    imageUpdateNeeded = true;
                    const response = await axios_1.default.get(m.url, {
                        responseType: 'arraybuffer',
                    });
                    const imageBuffer = Buffer.from(response.data);
                    const buffer = await (0, sharp_1.default)(imageBuffer)
                        .jpeg({ quality: 100 })
                        .toBuffer();
                    const { path, originalname } = await this.storage.uploadFile({
                        buffer,
                        mimetype: 'image/jpeg',
                        size: buffer.length,
                        path: '',
                        fieldname: '',
                        destination: '',
                        stream: new stream_1.Readable(),
                        filename: '',
                        originalname: '',
                        encoding: '',
                    });
                    return Object.assign(Object.assign({}, m), { name: originalname, url: path.indexOf('http') === -1
                            ? process.env.FRONTEND_URL +
                                '/' +
                                process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY +
                                path
                            : path, type: 'image', path: path.indexOf('http') === -1
                            ? process.env.UPLOAD_DIRECTORY + path
                            : path });
                }
                return m;
            }));
            if (imageUpdateNeeded) {
                await this._postRepository.updateImages(id, JSON.stringify(getImageList));
            }
            return getImageList;
        }
        catch (err) {
            return imagesList;
        }
    }
    async getPost(orgId, id, convertToJPEG = false) {
        var _a, _b, _c;
        const posts = await this.getPostsRecursively(id, true, orgId, true);
        const list = {
            group: (_a = posts === null || posts === void 0 ? void 0 : posts[0]) === null || _a === void 0 ? void 0 : _a.group,
            posts: await Promise.all((posts || []).map(async (post) => (Object.assign(Object.assign({}, post), { image: await this.updateMedia(post.id, JSON.parse(post.image || '[]'), convertToJPEG) })))),
            integrationPicture: (_c = (_b = posts[0]) === null || _b === void 0 ? void 0 : _b.integration) === null || _c === void 0 ? void 0 : _c.picture,
            integration: posts[0].integrationId,
            settings: JSON.parse(posts[0].settings || '{}'),
        };
        return list;
    }
    async getOldPosts(orgId, date) {
        return this._postRepository.getOldPosts(orgId, date);
    }
    async post(id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        const allPosts = await this.getPostsRecursively(id, true);
        const [firstPost, ...morePosts] = allPosts;
        if (!firstPost) {
            return;
        }
        if ((_a = firstPost.integration) === null || _a === void 0 ? void 0 : _a.refreshNeeded) {
            await this._notificationService.inAppNotification(firstPost.organizationId, `We couldn't post to ${(_b = firstPost.integration) === null || _b === void 0 ? void 0 : _b.providerIdentifier} for ${(_c = firstPost === null || firstPost === void 0 ? void 0 : firstPost.integration) === null || _c === void 0 ? void 0 : _c.name}`, `We couldn't post to ${(_d = firstPost.integration) === null || _d === void 0 ? void 0 : _d.providerIdentifier} for ${(_e = firstPost === null || firstPost === void 0 ? void 0 : firstPost.integration) === null || _e === void 0 ? void 0 : _e.name} because you need to reconnect it. Please enable it and try again.`, true);
            return;
        }
        if ((_f = firstPost.integration) === null || _f === void 0 ? void 0 : _f.disabled) {
            await this._notificationService.inAppNotification(firstPost.organizationId, `We couldn't post to ${(_g = firstPost.integration) === null || _g === void 0 ? void 0 : _g.providerIdentifier} for ${(_h = firstPost === null || firstPost === void 0 ? void 0 : firstPost.integration) === null || _h === void 0 ? void 0 : _h.name}`, `We couldn't post to ${(_j = firstPost.integration) === null || _j === void 0 ? void 0 : _j.providerIdentifier} for ${(_k = firstPost === null || firstPost === void 0 ? void 0 : firstPost.integration) === null || _k === void 0 ? void 0 : _k.name} because it's disabled. Please enable it and try again.`, true);
            return;
        }
        try {
            const finalPost = await this.postSocial(firstPost.integration, [
                firstPost,
                ...morePosts,
            ]);
            if (firstPost === null || firstPost === void 0 ? void 0 : firstPost.intervalInDays) {
                this._workerServiceProducer.emit('post', {
                    id,
                    options: {
                        delay: firstPost.intervalInDays * 86400000,
                    },
                    payload: {
                        id: id,
                    },
                });
            }
            if (!(finalPost === null || finalPost === void 0 ? void 0 : finalPost.postId) || !(finalPost === null || finalPost === void 0 ? void 0 : finalPost.releaseURL)) {
                await this._postRepository.changeState(firstPost.id, 'ERROR');
                await this._notificationService.inAppNotification(firstPost.organizationId, `Error posting on ${(_l = firstPost.integration) === null || _l === void 0 ? void 0 : _l.providerIdentifier} for ${(_m = firstPost === null || firstPost === void 0 ? void 0 : firstPost.integration) === null || _m === void 0 ? void 0 : _m.name}`, `An error occurred while posting on ${(_o = firstPost.integration) === null || _o === void 0 ? void 0 : _o.providerIdentifier}`, true);
                return;
            }
        }
        catch (err) {
            await this._postRepository.changeState(firstPost.id, 'ERROR', err, allPosts);
            if (err instanceof social_abstract_1.BadBody) {
                await this._notificationService.inAppNotification(firstPost.organizationId, `Error posting on ${(_p = firstPost.integration) === null || _p === void 0 ? void 0 : _p.providerIdentifier} for ${(_q = firstPost === null || firstPost === void 0 ? void 0 : firstPost.integration) === null || _q === void 0 ? void 0 : _q.name}`, `An error occurred while posting on ${(_r = firstPost.integration) === null || _r === void 0 ? void 0 : _r.providerIdentifier}${(err === null || err === void 0 ? void 0 : err.message) ? `: ${err === null || err === void 0 ? void 0 : err.message}` : ``}`, true);
                console.error('[Error] posting on', (_s = firstPost.integration) === null || _s === void 0 ? void 0 : _s.providerIdentifier, err.identifier, err.json, err.body, err);
            }
            return;
        }
    }
    async updateTags(orgId, post) {
        const plainText = JSON.stringify(post);
        const extract = Array.from(plainText.match(/\(post:[a-zA-Z0-9-_]+\)/g) || []);
        if (!extract.length) {
            return post;
        }
        const ids = (extract || []).map((e) => e.replace('(post:', '').replace(')', ''));
        const urls = await this._postRepository.getPostUrls(orgId, ids);
        const newPlainText = ids.reduce((acc, value) => {
            var _a, _b;
            const findUrl = ((_b = (_a = urls === null || urls === void 0 ? void 0 : urls.find) === null || _a === void 0 ? void 0 : _a.call(urls, (u) => u.id === value)) === null || _b === void 0 ? void 0 : _b.releaseURL) || '';
            return acc.replace(new RegExp(`\\(post:${value}\\)`, 'g'), findUrl.split(',')[0]);
        }, plainText);
        return this.updateTags(orgId, JSON.parse(newPlainText));
    }
    async postSocial(integration, posts, forceRefresh = false) {
        const getIntegration = this._integrationManager.getSocialIntegration(integration.providerIdentifier);
        if (!getIntegration) {
            return {};
        }
        if ((0, dayjs_1.default)(integration === null || integration === void 0 ? void 0 : integration.tokenExpiration).isBefore((0, dayjs_1.default)()) || forceRefresh) {
            const { accessToken, expiresIn, refreshToken, additionalSettings } = await new Promise((res) => {
                getIntegration
                    .refreshToken(integration.refreshToken)
                    .then((r) => res(r))
                    .catch(() => res({
                    accessToken: '',
                    expiresIn: 0,
                    refreshToken: '',
                    id: '',
                    name: '',
                    username: '',
                    picture: '',
                    additionalSettings: undefined,
                }));
            });
            if (!accessToken) {
                await this._integrationService.refreshNeeded(integration.organizationId, integration.id);
                await this._integrationService.informAboutRefreshError(integration.organizationId, integration);
                return {};
            }
            await this._integrationService.createOrUpdateIntegration(additionalSettings, !!getIntegration.oneTimeToken, integration.organizationId, integration.name, integration.picture, 'social', integration.internalId, integration.providerIdentifier, accessToken, refreshToken, expiresIn);
            integration.token = accessToken;
            if (getIntegration.refreshWait) {
                await (0, timer_1.timer)(10000);
            }
        }
        const newPosts = await this.updateTags(integration.organizationId, posts);
        try {
            const publishedPosts = await getIntegration.post(integration.internalId, integration.token, await Promise.all((newPosts || []).map(async (p) => ({
                id: p.id,
                message: (0, strip_html_validation_1.stripHtmlValidation)(getIntegration.editor, p.content, true, false, !/<\/?[a-z][\s\S]*>/i.test(p.content), getIntegration.mentionFormat),
                settings: JSON.parse(p.settings || '{}'),
                media: await this.updateMedia(p.id, JSON.parse(p.image || '[]'), (getIntegration === null || getIntegration === void 0 ? void 0 : getIntegration.convertToJPEG) || false),
            }))), integration);
            for (const post of publishedPosts) {
                try {
                    await this._postRepository.updatePost(post.id, post.postId, post.releaseURL);
                }
                catch (err) { }
            }
            try {
                await this._notificationService.inAppNotification(integration.organizationId, `Your post has been published on ${(0, lodash_1.capitalize)(integration.providerIdentifier)}`, `Your post has been published on ${(0, lodash_1.capitalize)(integration.providerIdentifier)} at ${publishedPosts[0].releaseURL}`, true, true);
                await this._webhookService.digestWebhooks(integration.organizationId, (0, dayjs_1.default)(newPosts[0].publishDate).format('YYYY-MM-DDTHH:mm:00'));
                await this.checkPlugs(integration.organizationId, getIntegration.identifier, integration.id, publishedPosts[0].postId);
                await this.checkInternalPlug(integration, integration.organizationId, publishedPosts[0].postId, JSON.parse(newPosts[0].settings || '{}'));
            }
            catch (err) { }
            return {
                postId: publishedPosts[0].postId,
                releaseURL: publishedPosts[0].releaseURL,
            };
        }
        catch (err) {
            if (err instanceof social_abstract_1.RefreshToken) {
                return this.postSocial(integration, posts, true);
            }
            if (err instanceof social_abstract_1.BadBody) {
                throw err;
            }
            throw new social_abstract_1.BadBody(integration.providerIdentifier, JSON.stringify(err), {}, '');
        }
    }
    async checkInternalPlug(integration, orgId, id, settings) {
        const plugs = Object.entries(settings).filter(([key]) => {
            return key.indexOf('plug-') > -1;
        });
        if (plugs.length === 0) {
            return;
        }
        const parsePlugs = plugs.reduce((all, [key, value]) => {
            const [_, name, identifier] = key.split('--');
            all[name] = all[name] || { name };
            all[name][identifier] = value;
            return all;
        }, {});
        const list = Object.values(parsePlugs);
        for (const trigger of list || []) {
            for (const int of (trigger === null || trigger === void 0 ? void 0 : trigger.integrations) || []) {
                this._workerServiceProducer.emit('internal-plugs', {
                    id: 'plug_' + id + '_' + trigger.name + '_' + int.id,
                    options: {
                        delay: +trigger.delay,
                    },
                    payload: {
                        post: id,
                        originalIntegration: integration.id,
                        integration: int.id,
                        plugName: trigger.name,
                        orgId: orgId,
                        delay: +trigger.delay,
                        information: trigger,
                    },
                });
            }
        }
    }
    async checkPlugs(orgId, providerName, integrationId, postId) {
        var _a;
        const loadAllPlugs = this._integrationManager.getAllPlugs();
        const getPlugs = await this._integrationService.getPlugs(orgId, integrationId);
        const currentPlug = loadAllPlugs.find((p) => p.identifier === providerName);
        for (const plug of getPlugs) {
            const runPlug = (_a = currentPlug === null || currentPlug === void 0 ? void 0 : currentPlug.plugs) === null || _a === void 0 ? void 0 : _a.find((p) => p.methodName === plug.plugFunction);
            if (!runPlug) {
                continue;
            }
            this._workerServiceProducer.emit('plugs', {
                id: 'plug_' + postId + '_' + runPlug.identifier,
                options: {
                    delay: runPlug.runEveryMilliseconds,
                },
                payload: {
                    plugId: plug.id,
                    postId,
                    delay: runPlug.runEveryMilliseconds,
                    totalRuns: runPlug.totalRuns,
                    currentRun: 1,
                },
            });
        }
    }
    async deletePost(orgId, group) {
        const post = await this._postRepository.deletePost(orgId, group);
        if (post === null || post === void 0 ? void 0 : post.id) {
            await this._workerServiceProducer.delete('post', post.id);
            return { id: post.id };
        }
        return { error: true };
    }
    async countPostsFromDay(orgId, date) {
        return this._postRepository.countPostsFromDay(orgId, date);
    }
    async createPost(orgId, body) {
        var _a;
        const postList = [];
        for (const post of body.posts) {
            const messages = (post.value || []).map((p) => p.content);
            const updateContent = !body.shortLink
                ? messages
                : await this._shortLinkService.convertTextToShortLinks(orgId, messages);
            post.value = (post.value || []).map((p, i) => (Object.assign(Object.assign({}, p), { content: updateContent[i] })));
            const { previousPost, posts } = await this._postRepository.createOrUpdatePost(body.type, orgId, body.type === 'now'
                ? (0, dayjs_1.default)().format('YYYY-MM-DDTHH:mm:00')
                : body.date, post, body.tags, body.inter);
            if (!(posts === null || posts === void 0 ? void 0 : posts.length)) {
                return [];
            }
            await this._workerServiceProducer.delete('post', previousPost ? previousPost : (_a = posts === null || posts === void 0 ? void 0 : posts[0]) === null || _a === void 0 ? void 0 : _a.id);
            if (body.type === 'now' ||
                (body.type === 'schedule' && (0, dayjs_1.default)(body.date).isAfter((0, dayjs_1.default)()))) {
                this._workerServiceProducer.emit('post', {
                    id: posts[0].id,
                    options: {
                        delay: body.type === 'now'
                            ? 0
                            : (0, dayjs_1.default)(posts[0].publishDate).diff((0, dayjs_1.default)(), 'millisecond'),
                    },
                    payload: {
                        id: posts[0].id,
                        delay: body.type === 'now'
                            ? 0
                            : (0, dayjs_1.default)(posts[0].publishDate).diff((0, dayjs_1.default)(), 'millisecond'),
                    },
                });
            }
            postList.push({
                postId: posts[0].id,
                integration: post.integration.id,
            });
        }
        return postList;
    }
    async separatePosts(content, len) {
        return this.openaiService.separatePosts(content, len);
    }
    async changeDate(orgId, id, date) {
        const getPostById = await this._postRepository.getPostById(id, orgId);
        await this._workerServiceProducer.delete('post', id);
        if ((getPostById === null || getPostById === void 0 ? void 0 : getPostById.state) !== 'DRAFT') {
            this._workerServiceProducer.emit('post', {
                id: id,
                options: {
                    delay: (0, dayjs_1.default)(date).diff((0, dayjs_1.default)(), 'millisecond'),
                },
                payload: {
                    id: id,
                    delay: (0, dayjs_1.default)(date).diff((0, dayjs_1.default)(), 'millisecond'),
                },
            });
        }
        return this._postRepository.changeDate(orgId, id, date);
    }
    async payout(id, url) {
        const getPost = await this._postRepository.getPostById(id);
        if (!getPost || !getPost.submittedForOrder) {
            return;
        }
        const findPrice = getPost.submittedForOrder.ordersItems.find((orderItem) => orderItem.integrationId === getPost.integrationId);
        await this._messagesService.createNewMessage(getPost.submittedForOrder.messageGroupId, client_1.From.SELLER, '', {
            type: 'published',
            data: {
                id: getPost.submittedForOrder.id,
                postId: id,
                status: 'PUBLISHED',
                integrationId: getPost.integrationId,
                integration: getPost.integration.providerIdentifier,
                picture: getPost.integration.picture,
                name: getPost.integration.name,
                url,
            },
        });
        const totalItems = getPost.submittedForOrder.ordersItems.reduce((all, p) => all + p.quantity, 0);
        const totalPosts = getPost.submittedForOrder.posts.length;
        if (totalItems === totalPosts) {
            await this._messagesService.completeOrder(getPost.submittedForOrder.id);
            await this._messagesService.createNewMessage(getPost.submittedForOrder.messageGroupId, client_1.From.SELLER, '', {
                type: 'order-completed',
                data: {
                    id: getPost.submittedForOrder.id,
                    postId: id,
                    status: 'PUBLISHED',
                },
            });
        }
        try {
            await this._stripeService.payout(getPost.submittedForOrder.id, getPost.submittedForOrder.captureId, getPost.submittedForOrder.seller.account, findPrice.price);
            return this._notificationService.inAppNotification(getPost.integration.organizationId, 'Payout completed', `You have received a payout of $${findPrice.price}`, true);
        }
        catch (err) {
            await this._messagesService.payoutProblem(getPost.submittedForOrder.id, getPost.submittedForOrder.seller.id, findPrice.price, id);
        }
    }
    async generatePostsDraft(orgId, body) {
        const getAllIntegrations = (await this._integrationService.getIntegrationsList(orgId)).filter((f) => !f.disabled && f.providerIdentifier !== 'reddit');
        const allDates = (0, dayjs_1.default)()
            .isoWeek(body.week)
            .year(body.year)
            .startOf('isoWeek');
        const dates = [...new Array(7)].map((_, i) => {
            return allDates.add(i, 'day').format('YYYY-MM-DD');
        });
        const findTime = () => {
            const totalMinutes = Math.floor(Math.random() * 144) * 10;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const randomDate = (0, lodash_1.shuffle)(dates)[0] + 'T' + `${formattedHours}:${formattedMinutes}:00`;
            if ((0, dayjs_1.default)(randomDate).isBefore((0, dayjs_1.default)())) {
                return findTime();
            }
            return randomDate;
        };
        for (const integration of getAllIntegrations) {
            for (const toPost of body.posts) {
                const group = (0, make_is_1.makeId)(10);
                const randomDate = findTime();
                await this.createPost(orgId, {
                    type: 'draft',
                    date: randomDate,
                    order: '',
                    shortLink: false,
                    tags: [],
                    posts: [
                        {
                            group,
                            integration: {
                                id: integration.id,
                            },
                            settings: {
                                __type: integration.providerIdentifier,
                                title: '',
                                tags: [],
                                subreddit: [],
                            },
                            value: [
                                ...toPost.list.map((l) => ({
                                    id: '',
                                    content: l.post,
                                    image: [],
                                })),
                                {
                                    id: '',
                                    content: `Check out the full story here:\n${body.postId || body.url}`,
                                    image: [],
                                },
                            ],
                        },
                    ],
                });
            }
        }
    }
    findAllExistingCategories() {
        return this._postRepository.findAllExistingCategories();
    }
    findAllExistingTopicsOfCategory(category) {
        return this._postRepository.findAllExistingTopicsOfCategory(category);
    }
    findPopularPosts(category, topic) {
        return this._postRepository.findPopularPosts(category, topic);
    }
    async findFreeDateTime(orgId, integrationId) {
        const findTimes = await this._integrationService.findFreeDateTime(orgId, integrationId);
        return this.findFreeDateTimeRecursive(orgId, findTimes, dayjs_1.default.utc().startOf('day'));
    }
    async createPopularPosts(post) {
        return this._postRepository.createPopularPosts(post);
    }
    async findFreeDateTimeRecursive(orgId, times, date) {
        const list = await this._postRepository.getPostsCountsByDates(orgId, times, date);
        if (!list.length) {
            return this.findFreeDateTimeRecursive(orgId, times, date.add(1, 'day'));
        }
        const num = list.reduce((prev, curr) => {
            if (prev === null || prev > curr) {
                return curr;
            }
            return prev;
        }, null);
        return date.clone().add(num, 'minutes').format('YYYY-MM-DDTHH:mm:00');
    }
    getComments(postId) {
        return this._postRepository.getComments(postId);
    }
    getTags(orgId) {
        return this._postRepository.getTags(orgId);
    }
    createTag(orgId, body) {
        return this._postRepository.createTag(orgId, body);
    }
    editTag(id, orgId, body) {
        return this._postRepository.editTag(id, orgId, body);
    }
    createComment(orgId, userId, postId, comment) {
        return this._postRepository.createComment(orgId, userId, postId, comment);
    }
    async sendDigestEmail(subject, orgId, since) {
        const getNotificationsForOrgSince = await this._notificationService.getNotificationsSince(orgId, since);
        if (getNotificationsForOrgSince.length === 0) {
            return;
        }
        const message = getNotificationsForOrgSince
            .map((p) => p.content)
            .join('<br />');
        await this._notificationService.sendEmailsToOrg(orgId, getNotificationsForOrgSince.length === 1
            ? subject
            : '[Postiz] Your latest notifications', message);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [posts_repository_1.PostsRepository,
        client_2.BullMqClient,
        integration_manager_1.IntegrationManager,
        notification_service_1.NotificationService,
        messages_service_1.MessagesService,
        stripe_service_1.StripeService,
        integration_service_1.IntegrationService,
        media_service_1.MediaService,
        short_link_service_1.ShortLinkService,
        webhooks_service_1.WebhooksService,
        openai_service_1.OpenaiService])
], PostsService);
//# sourceMappingURL=posts.service.js.map