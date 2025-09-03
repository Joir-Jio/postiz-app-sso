"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/client");
let MonitorController = class MonitorController {
    constructor(_workerServiceProducer) {
        this._workerServiceProducer = _workerServiceProducer;
    }
    async getMessagesGroup(name) {
        const { valid } = await this._workerServiceProducer.checkForStuckWaitingJobs(name);
        if (valid) {
            return {
                status: 'success',
                message: `Queue ${name} is healthy.`,
            };
        }
        throw new common_1.HttpException({
            status: 'error',
            message: `Queue ${name} has stuck waiting jobs.`,
        }, 503);
    }
};
exports.MonitorController = MonitorController;
tslib_1.__decorate([
    (0, common_1.Get)('/queue/:name'),
    tslib_1.__param(0, (0, common_1.Param)('name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MonitorController.prototype, "getMessagesGroup", null);
exports.MonitorController = MonitorController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Monitor'),
    (0, common_1.Controller)('/monitor'),
    tslib_1.__metadata("design:paramtypes", [client_1.BullMqClient])
], MonitorController);
//# sourceMappingURL=monitor.controller.js.map