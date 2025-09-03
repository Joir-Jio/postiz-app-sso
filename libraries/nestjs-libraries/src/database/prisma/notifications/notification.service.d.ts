import { NotificationsRepository } from '@gitroom/nestjs-libraries/database/prisma/notifications/notifications.repository';
import { EmailService } from '@gitroom/nestjs-libraries/services/email.service';
import { OrganizationRepository } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository';
import { BullMqClient } from '@gitroom/nestjs-libraries/bull-mq-transport-new/client';
export declare class NotificationService {
    private _notificationRepository;
    private _emailService;
    private _organizationRepository;
    private _workerServiceProducer;
    constructor(_notificationRepository: NotificationsRepository, _emailService: EmailService, _organizationRepository: OrganizationRepository, _workerServiceProducer: BullMqClient);
    getMainPageCount(organizationId: string, userId: string): Promise<{
        total: number;
    }>;
    getNotifications(organizationId: string, userId: string): Promise<{
        lastReadNotifications: Date;
        notifications: {
            createdAt: Date;
            content: string;
        }[];
    }>;
    getNotificationsSince(organizationId: string, since: string): Promise<{
        link: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
    }[]>;
    inAppNotification(orgId: string, subject: string, message: string, sendEmail?: boolean, digest?: boolean): Promise<void>;
    sendEmailsToOrg(orgId: string, subject: string, message: string): Promise<void>;
    sendEmail(to: string, subject: string, html: string, replyTo?: string): Promise<void>;
    hasEmailProvider(): boolean;
}
