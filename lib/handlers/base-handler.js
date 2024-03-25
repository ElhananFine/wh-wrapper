"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHandler = void 0;
class BaseHandler {
    constructor(client, value) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.client = client;
        const whID = (((_b = (_a = value.contacts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.wa_id) || ((_d = (_c = value.statuses) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.recipient_id));
        this.sender = whID;
        this.id = (((_f = (_e = value === null || value === void 0 ? void 0 : value.messages) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.id) || ((_g = value === null || value === void 0 ? void 0 : value.statuses) === null || _g === void 0 ? void 0 : _g[0].id));
        this.metadata = {
            displayPhoneNumber: value.metadata.display_phone_number,
            phoneNumberID: value.metadata.phone_number_id,
        };
        this.fromUser = {
            ...(((_k = (_j = (_h = value === null || value === void 0 ? void 0 : value.contacts) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.profile) === null || _k === void 0 ? void 0 : _k.name) && {
                name: value.contacts[0].profile.name,
            }),
            WhID: whID,
        };
    }
    async replyText(text, options) {
        return await this.client.sendMessage(this.sender, text, {
            ...options,
            messageID: this.id,
        });
    }
    async replyImage(image, options) {
        return await this.client.sendImage(this.sender, image, {
            ...options,
            messageID: this.id,
        });
    }
    async replyVideo(video, options) {
        return await this.client.sendVideo(this.sender, video, {
            ...options,
            messageID: this.id,
        });
    }
    async replyAudio(audio) {
        return await this.client.sendAudio(this.sender, audio, {
            messageID: this.id,
        });
    }
    async replyDocument(document, options) {
        return await this.client.sendDocument(this.sender, document, {
            ...options,
            messageID: this.id,
        });
    }
    async replyLocation(location, options) {
        return await this.client.sendLocation(this.sender, location, {
            ...options,
            messageID: this.id,
        });
    }
    async replySticker(sticker) {
        return await this.client.sendSticker(this.sender, sticker, {
            messageID: this.id,
        });
    }
    async react(emoji) {
        return await this.client.sendReaction(this.sender, emoji, this.id);
    }
    async unreact() {
        return await this.client.removeReaction(this.sender, this.id);
    }
    async replyTemplate(template) {
        return await this.client.sendTemplate(this.sender, template, { messageID: this.id });
    }
    async replyContact(name, phone, options) {
        return await this.client.sendContact(this.sender, name, phone, {
            ...options,
            messageID: this.id,
        });
    }
}
exports.BaseHandler = BaseHandler;
