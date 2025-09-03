import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { Queue, QueueEvents } from 'bullmq';
export declare class BullMqClient extends ClientProxy {
    queues: Map<string, Queue<any, any, string, any, any, string>>;
    queueEvents: Map<string, QueueEvents>;
    connect(): Promise<any>;
    close(): Promise<void>;
    publish(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): () => void;
    delete(pattern: string, jobId: string): Promise<number>;
    deleteScheduler(pattern: string, jobId: string): Promise<boolean>;
    publishAsync(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): Promise<void>;
    getQueueEvents(pattern: string): QueueEvents;
    getQueue(pattern: string): Queue<any, any, string, any, any, string>;
    checkForStuckWaitingJobs(queueName: string): Promise<{
        valid: boolean;
    }>;
    dispatchEvent(packet: ReadPacket<any>): Promise<any>;
}
