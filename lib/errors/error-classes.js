"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametersError = exports.UnknownError = exports.BillingError = exports.RegistrationError = exports.TemplateError = exports.MessageError = exports.ParameterError = exports.IntegrityError = exports.ThrottlingError = exports.AuthError = void 0;
const zod_1 = require("zod");
const base_errors_1 = require("./base-errors");
class AuthError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `AuthError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.AuthError = AuthError;
class ThrottlingError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `ThrottlingError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.ThrottlingError = ThrottlingError;
class IntegrityError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `IntegrityError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.IntegrityError = IntegrityError;
class ParameterError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `ParameterError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.ParameterError = ParameterError;
class MessageError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `MessageError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.MessageError = MessageError;
class TemplateError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `TemplateError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.TemplateError = TemplateError;
class RegistrationError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `RegistrationError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.RegistrationError = RegistrationError;
class BillingError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `BillingError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.BillingError = BillingError;
class UnknownError extends base_errors_1.WhatsAppError {
    constructor(code, message, fbtrace_id, type, details) {
        super(code, message, fbtrace_id, type, details);
    }
    toString() {
        return `UnknownError: ${this.message} (Code: ${this.code}, FB Trace ID: ${this.fbtraceID})${this.details ? ` Details: ${this.details}` : ""}`;
    }
}
exports.UnknownError = UnknownError;
class ParametersError extends base_errors_1.LibraryError {
    constructor(message, error) {
        super(message);
        this.errors = error.issues.map((e) => ({
            errorCode: e.code,
            errorParam: e.path.join("."),
            errorMessage: e.message,
            ...(e.code === zod_1.ZodIssueCode.invalid_type && {
                expected: e.expected,
                received: e.received,
            }),
        }));
    }
}
exports.ParametersError = ParametersError;
