import path from "path";
import { existsSync, mkdirSync, writeFileSync, promises as fsPromises, constants as fsConstants } from "fs";
import Client from "../client/client";
import { BaseHandler } from "./base-handler";
import type { MessageType, MessageValueType } from "../types/whatsapp-types";
import type {
    Image,
    Sticker,
    Video,
    Document,
    Audio,
    Location,
    Reaction,
    Error,
    Context,
    Media,
} from "../types/exports-types";
import type { Contact } from "../types/shared";

type MessageTypes = Exclude<MessageType, "order" | "system" | "interactive" | "request_welcome" | "errors">;

/** @constructor */
export default class Message extends BaseHandler {
    type: MessageTypes;
    timestamp: Date;
    forwarded: boolean;
    forwardedManyTimes?: boolean;
    isReply: boolean;
    context?: Context;
    hasMedia: boolean;
    text?: string;
    image?: Image;
    video?: Video;
    sticker?: Sticker;
    document?: Document;
    audio?: Audio;
    location?: Location;
    reaction?: Reaction;
    contacts?: Contact[];
    error?: Error;
    constructor(client: Client, value: MessageValueType<"messages">) {
        if (!(client instanceof Client)) throw new Error("Invalid client - must be instance of Client");
        super(client, value);
        this.type = value.messages[0].type as MessageTypes;
        this.timestamp = new Date(+value.messages[0].timestamp);
        this.forwarded = value.messages[0].context?.forwarded || value.messages[0].context?.frequently_forwarded || false;
        if (this.forwarded) this.forwardedManyTimes = value.messages[0].context?.frequently_forwarded || false;
        this.isReply = !!value.messages[0].context;
        if (value.messages[0].context?.from)
            this.context = {
                messageFrom: value.messages[0].context.from,
                messageID: value.messages[0].context.id,
            };
        this.hasMedia = ["image", "video", "sticker", "document", "audio"].includes(this.type);

        switch (value.messages[0].type) {
            case "text":
                this.text = value.messages[0].text.body;
                break;
            case "image":
                this.image = Object.fromEntries(
                    Object.entries(value.messages[0].image)
                        .filter(([key]) => key !== "mime_type")
                        .concat([["mimeType", value.messages[0].image.mime_type]])
                ) as Image;
                break;
            case "video":
                this.video = Object.fromEntries(
                    Object.entries(value.messages[0].video)
                        .filter(([key]) => key !== "mime_type")
                        .concat([["mimeType", value.messages[0].video.mime_type]])
                ) as Video;
                break;
            case "sticker":
                this.sticker = Object.fromEntries(
                    Object.entries(value.messages[0].sticker)
                        .filter(([key]) => key !== "mime_type")
                        .concat([["mimeType", value.messages[0].sticker.mime_type]])
                ) as Sticker;
                break;
            case "document":
                this.document = Object.fromEntries(
                    Object.entries(value.messages[0].document).map(([key, value]) => [
                        key === "filename" ? "fileName" : key === "mime_type" ? "mimeType" : key,
                        value,
                    ])
                ) as Document;
                break;
            case "audio":
                this.audio = Object.fromEntries(
                    Object.entries(value.messages[0].audio)
                        .filter(([key]) => key !== "mime_type")
                        .concat([["mimeType", value.messages[0].audio.mime_type]])
                ) as Audio;
                break;
            case "location":
                this.location = { ...value.messages[0].location } as Location;
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
                this.contacts = value.messages[0].contacts;
                break;
        }
        Object.defineProperty(this, "client", { enumerable: false });
    }

    /**
     * Downloads the media of the message if it exists.
     *
     * @async
     * @method downloadMedia
     * @param {boolean} [saveToFile=false] - Whether to save the media to a file or return it as a buffer.
     * @param {string} [fileName] - The name of the file to save the media as (required only if `saveToFile` is `true`).
     * @param {string} [folderPath] - The path to the folder where the media should be saved (required only if `saveToFile` is `true`; otherwise, the default is the `files` folder in the project directory).
     * @returns {Promise<{ mimeType: string; fileSize: string; filePath: string }> | Promise<{ mimeType: string; fileSize: string; fileBuffer: Buffer }>}
     * @throws {Error} If there is no media in the message or if there is an issue with folder permissions.
     */

    async downloadMedia(saveToFile: boolean = false, fileName?: string, folderPath?: string): Promise<Media> {
        type MediaType = "image" | "video" | "sticker" | "document" | "audio";
        if (!this.hasMedia) throw new Error("There is no media in the message");
        try {
            const linkRequest = await this.client.makeRequest<{
                messaging_product: "whatsapp";
                url: string;
                mime_type: string;
                sha256: string;
                file_size: string;
                id: string;
            }>({
                method: "GET",
                url: `${this.client.url}/${this[this.type as MediaType]!.id}`,
                params: { phone_number_id: this.metadata.phoneNumberID },
            });
            const fileBuffer: Buffer = await this.client.makeRequest<Buffer>({
                method: "GET",
                url: linkRequest.url.trim(),
                responseType: "arraybuffer",
            });
            const userDirectoryPath = process.cwd();
            const filesDirectoryPath = folderPath || path.join(userDirectoryPath, "files");
            if (!existsSync(filesDirectoryPath)) {
                try {
                    mkdirSync(filesDirectoryPath, { recursive: true });
                } catch (e: any) {
                    if (e.code === "EACCES") {
                        throw new Error("No permission to create the folder");
                    } else {
                        throw e;
                    }
                }
            }
            if (saveToFile) {
                try {
                    await fsPromises.access(filesDirectoryPath, fsConstants.R_OK | fsConstants.W_OK);
                    const filePath = path.join(
                        filesDirectoryPath,
                        `${fileName?.replace(/[\\/:"*?<>|]/g, "") || linkRequest.url.split("hash=")?.[1]}.${
                            linkRequest.mime_type.split("/")[1]
                        }`
                    );
                    writeFileSync(filePath, fileBuffer);
                    return {
                        mimeType: linkRequest.mime_type,
                        fileSize: linkRequest.file_size,
                        filePath,
                    };
                } catch (e: any) {
                    if (e.code === "EACCES") {
                        throw new Error("No write access to the folder");
                    } else {
                        throw e;
                    }
                }
            } else {
                return {
                    mimeType: linkRequest.mime_type,
                    fileSize: linkRequest.file_size,
                    fileBuffer,
                };
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * Mark this message as read.
     *
     * @async
     * @method markMessageAsRead
     * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating whether the message was successfully marked as read.
     */
    async markMessageAsRead(): Promise<boolean> {
        return await this.client.markMessageAsRead(this.id);
    }
}
