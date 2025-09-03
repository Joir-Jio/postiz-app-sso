import { ValidationOptions, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { ValidationContext } from '../types/sso/validation.types';
export declare class IsValidProductKeyConstraint implements ValidatorConstraintInterface {
    validate(productKey: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class IsValidExternalUserIdConstraint implements ValidatorConstraintInterface {
    validate(externalUserId: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class IsValidJwtTokenConstraint implements ValidatorConstraintInterface {
    validate(token: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class IsValidGcsPathConstraint implements ValidatorConstraintInterface {
    validate(gcsPath: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class IsValidMediaTypeConstraint implements ValidatorConstraintInterface {
    validate(mediaType: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class IsTrustedEmailDomainConstraint implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare class HasProductAccessConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsValidProductKey(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsValidExternalUserId(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsValidJwtToken(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsValidGcsPath(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsValidMediaType(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsTrustedEmailDomain(allowedDomains?: string[], validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function HasProductAccess(productKeyProperty: string, userIdProperty: string, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function SanitizeProductKey(): PropertyDecorator;
export declare function SanitizeExternalUserId(): PropertyDecorator;
export declare function NormalizeEmail(): PropertyDecorator;
export declare function SanitizeString(): PropertyDecorator;
export declare function ValidateJsonSchema<T>(schema: any, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function ValidateOr(...validators: ((value: any) => boolean)[]): (object: Object, propertyName: string) => void;
export declare function RequiredIf(dependentProperty: string, dependentValue: any, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare class SsoValidationException extends BadRequestException {
    constructor(errors: Array<{
        field: string;
        message: string;
        code: string;
    }>, context?: Partial<ValidationContext>);
}
export declare const createSsoValidationPipe: (context?: Partial<ValidationContext>) => {
    transform: (value: any) => any;
    validate: (errors: any[]) => void;
};
