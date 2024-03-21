/// <reference types="node" />
import { EventEmitter } from "events";
import { ResponseType } from "axios";
import * as z from "zod";
import Message from "../handlers/message-handler";
import { getDisplayNameStatus, WhatsAppProfileData, CreateTempleteResponse } from "../interfaces/client-interface";
import { GetAllSubscriptions, getPhoneNumbers } from "../interfaces/whatsapp-response-interface";
import { CreateTempleteSchema, SendContacOptionSchema, SendTemplateSchema, UpdateBusinessProfileSchema, nameSchema, phoneSchema, sendMediaInteractiveSchema, sendMessageOptionsSchema } from "../schemas/schema";
import Callback from "../handlers/callback-handler";
import Update from "../handlers/update-handler";
import RequestWelcome from "../handlers/request-welcome-handler";
import { isSuccessResponse, SendMessageResponse } from "../types/internal-types";
import { ClientOptions, GetPhoneDataReturn } from "../types/shared";
type MessageHandlers = {
    messages: (message: Message) => void;
    statuses: (statuses: Update) => void;
    callbacks: (callbacks: Callback) => void;
    ChatOpened: (chat: RequestWelcome) => void;
};
export default class Client extends EventEmitter {
    private readonly phoneID;
    private readonly token;
    private readonly verifyToken?;
    private options;
    private _untypedOn;
    on: <K extends keyof MessageHandlers>(event: K, listener: MessageHandlers[K]) => this;
    url: string;
    axiosInstance: import("axios").AxiosInstance;
    commonKeys: {
        messaging_product: string;
        recipient_type: string;
    };
    constructor(phoneID: string | number, token: string, verifyToken?: string | undefined, options?: Partial<ClientOptions>);
    private initialize;
    private formatZodError;
    createFlow(): Promise<void>;
    deleteFlow(): Promise<void>;
    sendCatalog(): Promise<void>;
    createTemplate(template: z.infer<typeof CreateTempleteSchema>): Promise<CreateTempleteResponse & {
        templateName: string;
    }>;
    sendMessage(to: string, text: string, options?: z.infer<typeof sendMessageOptionsSchema>): Promise<string>;
    private sendInteractiveMessage;
    sendTemplate(to: string, template: z.infer<typeof SendTemplateSchema>, options?: {
        messageID: string;
    }): Promise<SendMessageResponse | isSuccessResponse>;
    makeRequest<T>(config: {
        method: string;
        url: string;
        data?: object;
        headers?: object;
        params?: object;
        responseType?: ResponseType;
    }): Promise<T>;
    private _sendMessage;
    getPhoneNumbers(): Promise<getPhoneNumbers>;
    getPhoneData(): Promise<GetPhoneDataReturn>;
    getDisplayNameStatus(): Promise<getDisplayNameStatus>;
    getAllSubscriptions(): Promise<GetAllSubscriptions[]>;
    deleteMedia(mediaID: string | number): Promise<boolean>;
    markMessageAsRead(messageID: string): Promise<boolean>;
    sendReaction(to: string, emoji: string, messageID: string): Promise<string>;
    removeReaction(to: string, messageID: string): Promise<string>;
    sendLocation(to: string, location: {
        latitude: number | string;
        longitude: number | string;
    }, options?: {
        name?: string;
        address?: string;
        messageID?: string;
    }): Promise<string>;
    getBusinessProfile(): Promise<Omit<WhatsAppProfileData, "messaging_product">>;
    registerPhoneNumber(pin: string, dataLocalizationRegion?: "AU" | "ID" | "IN" | "JP" | "SG" | "KR" | "DE" | "CH" | "GB" | "BR" | "BH" | "ZA" | "CA"): Promise<{
        success: boolean;
    }>;
    setBusinessPublicKey(publicKey: string): Promise<boolean>;
    uploadMedia(media: string): Promise<string>;
    sendSticker(to: string, sticker: string, options?: {
        messageID: string;
    }): Promise<string>;
    sendVideo(to: string, video: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">): Promise<string>;
    sendDocument(to: string, document: string, options?: z.infer<typeof sendMediaInteractiveSchema>): Promise<string>;
    sendAudio(to: string, audio: string, options?: {
        messageID: string;
    }): Promise<string>;
    private sendMedia;
    sendImage(to: string, image: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">): Promise<string>;
    sendContact(to: string, name: z.infer<typeof nameSchema>, phone: z.infer<typeof phoneSchema>, options?: z.infer<typeof SendContacOptionSchema>): Promise<string>;
    sendRowRequest<T>(obj: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        endpoint: string;
        data?: object;
        headers?: object;
    }): Promise<T>;
    private _setCallBackUrl;
    updateBusinessProfile(info: z.infer<typeof UpdateBusinessProfileSchema>): Promise<isSuccessResponse>;
}
export {};
