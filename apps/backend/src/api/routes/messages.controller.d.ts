import { MessagesService } from '@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service';
import { Organization, User } from '@prisma/client';
import { AddMessageDto } from '@gitroom/nestjs-libraries/dtos/messages/add.message';
export declare class MessagesController {
    private _messagesService;
    constructor(_messagesService: MessagesService);
    getMessagesGroup(user: User, organization: Organization): Promise<({
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            buyerId: string;
            sellerId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            messageGroupId: string;
            captureId: string | null;
        }[];
        messages: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            content: string | null;
            from: import(".prisma/client").$Enums.From;
            groupId: string;
            special: string | null;
        }[];
        buyer: {
            id: string;
            name: string;
            picture: {
                id: string;
                path: string;
            };
        };
        seller: {
            id: string;
            name: string;
            picture: {
                id: string;
                path: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
        sellerId: string;
        buyerOrganizationId: string;
    })[]>;
    getMessages(user: User, organization: Organization, groupId: string, page: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            content: string | null;
            from: import(".prisma/client").$Enums.From;
            groupId: string;
            special: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
        sellerId: string;
        buyerOrganizationId: string;
    }>;
    createMessage(user: User, organization: Organization, groupId: string, message: AddMessageDto): Promise<{
        id: string;
        lastOnline: Date;
        organizations: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            disabled: boolean;
            role: import(".prisma/client").$Enums.Role;
        }[];
    }>;
}
