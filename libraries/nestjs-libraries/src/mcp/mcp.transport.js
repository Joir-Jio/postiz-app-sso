"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTransport = void 0;
const mcp_service_1 = require("@gitroom/nestjs-libraries/mcp/mcp.service");
const mcp_types_1 = require("@gitroom/nestjs-libraries/mcp/mcp.types");
class McpTransport {
    constructor(_organization) {
        this._organization = _organization;
    }
    async start() { }
    async send(message) {
        mcp_service_1.McpService.event.emit(`organization-${this._organization}`, {
            type: 'message',
            data: JSON.stringify(message),
        });
    }
    async close() {
        mcp_service_1.McpService.event.removeAllListeners(`organization-${this._organization}`);
    }
    handlePostMessage(message) {
        var _a, _b;
        let parsedMessage;
        try {
            parsedMessage = mcp_types_1.JSONRPCMessageSchema.parse(message);
        }
        catch (error) {
            (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, error);
            throw error;
        }
        (_b = this.onmessage) === null || _b === void 0 ? void 0 : _b.call(this, parsedMessage);
    }
    get sessionId() {
        return this._organization;
    }
}
exports.McpTransport = McpTransport;
//# sourceMappingURL=mcp.transport.js.map