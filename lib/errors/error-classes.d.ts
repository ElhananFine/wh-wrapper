import { WhatsAppError } from "./whatsapp-error";
export declare class AuthError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class ThrottlingError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class IntegrityError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class ParameterError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class MessageError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class TemplateError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class RegistrationError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class BillingError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
export declare class UnknownError extends WhatsAppError {
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
    toString(): string;
}
