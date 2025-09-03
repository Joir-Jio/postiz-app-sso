import EventEmitter from 'events';
import { MainMcp } from '@gitroom/backend/mcp/main.mcp';
export declare class McpService {
    private _mainMcp;
    static event: EventEmitter;
    constructor(_mainMcp: MainMcp);
    runServer(apiKey: string, organization: string): Promise<import("rxjs").Observable<unknown>>;
    processPostBody(organization: string, body: object): Promise<{}>;
}
