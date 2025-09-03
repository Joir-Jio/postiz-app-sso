export declare const stripHtmlValidation: (type: "none" | "normal" | "markdown" | "html", val: string, replaceBold?: boolean, none?: boolean, plain?: boolean, convertMentionFunction?: (idOrHandle: string, name: string) => string) => string;
export declare const convertMention: (value: string, process?: (idOrHandle: string, name: string) => string) => string;
export declare const convertToAscii: (value: string) => string;
