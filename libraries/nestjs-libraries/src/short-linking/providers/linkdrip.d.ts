import { ShortLinking } from '@gitroom/nestjs-libraries/short-linking/short-linking.interface';
export declare class LinkDrip implements ShortLinking {
    shortLinkDomain: string;
    linksStatistics(links: string[]): Promise<any[]>;
    convertLinkToShortLink(id: string, link: string): Promise<any>;
    convertShortLinkToLink(shortLink: string): Promise<string>;
    getAllLinksStatistics(id: string, page: number): Promise<{
        short: string;
        original: string;
        clicks: string;
    }[]>;
}
