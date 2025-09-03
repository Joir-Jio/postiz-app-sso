"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarcasterProvider = void 0;
const nodejs_sdk_1 = require("@neynar/nodejs-sdk");
const client = new nodejs_sdk_1.NeynarAPIClient({
    apiKey: process.env.NEYNAR_SECRET_KEY || '00000000-000-0000-000-000000000000',
});
class FarcasterProvider {
    generateLink() {
        return '';
    }
    async getToken(code) {
        const data = JSON.parse(Buffer.from(code, 'base64').toString());
        const status = await client.lookupSigner({ signerUuid: data.signer_uuid });
        if (status.status === 'approved') {
            return data.signer_uuid;
        }
        return '';
    }
    async getUser(providerToken) {
        const status = await client.lookupSigner({ signerUuid: providerToken });
        if (status.status !== 'approved') {
            return {
                id: '',
                email: '',
            };
        }
        return {
            id: String('farcaster_' + status.fid),
            email: String('farcaster_' + status.fid),
        };
    }
}
exports.FarcasterProvider = FarcasterProvider;
//# sourceMappingURL=farcaster.provider.js.map