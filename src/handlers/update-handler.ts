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

  constructor(client: Client, value: MessageValueType<"statuses">) {
    super(client, value);

    if (!(this.client instanceof Client))
      throw new Error("Invalid client - must be instance of Client");

    this.status =
      value.statuses[0].status.toUpperCase() as Uppercase<MessageStatusType>;

    this.timestamp = new Date(+value.statuses[0].timestamp * 1000);

    if (value.statuses[0].conversation)
      this.conversation = {
        conversationID: value.statuses[0].conversation.id,
        ...(value.statuses[0].conversation.expiration_timestamp && {
          expirationConversation: new Date(
            +value.statuses[0].conversation.expiration_timestamp * 1000
          ),
        }),
        conversationCategory:
          value.statuses[0].conversation.origin!.type.toUpperCase() as ConversationCategory,
        isBillable: value.statuses[0].pricing!.billable,
        pricingModel: value.statuses[0].pricing!.pricing_model,
      };

    Object.defineProperty(this, "client", { enumerable: false });
  }
}
