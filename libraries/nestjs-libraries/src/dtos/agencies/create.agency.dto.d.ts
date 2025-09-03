export declare class CreateAgencyLogoDto {
    id: string;
    path: string;
}
export declare class CreateAgencyDto {
    name: string;
    website: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedIn: string;
    youtube: string;
    tiktok: string;
    logo: CreateAgencyLogoDto;
    shortDescription: string;
    description: string;
    niches: string[];
}
