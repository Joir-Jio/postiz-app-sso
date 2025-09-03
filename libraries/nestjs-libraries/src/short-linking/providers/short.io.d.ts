import { ShortLinking } from '@gitroom/nestjs-libraries/short-linking/short-linking.interface';
export declare class ShortIo implements ShortLinking {
    shortLinkDomain: string;
    linksStatistics(links: string[]): Promise<{
        short: any;
        original: any;
        clicks: any;
    }[]>;
    convertLinkToShortLink(id: string, link: string): Promise<any>;
    convertShortLinkToLink(shortLink: string): Promise<any>;
    getAllLinksStatistics(id: string, page?: number): Promise<{
        short: string;
        original: string;
        clicks: string;
    }[]>;
}
