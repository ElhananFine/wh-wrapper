export declare class WhatsAppError extends Error {
    errorCode: number;
    message: string;
    fbtraceID: string;
    type: string;
    details?: string | undefined;
    href?: string | undefined;
    rawResponse?: string | undefined;
    name: string;
    constructor(errorCode: number, message: string, fbtraceID: string, type: string, details?: string | undefined, href?: string | undefined, rawResponse?: string | undefined);
    toJson(): string;
}
