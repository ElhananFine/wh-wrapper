import type { Express } from "express";
import { GetPhoneNumberByID } from "./internal-types";
export interface Contact {
    name: {
        formatted_name: string;
        first_name?: string;
        last_name?: string;
        middle_name?: string;
    };
    birthday?: string;
    phones: Partial<{
        phone: string;
        type: HomeWork & "CELL";
        WhId: string;
    }>[];
    emails?: Partial<{
        email?: string;
        type?: HomeWork;
    }>[];
    urls?: Partial<{
        url?: string;
        type?: string;
    }>[];
    addresses?: Partial<{
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        country_code: string;
        type: HomeWork;
    }>[];
    org?: Partial<{
        company: string;
        department: string;
        title: string;
    }>;
}
export type MessageStatusType = "sent" | "delivered" | "read" | "failed";
export type ConversationCategory = "AUTHENTICATION" | "MARKETING" | "UTILITY" | "SERVICE" | "REFERRAL_CONVERSION" | "UNKNOWN";
export type HomeWork = "HOME" | "WORK";
export type MediaBase = {
    mime_type: string;
    sha256: string;
    id: string;
};
export type LocationType = {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    url?: string;
};
export type ReactionType = {
    message_id: string;
    emoji?: string;
};
export type ClientOptions = {
    baseURL: string;
    apiVersion: string | number;
    webHookEndpoint: string;
    callbackUrl: string;
    appID: number | string;
    appSecret: string;
    businessAccountID: string;
    server: Express;
    port: number;
};
export type GetPhoneDataReturn = Omit<GetPhoneNumberByID, "verified_name" | "display_phone_number" | "quality_rating" | "code_verification_status" | "platform_type" | "id"> & {
    verifiedName: string;
    phoneNumber: string;
    qualityRating: string;
    platformType: string;
    phoneNumberID: string;
};
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
