import { Request, Response } from 'express';
import { Organization } from '@prisma/client';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { SaveMediaInformationDto } from '@gitroom/nestjs-libraries/dtos/media/save.media.information.dto';
import { VideoDto } from '@gitroom/nestjs-libraries/dtos/videos/video.dto';
import { VideoFunctionDto } from '@gitroom/nestjs-libraries/dtos/videos/video.function.dto';
import { ExternalMediaService } from '../../services/media/external-media.service';
import { MediaReferenceService } from '../../services/media/media-reference.service';
import { MediaProxyService } from '../../services/media/media-proxy.service';
import { MediaSyncService } from '../../services/media/media-sync.service';
import { MediaUploadRequestDto, MediaAccessRequestDto, MediaAccessResponseDto, MediaSharingRequestDto, MediaSharingResponseDto } from '@gitroom/nestjs-libraries/dtos/sso/sso-media.dto';
export declare class MediaController {
    private _mediaService;
    private _subscriptionService;
    private readonly externalMediaService;
    private readonly mediaReferenceService;
    private readonly mediaProxyService;
    private readonly mediaSyncService;
    private storage;
    constructor(_mediaService: MediaService, _subscriptionService: SubscriptionService, externalMediaService: ExternalMediaService, mediaReferenceService: MediaReferenceService, mediaProxyService: MediaProxyService, mediaSyncService: MediaSyncService);
    deleteMedia(org: Organization, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        path: string;
        type: string;
        organizationId: string;
        fileSize: number;
        name: string;
        thumbnail: string | null;
        thumbnailTimestamp: number | null;
        alt: string | null;
    }>;
    generateVideo(org: Organization, body: VideoDto): Promise<{
        id: string;
        path: string;
        name: string;
        thumbnail: string;
        alt: string;
    }>;
    generateImage(org: Organization, req: Request, prompt: string, isPicturePrompt?: boolean): Promise<false | {
        output: string;
    }>;
    generateImageFromText(org: Organization, req: Request, prompt: string): Promise<false | {
        id: string;
        path: string;
        name: string;
        thumbnail: string;
        alt: string;
    }>;
    uploadServer(org: Organization, file: Express.Multer.File): Promise<{
        id: string;
        path: string;
        name: string;
        thumbnail: string;
        alt: string;
    }>;
    saveMedia(org: Organization, req: Request, name: string): Promise<false | {
        id: string;
        path: string;
        name: string;
        thumbnail: string;
        alt: string;
    }>;
    saveMediaInformation(org: Organization, body: SaveMediaInformationDto): import(".prisma/client").Prisma.Prisma__MediaClient<{
        id: string;
        path: string;
        name: string;
        thumbnail: string;
        thumbnailTimestamp: number;
        alt: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    uploadSimple(org: Organization, file: Express.Multer.File, preventSave?: string): Promise<{
        id: string;
        path: string;
        name: string;
        thumbnail: string;
        alt: string;
    } | {
        path: any;
    }>;
    uploadFile(org: Organization, req: Request, res: Response, endpoint: string): Promise<Response<any, Record<string, any>> | import("@aws-sdk/client-s3").CompleteMultipartUploadCommandOutput>;
    getMedia(org: Organization, page: number): Promise<{
        pages: number;
        results: {
            id: string;
            path: string;
            name: string;
            thumbnail: string;
            thumbnailTimestamp: number;
            alt: string;
        }[];
    }>;
    getVideos(): any[];
    videoFunction(body: VideoFunctionDto): Promise<any>;
    generateVideoAllowed(org: Organization, type: string): Promise<boolean>;
    referenceExternalFile(org: Organization, request: MediaUploadRequestDto, productKey?: string, externalUserId?: string): Promise<{
        success: boolean;
        mediaId: string;
        localPath: any;
        proxyUrl: string;
        thumbnailUrl: string;
    }>;
    requestMediaAccess(org: Organization, request: MediaAccessRequestDto, productKey?: string, externalUserId?: string): Promise<MediaAccessResponseDto>;
    proxyMediaFile(mediaReferenceId: string, req: Request, res: Response, range?: string, download?: string): Promise<void>;
    getMediaThumbnail(mediaReferenceId: string, req: Request, res: Response, width?: string, height?: string): Promise<void>;
    downloadMediaFile(mediaReferenceId: string, token: string, req: Request, res: Response): Promise<void>;
    generateDownloadLink(org: Organization, mediaReferenceId: string, productKey?: string, externalUserId?: string, expiryHours?: string, downloadName?: string): Promise<{
        downloadUrl: string;
        expiresAt: Date;
        filename: string;
    }>;
    listExternalMedia(org: Organization, productKey?: string, externalUserId?: string, page?: string, limit?: string): Promise<{
        success: boolean;
        page: number;
        limit: number;
        total: number;
        pages: number;
        media: import("../../services/media/media-reference.service").MediaReferenceWithAccess[];
    }>;
    deleteExternalMedia(org: Organization, mediaReferenceId: string, productKey?: string, externalUserId?: string, permanent?: string): Promise<{
        success: boolean;
        deleted: boolean;
        permanent: boolean;
    }>;
    shareExternalMedia(org: Organization, request: MediaSharingRequestDto, productKey?: string, externalUserId?: string): Promise<MediaSharingResponseDto>;
    getSyncStatus(): Promise<{
        sync: {
            lastFullSyncTime: Date | null;
            isFullSyncRunning: boolean;
            totalSynced: number;
            totalErrors: number;
            lastSyncDuration: number;
        };
        proxy: {
            accessCacheSize: number;
            rateLimitEntries: number;
            uptime: number;
        };
        timestamp: string;
    }>;
    forceSyncProduct(productKey: string): Promise<{
        success: boolean;
        productKey: string;
        result: import("../../services/media/media-sync.service").SyncResult;
    }>;
    getInconsistentMedia(productKey?: string, limit?: string): Promise<{
        success: boolean;
        count: number;
        inconsistentMedia: import("../../services/media/media-sync.service").InconsistentMediaItem[];
    }>;
    private getProductUserContext;
    private getProductByKey;
}
