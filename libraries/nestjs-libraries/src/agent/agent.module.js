"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const agent_graph_service_1 = require("@gitroom/nestjs-libraries/agent/agent.graph.service");
const agent_graph_insert_service_1 = require("@gitroom/nestjs-libraries/agent/agent.graph.insert.service");
let AgentModule = class AgentModule {
};
exports.AgentModule = AgentModule;
exports.AgentModule = AgentModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [agent_graph_service_1.AgentGraphService, agent_graph_insert_service_1.AgentGraphInsertService],
        get exports() {
            return this.providers;
        },
    })
], AgentModule);
//# sourceMappingURL=agent.module.js.map