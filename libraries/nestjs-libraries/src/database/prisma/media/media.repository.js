"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
let MediaRepository = class MediaRepository {
    constructor(_media) {
        this._media = _media;
    }
    saveFile(org, fileName, filePath) {
        return this._media.model.media.create({
            data: {
                organization: {
                    connect: {
                        id: org,
                    },
                },
                name: fileName,
                path: filePath,
            },
            select: {
                id: true,
                name: true,
                path: true,
                thumbnail: true,
                alt: true,
            },
        });
    }
    getMediaById(id) {
        return this._media.model.media.findUnique({
            where: {
                id,
            },
        });
    }
    deleteMedia(org, id) {
        return this._media.model.media.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    saveMediaInformation(org, data) {
        return this._media.model.media.update({
            where: {
                id: data.id,
                organizationId: org,
            },
            data: {
                alt: data.alt,
                thumbnail: data.thumbnail,
                thumbnailTimestamp: data.thumbnailTimestamp,
            },
            select: {
                id: true,
                name: true,
                alt: true,
                thumbnail: true,
                path: true,
                thumbnailTimestamp: true,
            },
        });
    }
    async getMedia(org, page) {
        const pageNum = (page || 1) - 1;
        const query = {
            where: {
                organization: {
                    id: org,
                },
            },
        };
        const pages = pageNum === 0
            ? Math.ceil((await this._media.model.media.count(query)) / 28)
            : 0;
        const results = await this._media.model.media.findMany({
            where: {
                organizationId: org,
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                path: true,
                thumbnail: true,
                alt: true,
                thumbnailTimestamp: true,
            },
            skip: pageNum * 28,
            take: 28,
        });
        return {
            pages,
            results,
        };
    }
};
exports.MediaRepository = MediaRepository;
exports.MediaRepository = MediaRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository])
], MediaRepository);
//# sourceMappingURL=media.repository.js.map