"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const nostr_tools_1 = require("nostr-tools");
const ws_1 = tslib_1.__importDefault(require("ws"));
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
global.WebSocket = ws_1.default;
const list = [
    'wss://relay.primal.net',
    'wss://relay.damus.io',
    'wss://relay.snort.social',
    'wss://nostr.wine',
    'wss://nos.lol',
    'wss://relay.primal.net',
];
class NostrProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 5;
        this.identifier = 'nostr';
        this.name = 'Nostr';
        this.isBetweenSteps = false;
        this.scopes = [];
        this.editor = 'normal';
    }
    async customFields() {
        return [
            {
                key: 'password',
                label: 'Nostr private key',
                validation: `/^.{3,}$/`,
                type: 'password',
            },
        ];
    }
    async refreshToken(refresh_token) {
        return {
            refreshToken: '',
            expiresIn: 0,
            accessToken: '',
            id: '',
            name: '',
            picture: '',
            username: '',
        };
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(17);
        return {
            url: '',
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async findRelayInformation(pubkey) {
        for (const relay of list) {
            const relayInstance = await nostr_tools_1.Relay.connect(relay);
            const value = await new Promise((resolve) => {
                console.log('connecting');
                relayInstance.subscribe([{ kinds: [0], authors: [pubkey] }], {
                    eoseTimeout: 6000,
                    onevent: (event) => {
                        resolve(event);
                    },
                    oneose: () => {
                        resolve({});
                    },
                    onclose: () => {
                        resolve({});
                    },
                });
            });
            relayInstance.close();
            const content = JSON.parse((value === null || value === void 0 ? void 0 : value.content) || '{}');
            if (content.name || content.displayName || content.display_name) {
                return content;
            }
        }
        return {};
    }
    async publish(pubkey, event) {
        let id = '';
        for (const relay of list) {
            try {
                const relayInstance = await nostr_tools_1.Relay.connect(relay);
                const value = new Promise((resolve) => {
                    relayInstance.subscribe([{ kinds: [1], authors: [pubkey] }], {
                        eoseTimeout: 6000,
                        onevent: (event) => {
                            resolve(event);
                        },
                        oneose: () => {
                            resolve({});
                        },
                        onclose: () => {
                            resolve({});
                        },
                    });
                });
                await relayInstance.publish(event);
                const all = await value;
                relayInstance.close();
                id = id || (all === null || all === void 0 ? void 0 : all.id);
            }
            catch (err) {
            }
        }
        return id;
    }
    async authenticate(params) {
        try {
            const body = JSON.parse(Buffer.from(params.code, 'base64').toString());
            const pubkey = (0, nostr_tools_1.getPublicKey)(Uint8Array.from(body.password.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))));
            const user = await this.findRelayInformation(pubkey);
            return {
                id: String(user.pubkey),
                name: user.display_name || user.displayName || 'No Name',
                accessToken: auth_service_1.AuthService.signJWT({ password: body.password }),
                refreshToken: '',
                expiresIn: (0, dayjs_1.default)().add(200, 'year').unix() - (0, dayjs_1.default)().unix(),
                picture: (user === null || user === void 0 ? void 0 : user.picture) || '',
                username: user.name || 'nousername',
            };
        }
        catch (e) {
            console.log(e);
            return 'Invalid credentials';
        }
    }
    async post(id, accessToken, postDetails) {
        var _a;
        const { password } = auth_service_1.AuthService.verifyJWT(accessToken);
        let lastId = '';
        const ids = [];
        for (const post of postDetails) {
            const textEvent = (0, nostr_tools_1.finalizeEvent)({
                kind: 1,
                content: post.message + '\n\n' + ((_a = post.media) === null || _a === void 0 ? void 0 : _a.map((m) => m.path).join('\n\n')),
                tags: [
                    ...(lastId
                        ? [
                            ['e', lastId, '', 'reply'],
                            ['p', id],
                        ]
                        : []),
                ],
                created_at: Math.floor(Date.now() / 1000),
            }, password);
            lastId = await this.publish(id, textEvent);
            ids.push({
                id: post.id,
                postId: String(lastId),
                releaseURL: `https://primal.net/e/${lastId}`,
                status: 'completed',
            });
        }
        return ids;
    }
}
exports.NostrProvider = NostrProvider;
//# sourceMappingURL=nostr.provider.js.map