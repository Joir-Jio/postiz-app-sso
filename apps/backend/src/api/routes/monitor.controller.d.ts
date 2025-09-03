import { BullMqClient } from '@gitroom/nestjs-libraries/bull-mq-transport-new/client';
export declare class MonitorController {
    private _workerServiceProducer;
    constructor(_workerServiceProducer: BullMqClient);
    getMessagesGroup(name: string): Promise<{
        status: string;
        message: string;
    }>;
}
