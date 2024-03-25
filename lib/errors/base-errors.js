"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryError = exports.WhatsAppError = void 0;
class WhatsAppError extends Error {
    constructor(code, message, fbtrace_id, type, details) {
        super(message);
        this.code = code;
        this.fbtraceID = fbtrace_id;
        this.type = type;
        this.details = details;
    }
}
exports.WhatsAppError = WhatsAppError;
class LibraryError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.LibraryError = LibraryError;
