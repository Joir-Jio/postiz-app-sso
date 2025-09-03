export declare class Integrations {
    id: string;
}
export declare class AutopostDto {
    title: string;
    content: string;
    lastUrl: string;
    onSlot: boolean;
    syncLast: boolean;
    url: string;
    active: boolean;
    addPicture: boolean;
    generateContent: boolean;
    integrations: Integrations[];
}
