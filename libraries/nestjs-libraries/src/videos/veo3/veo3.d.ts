import { URL, VideoAbstract } from '@gitroom/nestjs-libraries/videos/video.interface';
declare class Image {
    id: string;
    path: string;
}
declare class Params {
    prompt: string;
    images: Image[];
}
export declare class Veo3 extends VideoAbstract<Params> {
    dto: typeof Params;
    process(output: 'vertical' | 'horizontal', customParams: Params): Promise<URL>;
}
export {};
