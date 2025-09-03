"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPromptsRequestSchema = exports.PromptSchema = exports.PromptArgumentSchema = exports.ResourceUpdatedNotificationSchema = exports.UnsubscribeRequestSchema = exports.SubscribeRequestSchema = exports.ResourceListChangedNotificationSchema = exports.ReadResourceResultSchema = exports.ReadResourceRequestSchema = exports.ListResourceTemplatesResultSchema = exports.ListResourceTemplatesRequestSchema = exports.ListResourcesResultSchema = exports.ListResourcesRequestSchema = exports.ResourceTemplateSchema = exports.ResourceSchema = exports.BlobResourceContentsSchema = exports.TextResourceContentsSchema = exports.ResourceContentsSchema = exports.PaginatedResultSchema = exports.PaginatedRequestSchema = exports.ProgressNotificationSchema = exports.ProgressSchema = exports.PingRequestSchema = exports.InitializedNotificationSchema = exports.InitializeResultSchema = exports.ServerCapabilitiesSchema = exports.InitializeRequestSchema = exports.ClientCapabilitiesSchema = exports.ImplementationSchema = exports.CancelledNotificationSchema = exports.EmptyResultSchema = exports.JSONRPCMessageSchema = exports.isJSONRPCError = exports.JSONRPCErrorSchema = exports.ErrorCode = exports.isJSONRPCResponse = exports.JSONRPCResponseSchema = exports.isJSONRPCNotification = exports.JSONRPCNotificationSchema = exports.isJSONRPCRequest = exports.JSONRPCRequestSchema = exports.RequestIdSchema = exports.ResultSchema = exports.NotificationSchema = exports.RequestSchema = exports.CursorSchema = exports.ProgressTokenSchema = exports.JSONRPC_VERSION = exports.SUPPORTED_PROTOCOL_VERSIONS = exports.LATEST_PROTOCOL_VERSION = void 0;
exports.McpError = exports.ServerResultSchema = exports.ServerNotificationSchema = exports.ServerRequestSchema = exports.ClientResultSchema = exports.ClientNotificationSchema = exports.ClientRequestSchema = exports.RootsListChangedNotificationSchema = exports.ListRootsResultSchema = exports.ListRootsRequestSchema = exports.RootSchema = exports.CompleteResultSchema = exports.CompleteRequestSchema = exports.PromptReferenceSchema = exports.ResourceReferenceSchema = exports.CreateMessageResultSchema = exports.CreateMessageRequestSchema = exports.SamplingMessageSchema = exports.ModelPreferencesSchema = exports.ModelHintSchema = exports.LoggingMessageNotificationSchema = exports.SetLevelRequestSchema = exports.LoggingLevelSchema = exports.ToolListChangedNotificationSchema = exports.CallToolRequestSchema = exports.CompatibilityCallToolResultSchema = exports.CallToolResultSchema = exports.ListToolsResultSchema = exports.ListToolsRequestSchema = exports.ToolSchema = exports.PromptListChangedNotificationSchema = exports.GetPromptResultSchema = exports.PromptMessageSchema = exports.EmbeddedResourceSchema = exports.AudioContentSchema = exports.ImageContentSchema = exports.TextContentSchema = exports.GetPromptRequestSchema = exports.ListPromptsResultSchema = void 0;
const zod_1 = require("zod");
exports.LATEST_PROTOCOL_VERSION = '2024-11-05';
exports.SUPPORTED_PROTOCOL_VERSIONS = [
    exports.LATEST_PROTOCOL_VERSION,
    '2024-10-07',
];
exports.JSONRPC_VERSION = '2.0';
exports.ProgressTokenSchema = zod_1.z.union([zod_1.z.string(), zod_1.z.number().int()]);
exports.CursorSchema = zod_1.z.string();
const BaseRequestParamsSchema = zod_1.z
    .object({
    _meta: zod_1.z.optional(zod_1.z
        .object({
        progressToken: zod_1.z.optional(exports.ProgressTokenSchema),
    })
        .passthrough()),
})
    .passthrough();
exports.RequestSchema = zod_1.z.object({
    method: zod_1.z.string(),
    params: zod_1.z.optional(BaseRequestParamsSchema),
});
const BaseNotificationParamsSchema = zod_1.z
    .object({
    _meta: zod_1.z.optional(zod_1.z.object({}).passthrough()),
})
    .passthrough();
exports.NotificationSchema = zod_1.z.object({
    method: zod_1.z.string(),
    params: zod_1.z.optional(BaseNotificationParamsSchema),
});
exports.ResultSchema = zod_1.z
    .object({
    _meta: zod_1.z.optional(zod_1.z.object({}).passthrough()),
})
    .passthrough();
