"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionException = exports.AuthorizationActions = exports.Sections = void 0;
const common_1 = require("@nestjs/common");
var Sections;
(function (Sections) {
    Sections["CHANNEL"] = "channel";
    Sections["POSTS_PER_MONTH"] = "posts_per_month";
    Sections["VIDEOS_PER_MONTH"] = "videos_per_month";
    Sections["TEAM_MEMBERS"] = "team_members";
    Sections["COMMUNITY_FEATURES"] = "community_features";
    Sections["FEATURED_BY_GITROOM"] = "featured_by_gitroom";
    Sections["AI"] = "ai";
    Sections["IMPORT_FROM_CHANNELS"] = "import_from_channels";
    Sections["ADMIN"] = "admin";
    Sections["WEBHOOKS"] = "webhooks";
})(Sections || (exports.Sections = Sections = {}));
var AuthorizationActions;
(function (AuthorizationActions) {
    AuthorizationActions["Create"] = "create";
    AuthorizationActions["Read"] = "read";
    AuthorizationActions["Update"] = "update";
    AuthorizationActions["Delete"] = "delete";
})(AuthorizationActions || (exports.AuthorizationActions = AuthorizationActions = {}));
class SubscriptionException extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.PAYMENT_REQUIRED);
    }
}
exports.SubscriptionException = SubscriptionException;
//# sourceMappingURL=permission.exception.class.js.map