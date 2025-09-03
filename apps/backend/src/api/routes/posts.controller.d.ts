import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { Organization, User } from '@prisma/client';
import { GetPostsDto } from '@gitroom/nestjs-libraries/dtos/posts/get.posts.dto';
import { StarsService } from '@gitroom/nestjs-libraries/database/prisma/stars/stars.service';
import { MessagesService } from '@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service';
import { GeneratorDto } from '@gitroom/nestjs-libraries/dtos/generator/generator.dto';
import { CreateGeneratedPostsDto } from '@gitroom/nestjs-libraries/dtos/generator/create.generated.posts.dto';
import { AgentGraphService } from '@gitroom/nestjs-libraries/agent/agent.graph.service';
import { Response } from 'express';
import { ShortLinkService } from '@gitroom/nestjs-libraries/short-linking/short.link.service';
import { CreateTagDto } from '@gitroom/nestjs-libraries/dtos/posts/create.tag.dto';
export declare class PostsController {
    private _postsService;
    private _starsService;
    private _messagesService;
    private _agentGraphService;
    private _shortLinkService;
    constructor(_postsService: PostsService, _starsService: StarsService, _messagesService: MessagesService, _agentGraphService: AgentGraphService, _shortLinkService: ShortLinkService);
    getStatistics(org: Organization, id: string): Promise<{
        clicks: {
            short: string;
            original: string;
            clicks: string;
        }[];
    }>;
    shouldShortlink(body: {
        messages: string[];
    }): Promise<{
        ask: boolean;
    }>;
    getMarketplacePosts(org: Organization, id: string): Promise<{
        id: string;
        usedIds: {
            id: string;
            status: import(".prisma/client").$Enums.APPROVED_SUBMIT_FOR_ORDER;
        }[];
        buyer: {
            id: string;
            name: string;
            picture: {
                id: string;
                path: string;
            };
        };
        missing: {
            integration: {
                integration: {
                    id: string;
                    name: string;
                    providerIdentifier: string;
                };
                quantity: number;
            };
            missing: number;
        }[];
    }[]>;
    createComment(org: Organization, user: User, id: string, body: {
        comment: string;
    }): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        postId: string;
    }>;
    getTags(org: Organization): Promise<{
        tags: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            orgId: string;
            color: string;
        }[];
    }>;
    createTag(org: Organization, body: CreateTagDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        orgId: string;
        color: string;
    }>;
    editTag(org: Organization, body: CreateTagDto, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        orgId: string;
        color: string;
    }>;
    getPosts(org: Organization, query: GetPostsDto): Promise<{
        posts: any[];
    }>;
    findSlot(org: Organization): Promise<{
        date: string;
    }>;
    findSlotIntegration(org: Organization, id?: string): Promise<{
        date: string;
    }>;
    predictTrending(): Promise<string[]>;
    oldPosts(org: Organization, date: string): Promise<{
        integration: {
            id: string;
            name: string;
            picture: string;
            type: string;
            providerIdentifier: string;
        };
        id: string;
        content: string;
        state: import(".prisma/client").$Enums.State;
        publishDate: Date;
        releaseURL: string;
    }[]>;
    getPost(org: Organization, id: string): Promise<{
        group: string;
        posts: {
            image: any[];
            error: string | null;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            content: string;
            state: import(".prisma/client").$Enums.State;
            integrationId: string;
            publishDate: Date;
            group: string;
            title: string | null;
            parentPostId: string | null;
            releaseId: string | null;
            releaseURL: string | null;
            settings: string | null;
            submittedForOrderId: string | null;
            submittedForOrganizationId: string | null;
            approvedSubmitForOrder: import(".prisma/client").$Enums.APPROVED_SUBMIT_FOR_ORDER;
            lastMessageId: string | null;
            intervalInDays: number | null;
            integration?: import(".prisma/client").Integration;
            childrenPost: import(".prisma/client").Post[];
        }[];
        integrationPicture: string;
        integration: string;
        settings: any;
    }>;
    createPost(org: Organization, rawBody: any): Promise<any[]>;
    generatePostsDraft(org: Organization, body: CreateGeneratedPostsDto): Promise<void>;
    generatePosts(org: Organization, body: GeneratorDto, res: Response): Promise<void>;
    deletePost(org: Organization, group: string): Promise<{
        id: string;
        error?: undefined;
    } | {
        error: boolean;
        id?: undefined;
    }>;
    changeDate(org: Organization, id: string, date: string): Promise<{
        error: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        state: import(".prisma/client").$Enums.State;
        image: string | null;
        integrationId: string;
        publishDate: Date;
        group: string;
        title: string | null;
        parentPostId: string | null;
        releaseId: string | null;
        releaseURL: string | null;
        settings: string | null;
        submittedForOrderId: string | null;
        submittedForOrganizationId: string | null;
        approvedSubmitForOrder: import(".prisma/client").$Enums.APPROVED_SUBMIT_FOR_ORDER;
        lastMessageId: string | null;
        intervalInDays: number | null;
    }>;
    separatePosts(org: Organization, body: {
        content: string;
        len: number;
    }): Promise<{
        posts: any[];
    }>;
}
