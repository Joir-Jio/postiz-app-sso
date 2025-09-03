"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubProvider = void 0;
class GithubProvider {
    generateLink() {
        return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/settings`)}`;
    }
    async getToken(code) {
        const { access_token } = await (await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.FRONTEND_URL}/settings`,
            }),
        })).json();
        return access_token;
    }
    async getUser(access_token) {
        const data = await (await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const [{ email }] = await (await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        return {
            email: email,
            id: String(data.id),
        };
    }
}
exports.GithubProvider = GithubProvider;
//# sourceMappingURL=github.provider.js.map