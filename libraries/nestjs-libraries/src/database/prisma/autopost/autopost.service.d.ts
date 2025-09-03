import { AutopostRepository } from '@gitroom/nestjs-libraries/database/prisma/autopost/autopost.repository';
import { AutopostDto } from '@gitroom/nestjs-libraries/dtos/autopost/autopost.dto';
import { BullMqClient } from '@gitroom/nestjs-libraries/bull-mq-transport-new/client';
import { StateGraph } from '@langchain/langgraph';
import { AutoPost, Integration } from '@prisma/client';
import { BaseMessage } from '@langchain/core/messages';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
interface WorkflowChannelsState {
    messages: BaseMessage[];
    integrations: Integration[];
    body: AutoPost;
    description: string;
    image: string;
    id: string;
    load: {
        date: string;
        url: string;
        description: string;
    };
}
export declare class AutopostService {
    private _autopostsRepository;
    private _workerServiceProducer;
    private _integrationService;
    private _postsService;
    constructor(_autopostsRepository: AutopostRepository, _workerServiceProducer: BullMqClient, _integrationService: IntegrationService, _postsService: PostsService);
    stopAll(org: string): Promise<void>;
    getAutoposts(orgId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string | null;
        active: boolean;
        title: string;
        integrations: string;
        url: string;
        lastUrl: string;
        onSlot: boolean;
        syncLast: boolean;
        addPicture: boolean;
        generateContent: boolean;
    }[]>;
    createAutopost(orgId: string, body: AutopostDto, id?: string): Promise<{
        id: string;
        active: boolean;
    }>;
    changeActive(orgId: string, id: string, active: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string | null;
        active: boolean;
        title: string;
        integrations: string;
        url: string;
        lastUrl: string;
        onSlot: boolean;
        syncLast: boolean;
        addPicture: boolean;
        generateContent: boolean;
    }>;
    processCron(active: boolean, id: string): Promise<boolean | import("rxjs").Observable<any>>;
    deleteAutopost(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string | null;
        active: boolean;
        title: string;
        integrations: string;
        url: string;
        lastUrl: string;
        onSlot: boolean;
        syncLast: boolean;
        addPicture: boolean;
        generateContent: boolean;
    }>;
    loadXML(url: string): Promise<{
        success: boolean;
        date: any;
        url: any;
        description: string;
    } | {
        success: boolean;
        date?: undefined;
        url?: undefined;
        description?: undefined;
    }>;
    static state: () => StateGraph<WorkflowChannelsState, WorkflowChannelsState, Partial<WorkflowChannelsState>, "__start__", import("@langchain/langgraph").StateDefinition, import("@langchain/langgraph").StateDefinition, import("@langchain/langgraph").StateDefinition>;
    loadUrl(url: string): Promise<string>;
    generateDescription(state: WorkflowChannelsState): Promise<{
        description: string;
        messages: BaseMessage[];
        integrations: Integration[];
        body: AutoPost;
        image: string;
        id: string;
        load: {
            date: string;
            url: string;
            description: string;
        };
    }>;
    generatePicture(state: WorkflowChannelsState): Promise<{
        image: any;
        messages: BaseMessage[];
        integrations: Integration[];
        body: AutoPost;
        description: string;
        id: string;
        load: {
            date: string;
            url: string;
            description: string;
        };
    }>;
    schedulePost(state: WorkflowChannelsState): Promise<void>;
    updateUrl(state: WorkflowChannelsState): Promise<void>;
    startAutopost(id: string): Promise<void>;
}
export {};
