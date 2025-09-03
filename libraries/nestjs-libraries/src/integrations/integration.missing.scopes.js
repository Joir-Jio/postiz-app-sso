"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotEnoughScopesFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const axios_1 = require("axios");
let NotEnoughScopesFilter = class NotEnoughScopesFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response
            .status(axios_1.HttpStatusCode.Conflict)
            .json({ msg: exception.message });
    }
};
exports.NotEnoughScopesFilter = NotEnoughScopesFilter;
exports.NotEnoughScopesFilter = NotEnoughScopesFilter = tslib_1.__decorate([
    (0, common_1.Catch)(social_abstract_1.NotEnoughScopes)
], NotEnoughScopesFilter);
//# sourceMappingURL=integration.missing.scopes.js.map