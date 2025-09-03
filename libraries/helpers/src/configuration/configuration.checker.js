"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationChecker = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const dotenv = tslib_1.__importStar(require("dotenv"));
const path_1 = require("path");
class ConfigurationChecker {
    constructor() {
        this.issues = [];
    }
    readEnvFromFile() {
        const envFile = (0, path_1.resolve)(__dirname, '../../../.env');
        if (!(0, fs_1.existsSync)(envFile)) {
            console.error('Env file not found!: ', envFile);
            return;
        }
        const handle = (0, fs_1.readFileSync)(envFile, 'utf-8');
        this.cfg = dotenv.parse(handle);
    }
    readEnvFromProcess() {
        this.cfg = process.env;
    }
    check() {
        this.checkDatabaseServers();
        this.checkNonEmpty('JWT_SECRET');
        this.checkIsValidUrl('MAIN_URL');
        this.checkIsValidUrl('FRONTEND_URL');
        this.checkIsValidUrl('NEXT_PUBLIC_BACKEND_URL');
        this.checkIsValidUrl('BACKEND_INTERNAL_URL');
        this.checkNonEmpty('STORAGE_PROVIDER', 'Needed to setup storage.');
    }
    checkNonEmpty(key, description) {
        const v = this.get(key);
        if (!description) {
            description = '';
        }
        if (!v) {
            this.issues.push(key + ' not set. ' + description);
            return false;
        }
        if (v.length === 0) {
            this.issues.push(key + ' is empty.' + description);
            return false;
        }
        return true;
    }
    get(key) {
        return this.cfg[key];
    }
    checkDatabaseServers() {
        this.checkRedis();
        this.checkIsValidUrl('DATABASE_URL');
    }
    checkRedis() {
        if (!this.cfg.REDIS_URL) {
            this.issues.push('REDIS_URL not set');
        }
        try {
            const redisUrl = new URL(this.cfg.REDIS_URL);
            if (redisUrl.protocol !== 'redis:') {
                this.issues.push('REDIS_URL must start with redis://');
            }
        }
        catch (error) {
            this.issues.push('REDIS_URL is not a valid URL');
        }
    }
    checkIsValidUrl(key) {
        if (!this.checkNonEmpty(key)) {
            return;
        }
        const urlString = this.get(key);
        try {
            new URL(urlString);
        }
        catch (error) {
            this.issues.push(key + ' is not a valid URL');
        }
        if (urlString.endsWith('/')) {
            this.issues.push(key + ' should not end with /');
        }
    }
    hasIssues() {
        return this.issues.length > 0;
    }
    getIssues() {
        return this.issues;
    }
    getIssuesCount() {
        return this.issues.length;
    }
}
exports.ConfigurationChecker = ConfigurationChecker;
//# sourceMappingURL=configuration.checker.js.map