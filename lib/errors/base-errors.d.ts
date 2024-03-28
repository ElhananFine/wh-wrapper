export declare class WhatsAppError extends Error {
    code: number;
    fbtraceID?: string;
    type?: string;
    details?: string;
    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string);
}
export declare class LibraryError extends Error {
    constructor(message: string);
}
