import { EmailInterface } from '@gitroom/nestjs-libraries/emails/email.interface';
export declare class ResendProvider implements EmailInterface {
    name: string;
    validateEnvKeys: string[];
    sendEmail(to: string, subject: string, html: string, emailFromName: string, emailFromAddress: string, replyTo?: string): Promise<import("resend").CreateEmailResponse | {
        sent: boolean;
    }>;
}
