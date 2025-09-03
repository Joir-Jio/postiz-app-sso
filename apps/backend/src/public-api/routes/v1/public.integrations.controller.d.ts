import { Organization } from '@prisma/client';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
import { GetPostsDto } from '@gitroom/nestjs-libraries/dtos/posts/get.posts.dto';
import { VideoDto } from '@gitroom/nestjs-libraries/dtos/videos/video.dto';
import { VideoFunctionDto } from '@gitroom/nestjs-libraries/dtos/videos/video.function.dto';
export declare class PublicIntegrationsController {
    private _integrationService;
    private _postsService;
    private _mediaService;
    private storage;
    constructor(_integrationService: IntegrationService, _postsService: PostsService, _mediaService: MediaService);
    uploadSimple(org: Organization, file: Express.Multer.File): Promise<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        alt: string;
    }>;
    getPosts(org: Organization, query: GetPostsDto): Promise<{
        posts: any[];
    }>;
    createPost(org: Organization, rawBody: any): Promise<any[]>;
    deletePost(org: Organization, body: {
        id: string;
    }): Promise<{
        id: string;
        error?: undefined;
    } | {
        error: boolean;
        id?: undefined;
    }>;
    getActiveIntegrations(org: Organization): Promise<{
        connected: boolean;
    }>;
    listIntegration(org: Organization): Promise<{
        id: string;
        name: string;
        identifier: string;
        picture: string;
        disabled: boolean;
        profile: string;
        customer: {
            id: string;
            name: string;
        };
    }[]>;
    generateVideo(org: Organization, body: VideoDto): Promise<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        alt: string;
    }>;
    videoFunction(body: VideoFunctionDto): Promise<any>;
}
