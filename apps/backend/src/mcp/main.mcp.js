"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMcp = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mcp_tool_1 = require("@gitroom/nestjs-libraries/mcp/mcp.tool");
const integration_service_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.service");
const zod_1 = require("zod");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
let MainMcp = class MainMcp {
    constructor(_integrationService, _postsService, _openAiService) {
        this._integrationService = _integrationService;
        this._postsService = _postsService;
        this._openAiService = _openAiService;
    }
    async preRun() {
        return [
            {
                type: 'text',
                text: `id: ${(0, make_is_1.makeId)(10)} Today date is ${dayjs_1.default.utc().format()}`,
            },
        ];
    }
    async listOfProviders(organization) {
        const list = (await this._integrationService.getIntegrationsList(organization)).map((org) => ({
            id: org.id,
            name: org.name,
            identifier: org.providerIdentifier,
            picture: org.picture,
            disabled: org.disabled,
            profile: org.profile,
            customer: org.customer
                ? {
                    id: org.customer.id,
                    name: org.customer.name,
                }
                : undefined,
        }));
        return [{ type: 'text', text: JSON.stringify(list) }];
    }
    async schedulePost(organization, obj) {
        const create = await this._postsService.createPost(organization, {
            date: obj.date,
            type: obj.type,
            tags: [],
            shortLink: false,
            posts: [
                {
                    group: (0, make_is_1.makeId)(10),
                    value: await Promise.all(obj.posts.map(async (post) => ({
                        content: post.text,
                        id: (0, make_is_1.makeId)(10),
                        image: !obj.generatePictures
                            ? []
                            : [
                                {
                                    id: (0, make_is_1.makeId)(10),
                                    path: await this._openAiService.generateImage(post.text, true),
                                },
                            ],
                    }))),
                    settings: {
                        __type: 'any',
                    },
                    integration: {
                        id: obj.providerId,
                    },
                },
            ],
        });
        return [
            {
                type: 'text',
                text: `Post created successfully, check it here: ${process.env.FRONTEND_URL}/p/${create[0].postId}`,
            },
        ];
    }
};
exports.MainMcp = MainMcp;
tslib_1.__decorate([
    (0, mcp_tool_1.McpTool)({ toolName: 'POSTIZ_GET_CONFIG_ID' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MainMcp.prototype, "preRun", null);
tslib_1.__decorate([
    (0, mcp_tool_1.McpTool)({ toolName: 'POSTIZ_PROVIDERS_LIST' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MainMcp.prototype, "listOfProviders", null);
tslib_1.__decorate([
    (0, mcp_tool_1.McpTool)({
        toolName: 'POSTIZ_SCHEDULE_POST',
        zod: {
            type: (0, zod_1.enum)(['draft', 'scheduled']),
            configId: (0, zod_1.string)(),
            generatePictures: (0, zod_1.boolean)(),
            date: (0, zod_1.string)().describe('UTC TIME'),
            providerId: (0, zod_1.string)().describe('Use POSTIZ_PROVIDERS_LIST to get the id'),
            posts: (0, zod_1.array)((0, zod_1.object)({ text: (0, zod_1.string)(), images: (0, zod_1.array)((0, zod_1.string)()) })),
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MainMcp.prototype, "schedulePost", null);
exports.MainMcp = MainMcp = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [integration_service_1.IntegrationService,
        posts_service_1.PostsService,
        openai_service_1.OpenaiService])
], MainMcp);
//# sourceMappingURL=main.mcp.js.map