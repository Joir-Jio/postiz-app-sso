"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const resend_provider_1 = require("@gitroom/nestjs-libraries/emails/resend.provider");
const empty_provider_1 = require("@gitroom/nestjs-libraries/emails/empty.provider");
const node_mailer_provider_1 = require("@gitroom/nestjs-libraries/emails/node.mailer.provider");
let EmailService = class EmailService {
    constructor() {
        this.emailService = this.selectProvider(process.env.EMAIL_PROVIDER);
        console.log('Email service provider:', this.emailService.name);
        for (const key of this.emailService.validateEnvKeys) {
            if (!process.env[key]) {
                console.error(`Missing environment variable: ${key}`);
            }
        }
    }
    hasProvider() {
        return !(this.emailService instanceof empty_provider_1.EmptyProvider);
    }
    selectProvider(provider) {
        switch (provider) {
            case 'resend':
                return new resend_provider_1.ResendProvider();
            case 'nodemailer':
                return new node_mailer_provider_1.NodeMailerProvider();
            default:
                return new empty_provider_1.EmptyProvider();
        }
    }
    async sendEmail(to, subject, html, replyTo) {
        if (to.indexOf('@') === -1) {
            return;
        }
        if (!process.env.EMAIL_FROM_ADDRESS || !process.env.EMAIL_FROM_NAME) {
            console.log('Email sender information not found in environment variables');
            return;
        }
        const modifiedHtml = `
    <div style="
        background: linear-gradient(to bottom right, #e6f2ff, #f0e6ff);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    ">
        <div style="
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            border-radius: 0.5rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            max-width: 48rem;
            width: 100%;
            padding: 2rem;
        ">
            <h1 style="
                font-size: 1.875rem;
                font-weight: bold;
                margin-bottom: 1.5rem;
                text-align: left;
                color: #1f2937;
            ">${subject}</h1>
            
            <div style="
                margin-bottom: 2rem;
                color: #374151;
            ">
                ${html}
            </div>
            
            <div style="
                display: flex;
                align-items: center;
                border-top: 1px solid #e5e7eb;
                padding-top: 1.5rem;
            ">
                <div>
                    <h2 style="
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0;
                    ">${process.env.EMAIL_FROM_NAME}</h2>
                </div>
            </div>
        </div>
    </div>
    `;
        try {
            const sends = await this.emailService.sendEmail(to, subject, modifiedHtml, process.env.EMAIL_FROM_NAME, process.env.EMAIL_FROM_ADDRESS, replyTo);
            console.log(sends);
        }
        catch (err) {
            console.log(err);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map