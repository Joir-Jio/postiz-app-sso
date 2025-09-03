import { BaseMessage } from '@langchain/core/messages';
import { StateGraph } from '@langchain/langgraph';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
interface WorkflowChannelsState {
    messages: BaseMessage[];
    topic?: string;
    category: string;
    hook?: string;
    content?: string;
}
export declare class AgentGraphInsertService {
    private _postsService;
    constructor(_postsService: PostsService);
    static state: () => StateGraph<WorkflowChannelsState, WorkflowChannelsState, Partial<WorkflowChannelsState>, "__start__", import("@langchain/langgraph").StateDefinition, import("@langchain/langgraph").StateDefinition, import("@langchain/langgraph").StateDefinition>;
    findCategory(state: WorkflowChannelsState): Promise<{
        category?: string;
    }>;
    findTopic(state: WorkflowChannelsState): Promise<{
        topic?: string;
    }>;
    findHook(state: WorkflowChannelsState): Promise<{
        hook?: string;
    }>;
    savePost(state: WorkflowChannelsState): Promise<{}>;
    newPost(post: string): Promise<import("@langchain/langgraph").StateType<import("@langchain/langgraph").StateDefinition>>;
}
export {};
