import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class ValidContent implements ValidatorConstraintInterface {
    validate(contentRaw: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
