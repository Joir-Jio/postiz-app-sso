"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqClient = void 0;
const tslib_1 = require("tslib");
const microservices_1 = require("@nestjs/microservices");
const bullmq_1 = require("bullmq");
const redis_service_1 = require("@gitroom/nestjs-libraries/redis/redis.service");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
let BullMqClient = class BullMqClient extends microservices_1.ClientProxy {
    constructor() {
        super(...arguments);
        this.queues = new Map();
        this.queueEvents = new Map();
    }
    async connect() {
        return;
    }
    async close() {
        return;
    }
    publish(packet, callback) {
        return () => console.log('sent');
    }
    delete(pattern, jobId) {
        const queue = this.getQueue(pattern);
        return queue.remove(jobId);
    }
    deleteScheduler(pattern, jobId) {
        const queue = this.getQueue(pattern);
        return queue.removeJobScheduler(jobId);
    }
    async publishAsync(packet, callback) {
        var _a;
        const queue = this.getQueue(packet.pattern);
        const queueEvents = this.getQueueEvents(packet.pattern);
        const job = await queue.add(packet.pattern, packet.data, Object.assign(Object.assign({ jobId: (_a = packet.data.id) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)() }, packet.data.options), { removeOnComplete: !packet.data.options.attempts, removeOnFail: !packet.data.options.attempts }));
        try {
            await job.waitUntilFinished(queueEvents);
            console.log('success');
            callback({ response: job.returnvalue, isDisposed: true });
        }
        catch (err) {
            console.log('err');
            callback({ err, isDisposed: true });
        }
    }
    getQueueEvents(pattern) {
        return (this.queueEvents.get(pattern) ||
            new bullmq_1.QueueEvents(pattern, {
                connection: redis_service_1.ioRedis,
            }));
    }
    getQueue(pattern) {
        return (this.queues.get(pattern) ||
            new bullmq_1.Queue(pattern, {
                connection: redis_service_1.ioRedis,
            }));
    }
    async checkForStuckWaitingJobs(queueName) {
        const queue = this.getQueue(queueName);
        const getJobs = await queue.getJobs('waiting');
        const now = Date.now();
        const thresholdMs = 60 * 60 * 1000;
        return {
            valid: !getJobs.some((job) => {
                const age = now - job.timestamp;
                return age > thresholdMs;
            }),
        };
    }
    async dispatchEvent(packet) {
        var _a, _b, _c, _d;
        console.log('event to dispatch: ', packet);
        const queue = this.getQueue(packet.pattern);
        if ((_b = (_a = packet === null || packet === void 0 ? void 0 : packet.data) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.every) {
            const { every, immediately } = packet.data.options;
            const id = (_c = packet.data.id) !== null && _c !== void 0 ? _c : (0, uuid_1.v4)();
            await queue.upsertJobScheduler(id, Object.assign({ every }, (immediately ? { immediately } : {})), {
                name: id,
                data: packet.data,
                opts: {
                    removeOnComplete: true,
                    removeOnFail: true,
                },
            });
            return;
        }
        await queue.add(packet.pattern, packet.data, Object.assign(Object.assign({ jobId: (_d = packet.data.id) !== null && _d !== void 0 ? _d : (0, uuid_1.v4)() }, packet.data.options), { removeOnComplete: true, removeOnFail: true }));
    }
};
exports.BullMqClient = BullMqClient;
exports.BullMqClient = BullMqClient = tslib_1.__decorate([
    (0, common_1.Injectable)()
], BullMqClient);
//# sourceMappingURL=client.js.map