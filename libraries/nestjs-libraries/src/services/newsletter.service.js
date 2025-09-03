"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
class NewsletterService {
    static async register(email) {
        if (!process.env.BEEHIIVE_API_KEY ||
            !process.env.BEEHIIVE_PUBLICATION_ID ||
            process.env.NODE_ENV === 'development' ||
            email.indexOf('@') === -1) {
            return;
        }
        const body = {
            email,
            reactivate_existing: false,
            send_welcome_email: true,
            utm_source: 'gitroom_platform',
        };
        await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIVE_PUBLICATION_ID}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.BEEHIIVE_API_KEY}`,
            },
            body: JSON.stringify(body),
        });
    }
}
exports.NewsletterService = NewsletterService;
//# sourceMappingURL=newsletter.service.js.map