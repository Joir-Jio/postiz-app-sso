"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSentry = void 0;
const tslib_1 = require("tslib");
const Sentry = tslib_1.__importStar(require("@sentry/nestjs"));
const profiling_node_1 = require("@sentry/profiling-node");
const lodash_1 = require("lodash");
const initializeSentry = (appName, allowLogs = false) => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
        return null;
    }
    try {
        Sentry.init({
            initialScope: {
                tags: {
                    service: appName,
                    component: 'nestjs',
                },
                contexts: {
                    app: {
                        name: `Postiz ${(0, lodash_1.capitalize)(appName)}`,
                    },
                },
            },
            environment: process.env.NODE_ENV || 'development',
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            integrations: [
                (0, profiling_node_1.nodeProfilingIntegration)(),
                Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
            ],
            tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.3,
            enableLogs: true,
        });
    }
    catch (err) {
        console.log(err);
    }
    return true;
};
exports.initializeSentry = initializeSentry;
//# sourceMappingURL=initialize.sentry.js.map