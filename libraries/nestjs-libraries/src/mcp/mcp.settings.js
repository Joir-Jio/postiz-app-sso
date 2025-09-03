"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpSettings = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const main_mcp_1 = require("@gitroom/backend/mcp/main.mcp");
const integration_manager_1 = require("@gitroom/nestjs-libraries/integrations/integration.manager");
class McpSettings {
    createServer(organization, service) {
        this._server = new mcp_js_1.McpServer({
            name: 'Postiz',
            version: '2.0.0',
        }, {
            instructions: `Postiz is a service to schedule social media posts for ${integration_manager_1.socialIntegrationList
                .map((p) => p.name)
                .join(', ')} to schedule you need to have the providerId (you can get it from POSTIZ_PROVIDERS_LIST), user need to specify the schedule date (or now), text, you also can send base64 images and text for the comments. When you get POSTIZ_PROVIDERS_LIST, always display all the options to the user`,
        });
        for (const usePrompt of Reflect.getMetadata('MCP_PROMPT', main_mcp_1.MainMcp.prototype) || []) {
            const list = [
                usePrompt.data.promptName,
                usePrompt.data.zod,
                async (...args) => {
                    return {
                        messages: await service[usePrompt.func](organization, ...args),
                    };
                },
            ].filter((f) => f);
            this._server.prompt(...list);
        }
        for (const usePrompt of Reflect.getMetadata('MCP_TOOL', main_mcp_1.MainMcp.prototype) || []) {
            const list = [
                usePrompt.data.toolName,
                usePrompt.data.zod,
                async (...args) => {
                    return {
                        content: await service[usePrompt.func](organization, ...args),
                    };
                },
            ].filter((f) => f);
            this._server.tool(...list);
        }
        return this;
    }
    server() {
        return this._server;
    }
    static load(organization, service) {
        return new McpSettings().createServer(organization, service);
    }
}
exports.McpSettings = McpSettings;
//# sourceMappingURL=mcp.settings.js.map