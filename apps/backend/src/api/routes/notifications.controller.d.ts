import { Organization, User } from '@prisma/client';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
export declare class NotificationsController {
    private _notificationsService;
    constructor(_notificationsService: NotificationService);
    mainPageList(user: User, organization: Organization): Promise<{
        total: number;
    }>;
    notifications(user: User, organization: Organization): Promise<{
        lastReadNotifications: Date;
        notifications: {
            createdAt: Date;
            content: string;
        }[];
    }>;
}
