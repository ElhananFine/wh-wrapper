export class WhatsAppError extends Error {
    code: number;
    fbtraceID?: string;
    type?: string;
    details?: string;

    constructor(code: number, message: string, fbtrace_id?: string, type?: string, details?: string) {
        super(message);
        this.code = code;
        this.fbtraceID = fbtrace_id;
        this.type = type;
        this.details = details;
    }
}

export class LibraryError extends Error {
    constructor(message: string) {
        super(message);
    }
}
