"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const add_message_1 = require("@gitroom/nestjs-libraries/dtos/messages/add.message");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
let MessagesController = class MessagesController {
    constructor(_messagesService) {
        this._messagesService = _messagesService;
    }
    getMessagesGroup(user, organization) {
        return this._messagesService.getMessagesGroup(user.id, organization.id);
    }
    getMessages(user, organization, groupId, page) {
        return this._messagesService.getMessages(user.id, organization.id, groupId, +page);
    }
    createMessage(user, organization, groupId, message) {
        return this._messagesService.createMessage(user.id, organization.id, groupId, message);
    }
};
exports.MessagesController = MessagesController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MessagesController.prototype, "getMessagesGroup", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:groupId/:page'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Param)('groupId')),
    tslib_1.__param(3, (0, common_1.Param)('page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], MessagesController.prototype, "getMessages", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:groupId'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Param)('groupId')),
    tslib_1.__param(3, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, add_message_1.AddMessageDto]),
    tslib_1.__metadata("design:returntype", void 0)
], MessagesController.prototype, "createMessage", null);
exports.MessagesController = MessagesController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, common_1.Controller)('/messages'),
    tslib_1.__metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map