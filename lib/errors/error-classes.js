"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownError = exports.BillingError = exports.RegistrationError = exports.TemplateError = exports.MessageError = exports.ParameterError = exports.IntegrityError = exports.ThrottlingError = exports.AuthError = void 0;
const whatsapp_error_1 = require("./whatsapp-error");
class AuthError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `AuthError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.AuthError = AuthError;
class ThrottlingError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `ThrottlingError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.ThrottlingError = ThrottlingError;
class IntegrityError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `IntegrityError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.IntegrityError = IntegrityError;
class ParameterError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `ParameterError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.ParameterError = ParameterError;
class MessageError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `MessageError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.MessageError = MessageError;
class TemplateError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `TemplateError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.TemplateError = TemplateError;
class RegistrationError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `RegistrationError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.RegistrationError = RegistrationError;
class BillingError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `BillingError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.BillingError = BillingError;
class UnknownError extends whatsapp_error_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `UnknownError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.UnknownError = UnknownError;
