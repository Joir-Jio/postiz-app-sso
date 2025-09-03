import { Integration } from '@prisma/client';
export declare class RefreshToken {
    identifier: string;
    json: string;
    body: BodyInit;
    message: string;
    constructor(identifier: string, json: string, body: BodyInit, message?: string);
}
export declare class BadBody {
    identifier: string;
    json: string;
    body: BodyInit;
    message: string;
    constructor(identifier: string, json: string, body: BodyInit, message?: string);
}
export declare class NotEnoughScopes {
    message: string;
    constructor(message?: string);
}
export declare abstract class SocialAbstract {
    abstract identifier: string;
    maxConcurrentJob: number;
    handleErrors(body: string): {
        type: 'refresh-token' | 'bad-body' | 'retry';
        value: string;
    } | undefined;
    mention(token: string, d: {
        query: string;
    }, id: string, integration: Integration): Promise<{
        id: string;
        label: string;
        image: string;
        doNotCache?: boolean;
    }[] | {
        none: true;
    }>;
    runInConcurrent<T>(func: (...args: any[]) => Promise<T>, ignoreConcurrency?: boolean): Promise<any>;
    fetch(url: string, options?: RequestInit, identifier?: string, totalRetries?: number, ignoreConcurrency?: boolean): Promise<Response>;
    checkScopes(required: string[], got: string | string[]): boolean;
}
