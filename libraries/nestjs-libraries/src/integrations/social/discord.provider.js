"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordProvider = void 0;
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
class DiscordProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 5;
        this.identifier = 'discord';
        this.name = 'Discord';
        this.isBetweenSteps = false;
        this.editor = 'markdown';
        this.scopes = ['identify', 'guilds'];
    }
    async refreshToken(refreshToken) {
        const { access_token, expires_in, refresh_token } = await (await this.fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(process.env.DISCORD_CLIENT_ID +
                    ':' +
                    process.env.DISCORD_CLIENT_SECRET).toString('base64')}`,
            },
        })).json();
        const { application } = await (await fetch('https://discord.com/api/oauth2/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            refreshToken: refresh_token,
            expiresIn: expires_in,
            accessToken: access_token,
            id: '',
            name: application.name,
            picture: '',
            username: '',
        };
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        return {
            url: `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=377957124096&response_type=code&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/discord`)}&integration_type=0&scope=bot+identify+guilds&state=${state}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        const { access_token, expires_in, refresh_token, scope, guild } = await (await this.fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                code: params.code,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/discord`,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(process.env.DISCORD_CLIENT_ID +
                    ':' +
                    process.env.DISCORD_CLIENT_SECRET).toString('base64')}`,
            },
        })).json();
        this.checkScopes(this.scopes, scope.split(' '));
        const { application } = await (await fetch('https://discord.com/api/oauth2/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            id: guild.id,
            name: application.name,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            picture: `https://cdn.discordapp.com/avatars/${application.bot.id}/${application.bot.avatar}.png`,
            username: application.bot.username,
        };
    }
    async channels(accessToken, params, id) {
        const list = await (await fetch(`https://discord.com/api/guilds/${id}/channels`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN_ID}`,
            },
        })).json();
        return list
            .filter((p) => p.type === 0 || p.type === 5 || p.type === 15)
            .map((p) => ({
            id: String(p.id),
            name: p.name,
        }));
    }
    async post(id, accessToken, postDetails) {
        var _a;
        let channel = postDetails[0].settings.channel;
        if (postDetails.length > 1) {
            const { id: threadId } = await (await fetch(`https://discord.com/api/channels/${postDetails[0].settings.channel}/threads`, {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN_ID}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: postDetails[0].message,
                    auto_archive_duration: 1440,
                    type: 11,
                }),
            })).json();
            channel = threadId;
        }
        const finalData = [];
        for (const post of postDetails) {
            const form = new FormData();
            form.append('payload_json', JSON.stringify({
                content: post.message.replace(/\[\[\[(@.*?)]]]/g, (match, p1) => {
                    return `<${p1}>`;
                }),
                attachments: (_a = post.media) === null || _a === void 0 ? void 0 : _a.map((p, index) => ({
                    id: index,
                    description: `Picture ${index}`,
                    filename: p.path.split('/').pop(),
                })),
            }));
            let index = 0;
            for (const media of post.media || []) {
                const loadMedia = await fetch(media.path);
                form.append(`files[${index}]`, await loadMedia.blob(), media.path.split('/').pop());
                index++;
            }
            const data = await (await fetch(`https://discord.com/api/channels/${channel}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN_ID}`,
                },
                body: form,
            })).json();
            finalData.push({
                id: post.id,
                releaseURL: `https://discord.com/channels/${id}/${channel}/${data.id}`,
                postId: data.id,
                status: 'success',
            });
        }
        return finalData;
    }
    async changeNickname(id, accessToken, name) {
        await (await fetch(`https://discord.com/api/guilds/${id}/members/@me`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN_ID}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nick: name,
            }),
        })).json();
        return {
            name,
        };
    }
    async mention(token, data, id, integration) {
        const allRoles = await (await fetch(`https://discord.com/api/guilds/${id}/roles`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN_ID}`,
                'Content-Type': 'application/json',
            },
        })).json();
        const matching = allRoles
            .filter((role) => role.name.toLowerCase().includes(data.query.toLowerCase()))
            .filter((f) => f.name !== '@everyone' && f.name !== '@here');
        const list = await (await fetch(`https://discord.com/api/guilds/${id}/members/search?query=${data.query}`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN_ID}`,
                'Content-Type': 'application/json',
            },
        })).json();
        return [
            ...[
                {
                    id: String('here'),
                    label: 'here',
                    image: '',
                    doNotCache: true,
                },
                {
                    id: String('everyone'),
                    label: 'everyone',
                    image: '',
                    doNotCache: true,
                },
            ].filter((role) => {
                return role.label.toLowerCase().includes(data.query.toLowerCase());
            }),
            ...matching.map((p) => ({
                id: String('&' + p.id),
                label: p.name.split('@')[1],
                image: '',
                doNotCache: true,
            })),
            ...list.map((p) => ({
                id: String(p.user.id),
                label: p.user.global_name || p.user.username,
                image: `https://cdn.discordapp.com/avatars/${p.user.id}/${p.user.avatar}.png`,
            })),
        ];
    }
    mentionFormat(idOrHandle, name) {
        if (name === '@here' || name === '@everyone') {
            return name;
        }
        return `[[[@${idOrHandle.replace('@', '')}]]]`;
    }
}
exports.DiscordProvider = DiscordProvider;
//# sourceMappingURL=discord.provider.js.map