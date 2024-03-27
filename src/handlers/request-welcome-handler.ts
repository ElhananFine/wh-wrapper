import Client from "../client/client";
import { MessageValueType } from "../types/whatsapp-types";
import { BaseHandler } from "./base-handler";

export default class RequestWelcome extends BaseHandler {
    type: "request_welcome";
    timestamp: Date;
    constructor(client: Client, value: MessageValueType<"messages">) {
        super(client, value);

        this.type = value.messages[0].type as "request_welcome";
        this.timestamp = this.timestamp = new Date(+value.messages[0].timestamp * 1000);
    }
}
