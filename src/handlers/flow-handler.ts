import Client from "../client/client";
import { Context } from "../types/exports-types";
import { MessageValueType } from "../types/whatsapp-types";
import { BaseHandler } from "./base-handler";

export default class FlowCompletion extends BaseHandler {
    type: "interactive";
    timestamp: Date;
    context?: Context;
    body: string;
    clickType: "nfm_reply";
    data: object;

    constructor(client: Client, value: any) {
        if (!(client instanceof Client)) throw new Error("Invalid client - must be instance of Client");

        super(client, value);

        if (value.messages[0].type !== "interactive") throw new Error("");

        this.type = value.messages[0].type;
        this.body = value.messages[0].interactive.nfm_reply.body;
        this.clickType = value.messages[0].interactive.type as "nfm_reply";
        this.timestamp = new Date(+value.messages[0].timestamp * 1000);
        if (value.messages[0].context?.from)
            this.context = {
                messageFrom: value.messages[0].context.from,
                messageID: value.messages[0].context.id,
            };
        this.data = value.messages[0].interactive.nfm_reply.response_json;

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
