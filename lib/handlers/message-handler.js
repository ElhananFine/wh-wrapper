"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const client_1 = __importDefault(require("../client/client"));
const base_handler_1 = require("./base-handler");
class Message extends base_handler_1.BaseHandler {
    constructor(client, value) {
        var _a, _b, _c;
        if (!(client instanceof client_1.default))
            throw new Error("Invalid client - must be instance of Client");
        super(client, value);
        this.type = value.messages[0].type;
        this.timestamp = new Date(+value.messages[0].timestamp);
        this.forwarded = ((_a = value.messages[0].context) === null || _a === void 0 ? void 0 : _a.forwarded) || ((_b = value.messages[0].context) === null || _b === void 0 ? void 0 : _b.frequently_forwarded) || false;
        if (this.forwarded)
            this.forwardedManyTimes = ((_c = value.messages[0].context) === null || _c === void 0 ? void 0 : _c.frequently_forwarded) || false;
        this.isReply = !!value.messages[0].context;
        this.hasMedia = ["image", "video", "sticker", "document", "audio"].includes(this.type);
        switch (value.messages[0].type) {
            case "text":
                this.text = value.messages[0].text.body;
                break;
            case "image":
                this.image = Object.fromEntries(Object.entries(value.messages[0].image)
                    .filter(([key]) => key !== "mime_type")
                    .concat([["mimeType", value.messages[0].image.mime_type]]));
                break;
            case "video":
                this.video = Object.fromEntries(Object.entries(value.messages[0].video)
                    .filter(([key]) => key !== "mime_type")
                    .concat([["mimeType", value.messages[0].video.mime_type]]));
                break;
            case "sticker":
                this.sticker = Object.fromEntries(Object.entries(value.messages[0].sticker)
                    .filter(([key]) => key !== "mime_type")
                    .concat([["mimeType", value.messages[0].sticker.mime_type]]));
                break;
            case "document":
                this.document = Object.fromEntries(Object.entries(value.messages[0].document)
                    .filter(([key]) => key !== "mime_type")
                    .concat([["mimeType", value.messages[0].document.mime_type]]));
                break;
            case "audio":
                this.audio = Object.fromEntries(Object.entries(value.messages[0].audio)
                    .filter(([key]) => key !== "mime_type")
                    .concat([["mimeType", value.messages[0].audio.mime_type]]));
                break;
            case "location":
                this.location = { ...value.messages[0].location };
                break;
            case "reaction":
                this.reaction = {
                    messageID: value.messages[0].reaction.message_id,
                    ...(value.messages[0].reaction.emoji
                        ? { emoji: value.messages[0].reaction.emoji, type: "react" }
                        : { type: "unReact" }),
                };
                break;
            case "unsupported":
                this.error = {
                    code: value.messages[0].errors[0].code,
                    message: value.messages[0].errors[0].message,
                    ...(value.messages[0].errors[0].error_data && {
                        details: value.messages[0].errors[0].error_data.details,
                    }),
                };
                break;
            case "contacts":
                this.contacts = value.messages[0].contacts.map((contact) => ({
                    name: {
                        formattedName: contact.name.formatted_name,
                        ...(contact.name.first_name && {
                            firstName: contact.name.first_name,
                        }),
                        ...(contact.name.last_name && {
                            lastName: contact.name.last_name,
                        }),
                        ...(contact.name.middle_name && {
                            middleName: contact.name.middle_name,
                        }),
                    },
                    phome: contact.phones.map((phone) => ({
                        phone: phone.phone,
                        type: phone.type,
                        waID: phone.WhId,
                    })),
                }));
                break;
        }
        Object.defineProperty(this, "client", { enumerable: false });
    }
    async downloadMedia(options) {
        var _a;
        if (!this.hasMedia)
            throw new Error("There is no media in the message");
        try {
            const linkRequest = await this.client.makeRequest({
                method: "GET",
                url: `${this.client.url}/${this[this.type].id}`,
                params: { phone_number_id: this.metadata.phoneNumberID },
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
                ...(this.type === "document" && { fileName: this[this.type].filename }),
                mediaID: linkRequest.id,
            };
            if (options === null || options === void 0 ? void 0 : options.saveInDisk) {
                const dirPath = options.folderPath || path_1.default.join(__dirname, "../../files");
                if (!(0, fs_1.existsSync)(dirPath))
                    (0, fs_1.mkdirSync)(dirPath);
                try {
                    await fs_1.promises.access(dirPath, fs_1.constants.R_OK);
                    const fileName = path_1.default.join(dirPath, `${((_a = options === null || options === void 0 ? void 0 : options.fileName) === null || _a === void 0 ? void 0 : _a.replace(/[\/\\:*?"<>|]/g, "")) ||
                        this[this.type].filename + "-" + linkRequest.id}.${linkRequest.mime_type.split("/")[1]}`);
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
    async markMessageAsRead() {
        return await this.client.markMessageAsRead(this.id);
    }
}
exports.default = Message;
