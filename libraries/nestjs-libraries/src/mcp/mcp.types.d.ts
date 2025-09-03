import { z, ZodTypeAny } from 'zod';
export declare const LATEST_PROTOCOL_VERSION = "2024-11-05";
export declare const SUPPORTED_PROTOCOL_VERSIONS: string[];
export declare const JSONRPC_VERSION = "2.0";
export declare const ProgressTokenSchema: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const CursorSchema: z.ZodString;
export declare const RequestSchema: z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
}>;
export declare const NotificationSchema: z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
}>;
export declare const ResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">>;
export declare const RequestIdSchema: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const JSONRPCRequestSchema: z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
} & {
    method: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strict", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    id?: string | number;
    method?: string;
    jsonrpc?: "2.0";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    id?: string | number;
    method?: string;
    jsonrpc?: "2.0";
}>;
export declare const isJSONRPCRequest: (value: unknown) => value is JSONRPCRequest;
export declare const JSONRPCNotificationSchema: z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
} & {
    method: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strict", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
    jsonrpc?: "2.0";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
    jsonrpc?: "2.0";
}>;
export declare const isJSONRPCNotification: (value: unknown) => value is JSONRPCNotification;
export declare const JSONRPCResponseSchema: z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    result: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strict", z.ZodTypeAny, {
    id?: string | number;
    result?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    jsonrpc?: "2.0";
}, {
    id?: string | number;
    result?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    jsonrpc?: "2.0";
}>;
export declare const isJSONRPCResponse: (value: unknown) => value is JSONRPCResponse;
export declare enum ErrorCode {
    ConnectionClosed = -32000,
    RequestTimeout = -32001,
    ParseError = -32700,
    InvalidRequest = -32600,
    MethodNotFound = -32601,
    InvalidParams = -32602,
    InternalError = -32603
}
export declare const JSONRPCErrorSchema: z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    error: z.ZodObject<{
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        data?: unknown;
        message?: string;
        code?: number;
    }, {
        data?: unknown;
        message?: string;
        code?: number;
    }>;
}, "strict", z.ZodTypeAny, {
    error?: {
        data?: unknown;
        message?: string;
        code?: number;
    };
    id?: string | number;
    jsonrpc?: "2.0";
}, {
    error?: {
        data?: unknown;
        message?: string;
        code?: number;
    };
    id?: string | number;
    jsonrpc?: "2.0";
}>;
export declare const isJSONRPCError: (value: unknown) => value is JSONRPCError;
export declare const JSONRPCMessageSchema: z.ZodUnion<[z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
} & {
    method: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strict", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    id?: string | number;
    method?: string;
    jsonrpc?: "2.0";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    id?: string | number;
    method?: string;
    jsonrpc?: "2.0";
}>, z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
} & {
    method: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strict", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
    jsonrpc?: "2.0";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
    jsonrpc?: "2.0";
}>, z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    result: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strict", z.ZodTypeAny, {
    id?: string | number;
    result?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    jsonrpc?: "2.0";
}, {
    id?: string | number;
    result?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    jsonrpc?: "2.0";
}>, z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    error: z.ZodObject<{
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        data?: unknown;
        message?: string;
        code?: number;
    }, {
        data?: unknown;
        message?: string;
        code?: number;
    }>;
}, "strict", z.ZodTypeAny, {
    error?: {
        data?: unknown;
        message?: string;
        code?: number;
    };
    id?: string | number;
    jsonrpc?: "2.0";
}, {
    error?: {
        data?: unknown;
        message?: string;
        code?: number;
    };
    id?: string | number;
    jsonrpc?: "2.0";
}>]>;
export declare const EmptyResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, "strict", z.ZodTypeAny, {
    _meta?: {} & {
        [k: string]: unknown;
    };
}, {
    _meta?: {} & {
        [k: string]: unknown;
    };
}>;
export declare const CancelledNotificationSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/cancelled">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        requestId?: string | number;
        reason?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/cancelled";
}, {
    params?: {
        requestId?: string | number;
        reason?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/cancelled";
}>;
export declare const ImplementationSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    version: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    version: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const ClientCapabilitiesSchema: z.ZodObject<{
    experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    roots: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    roots: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    roots: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">>;
export declare const InitializeRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"initialize">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        protocolVersion: z.ZodString;
        capabilities: z.ZodObject<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
        clientInfo: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        protocolVersion: z.ZodString;
        capabilities: z.ZodObject<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
        clientInfo: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        protocolVersion: z.ZodString;
        capabilities: z.ZodObject<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
        clientInfo: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        capabilities?: {
            sampling?: {} & {
                [k: string]: unknown;
            };
            experimental?: {} & {
                [k: string]: unknown;
            };
            roots?: {
                listChanged?: boolean;
            } & {
                [k: string]: unknown;
            };
        } & {
            [k: string]: unknown;
        };
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        protocolVersion?: string;
        clientInfo?: {
            name?: string;
            version?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "initialize";
}, {
    params?: {
        capabilities?: {
            sampling?: {} & {
                [k: string]: unknown;
            };
            experimental?: {} & {
                [k: string]: unknown;
            };
            roots?: {
                listChanged?: boolean;
            } & {
                [k: string]: unknown;
            };
        } & {
            [k: string]: unknown;
        };
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        protocolVersion?: string;
        clientInfo?: {
            name?: string;
            version?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "initialize";
}>;
export declare const ServerCapabilitiesSchema: z.ZodObject<{
    experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    prompts: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
    resources: z.ZodOptional<z.ZodObject<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
    tools: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    prompts: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
    resources: z.ZodOptional<z.ZodObject<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
    tools: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    prompts: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
    resources: z.ZodOptional<z.ZodObject<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        subscribe: z.ZodOptional<z.ZodBoolean>;
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
    tools: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">>;
export declare const InitializeResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
    serverInfo: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    instructions: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
    serverInfo: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    instructions: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
    serverInfo: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    instructions: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const InitializedNotificationSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/initialized">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/initialized";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/initialized";
}>;
export declare const PingRequestSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"ping">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "ping";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "ping";
}>;
export declare const ProgressSchema: z.ZodObject<{
    progress: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    progress: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    progress: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ProgressNotificationSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/progress">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        progress?: number;
        total?: number;
        _meta?: {} & {
            [k: string]: unknown;
        };
        progressToken?: string | number;
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/progress";
}, {
    params?: {
        progress?: number;
        total?: number;
        _meta?: {} & {
            [k: string]: unknown;
        };
        progressToken?: string | number;
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/progress";
}>;
export declare const PaginatedRequestSchema: z.ZodObject<{
    method: z.ZodString;
} & {
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: string;
}>;
export declare const PaginatedResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ResourceContentsSchema: z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const TextResourceContentsSchema: z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
} & {
    text: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
} & {
    text: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
} & {
    text: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const BlobResourceContentsSchema: z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
} & {
    blob: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
} & {
    blob: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
} & {
    blob: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const ResourceSchema: z.ZodObject<{
    uri: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    uri: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    uri: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ResourceTemplateSchema: z.ZodObject<{
    uriTemplate: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    uriTemplate: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    uriTemplate: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ListResourcesRequestSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"resources/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/list";
}>;
export declare const ListResourcesResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resources: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resources: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resources: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const ListResourceTemplatesRequestSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"resources/templates/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/templates/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/templates/list";
}>;
export declare const ListResourceTemplatesResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resourceTemplates: z.ZodArray<z.ZodObject<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resourceTemplates: z.ZodArray<z.ZodObject<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resourceTemplates: z.ZodArray<z.ZodObject<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const ReadResourceRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"resources/read">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/read";
}, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/read";
}>;
export declare const ReadResourceResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    contents: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    contents: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    contents: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const ResourceListChangedNotificationSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/resources/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/list_changed";
}>;
export declare const SubscribeRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"resources/subscribe">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/subscribe";
}, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/subscribe";
}>;
export declare const UnsubscribeRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"resources/unsubscribe">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/unsubscribe";
}, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/unsubscribe";
}>;
export declare const ResourceUpdatedNotificationSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/resources/updated">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/updated";
}, {
    params?: {
        uri?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/updated";
}>;
export declare const PromptArgumentSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
}, z.ZodTypeAny, "passthrough">>;
export declare const PromptSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ListPromptsRequestSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"prompts/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/list";
}>;
export declare const ListPromptsResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    prompts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    prompts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    prompts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const GetPromptRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"prompts/get">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        name?: string;
        arguments?: Record<string, string>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/get";
}, {
    params?: {
        name?: string;
        arguments?: Record<string, string>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/get";
}>;
export declare const TextContentSchema: z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const ImageContentSchema: z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const AudioContentSchema: z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const EmbeddedResourceSchema: z.ZodObject<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">>;
export declare const PromptMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">>;
export declare const GetPromptResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    description: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    description: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    description: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const PromptListChangedNotificationSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/prompts/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/prompts/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/prompts/list_changed";
}>;
export declare const ToolSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ListToolsRequestSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"tools/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/list";
}>;
export declare const ListToolsResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const CallToolResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">>;
export declare const CompatibilityCallToolResultSchema: z.ZodUnion<[z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    toolResult: z.ZodUnknown;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    toolResult: z.ZodUnknown;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    toolResult: z.ZodUnknown;
}, z.ZodTypeAny, "passthrough">>]>;
export declare const CallToolRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"tools/call">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        name?: string;
        arguments?: Record<string, unknown>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/call";
}, {
    params?: {
        name?: string;
        arguments?: Record<string, unknown>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/call";
}>;
export declare const ToolListChangedNotificationSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/tools/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/tools/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/tools/list_changed";
}>;
export declare const LoggingLevelSchema: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
export declare const SetLevelRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"logging/setLevel">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "logging/setLevel";
}, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "logging/setLevel";
}>;
export declare const LoggingMessageNotificationSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/message">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
        logger: z.ZodOptional<z.ZodString>;
        data: z.ZodUnknown;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
        logger: z.ZodOptional<z.ZodString>;
        data: z.ZodUnknown;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
        logger: z.ZodOptional<z.ZodString>;
        data: z.ZodUnknown;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        data?: unknown;
        logger?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/message";
}, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        data?: unknown;
        logger?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/message";
}>;
export declare const ModelHintSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ModelPreferencesSchema: z.ZodObject<{
    hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    costPriority: z.ZodOptional<z.ZodNumber>;
    speedPriority: z.ZodOptional<z.ZodNumber>;
    intelligencePriority: z.ZodOptional<z.ZodNumber>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    costPriority: z.ZodOptional<z.ZodNumber>;
    speedPriority: z.ZodOptional<z.ZodNumber>;
    intelligencePriority: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    costPriority: z.ZodOptional<z.ZodNumber>;
    speedPriority: z.ZodOptional<z.ZodNumber>;
    intelligencePriority: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">>;
export declare const SamplingMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">>;
export declare const CreateMessageRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"sampling/createMessage">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        systemPrompt: z.ZodOptional<z.ZodString>;
        includeContext: z.ZodOptional<z.ZodEnum<["none", "thisServer", "allServers"]>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodNumber;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        modelPreferences: z.ZodOptional<z.ZodObject<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        systemPrompt: z.ZodOptional<z.ZodString>;
        includeContext: z.ZodOptional<z.ZodEnum<["none", "thisServer", "allServers"]>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodNumber;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        modelPreferences: z.ZodOptional<z.ZodObject<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        systemPrompt: z.ZodOptional<z.ZodString>;
        includeContext: z.ZodOptional<z.ZodEnum<["none", "thisServer", "allServers"]>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodNumber;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        modelPreferences: z.ZodOptional<z.ZodObject<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        messages?: z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">[];
        metadata?: {} & {
            [k: string]: unknown;
        };
        temperature?: number;
        maxTokens?: number;
        stopSequences?: string[];
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        systemPrompt?: string;
        includeContext?: "none" | "thisServer" | "allServers";
        modelPreferences?: {
            hints?: z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">[];
            costPriority?: number;
            speedPriority?: number;
            intelligencePriority?: number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "sampling/createMessage";
}, {
    params?: {
        messages?: z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">[];
        metadata?: {} & {
            [k: string]: unknown;
        };
        temperature?: number;
        maxTokens?: number;
        stopSequences?: string[];
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        systemPrompt?: string;
        includeContext?: "none" | "thisServer" | "allServers";
        modelPreferences?: {
            hints?: z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">[];
            costPriority?: number;
            speedPriority?: number;
            intelligencePriority?: number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "sampling/createMessage";
}>;
export declare const CreateMessageResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    model: z.ZodString;
    stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["endTurn", "stopSequence", "maxTokens"]>, z.ZodString]>>;
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    model: z.ZodString;
    stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["endTurn", "stopSequence", "maxTokens"]>, z.ZodString]>>;
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    model: z.ZodString;
    stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["endTurn", "stopSequence", "maxTokens"]>, z.ZodString]>>;
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ResourceReferenceSchema: z.ZodObject<{
    type: z.ZodLiteral<"ref/resource">;
    uri: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    type: z.ZodLiteral<"ref/resource">;
    uri: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    type: z.ZodLiteral<"ref/resource">;
    uri: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const PromptReferenceSchema: z.ZodObject<{
    type: z.ZodLiteral<"ref/prompt">;
    name: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    type: z.ZodLiteral<"ref/prompt">;
    name: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    type: z.ZodLiteral<"ref/prompt">;
    name: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const CompleteRequestSchema: z.ZodObject<{} & {
    method: z.ZodLiteral<"completion/complete">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        ref: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        argument: z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        ref: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        argument: z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        ref: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        argument: z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        ref?: z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough"> | z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">;
        argument?: {
            name?: string;
            value?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "completion/complete";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        ref?: z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough"> | z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">;
        argument?: {
            name?: string;
            value?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "completion/complete";
}>;
export declare const CompleteResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    completion: z.ZodObject<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    completion: z.ZodObject<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    completion: z.ZodObject<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>;
export declare const RootSchema: z.ZodObject<{
    uri: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    uri: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    uri: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ListRootsRequestSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"roots/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "roots/list";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "roots/list";
}>;
export declare const ListRootsResultSchema: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    roots: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    roots: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    roots: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const RootsListChangedNotificationSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/roots/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/roots/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/roots/list_changed";
}>;
export declare const ClientRequestSchema: z.ZodUnion<[z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"ping">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "ping";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "ping";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"initialize">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        protocolVersion: z.ZodString;
        capabilities: z.ZodObject<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
        clientInfo: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        protocolVersion: z.ZodString;
        capabilities: z.ZodObject<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
        clientInfo: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        protocolVersion: z.ZodString;
        capabilities: z.ZodObject<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            sampling: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
            roots: z.ZodOptional<z.ZodObject<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                listChanged: z.ZodOptional<z.ZodBoolean>;
            }, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
        clientInfo: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            version: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        capabilities?: {
            sampling?: {} & {
                [k: string]: unknown;
            };
            experimental?: {} & {
                [k: string]: unknown;
            };
            roots?: {
                listChanged?: boolean;
            } & {
                [k: string]: unknown;
            };
        } & {
            [k: string]: unknown;
        };
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        protocolVersion?: string;
        clientInfo?: {
            name?: string;
            version?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "initialize";
}, {
    params?: {
        capabilities?: {
            sampling?: {} & {
                [k: string]: unknown;
            };
            experimental?: {} & {
                [k: string]: unknown;
            };
            roots?: {
                listChanged?: boolean;
            } & {
                [k: string]: unknown;
            };
        } & {
            [k: string]: unknown;
        };
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        protocolVersion?: string;
        clientInfo?: {
            name?: string;
            version?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "initialize";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"completion/complete">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        ref: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        argument: z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        ref: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        argument: z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        ref: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        argument: z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        ref?: z.objectOutputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough"> | z.objectOutputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">;
        argument?: {
            name?: string;
            value?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "completion/complete";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        ref?: z.objectInputType<{
            type: z.ZodLiteral<"ref/resource">;
            uri: z.ZodString;
        }, z.ZodTypeAny, "passthrough"> | z.objectInputType<{
            type: z.ZodLiteral<"ref/prompt">;
            name: z.ZodString;
        }, z.ZodTypeAny, "passthrough">;
        argument?: {
            name?: string;
            value?: string;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "completion/complete";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"logging/setLevel">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "logging/setLevel";
}, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "logging/setLevel";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"prompts/get">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        name?: string;
        arguments?: Record<string, string>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/get";
}, {
    params?: {
        name?: string;
        arguments?: Record<string, string>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/get";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"prompts/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "prompts/list";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"resources/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/list";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"resources/templates/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/templates/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/templates/list";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"resources/read">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/read";
}, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/read";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"resources/subscribe">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/subscribe";
}, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/subscribe";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"resources/unsubscribe">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/unsubscribe";
}, {
    params?: {
        uri?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "resources/unsubscribe";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"tools/call">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        name?: string;
        arguments?: Record<string, unknown>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/call";
}, {
    params?: {
        name?: string;
        arguments?: Record<string, unknown>;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/call";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        cursor: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"tools/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/list";
}, {
    params?: {
        cursor?: string;
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "tools/list";
}>]>;
export declare const ClientNotificationSchema: z.ZodUnion<[z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/cancelled">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        requestId?: string | number;
        reason?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/cancelled";
}, {
    params?: {
        requestId?: string | number;
        reason?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/cancelled";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/progress">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        progress?: number;
        total?: number;
        _meta?: {} & {
            [k: string]: unknown;
        };
        progressToken?: string | number;
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/progress";
}, {
    params?: {
        progress?: number;
        total?: number;
        _meta?: {} & {
            [k: string]: unknown;
        };
        progressToken?: string | number;
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/progress";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/initialized">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/initialized";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/initialized";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/roots/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/roots/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/roots/list_changed";
}>]>;
export declare const ClientResultSchema: z.ZodUnion<[z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, "strict", z.ZodTypeAny, {
    _meta?: {} & {
        [k: string]: unknown;
    };
}, {
    _meta?: {} & {
        [k: string]: unknown;
    };
}>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    model: z.ZodString;
    stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["endTurn", "stopSequence", "maxTokens"]>, z.ZodString]>>;
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    model: z.ZodString;
    stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["endTurn", "stopSequence", "maxTokens"]>, z.ZodString]>>;
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    model: z.ZodString;
    stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["endTurn", "stopSequence", "maxTokens"]>, z.ZodString]>>;
    role: z.ZodEnum<["user", "assistant"]>;
    content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    roots: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    roots: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    roots: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>]>;
export declare const ServerRequestSchema: z.ZodUnion<[z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"ping">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "ping";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "ping";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"sampling/createMessage">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        systemPrompt: z.ZodOptional<z.ZodString>;
        includeContext: z.ZodOptional<z.ZodEnum<["none", "thisServer", "allServers"]>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodNumber;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        modelPreferences: z.ZodOptional<z.ZodObject<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        systemPrompt: z.ZodOptional<z.ZodString>;
        includeContext: z.ZodOptional<z.ZodEnum<["none", "thisServer", "allServers"]>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodNumber;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        modelPreferences: z.ZodOptional<z.ZodObject<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    } & {
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        systemPrompt: z.ZodOptional<z.ZodString>;
        includeContext: z.ZodOptional<z.ZodEnum<["none", "thisServer", "allServers"]>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodNumber;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        modelPreferences: z.ZodOptional<z.ZodObject<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>, "many">>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        messages?: z.objectOutputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">[];
        metadata?: {} & {
            [k: string]: unknown;
        };
        temperature?: number;
        maxTokens?: number;
        stopSequences?: string[];
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        systemPrompt?: string;
        includeContext?: "none" | "thisServer" | "allServers";
        modelPreferences?: {
            hints?: z.objectOutputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">[];
            costPriority?: number;
            speedPriority?: number;
            intelligencePriority?: number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "sampling/createMessage";
}, {
    params?: {
        messages?: z.objectInputType<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"image">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodLiteral<"audio">;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">[];
        metadata?: {} & {
            [k: string]: unknown;
        };
        temperature?: number;
        maxTokens?: number;
        stopSequences?: string[];
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
        systemPrompt?: string;
        includeContext?: "none" | "thisServer" | "allServers";
        modelPreferences?: {
            hints?: z.objectInputType<{
                name: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">[];
            costPriority?: number;
            speedPriority?: number;
            intelligencePriority?: number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "sampling/createMessage";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"roots/list">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "roots/list";
}, {
    params?: {
        _meta?: {
            progressToken?: string | number;
        } & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "roots/list";
}>]>;
export declare const ServerNotificationSchema: z.ZodUnion<[z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/cancelled">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        requestId: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        requestId?: string | number;
        reason?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/cancelled";
}, {
    params?: {
        requestId?: string | number;
        reason?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/cancelled";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/progress">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        progress: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
    } & {
        progressToken: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        progress?: number;
        total?: number;
        _meta?: {} & {
            [k: string]: unknown;
        };
        progressToken?: string | number;
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/progress";
}, {
    params?: {
        progress?: number;
        total?: number;
        _meta?: {} & {
            [k: string]: unknown;
        };
        progressToken?: string | number;
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/progress";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/message">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
        logger: z.ZodOptional<z.ZodString>;
        data: z.ZodUnknown;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
        logger: z.ZodOptional<z.ZodString>;
        data: z.ZodUnknown;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        level: z.ZodEnum<["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]>;
        logger: z.ZodOptional<z.ZodString>;
        data: z.ZodUnknown;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        data?: unknown;
        logger?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/message";
}, {
    params?: {
        level?: "info" | "error" | "debug" | "alert" | "critical" | "warning" | "notice" | "emergency";
        data?: unknown;
        logger?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/message";
}>, z.ZodObject<{} & {
    method: z.ZodLiteral<"notifications/resources/updated">;
    params: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    } & {
        uri: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    params?: {
        uri?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/updated";
}, {
    params?: {
        uri?: string;
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/updated";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/resources/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/resources/list_changed";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/tools/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/tools/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/tools/list_changed";
}>, z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
} & {
    method: z.ZodLiteral<"notifications/prompts/list_changed">;
}, "strip", z.ZodTypeAny, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/prompts/list_changed";
}, {
    params?: {
        _meta?: {} & {
            [k: string]: unknown;
        };
    } & {
        [k: string]: unknown;
    };
    method?: "notifications/prompts/list_changed";
}>]>;
export declare const ServerResultSchema: z.ZodUnion<[z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, "strict", z.ZodTypeAny, {
    _meta?: {} & {
        [k: string]: unknown;
    };
}, {
    _meta?: {} & {
        [k: string]: unknown;
    };
}>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
    serverInfo: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    instructions: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
    serverInfo: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    instructions: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        experimental: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        logging: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        completions: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        prompts: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        resources: z.ZodOptional<z.ZodObject<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subscribe: z.ZodOptional<z.ZodBoolean>;
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
        tools: z.ZodOptional<z.ZodObject<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            listChanged: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>;
    serverInfo: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        version: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>;
    instructions: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    completion: z.ZodObject<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    completion: z.ZodObject<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    completion: z.ZodObject<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        values: z.ZodArray<z.ZodString, "many">;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    description: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    description: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    description: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        role: z.ZodEnum<["user", "assistant"]>;
        content: z.ZodUnion<[z.ZodObject<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"image">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"audio">;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"resource">;
            resource: z.ZodUnion<[z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                text: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
            } & {
                blob: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>]>;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    prompts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    prompts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    prompts: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resources: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resources: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resources: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resourceTemplates: z.ZodArray<z.ZodObject<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resourceTemplates: z.ZodArray<z.ZodObject<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    resourceTemplates: z.ZodArray<z.ZodObject<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uriTemplate: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    contents: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    contents: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    contents: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
    } & {
        blob: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<[z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            text: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
        } & {
            blob: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
} & {
    nextCursor: z.ZodOptional<z.ZodString>;
} & {
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, z.ZodTypeAny, "passthrough">>]>;
export declare class McpError extends Error {
    readonly code: number;
    readonly data?: unknown;
    constructor(code: number, message: string, data?: unknown);
}
type Primitive = string | number | boolean | bigint | null | undefined;
type Flatten<T> = T extends Primitive ? T : T extends Array<infer U> ? Array<Flatten<U>> : T extends Set<infer U> ? Set<Flatten<U>> : T extends Map<infer K, infer V> ? Map<Flatten<K>, Flatten<V>> : T extends object ? {
    [K in keyof T]: Flatten<T[K]>;
} : T;
type Infer<Schema extends ZodTypeAny> = Flatten<z.infer<Schema>>;
export type ProgressToken = Infer<typeof ProgressTokenSchema>;
export type Cursor = Infer<typeof CursorSchema>;
export type Request = Infer<typeof RequestSchema>;
export type Notification = Infer<typeof NotificationSchema>;
export type Result = Infer<typeof ResultSchema>;
export type RequestId = Infer<typeof RequestIdSchema>;
export type JSONRPCRequest = Infer<typeof JSONRPCRequestSchema>;
export type JSONRPCNotification = Infer<typeof JSONRPCNotificationSchema>;
export type JSONRPCResponse = Infer<typeof JSONRPCResponseSchema>;
export type JSONRPCError = Infer<typeof JSONRPCErrorSchema>;
export type JSONRPCMessage = Infer<typeof JSONRPCMessageSchema>;
export type EmptyResult = Infer<typeof EmptyResultSchema>;
export type CancelledNotification = Infer<typeof CancelledNotificationSchema>;
export type Implementation = Infer<typeof ImplementationSchema>;
export type ClientCapabilities = Infer<typeof ClientCapabilitiesSchema>;
export type InitializeRequest = Infer<typeof InitializeRequestSchema>;
export type ServerCapabilities = Infer<typeof ServerCapabilitiesSchema>;
export type InitializeResult = Infer<typeof InitializeResultSchema>;
export type InitializedNotification = Infer<typeof InitializedNotificationSchema>;
export type PingRequest = Infer<typeof PingRequestSchema>;
export type Progress = Infer<typeof ProgressSchema>;
export type ProgressNotification = Infer<typeof ProgressNotificationSchema>;
export type PaginatedRequest = Infer<typeof PaginatedRequestSchema>;
export type PaginatedResult = Infer<typeof PaginatedResultSchema>;
export type ResourceContents = Infer<typeof ResourceContentsSchema>;
export type TextResourceContents = Infer<typeof TextResourceContentsSchema>;
export type BlobResourceContents = Infer<typeof BlobResourceContentsSchema>;
export type Resource = Infer<typeof ResourceSchema>;
export type ResourceTemplate = Infer<typeof ResourceTemplateSchema>;
export type ListResourcesRequest = Infer<typeof ListResourcesRequestSchema>;
export type ListResourcesResult = Infer<typeof ListResourcesResultSchema>;
export type ListResourceTemplatesRequest = Infer<typeof ListResourceTemplatesRequestSchema>;
export type ListResourceTemplatesResult = Infer<typeof ListResourceTemplatesResultSchema>;
export type ReadResourceRequest = Infer<typeof ReadResourceRequestSchema>;
export type ReadResourceResult = Infer<typeof ReadResourceResultSchema>;
export type ResourceListChangedNotification = Infer<typeof ResourceListChangedNotificationSchema>;
export type SubscribeRequest = Infer<typeof SubscribeRequestSchema>;
export type UnsubscribeRequest = Infer<typeof UnsubscribeRequestSchema>;
export type ResourceUpdatedNotification = Infer<typeof ResourceUpdatedNotificationSchema>;
export type PromptArgument = Infer<typeof PromptArgumentSchema>;
export type Prompt = Infer<typeof PromptSchema>;
export type ListPromptsRequest = Infer<typeof ListPromptsRequestSchema>;
export type ListPromptsResult = Infer<typeof ListPromptsResultSchema>;
export type GetPromptRequest = Infer<typeof GetPromptRequestSchema>;
export type TextContent = Infer<typeof TextContentSchema>;
export type ImageContent = Infer<typeof ImageContentSchema>;
export type AudioContent = Infer<typeof AudioContentSchema>;
export type EmbeddedResource = Infer<typeof EmbeddedResourceSchema>;
export type PromptMessage = Infer<typeof PromptMessageSchema>;
export type GetPromptResult = Infer<typeof GetPromptResultSchema>;
export type PromptListChangedNotification = Infer<typeof PromptListChangedNotificationSchema>;
export type Tool = Infer<typeof ToolSchema>;
export type ListToolsRequest = Infer<typeof ListToolsRequestSchema>;
export type ListToolsResult = Infer<typeof ListToolsResultSchema>;
export type CallToolResult = Infer<typeof CallToolResultSchema>;
export type CompatibilityCallToolResult = Infer<typeof CompatibilityCallToolResultSchema>;
export type CallToolRequest = Infer<typeof CallToolRequestSchema>;
export type ToolListChangedNotification = Infer<typeof ToolListChangedNotificationSchema>;
export type LoggingLevel = Infer<typeof LoggingLevelSchema>;
export type SetLevelRequest = Infer<typeof SetLevelRequestSchema>;
export type LoggingMessageNotification = Infer<typeof LoggingMessageNotificationSchema>;
export type SamplingMessage = Infer<typeof SamplingMessageSchema>;
export type CreateMessageRequest = Infer<typeof CreateMessageRequestSchema>;
export type CreateMessageResult = Infer<typeof CreateMessageResultSchema>;
export type ResourceReference = Infer<typeof ResourceReferenceSchema>;
export type PromptReference = Infer<typeof PromptReferenceSchema>;
export type CompleteRequest = Infer<typeof CompleteRequestSchema>;
export type CompleteResult = Infer<typeof CompleteResultSchema>;
export type Root = Infer<typeof RootSchema>;
export type ListRootsRequest = Infer<typeof ListRootsRequestSchema>;
export type ListRootsResult = Infer<typeof ListRootsResultSchema>;
export type RootsListChangedNotification = Infer<typeof RootsListChangedNotificationSchema>;
export type ClientRequest = Infer<typeof ClientRequestSchema>;
export type ClientNotification = Infer<typeof ClientNotificationSchema>;
export type ClientResult = Infer<typeof ClientResultSchema>;
export type ServerRequest = Infer<typeof ServerRequestSchema>;
export type ServerNotification = Infer<typeof ServerNotificationSchema>;
export type ServerResult = Infer<typeof ServerResultSchema>;
export {};
