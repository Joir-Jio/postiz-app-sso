"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAbstract = exports.NotEnoughScopes = exports.BadBody = exports.RefreshToken = void 0;
const timer_1 = require("@gitroom/helpers/utils/timer");
const concurrency_service_1 = require("@gitroom/helpers/utils/concurrency.service");
class RefreshToken {
    constructor(identifier, json, body, message = '') {
        this.identifier = identifier;
        this.json = json;
        this.body = body;
        this.message = message;
    }
}
exports.RefreshToken = RefreshToken;
class BadBody {
    constructor(identifier, json, body, message = '') {
        this.identifier = identifier;
        this.json = json;
        this.body = body;
        this.message = message;
    }
}
exports.BadBody = BadBody;
class NotEnoughScopes {
    constructor(message = 'Not enough scopes') {
        this.message = message;
    }
}
exports.NotEnoughScopes = NotEnoughScopes;
class SocialAbstract {
    constructor() {
        this.maxConcurrentJob = 1;
    }
    handleErrors(body) {
        return undefined;
    }
    async mention(token, d, id, integration) {
        return { none: true };
    }
    async runInConcurrent(func, ignoreConcurrency) {
        const value = await (0, concurrency_service_1.concurrency)(this.identifier, this.maxConcurrentJob, async () => {
            try {
                return await func();
            }
            catch (err) {
                console.log(err);
                const handle = this.handleErrors(JSON.stringify(err));
                return Object.assign({ err: true }, (handle || {}));
            }
        }, ignoreConcurrency);
        if (value && (value === null || value === void 0 ? void 0 : value.err) && (value === null || value === void 0 ? void 0 : value.value)) {
            throw new BadBody('', JSON.stringify({}), {}, value.value || '');
        }
        return value;
    }
    async fetch(url, options = {}, identifier = '', totalRetries = 0, ignoreConcurrency = false) {
        const request = await (0, concurrency_service_1.concurrency)(this.identifier, this.maxConcurrentJob, () => fetch(url, options), ignoreConcurrency);
        if (request.status === 200 || request.status === 201) {
            return request;
        }
        if (totalRetries > 2) {
            throw new BadBody(identifier, '{}', options.body || '{}');
        }
        let json = '{}';
        try {
            json = await request.text();
        }
        catch (err) {
            json = '{}';
        }
        if (request.status === 429 ||
            request.status === 500 ||
            json.includes('rate_limit_exceeded') ||
            json.includes('Rate limit')) {
            await (0, timer_1.timer)(5000);
            return this.fetch(url, options, identifier, totalRetries + 1, ignoreConcurrency);
        }
        const handleError = this.handleErrors(json || '{}');
        if ((handleError === null || handleError === void 0 ? void 0 : handleError.type) === 'retry') {
            await (0, timer_1.timer)(5000);
            return this.fetch(url, options, identifier, totalRetries + 1, ignoreConcurrency);
        }
        if (request.status === 401 &&
            ((handleError === null || handleError === void 0 ? void 0 : handleError.type) === 'refresh-token' || !handleError)) {
            throw new RefreshToken(identifier, json, options.body, handleError === null || handleError === void 0 ? void 0 : handleError.value);
        }
        throw new BadBody(identifier, json, options.body, (handleError === null || handleError === void 0 ? void 0 : handleError.value) || '');
    }
    checkScopes(required, got) {
        if (Array.isArray(got)) {
            if (!required.every((scope) => got.includes(scope))) {
                throw new NotEnoughScopes();
            }
            return true;
        }
        const newGot = decodeURIComponent(got);
        const splitType = newGot.indexOf(',') > -1 ? ',' : ' ';
        const gotArray = newGot.split(splitType);
        if (!required.every((scope) => gotArray.includes(scope))) {
            throw new NotEnoughScopes();
        }
        return true;
    }
}
exports.SocialAbstract = SocialAbstract;
//# sourceMappingURL=social.abstract.js.map