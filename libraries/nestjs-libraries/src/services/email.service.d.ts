import { EmailInterface } from '@gitroom/nestjs-libraries/emails/email.interface';
import { ResendProvider } from '@gitroom/nestjs-libraries/emails/resend.provider';
import { EmptyProvider } from '@gitroom/nestjs-libraries/emails/empty.provider';
import { NodeMailerProvider } from '@gitroom/nestjs-libraries/emails/node.mailer.provider';
export declare class EmailService {
    emailService: EmailInterface;
    constructor();
    hasProvider(): boolean;
    selectProvider(provider: string): ResendProvider | EmptyProvider | NodeMailerProvider;
    sendEmail(to: string, subject: string, html: string, replyTo?: string): Promise<void>;
}
