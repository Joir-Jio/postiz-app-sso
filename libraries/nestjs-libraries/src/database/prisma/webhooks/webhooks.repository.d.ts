import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { WebhooksDto } from '@gitroom/nestjs-libraries/dtos/webhooks/webhooks.dto';
export declare class WebhooksRepository {
    private _webhooks;
    constructor(_webhooks: PrismaRepository<'webhooks'>);
    getTotal(orgId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    getWebhooks(orgId: string): import(".prisma/client").Prisma.PrismaPromise<({
        integrations: {
            integration: {
                id: string;
                name: string;
                picture: string;
            };
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        url: string;
    })[]>;
    deleteWebhook(orgId: string, id: string): import(".prisma/client").Prisma.Prisma__WebhooksClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        url: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createWebhook(orgId: string, body: WebhooksDto): Promise<{
        id: string;
    }>;
}
