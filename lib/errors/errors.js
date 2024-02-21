"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppError = void 0;
class WhatsAppError extends Error {
    constructor(errorCode, message, fbtraceID, type, details, href, rawResponse) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.fbtraceID = fbtraceID;
        this.type = type;
        this.details = details;
        this.href = href;
        this.rawResponse = rawResponse;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, WhatsAppError.prototype);
    }
    toJson() {
        return `${this.name}(${this.message}, ${this.details}, ${this.errorCode})`;
    }
}
exports.WhatsAppError = WhatsAppError;
