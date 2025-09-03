"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const get_posts_dto_1 = require("@gitroom/nestjs-libraries/dtos/posts/get.posts.dto");
const stars_service_1 = require("@gitroom/nestjs-libraries/database/prisma/stars/stars.service");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const swagger_1 = require("@nestjs/swagger");
const messages_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service");
const generator_dto_1 = require("@gitroom/nestjs-libraries/dtos/generator/generator.dto");
const create_generated_posts_dto_1 = require("@gitroom/nestjs-libraries/dtos/generator/create.generated.posts.dto");
const agent_graph_service_1 = require("@gitroom/nestjs-libraries/agent/agent.graph.service");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const short_link_service_1 = require("@gitroom/nestjs-libraries/short-linking/short.link.service");
const create_tag_dto_1 = require("@gitroom/nestjs-libraries/dtos/posts/create.tag.dto");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
let PostsController = class PostsController {
    constructor(_postsService, _starsService, _messagesService, _agentGraphService, _shortLinkService) {
        this._postsService = _postsService;
        this._starsService = _starsService;
        this._messagesService = _messagesService;
        this._agentGraphService = _agentGraphService;
        this._shortLinkService = _shortLinkService;
    }
    async getStatistics(org, id) {
        return this._postsService.getStatistics(org.id, id);
    }
    async shouldShortlink(body) {
        return { ask: this._shortLinkService.askShortLinkedin(body.messages) };
    }
    async getMarketplacePosts(org, id) {
        return this._messagesService.getMarketplaceAvailableOffers(org.id, id);
    }
    async createComment(org, user, id, body) {
        return this._postsService.createComment(org.id, user.id, id, body.comment);
    }
    async getTags(org) {
        return { tags: await this._postsService.getTags(org.id) };
    }
    async createTag(org, body) {
        return this._postsService.createTag(org.id, body);
    }
    async editTag(org, body, id) {
        return this._postsService.editTag(id, org.id, body);
    }
    async getPosts(org, query) {
        const posts = await this._postsService.getPosts(org.id, query);
        return {
            posts,
        };
    }
    async findSlot(org) {
        return { date: await this._postsService.findFreeDateTime(org.id) };
    }
    async findSlotIntegration(org, id) {
        return { date: await this._postsService.findFreeDateTime(org.id, id) };
    }
    predictTrending() {
        return this._starsService.predictTrending();
    }
    oldPosts(org, date) {
        return this._postsService.getOldPosts(org.id, date);
    }
    getPost(org, id) {
        return this._postsService.getPost(org.id, id);
    }
    async createPost(org, rawBody) {
        console.log(JSON.stringify(rawBody, null, 2));
        const body = await this._postsService.mapTypeToPost(rawBody, org.id);
        return this._postsService.createPost(org.id, body);
    }
    generatePostsDraft(org, body) {
        return this._postsService.generatePostsDraft(org.id, body);
    }
    async generatePosts(org, body, res) {
        var _a, e_1, _b, _c;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        try {
            for (var _d = true, _e = tslib_1.__asyncValues(this._agentGraphService.start(org.id, body)), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const event = _c;
                res.write(JSON.stringify(event) + '\n');
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.end();
    }
    deletePost(org, group) {
        return this._postsService.deletePost(org.id, group);
    }
    changeDate(org, id, date) {
        return this._postsService.changeDate(org.id, id, date);
    }
    async separatePosts(org, body) {
        return this._postsService.separatePosts(body.content, body.len);
    }
};
exports.PostsController = PostsController;
tslib_1.__decorate([
    (0, common_1.Get)('/:id/statistics'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "getStatistics", null);
tslib_1.__decorate([
    (0, common_1.Post)('/should-shortlink'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "shouldShortlink", null);
tslib_1.__decorate([
    (0, common_1.Get)('/marketplace/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "getMarketplacePosts", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:id/comments'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__param(3, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "createComment", null);
tslib_1.__decorate([
    (0, common_1.Get)('/tags'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "getTags", null);
tslib_1.__decorate([
    (0, common_1.Post)('/tags'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, create_tag_dto_1.CreateTagDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "createTag", null);
tslib_1.__decorate([
    (0, common_1.Put)('/tags/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, create_tag_dto_1.CreateTagDto, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "editTag", null);
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, get_posts_dto_1.GetPostsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "getPosts", null);
tslib_1.__decorate([
    (0, common_1.Get)('/find-slot'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "findSlot", null);
tslib_1.__decorate([
    (0, common_1.Get)('/find-slot/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "findSlotIntegration", null);
tslib_1.__decorate([
    (0, common_1.Get)('/predict-trending'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], PostsController.prototype, "predictTrending", null);
tslib_1.__decorate([
    (0, common_1.Get)('/old'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Query)('date')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], PostsController.prototype, "oldPosts", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], PostsController.prototype, "getPost", null);
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.POSTS_PER_MONTH]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
tslib_1.__decorate([
    (0, common_1.Post)('/generator/draft'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.POSTS_PER_MONTH]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, create_generated_posts_dto_1.CreateGeneratedPostsDto]),
    tslib_1.__metadata("design:returntype", void 0)
], PostsController.prototype, "generatePostsDraft", null);
tslib_1.__decorate([
    (0, common_1.Post)('/generator'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.POSTS_PER_MONTH]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Res)({ passthrough: false })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, generator_dto_1.GeneratorDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "generatePosts", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:group'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('group')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], PostsController.prototype, "deletePost", null);
tslib_1.__decorate([
    (0, common_1.Put)('/:id/date'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)('date')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], PostsController.prototype, "changeDate", null);
tslib_1.__decorate([
    (0, common_1.Post)('/separate-posts'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PostsController.prototype, "separatePosts", null);
exports.PostsController = PostsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, common_1.Controller)('/posts'),
    tslib_1.__metadata("design:paramtypes", [posts_service_1.PostsService,
        stars_service_1.StarsService,
        messages_service_1.MessagesService,
        agent_graph_service_1.AgentGraphService,
        short_link_service_1.ShortLinkService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map