exports.RequestIdSchema = zod_1.z.union([zod_1.z.string(), zod_1.z.number().int()]);
exports.JSONRPCRequestSchema = zod_1.z
    .object({
    jsonrpc: zod_1.z.literal(exports.JSONRPC_VERSION),
    id: exports.RequestIdSchema,
})
    .merge(exports.RequestSchema)
    .strict();
const isJSONRPCRequest = (value) => exports.JSONRPCRequestSchema.safeParse(value).success;
exports.isJSONRPCRequest = isJSONRPCRequest;
exports.JSONRPCNotificationSchema = zod_1.z
    .object({
    jsonrpc: zod_1.z.literal(exports.JSONRPC_VERSION),
})
    .merge(exports.NotificationSchema)
    .strict();
const isJSONRPCNotification = (value) => exports.JSONRPCNotificationSchema.safeParse(value).success;
exports.isJSONRPCNotification = isJSONRPCNotification;
exports.JSONRPCResponseSchema = zod_1.z
    .object({
    jsonrpc: zod_1.z.literal(exports.JSONRPC_VERSION),
    id: exports.RequestIdSchema,
    result: exports.ResultSchema,
})
    .strict();
const isJSONRPCResponse = (value) => exports.JSONRPCResponseSchema.safeParse(value).success;
exports.isJSONRPCResponse = isJSONRPCResponse;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["ConnectionClosed"] = -32000] = "ConnectionClosed";
    ErrorCode[ErrorCode["RequestTimeout"] = -32001] = "RequestTimeout";
    ErrorCode[ErrorCode["ParseError"] = -32700] = "ParseError";
    ErrorCode[ErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
    ErrorCode[ErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
    ErrorCode[ErrorCode["InvalidParams"] = -32602] = "InvalidParams";
    ErrorCode[ErrorCode["InternalError"] = -32603] = "InternalError";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.JSONRPCErrorSchema = zod_1.z
    .object({
    jsonrpc: zod_1.z.literal(exports.JSONRPC_VERSION),
    id: exports.RequestIdSchema,
    error: zod_1.z.object({
        code: zod_1.z.number().int(),
        message: zod_1.z.string(),
        data: zod_1.z.optional(zod_1.z.unknown()),
    }),
})
    .strict();
const isJSONRPCError = (value) => exports.JSONRPCErrorSchema.safeParse(value).success;
exports.isJSONRPCError = isJSONRPCError;
exports.JSONRPCMessageSchema = zod_1.z.union([
    exports.JSONRPCRequestSchema,
    exports.JSONRPCNotificationSchema,
    exports.JSONRPCResponseSchema,
    exports.JSONRPCErrorSchema,
]);
exports.EmptyResultSchema = exports.ResultSchema.strict();
exports.CancelledNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/cancelled'),
    params: BaseNotificationParamsSchema.extend({
        requestId: exports.RequestIdSchema,
        reason: zod_1.z.string().optional(),
    }),
});
exports.ImplementationSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    version: zod_1.z.string(),
})
    .passthrough();
exports.ClientCapabilitiesSchema = zod_1.z
    .object({
    experimental: zod_1.z.optional(zod_1.z.object({}).passthrough()),
    sampling: zod_1.z.optional(zod_1.z.object({}).passthrough()),
    roots: zod_1.z.optional(zod_1.z
        .object({
        listChanged: zod_1.z.optional(zod_1.z.boolean()),
    })
        .passthrough()),
})
    .passthrough();
exports.InitializeRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('initialize'),
    params: BaseRequestParamsSchema.extend({
        protocolVersion: zod_1.z.string(),
        capabilities: exports.ClientCapabilitiesSchema,
        clientInfo: exports.ImplementationSchema,
    }),
});
exports.ServerCapabilitiesSchema = zod_1.z
    .object({
    experimental: zod_1.z.optional(zod_1.z.object({}).passthrough()),
    logging: zod_1.z.optional(zod_1.z.object({}).passthrough()),
    completions: zod_1.z.optional(zod_1.z.object({}).passthrough()),
    prompts: zod_1.z.optional(zod_1.z
        .object({
        listChanged: zod_1.z.optional(zod_1.z.boolean()),
    })
        .passthrough()),
    resources: zod_1.z.optional(zod_1.z
        .object({
        subscribe: zod_1.z.optional(zod_1.z.boolean()),
        listChanged: zod_1.z.optional(zod_1.z.boolean()),
    })
        .passthrough()),
    tools: zod_1.z.optional(zod_1.z
        .object({
        listChanged: zod_1.z.optional(zod_1.z.boolean()),
    })
        .passthrough()),
})
    .passthrough();
