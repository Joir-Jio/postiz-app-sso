"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let RootController = class RootController {
    getRoot() {
        return 'App is running!';
    }
};
exports.RootController = RootController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", String)
], RootController.prototype, "getRoot", null);
exports.RootController = RootController = tslib_1.__decorate([
    (0, common_1.Controller)('/')
], RootController);
//# sourceMappingURL=root.controller.js.map