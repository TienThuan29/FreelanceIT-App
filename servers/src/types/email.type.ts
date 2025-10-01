export interface EmailOptions {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    attachments?: EmailAttachment[];
}

export interface EmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
}

export interface EmailTemplate {
    subject: string;
    html: string;
    text?: string;
}

export interface WelcomeEmailData {
    userName: string;
    loginUrl?: string;
}

export interface VerificationEmailData {
    userName: string;
    verificationCode: string;
    expirationTime?: string;
}

export interface PasswordResetEmailData {
    userName: string;
    resetToken: string;
    resetUrl: string;
    expirationTime?: string;
}

export interface NotificationEmailData {
    userName: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
}

export type EmailTemplateType = 
    | 'welcome'
    | 'verification'
    | 'password-reset'
    | 'notification';

export type EmailTemplateData = 
    | WelcomeEmailData
    | VerificationEmailData
    | PasswordResetEmailData
    | NotificationEmailData;
