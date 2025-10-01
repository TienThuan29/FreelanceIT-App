import nodemailer, { Transporter } from 'nodemailer';
import { config } from '@/configs/config';
import logger from '@/libs/logger';
import {
    EmailOptions,
    EmailTemplate,
    EmailTemplateType,
    EmailTemplateData,
    WelcomeEmailData,
    VerificationEmailData,
    PasswordResetEmailData,
    NotificationEmailData
} from '@/types/email.type';
import {
    getWelcomeEmailTemplate,
    getVerificationEmailTemplate,
    getPasswordResetEmailTemplate,
    getNotificationEmailTemplate
} from '@/templates/email.template';

export class EmailService {
    private static instance: EmailService;
    private transporter: Transporter;

    private constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: config.SMTP_SECURE,
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASSWORD,
            },
        });

        this.verifyConnection();
    }

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    private async verifyConnection(): Promise<void> {
        try {
            await this.transporter.verify();
            logger.info('Email service connected successfully');
        } 
        catch (error) {
            logger.error('Email service connection failed:', error);
        }
    }

    public async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const mailOptions = {
                from: `${config.EMAIL_FROM_NAME} <${config.EMAIL_FROM}>`,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                attachments: options.attachments,
            };

            const result = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully to ${options.to}`, { messageId: result.messageId });
            return true;
        } catch (error) {
            logger.error('Failed to send email:', error);
            return false;
        }
    }

    public async sendTemplateEmail(
        to: string | string[],
        templateType: EmailTemplateType,
        data: EmailTemplateData
    ): Promise<boolean> {
        try {
            const template = this.getEmailTemplate(templateType, data);
            
            const options: EmailOptions = {
                to,
                subject: template.subject,
                html: template.html,
                text: template.text,
            };

            return await this.sendEmail(options);
        } catch (error) {
            logger.error('Failed to send template email:', error);
            return false;
        }
    }

    private getEmailTemplate(templateType: EmailTemplateType, data: EmailTemplateData): EmailTemplate {
        switch (templateType) {
            case 'welcome':
                return getWelcomeEmailTemplate(data as WelcomeEmailData);
            case 'verification':
                return getVerificationEmailTemplate(data as VerificationEmailData);
            case 'password-reset':
                return getPasswordResetEmailTemplate(data as PasswordResetEmailData);
            case 'notification':
                return getNotificationEmailTemplate(data as NotificationEmailData);
            default:
                throw new Error(`Unknown email template type: ${templateType}`);
        }
    }

}

export const emailService = EmailService.getInstance();
export default emailService;
