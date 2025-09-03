import { Organization } from '@prisma/client';
import { WebhooksService } from '@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { UpdateDto, WebhooksDto } from '@gitroom/nestjs-libraries/dtos/webhooks/webhooks.dto';
export declare class WebhookController {
    private _webhooksService;
    constructor(_webhooksService: WebhooksService);
    getStatistics(org: Organization): Promise<({
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
    createAWebhook(org: Organization, body: WebhooksDto): Promise<{
        id: string;
    }>;
    updateWebhook(org: Organization, body: UpdateDto): Promise<{
        id: string;
    }>;
    deleteWebhook(org: Organization, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        url: string;
    }>;
    sendWebhook(body: any, url: string): Promise<{
        send: boolean;
    }>;
}
