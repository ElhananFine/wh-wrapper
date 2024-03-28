"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_handler_1 = require("./base-handler");
class RequestWelcome extends base_handler_1.BaseHandler {
    constructor(client, value) {
        super(client, value);
        this.type = value.messages[0].type;
        this.timestamp = this.timestamp = new Date(+value.messages[0].timestamp * 1000);
    }
}
exports.default = RequestWelcome;
