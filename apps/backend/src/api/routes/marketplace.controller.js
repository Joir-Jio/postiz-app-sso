"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const item_user_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/item.user.service");
const add_remove_item_dto_1 = require("@gitroom/nestjs-libraries/dtos/marketplace/add.remove.item.dto");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const users_service_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.service");
const change_active_dto_1 = require("@gitroom/nestjs-libraries/dtos/marketplace/change.active.dto");
const items_dto_1 = require("@gitroom/nestjs-libraries/dtos/marketplace/items.dto");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const audience_dto_1 = require("@gitroom/nestjs-libraries/dtos/marketplace/audience.dto");
const new_conversation_dto_1 = require("@gitroom/nestjs-libraries/dtos/marketplace/new.conversation.dto");
const messages_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service");
const create_offer_dto_1 = require("@gitroom/nestjs-libraries/dtos/marketplace/create.offer.dto");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
let MarketplaceController = class MarketplaceController {
    constructor(_itemUserService, _stripeService, _userService, _messagesService, _postsService) {
        this._itemUserService = _itemUserService;
        this._stripeService = _stripeService;
        this._userService = _userService;
        this._messagesService = _messagesService;
        this._postsService = _postsService;
    }
    getInfluencers(organization, user, body) {
        return this._userService.getMarketplacePeople(organization.id, user.id, body);
    }
    createConversation(user, organization, body) {
        return this._messagesService.createConversation(user.id, organization.id, body);
    }
    connectBankAccount(user, country) {
        return this._stripeService.createAccountProcess(user.id, user.email, country);
    }
    async addItems(user, body) {
        return this._itemUserService.addOrRemoveItem(body.state, user.id, body.key);
    }
    async changeActive(user, body) {
        await this._userService.changeMarketplaceActive(user.id, body.active);
    }
    async changeAudience(user, body) {
        await this._userService.changeAudienceSize(user.id, body.audience);
    }
    async getItems(user) {
        return this._itemUserService.getItems(user.id);
    }
    async getOrders(user, organization, type) {
        return this._messagesService.getOrders(user.id, organization.id, type);
    }
    async getAccount(user) {
        const { account, marketplace, connectedAccount, name, picture, audience } = await this._userService.getUserByEmail(user.email);
        return {
            account,
            marketplace,
            connectedAccount,
            fullname: name,
            audience,
            picture,
        };
    }
    async createOffer(user, body) {
        return this._messagesService.createOffer(user.id, body);
    }
    async post(user, organization, id) {
        const getPost = await this._messagesService.getPost(user.id, organization.id, id);
        if (!getPost) {
            return;
        }
        return Object.assign(Object.assign({}, (await this._postsService.getPost(getPost.organizationId, id))), { providerId: getPost.integration.providerIdentifier });
    }
    async revision(user, organization, id, message) {
        return this._messagesService.requestRevision(user.id, organization.id, id, message);
    }
    async approve(user, organization, id, message) {
        return this._messagesService.requestApproved(user.id, organization.id, id, message);
    }
    async cancel(organization, id) {
        return this._messagesService.requestCancel(organization.id, id);
    }
    async completeOrder(organization, id) {
        const order = await this._messagesService.completeOrderAndPay(organization.id, id);
        if (!order) {
            return;
        }
        try {
            await this._stripeService.payout(id, order.charge, order.account, order.price);
        }
        catch (e) {
            await this._messagesService.payoutProblem(id, order.sellerId, order.price);
        }
        await this._messagesService.completeOrder(id);
    }
    async payOrder(user, organization, id) {
        const orderDetails = await this._messagesService.getOrderDetails(user.id, organization.id, id);
        const payment = await this._stripeService.payAccountStepOne(user.id, organization, orderDetails.seller, orderDetails.order.id, orderDetails.order.ordersItems.map((p) => ({
            quantity: p.quantity,
            integrationType: p.integration.providerIdentifier,
            price: p.price,
        })), orderDetails.order.messageGroupId);
        return payment;
    }
};
exports.MarketplaceController = MarketplaceController;
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, items_dto_1.ItemsDto]),
    tslib_1.__metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getInfluencers", null);
tslib_1.__decorate([
    (0, common_1.Post)('/conversation'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, new_conversation_dto_1.NewConversationDto]),
    tslib_1.__metadata("design:returntype", void 0)
], MarketplaceController.prototype, "createConversation", null);
tslib_1.__decorate([
    (0, common_1.Get)('/bank'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Query)('country')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], MarketplaceController.prototype, "connectBankAccount", null);
tslib_1.__decorate([
    (0, common_1.Post)('/item'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, add_remove_item_dto_1.AddRemoveItemDto]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "addItems", null);
tslib_1.__decorate([
    (0, common_1.Post)('/active'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, change_active_dto_1.ChangeActiveDto]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "changeActive", null);
tslib_1.__decorate([
    (0, common_1.Post)('/audience'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, audience_dto_1.AudienceDto]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "changeAudience", null);
tslib_1.__decorate([
    (0, common_1.Get)('/item'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getItems", null);
tslib_1.__decorate([
    (0, common_1.Get)('/orders'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Query)('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getOrders", null);
tslib_1.__decorate([
    (0, common_1.Get)('/account'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getAccount", null);
tslib_1.__decorate([
    (0, common_1.Post)('/offer'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, create_offer_dto_1.CreateOfferDto]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "createOffer", null);
tslib_1.__decorate([
    (0, common_1.Get)('/posts/:id'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "post", null);
tslib_1.__decorate([
    (0, common_1.Post)('/posts/:id/revision'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__param(3, (0, common_1.Body)('message')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "revision", null);
tslib_1.__decorate([
    (0, common_1.Post)('/posts/:id/approve'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__param(3, (0, common_1.Body)('message')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "approve", null);
tslib_1.__decorate([
    (0, common_1.Post)('/posts/:id/cancel'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "cancel", null);
tslib_1.__decorate([
    (0, common_1.Post)('/offer/:id/complete'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "completeOrder", null);
tslib_1.__decorate([
    (0, common_1.Post)('/orders/:id/payment'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketplaceController.prototype, "payOrder", null);
exports.MarketplaceController = MarketplaceController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Marketplace'),
    (0, common_1.Controller)('/marketplace'),
    tslib_1.__metadata("design:paramtypes", [item_user_service_1.ItemUserService,
        stripe_service_1.StripeService,
        users_service_1.UsersService,
        messages_service_1.MessagesService,
        posts_service_1.PostsService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map