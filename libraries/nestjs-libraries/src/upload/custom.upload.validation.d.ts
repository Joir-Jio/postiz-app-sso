import { PipeTransform } from '@nestjs/common';
export declare class CustomFileValidationPipe implements PipeTransform {
    transform(value: any): Promise<any>;
    private getMaxSize;
}
