import { Organization, User } from '@prisma/client';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { Response, Request } from 'express';
import { AuthService } from '@gitroom/backend/services/auth/auth.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { UserDetailDto } from '@gitroom/nestjs-libraries/dtos/users/user.details.dto';
import { TrackEnum } from '@gitroom/nestjs-libraries/user/track.enum';
import { TrackService } from '@gitroom/nestjs-libraries/track/track.service';
export declare class UsersController {
    private _subscriptionService;
    private _stripeService;
    private _authService;
    private _orgService;
    private _userService;
    private _trackService;
    constructor(_subscriptionService: SubscriptionService, _stripeService: StripeService, _authService: AuthService, _orgService: OrganizationService, _userService: UsersService, _trackService: TrackService);
    getSelf(user: User, organization: Organization, req: Request): Promise<{
        orgId: string;
        totalChannels: any;
        tier: any;
        role: any;
        isLifetime: boolean;
        admin: boolean;
        impersonate: boolean;
        isTrailing: boolean;
        allowTrial: boolean;
        publicApi: string;
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
    }>;
    getPersonal(user: User): Promise<{
        id: string;
        name: string;
        bio: string;
        picture: {
            id: string;
            path: string;
        };
    }>;
    getImpersonate(user: User, name: string): Promise<{
        organization: {
            id: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
        id: string;
    }[]>;
    setImpersonate(user: User, id: string, response: Response): Promise<void>;
    changePersonal(user: User, body: UserDetailDto): Promise<void>;
    getSubscription(organization: Organization): Promise<{
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
            identifier: string | null;
            cancelAt: Date | null;
            period: import(".prisma/client").$Enums.Period;
            totalChannels: number;
            isLifetime: boolean;
        };
    }>;
    tiers(): Promise<{
        [x: string]: {
            name: any;
            recurring: import("stripe").Stripe.Price.Recurring.Interval;
            price: number;
        }[];
    }>;
    joinOrg(user: User, org: string, response: Response): Promise<Response<any, Record<string, any>>>;
    getOrgs(user: User): Promise<({
        subscription: {
            createdAt: Date;
            subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
            totalChannels: number;
            isLifetime: boolean;
        };
        users: {
            disabled: boolean;
            role: import(".prisma/client").$Enums.Role;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string | null;
        paymentId: string | null;
        allowTrial: boolean;
        isTrailing: boolean;
    })[]>;
    changeOrg(id: string, response: Response): void;
    logout(response: Response): void;
    trackEvent(res: Response, req: Request, user: User, ip: string, userAgent: string, body: {
        tt: TrackEnum;
        fbclid: string;
        additional: Record<string, any>;
    }): Promise<void>;
}
