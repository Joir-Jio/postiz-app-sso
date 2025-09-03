import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
export declare class HttpForbiddenException extends HttpException {
    constructor();
}
export declare class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpForbiddenException, host: ArgumentsHost): Response<any, Record<string, any>>;
}
