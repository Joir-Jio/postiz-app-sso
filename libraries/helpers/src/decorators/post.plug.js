"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostPlug = PostPlug;
require("reflect-metadata");
function PostPlug(params) {
    return function (target, propertyKey, descriptor) {
        const existingMetadata = Reflect.getMetadata('custom:internal_plug', target) || [];
        existingMetadata.push(Object.assign({ methodName: propertyKey }, params));
        Reflect.defineMetadata('custom:internal_plug', existingMetadata, target);
    };
}
//# sourceMappingURL=post.plug.js.map