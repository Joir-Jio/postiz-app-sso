import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { SaveMediaInformationDto } from '@gitroom/nestjs-libraries/dtos/media/save.media.information.dto';
export declare class MediaRepository {
    private _media;
    constructor(_media: PrismaRepository<'media'>);
    saveFile(org: string, fileName: string, filePath: string): import(".prisma/client").Prisma.Prisma__MediaClient<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        alt: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    deleteMedia(org: string, id: string): import(".prisma/client").Prisma.Prisma__MediaClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    saveMediaInformation(org: string, data: SaveMediaInformationDto): import(".prisma/client").Prisma.Prisma__MediaClient<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        thumbnailTimestamp: number;
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
}
