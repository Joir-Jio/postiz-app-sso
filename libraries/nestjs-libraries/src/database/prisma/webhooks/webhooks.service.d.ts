import { WebhooksRepository } from '@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.repository';
import { WebhooksDto } from '@gitroom/nestjs-libraries/dtos/webhooks/webhooks.dto';
import { BullMqClient } from '@gitroom/nestjs-libraries/bull-mq-transport-new/client';
import { PostsRepository } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.repository';
export declare class WebhooksService {
    private _webhooksRepository;
    private _postsRepository;
    private _workerServiceProducer;
    constructor(_webhooksRepository: WebhooksRepository, _postsRepository: PostsRepository, _workerServiceProducer: BullMqClient);
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
    createWebhook(orgId: string, body: WebhooksDto): Promise<{
        id: string;
    }>;
    deleteWebhook(orgId: string, id: string): import(".prisma/client").Prisma.Prisma__WebhooksClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        url: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    digestWebhooks(orgId: string, since: string): Promise<void>;
    fireWebhooks(orgId: string, since: string): Promise<void[]>;
}
