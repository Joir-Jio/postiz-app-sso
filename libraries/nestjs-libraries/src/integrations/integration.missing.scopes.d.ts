import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { NotEnoughScopes } from '@gitroom/nestjs-libraries/integrations/social.abstract';
export declare class NotEnoughScopesFilter implements ExceptionFilter {
    catch(exception: NotEnoughScopes, host: ArgumentsHost): void;
}
