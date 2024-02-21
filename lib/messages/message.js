"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const client_1 = __importDefault(require("../client/client"));
class Message {
    constructor(client, messageObject) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.client = client;
        if (!(client instanceof client_1.default))
            throw new Error("Invalid client - must be instance of Client");
        const value = messageObject.entry[0].changes[0].value;
        console.log(JSON.stringify(value));
        this.id = value.messages[0].id;
        this.metadata = value.metadata;
        this.type = value.messages[0].type;
        this.fromUser = value.contacts[0];
        this.sender = this.fromUser.wa_id;
        this.timestamp = new Date(+value.messages[0].timestamp * 1000);
        this.isReply = !!value.messages[0].context;
        if (value.messages[0].context)
            this.replyToMessage = {
                messageID: (_a = value.messages[0].context) === null || _a === void 0 ? void 0 : _a.id,
                fromUserID: (_b = value.messages[0].context) === null || _b === void 0 ? void 0 : _b.from,
                ...(((_c = value.messages[0].context) === null || _c === void 0 ? void 0 : _c.referredProduct) && {
                    referredProduct: (_d = value.messages[0].context) === null || _d === void 0 ? void 0 : _d.referredProduct,
                }),
            };
        this.forwarded =
            ((_e = value.messages[0].context) === null || _e === void 0 ? void 0 : _e.forwarded) ||
                ((_f = value.messages[0].context) === null || _f === void 0 ? void 0 : _f.frequently_forwarded) ||
                false;
        this.forwardedManyTimes =
            ((_g = value.messages[0].context) === null || _g === void 0 ? void 0 : _g.frequently_forwarded) || false;
        if ((_h = value.messages[0].text) === null || _h === void 0 ? void 0 : _h.body)
            this.text = (_j = value.messages[0].text) === null || _j === void 0 ? void 0 : _j.body;
        if (value.messages[0].interactive)
            this.interactive = value.messages[0].interactive;
        const mediaTypes = ["image", "video", "sticker", "document", "audio"];
        if (mediaTypes.includes(value.messages[0].type))
            this.media =
                value.messages[0][value.messages[0].type];
        this.hasMedia = !!this.media;
        if (value.messages[0].reaction)
            this.reaction = value.messages[0].reaction;
        if (value.messages[0].location)
            this.location = value.messages[0].location;
        if (value.messages[0].contacts)
            this.contacts = value.messages[0].contacts;
        if (value.messages[0].order)
            this.order = value.messages[0].order;
        if (value.messages[0].system)
            this.system = value.messages[0].system;
        Object.defineProperty(this, "client", { enumerable: false });
    }
    async downloadMedia(options) {
        var _a, _b, _c;
        if (!this.hasMedia)
            throw new Error("There is no media in the message");
        try {
            const linkRequest = await this.client.makeRequest({
                method: "GET",
                url: `${this.client.url}/${this.media.id}`,
                params: { phone_number_id: this.metadata.phone_number_id },
            });
            const fileRequest = await this.client.makeRequest({
                method: "GET",
                url: linkRequest.url.trim(),
                responseType: "arraybuffer",
            });
            const base64 = Buffer.from(fileRequest, "binary").toString("base64");
            const returnValues = {
                mimeType: linkRequest.mime_type,
                fileSize: linkRequest.file_size,
                fileName: ((_a = this.media) === null || _a === void 0 ? void 0 : _a.filename) || "default-file-name",
                mediaID: linkRequest.id,
            };
            if (options === null || options === void 0 ? void 0 : options.saveInDisk) {
                const dirPath = options.folderPath || path_1.default.join(__dirname, "../../files");
                if (!(0, fs_1.existsSync)(dirPath))
                    (0, fs_1.mkdirSync)(dirPath);
                try {
                    await fs_1.promises.access(dirPath, fs_1.constants.R_OK);
                    const fileName = path_1.default.join(dirPath, `${((_b = options === null || options === void 0 ? void 0 : options.fileName) === null || _b === void 0 ? void 0 : _b.replace(/[\/\\:*?"<>|]/g, "")) ||
                        ((_c = this.media) === null || _c === void 0 ? void 0 : _c.filename) + "-" + linkRequest.id}.${linkRequest.mime_type.split("/")[1]}`);
                    (0, fs_1.writeFileSync)(fileName, base64, "base64");
                    returnValues.path = fileName;
                }
                catch (e) {
                    throw new Error("אין הרשאת כתיבה לתיקייה");
                }
            }
            else {
                returnValues.base64 = base64;
            }
            return returnValues;
        }
        catch (e) {
            throw e;
        }
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
    async replyContact(name, phone, options) {
        return await this.client.sendContact(this.sender, name, phone, {
            ...options,
            messageID: this.id,
        });
    }
    async replyTemplate(template) {
        return await this.client.sendTemplate(this.sender, {
            name: "",
            language: "ENGLISH_US",
            body: [
                "הנחה",
                "הנחה שניה",
                { currency: "VALUE", code: "USD", amount: 1550 },
                { dateTime: "DATE" },
            ],
        }, { messageID: this.id });
    }
    async react(emoji) {
        return await this.client.sendReaction(this.sender, emoji, this.id);
    }
    async unreact() {
        return await this.client.removeReaction(this.sender, this.id);
    }
    async markMessageAsRead() {
        return await this.client.markMessageAsRead(this.id);
    }
}
exports.default = Message;
