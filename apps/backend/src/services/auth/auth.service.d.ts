import { Provider } from '@prisma/client';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
import { LoginUserDto } from '@gitroom/nestjs-libraries/dtos/auth/login.user.dto';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
import { ForgotReturnPasswordDto } from '@gitroom/nestjs-libraries/dtos/auth/forgot-return.password.dto';
import { EmailService } from '@gitroom/nestjs-libraries/services/email.service';
export declare class AuthService {
    private _userService;
    private _organizationService;
    private _notificationService;
    private _emailService;
    constructor(_userService: UsersService, _organizationService: OrganizationService, _notificationService: NotificationService, _emailService: EmailService);
    canRegister(provider: string): Promise<boolean>;
    routeAuth(provider: Provider, body: CreateOrgUserDto | LoginUserDto, ip: string, userAgent: string, addToOrg?: boolean | {
        orgId: string;
        role: 'USER' | 'ADMIN';
        id: string;
    }): Promise<{
        addedOrg: boolean | {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            disabled: boolean;
            role: import(".prisma/client").$Enums.Role;
        };
        jwt: string;
    }>;
    getOrgFromCookie(cookie?: string): false | {
        email: string;
        role: "USER" | "ADMIN";
        orgId: string;
        id: string;
    };
    private loginOrRegisterProvider;
    forgot(email: string): Promise<boolean>;
    forgotReturn(body: ForgotReturnPasswordDto): false | import(".prisma/client").Prisma.Prisma__UserClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    activate(code: string): Promise<string | false>;
    oauthLink(provider: string, query?: any): string | Promise<string>;
    checkExists(provider: string, code: string): Promise<{
        jwt: string;
        token?: undefined;
    } | {
        token: string;
        jwt?: undefined;
    }>;
    private jwt;
}
