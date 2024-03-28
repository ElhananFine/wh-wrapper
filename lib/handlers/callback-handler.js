"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client/client"));
const base_handler_1 = require("./base-handler");
class Callback extends base_handler_1.BaseHandler {
    constructor(client, value) {
        var _a;
        if (!(client instanceof client_1.default))
            throw new Error("Invalid client - must be instance of Client");
        super(client, value);
        if (value.messages[0].type !== "interactive")
            throw new Error();
        this.type = value.messages[0].type;
        this.clickType = value.messages[0].interactive.type
            .replace("list_reply", "listReply")
            .replace("button_reply", "buttonReply");
        this.timestamp = new Date(+value.messages[0].timestamp * 1000);
        if ((_a = value.messages[0].context) === null || _a === void 0 ? void 0 : _a.from)
            this.context = {
                messageFrom: value.messages[0].context.from,
                messageID: value.messages[0].context.id,
            };
        this.data = {
            title: value.messages[0].interactive[value.messages[0].interactive.type].title,
            id: value.messages[0].interactive[value.messages[0].interactive.type].id,
            ...(value.messages[0].interactive.type === "list_reply" && {
                description: value.messages[0].interactive.list_reply.description,
            }),
        };
        Object.defineProperty(this, "client", { enumerable: false });
    }
    async markMessageAsRead() {
        return await this.client.markMessageAsRead(this.id);
    }
}
exports.default = Callback;
