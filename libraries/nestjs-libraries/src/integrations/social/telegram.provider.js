"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const mime_1 = tslib_1.__importDefault(require("mime"));
const node_telegram_bot_api_1 = tslib_1.__importDefault(require("node-telegram-bot-api"));
const striptags_1 = tslib_1.__importDefault(require("striptags"));
const telegramBot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_TOKEN);
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5000';
const mediaStorage = process.env.STORAGE_PROVIDER || 'local';
class TelegramProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 3;
        this.identifier = 'telegram';
        this.name = 'Telegram';
        this.isBetweenSteps = false;
        this.isWeb3 = true;
        this.scopes = [];
        this.editor = 'html';
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
            url: state,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        var _a;
        const chat = await telegramBot.getChat(params.code);
        console.log(JSON.stringify(chat));
        if (!(chat === null || chat === void 0 ? void 0 : chat.id)) {
            return 'No chat found';
        }
        const photo = !((_a = chat === null || chat === void 0 ? void 0 : chat.photo) === null || _a === void 0 ? void 0 : _a.big_file_id)
            ? ''
            : await telegramBot.getFileLink(chat.photo.big_file_id);
        return {
            id: String(chat.username ? chat.username : chat.id),
            name: chat.title,
            accessToken: String(chat.id),
            refreshToken: '',
            expiresIn: (0, dayjs_1.default)().add(200, 'year').unix() - (0, dayjs_1.default)().unix(),
            picture: photo || '',
            username: chat.username,
        };
    }
    async getBotId(query) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const res = await telegramBot.getUpdates(Object.assign(Object.assign({}, (query.id ? { offset: query.id } : {})), { allowed_updates: ['message', 'channel_post'] }));
        const match = res.find((p) => {
            var _a, _b, _c, _d, _e, _f;
            return (((_a = p === null || p === void 0 ? void 0 : p.message) === null || _a === void 0 ? void 0 : _a.text) === `/connect ${query.word}` &&
                ((_c = (_b = p === null || p === void 0 ? void 0 : p.message) === null || _b === void 0 ? void 0 : _b.chat) === null || _c === void 0 ? void 0 : _c.id)) ||
                (((_d = p === null || p === void 0 ? void 0 : p.channel_post) === null || _d === void 0 ? void 0 : _d.text) === `/connect ${query.word}` &&
                    ((_f = (_e = p === null || p === void 0 ? void 0 : p.channel_post) === null || _e === void 0 ? void 0 : _e.chat) === null || _f === void 0 ? void 0 : _f.id));
        });
        const chatId = ((_b = (_a = match === null || match === void 0 ? void 0 : match.message) === null || _a === void 0 ? void 0 : _a.chat) === null || _b === void 0 ? void 0 : _b.id) || ((_d = (_c = match === null || match === void 0 ? void 0 : match.channel_post) === null || _c === void 0 ? void 0 : _c.chat) === null || _d === void 0 ? void 0 : _d.id);
        if (chatId) {
            const botId = (await telegramBot.getMe()).id;
            const isAdmin = await this.botIsAdmin(chatId, botId);
            const connectMessageId = ((_e = match === null || match === void 0 ? void 0 : match.message) === null || _e === void 0 ? void 0 : _e.message_id) || ((_f = match === null || match === void 0 ? void 0 : match.channel_post) === null || _f === void 0 ? void 0 : _f.message_id);
            if (!isAdmin) {
                telegramBot.sendMessage(chatId, "Connection Successful. I don't have admin privileges to delete these messages, please go ahead and remove them yourself.");
            }
            else {
                await telegramBot.deleteMessage(chatId, connectMessageId);
                const successMessage = await telegramBot.sendMessage(chatId, 'Connection Successful. Message will be deleted in 10 seconds.');
                setTimeout(async () => {
                    await telegramBot.deleteMessage(chatId, successMessage.message_id);
                    console.log('Success message deleted.');
                }, 10000);
            }
        }
        return chatId
            ? { chatId }
            : res.length > 0
                ? {
                    lastChatId: ((_j = (_h = (_g = res === null || res === void 0 ? void 0 : res[res.length - 1]) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.chat) === null || _j === void 0 ? void 0 : _j.id) ||
                        ((_m = (_l = (_k = res === null || res === void 0 ? void 0 : res[res.length - 1]) === null || _k === void 0 ? void 0 : _k.channel_post) === null || _l === void 0 ? void 0 : _l.chat) === null || _m === void 0 ? void 0 : _m.id),
                }
                : {};
    }
    async post(id, accessToken, postDetails) {
        const ids = [];
        for (const message of postDetails) {
            let messageId = null;
            const mediaFiles = message.media || [];
            const text = (0, striptags_1.default)(message.message || '', [
                'u',
                'strong',
                'p',
            ])
                .replace(/<strong>/g, '<b>')
                .replace(/<\/strong>/g, '</b>')
                .replace(/<p>(.*?)<\/p>/g, '$1\n');
            console.log(text);
            const processedMedia = mediaFiles.map((media) => {
                let mediaUrl = media.path;
                if (mediaStorage === 'local' && mediaUrl.startsWith(frontendURL)) {
                    mediaUrl = mediaUrl.replace(frontendURL, '');
                }
                const mimeType = mime_1.default.getType(mediaUrl);
                let mediaType;
                if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('image/')) {
                    mediaType = 'photo';
                }
                else if (mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith('video/')) {
                    mediaType = 'video';
                }
                else {
                    mediaType = 'document';
                }
                return {
                    type: mediaType,
                    media: mediaUrl,
                    fileOptions: {
                        filename: media.path.split('/').pop(),
                        contentType: mimeType || 'application/octet-stream',
                    },
                };
            });
            if (processedMedia.length === 0) {
                const response = await telegramBot.sendMessage(accessToken, text, {
                    parse_mode: 'HTML',
                });
                messageId = response.message_id;
            }
            else if (processedMedia.length === 1) {
                const media = processedMedia[0];
                const response = media.type === 'video'
                    ? await telegramBot.sendVideo(accessToken, media.media, { caption: text, parse_mode: 'HTML' }, media.fileOptions)
                    : media.type === 'photo'
                        ? await telegramBot.sendPhoto(accessToken, media.media, { caption: text, parse_mode: 'HTML' }, media.fileOptions)
                        : await telegramBot.sendDocument(accessToken, media.media, { caption: text, parse_mode: 'HTML' }, media.fileOptions);
                messageId = response.message_id;
            }
            else {
                const mediaGroups = this.chunkMedia(processedMedia, 10);
                for (let i = 0; i < mediaGroups.length; i++) {
                    const mediaGroup = mediaGroups[i].map((m, index) => ({
                        type: m.type === 'document' ? 'document' : m.type,
                        media: m.media,
                        caption: i === 0 && index === 0 ? text : undefined,
                        parse_mode: 'HTML',
                    }));
                    const response = await telegramBot.sendMediaGroup(accessToken, mediaGroup);
                    if (i === 0) {
                        messageId = response[0].message_id;
                    }
                }
            }
            if (messageId) {
                ids.push({
                    id: message.id,
                    postId: String(messageId),
                    releaseURL: `https://t.me/${id !== 'undefined' ? id : `c/${accessToken.replace('-100', '')}`}/${messageId}`,
                    status: 'completed',
                });
            }
        }
        return ids;
    }
    chunkMedia(media, size) {
        const result = [];
        for (let i = 0; i < media.length; i += size) {
            result.push(media.slice(i, i + size));
        }
        return result;
    }
    async botIsAdmin(chatId, botId) {
        try {
            const chatMember = await telegramBot.getChatMember(chatId, botId);
            if (chatMember.status === 'administrator' ||
                chatMember.status === 'creator') {
                const permissions = chatMember.can_delete_messages;
                return !!permissions;
            }
            return false;
        }
        catch (error) {
            console.error('Error checking bot privileges:', error);
            return false;
        }
    }
}
exports.TelegramProvider = TelegramProvider;
//# sourceMappingURL=telegram.provider.js.map