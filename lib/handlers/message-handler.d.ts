import Client from "../client/client";
import { BaseHandler } from "./base-handler";
import type { MessageType, MessageValueType } from "../types/whatsapp-types";
import type { Image, Sticker, Video, Document, Audio, Location, Reaction, Error, Context, Media } from "../types/exports-types";
import type { Contact } from "../types/shared";
type MessageTypes = Exclude<MessageType, "order" | "system" | "interactive" | "request_welcome" | "errors">;
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
    constructor(client: Client, value: MessageValueType<"messages">);
    downloadMedia(saveToFile?: boolean, fileName?: string, folderPath?: string): Promise<Media>;
    markMessageAsRead(): Promise<boolean>;
}
export {};
