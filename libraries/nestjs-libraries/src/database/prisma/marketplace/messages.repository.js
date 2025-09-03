"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let MessagesRepository = class MessagesRepository {
    constructor(_messagesGroup, _messages, _orders, _organizations, _post, _payoutProblems, _users) {
        this._messagesGroup = _messagesGroup;
        this._messages = _messages;
        this._orders = _orders;
        this._organizations = _organizations;
        this._post = _post;
        this._payoutProblems = _payoutProblems;
        this._users = _users;
    }
    async createConversation(userId, organizationId, body) {
        const { id } = (await this._messagesGroup.model.messagesGroup.findFirst({
            where: {
                buyerOrganizationId: organizationId,
                buyerId: userId,
                sellerId: body.to,
            },
        })) ||
            (await this._messagesGroup.model.messagesGroup.create({
                data: {
                    buyerOrganizationId: organizationId,
                    buyerId: userId,
                    sellerId: body.to,
                },
            }));
        await this._messagesGroup.model.messagesGroup.update({
            where: {
                id,
            },
            data: {
                updatedAt: new Date(),
            },
        });
        await this._messages.model.messages.create({
            data: {
                groupId: id,
                from: client_1.From.BUYER,
                content: body.message,
            },
        });
        return { id };
    }
    getOrgByOrder(orderId) {
        return this._orders.model.orders.findFirst({
            where: {
                id: orderId,
            },
            select: {
                messageGroup: {
                    select: {
                        buyerOrganizationId: true,
                    },
                },
            },
        });
    }
    async getMessagesGroup(userId, organizationId) {
        return this._messagesGroup.model.messagesGroup.findMany({
            where: {
                OR: [
                    {
                        buyerOrganizationId: organizationId,
                        buyerId: userId,
                    },
                    {
                        sellerId: userId,
                    },
                ],
            },
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        picture: {
                            select: {
                                id: true,
                                path: true,
                            },
                        },
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        picture: {
                            select: {
                                id: true,
                                path: true,
                            },
                        },
                    },
                },
                orders: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });
    }
    async createMessage(userId, orgId, groupId, body) {
        const group = await this._messagesGroup.model.messagesGroup.findFirst({
            where: {
                id: groupId,
                OR: [
                    {
                        buyerOrganizationId: orgId,
                        buyerId: userId,
                    },
                    {
                        sellerId: userId,
                    },
                ],
            },
        });
        if (!group) {
            throw new Error('Group not found');
        }
        const create = await this.createNewMessage(groupId, group.buyerId === userId ? client_1.From.BUYER : client_1.From.SELLER, body.message);
        await this._messagesGroup.model.messagesGroup.update({
            where: {
                id: groupId,
            },
            data: {
                updatedAt: new Date(),
            },
        });
        if (userId === group.buyerId) {
            return create.group.seller;
        }
        return create.group.buyer;
    }
    async updateOrderOnline(userId) {
        await this._users.model.user.update({
            where: {
                id: userId,
            },
            data: {
                lastOnline: new Date(),
            },
        });
    }
    async getMessages(userId, organizationId, groupId, page) {
        return this._messagesGroup.model.messagesGroup.findFirst({
            where: {
                id: groupId,
                OR: [
                    {
                        buyerOrganizationId: organizationId,
                        buyerId: userId,
                    },
                    {
                        sellerId: userId,
                    },
                ],
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10,
                    skip: (page - 1) * 10,
                },
            },
        });
    }
    async createOffer(userId, body) {
        const messageGroup = await this._messagesGroup.model.messagesGroup.findFirst({
            where: {
                id: body.group,
                sellerId: userId,
            },
            select: {
                id: true,
                buyer: {
                    select: {
                        id: true,
                    },
                },
                orders: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });
        if (!(messageGroup === null || messageGroup === void 0 ? void 0 : messageGroup.id)) {
            throw new Error('Group not found');
        }
        if (messageGroup.orders.length &&
            messageGroup.orders[0].status !== 'COMPLETED' &&
            messageGroup.orders[0].status !== 'CANCELED') {
            throw new Error('Order already exists');
        }
        const data = await this._orders.model.orders.create({
            data: {
                sellerId: userId,
                buyerId: messageGroup.buyer.id,
                messageGroupId: messageGroup.id,
                ordersItems: {
                    createMany: {
                        data: body.socialMedia.map((item) => ({
                            quantity: item.total,
                            integrationId: item.value,
                            price: item.price,
                        })),
                    },
                },
                status: 'PENDING',
            },
            select: {
                id: true,
                ordersItems: {
                    select: {
                        quantity: true,
                        price: true,
                        integration: {
                            select: {
                                name: true,
                                providerIdentifier: true,
                                picture: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        await this._messages.model.messages.create({
            data: {
                groupId: body.group,
                from: client_1.From.SELLER,
                content: '',
                special: JSON.stringify({ type: 'offer', data: data }),
            },
        });
        return { success: true };
    }
    async createNewMessage(group, from, content, special) {
        return this._messages.model.messages.create({
            data: {
                groupId: group,
                from,
                content,
                special: JSON.stringify(special),
            },
            select: {
                id: true,
                group: {
                    select: {
                        buyer: {
                            select: {
                                lastOnline: true,
                                id: true,
                                organizations: true,
                            },
                        },
                        seller: {
                            select: {
                                lastOnline: true,
                                id: true,
                                organizations: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getOrderDetails(userId, organizationId, orderId) {
        var _a;
        const order = await this._messagesGroup.model.messagesGroup.findFirst({
            where: {
                buyerId: userId,
                buyerOrganizationId: organizationId,
            },
            select: {
                buyer: true,
                seller: true,
                orders: {
                    include: {
                        ordersItems: {
                            select: {
                                quantity: true,
                                integration: true,
                                price: true,
                            },
                        },
                    },
                    where: {
                        id: orderId,
                        status: 'PENDING',
                    },
                },
            },
        });
        if (!((_a = order === null || order === void 0 ? void 0 : order.orders[0]) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new Error('Order not found');
        }
        return {
            buyer: order.buyer,
            seller: order.seller,
            order: order.orders[0],
        };
    }
    async canAddPost(id, order, integrationId) {
        const findOrder = await this._orders.model.orders.findFirst({
            where: {
                id: order,
                status: 'ACCEPTED',
            },
            select: {
                posts: true,
                ordersItems: true,
            },
        });
        if (!findOrder) {
            return false;
        }
        if (findOrder.posts.find((p) => p.id === id && p.approvedSubmitForOrder === 'YES')) {
            return false;
        }
        if (findOrder.posts.find((p) => p.id === id && p.approvedSubmitForOrder === 'WAITING_CONFIRMATION')) {
            return true;
        }
        const postsForIntegration = findOrder.ordersItems.filter((p) => p.integrationId === integrationId);
        const totalPostsRequired = postsForIntegration.reduce((acc, item) => acc + item.quantity, 0);
        const usedPosts = findOrder.posts.filter((p) => p.integrationId === integrationId &&
            ['WAITING_CONFIRMATION', 'YES'].indexOf(p.approvedSubmitForOrder) > -1).length;
        return totalPostsRequired > usedPosts;
    }
    changeOrderStatus(orderId, status, paymentIntent) {
        return this._orders.model.orders.update({
            where: {
                id: orderId,
            },
            data: {
                status,
                captureId: paymentIntent,
            },
        });
    }
    async getMarketplaceAvailableOffers(orgId, id) {
        const offers = await this._organizations.model.organization.findFirst({
            where: {
                id: orgId,
            },
            select: {
                users: {
                    select: {
                        user: {
                            select: {
                                orderSeller: {
                                    where: {
                                        status: 'ACCEPTED',
                                    },
                                    select: {
                                        id: true,
                                        posts: {
                                            where: {
                                                deletedAt: null,
                                            },
                                            select: {
                                                id: true,
                                                integrationId: true,
                                                approvedSubmitForOrder: true,
                                            },
                                        },
                                        messageGroup: {
                                            select: {
                                                buyerOrganizationId: true,
                                            },
                                        },
                                        buyer: {
                                            select: {
                                                id: true,
                                                name: true,
                                                picture: {
                                                    select: {
                                                        id: true,
                                                        path: true,
                                                    },
                                                },
                                            },
                                        },
                                        ordersItems: {
                                            select: {
                                                quantity: true,
                                                integration: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        providerIdentifier: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const allOrders = (offers === null || offers === void 0 ? void 0 : offers.users.flatMap((user) => user.user.orderSeller)) || [];
        const onlyValidItems = allOrders.filter((order) => (order.posts.find((p) => p.id === id)
            ? 0
            : order.posts.filter((f) => f.approvedSubmitForOrder !== 'NO')
                .length) <
            order.ordersItems.reduce((acc, item) => acc + item.quantity, 0));
        return onlyValidItems
            .map((order) => {
            const postsNumbers = order.posts
                .filter((p) => ['WAITING_CONFIRMATION', 'YES'].indexOf(p.approvedSubmitForOrder) > -1)
                .reduce((acc, post) => {
                acc[post.integrationId] = acc[post.integrationId] + 1 || 1;
                return acc;
            }, {});
            const missing = order.ordersItems.map((item) => {
                return {
                    integration: item,
                    missing: item.quantity - (postsNumbers[item.integration.id] || 0),
                };
            });
            return {
                id: order.id,
                usedIds: order.posts.map((p) => ({
                    id: p.id,
                    status: p.approvedSubmitForOrder,
                })),
                buyer: order.buyer,
                missing,
            };
        })
            .filter((f) => f.missing.length);
    }
    async requestRevision(userId, orgId, postId, message) {
        const loadMessage = await this._messages.model.messages.findFirst({
            where: {
                id: message,
                group: {
                    buyerOrganizationId: orgId,
                },
            },
            select: {
                id: true,
                special: true,
            },
        });
        const post = await this._post.model.post.findFirst({
            where: {
                id: postId,
                approvedSubmitForOrder: 'WAITING_CONFIRMATION',
                deletedAt: null,
            },
        });
        if (post && loadMessage) {
            const special = JSON.parse(loadMessage.special);
            special.data.status = 'REVISION';
            await this._messages.model.messages.update({
                where: {
                    id: message,
                },
                data: {
                    special: JSON.stringify(special),
                },
            });
            await this._post.model.post.update({
                where: {
                    id: postId,
                    deletedAt: null,
                },
                data: {
                    approvedSubmitForOrder: 'NO',
                },
            });
        }
    }
    async requestCancel(orgId, postId) {
        const getPost = await this._post.model.post.findFirst({
            where: {
                id: postId,
                organizationId: orgId,
                approvedSubmitForOrder: {
                    in: ['WAITING_CONFIRMATION', 'YES'],
                },
            },
            select: {
                lastMessage: true,
            },
        });
        if (!getPost) {
            throw new Error('Post not found');
        }
        await this._post.model.post.update({
            where: {
                id: postId,
            },
            data: {
                approvedSubmitForOrder: 'NO',
                submittedForOrganizationId: null,
            },
        });
        const special = JSON.parse(getPost.lastMessage.special);
        special.data.status = 'CANCELED';
        await this._messages.model.messages.update({
            where: {
                id: getPost.lastMessage.id,
            },
            data: {
                special: JSON.stringify(special),
            },
        });
    }
    async requestApproved(userId, orgId, postId, message) {
        const loadMessage = await this._messages.model.messages.findFirst({
            where: {
                id: message,
                group: {
                    buyerOrganizationId: orgId,
                },
            },
            select: {
                id: true,
                special: true,
            },
        });
        const post = await this._post.model.post.findFirst({
            where: {
                id: postId,
                approvedSubmitForOrder: 'WAITING_CONFIRMATION',
                deletedAt: null,
            },
        });
        if (post && loadMessage) {
            const special = JSON.parse(loadMessage.special);
            special.data.status = 'APPROVED';
            await this._messages.model.messages.update({
                where: {
                    id: message,
                },
                data: {
                    special: JSON.stringify(special),
                },
            });
            await this._post.model.post.update({
                where: {
                    id: postId,
                    deletedAt: null,
                },
                data: {
                    approvedSubmitForOrder: 'YES',
                },
            });
            return post;
        }
        return false;
    }
    completeOrder(orderId) {
        return this._orders.model.orders.update({
            where: {
                id: orderId,
            },
            data: {
                status: 'COMPLETED',
            },
        });
    }
    async completeOrderAndPay(orgId, order) {
        const findOrder = await this._orders.model.orders.findFirst({
            where: {
                id: order,
                messageGroup: {
                    buyerOrganizationId: orgId,
                },
            },
            select: {
                captureId: true,
                seller: {
                    select: {
                        account: true,
                        id: true,
                    },
                },
                ordersItems: true,
                posts: true,
            },
        });
        if (!findOrder) {
            return false;
        }
        const releasedPosts = findOrder.posts.filter((p) => p.releaseURL);
        const nonReleasedPosts = findOrder.posts.filter((p) => !p.releaseURL);
        const totalPosts = releasedPosts.reduce((acc, item) => {
            acc[item.integrationId] = (acc[item.integrationId] || 0) + 1;
            return acc;
        }, {});
        const totalOrderItems = findOrder.ordersItems.reduce((acc, item) => {
            acc[item.integrationId] = (acc[item.integrationId] || 0) + item.quantity;
            return acc;
        }, {});
        const calculate = Object.keys(totalOrderItems).reduce((acc, key) => {
            acc.push({
                price: findOrder.ordersItems.find((p) => p.integrationId === key)
                    .price,
                quantity: totalOrderItems[key] - (totalPosts[key] || 0),
            });
            return acc;
        }, []);
        const price = calculate.reduce((acc, item) => {
            acc += item.price * item.quantity;
            return acc;
        }, 0);
        return {
            price,
            account: findOrder.seller.account,
            charge: findOrder.captureId,
            posts: nonReleasedPosts,
            sellerId: findOrder.seller.id,
        };
    }
    payoutProblem(orderId, sellerId, amount, postId) {
        return this._payoutProblems.model.payoutProblems.create({
            data: Object.assign(Object.assign({ amount,
                orderId }, (postId ? { postId } : {})), { userId: sellerId, status: 'PAYMENT_ERROR' }),
        });
    }
    async getOrders(userId, orgId, type) {
        const orders = await this._orders.model.orders.findMany({
            where: Object.assign({ status: {
                    in: ['ACCEPTED', 'PENDING', 'COMPLETED'],
                } }, (type === 'seller'
                ? {
                    sellerId: userId,
                }
                : {
                    messageGroup: {
                        buyerOrganizationId: orgId,
                    },
                })),
            orderBy: {
                updatedAt: 'desc',
            },
            select: Object.assign(Object.assign({ id: true, status: true }, (type === 'seller'
                ? {
                    buyer: {
                        select: {
                            name: true,
                        },
                    },
                }
                : {
                    seller: {
                        select: {
                            name: true,
                        },
                    },
                })), { ordersItems: {
                    select: {
                        id: true,
                        quantity: true,
                        price: true,
                        integration: {
                            select: {
                                id: true,
                                picture: true,
                                name: true,
                                providerIdentifier: true,
                            },
                        },
                    },
                }, posts: {
                    select: {
                        id: true,
                        integrationId: true,
                        releaseURL: true,
                        approvedSubmitForOrder: true,
                        state: true,
                    },
                } }),
        });
        return {
            orders: await Promise.all(orders.map(async (order) => {
                var _a, _b;
                return {
                    id: order.id,
                    status: order.status,
                    name: type === 'seller' ? (_a = order === null || order === void 0 ? void 0 : order.buyer) === null || _a === void 0 ? void 0 : _a.name : (_b = order === null || order === void 0 ? void 0 : order.seller) === null || _b === void 0 ? void 0 : _b.name,
                    price: order.ordersItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                    details: await Promise.all(order.ordersItems.map((item) => {
                        return {
                            posted: order.posts.filter((p) => p.releaseURL && p.integrationId === item.integration.id).length,
                            submitted: order.posts.filter((p) => !p.releaseURL &&
                                (p.approvedSubmitForOrder === 'WAITING_CONFIRMATION' ||
                                    p.approvedSubmitForOrder === 'YES') &&
                                p.integrationId === item.integration.id).length,
                            integration: item.integration,
                            total: item.quantity,
                            price: item.price,
                        };
                    })),
                };
            })),
        };
    }
    getPost(userId, orgId, postId) {
        return this._post.model.post.findFirst({
            where: {
                id: postId,
                submittedForOrder: {
                    messageGroup: {
                        OR: [{ sellerId: userId }, { buyerOrganizationId: orgId }],
                    },
                },
            },
            select: {
                organizationId: true,
                integration: {
                    select: {
                        providerIdentifier: true,
                    },
                },
            },
        });
    }
};
exports.MessagesRepository = MessagesRepository;
exports.MessagesRepository = MessagesRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository])
], MessagesRepository);
//# sourceMappingURL=messages.repository.js.map