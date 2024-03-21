import { WhatsAppError } from "./whatsapp-error";

export class AuthError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `AuthError: ${this.message} (Code: ${this.code}, FB Trace ID: ${
      this.fbtraceID
    })${this.details ? ` Details: ${this.details}` : ""}`;
  }
}

export class ThrottlingError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `ThrottlingError: ${this.message} (Code: ${
      this.code
    }, FB Trace ID: ${this.fbtraceID})${
      this.details ? ` Details: ${this.details}` : ""
    }`;
  }
}

export class IntegrityError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `IntegrityError: ${this.message} (Code: ${this.code}, FB Trace ID: ${
      this.fbtraceID
    })${this.details ? ` Details: ${this.details}` : ""}`;
  }
}

export class ParameterError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `ParameterError: ${this.message} (Code: ${this.code}, FB Trace ID: ${
      this.fbtraceID
    })${this.details ? ` Details: ${this.details}` : ""}`;
  }
}

export class MessageError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `MessageError: ${this.message} (Code: ${this.code}, FB Trace ID: ${
      this.fbtraceID
    })${this.details ? ` Details: ${this.details}` : ""}`;
  }
}

export class TemplateError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `TemplateError: ${this.message} (Code: ${this.code}, FB Trace ID: ${
      this.fbtraceID
    })${this.details ? ` Details: ${this.details}` : ""}`;
  }
}

export class RegistrationError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `RegistrationError: ${this.message} (Code: ${
      this.code
    }, FB Trace ID: ${this.fbtraceID})${
      this.details ? ` Details: ${this.details}` : ""
    }`;
  }
}

export class BillingError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `BillingError: ${this.message} (Code: ${this.code}, FB Trace ID: ${
      this.fbtraceID
    })${this.details ? ` Details: ${this.details}` : ""}`;
  }
}

export class UnknownError extends WhatsAppError {
  constructor(
    code: number,
    message: string,
    fbtrace_id?: string,
    type?: string,
    details?: string
  ) {
    super(code, message, fbtrace_id, type, details);
  }

  toString() {
    return `UnknownError: ${this.message} (Code: ${this.code}, FB Trace ID: ${
      this.fbtraceID
    })${this.details ? ` Details: ${this.details}` : ""}`;
  }
}
