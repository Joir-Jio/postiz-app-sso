import { BaseMessage, ToolMessage } from '@langchain/core/messages';
import { StateGraph } from '@langchain/langgraph';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
import { GeneratorDto } from '@gitroom/nestjs-libraries/dtos/generator/generator.dto';
interface WorkflowChannelsState {
    messages: BaseMessage[];
    orgId: string;
    question: string;
    hook?: string;
    fresearch?: string;
    category?: string;
    topic?: string;
    date?: string;
    format: 'one_short' | 'one_long' | 'thread_short' | 'thread_long';
    tone: 'personal' | 'company';
    content?: {
        content: string;
        website?: string;
        prompt?: string;
        image?: string;
    }[];
    isPicture?: boolean;
    popularPosts?: {
        content: string;
        hook: string;
    }[];
}
export declare class AgentGraphService {
    private _postsService;
    private _mediaService;
    private storage;
    constructor(_postsService: PostsService, _mediaService: MediaService);
    static state: () => StateGraph<WorkflowChannelsState, WorkflowChannelsState, Partial<WorkflowChannelsState>, "__start__", import("@langchain/langgraph").StateDefinition, import("@langchain/langgraph").StateDefinition, import("@langchain/langgraph").StateDefinition>;
    startCall(state: WorkflowChannelsState): Promise<{
        messages: import("@langchain/core/messages").AIMessageChunk[];
    }>;
    saveResearch(state: WorkflowChannelsState): Promise<{
        fresearch: ToolMessage[];
    }>;
    findCategories(state: WorkflowChannelsState): Promise<{
        category: string;
    }>;
    findTopic(state: WorkflowChannelsState): Promise<{
        topic: string;
    }>;
    findPopularPosts(state: WorkflowChannelsState): Promise<{
        popularPosts: {
            content: string;
            hook: string;
        }[];
    }>;
    generateHook(state: WorkflowChannelsState): Promise<{
        hook: string;
    }>;
    generateContent(state: WorkflowChannelsState): Promise<{
        content: {
            website?: string;
            content?: string;
            prompt?: string;
        } | {
            website?: string;
            content?: string;
            prompt?: string;
        }[];
    }>;
    fixArray(state: WorkflowChannelsState): Promise<{
        content: {
            content: string;
            website?: string;
            prompt?: string;
            image?: string;
        }[][];
    } | {
        content?: undefined;
    }>;
    generatePictures(state: WorkflowChannelsState): Promise<{
        content?: undefined;
    } | {
        content: {
            image: any;
            content: string;
            website?: string;
            prompt?: string;
        }[];
    }>;
    uploadPictures(state: WorkflowChannelsState): Promise<{
        content: ({
            content: string;
            website?: string;
            prompt?: string;
            image?: string;
        } | {
            image: {
                id: string;
                name: string;
                path: string;
                thumbnail: string;
                alt: string;
            };
            content: string;
            website?: string;
            prompt?: string;
        })[];
    }>;
    isGeneratePicture(state: WorkflowChannelsState): Promise<"generate-picture" | "post-time">;
    postDateTime(state: WorkflowChannelsState): Promise<{
        date: string;
    }>;
    start(orgId: string, body: GeneratorDto): import("@langchain/core/utils/stream").IterableReadableStream<import("@langchain/core/tracers/log_stream").StreamEvent>;
}
export {};