exports.InitializeResultSchema = exports.ResultSchema.extend({
    protocolVersion: zod_1.z.string(),
    capabilities: exports.ServerCapabilitiesSchema,
    serverInfo: exports.ImplementationSchema,
    instructions: zod_1.z.optional(zod_1.z.string()),
});
exports.InitializedNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/initialized'),
});
exports.PingRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('ping'),
});
exports.ProgressSchema = zod_1.z
    .object({
    progress: zod_1.z.number(),
    total: zod_1.z.optional(zod_1.z.number()),
})
    .passthrough();
exports.ProgressNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/progress'),
    params: BaseNotificationParamsSchema.merge(exports.ProgressSchema).extend({
        progressToken: exports.ProgressTokenSchema,
    }),
});
exports.PaginatedRequestSchema = exports.RequestSchema.extend({
    params: BaseRequestParamsSchema.extend({
        cursor: zod_1.z.optional(exports.CursorSchema),
    }).optional(),
});
exports.PaginatedResultSchema = exports.ResultSchema.extend({
    nextCursor: zod_1.z.optional(exports.CursorSchema),
});
exports.ResourceContentsSchema = zod_1.z
    .object({
    uri: zod_1.z.string(),
    mimeType: zod_1.z.optional(zod_1.z.string()),
})
    .passthrough();
exports.TextResourceContentsSchema = exports.ResourceContentsSchema.extend({
    text: zod_1.z.string(),
});
exports.BlobResourceContentsSchema = exports.ResourceContentsSchema.extend({
    blob: zod_1.z.string().base64(),
});
exports.ResourceSchema = zod_1.z
    .object({
    uri: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()),
    mimeType: zod_1.z.optional(zod_1.z.string()),
})
    .passthrough();
exports.ResourceTemplateSchema = zod_1.z
    .object({
    uriTemplate: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()),
    mimeType: zod_1.z.optional(zod_1.z.string()),
})
    .passthrough();
exports.ListResourcesRequestSchema = exports.PaginatedRequestSchema.extend({
    method: zod_1.z.literal('resources/list'),
});
exports.ListResourcesResultSchema = exports.PaginatedResultSchema.extend({
    resources: zod_1.z.array(exports.ResourceSchema),
});
exports.ListResourceTemplatesRequestSchema = exports.PaginatedRequestSchema.extend({
    method: zod_1.z.literal('resources/templates/list'),
});
exports.ListResourceTemplatesResultSchema = exports.PaginatedResultSchema.extend({
    resourceTemplates: zod_1.z.array(exports.ResourceTemplateSchema),
});
exports.ReadResourceRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('resources/read'),
    params: BaseRequestParamsSchema.extend({
        uri: zod_1.z.string(),
    }),
});
exports.ReadResourceResultSchema = exports.ResultSchema.extend({
    contents: zod_1.z.array(zod_1.z.union([exports.TextResourceContentsSchema, exports.BlobResourceContentsSchema])),
});
exports.ResourceListChangedNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/resources/list_changed'),
});
exports.SubscribeRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('resources/subscribe'),
    params: BaseRequestParamsSchema.extend({
        uri: zod_1.z.string(),
    }),
});
exports.UnsubscribeRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('resources/unsubscribe'),
    params: BaseRequestParamsSchema.extend({
        uri: zod_1.z.string(),
    }),
});
exports.ResourceUpdatedNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/resources/updated'),
    params: BaseNotificationParamsSchema.extend({
        uri: zod_1.z.string(),
    }),
});
exports.PromptArgumentSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()),
    required: zod_1.z.optional(zod_1.z.boolean()),
})
    .passthrough();
exports.PromptSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()),
    arguments: zod_1.z.optional(zod_1.z.array(exports.PromptArgumentSchema)),
})
    .passthrough();
exports.ListPromptsRequestSchema = exports.PaginatedRequestSchema.extend({
    method: zod_1.z.literal('prompts/list'),
});
exports.ListPromptsResultSchema = exports.PaginatedResultSchema.extend({
    prompts: zod_1.z.array(exports.PromptSchema),
});
exports.GetPromptRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('prompts/get'),
    params: BaseRequestParamsSchema.extend({
        name: zod_1.z.string(),
        arguments: zod_1.z.optional(zod_1.z.record(zod_1.z.string())),
    }),
});
exports.TextContentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('text'),
    text: zod_1.z.string(),
})
    .passthrough();
exports.ImageContentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('image'),
    data: zod_1.z.string().base64(),
    mimeType: zod_1.z.string(),
})
    .passthrough();
