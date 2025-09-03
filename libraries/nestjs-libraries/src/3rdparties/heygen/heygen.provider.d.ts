import { ThirdPartyAbstract } from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';
import { OpenaiService } from '@gitroom/nestjs-libraries/openai/openai.service';
export declare class HeygenProvider extends ThirdPartyAbstract<{
    voice: string;
    avatar: string;
    aspect_ratio: string;
    captions: string;
}> {
    private _openaiService;
    constructor(_openaiService: OpenaiService);
    checkConnection(apiKey: string): Promise<false | {
        name: string;
        username: string;
        id: string;
    }>;
    generateVoice(apiKey: string, data: {
        text: string;
    }): Promise<{
        voice: string;
    }>;
    voices(apiKey: string): Promise<any>;
    avatars(apiKey: string): Promise<any[]>;
    sendData(apiKey: string, data: {
        voice: string;
        avatar: string;
        aspect_ratio: string;
        captions: string;
        selectedVoice: string;
        type: 'talking_photo' | 'avatar';
    }): Promise<string>;
}
