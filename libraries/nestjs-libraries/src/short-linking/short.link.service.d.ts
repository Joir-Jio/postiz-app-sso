import { ShortLinking } from '@gitroom/nestjs-libraries/short-linking/short-linking.interface';
export declare class ShortLinkService {
    static provider: ShortLinking;
    askShortLinkedin(messages: string[]): boolean;
    convertTextToShortLinks(id: string, messagesList: string[]): Promise<string[]>;
    convertShortLinksToLinks(messages: string[]): Promise<string[]>;
    getStatistics(messages: string[]): Promise<{
        short: string;
        original: string;
        clicks: string;
    }[]>;
    getAllLinks(id: string): Promise<{
        short: string;
        original: string;
        clicks: string;
    }[]>;
}
