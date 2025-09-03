"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieUrlFromDomain = getCookieUrlFromDomain;
const tldts_1 = require("tldts");
function getCookieUrlFromDomain(domain) {
    const url = (0, tldts_1.parse)(domain);
    return url.domain ? '.' + url.domain : url.hostname;
}
//# sourceMappingURL=subdomain.management.js.map