"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTool = McpTool;
exports.McpPrompt = McpPrompt;
function McpTool(params) {
    return function (target, propertyKey, descriptor) {
        const existingMetadata = Reflect.getMetadata('MCP_TOOL', target) || [];
        existingMetadata.push({ data: params, func: propertyKey });
        Reflect.defineMetadata('MCP_TOOL', existingMetadata, target);
    };
}
function McpPrompt(params) {
    return function (target, propertyKey, descriptor) {
        const existingMetadata = Reflect.getMetadata('MCP_PROMPT', target) || [];
        existingMetadata.push({ data: params, func: propertyKey });
        Reflect.defineMetadata('MCP_PROMPT', existingMetadata, target);
    };
}
//# sourceMappingURL=mcp.tool.js.map