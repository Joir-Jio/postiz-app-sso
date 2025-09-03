"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const main_mcp_1 = require("@gitroom/backend/mcp/main.mcp");
let McpModule = class McpModule {
};
exports.McpModule = McpModule;
exports.McpModule = McpModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        controllers: [],
        providers: [main_mcp_1.MainMcp],
        get exports() {
            return [...this.providers];
        },
    })
], McpModule);
//# sourceMappingURL=mcp.module.js.map