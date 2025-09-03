import { Type } from '@nestjs/common';
export type URL = string;
export declare abstract class VideoAbstract<T> {
    dto: Type<T>;
    processAndValidate(customParams?: T): Promise<void>;
    abstract process(output: 'vertical' | 'horizontal', customParams?: T): Promise<URL>;
}
export interface VideoParams {
    identifier: string;
    title: string;
    description: string;
    placement: 'text-to-image' | 'image-to-video' | 'video-to-video';
    available: boolean;
    trial: boolean;
}
export declare function ExposeVideoFunction(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Video(params: VideoParams): (target: any) => void;
