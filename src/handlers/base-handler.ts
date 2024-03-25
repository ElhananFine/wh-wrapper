import * as z from "zod";
import Client from "../client/client";
import {
    SendContacOptionSchema,
    SendTemplateSchema,
    nameSchema,
    phoneSchema,
    sendMediaInteractiveSchema,
    sendMessageOptionsSchema,
} from "../schemas/schema";
import { FromUser, Metadata } from "../types/exports-types";
import { MessageValueType } from "../types/whatsapp-types";

export class BaseHandler {
    sender: string;
    id: string;
    metadata: Metadata;
    fromUser: FromUser;

    constructor(protected client: Client, value: MessageValueType<"messages"> | MessageValueType<"statuses">) {
        //
        const whID = (value.contacts?.[0]?.wa_id || value.statuses?.[0]?.recipient_id) as string;

        this.sender = whID;
        this.id = (value?.messages?.[0]?.id || value?.statuses?.[0].id) as string;
        this.metadata = {
            displayPhoneNumber: value.metadata.display_phone_number,
            phoneNumberID: value.metadata.phone_number_id,
        };
        this.fromUser = {
            ...(value?.contacts?.[0]?.profile?.name && {
                name: value.contacts[0].profile.name,
            }),
            WhID: whID,
        };
    }

    async replyText(text: string, options?: Omit<z.infer<typeof sendMessageOptionsSchema>, "messageID">): Promise<string> {
        return await this.client.sendMessage(this.sender, text, {
            ...options,
            messageID: this.id,
        });
    }
    async replyImage(
        image: string,
        options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">
    ): Promise<string> {
        return await this.client.sendImage(this.sender, image, {
            ...options,
            messageID: this.id,
        });
    }
    async replyVideo(
        video: string,
        options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">
    ): Promise<string> {
        return await this.client.sendVideo(this.sender, video, {
            ...options,
            messageID: this.id,
        });
    }
    async replyAudio(audio: string): Promise<string> {
        return await this.client.sendAudio(this.sender, audio, {
            messageID: this.id,
        });
    }
    async replyDocument(
        document: string,
        options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">
    ): Promise<string> {
        return await this.client.sendDocument(this.sender, document, {
            ...options,
            messageID: this.id,
        });
    }
    async replyLocation(
        location: { latitude: number | string; longitude: number | string },
        options?: { name?: string; address?: string }
    ): Promise<string> {
        return await this.client.sendLocation(this.sender, location, {
            ...options,
            messageID: this.id,
        });
    }
    async replySticker(sticker: string): Promise<string> {
        return await this.client.sendSticker(this.sender, sticker, {
            messageID: this.id,
        });
    }
    async react(emoji: string): Promise<string> {
        return await this.client.sendReaction(this.sender, emoji, this.id);
    }
    async unreact(): Promise<string> {
        return await this.client.removeReaction(this.sender, this.id);
    }
    async replyTemplate(template: z.infer<typeof SendTemplateSchema>) {
        return await this.client.sendTemplate(this.sender, template, { messageID: this.id });
    }
    async replyContact(
        name: z.infer<typeof nameSchema>,
        phone: z.infer<typeof phoneSchema>,
        options?: Omit<z.infer<typeof SendContacOptionSchema>, "messageID">
    ): Promise<string> {
        return await this.client.sendContact(this.sender, name, phone, {
            ...options,
            messageID: this.id,
        });
    }
}
