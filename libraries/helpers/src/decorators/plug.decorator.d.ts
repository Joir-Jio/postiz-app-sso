import 'reflect-metadata';
export declare function Plug(params: {
    identifier: string;
    title: string;
    description: string;
    runEveryMilliseconds: number;
    totalRuns: number;
    disabled?: boolean;
    fields: {
        name: string;
        description: string;
        type: string;
        placeholder: string;
        validation?: RegExp;
    }[];
}): (target: Object, propertyKey: string | symbol, descriptor: any) => void;
