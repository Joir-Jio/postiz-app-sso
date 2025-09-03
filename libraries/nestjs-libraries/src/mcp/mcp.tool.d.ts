import { ZodRawShape } from 'zod';
export declare function McpTool(params: {
    toolName: string;
    zod?: ZodRawShape;
}): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
export declare function McpPrompt(params: {
    promptName: string;
    zod?: ZodRawShape;
}): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
