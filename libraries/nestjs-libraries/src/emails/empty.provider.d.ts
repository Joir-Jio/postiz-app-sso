import { EmailInterface } from './email.interface';
export declare class EmptyProvider implements EmailInterface {
    name: string;
    validateEnvKeys: any[];
    sendEmail(to: string, subject: string, html: string): Promise<string>;
}
