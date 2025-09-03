import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { MainMcp } from '@gitroom/backend/mcp/main.mcp';
export declare class McpSettings {
    private _server;
    createServer(organization: string, service: MainMcp): this;
    server(): McpServer;
    static load(organization: string, service: MainMcp): McpSettings;
}
