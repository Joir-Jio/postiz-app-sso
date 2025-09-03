"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopilotController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const runtime_1 = require("@copilotkit/runtime");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
let CopilotController = class CopilotController {
    constructor(_subscriptionService) {
        this._subscriptionService = _subscriptionService;
    }
    chat(req, res) {
        var _a, _b, _c, _d;
        if (process.env.OPENAI_API_KEY === undefined ||
            process.env.OPENAI_API_KEY === '') {
            common_1.Logger.warn('OpenAI API key not set, chat functionality will not work');
            return;
        }
        const copilotRuntimeHandler = (0, runtime_1.copilotRuntimeNestEndpoint)({
            endpoint: '/copilot/chat',
            runtime: new runtime_1.CopilotRuntime(),
            serviceAdapter: new runtime_1.OpenAIAdapter({
                model: ((_d = (_c = (_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.variables) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.metadata) === null || _d === void 0 ? void 0 : _d.requestType) ===
                    'TextareaCompletion'
                    ? 'gpt-4o-mini'
                    : 'gpt-4.1',
            }),
        });
        return copilotRuntimeHandler(req, res);
    }
    calculateCredits(organization, type) {
        return this._subscriptionService.checkCredits(organization, type || 'ai_images');
    }
};
exports.CopilotController = CopilotController;
tslib_1.__decorate([
    (0, common_1.Post)('/chat'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Request, Response]),
    tslib_1.__metadata("design:returntype", void 0)
], CopilotController.prototype, "chat", null);
tslib_1.__decorate([
    (0, common_1.Get)('/credits'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Query)('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], CopilotController.prototype, "calculateCredits", null);
exports.CopilotController = CopilotController = tslib_1.__decorate([
    (0, common_1.Controller)('/copilot'),
    tslib_1.__metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], CopilotController);
//# sourceMappingURL=copilot.controller.js.map