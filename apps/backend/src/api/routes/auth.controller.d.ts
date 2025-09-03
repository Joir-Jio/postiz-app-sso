import { Response, Request } from 'express';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
import { LoginUserDto } from '@gitroom/nestjs-libraries/dtos/auth/login.user.dto';
import { AuthService } from '@gitroom/backend/services/auth/auth.service';
import { ForgotReturnPasswordDto } from '@gitroom/nestjs-libraries/dtos/auth/forgot-return.password.dto';
import { ForgotPasswordDto } from '@gitroom/nestjs-libraries/dtos/auth/forgot.password.dto';
import { EmailService } from '@gitroom/nestjs-libraries/services/email.service';
export declare class AuthController {
    private _authService;
    private _emailService;
    constructor(_authService: AuthService, _emailService: EmailService);
    canRegister(): Promise<{
        register: boolean;
    }>;
    register(req: Request, body: CreateOrgUserDto, response: Response, ip: string, userAgent: string): Promise<void>;
    login(req: Request, body: LoginUserDto, response: Response, ip: string, userAgent: string): Promise<void>;
    forgot(body: ForgotPasswordDto): Promise<{
        forgot: boolean;
    }>;
    forgotReturn(body: ForgotReturnPasswordDto): Promise<{
        reset: boolean;
    }>;
    oauthLink(provider: string, query: any): Promise<string>;
    activate(code: string, response: Response): Promise<Response<any, Record<string, any>>>;
    oauthExists(code: string, provider: string, response: Response): Promise<Response<any, Record<string, any>>>;
}
