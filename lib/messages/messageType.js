"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationCategory = exports.MessageStatusType = void 0;
var MessageStatusType;
(function (MessageStatusType) {
    MessageStatusType[MessageStatusType["SENT"] = 0] = "SENT";
    MessageStatusType[MessageStatusType["DELIVERED"] = 1] = "DELIVERED";
    MessageStatusType[MessageStatusType["READ"] = 2] = "READ";
    MessageStatusType[MessageStatusType["FAILED"] = 3] = "FAILED";
})(MessageStatusType || (exports.MessageStatusType = MessageStatusType = {}));
var ConversationCategory;
(function (ConversationCategory) {
    ConversationCategory[ConversationCategory["AUTHENTICATION"] = 0] = "AUTHENTICATION";
    ConversationCategory[ConversationCategory["MARKETING"] = 1] = "MARKETING";
    ConversationCategory[ConversationCategory["UTILITY"] = 2] = "UTILITY";
    ConversationCategory[ConversationCategory["SERVICE"] = 3] = "SERVICE";
    ConversationCategory[ConversationCategory["REFERRAL_CONVERSION"] = 4] = "REFERRAL_CONVERSION";
    ConversationCategory[ConversationCategory["UNKNOWN"] = 5] = "UNKNOWN";
})(ConversationCategory || (exports.ConversationCategory = ConversationCategory = {}));
