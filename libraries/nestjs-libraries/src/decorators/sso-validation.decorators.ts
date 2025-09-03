/**
 * Validation decorators for multi-product SSO system
 * Provides runtime type validation using decorators and class-validator
 * 
 * @fileoverview NestJS validation decorators for SSO operations
 * @version 1.0.0
 */

import { 
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments, 
  ValidatorConstraint, 
  ValidatorConstraintInterface 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { 
  ValidationPatterns, 
  SsoErrorCode, 
  SsoErrorFactory, 
  ValidationContext,
  ValidationResult 
} from '../types/sso/validation.types';

/**
 * Product key validation constraint
 */
@ValidatorConstraint({ name: 'isValidProductKey', async: false })
export class IsValidProductKeyConstraint implements ValidatorConstraintInterface {
  validate(productKey: string, args: ValidationArguments) {
    if (!productKey || typeof productKey !== 'string') {
      return false;
    }
    return ValidationPatterns.PRODUCT_KEY.test(productKey);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Product key must be alphanumeric, start with a letter, and be 2-50 characters long';
  }
}

/**
 * External user ID validation constraint
 */
@ValidatorConstraint({ name: 'isValidExternalUserId', async: false })
export class IsValidExternalUserIdConstraint implements ValidatorConstraintInterface {
  validate(externalUserId: string, args: ValidationArguments) {
    if (!externalUserId || typeof externalUserId !== 'string') {
      return false;
    }
    return ValidationPatterns.EXTERNAL_USER_ID.test(externalUserId);
  }

  defaultMessage(args: ValidationArguments) {
    return 'External user ID must be alphanumeric with allowed characters (_.-) and 1-255 characters long';
  }
}

/**
 * JWT token validation constraint
 */
@ValidatorConstraint({ name: 'isValidJwtToken', async: false })
export class IsValidJwtTokenConstraint implements ValidatorConstraintInterface {
  validate(token: string, args: ValidationArguments) {
    if (!token || typeof token !== 'string') {
      return false;
    }
    return ValidationPatterns.JWT_TOKEN.test(token);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Token must be a valid JWT format';
  }
}

/**
 * GCS path validation constraint
 */
@ValidatorConstraint({ name: 'isValidGcsPath', async: false })
export class IsValidGcsPathConstraint implements ValidatorConstraintInterface {
  validate(gcsPath: string, args: ValidationArguments) {
    if (!gcsPath || typeof gcsPath !== 'string') {
      return false;
    }
    return ValidationPatterns.GCS_PATH.test(gcsPath);
  }

  defaultMessage(args: ValidationArguments) {
    return 'GCS path must be valid with allowed characters and up to 1000 characters';
  }
}

/**
 * Media type validation constraint
 */
@ValidatorConstraint({ name: 'isValidMediaType', async: false })
export class IsValidMediaTypeConstraint implements ValidatorConstraintInterface {
  validate(mediaType: string, args: ValidationArguments) {
    if (!mediaType || typeof mediaType !== 'string') {
      return false;
    }
    return ValidationPatterns.MEDIA_TYPE.test(mediaType);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Media type must be a valid MIME type format';
  }
}

/**
 * Email domain validation constraint for trusted domains
 */
@ValidatorConstraint({ name: 'isTrustedEmailDomain', async: true })
export class IsTrustedEmailDomainConstraint implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments) {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const domain = email.split('@')[1];
    if (!domain) {
      return false;
    }

    // Get allowed domains from args or context
    const allowedDomains = args.constraints[0] as string[] | undefined;
    if (!allowedDomains || allowedDomains.length === 0) {
      return true; // No restrictions
    }

    return allowedDomains.some(allowedDomain => 
      domain.toLowerCase() === allowedDomain.toLowerCase() ||
      domain.toLowerCase().endsWith('.' + allowedDomain.toLowerCase())
    );
  }

  defaultMessage(args: ValidationArguments) {
    const allowedDomains = args.constraints[0] as string[] | undefined;
    return `Email domain must be one of: ${allowedDomains?.join(', ') || 'any'}`;
  }
}

/**
 * Product access validation constraint
 */
@ValidatorConstraint({ name: 'hasProductAccess', async: true })
export class HasProductAccessConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const productKey = args.object[args.constraints[0] as string] as string;
    const userId = args.object[args.constraints[1] as string] as string;
    
    if (!productKey || !userId) {
      return false;
    }

    // In a real implementation, check database for product access
    // For now, return true as placeholder
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'User does not have access to this product';
  }
}

