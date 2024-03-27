import Client from "../client/client";
import { Context } from "../types/exports-types";
import { MessageValueType } from "../types/whatsapp-types";
import { BaseHandler } from "./base-handler";

export default class Callback extends BaseHandler {
    type: "interactive";
    timestamp: Date;
    context?: Context;
    clickType: "buttonReply" | "listReply";
    data: {
        title: string;
        id: string;
        description?: string;
    };

    constructor(client: Client, value: MessageValueType<"messages">) {
        if (!(client instanceof Client)) throw new Error("Invalid client - must be instance of Client");

        super(client, value);

        if (value.messages[0].type !== "interactive") throw new Error();

        this.type = value.messages[0].type;
        this.clickType = value.messages[0].interactive.type
            .replace("list_reply", "listReply")
            .replace("button_reply", "buttonReply") as "buttonReply" | "listReply";
        this.timestamp = new Date(+value.messages[0].timestamp * 1000);
        if (value.messages[0].context?.from)
            this.context = {
                messageFrom: value.messages[0].context.from,
                messageID: value.messages[0].context.id,
            };
        this.data = {
            title: value.messages[0].interactive[value.messages[0].interactive.type].title,
            id: value.messages[0].interactive[value.messages[0].interactive.type].id,
            ...(value.messages[0].interactive.type === "list_reply" && {
                description: value.messages[0].interactive!.list_reply.description,
            }),
        };

        Object.defineProperty(this, "client", { enumerable: false });
    }

    /**
     * Mark this message as read.
     *
     * @async
     * @method markMessageAsRead
     * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating whether the message was successfully marked as read.
     */
    async markMessageAsRead(): Promise<boolean> {
        return await this.client.markMessageAsRead(this.id);
    }
}
