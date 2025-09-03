import { EmailInterface } from '@gitroom/nestjs-libraries/emails/email.interface';
export declare class NodeMailerProvider implements EmailInterface {
    name: string;
    validateEnvKeys: string[];
    sendEmail(to: string, subject: string, html: string, emailFromName: string, emailFromAddress: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
