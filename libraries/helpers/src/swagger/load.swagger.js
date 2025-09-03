"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const loadSwagger = (app) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Postiz Swagger file')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
};
exports.loadSwagger = loadSwagger;
//# sourceMappingURL=load.swagger.js.map