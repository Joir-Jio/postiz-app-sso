import { McpService } from '@gitroom/nestjs-libraries/mcp/mcp.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
export declare class McpController {
    private _mcpService;
    private _organizationService;
    constructor(_mcpService: McpService, _organizationService: OrganizationService);
    sse(api: string): Promise<import("rxjs").Observable<unknown>>;
    post(api: string, body: any): Promise<{}>;
}
