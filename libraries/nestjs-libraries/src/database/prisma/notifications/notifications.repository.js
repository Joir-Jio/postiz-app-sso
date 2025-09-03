"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
let NotificationsRepository = class NotificationsRepository {
    constructor(_notifications, _user) {
        this._notifications = _notifications;
        this._user = _user;
    }
    getLastReadNotification(userId) {
        return this._user.model.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                lastReadNotifications: true,
            },
        });
    }
    async getMainPageCount(organizationId, userId) {
        const { lastReadNotifications } = (await this.getLastReadNotification(userId));
        return {
            total: await this._notifications.model.notifications.count({
                where: {
                    organizationId,
                    createdAt: {
                        gt: lastReadNotifications,
                    },
                },
            }),
        };
    }
    async createNotification(organizationId, content) {
        await this._notifications.model.notifications.create({
            data: {
                organizationId,
                content,
            },
        });
    }
    async getNotificationsSince(organizationId, since) {
        return this._notifications.model.notifications.findMany({
            where: {
                organizationId,
                createdAt: {
                    gte: new Date(since),
                },
            },
        });
    }
    async getNotifications(organizationId, userId) {
        const { lastReadNotifications } = (await this.getLastReadNotification(userId));
        await this._user.model.user.update({
            where: {
                id: userId,
            },
            data: {
                lastReadNotifications: new Date(),
            },
        });
        return {
            lastReadNotifications,
            notifications: await this._notifications.model.notifications.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                take: 10,
                where: {
                    organizationId,
                },
                select: {
                    createdAt: true,
                    content: true,
                },
            }),
        };
    }
};
exports.NotificationsRepository = NotificationsRepository;
exports.NotificationsRepository = NotificationsRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository])
], NotificationsRepository);
//# sourceMappingURL=notifications.repository.js.map