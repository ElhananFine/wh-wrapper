import Client from "../client/client";
import { BaseHandler } from "./base-handler";
import { MessageType, MessageValueType } from "../types/whatsapp-types";
import { Image, Sticker, Video, Document, Audio, Location, Reaction, Contacts, Error } from "../types/exports-types";
export default class Message extends BaseHandler {
    type: MessageType;
    timestamp: Date;
    forwarded: boolean;
    forwardedManyTimes?: boolean;
    isReply: boolean;
    hasMedia: boolean;
    text?: string;
    image?: Image;
    video?: Video;
    sticker?: Sticker;
    document?: Document;
    audio?: Audio;
    location?: Location;
    reaction?: Reaction;
    contacts?: Contacts;
    error?: Error;
    constructor(client: Client, value: MessageValueType<"messages">);
    downloadMedia(options?: {
        saveInDisk?: boolean;
        fileName?: string;
        folderPath?: string;
    }): Promise<any>;
    markMessageAsRead(): Promise<boolean>;
}
