import { ConversationCategory, MessageStatusType, Metadata, User, WhatsAppBusinessAccountObject } from "./messageType";
export default class MessageStatusHandler {
    id: string;
    metadata: Metadata;
    status: MessageStatusType;
    timestamp: Date;
    fromUser: User;
    sender: string;
    conversation?: {
        id: string;
        category: ConversationCategory;
        expiration?: Date;
    };
    pricingModel?: string;
    constructor(messageObject: WhatsAppBusinessAccountObject);
}
