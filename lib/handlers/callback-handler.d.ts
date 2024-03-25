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
    constructor(client: Client, value: MessageValueType<"messages">);
    markMessageAsRead(): Promise<boolean>;
}
