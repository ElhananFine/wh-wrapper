import { ConversationCategory, HomeWork, LocationType, MediaBase, ReactionType } from "./shared";
export type MessageType = keyof Types | "unsupported" | "order" | "system" | "request_welcome" | "errors";
interface Contact {
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
type Types = {
    text: {
        body: string;
    };
    image: MediaBase;
    video: MediaBase;
    sticker: MediaBase & {
        animated?: boolean;
    };
    document: MediaBase & {
        filename?: string;
    };
    audio: MediaBase & {
        voice?: boolean;
    };
    location: LocationType;
    reaction: ReactionType;
    interactive: {
        [K in "list_reply" | "button_reply"]: K extends "list_reply" ? {
            id: string;
            title: string;
            description?: string;
        } : {
            id: string;
            title: string;
        };
    } & {
        type: "list_reply" | "button_reply";
    };
    contacts: Contact[];
    errors?: {
        code: number;
        title: string;
        message: string;
        error_data?: {
            details: string;
        };
    }[];
};
export type MessageValueType<T extends "messages" | "statuses"> = {
    messaging_product: "whatsapp";
    metadata: {
        display_phone_number: string;
        phone_number_id: string;
    };
} & (T extends "messages" ? {
    contacts: {
        profile: {
            name: string;
        };
        wa_id: string;
    }[];
    messages: Array<{
        from: string;
        id: string;
        timestamp: string;
        type: MessageType;
    } & {
        [K in keyof Types]?: Types[K];
    } & {
        context?: Partial<{
            from: string;
            id: string;
            forwarded: boolean;
            frequently_forwarded: boolean;
        }>;
    }>;
    statuses?: never;
} : {
    contacts?: never;
    statuses: Array<{
        id: string;
        status: "sent" | "delivered" | "read";
        timestamp: string;
        recipient_id: string;
        conversation?: {
            id: string;
            expiration_timestamp?: string;
            origin?: {
                type: Lowercase<ConversationCategory>;
            };
        };
        pricing?: {
            billable: boolean;
            pricing_model: "CBP";
            category: Lowercase<ConversationCategory>;
        };
    }>;
    messages?: never;
});
export interface RowWhatsappObject<T extends "messages" | "statuses"> {
    object: "whatsapp_business_account";
    entry: Array<{
        id: string;
        changes: Array<{
            value: MessageValueType<T>;
            field: "messages";
        }>;
    }>;
}
export {};
