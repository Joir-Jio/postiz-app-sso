import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class ValidIn implements ValidatorConstraintInterface {
    private _load;
    validate(text: string, args: ValidationArguments): any;
    defaultMessage(args: ValidationArguments): string;
}
export declare class VideoDto {
    type: string;
    output: 'vertical' | 'horizontal';
    customParams: any;
}
