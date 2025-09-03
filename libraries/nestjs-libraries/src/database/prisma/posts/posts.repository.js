"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const isoWeek_1 = tslib_1.__importDefault(require("dayjs/plugin/isoWeek"));
const weekOfYear_1 = tslib_1.__importDefault(require("dayjs/plugin/weekOfYear"));
const isSameOrAfter_1 = tslib_1.__importDefault(require("dayjs/plugin/isSameOrAfter"));
const utc_1 = tslib_1.__importDefault(require("dayjs/plugin/utc"));
const uuid_1 = require("uuid");
dayjs_1.default.extend(isoWeek_1.default);
dayjs_1.default.extend(weekOfYear_1.default);
dayjs_1.default.extend(isSameOrAfter_1.default);
dayjs_1.default.extend(utc_1.default);
let PostsRepository = class PostsRepository {
    constructor(_post, _popularPosts, _comments, _tags, _tagsPosts, _errors) {
        this._post = _post;
        this._popularPosts = _popularPosts;
        this._comments = _comments;
        this._tags = _tags;
        this._tagsPosts = _tagsPosts;
        this._errors = _errors;
    }
    checkPending15minutesBack() {
        return this._post.model.post.findMany({
            where: {
                publishDate: {
                    lte: dayjs_1.default.utc().subtract(15, 'minute').toDate(),
                    gte: dayjs_1.default.utc().subtract(30, 'minute').toDate(),
                },
                state: 'QUEUE',
                deletedAt: null,
                parentPostId: null,
            },
            select: {
                id: true,
                publishDate: true,
            },
        });
    }
    searchForMissingThreeHoursPosts() {
        return this._post.model.post.findMany({
            where: {
                integration: {
                    refreshNeeded: false,
                    inBetweenSteps: false,
                    disabled: false,
                },
                publishDate: {
                    gte: dayjs_1.default.utc().toDate(),
                    lt: dayjs_1.default.utc().add(3, 'hour').toDate(),
                },
                state: 'QUEUE',
                deletedAt: null,
                parentPostId: null,
            },
            select: {
                id: true,
                publishDate: true,
            },
        });
    }
    getOldPosts(orgId, date) {
        return this._post.model.post.findMany({
            where: {
                integration: {
                    refreshNeeded: false,
                    inBetweenSteps: false,
                    disabled: false,
                },
                organizationId: orgId,
                publishDate: {
                    lte: (0, dayjs_1.default)(date).toDate(),
                },
                deletedAt: null,
                parentPostId: null,
            },
            orderBy: {
                publishDate: 'desc',
            },
            select: {
                id: true,
                content: true,
                publishDate: true,
                releaseURL: true,
                state: true,
                integration: {
                    select: {
                        id: true,
                        name: true,
                        providerIdentifier: true,
                        picture: true,
                        type: true,
                    },
                },
            },
        });
    }
    updateImages(id, images) {
        return this._post.model.post.update({
            where: {
                id,
            },
            data: {
                image: images,
            },
        });
    }
    getPostUrls(orgId, ids) {
        return this._post.model.post.findMany({
            where: {
                organizationId: orgId,
                id: {
                    in: ids,
                },
            },
            select: {
                id: true,
                releaseURL: true,
            },
        });
    }
    async getPosts(orgId, query) {
        const startDate = dayjs_1.default.utc(query.startDate).toDate();
        const endDate = dayjs_1.default.utc(query.endDate).toDate();
        const list = await this._post.model.post.findMany({
            where: Object.assign({ AND: [
                    {
                        OR: [
                            {
                                organizationId: orgId,
                            },
                            {
                                submittedForOrganizationId: orgId,
                            },
                        ],
                    },
                    {
                        OR: [
                            {
                                publishDate: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                            {
                                intervalInDays: {
                                    not: null,
                                },
                            },
                        ],
                    },
                ], deletedAt: null, parentPostId: null }, (query.customer
                ? {
                    integration: {
                        customerId: query.customer,
                    },
                }
                : {})),
            select: {
                id: true,
                content: true,
                publishDate: true,
                releaseURL: true,
                submittedForOrganizationId: true,
                submittedForOrderId: true,
                state: true,
                intervalInDays: true,
                group: true,
                tags: {
                    select: {
                        tag: true,
                    },
                },
                integration: {
                    select: {
                        id: true,
                        providerIdentifier: true,
                        name: true,
                        picture: true,
                    },
                },
            },
        });
        return list.reduce((all, post) => {
            if (!post.intervalInDays) {
                return [...all, post];
            }
            const addMorePosts = [];
            let startingDate = dayjs_1.default.utc(post.publishDate);
            while (dayjs_1.default.utc(endDate).isSameOrAfter(startingDate)) {
                if ((0, dayjs_1.default)(startingDate).isSameOrAfter(dayjs_1.default.utc(post.publishDate))) {
                    addMorePosts.push(Object.assign(Object.assign({}, post), { publishDate: startingDate.toDate(), actualDate: post.publishDate }));
                }
                startingDate = startingDate.add(post.intervalInDays, 'days');
            }
            return [...all, ...addMorePosts];
        }, []);
    }
    async deletePost(orgId, group) {
        await this._post.model.post.updateMany({
            where: {
                organizationId: orgId,
                group,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        return this._post.model.post.findFirst({
            where: {
                organizationId: orgId,
                group,
                parentPostId: null,
            },
            select: {
                id: true,
            },
        });
    }
    getPost(id, includeIntegration = false, orgId, isFirst) {
        return this._post.model.post.findUnique({
            where: Object.assign(Object.assign({ id }, (orgId ? { organizationId: orgId } : {})), { deletedAt: null }),
            include: Object.assign(Object.assign({}, (includeIntegration
                ? {
                    integration: true,
                    tags: {
                        select: {
                            tag: true,
                        },
                    },
                }
                : {})), { childrenPost: true }),
        });
    }
    updatePost(id, postId, releaseURL) {
        return this._post.model.post.update({
            where: {
                id,
            },
            data: {
                state: 'PUBLISHED',
                releaseURL,
                releaseId: postId,
            },
        });
    }
    async changeState(id, state, err, body) {
        const update = await this._post.model.post.update({
            where: {
                id,
            },
            data: Object.assign({ state }, (err
                ? { error: typeof err === 'string' ? err : JSON.stringify(err) }
                : {})),
            include: {
                integration: {
                    select: {
                        providerIdentifier: true,
                    },
                },
            },
        });
        if (state === 'ERROR' && err && body) {
            try {
                await this._errors.model.errors.create({
                    data: {
                        message: typeof err === 'string' ? err : JSON.stringify(err),
                        organizationId: update.organizationId,
                        platform: update.integration.providerIdentifier,
                        postId: update.id,
                        body: typeof body === 'string' ? body : JSON.stringify(body),
                    },
                });
            }
            catch (err) { }
        }
        return update;
    }
    async changeDate(orgId, id, date) {
        return this._post.model.post.update({
            where: {
                organizationId: orgId,
                id,
            },
            data: {
                publishDate: (0, dayjs_1.default)(date).toDate(),
            },
        });
    }
    countPostsFromDay(orgId, date) {
        return this._post.model.post.count({
            where: {
                organizationId: orgId,
                publishDate: {
                    gte: date,
                },
                OR: [
                    {
                        deletedAt: null,
                        state: {
                            in: ['QUEUE'],
                        },
                    },
                    {
                        state: 'PUBLISHED',
                    },
                ],
            },
        });
    }
    async createOrUpdatePost(state, orgId, date, body, tags, inter) {
        var _a;
        const posts = [];
        const uuid = (0, uuid_1.v4)();
        for (const value of body.value) {
            const updateData = (type) => {
                var _a, _b;
                return (Object.assign(Object.assign({ publishDate: (0, dayjs_1.default)(date).toDate(), integration: {
                        connect: {
                            id: body.integration.id,
                            organizationId: orgId,
                        },
                    } }, (((_a = posts === null || posts === void 0 ? void 0 : posts[posts.length - 1]) === null || _a === void 0 ? void 0 : _a.id)
                    ? {
                        parentPost: {
                            connect: {
                                id: (_b = posts[posts.length - 1]) === null || _b === void 0 ? void 0 : _b.id,
                            },
                        },
                    }
                    : type === 'update'
                        ? {
                            parentPost: {
                                disconnect: true,
                            },
                        }
                        : {})), { content: value.content, group: uuid, intervalInDays: inter ? +inter : null, approvedSubmitForOrder: client_1.APPROVED_SUBMIT_FOR_ORDER.NO, state: state === 'draft' ? 'DRAFT' : 'QUEUE', image: JSON.stringify(value.image), settings: JSON.stringify(body.settings), organization: {
                        connect: {
                            id: orgId,
                        },
                    } }));
            };
            posts.push(await this._post.model.post.upsert({
                where: {
                    id: value.id || (0, uuid_1.v4)(),
                },
                create: Object.assign({}, updateData('create')),
                update: Object.assign(Object.assign({}, updateData('update')), { lastMessage: {
                        disconnect: true,
                    }, submittedForOrder: {
                        disconnect: true,
                    } }),
            }));
            if (posts.length === 1) {
                await this._tagsPosts.model.tagsPosts.deleteMany({
                    where: {
                        post: {
                            id: posts[0].id,
                        },
                    },
                });
                if (tags.length) {
                    const tagsList = await this._tags.model.tags.findMany({
                        where: {
                            orgId: orgId,
                            name: {
                                in: tags.map((tag) => tag.label).filter((f) => f),
                            },
                        },
                    });
                    if (tagsList.length) {
                        await this._post.model.post.update({
                            where: {
                                id: posts[posts.length - 1].id,
                            },
                            data: {
                                tags: {
                                    createMany: {
                                        data: tagsList.map((tag) => ({
                                            tagId: tag.id,
                                        })),
                                    },
                                },
                            },
                        });
                    }
                }
            }
        }
        const previousPost = body.group
            ? (_a = (await this._post.model.post.findFirst({
                where: {
                    group: body.group,
                    deletedAt: null,
                    parentPostId: null,
                },
                select: {
                    id: true,
                },
            }))) === null || _a === void 0 ? void 0 : _a.id
            : undefined;
        if (body.group) {
            await this._post.model.post.updateMany({
                where: {
                    group: body.group,
                    deletedAt: null,
                },
                data: {
                    parentPostId: null,
                    deletedAt: new Date(),
                },
            });
        }
        return { previousPost, posts };
    }
    async submit(id, order, buyerOrganizationId) {
        return this._post.model.post.update({
            where: {
                id,
            },
            data: {
                submittedForOrderId: order,
                approvedSubmitForOrder: 'WAITING_CONFIRMATION',
                submittedForOrganizationId: buyerOrganizationId,
            },
            select: {
                id: true,
                description: true,
                submittedForOrder: {
                    select: {
                        messageGroupId: true,
                    },
                },
            },
        });
    }
    updateMessage(id, messageId) {
        return this._post.model.post.update({
            where: {
                id,
            },
            data: {
                lastMessageId: messageId,
            },
        });
    }
    getPostById(id, org) {
        return this._post.model.post.findUnique({
            where: Object.assign({ id }, (org ? { organizationId: org } : {})),
            include: {
                integration: true,
                submittedForOrder: {
                    include: {
                        posts: {
                            where: {
                                state: 'PUBLISHED',
                            },
                        },
                        ordersItems: true,
                        seller: {
                            select: {
                                id: true,
                                account: true,
                            },
                        },
                    },
                },
            },
        });
    }
    findAllExistingCategories() {
        return this._popularPosts.model.popularPosts.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
        });
    }
    findAllExistingTopicsOfCategory(category) {
        return this._popularPosts.model.popularPosts.findMany({
            where: {
                category,
            },
            select: {
                topic: true,
            },
            distinct: ['topic'],
        });
    }
    findPopularPosts(category, topic) {
        return this._popularPosts.model.popularPosts.findMany({
            where: Object.assign({ category }, (topic ? { topic } : {})),
            select: {
                content: true,
                hook: true,
            },
        });
    }
    createPopularPosts(post) {
        return this._popularPosts.model.popularPosts.create({
            data: {
                category: 'category',
                topic: 'topic',
                content: 'content',
                hook: 'hook',
            },
        });
    }
    async getPostsCountsByDates(orgId, times, date) {
        const dates = await this._post.model.post.findMany({
            where: {
                deletedAt: null,
                organizationId: orgId,
                publishDate: {
                    in: times.map((time) => {
                        return date.clone().add(time, 'minutes').toDate();
                    }),
                },
            },
        });
        return times.filter((time) => date.clone().add(time, 'minutes').isAfter(dayjs_1.default.utc()) &&
            !dates.find((dateFind) => {
                return (dayjs_1.default
                    .utc(dateFind.publishDate)
                    .diff(date.clone().startOf('day'), 'minutes') == time);
            }));
    }
    async getComments(postId) {
        return this._comments.model.comments.findMany({
            where: {
                postId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async getTags(orgId) {
        return this._tags.model.tags.findMany({
            where: {
                orgId,
            },
        });
    }
    createTag(orgId, body) {
        return this._tags.model.tags.create({
            data: {
                orgId,
                name: body.name,
                color: body.color,
            },
        });
    }
    editTag(id, orgId, body) {
        return this._tags.model.tags.update({
            where: {
                id,
            },
            data: {
                name: body.name,
                color: body.color,
            },
        });
    }
    createComment(orgId, userId, postId, content) {
        return this._comments.model.comments.create({
            data: {
                organizationId: orgId,
                userId,
                postId,
                content,
            },
        });
    }
    async getPostsSince(orgId, since) {
        return this._post.model.post.findMany({
            where: {
                organizationId: orgId,
                publishDate: {
                    gte: new Date(since),
                },
                deletedAt: null,
                parentPostId: null,
            },
            select: {
                id: true,
                content: true,
                publishDate: true,
                releaseURL: true,
                state: true,
                integration: {
                    select: {
                        id: true,
                        name: true,
                        providerIdentifier: true,
                        picture: true,
                        type: true,
                    },
                },
            },
        });
    }
};
exports.PostsRepository = PostsRepository;
exports.PostsRepository = PostsRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository])
], PostsRepository);
//# sourceMappingURL=posts.repository.js.map