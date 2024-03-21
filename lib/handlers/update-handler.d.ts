import Client from "../client/client";
import { ConversationCategory, MessageStatusType } from "../types/shared";
import { MessageValueType } from "../types/whatsapp-types";
import { BaseHandler } from "./base-handler";
export default class Update extends BaseHandler {
    status: Uppercase<MessageStatusType>;
    timestamp: Date;
    conversation?: {
        conversationID: string;
        expirationConversation?: Date;
        conversationCategory: ConversationCategory;
        isBillable: boolean;
        pricingModel: "CBP";
    };
    constructor(client: Client, value: MessageValueType<"statuses">);
}
