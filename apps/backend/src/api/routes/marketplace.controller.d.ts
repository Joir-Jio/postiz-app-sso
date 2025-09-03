import { Organization, User } from '@prisma/client';
import { ItemUserService } from '@gitroom/nestjs-libraries/database/prisma/marketplace/item.user.service';
import { AddRemoveItemDto } from '@gitroom/nestjs-libraries/dtos/marketplace/add.remove.item.dto';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { ChangeActiveDto } from '@gitroom/nestjs-libraries/dtos/marketplace/change.active.dto';
import { ItemsDto } from '@gitroom/nestjs-libraries/dtos/marketplace/items.dto';
import { AudienceDto } from '@gitroom/nestjs-libraries/dtos/marketplace/audience.dto';
import { NewConversationDto } from '@gitroom/nestjs-libraries/dtos/marketplace/new.conversation.dto';
import { MessagesService } from '@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service';
import { CreateOfferDto } from '@gitroom/nestjs-libraries/dtos/marketplace/create.offer.dto';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
export declare class MarketplaceController {
    private _itemUserService;
    private _stripeService;
    private _userService;
    private _messagesService;
    private _postsService;
    constructor(_itemUserService: ItemUserService, _stripeService: StripeService, _userService: UsersService, _messagesService: MessagesService, _postsService: PostsService);
    getInfluencers(organization: Organization, user: User, body: ItemsDto): Promise<{
        list: {
            id: string;
            name: string;
            bio: string;
            audience: number;
            picture: {
                id: string;
                path: string;
            };
            organizations: {
                organization: {
                    Integration: {
                        providerIdentifier: string;
                    }[];
                };
            }[];
            items: {
                key: string;
            }[];
        }[];
        count: number;
    }>;
    createConversation(user: User, organization: Organization, body: NewConversationDto): Promise<{
        id: string;
    }>;
    connectBankAccount(user: User, country: string): Promise<{
        url: string;
    }>;
    addItems(user: User, body: AddRemoveItemDto): Promise<import(".prisma/client").Prisma.BatchPayload | {
        id: string;
        userId: string;
        key: string;
    }>;
    changeActive(user: User, body: ChangeActiveDto): Promise<void>;
    changeAudience(user: User, body: AudienceDto): Promise<void>;
    getItems(user: User): Promise<{
        id: string;
        userId: string;
        key: string;
    }[]>;
    getOrders(user: User, organization: Organization, type: 'seller' | 'buyer'): Promise<{
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
    getAccount(user: User): Promise<{
        account: string;
        marketplace: boolean;
        connectedAccount: boolean;
        fullname: string;
        audience: number;
        picture: {
            id: string;
            path: string;
        };
    }>;
    createOffer(user: User, body: CreateOfferDto): Promise<{
        success: boolean;
    }>;
    post(user: User, organization: Organization, id: string): Promise<{
        providerId: string;
        group: string;
        posts: {
            image: any[];
            error: string | null;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            content: string;
            state: import(".prisma/client").$Enums.State;
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
            integration?: import(".prisma/client").Integration;
            childrenPost: import(".prisma/client").Post[];
        }[];
        integrationPicture: string;
        integration: string;
        settings: any;
    }>;
    revision(user: User, organization: Organization, id: string, message: string): Promise<void>;
    approve(user: User, organization: Organization, id: string, message: string): Promise<void>;
    cancel(organization: Organization, id: string): Promise<void>;
    completeOrder(organization: Organization, id: string): Promise<void>;
    payOrder(user: User, organization: Organization, id: string): Promise<{
        url: string;
    }>;
}
