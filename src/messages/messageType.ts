import { Name } from "../interfaces/client-interface";

// import { Media, Reaction } from "./media";
interface WhatsAppBusinessAccountObject {
  object: "whatsapp_business_account";
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: Metadata;

        contacts: Array<User>;

        messages: Array<WhatsAppMessage>;
        statuses: Array<MessageStatus>;
      };

      field: string;
    }>;
  }>;
}
type MessageType =
  | "text"
  | "interactive"
  | "image"
  | "sticker"
  | "video"
  | "document"
  | "audio"
  | "location"
  | "contacts"
  | "order"
  | "system"
  | "request_welcome"
  | "errors";

export enum MessageStatusType {
  SENT,
  DELIVERED,
  READ,
  FAILED,
}

export enum ConversationCategory {
  AUTHENTICATION,
  MARKETING,
  UTILITY,
  SERVICE,
  REFERRAL_CONVERSION,
  UNKNOWN,
}

interface MessageStatus {
  id: string;
  status: MessageStatusType;
  timestamp: string;
  recipient_id: string;
  conversation: Conversation;
  pricing: Pricing;
}

interface Pricing {
  billable: boolean;
  pricing_model: "CBP";
  category: ConversationCategory;
}
interface Conversation {
  id: string;
  expiration_timestamp: string;
  origin: {
    type: ConversationCategory;
  };
}
export interface interactive {
  list_reply: InteractiveReply;
  button_reply: InteractiveReply;
  type: "list_reply" | "button_reply";
}
interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: MessageType;
  text?: {
    body: string;
  };
  image?: Media;
  video?: Media;
  sticker?: Media;
  document?: Media;
  audio?: Media;
  reaction?: Reaction;
  order?: Order;
  location?: Location;
  contacts?: Array<Contact>;
  interactive?: interactive;
  context?: Context;
  button?: {
    text: string;
    payload: string;
  };
  system?: System;
  // errors?: Array<WhError>;
}

interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}
interface User {
  profile?: {
    name: string;
  };
  wa_id: string;
}

interface Context {
  id: string;
  from: string;
  forwarded?: boolean;
  frequently_forwarded?: boolean;
  referredProduct?: {
    catalog_id: string;
    product_retailer_id: string;
  };
}

interface ReplyToMessage {
  messageID: string | undefined;
  fromUserID: string;
  referredProduct?: {
    catalog_id: string;
    product_retailer_id: string;
  };
}

interface Location {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  url?: string;
}

interface Contact {
  name: Name;
  birthday?: string;
  phones: {
    phone?: string;
    type?: string;
    WhId?: string;
  }[];
  emails?: {
    email?: string;
    type?: "HOME" | "WORK";
  }[];
  urls?: {
    url?: string;
    type?: string;
  }[];
  addresses?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    type?: "HOME" | "WORK";
  }[];
  org?: {
    company?: string;
    department?: string;
    title?: string;
  };
}

interface Order {
  catalogID: string;
  product_items: {
    product_retailer_id: string;
    quantity: string;
    item_price: string;
    currency: string;
  }[];
  text?: string;
}

interface System {
  type: string;
  body: string;
  identity?: string;
  WhId?: string;
  newWhId?: string;
}

interface InteractiveReply {
  id: string;
  title: string;
  description?: string;
}

interface Error {
  code: number;
  message: string;
  title: string;
  error_data?: {
    details: string;
  };
}

////////////////////////////////////////////////////////////////
interface Media {
  id: string;
  sha256: string;
  mimeType: string;
  caption?: string;
  animated?: boolean;
  voice?: boolean;
  filename: string;
}

interface Sticker {
  mime_type: string;
  sha256: string;
  id: string;
}

interface MediaUrlResponse {
  id: string;
  url: string;
  mimeType: string;
  sha256: string;
  fileSize: number;
}

interface Reaction {
  messageID: string;
  emoji?: string | undefined;
}

interface mediaResponse {
  mimetype: string;
  fileSize: string;
  base64Media: string | Buffer;
  filePath?: string;
}

interface CommerceSettings {
  isCatalogVisible?: boolean;
  isCartEnabled?: boolean;
}

interface ProductSection {
  title: string;
  skus: string[];
}

interface SendProductsParams {
  to: string;
  catalogId: string;
  productSections: ProductSection[];
  title: string;
  body: string;
  footer?: string;
  replyToMessageId?: string;
}

interface downloadMediaReturn {
  mimeType: string;
  fileSize: string;
  fileName: string;
  mediaID: string;
  base64?: string;
  path?: string;
}

export {
  downloadMediaReturn,
  SendProductsParams,
  CommerceSettings,
  mediaResponse,
  MessageType,
  Metadata,
  User,
  Context,
  Location,
  Contact,
  Order,
  System,
  WhatsAppMessage,
  WhatsAppBusinessAccountObject,
  Error,
  Conversation,
  Pricing,
  Media,
  Reaction,
  Sticker,
  ReplyToMessage,
};
