"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const notifications_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notifications.repository");
const email_service_1 = require("@gitroom/nestjs-libraries/services/email.service");
const organization_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository");
const client_1 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/client");
const redis_service_1 = require("@gitroom/nestjs-libraries/redis/redis.service");
let NotificationService = class NotificationService {
    constructor(_notificationRepository, _emailService, _organizationRepository, _workerServiceProducer) {
        this._notificationRepository = _notificationRepository;
        this._emailService = _emailService;
        this._organizationRepository = _organizationRepository;
        this._workerServiceProducer = _workerServiceProducer;
    }
    getMainPageCount(organizationId, userId) {
        return this._notificationRepository.getMainPageCount(organizationId, userId);
    }
    getNotifications(organizationId, userId) {
        return this._notificationRepository.getNotifications(organizationId, userId);
    }
    getNotificationsSince(organizationId, since) {
        return this._notificationRepository.getNotificationsSince(organizationId, since);
    }
    async inAppNotification(orgId, subject, message, sendEmail = false, digest = false) {
        const date = new Date().toISOString();
        await this._notificationRepository.createNotification(orgId, message);
        if (!sendEmail) {
            return;
        }
        if (digest) {
            await redis_service_1.ioRedis.watch('digest_' + orgId);
            const value = await redis_service_1.ioRedis.get('digest_' + orgId);
            if (value) {
                return;
            }
            await redis_service_1.ioRedis
                .multi()
                .set('digest_' + orgId, date)
                .expire('digest_' + orgId, 60)
                .exec();
            this._workerServiceProducer.emit('sendDigestEmail', {
                id: 'digest_' + orgId,
                options: {
                    delay: 60000,
                },
                payload: {
                    subject,
                    org: orgId,
                    since: date,
                },
            });
            return;
        }
        await this.sendEmailsToOrg(orgId, subject, message);
    }
    async sendEmailsToOrg(orgId, subject, message) {
        const userOrg = await this._organizationRepository.getAllUsersOrgs(orgId);
        for (const user of (userOrg === null || userOrg === void 0 ? void 0 : userOrg.users) || []) {
            await this.sendEmail(user.user.email, subject, message);
        }
    }
    async sendEmail(to, subject, html, replyTo) {
        await this._emailService.sendEmail(to, subject, html, replyTo);
    }
    hasEmailProvider() {
        return this._emailService.hasProvider();
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [notifications_repository_1.NotificationsRepository,
        email_service_1.EmailService,
        organization_repository_1.OrganizationRepository,
        client_1.BullMqClient])
], NotificationService);
//# sourceMappingURL=notification.service.js.map