export declare const concurrency: <T>(identifier: string, maxConcurrent: number, func: (...args: any[]) => Promise<T>, ignoreConcurrency?: boolean) => Promise<T>;
