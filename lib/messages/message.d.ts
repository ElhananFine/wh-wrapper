import Client from "../client/client";
import { Media, MessageType, Metadata, User, WhatsAppBusinessAccountObject, Location, Contact, Order, System, Reaction, ReplyToMessage, downloadMediaReturn, interactive } from "./messageType";
import { SendContacOptionSchema, SendTemplateSchema, nameSchema, phoneSchema, sendMediaInteractiveSchema, sendMessageOptionsSchema } from "../schemas/schema";
import * as z from "zod";
export default class Message {
    private client;
    id: string;
    metadata: Metadata;
    type: MessageType;
    fromUser: User;
    sender: string;
    timestamp: Date;
    forwarded: boolean;
    forwardedManyTimes: boolean;
    text: string | undefined;
    interactive: interactive | undefined;
    media: Media | undefined;
    hasMedia: boolean;
    isReply: boolean;
    replyToMessage?: ReplyToMessage | undefined;
    reaction?: Reaction | undefined;
    location?: Location | undefined;
    contacts?: Contact[] | undefined;
    order?: Order | undefined;
    system?: System | undefined;
    constructor(client: Client, messageObject: WhatsAppBusinessAccountObject);
    downloadMedia(options?: {
        saveInDisk?: boolean;
        fileName?: string;
        folderPath?: string;
    }): Promise<Partial<downloadMediaReturn>>;
    replyText(text: string, options?: Omit<z.infer<typeof sendMessageOptionsSchema>, "messageID">): Promise<string>;
    replyImage(image: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">): Promise<string>;
    replyVideo(video: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">): Promise<string>;
    replyAudio(audio: string): Promise<string>;
    replyDocument(document: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">): Promise<string>;
    replyLocation(location: {
        latitude: number | string;
        longitude: number | string;
    }, options?: {
        name?: string;
        address?: string;
    }): Promise<string>;
    replySticker(sticker: string): Promise<string>;
    replyContact(name: z.infer<typeof nameSchema>, phone: z.infer<typeof phoneSchema>, options?: Omit<z.infer<typeof SendContacOptionSchema>, "messageID">): Promise<string>;
    replyTemplate(template: z.infer<typeof SendTemplateSchema>): Promise<import("../interfaces/whatsapp-response-interface").MssageIDResponse | import("../interfaces/whatsapp-response-interface").BooleanResponse>;
    react(emoji: string): Promise<string>;
    unreact(): Promise<string>;
    markMessageAsRead(): Promise<boolean>;
}
