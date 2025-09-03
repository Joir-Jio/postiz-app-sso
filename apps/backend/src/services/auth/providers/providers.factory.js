"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersFactory = void 0;
const client_1 = require("@prisma/client");
const github_provider_1 = require("@gitroom/backend/services/auth/providers/github.provider");
const google_provider_1 = require("@gitroom/backend/services/auth/providers/google.provider");
const farcaster_provider_1 = require("@gitroom/backend/services/auth/providers/farcaster.provider");
const wallet_provider_1 = require("@gitroom/backend/services/auth/providers/wallet.provider");
const oauth_provider_1 = require("@gitroom/backend/services/auth/providers/oauth.provider");
class ProvidersFactory {
    static loadProvider(provider) {
        switch (provider) {
            case client_1.Provider.GITHUB:
                return new github_provider_1.GithubProvider();
            case client_1.Provider.GOOGLE:
                return new google_provider_1.GoogleProvider();
            case client_1.Provider.FARCASTER:
                return new farcaster_provider_1.FarcasterProvider();
            case client_1.Provider.WALLET:
                return new wallet_provider_1.WalletProvider();
            case client_1.Provider.GENERIC:
                return new oauth_provider_1.OauthProvider();
        }
    }
}
exports.ProvidersFactory = ProvidersFactory;
//# sourceMappingURL=providers.factory.js.map