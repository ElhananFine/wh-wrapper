export class WhatsAppError extends Error {
  name: string;
  constructor(
    public errorCode: number,
    public message: string,
    public fbtraceID: string,
    public type: string,
    public details?: string | undefined,
    public href?: string | undefined,
    public rawResponse?: string | undefined,
  ) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, WhatsAppError.prototype);
  }
  toJson(): string {
    return `${this.name}(${this.message}, ${this.details}, ${this.errorCode})`;
  }
}
