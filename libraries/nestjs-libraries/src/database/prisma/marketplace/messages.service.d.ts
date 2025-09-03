import { MessagesRepository } from '@gitroom/nestjs-libraries/database/prisma/marketplace/messages.repository';
import { NewConversationDto } from '@gitroom/nestjs-libraries/dtos/marketplace/new.conversation.dto';
import { AddMessageDto } from '@gitroom/nestjs-libraries/dtos/messages/add.message';
import { CreateOfferDto } from '@gitroom/nestjs-libraries/dtos/marketplace/create.offer.dto';
import { From, OrderStatus } from '@prisma/client';
import { OrganizationRepository } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
import { BullMqClient } from '@gitroom/nestjs-libraries/bull-mq-transport-new/client';
export declare class MessagesService {
    private _workerServiceProducer;
    private _messagesRepository;
    private _organizationRepository;
    private _inAppNotificationService;
    constructor(_workerServiceProducer: BullMqClient, _messagesRepository: MessagesRepository, _organizationRepository: OrganizationRepository, _inAppNotificationService: NotificationService);
    createConversation(userId: string, organizationId: string, body: NewConversationDto): Promise<{
        id: string;
    }>;
    getMessagesGroup(userId: string, organizationId: string): Promise<({
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
    getMessages(userId: string, organizationId: string, groupId: string, page: number): Promise<{
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
    createNewMessage(group: string, from: From, content: string, special?: object): Promise<{
        id: string;
        group: {
            buyer: {
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
            };
            seller: {
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
            };
        };
    }>;
    sendMessageNotification(user: {
        id: string;
        lastOnline: Date;
    }): Promise<void>;
    createMessage(userId: string, orgId: string, groupId: string, body: AddMessageDto): Promise<{
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
    createOffer(userId: string, body: CreateOfferDto): Promise<{
        success: boolean;
    }>;
    getOrderDetails(userId: string, organizationId: string, orderId: string): Promise<{
        buyer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string | null;
            providerName: import(".prisma/client").$Enums.Provider;
            lastName: string | null;
            isSuperAdmin: boolean;
            bio: string | null;
            audience: number;
            pictureId: string | null;
            providerId: string | null;
            timezone: number;
            lastReadNotifications: Date;
            inviteId: string | null;
            activated: boolean;
            marketplace: boolean;
            account: string | null;
            connectedAccount: boolean;
            lastOnline: Date;
            ip: string | null;
            agent: string | null;
        };
        seller: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string | null;
            providerName: import(".prisma/client").$Enums.Provider;
            lastName: string | null;
            isSuperAdmin: boolean;
            bio: string | null;
            audience: number;
            pictureId: string | null;
            providerId: string | null;
            timezone: number;
            lastReadNotifications: Date;
            inviteId: string | null;
            activated: boolean;
            marketplace: boolean;
            account: string | null;
            connectedAccount: boolean;
            lastOnline: Date;
            ip: string | null;
            agent: string | null;
        };
        order: {
            ordersItems: {
                integration: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date | null;
                    deletedAt: Date | null;
                    picture: string | null;
                    organizationId: string;
                    type: string;
                    internalId: string;
                    providerIdentifier: string;
                    token: string;
                    disabled: boolean;
                    tokenExpiration: Date | null;
                    refreshToken: string | null;
                    profile: string | null;
                    inBetweenSteps: boolean;
                    refreshNeeded: boolean;
                    postingTimes: string;
                    customInstanceDetails: string | null;
                    customerId: string | null;
                    rootInternalId: string | null;
                    additionalSettings: string | null;
                };
                price: number;
                quantity: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            buyerId: string;
            sellerId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            messageGroupId: string;
            captureId: string | null;
        };
    }>;
    canAddPost(id: string, order: string, integrationId: string): Promise<boolean>;
    changeOrderStatus(orderId: string, status: OrderStatus, paymentIntent?: string): import(".prisma/client").Prisma.Prisma__OrdersClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
        sellerId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        messageGroupId: string;
        captureId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getOrgByOrder(orderId: string): import(".prisma/client").Prisma.Prisma__OrdersClient<{
        messageGroup: {
            buyerOrganizationId: string;
        };
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getMarketplaceAvailableOffers(orgId: string, id: string): Promise<{
        id: string;
        usedIds: {
            id: string;
            status: import(".prisma/client").$Enums.APPROVED_SUBMIT_FOR_ORDER;
        }[];
        buyer: {
            id: string;
            name: string;
            picture: {
                id: string;
                path: string;
            };
        };
        missing: {
            integration: {
                integration: {
                    id: string;
                    name: string;
                    providerIdentifier: string;
                };
                quantity: number;
            };
            missing: number;
        }[];
    }[]>;
    getPost(userId: string, orgId: string, postId: string): import(".prisma/client").Prisma.Prisma__PostClient<{
        integration: {
            providerIdentifier: string;
        };
        organizationId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    requestRevision(userId: string, orgId: string, postId: string, message: string): Promise<void>;
    requestApproved(userId: string, orgId: string, postId: string, message: string): Promise<void>;
    requestCancel(orgId: string, postId: string): Promise<void>;
    completeOrderAndPay(orgId: string, order: string): Promise<false | {
        price: number;
        account: string;
        charge: string;
        posts: {
            error: string | null;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            content: string;
            state: import(".prisma/client").$Enums.State;
            image: string | null;
            integrationId: string;
            publishDate: Date;
            group: string;
            title: string | null;
            parentPostId: string | null;
            releaseId: string | null;
            releaseURL: string | null;
            settings: string | null;
            submittedForOrderId: string | null;
            submittedForOrganizationId: string | null;
            approvedSubmitForOrder: import(".prisma/client").$Enums.APPROVED_SUBMIT_FOR_ORDER;
            lastMessageId: string | null;
            intervalInDays: number | null;
        }[];
        sellerId: string;
    }>;
    completeOrder(orderId: string): import(".prisma/client").Prisma.Prisma__OrdersClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
        sellerId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        messageGroupId: string;
        captureId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    payoutProblem(orderId: string, sellerId: string, amount: number, postId?: string): import(".prisma/client").Prisma.Prisma__PayoutProblemsClient<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        postId: string | null;
        orderId: string;
        amount: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getOrders(userId: string, orgId: string, type: 'seller' | 'buyer'): Promise<{
        orders: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            name: any;
            price: number;
            details: {
                posted: number;
                submitted: number;
                integration: {
                    id: string;
                    name: string;
                    picture: string;
                    providerIdentifier: string;
                };
                total: number;
                price: number;
            }[];
        }[];
    }>;
}
