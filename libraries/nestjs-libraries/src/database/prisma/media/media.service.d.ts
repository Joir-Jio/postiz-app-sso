import { MediaRepository } from '@gitroom/nestjs-libraries/database/prisma/media/media.repository';
import { OpenaiService } from '@gitroom/nestjs-libraries/openai/openai.service';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { Organization } from '@prisma/client';
import { SaveMediaInformationDto } from '@gitroom/nestjs-libraries/dtos/media/save.media.information.dto';
import { VideoManager } from '@gitroom/nestjs-libraries/videos/video.manager';
import { VideoDto } from '@gitroom/nestjs-libraries/dtos/videos/video.dto';
export declare class MediaService {
    private _mediaRepository;
    private _openAi;
    private _subscriptionService;
    private _videoManager;
    private storage;
    constructor(_mediaRepository: MediaRepository, _openAi: OpenaiService, _subscriptionService: SubscriptionService, _videoManager: VideoManager);
    deleteMedia(org: string, id: string): Promise<{
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
    }>;
    getMediaById(id: string): import(".prisma/client").Prisma.Prisma__MediaClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    generateImage(prompt: string, org: Organization, generatePromptFirst?: boolean): Promise<string>;
    saveFile(org: string, fileName: string, filePath: string): import(".prisma/client").Prisma.Prisma__MediaClient<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        alt: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getMedia(org: string, page: number): Promise<{
        pages: number;
        results: {
            id: string;
            name: string;
            path: string;
            thumbnail: string;
            thumbnailTimestamp: number;
            alt: string;
        }[];
    }>;
    saveMediaInformation(org: string, data: SaveMediaInformationDto): import(".prisma/client").Prisma.Prisma__MediaClient<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        thumbnailTimestamp: number;
        alt: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getVideoOptions(): any[];
    generateVideoAllowed(org: Organization, type: string): Promise<boolean>;
    generateVideo(org: Organization, body: VideoDto): Promise<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        alt: string;
    }>;
    videoFunction(identifier: string, functionName: string, body: any): Promise<any>;
}
