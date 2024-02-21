"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageStatusHandler {
    constructor(messageObject) {
        const value = messageObject.entry[0].changes[0].value;
        this.id = value.statuses[0].id;
        this.metadata = value.metadata;
        this.status = value.statuses[0].status;
        this.timestamp = new Date(+value.statuses[0].timestamp * 1000);
        this.fromUser = {
            wa_id: value.statuses[0].recipient_id,
        };
        this.sender = this.fromUser.wa_id;
        if (value.statuses[0].conversation)
            this.conversation = {
                id: value.statuses[0].conversation.id,
                category: value.statuses[0].conversation.origin.type,
                expiration: new Date(+value.statuses[0].conversation.expiration_timestamp * 1000),
            };
        if (value.statuses[0].pricing.pricing_model)
            this.pricingModel = value.statuses[0].pricing.pricing_model;
    }
}
exports.default = MessageStatusHandler;
