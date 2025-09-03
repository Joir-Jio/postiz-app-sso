"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plug = Plug;
require("reflect-metadata");
function Plug(params) {
    return function (target, propertyKey, descriptor) {
        const existingMetadata = Reflect.getMetadata('custom:plug', target) || [];
        existingMetadata.push(Object.assign({ methodName: propertyKey }, params));
        Reflect.defineMetadata('custom:plug', existingMetadata, target);
    };
}
//# sourceMappingURL=plug.decorator.js.map