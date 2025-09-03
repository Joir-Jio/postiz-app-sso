import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage } from '@gitroom/nestjs-libraries/mcp/mcp.types';
export declare class McpTransport implements Transport {
    private _organization;
    constructor(_organization: string);
    onclose?: () => void;
    onerror?: (error: Error) => void;
    onmessage?: (message: JSONRPCMessage) => void;
    start(): Promise<void>;
    send(message: JSONRPCMessage): Promise<void>;
    close(): Promise<void>;
    handlePostMessage(message: any): void;
    get sessionId(): string;
}
