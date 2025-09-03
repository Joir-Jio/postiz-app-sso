import { ShortLinking } from '@gitroom/nestjs-libraries/short-linking/short-linking.interface';
export declare class Empty implements ShortLinking {
    shortLinkDomain: string;
    linksStatistics(links: string[]): Promise<any[]>;
    convertLinkToShortLink(link: string): Promise<string>;
    convertShortLinkToLink(shortLink: string): Promise<string>;
    getAllLinksStatistics(id: string, page: number): Promise<{
        short: string;
        original: string;
        clicks: string;
    }[]>;
}
