import * as dotenv from 'dotenv';
export declare class ConfigurationChecker {
    cfg: dotenv.DotenvParseOutput;
    issues: string[];
    readEnvFromFile(): void;
    readEnvFromProcess(): void;
    check(): void;
    checkNonEmpty(key: string, description?: string): boolean;
    get(key: string): string | undefined;
    checkDatabaseServers(): void;
    checkRedis(): void;
    checkIsValidUrl(key: string): void;
    hasIssues(): boolean;
    getIssues(): string[];
    getIssuesCount(): number;
}
