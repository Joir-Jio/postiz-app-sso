"use strict";
var McpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const events_1 = tslib_1.__importDefault(require("events"));
const rxjs_1 = require("rxjs");
const mcp_transport_1 = require("@gitroom/nestjs-libraries/mcp/mcp.transport");
const mcp_types_1 = require("@gitroom/nestjs-libraries/mcp/mcp.types");
const mcp_settings_1 = require("@gitroom/nestjs-libraries/mcp/mcp.settings");
const main_mcp_1 = require("@gitroom/backend/mcp/main.mcp");
let McpService = McpService_1 = class McpService {
    constructor(_mainMcp) {
        this._mainMcp = _mainMcp;
    }
    async runServer(apiKey, organization) {
        const server = mcp_settings_1.McpSettings.load(organization, this._mainMcp).server();
        const transport = new mcp_transport_1.McpTransport(organization);
        const observer = (0, rxjs_1.fromEvent)(McpService_1.event, `organization-${organization}`).pipe((0, rxjs_1.startWith)({
            type: 'endpoint',
            data: process.env.NEXT_PUBLIC_BACKEND_URL + '/mcp/' + apiKey + '/messages',
        }), (0, rxjs_1.finalize)(() => {
            transport.close();
        }));
        await server.connect(transport);
        return observer;
    }
    async processPostBody(organization, body) {
        const server = mcp_settings_1.McpSettings.load(organization, this._mainMcp).server();
        const message = mcp_types_1.JSONRPCMessageSchema.parse(body);
        const transport = new mcp_transport_1.McpTransport(organization);
        await server.connect(transport);
        transport.handlePostMessage(message);
        return {};
    }
};
exports.McpService = McpService;
McpService.event = new events_1.default();
exports.McpService = McpService = McpService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [main_mcp_1.MainMcp])
], McpService);
//# sourceMappingURL=mcp.service.js.map