/**
 * Decorator factory functions
 */

/**
 * Validates product key format
 */
export function IsValidProductKey(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidProductKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidProductKeyConstraint,
    });
  };
}

/**
 * Validates external user ID format
 */
export function IsValidExternalUserId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidExternalUserId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidExternalUserIdConstraint,
    });
  };
}

/**
 * Validates JWT token format
 */
export function IsValidJwtToken(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidJwtToken',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidJwtTokenConstraint,
    });
  };
}

/**
 * Validates GCS path format
 */
export function IsValidGcsPath(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidGcsPath',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidGcsPathConstraint,
    });
  };
}

/**
 * Validates media type format
 */
export function IsValidMediaType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidMediaType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidMediaTypeConstraint,
    });
  };
}

/**
 * Validates email domain against trusted domains
 */
export function IsTrustedEmailDomain(allowedDomains?: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTrustedEmailDomain',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [allowedDomains],
      options: validationOptions,
      validator: IsTrustedEmailDomainConstraint,
    });
  };
}

/**
 * Validates user has access to specified product
 */
export function HasProductAccess(
  productKeyProperty: string, 
  userIdProperty: string, 
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'hasProductAccess',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [productKeyProperty, userIdProperty],
      options: validationOptions,
      validator: HasProductAccessConstraint,
    });
  };
}

/**
 * Transform decorators for data sanitization
 */

/**
 * Sanitizes and normalizes product key
 */
export function SanitizeProductKey() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase().trim().replace(/[^a-zA-Z0-9-]/g, '');
    }
    return value;
  });
}

/**
 * Sanitizes external user ID
 */
export function SanitizeExternalUserId() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim().replace(/[^a-zA-Z0-9_\-\.]/g, '');
    }
    return value;
  });
}

/**
 * Normalizes email to lowercase
 */
export function NormalizeEmail() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase().trim();
    }
    return value;
  });
}

/**
 * Trims and sanitizes string values
 */
export function SanitizeString() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim().replace(/\s+/g, ' ');
    }
    return value;
  });
}

/**
 * Advanced validation decorators for business logic
 */

/**
 * Validates JSON schema against Zod schema
 */
export function ValidateJsonSchema<T>(schema: any, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateJsonSchema',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [schema],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const schema = args.constraints[0];
          try {
            schema.parse(value);
            return true;
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match the required schema`;
        },
      },
    });
  };
}

/**
 * Validates against multiple conditions with OR logic
 */
export function ValidateOr(...validators: ((value: any) => boolean)[]) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateOr',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [validators],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validators = args.constraints[0] as ((value: any) => boolean)[];
          return validators.some(validator => validator(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must satisfy at least one validation condition`;
        },
      },
    });
  };
}

/**
 * Validates field dependencies
 */
export function RequiredIf(
  dependentProperty: string, 
  dependentValue: any, 
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'requiredIf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [dependentProperty, dependentValue],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [dependentProperty, dependentValue] = args.constraints;
          const dependentPropertyValue = (args.object as any)[dependentProperty];
          
          if (dependentPropertyValue === dependentValue) {
            return value !== null && value !== undefined && value !== '';
          }
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [dependentProperty, dependentValue] = args.constraints;
          return `${args.property} is required when ${dependentProperty} is ${dependentValue}`;
        },
      },
    });
  };
}

/**
 * Custom exception filter for SSO validation errors
 */
export class SsoValidationException extends BadRequestException {
  constructor(
    errors: Array<{ field: string; message: string; code: string }>,
    context?: Partial<ValidationContext>
  ) {
    const ssoError = SsoErrorFactory.createValidationError(
      SsoErrorCode.FIELD_FORMAT_INVALID,
      'Validation failed',
      errors.map(error => ({
        field: error.field,
        value: null,
        constraint: error.code,
        message: error.message,
      })),
      context
    );

    super({
      error: ssoError,
      message: 'Validation failed',
      statusCode: 400,
    });
  }
}

/**
 * Validation pipe factory for SSO operations
 */
export const createSsoValidationPipe = (context?: Partial<ValidationContext>) => {
  return {
    transform: (value: any) => value,
    validate: (errors: any[]) => {
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