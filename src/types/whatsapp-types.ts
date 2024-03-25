// import { GetPhoneNumberByID } from "./internal-types";
import { ConversationCategory, HomeWork, LocationType, MediaBase, ReactionType } from "./shared";

export type MessageType =
    | "text"
    | "image"
    | "video"
    | "sticker"
    | "document"
    | "location"
    | "audio"
    | "reaction"
    | "interactive"
    | "contacts"
    | "unsupported"
    | "order"
    | "system"
    | "request_welcome"
    | "errors";

interface Contact {
    name: {
        formatted_name: string;
        first_name?: string;
        last_name?: string;
        middle_name?: string;
    };
    birthday?: string;
    phones: Partial<{ phone: string; type: HomeWork & "CELL"; WhId: string }>[];
    emails?: Partial<{ email?: string; type?: HomeWork }>[];
    urls?: Partial<{ url?: string; type?: string }>[];
    addresses?: Partial<{
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        country_code: string;
        type: HomeWork;
    }>[];
    org?: Partial<{ company: string; department: string; title: string }>;
}

type Text = { type: "text"; text: { body: string } };
type Image = { type: "image"; image: MediaBase };
type Video = { type: "video"; video: MediaBase };
type Sticker = { type: "sticker"; sticker: MediaBase & { animated?: boolean } };
type Document = { type: "document"; document: MediaBase & { filename?: string } };
type Location = { type: "location"; location: LocationType };
type Audio = { type: "audio"; audio: MediaBase & { voice?: boolean } };
type Reaction = { type: "reaction"; reaction: ReactionType };
type Interactive = {
    type: "interactive";
    interactive: {
        [K in "list_reply" | "button_reply"]: K extends "list_reply"
            ? { id: string; title: string; description?: string }
            : { id: string; title: string };
    } & { type: "list_reply" | "button_reply" };
};
type Contacts = { type: "contacts"; contacts: Contact[] };
type Unsupported = {
    type: "unsupported";
    errors: {
        code: number;
        title: string;
        message: string;
        error_data?: {
            details: string;
        };
    }[];
};
type MesaageTypes =
    | Text
    | Image
    | Video
    | Sticker
    | Document
    | Audio
    | Location
    | Reaction
    | Interactive
    | Contacts
    | Unsupported;

export type MessageValueType<T extends "messages" | "statuses"> = {
    messaging_product: "whatsapp";
    metadata: {
        display_phone_number: string;
        phone_number_id: string;
    };
} & (T extends "messages"
    ? {
          contacts: {
              profile: { name: string };
              wa_id: string;
          }[];
          messages: Array<
              {
                  from: string;
                  id: string;
                  timestamp: string;
              } & MesaageTypes & {
                      context?: Partial<{
                          from: string;
                          id: string;
                          forwarded: boolean;
                          frequently_forwarded: boolean;
                      }>;
                  }
          >;
          statuses?: never;
      }
    : {
          contacts?: never;
          statuses: Array<{
              id: string;
              status: "sent" | "delivered" | "read";
              timestamp: string;
              recipient_id: string;
              conversation?: {
                  id: string;
                  expiration_timestamp?: string;
                  origin?: { type: Lowercase<ConversationCategory> };
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

// interfaces
export interface GetAllSubscriptions {
    whatsapp_business_api_data: {
        category?: string;
        link: string;
        name: string;
        id: string;
    };
}
// export interface getPhoneNumbers {
//     data: GetPhoneNumberByID[];
//     paging?: {
//         cursors?: {
//             before: string;
//             after: string;
//         };
//     };
// }
