"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const load_swagger_1 = require("@gitroom/helpers/swagger/load.swagger");
process.env.TZ = 'UTC';
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const initialize_sentry_1 = require("@gitroom/nestjs-libraries/sentry/initialize.sentry");
(0, initialize_sentry_1.initializeSentry)('backend', true);
const subscription_exception_1 = require("@gitroom/backend/services/auth/permissions/subscription.exception");
const exception_filter_1 = require("@gitroom/nestjs-libraries/services/exception.filter");
const configuration_checker_1 = require("@gitroom/helpers/configuration/configuration.checker");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
        cors: Object.assign(Object.assign({}, (!process.env.NOT_SECURED ? { credentials: true } : {})), { exposedHeaders: [
                'reload',
                'onboarding',
                'activate',
                ...(process.env.NOT_SECURED ? ['auth', 'showorg', 'impersonate'] : []),
            ], origin: [
                process.env.FRONTEND_URL,
                ...(process.env.MAIN_URL ? [process.env.MAIN_URL] : []),
            ] }),
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new subscription_exception_1.SubscriptionExceptionFilter());
    app.useGlobalFilters(new exception_filter_1.HttpExceptionFilter());
    (0, load_swagger_1.loadSwagger)(app);
    const port = process.env.PORT || 3000;
    try {
        await app.listen(port);
        checkConfiguration();
        common_1.Logger.log(`🚀 Backend is running on: http://localhost:${port}`);
    }
    catch (e) {
        common_1.Logger.error(`Backend failed to start on port ${port}`, e);
    }
}
function checkConfiguration() {
    const checker = new configuration_checker_1.ConfigurationChecker();
    checker.readEnvFromProcess();
    checker.check();
    if (checker.hasIssues()) {
        for (const issue of checker.getIssues()) {
            common_1.Logger.warn(issue, 'Configuration issue');
        }
        common_1.Logger.warn('Configuration issues found: ' + checker.getIssuesCount());
    }
    else {
        common_1.Logger.log('Configuration check completed without any issues.');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map