import { AgenciesService } from '@gitroom/nestjs-libraries/database/prisma/agencies/agencies.service';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { TrackService } from '@gitroom/nestjs-libraries/track/track.service';
import { TrackEnum } from '@gitroom/nestjs-libraries/user/track.enum';
import { Request, Response } from 'express';
import { AgentGraphInsertService } from '@gitroom/nestjs-libraries/agent/agent.graph.insert.service';
import { Nowpayments } from '@gitroom/nestjs-libraries/crypto/nowpayments';
export declare class PublicController {
    private _agenciesService;
    private _trackService;
    private _agentGraphInsertService;
    private _postsService;
    private _nowpayments;
    constructor(_agenciesService: AgenciesService, _trackService: TrackService, _agentGraphInsertService: AgentGraphInsertService, _postsService: PostsService, _nowpayments: Nowpayments);
    createAgent(body: {
        text: string;
        apiKey: string;
    }): Promise<import("@langchain/langgraph").StateType<import("@langchain/langgraph").StateDefinition>>;
    getAgencyByUser(): Promise<({
        logo: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            path: string;
            type: string;
            thumbnail: string | null;
            thumbnailTimestamp: number | null;
            alt: string | null;
            fileSize: number;
        };
        niches: {
            agencyId: string;
            niche: string;
        }[];
    } & {
        id: string;
        name: string;
        website: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        linkedIn: string | null;
        youtube: string | null;
        tiktok: string | null;
        shortDescription: string;
        description: string;
        userId: string;
        logoId: string | null;
        slug: string | null;
        otherSocialMedia: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    getAgencySlug(): Promise<{
        slug: string;
    }[]>;
    getAgencyInformation(agency: string): Promise<{
        logo: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            path: string;
            type: string;
            thumbnail: string | null;
            thumbnailTimestamp: number | null;
            alt: string | null;
            fileSize: number;
        };
        niches: {
            agencyId: string;
            niche: string;
        }[];
    } & {
        id: string;
        name: string;
        website: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        linkedIn: string | null;
        youtube: string | null;
        tiktok: string | null;
        shortDescription: string;
        description: string;
        userId: string;
        logoId: string | null;
        slug: string | null;
        otherSocialMedia: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getAgenciesCount(): Promise<number>;
    getPreview(id: string): Promise<{
        integration?: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            picture: string | null;
            organizationId: string;
            type: string;
            internalId: string;
            providerIdentifier: string;
            token: string;
            disabled: boolean;
            tokenExpiration: Date | null;
            refreshToken: string | null;
            profile: string | null;
            inBetweenSteps: boolean;
            refreshNeeded: boolean;
            postingTimes: string;
            customInstanceDetails: string | null;
            customerId: string | null;
            rootInternalId: string | null;
            additionalSettings: string | null;
        } | {
            id: string;
            name: string;
            picture: string;
            providerIdentifier: string;
            profile: string;
        };
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
    }[]>;
    getComments(postId: string): Promise<{
        comments: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            content: string;
            postId: string;
        }[];
    }>;
    trackEvent(res: Response, req: Request, ip: string, userAgent: string, body: {
        fbclid?: string;
        tt: TrackEnum;
        additional: Record<string, any>;
    }): Promise<void>;
    cryptoPost(body: any, path: string): Promise<import("@gitroom/nestjs-libraries/crypto/nowpayments").ProcessPayment>;
}
