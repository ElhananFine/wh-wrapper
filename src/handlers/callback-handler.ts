import Client from "../client/client";
import { MessageValueType } from "../types/whatsapp-types";
import { BaseHandler } from "./base-handler";

export default class Callback extends BaseHandler {
  type: "interactive";
  timestamp: Date;
  replyToMessage?: {};
  clickType: "buttonReply" | "listReply";
  data: {
    title: string;
    id: string;
    description?: string;
  };

  constructor(client: Client, value: MessageValueType<"messages">) {
    if (!(client instanceof Client))
      throw new Error("Invalid client - must be instance of Client");

    super(client, value);

    this.type = value.messages[0].type as "interactive";
    this.clickType = value.messages[0]
      .interactive!.type!.replace("list_reply", "listReply")
      .replace("button_reply", "buttonReply") as "buttonReply" | "listReply";
    this.timestamp = new Date(+value.messages[0].timestamp * 1000);
    if (value.messages[0].context)
      this.replyToMessage = {
        ...(value.messages[0].context?.id && {
          messageID: value.messages[0].context?.id,
        }),
        ...(value.messages[0].context?.from && {
          messfromUserID: value.messages[0].context?.from,
        }),
      };
    this.data = {
      title:
        value.messages[0].interactive![value.messages[0].interactive!.type]
          .title,
      id: value.messages[0].interactive![value.messages[0].interactive!.type]
        .id,
      ...(value.messages[0].interactive!.type === "list_reply" && {
        description: value.messages[0].interactive!.list_reply.description,
      }),
    };

    Object.defineProperty(this, "client", { enumerable: false });
  }

  async markMessageAsRead(): Promise<boolean> {
    return await this.client.markMessageAsRead(this.id);
  }
}
