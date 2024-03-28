import * as z from "zod";
import Client from "../client/client";
import { SendContacOptionSchema, SendTemplateSchema, nameSchema, phoneSchema, sendMediaInteractiveSchema, sendMessageOptionsSchema } from "../schemas/schema";
import { FromUser, Metadata } from "../types/exports-types";
import { MessageValueType } from "../types/whatsapp-types";
export declare class BaseHandler {
    protected client: Client;
    sender: string;
    id: string;
    metadata: Metadata;
    fromUser: FromUser;
    constructor(client: Client, value: MessageValueType<"messages"> | MessageValueType<"statuses">);
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
    react(emoji: string): Promise<string>;
    unreact(): Promise<string>;
    replyTemplate(template: z.infer<typeof SendTemplateSchema>): Promise<string>;
    replyContact(name: z.infer<typeof nameSchema>, phone: z.infer<typeof phoneSchema>, options?: Omit<z.infer<typeof SendContacOptionSchema>, "messageID">): Promise<string>;
}
