export declare class WebhooksIntegrationDto {
    id: string;
}
export declare class WebhooksDto {
    id: string;
    name: string;
    url: string;
    integrations: WebhooksIntegrationDto[];
}
export declare class UpdateDto {
    id: string;
    name: string;
    url: string;
    integrations: WebhooksIntegrationDto[];
}
