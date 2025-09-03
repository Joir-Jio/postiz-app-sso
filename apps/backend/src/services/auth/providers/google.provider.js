"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleProvider = void 0;
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const googleapis_1 = require("googleapis");
const clientAndYoutube = () => {
    const client = new googleapis_1.google.auth.OAuth2({
        clientId: process.env.YOUTUBE_CLIENT_ID,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
        redirectUri: `${process.env.FRONTEND_URL}/integrations/social/youtube`,
    });
    const youtube = (newClient) => googleapis_1.google.youtube({
        version: 'v3',
        auth: newClient,
    });
    const youtubeAnalytics = (newClient) => googleapis_1.google.youtubeAnalytics({
        version: 'v2',
        auth: newClient,
    });
    const oauth2 = (newClient) => googleapis_1.google.oauth2({
        version: 'v2',
        auth: newClient,
    });
    return { client, youtube, oauth2, youtubeAnalytics };
};
class GoogleProvider {
    generateLink() {
        const state = (0, make_is_1.makeId)(7);
        const { client } = clientAndYoutube();
        return client.generateAuthUrl({
            access_type: 'online',
            prompt: 'consent',
            state,
            redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/youtube`,
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ],
        });
    }
    async getToken(code) {
        const { client, oauth2 } = clientAndYoutube();
        const { tokens } = await client.getToken(code);
        return tokens.access_token;
    }
    async getUser(providerToken) {
        const { client, oauth2 } = clientAndYoutube();
        client.setCredentials({ access_token: providerToken });
        const user = oauth2(client);
        const { data } = await user.userinfo.get();
        return {
            id: data.id,
            email: data.email,
        };
    }
}
exports.GoogleProvider = GoogleProvider;
//# sourceMappingURL=google.provider.js.map