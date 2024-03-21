export interface ReplyButton {
    type: "reply";
    reply: {
        id: string;
        title: string;
    };
}
interface Address {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    type?: "HOME" | "WORK";
}
interface Email {
    email?: string;
    type?: "HOME" | "WORK";
}
export interface Name {
    formatted_name: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    suffix?: string;
    prefix?: string;
}
interface Org {
    company?: string;
    department?: string;
    title?: string;
}
interface Url {
    url: string;
    type?: "HOME" | "WORK";
}
export interface Phone {
    phone?: string;
    type?: "CELL" | "MAIN" | "IPHONE" | "HOME" | "WORK";
    wa_id?: string;
}
export interface SendMessageOptions {
    preview_url: boolean;
    messageId: string;
    header: string;
    footer: string;
    buttons: ReplyButton | ReplyButton[];
}
export interface SendContactOptions {
    replyToMessageId: string;
    birthday: Date;
    addresses: Address | Address[];
    emails: Email | Email[];
    org: Org;
    urls: Url | Url[];
}
export declare enum WhatsAppProfileVertical {
    "UNDEFINED" = 0,
    "OTHER" = 1,
    "AUTO" = 2,
    "BEAUTY" = 3,
    "APPAREL" = 4,
    "EDU" = 5,
    "ENTERTAIN" = 6,
    "EVENT_PLAN" = 7,
    "FINANCE" = 8,
    "GROCERY" = 9,
    "GOVT" = 10,
    "HOTEL" = 11,
    "HEALTH" = 12,
    "NONPROFIT" = 13,
    "PROF_SERVICES" = 14,
    "RETAIL" = 15,
    "TRAVEL" = 16,
    "RESTAURANT" = 17,
    "NOT_A_BIZ" = 18
}
export interface WhatsAppProfileData {
    about: string;
    address: string;
    description: string;
    email: string;
    profile_picture_url: string;
    websites: string[];
    vertical: WhatsAppProfileVertical;
    messaging_product?: string;
}
export interface getDisplayNameStatus {
    id: string;
    name_status: string;
}
export interface CreateTempleteResponse {
    id: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    category: "AUTHENTICATION" | "MARKETING" | "UTILITY";
}
export {};
