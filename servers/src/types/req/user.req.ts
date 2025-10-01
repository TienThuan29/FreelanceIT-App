import { Role } from "@/models/user.model";

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