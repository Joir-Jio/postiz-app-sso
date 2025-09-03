import { PostsRepository } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.repository';
import { CreatePostDto } from '@gitroom/nestjs-libraries/dtos/posts/create.post.dto';
import { IntegrationManager } from '@gitroom/nestjs-libraries/integrations/integration.manager';
import { Integration, Post } from '@prisma/client';
import { GetPostsDto } from '@gitroom/nestjs-libraries/dtos/posts/get.posts.dto';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
import { MessagesService } from '@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { CreateGeneratedPostsDto } from '@gitroom/nestjs-libraries/dtos/generator/create.generated.posts.dto';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { BullMqClient } from '@gitroom/nestjs-libraries/bull-mq-transport-new/client';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
import { ShortLinkService } from '@gitroom/nestjs-libraries/short-linking/short.link.service';
import { WebhooksService } from '@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { CreateTagDto } from '@gitroom/nestjs-libraries/dtos/posts/create.tag.dto';
import { OpenaiService } from '@gitroom/nestjs-libraries/openai/openai.service';
type PostWithConditionals = Post & {
    integration?: Integration;
    childrenPost: Post[];
};
export declare class PostsService {
    private _postRepository;
    private _workerServiceProducer;
    private _integrationManager;
    private _notificationService;
    private _messagesService;
    private _stripeService;
    private _integrationService;
    private _mediaService;
    private _shortLinkService;
    private _webhookService;
    private openaiService;
    private storage;
    constructor(_postRepository: PostsRepository, _workerServiceProducer: BullMqClient, _integrationManager: IntegrationManager, _notificationService: NotificationService, _messagesService: MessagesService, _stripeService: StripeService, _integrationService: IntegrationService, _mediaService: MediaService, _shortLinkService: ShortLinkService, _webhookService: WebhooksService, openaiService: OpenaiService);
    checkPending15minutesBack(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        publishDate: Date;
    }[]>;
    searchForMissingThreeHoursPosts(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        publishDate: Date;
    }[]>;
    getStatistics(orgId: string, id: string): Promise<{
        clicks: {
            short: string;
            original: string;
            clicks: string;
        }[];
    }>;
    mapTypeToPost(body: CreatePostDto, organization: string, replaceDraft?: boolean): Promise<CreatePostDto>;
    getPostsRecursively(id: string, includeIntegration?: boolean, orgId?: string, isFirst?: boolean): Promise<PostWithConditionals[]>;
    getPosts(orgId: string, query: GetPostsDto): Promise<any[]>;
    updateMedia(id: string, imagesList: any[], convertToJPEG?: boolean): Promise<any[]>;
    getPost(orgId: string, id: string, convertToJPEG?: boolean): Promise<{
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
            integration?: Integration;
            childrenPost: Post[];
        }[];
        integrationPicture: string;
        integration: string;
        settings: any;
    }>;
    getOldPosts(orgId: string, date: string): Promise<{
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
    post(id: string): Promise<void>;
    private updateTags;
    private postSocial;
    private checkInternalPlug;
    private checkPlugs;
    deletePost(orgId: string, group: string): Promise<{
        id: string;
        error?: undefined;
    } | {
        error: boolean;
        id?: undefined;
    }>;
    countPostsFromDay(orgId: string, date: Date): Promise<number>;
    createPost(orgId: string, body: CreatePostDto): Promise<any[]>;
    separatePosts(content: string, len: number): Promise<{
        posts: any[];
    }>;
    changeDate(orgId: string, id: string, date: string): Promise<{
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
    payout(id: string, url: string): Promise<void>;
    generatePostsDraft(orgId: string, body: CreateGeneratedPostsDto): Promise<void>;
    findAllExistingCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        category: string;
    }[]>;
    findAllExistingTopicsOfCategory(category: string): import(".prisma/client").Prisma.PrismaPromise<{
        topic: string;
    }[]>;
    findPopularPosts(category: string, topic?: string): import(".prisma/client").Prisma.PrismaPromise<{
        content: string;
        hook: string;
    }[]>;
    findFreeDateTime(orgId: string, integrationId?: string): Promise<string>;
    createPopularPosts(post: {
        category: string;
        topic: string;
        content: string;
        hook: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        category: string;
        topic: string;
        hook: string;
    }>;
    private findFreeDateTimeRecursive;
    getComments(postId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        postId: string;
    }[]>;
    getTags(orgId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        orgId: string;
        color: string;
    }[]>;
    createTag(orgId: string, body: CreateTagDto): import(".prisma/client").Prisma.Prisma__TagsClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        orgId: string;
        color: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    editTag(id: string, orgId: string, body: CreateTagDto): import(".prisma/client").Prisma.Prisma__TagsClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        orgId: string;
        color: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createComment(orgId: string, userId: string, postId: string, comment: string): import(".prisma/client").Prisma.Prisma__CommentsClient<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        postId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    sendDigestEmail(subject: string, orgId: string, since: string): Promise<void>;
}
export {};
