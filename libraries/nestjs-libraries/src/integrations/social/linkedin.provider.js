"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedinProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const sharp_1 = tslib_1.__importDefault(require("sharp"));
const mime_types_1 = require("mime-types");
const read_or_fetch_1 = require("@gitroom/helpers/utils/read.or.fetch");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const post_plug_1 = require("@gitroom/helpers/decorators/post.plug");
const image_to_pdf_1 = tslib_1.__importDefault(require("image-to-pdf"));
class LinkedinProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'linkedin';
        this.name = 'LinkedIn';
        this.oneTimeToken = true;
        this.isBetweenSteps = false;
        this.scopes = [
            'openid',
            'profile',
            'w_member_social',
            'r_basicprofile',
            'rw_organization_admin',
            'w_organization_social',
            'r_organization_social',
        ];
        this.maxConcurrentJob = 2;
        this.refreshWait = true;
        this.editor = 'normal';
    }
    async refreshToken(refresh_token) {
        const { access_token: accessToken, refresh_token: refreshToken, expires_in, } = await (await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            }),
        })).json();
        const { vanityName } = await (await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        const { name, sub: id, picture, } = await (await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            id,
            accessToken,
            refreshToken,
            expiresIn: expires_in,
            name,
            picture: picture || '',
            username: vanityName,
        };
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        const codeVerifier = (0, make_is_1.makeId)(30);
        const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&prompt=none&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/linkedin`)}&state=${state}&scope=${encodeURIComponent(this.scopes.join(' '))}`;
        return {
            url,
            codeVerifier,
            state,
        };
    }
    async authenticate(params) {
        const body = new URLSearchParams();
        body.append('grant_type', 'authorization_code');
        body.append('code', params.code);
        body.append('redirect_uri', `${process.env.FRONTEND_URL}/integrations/social/linkedin${params.refresh ? `?refresh=${params.refresh}` : ''}`);
        body.append('client_id', process.env.LINKEDIN_CLIENT_ID);
        body.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);
        const { access_token: accessToken, expires_in: expiresIn, refresh_token: refreshToken, scope, } = await (await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        })).json();
        this.checkScopes(this.scopes, scope);
        const { name, sub: id, picture, } = await (await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        const { vanityName } = await (await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            id,
            accessToken,
            refreshToken,
            expiresIn,
            name,
            picture,
            username: vanityName,
        };
    }
    async company(token, data) {
        var _a;
        const { url } = data;
        const getCompanyVanity = url.match(/^https?:\/\/(?:www\.)?linkedin\.com\/company\/([^/]+)\/?$/);
        if (!getCompanyVanity || !(getCompanyVanity === null || getCompanyVanity === void 0 ? void 0 : getCompanyVanity.length)) {
            throw new Error('Invalid LinkedIn company URL');
        }
        const { elements } = await (await fetch(`https://api.linkedin.com/v2/organizations?q=vanityName&vanityName=${getCompanyVanity[1]}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202501',
                Authorization: `Bearer ${token}`,
            },
        })).json();
        return {
            options: (_a = elements.map((e) => ({
                label: e.localizedName,
                value: `@[${e.localizedName}](urn:li:organization:${e.id})`,
            }))) === null || _a === void 0 ? void 0 : _a[0],
        };
    }
    async uploadPicture(fileName, accessToken, personId, picture, type = 'personal') {
        var _a;
        const isVideo = fileName.indexOf('mp4') > -1;
        const isPdf = fileName.toLowerCase().indexOf('pdf') > -1;
        let endpoint;
        if (isVideo) {
            endpoint = 'videos';
        }
        else if (isPdf) {
            endpoint = 'documents';
        }
        else {
            endpoint = 'images';
        }
        const _b = (await (await this.fetch(`https://api.linkedin.com/rest/${endpoint}?action=initializeUpload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202501',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                initializeUploadRequest: Object.assign({ owner: type === 'personal'
                        ? `urn:li:person:${personId}`
                        : `urn:li:organization:${personId}` }, (isVideo
                    ? {
                        fileSizeBytes: picture.length,
                        uploadCaptions: false,
                        uploadThumbnail: false,
                    }
                    : {})),
            }),
        })).json()).value, { uploadUrl, image, video, document, uploadInstructions } = _b, all = tslib_1.__rest(_b, ["uploadUrl", "image", "video", "document", "uploadInstructions"]);
        const sendUrlRequest = ((_a = uploadInstructions === null || uploadInstructions === void 0 ? void 0 : uploadInstructions[0]) === null || _a === void 0 ? void 0 : _a.uploadUrl) || uploadUrl;
        const finalOutput = video || image || document;
        const etags = [];
        for (let i = 0; i < picture.length; i += 1024 * 1024 * 2) {
            const upload = await this.fetch(sendUrlRequest, {
                method: 'PUT',
                headers: Object.assign({ 'X-Restli-Protocol-Version': '2.0.0', 'LinkedIn-Version': '202501', Authorization: `Bearer ${accessToken}` }, (isVideo
                    ? { 'Content-Type': 'application/octet-stream' }
                    : isPdf
                        ? { 'Content-Type': 'application/pdf' }
                        : {})),
                body: picture.slice(i, i + 1024 * 1024 * 2),
            }, 'linkedin', 0, true);
            etags.push(upload.headers.get('etag'));
        }
        if (isVideo) {
            const a = await this.fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
                method: 'POST',
                body: JSON.stringify({
                    finalizeUploadRequest: {
                        video,
                        uploadToken: '',
                        uploadedPartIds: etags,
                    },
                }),
                headers: {
                    'X-Restli-Protocol-Version': '2.0.0',
                    'LinkedIn-Version': '202501',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }
        return finalOutput;
    }
    fixText(text) {
        const pattern = /@\[.+?]\(urn:li:organization.+?\)/g;
        const matches = text.match(pattern) || [];
        const splitAll = text.split(pattern);
        const splitTextReformat = splitAll.map((p) => {
            return p
                .replace(/\\/g, '\\\\')
                .replace(/</g, '\\<')
                .replace(/>/g, '\\>')
                .replace(/#/g, '\\#')
                .replace(/~/g, '\\~')
                .replace(/_/g, '\\_')
                .replace(/\|/g, '\\|')
                .replace(/\[/g, '\\[')
                .replace(/]/g, '\\]')
                .replace(/\*/g, '\\*')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)')
                .replace(/\{/g, '\\{')
                .replace(/}/g, '\\}')
                .replace(/@/g, '\\@');
        });
        const connectAll = splitTextReformat.reduce((all, current) => {
            const match = matches.shift();
            all.push(current);
            if (match) {
                all.push(match);
            }
            return all;
        }, []);
        return connectAll.join('');
    }
    async convertImagesToPdfCarousel(postDetails, firstPost) {
        const allImages = postDetails.flatMap((post) => {
            var _a;
            return ((_a = post.media) === null || _a === void 0 ? void 0 : _a.filter((media) => media.path.toLowerCase().includes('.jpg') ||
                media.path.toLowerCase().includes('.jpeg') ||
                media.path.toLowerCase().includes('.png'))) || [];
        });
        if (allImages.length === 0) {
            return postDetails;
        }
        const imageData = await Promise.all(allImages.map(async (media) => {
            const buffer = await (0, read_or_fetch_1.readOrFetch)(media.path);
            const image = (0, sharp_1.default)(buffer, {
                animated: (0, mime_types_1.lookup)(media.path) === 'image/gif',
            });
            const metadata = await image.metadata();
            return {
                buffer,
                width: metadata.width || 0,
                height: metadata.height || 0,
            };
        }));
        const firstImageDimensions = imageData[0];
        const pageSize = [firstImageDimensions.width, firstImageDimensions.height];
        const pdfStream = (0, image_to_pdf_1.default)(imageData.map((data) => data.buffer), pageSize);
        const pdfBuffer = await this.streamToBuffer(pdfStream);
        const pdfMedia = {
            path: 'carousel.pdf',
            buffer: pdfBuffer,
        };
        const modifiedFirstPost = Object.assign(Object.assign({}, firstPost), { media: [pdfMedia] });
        const modifiedRestPosts = postDetails.slice(1).map((post) => (Object.assign(Object.assign({}, post), { media: [] })));
        return [modifiedFirstPost, ...modifiedRestPosts];
    }
    async streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }
    async processMediaForPosts(postDetails, accessToken, personId, type) {
        const mediaUploads = await Promise.all(postDetails.flatMap((post) => {
            var _a;
            return ((_a = post.media) === null || _a === void 0 ? void 0 : _a.map(async (media) => {
                let mediaBuffer;
                if (media &&
                    typeof media === 'object' &&
                    'buffer' in media &&
                    Buffer.isBuffer(media.buffer)) {
                    mediaBuffer = media.buffer;
                }
                else {
                    mediaBuffer = await this.prepareMediaBuffer(media.path);
                }
                const uploadedMediaId = await this.uploadPicture(media.path, accessToken, personId, mediaBuffer, type);
                return {
                    id: uploadedMediaId,
                    postId: post.id,
                };
            })) || [];
        }));
        return mediaUploads.reduce((acc, upload) => {
            if (!(upload === null || upload === void 0 ? void 0 : upload.id))
                return acc;
            acc[upload.postId] = acc[upload.postId] || [];
            acc[upload.postId].push(upload.id);
            return acc;
        }, {});
    }
    async prepareMediaBuffer(mediaUrl) {
        const isVideo = mediaUrl.indexOf('mp4') > -1;
        if (isVideo) {
            return Buffer.from(await (0, read_or_fetch_1.readOrFetch)(mediaUrl));
        }
        return await (0, sharp_1.default)(await (0, read_or_fetch_1.readOrFetch)(mediaUrl), {
            animated: (0, mime_types_1.lookup)(mediaUrl) === 'image/gif',
        })
            .toFormat('jpeg')
            .resize({ width: 1000 })
            .toBuffer();
    }
    buildPostContent(isPdf, mediaIds) {
        if (mediaIds.length === 0) {
            return {};
        }
        if (mediaIds.length === 1) {
            return {
                content: {
                    media: Object.assign(Object.assign({}, (isPdf ? { title: 'slides.pdf' } : {})), { id: mediaIds[0] }),
                },
            };
        }
        return {
            content: {
                multiImage: {
                    images: mediaIds.map((id) => ({ id })),
                },
            },
        };
    }
    createLinkedInPostPayload(id, type, message, mediaIds, isPdf) {
        const author = type === 'personal' ? `urn:li:person:${id}` : `urn:li:organization:${id}`;
        return Object.assign(Object.assign({ author, commentary: this.fixText(message), visibility: 'PUBLIC', distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: [],
            } }, this.buildPostContent(isPdf, mediaIds)), { lifecycleState: 'PUBLISHED', isReshareDisabledByAuthor: false });
    }
    async createMainPost(id, accessToken, firstPost, mediaIds, type, isPdf) {
        const postPayload = this.createLinkedInPostPayload(id, type, firstPost.message, mediaIds, isPdf);
        const response = await this.fetch('https://api.linkedin.com/rest/posts', {
            method: 'POST',
            headers: {
                'LinkedIn-Version': '202501',
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(postPayload),
        });
        if (response.status !== 201 && response.status !== 200) {
            throw new Error('Error posting to LinkedIn');
        }
        return response.headers.get('x-restli-id');
    }
    async createCommentPost(id, accessToken, post, parentPostId, type) {
        const actor = type === 'personal' ? `urn:li:person:${id}` : `urn:li:organization:${id}`;
        const response = await this.fetch(`https://api.linkedin.com/v2/socialActions/${decodeURIComponent(parentPostId)}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                actor,
                object: parentPostId,
                message: {
                    text: this.fixText(post.message),
                },
            }),
        });
        const { object } = await response.json();
        return object;
    }
    createPostResponse(postId, originalPostId, isMainPost = false) {
        const baseUrl = isMainPost
            ? 'https://www.linkedin.com/feed/update/'
            : 'https://www.linkedin.com/embed/feed/update/';
        return {
            status: 'posted',
            postId,
            id: originalPostId,
            releaseURL: `${baseUrl}${postId}`,
        };
    }
    async post(id, accessToken, postDetails, integration, type = 'personal') {
        var _a, _b;
        let processedPostDetails = postDetails;
        const [firstPost] = postDetails;
        if ((_a = firstPost.settings) === null || _a === void 0 ? void 0 : _a.post_as_images_carousel) {
            processedPostDetails = await this.convertImagesToPdfCarousel(postDetails, firstPost);
        }
        const [processedFirstPost, ...restPosts] = processedPostDetails;
        const uploadedMedia = await this.processMediaForPosts(processedPostDetails, accessToken, id, type);
        const mainPostMediaIds = (uploadedMedia[processedFirstPost.id] || []).filter(Boolean);
        const mainPostId = await this.createMainPost(id, accessToken, processedFirstPost, mainPostMediaIds, type, !!((_b = firstPost.settings) === null || _b === void 0 ? void 0 : _b.post_as_images_carousel));
        const responses = [
            this.createPostResponse(mainPostId, processedFirstPost.id, true),
        ];
        for (const post of restPosts) {
            const commentPostId = await this.createCommentPost(id, accessToken, post, mainPostId, type);
            responses.push(this.createPostResponse(commentPostId, post.id, false));
        }
        return responses;
    }
    async repostPostUsers(integration, originalIntegration, postId, information, isPersonal = true) {
        await this.fetch(`https://api.linkedin.com/rest/posts`, {
            body: JSON.stringify({
                author: (isPersonal ? 'urn:li:person:' : `urn:li:organization:`) +
                    `${integration.internalId}`,
                commentary: '',
                visibility: 'PUBLIC',
                distribution: {
                    feedDistribution: 'MAIN_FEED',
                    targetEntities: [],
                    thirdPartyDistributionChannels: [],
                },
                lifecycleState: 'PUBLISHED',
                isReshareDisabledByAuthor: false,
                reshareContext: {
                    parent: postId,
                },
            }),
            method: 'POST',
            headers: {
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202504',
                Authorization: `Bearer ${integration.token}`,
            },
        });
    }
    async mention(token, data) {
        const { elements } = await (await fetch(`https://api.linkedin.com/v2/organizations?q=vanityName&vanityName=${encodeURIComponent(data.query)}&projection=(elements*(id,localizedName,logoV2(original~:playableStreams)))`, {
            headers: {
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202504',
                Authorization: `Bearer ${token}`,
            },
        })).json();
        return elements.map((p) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: String(p.id),
                label: p.localizedName,
                image: ((_f = (_e = (_d = (_c = (_b = (_a = p.logoV2) === null || _a === void 0 ? void 0 : _a['original~']) === null || _b === void 0 ? void 0 : _b.elements) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.identifiers) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.identifier) ||
                    '',
            });
        });
    }
    mentionFormat(idOrHandle, name) {
        return `@[${name.replace('@', '')}](urn:li:organization:${idOrHandle})`;
    }
}
exports.LinkedinProvider = LinkedinProvider;
tslib_1.__decorate([
    (0, post_plug_1.PostPlug)({
        identifier: 'linkedin-repost-post-users',
        title: 'Add Re-posters',
        description: 'Add accounts to repost your post',
        pickIntegration: ['linkedin', 'linkedin-page'],
        fields: [],
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], LinkedinProvider.prototype, "repostPostUsers", null);
//# sourceMappingURL=linkedin.provider.js.map