exports.AudioContentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('audio'),
    data: zod_1.z.string().base64(),
    mimeType: zod_1.z.string(),
})
    .passthrough();
exports.EmbeddedResourceSchema = zod_1.z
    .object({
    type: zod_1.z.literal('resource'),
    resource: zod_1.z.union([exports.TextResourceContentsSchema, exports.BlobResourceContentsSchema]),
})
    .passthrough();
exports.PromptMessageSchema = zod_1.z
    .object({
    role: zod_1.z.enum(['user', 'assistant']),
    content: zod_1.z.union([
        exports.TextContentSchema,
        exports.ImageContentSchema,
        exports.AudioContentSchema,
        exports.EmbeddedResourceSchema,
    ]),
})
    .passthrough();
exports.GetPromptResultSchema = exports.ResultSchema.extend({
    description: zod_1.z.optional(zod_1.z.string()),
    messages: zod_1.z.array(exports.PromptMessageSchema),
});
exports.PromptListChangedNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/prompts/list_changed'),
});
exports.ToolSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    description: zod_1.z.optional(zod_1.z.string()),
    inputSchema: zod_1.z
        .object({
        type: zod_1.z.literal('object'),
        properties: zod_1.z.optional(zod_1.z.object({}).passthrough()),
    })
        .passthrough(),
})
    .passthrough();
exports.ListToolsRequestSchema = exports.PaginatedRequestSchema.extend({
    method: zod_1.z.literal('tools/list'),
});
exports.ListToolsResultSchema = exports.PaginatedResultSchema.extend({
    tools: zod_1.z.array(exports.ToolSchema),
});
exports.CallToolResultSchema = exports.ResultSchema.extend({
    content: zod_1.z.array(zod_1.z.union([
        exports.TextContentSchema,
        exports.ImageContentSchema,
        exports.AudioContentSchema,
        exports.EmbeddedResourceSchema,
    ])),
    isError: zod_1.z.boolean().default(false).optional(),
});
exports.CompatibilityCallToolResultSchema = exports.CallToolResultSchema.or(exports.ResultSchema.extend({
    toolResult: zod_1.z.unknown(),
}));
exports.CallToolRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('tools/call'),
    params: BaseRequestParamsSchema.extend({
        name: zod_1.z.string(),
        arguments: zod_1.z.optional(zod_1.z.record(zod_1.z.unknown())),
    }),
});
exports.ToolListChangedNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/tools/list_changed'),
});
exports.LoggingLevelSchema = zod_1.z.enum([
    'debug',
    'info',
    'notice',
    'warning',
    'error',
    'critical',
    'alert',
    'emergency',
]);
exports.SetLevelRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('logging/setLevel'),
    params: BaseRequestParamsSchema.extend({
        level: exports.LoggingLevelSchema,
    }),
});
exports.LoggingMessageNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/message'),
    params: BaseNotificationParamsSchema.extend({
        level: exports.LoggingLevelSchema,
        logger: zod_1.z.optional(zod_1.z.string()),
        data: zod_1.z.unknown(),
    }),
});
exports.ModelHintSchema = zod_1.z
    .object({
    name: zod_1.z.string().optional(),
})
    .passthrough();
exports.ModelPreferencesSchema = zod_1.z
    .object({
    hints: zod_1.z.optional(zod_1.z.array(exports.ModelHintSchema)),
    costPriority: zod_1.z.optional(zod_1.z.number().min(0).max(1)),
    speedPriority: zod_1.z.optional(zod_1.z.number().min(0).max(1)),
    intelligencePriority: zod_1.z.optional(zod_1.z.number().min(0).max(1)),
})
    .passthrough();
exports.SamplingMessageSchema = zod_1.z
    .object({
    role: zod_1.z.enum(['user', 'assistant']),
    content: zod_1.z.union([
        exports.TextContentSchema,
        exports.ImageContentSchema,
        exports.AudioContentSchema,
    ]),
})
    .passthrough();
exports.CreateMessageRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('sampling/createMessage'),
    params: BaseRequestParamsSchema.extend({
        messages: zod_1.z.array(exports.SamplingMessageSchema),
        systemPrompt: zod_1.z.optional(zod_1.z.string()),
        includeContext: zod_1.z.optional(zod_1.z.enum(['none', 'thisServer', 'allServers'])),
        temperature: zod_1.z.optional(zod_1.z.number()),
        maxTokens: zod_1.z.number().int(),
        stopSequences: zod_1.z.optional(zod_1.z.array(zod_1.z.string())),
        metadata: zod_1.z.optional(zod_1.z.object({}).passthrough()),
        modelPreferences: zod_1.z.optional(exports.ModelPreferencesSchema),
    }),
});
exports.CreateMessageResultSchema = exports.ResultSchema.extend({
    model: zod_1.z.string(),
    stopReason: zod_1.z.optional(zod_1.z.enum(['endTurn', 'stopSequence', 'maxTokens']).or(zod_1.z.string())),
    role: zod_1.z.enum(['user', 'assistant']),
    content: zod_1.z.discriminatedUnion('type', [
        exports.TextContentSchema,
        exports.ImageContentSchema,
        exports.AudioContentSchema,
    ]),
});
exports.ResourceReferenceSchema = zod_1.z
    .object({
    type: zod_1.z.literal('ref/resource'),
    uri: zod_1.z.string(),
})
    .passthrough();
