import { Role, CustomerProfile } from "@/models/user.model";
import { Commune, Province } from "@/models/address.model";

export type RegisterRequest= {
    registerSessionId: string;
    email: string;
    password: string;
    fullname: string;
    role: Role;
    sixDigitsCode?: string;
}

export type VerifyCodeRequest = {
    registerSessionId: string;
    sixDigitsCode: string;
}

export type ForgotPasswordRequest = {
    email: string;
}

export type ResetPasswordRequest = {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export type CreateCustomerProfileRequest = {
    userId: string;
    companyName?: string;
    companyWebsite?: string;
    industry?: string;
    companySize?: string;
    taxId?: string;
    houseNumberAndStreet?: string;
    commune: Commune;
    province: Province;
}

export type UpdateCustomerProfileRequest = {
    companyName?: string;
    companyWebsite?: string;
    industry?: string;
    companySize?: string;
    taxId?: string;
    houseNumberAndStreet?: string;
    commune?: Commune;
    province?: Province;
}