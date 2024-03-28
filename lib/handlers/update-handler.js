"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client/client"));
const base_handler_1 = require("./base-handler");
class Update extends base_handler_1.BaseHandler {
    constructor(client, value) {
        super(client, value);
        if (!(this.client instanceof client_1.default))
            throw new Error("Invalid client - must be instance of Client");
        this.status =
            value.statuses[0].status.toUpperCase();
        this.timestamp = new Date(+value.statuses[0].timestamp * 1000);
        if (value.statuses[0].conversation)
            this.conversation = {
                conversationID: value.statuses[0].conversation.id,
                ...(value.statuses[0].conversation.expiration_timestamp && {
                    expirationConversation: new Date(+value.statuses[0].conversation.expiration_timestamp * 1000),
                }),
                conversationCategory: value.statuses[0].conversation.origin.type.toUpperCase(),
                isBillable: value.statuses[0].pricing.billable,
                pricingModel: value.statuses[0].pricing.pricing_model,
            };
        Object.defineProperty(this, "client", { enumerable: false });
    }
}
exports.default = Update;
