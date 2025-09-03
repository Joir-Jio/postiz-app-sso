"use strict";
var AgentGraphInsertService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentGraphInsertService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const messages_1 = require("@langchain/core/messages");
const langgraph_1 = require("@langchain/langgraph");
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const agent_categories_1 = require("@gitroom/nestjs-libraries/agent/agent.categories");
const zod_1 = require("zod");
const agent_topics_1 = require("@gitroom/nestjs-libraries/agent/agent.topics");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const model = new openai_1.ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-proj-',
    model: 'gpt-4o-2024-08-06',
    temperature: 0,
});
const category = zod_1.z.object({
    category: zod_1.z.string().describe('The category for the post'),
});
const topic = zod_1.z.object({
    topic: zod_1.z.string().describe('The topic of the post'),
});
const hook = zod_1.z.object({
    hook: zod_1.z.string().describe('The hook of the post'),
});
let AgentGraphInsertService = AgentGraphInsertService_1 = class AgentGraphInsertService {
    constructor(_postsService) {
        this._postsService = _postsService;
    }
    async findCategory(state) {
        const { messages } = state;
        const structuredOutput = model.withStructuredOutput(category);
        return prompts_1.ChatPromptTemplate.fromTemplate(`
You are an assistant that get a social media post and categorize it into to one from the following categories:
{categories}
Here is the post:
{post}
    `)
            .pipe(structuredOutput)
            .invoke({
            post: messages[0].content,
            categories: agent_categories_1.agentCategories.join(', '),
        });
    }
    findTopic(state) {
        const { messages } = state;
        const structuredOutput = model.withStructuredOutput(topic);
        return prompts_1.ChatPromptTemplate.fromTemplate(`
You are an assistant that get a social media post and categorize it into one of the following topics:
{topics}
Here is the post:
{post}
    `)
            .pipe(structuredOutput)
            .invoke({
            post: messages[0].content,
            topics: agent_topics_1.agentTopics.join(', '),
        });
    }
    findHook(state) {
        const { messages } = state;
        const structuredOutput = model.withStructuredOutput(hook);
        return prompts_1.ChatPromptTemplate.fromTemplate(`
You are an assistant that get a social media post and extract the hook, the hook is usually the first or second of both sentence of the post, but can be in a different place, make sure you don't change the wording of the post use the exact text:
{post}
    `)
            .pipe(structuredOutput)
            .invoke({
            post: messages[0].content,
        });
    }
    async savePost(state) {
        await this._postsService.createPopularPosts({
            category: state.category,
            topic: state.topic,
            hook: state.hook,
            content: state.messages[0].content,
        });
        return {};
    }
    newPost(post) {
        const state = AgentGraphInsertService_1.state();
        const workflow = state
            .addNode('find-category', this.findCategory)
            .addNode('find-topic', this.findTopic)
            .addNode('find-hook', this.findHook)
            .addNode('save-post', this.savePost.bind(this))
            .addEdge(langgraph_1.START, 'find-category')
            .addEdge('find-category', 'find-topic')
            .addEdge('find-topic', 'find-hook')
            .addEdge('find-hook', 'save-post')
            .addEdge('save-post', langgraph_1.END);
        const app = workflow.compile();
        return app.invoke({
            messages: [new messages_1.HumanMessage(post)],
        });
    }
};
exports.AgentGraphInsertService = AgentGraphInsertService;
AgentGraphInsertService.state = () => new langgraph_1.StateGraph({
    channels: {
        messages: {
            reducer: (currentState, updateValue) => currentState.concat(updateValue),
            default: () => [],
        },
        topic: null,
        category: null,
        hook: null,
        content: null,
    },
});
exports.AgentGraphInsertService = AgentGraphInsertService = AgentGraphInsertService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [posts_service_1.PostsService])
], AgentGraphInsertService);
//# sourceMappingURL=agent.graph.insert.service.js.map