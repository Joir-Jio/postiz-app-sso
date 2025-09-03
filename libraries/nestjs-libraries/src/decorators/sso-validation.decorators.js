"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSsoValidationPipe = exports.SsoValidationException = exports.HasProductAccessConstraint = exports.IsTrustedEmailDomainConstraint = exports.IsValidMediaTypeConstraint = exports.IsValidGcsPathConstraint = exports.IsValidJwtTokenConstraint = exports.IsValidExternalUserIdConstraint = exports.IsValidProductKeyConstraint = void 0;
exports.IsValidProductKey = IsValidProductKey;
exports.IsValidExternalUserId = IsValidExternalUserId;
exports.IsValidJwtToken = IsValidJwtToken;
exports.IsValidGcsPath = IsValidGcsPath;
exports.IsValidMediaType = IsValidMediaType;
exports.IsTrustedEmailDomain = IsTrustedEmailDomain;
exports.HasProductAccess = HasProductAccess;
exports.SanitizeProductKey = SanitizeProductKey;
exports.SanitizeExternalUserId = SanitizeExternalUserId;
exports.NormalizeEmail = NormalizeEmail;
exports.SanitizeString = SanitizeString;
exports.ValidateJsonSchema = ValidateJsonSchema;
exports.ValidateOr = ValidateOr;
exports.RequiredIf = RequiredIf;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
const validation_types_1 = require("../types/sso/validation.types");
let IsValidProductKeyConstraint = class IsValidProductKeyConstraint {
    validate(productKey, args) {
        if (!productKey || typeof productKey !== 'string') {
            return false;
        }
        return validation_types_1.ValidationPatterns.PRODUCT_KEY.test(productKey);
    }
    defaultMessage(args) {
        return 'Product key must be alphanumeric, start with a letter, and be 2-50 characters long';
    }
};
exports.IsValidProductKeyConstraint = IsValidProductKeyConstraint;
exports.IsValidProductKeyConstraint = IsValidProductKeyConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidProductKey', async: false })
], IsValidProductKeyConstraint);
let IsValidExternalUserIdConstraint = class IsValidExternalUserIdConstraint {
    validate(externalUserId, args) {
        if (!externalUserId || typeof externalUserId !== 'string') {
            return false;
        }
        return validation_types_1.ValidationPatterns.EXTERNAL_USER_ID.test(externalUserId);
    }
    defaultMessage(args) {
        return 'External user ID must be alphanumeric with allowed characters (_.-) and 1-255 characters long';
    }
};
exports.IsValidExternalUserIdConstraint = IsValidExternalUserIdConstraint;
exports.IsValidExternalUserIdConstraint = IsValidExternalUserIdConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidExternalUserId', async: false })
], IsValidExternalUserIdConstraint);
let IsValidJwtTokenConstraint = class IsValidJwtTokenConstraint {
    validate(token, args) {
        if (!token || typeof token !== 'string') {
            return false;
        }
        return validation_types_1.ValidationPatterns.JWT_TOKEN.test(token);
    }
    defaultMessage(args) {
        return 'Token must be a valid JWT format';
    }
};
exports.IsValidJwtTokenConstraint = IsValidJwtTokenConstraint;
exports.IsValidJwtTokenConstraint = IsValidJwtTokenConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidJwtToken', async: false })
], IsValidJwtTokenConstraint);
let IsValidGcsPathConstraint = class IsValidGcsPathConstraint {
    validate(gcsPath, args) {
        if (!gcsPath || typeof gcsPath !== 'string') {
            return false;
        }
        return validation_types_1.ValidationPatterns.GCS_PATH.test(gcsPath);
    }
    defaultMessage(args) {
        return 'GCS path must be valid with allowed characters and up to 1000 characters';
    }
};
exports.IsValidGcsPathConstraint = IsValidGcsPathConstraint;
exports.IsValidGcsPathConstraint = IsValidGcsPathConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidGcsPath', async: false })
], IsValidGcsPathConstraint);
let IsValidMediaTypeConstraint = class IsValidMediaTypeConstraint {
    validate(mediaType, args) {
        if (!mediaType || typeof mediaType !== 'string') {
            return false;
        }
        return validation_types_1.ValidationPatterns.MEDIA_TYPE.test(mediaType);
    }
    defaultMessage(args) {
        return 'Media type must be a valid MIME type format';
    }
};
exports.IsValidMediaTypeConstraint = IsValidMediaTypeConstraint;
exports.IsValidMediaTypeConstraint = IsValidMediaTypeConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidMediaType', async: false })
], IsValidMediaTypeConstraint);
let IsTrustedEmailDomainConstraint = class IsTrustedEmailDomainConstraint {
    async validate(email, args) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        const domain = email.split('@')[1];
        if (!domain) {
            return false;
        }
        const allowedDomains = args.constraints[0];
        if (!allowedDomains || allowedDomains.length === 0) {
            return true;
        }
        return allowedDomains.some(allowedDomain => domain.toLowerCase() === allowedDomain.toLowerCase() ||
            domain.toLowerCase().endsWith('.' + allowedDomain.toLowerCase()));
    }
    defaultMessage(args) {
        const allowedDomains = args.constraints[0];
        return `Email domain must be one of: ${(allowedDomains === null || allowedDomains === void 0 ? void 0 : allowedDomains.join(', ')) || 'any'}`;
    }
};
exports.IsTrustedEmailDomainConstraint = IsTrustedEmailDomainConstraint;
exports.IsTrustedEmailDomainConstraint = IsTrustedEmailDomainConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isTrustedEmailDomain', async: true })
], IsTrustedEmailDomainConstraint);
let HasProductAccessConstraint = class HasProductAccessConstraint {
    async validate(value, args) {
        const productKey = args.object[args.constraints[0]];
        const userId = args.object[args.constraints[1]];
        if (!productKey || !userId) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return 'User does not have access to this product';
    }
};
exports.HasProductAccessConstraint = HasProductAccessConstraint;
exports.HasProductAccessConstraint = HasProductAccessConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'hasProductAccess', async: true })
], HasProductAccessConstraint);
function IsValidProductKey(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidProductKey',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidProductKeyConstraint,
        });
    };
}
function IsValidExternalUserId(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidExternalUserId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidExternalUserIdConstraint,
        });
    };
}
function IsValidJwtToken(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidJwtToken',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidJwtTokenConstraint,
        });
    };
}
function IsValidGcsPath(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidGcsPath',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidGcsPathConstraint,
        });
    };
}
function IsValidMediaType(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidMediaType',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidMediaTypeConstraint,
        });
    };
}
function IsTrustedEmailDomain(allowedDomains, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isTrustedEmailDomain',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [allowedDomains],
            options: validationOptions,
            validator: IsTrustedEmailDomainConstraint,
        });
    };
}
function HasProductAccess(productKeyProperty, userIdProperty, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'hasProductAccess',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [productKeyProperty, userIdProperty],
            options: validationOptions,
            validator: HasProductAccessConstraint,
        });
    };
}
function SanitizeProductKey() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase().trim().replace(/[^a-zA-Z0-9-]/g, '');
        }
        return value;
    });
}
function SanitizeExternalUserId() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.trim().replace(/[^a-zA-Z0-9_\-\.]/g, '');
        }
        return value;
    });
}
function NormalizeEmail() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase().trim();
        }
        return value;
    });
}
function SanitizeString() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.trim().replace(/\s+/g, ' ');
        }
        return value;
    });
}
function ValidateJsonSchema(schema, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'validateJsonSchema',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [schema],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const schema = args.constraints[0];
                    try {
                        schema.parse(value);
                        return true;
                    }
                    catch (error) {
                        return false;
                    }
                },
                defaultMessage(args) {
                    return `${args.property} must match the required schema`;
                },
            },
        });
    };
}
function ValidateOr(...validators) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'validateOr',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [validators],
            validator: {
                validate(value, args) {
                    const validators = args.constraints[0];
                    return validators.some(validator => validator(value));
                },
                defaultMessage(args) {
                    return `${args.property} must satisfy at least one validation condition`;
                },
            },
        });
    };
}
function RequiredIf(dependentProperty, dependentValue, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'requiredIf',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [dependentProperty, dependentValue],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [dependentProperty, dependentValue] = args.constraints;
                    const dependentPropertyValue = args.object[dependentProperty];
                    if (dependentPropertyValue === dependentValue) {
                        return value !== null && value !== undefined && value !== '';
                    }
                    return true;
                },
                defaultMessage(args) {
                    const [dependentProperty, dependentValue] = args.constraints;
                    return `${args.property} is required when ${dependentProperty} is ${dependentValue}`;
                },
            },
        });
    };
}
class SsoValidationException extends common_1.BadRequestException {
    constructor(errors, context) {
        const ssoError = validation_types_1.SsoErrorFactory.createValidationError(validation_types_1.SsoErrorCode.FIELD_FORMAT_INVALID, 'Validation failed', errors.map(error => ({
            field: error.field,
            value: null,
            constraint: error.code,
            message: error.message,
        })), context);
        super({
            error: ssoError,
            message: 'Validation failed',
            statusCode: 400,
        });
    }
}
exports.SsoValidationException = SsoValidationException;
const createSsoValidationPipe = (context) => {
    return {
        transform: (value) => value,
        validate: (errors) => {
            if (errors.length > 0) {
                const validationErrors = errors.map(error => ({
                    field: error.property,
                    message: Object.values(error.constraints || {}).join(', '),
                    code: Object.keys(error.constraints || {})[0] || 'VALIDATION_ERROR',
                }));
                throw new SsoValidationException(validationErrors, context);
            }
        },
    };
};
exports.createSsoValidationPipe = createSsoValidationPipe;
//# sourceMappingURL=sso-validation.decorators.js.map