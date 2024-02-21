import { Express } from "express";
export interface Options {
    baseURL: string;
    apiVersion: string | number;
    webHookEndpoint: string;
    callbackUrl: string;
    appID: string;
    appSecret: string;
    businessAccountID: string;
    server: Express;
    port: number;
}
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
export interface WhatsAppProfileData {
    about: string;
    address: string;
    description: string;
    email: string;
    profile_picture_url: string;
    websites: string[];
    vertical: "UNDEFINED" | "OTHER" | "AUTO" | "BEAUTY" | "APPAREL" | "EDU" | "ENTERTAIN" | "EVENT_PLAN" | "FINANCE" | "GROCERY" | "GOVT" | "HOTEL" | "HEALTH" | "NONPROFIT" | "PROF_SERVICES" | "RETAIL" | "TRAVEL" | "RESTAURANT" | "NOT_A_BIZ";
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
