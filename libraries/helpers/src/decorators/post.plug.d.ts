import 'reflect-metadata';
export declare function PostPlug(params: {
    identifier: string;
    title: string;
    disabled?: boolean;
    description: string;
    pickIntegration: string[];
    fields: {
        name: string;
        description: string;
        type: string;
        placeholder: string;
        validation?: RegExp;
    }[];
}): (target: Object, propertyKey: string | symbol, descriptor: any) => void;
