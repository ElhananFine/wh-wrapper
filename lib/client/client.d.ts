/// <reference types="node" />
import { EventEmitter } from "events";
import { ResponseType } from "axios";
import * as z from "zod";
import Message from "../handlers/message-handler";
import { CreateTempleteSchema, SendContacOptionSchema, SendTemplateSchema, UpdateBusinessProfileSchema, nameSchema, phoneSchema, sendMediaInteractiveSchema, sendMessageOptionsSchema } from "../schemas/schema";
import Callback from "../handlers/callback-handler";
import Update from "../handlers/update-handler";
import RequestWelcome from "../handlers/request-welcome-handler";
import { CreateTempleteResponse, isSuccessResponse } from "../types/internal-types";
import { ClientOptions } from "../types/shared";
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
    _setCallBackUrl(callbackUrl: string, appID: string, appSecret: string): Promise<{
        success: boolean;
    }>;
    _initialize(): Promise<void>;
    makeRequest<T>(config: {
        method: string;
        url: string;
        data?: object;
        headers?: object;
        params?: object;
        responseType?: ResponseType;
    }): Promise<T>;
    createTemplate(template: z.infer<typeof CreateTempleteSchema>): Promise<CreateTempleteResponse & {
        templateName: string;
    }>;
    sendTemplate(to: string, template: z.infer<typeof SendTemplateSchema>, options?: {
        messageID: string;
    }): Promise<string>;
    private _sendMessage;
    private sendInteractiveMessage;
    private sendMedia;
    sendMessage(to: string, text: string, options?: z.infer<typeof sendMessageOptionsSchema>): Promise<string>;
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
    sendSticker(to: string, sticker: string, options?: {
        messageID: string;
    }): Promise<string>;
    sendVideo(to: string, video: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">): Promise<string>;
    sendDocument(to: string, document: string, options?: z.infer<typeof sendMediaInteractiveSchema>): Promise<string>;
    sendAudio(to: string, audio: string, options?: {
        messageID: string;
    }): Promise<string>;
    sendImage(to: string, image: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">): Promise<string>;
    sendContact(to: string, name: z.infer<typeof nameSchema>, phone: z.infer<typeof phoneSchema>, options?: z.infer<typeof SendContacOptionSchema>): Promise<string>;
    sendRowRequest<T>(obj: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        endpoint: string;
        data?: object;
        headers?: object;
    }): Promise<T>;
    markMessageAsRead(messageID: string): Promise<boolean>;
    deleteMedia(mediaID: string | number): Promise<boolean>;
    uploadMedia(media: string): Promise<string>;
    getProfile(): Promise<{
        verifiedName: string;
        phoneNumber: string;
        phoneNumberID: string;
        qualityRating: string;
        about: string;
        description: string;
        address: string;
        email: string;
        profilePictureUrl: string;
        websites: string[];
        vertical: import("../types/shared").WhatsAppProfileVertical;
    }>;
    registerPhoneNumber(pin: string, dataLocalizationRegion?: "AU" | "ID" | "IN" | "JP" | "SG" | "KR" | "DE" | "CH" | "GB" | "BR" | "BH" | "ZA" | "CA"): Promise<{
        success: boolean;
    }>;
    setBusinessPublicKey(publicKey: string): Promise<boolean>;
    updateBusinessProfile(info: z.infer<typeof UpdateBusinessProfileSchema>): Promise<isSuccessResponse>;
}
export {};
