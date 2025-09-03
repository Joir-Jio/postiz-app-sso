import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class SubscriptionExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
