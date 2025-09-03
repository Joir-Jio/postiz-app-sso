"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortIo = void 0;
const options = {
    headers: {
        Authorization: `Bearer ${process.env.SHORT_IO_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
};
class ShortIo {
    constructor() {
        this.shortLinkDomain = 'short.io';
    }
    async linksStatistics(links) {
        return Promise.all(links.map(async (link) => {
            const url = `https://api.short.io/links/expand?domain=${this.shortLinkDomain}&path=${link.split('/').pop()}`;
            const response = await fetch(url, options).then((res) => res.json());
            const linkStatisticsUrl = `https://statistics.short.io/statistics/link/${response.id}?period=last30&tz=UTC`;
            const statResponse = await fetch(linkStatisticsUrl, options).then((res) => res.json());
            return {
                short: response.shortURL,
                original: response.originalURL,
                clicks: statResponse.totalClicks,
            };
        }));
    }
    async convertLinkToShortLink(id, link) {
        const response = await fetch(`https://api.short.io/links`, Object.assign(Object.assign({}, options), { method: 'POST', body: JSON.stringify({
                url: link,
                tenantId: id,
                domain: this.shortLinkDomain,
                originalURL: link,
            }) })).then((res) => res.json());
        return response.shortURL;
    }
    async convertShortLinkToLink(shortLink) {
        return await (await (await fetch(`https://api.short.io/links/expand?domain=${this.shortLinkDomain}&path=${shortLink.split('/').pop()}`, options)).json()).originalURL;
    }
    async getAllLinksStatistics(id, page = 1) {
        const response = await (await fetch(`https://api.short.io/api/links?domain_id=${id}&limit=150`, options)).json();
        const mapLinks = response.links.map(async (link) => {
            const linkStatisticsUrl = `https://statistics.short.io/statistics/link/${response.id}?period=last30&tz=UTC`;
            const statResponse = await fetch(linkStatisticsUrl, options).then((res) => res.json());
            return {
                short: link,
                original: response.url,
                clicks: statResponse.totalClicks,
            };
        });
        if (mapLinks.length < 100) {
            return mapLinks;
        }
        return [...mapLinks, ...(await this.getAllLinksStatistics(id, page + 1))];
    }
}
exports.ShortIo = ShortIo;
//# sourceMappingURL=short.io.js.map