exports.PromptReferenceSchema = zod_1.z
    .object({
    type: zod_1.z.literal('ref/prompt'),
    name: zod_1.z.string(),
})
    .passthrough();
exports.CompleteRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('completion/complete'),
    params: BaseRequestParamsSchema.extend({
        ref: zod_1.z.union([exports.PromptReferenceSchema, exports.ResourceReferenceSchema]),
        argument: zod_1.z
            .object({
            name: zod_1.z.string(),
            value: zod_1.z.string(),
        })
            .passthrough(),
    }),
});
exports.CompleteResultSchema = exports.ResultSchema.extend({
    completion: zod_1.z
        .object({
        values: zod_1.z.array(zod_1.z.string()).max(100),
        total: zod_1.z.optional(zod_1.z.number().int()),
        hasMore: zod_1.z.optional(zod_1.z.boolean()),
    })
        .passthrough(),
});
exports.RootSchema = zod_1.z
    .object({
    uri: zod_1.z.string().startsWith('file://'),
    name: zod_1.z.optional(zod_1.z.string()),
})
    .passthrough();
exports.ListRootsRequestSchema = exports.RequestSchema.extend({
    method: zod_1.z.literal('roots/list'),
});
exports.ListRootsResultSchema = exports.ResultSchema.extend({
    roots: zod_1.z.array(exports.RootSchema),
});
exports.RootsListChangedNotificationSchema = exports.NotificationSchema.extend({
    method: zod_1.z.literal('notifications/roots/list_changed'),
});
exports.ClientRequestSchema = zod_1.z.union([
    exports.PingRequestSchema,
    exports.InitializeRequestSchema,
    exports.CompleteRequestSchema,
    exports.SetLevelRequestSchema,
    exports.GetPromptRequestSchema,
    exports.ListPromptsRequestSchema,
    exports.ListResourcesRequestSchema,
    exports.ListResourceTemplatesRequestSchema,
    exports.ReadResourceRequestSchema,
    exports.SubscribeRequestSchema,
    exports.UnsubscribeRequestSchema,
    exports.CallToolRequestSchema,
    exports.ListToolsRequestSchema,
]);
exports.ClientNotificationSchema = zod_1.z.union([
    exports.CancelledNotificationSchema,
    exports.ProgressNotificationSchema,
    exports.InitializedNotificationSchema,
    exports.RootsListChangedNotificationSchema,
]);
exports.ClientResultSchema = zod_1.z.union([
    exports.EmptyResultSchema,
    exports.CreateMessageResultSchema,
    exports.ListRootsResultSchema,
]);
exports.ServerRequestSchema = zod_1.z.union([
    exports.PingRequestSchema,
    exports.CreateMessageRequestSchema,
    exports.ListRootsRequestSchema,
]);
exports.ServerNotificationSchema = zod_1.z.union([
    exports.CancelledNotificationSchema,
    exports.ProgressNotificationSchema,
    exports.LoggingMessageNotificationSchema,
    exports.ResourceUpdatedNotificationSchema,
    exports.ResourceListChangedNotificationSchema,
    exports.ToolListChangedNotificationSchema,
    exports.PromptListChangedNotificationSchema,
]);
exports.ServerResultSchema = zod_1.z.union([
    exports.EmptyResultSchema,
    exports.InitializeResultSchema,
    exports.CompleteResultSchema,
    exports.GetPromptResultSchema,
    exports.ListPromptsResultSchema,
    exports.ListResourcesResultSchema,
    exports.ListResourceTemplatesResultSchema,
    exports.ReadResourceResultSchema,
    exports.CallToolResultSchema,
    exports.ListToolsResultSchema,
]);
class McpError extends Error {
    constructor(code, message, data) {
        super(`MCP error ${code}: ${message}`);
        this.code = code;
        this.data = data;
        this.name = 'McpError';
    }
}
exports.McpError = McpError;
//# sourceMappingURL=mcp.types.js.map