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

    /**
     * Sends a reply message to the sender of the incoming message.
     *
     * @async
     * @method replyText
     * @param {string} text - The text to send (markdown allowed, max 4096 characters).
     * @param {object} [options] - Additional options for the message.
     * @param {boolean} [options.previewUrl=false] - Whether to show a preview of the URL in the message (if any).
     * @param {string} [options.header] - The header of the message (if keyboard is provided, up to 60 characters, no markdown allowed).
     * @param {string} [options.footer] - The footer of the message (if keyboard is provided, up to 60 characters, markdown has no effect).
     * @param {object|Array|null} [options.buttons] - The buttons to send with the message. Can be one of the following:
     * - An object with `title` and `callbackData` properties (single button).
     * - An array of objects with `title` and `callbackData` properties (up to 3 buttons).
     * - An object with `title` and `url` properties (single URL button).
     * - An object with `buttonTitle` and `sections` properties (section list).
     * @returns {Promise<string>} A Promise that resolves with the message ID.
     *
     * @example
     * const messageId = await replyText("Hello, World!");
     * // messageId: wamid.XXX=
     *
     * @example
     * const buttons = [
     *   { title: "Help", callbackData: "help" },
     *   { title: "About", callbackData: "about" }
     * ];
     * const messageId = await replyText("What can I help you with?", {
     *   footer: "Powered by wh-wrapper",
     *   buttons
     * });
     * // messageId: wamid.XXX=
     */
    async replyText(text: string, options?: Omit<z.infer<typeof sendMessageOptionsSchema>, "messageID">): Promise<string> {
        return await this.client.sendMessage(this.sender, text, {
            ...options,
            messageID: this.id,
        });
    }

    /**
     * Sends an image as a reply to the sender of the incoming message.
     *
     * @async
     * @method replyImage
     * @param {string} image - The image to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options for the image message.
     * @param {string} [options.caption] - The caption of the image (markdown allowed). Required when buttons are provided.
     * @param {string} [options.footer] - The footer of the message (max 60 characters, markdown has no effect). Only applicable when buttons are provided.
     * @param {object|Array|null} [options.buttons] - The buttons to send with the image. See the `replyText` documentation for more details on button options.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent image message.
     *
     * @example
     * const imageUrl = 'https://example.com/image.png';
     * const messageId = await replyImage(imageUrl, {
     *   caption: 'This is an image!',
     *   footer: 'Powered by wh-wrapper',
     *   buttons: [
     *     { title: 'View', callbackData: 'view_image' },
     *     { title: 'Share', callbackData: 'share_image' },
     *   ],
     * }); // messageId: wamid.XXX=
     */
    async replyImage(
        image: string,
        options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">
    ): Promise<string> {
        return await this.client.sendImage(this.sender, image, {
            ...options,
            messageID: this.id,
        });
    }

    /**
     * Sends a video as a reply to the sender of the incoming message.
     *
     * @async
     * @method replyVideo
     * @param {string} video - The video to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options for the video message.
     * @param {string} [options.caption] - The caption of the video (markdown allowed). Required when buttons are provided.
     * @param {string} [options.footer] - The footer of the message (max 60 characters, markdown has no effect). Only applicable when buttons are provided.
     * @param {object|Array|null} [options.buttons] - The buttons to send with the video. See the `replyText` documentation for more details on button options.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent video message.
     *
     * @example
     * const videoUrl = 'https://example.com/video.mp4';
     * const messageId = await replyVideo(videoUrl, {
     *   caption: 'This is a video',
     *   footer: 'Powered by wh-wrapper',
     *   buttons: {
     *     title: 'Watch More',
     *     url: 'https://example.com/videos',
     *   },
     * }); // messageId: wamid.XXX=
     */
    async replyVideo(
        video: string,
        options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">
    ): Promise<string> {
        return await this.client.sendVideo(this.sender, video, {
            ...options,
            messageID: this.id,
        });
    }

    /**
     * Sends an audio file as a reply to the sender of the incoming message.
     *
     * @async
     * @method replyAudio
     * @param {string} audio - The audio file to send (can be a media ID, URL, or file path).
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent audio message.
     *
     * @example
     * const audioUrl = 'https://example.com/audio.mp3';
     * const messageId = await replyAudio(audioUrl); // messageId: wamid.XXX=
     */
    async replyAudio(audio: string): Promise<string> {
        return await this.client.sendAudio(this.sender, audio, {
            messageID: this.id,
        });
    }

    /**
     * Sends a document as a reply to the sender of the incoming message.
     *
     * @async
     * @method replyDocument
     * @param {string} document - The document to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options for the document message.
     * @param {string} [options.caption] - The caption of the document (markdown allowed). Required when buttons are provided.
     * @param {string} [options.footer] - The footer of the message (max 60 characters, markdown has no effect). Only applicable when buttons are provided.
     * @param {object|Array|null} [options.buttons] - The buttons to send with the document. See the `replyText` documentation for more details on button options.
     * @param {string} [options.filename] - The filename of the document. The extension of the filename will specify the format in which the document is displayed in WhatsApp.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent document message.
     *
     * @example
     * const documentUrl = 'https://example.com/example.pdf';
     * const messageId = await replyDocument(documentUrl, {
     *   filename: 'fileexample.pdf',
     *   caption: 'Example PDF',
     *   footer: 'Powered by wh-wrapper',
     *   buttons: [
     *     { title: 'View', callbackData: 'view_document' },
     *     { title: 'Share', callbackData: 'share_document' },
     *   ],
     * }); // messageId: wamid.XXX=
     */
    async replyDocument(
        document: string,
        options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "messageID">
    ): Promise<string> {
        return await this.client.sendDocument(this.sender, document, {
            ...options,
            messageID: this.id,
        });
    }

    /**
     * Sends a location as a reply to the sender of the incoming message.
     *
     * @async
     * @method replyLocation
     * @param {object} location - The location object.
     * @param {number|string} location.latitude - The latitude of the location.
     * @param {number|string} location.longitude - The longitude of the location.
     * @param {object} [options] - Additional options.
     * @param {string} [options.name] - The name of the location.
     * @param {string} [options.address] - The address of the location.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent location message.
     *
     * @example
     * const location = {
     *   latitude: 37.4847483695049,
     *   longitude: -122.1473373086664,
     * };
     * const messageId = await replyLocation(location, {
     *   name: 'WhatsApp HQ',
     *   address: 'Menlo Park, 1601 Willow Rd, United States',
     * }); // messageId
     *
     * @throws {Error} Will throw an error if the `latitude` or `longitude` is missing from the `location` object.
     */
    async replyLocation(
        location: { latitude: number | string; longitude: number | string },
        options?: { name?: string; address?: string }
    ): Promise<string> {
        return await this.client.sendLocation(this.sender, location, {
            ...options,
            messageID: this.id,
        });
    }

    /**
     * Sends a sticker as a reply to the sender of the incoming message.
     *
     * @async
     * @method replySticker
     * @param {string} sticker - The sticker to send (can be a media ID, URL, or file path).
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent sticker message.
     *
     * @example
     * const stickerUrl = 'https://example.com/sticker.webp';
     * const messageId = await replySticker(stickerUrl); // messageId: wamid.XXX=
     */
    async replySticker(sticker: string): Promise<string> {
        return await this.client.sendSticker(this.sender, sticker, {
            messageID: this.id,
        });
    }

    /**
     * Reacts to the incoming message with an emoji.
     *
     * @async
     * @method react
     * @param {string} emoji - The emoji to react with.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the reaction message.
     * Note: that this reaction message ID cannot be used to remove the reaction or perform any other action on it, Instead, use the original message ID.
     *
     * @example
     * const reactionMessageId = await react("👍"); // wamid.XXX=
     */
    async react(emoji: string): Promise<string> {
        return await this.client.sendReaction(this.sender, emoji, this.id);
    }

    /**
     * Removes a reaction from the incoming message.
     *
     * @async
     * @method unreact
     * @returns {Promise<string>} A Promise that resolves with the message ID of the reaction removal message.
     * Note that this reaction removal message ID cannot be used to re-react or perform any other action on it, instead, use the original message ID.
     *
     * @example
     * const reactionRemovalMessageId = await unreact(); // wamid.XXX=
     */
    async unreact(): Promise<string> {
        return await this.client.removeReaction(this.sender, this.id);
    }

    /**
     * Sends a WhatsApp message template as a reply to the sender of the incoming message.
     *
     * @async
     * @method replyTemplate
     * @param {Object} template - The template object containing the template details.
     * @param {string} template.name - The name of the template (max 512 characters).
     * @param {string} template.language - The language code of the template (e.g., "ENGLISH", "HEBREW").
     * @param {string|Array<string>} template.body - The body text of the template. Can be a string or an array of strings.
     * @param {string} [template.header] - The header text of the template.
     * @param {Array<Object>} [template.buttons] - An array of button objects to include in the template.
     * @param {string} template.buttons.type - The type of button (e.g., "QuickReplyButton", "UrlButton", "PhoneNumberButton").
     * @param {string} template.buttons.text - The text to display on the button (for QuickReplyButton).
     * @param {string} [template.buttons.title] - The title to display on the button (for UrlButton and PhoneNumberButton).
     * @param {string} [template.buttons.url] - The URL to open when the button is clicked (for UrlButton).
     * @param {string} [template.buttons.phoneNumber] - The phone number to call when the button is clicked (for PhoneNumberButton).
     * @param {Object} [options] - Additional options for sending the template.
     * @returns {Promise<string>} A Promise that resolves with the ID of the sent message.
     * @throws {ParametersError} If the provided parameters are invalid.
     *
     * @example
     * const templateParams = {
     *   name: 'template_name',
     *   language: 'HEBREW',
     *   body: ['150'],
     *   buttons: [
     *     { type: 'QuickReplyButton', text: 'buy now' },
     *     { type: 'QuickReplyButton', text: 'buy later' }
     *   ]
     * };
     *
     * const messageId = await replyTemplate(templateParams);
     * // messageId: wamid.XXX=
     */
    async replyTemplate(template: z.infer<typeof SendTemplateSchema>) {
        return await this.client.sendTemplate(this.sender, template, { messageID: this.id });
    }

    /**
     * Sends a contact as a reply to the sender of the incoming message.
     *
     * @async
     * @method replyContact
     * @param {string|object} name - The name of the contact. If a string, it's considered the full name. If an object, it can include fields like `firstName`, `lastName`, etc.
     * @param {string|object|Array<object>} phone - The phone number(s) of the contact. If a string, it's considered a regular phone number. If an object, it can include additional fields like `type` (phone type) and `waID` (WhatsApp ID).
     * @param {object} [options] - Additional options for the contact.
     * @param {object|Array<object>} [options.addresses] - The addresses of the contact.
     * @param {object|Array<object>} [options.emails] - The email addresses of the contact.
     * @param {object|Array<object>} [options.urls] - The website URLs of the contact.
     * @param {object} [options.org] - The organization details of the contact.
     * @param {string} [options.birthday] - The birthday of the contact in "YYYY-MM-DD" format.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent contact.
     *
     * @example
     * const contactId = await replyContact("John Doe", "972XXXXXXXXX"); // messageId: wamid.XXX=
     *
     * @example
     * const name = { firstName: "John", lastName: "Doe" };
     * const phone = { phone: "+1234567890", type: "MOBILE" };
     * const org = { company: "Acme Inc.", title: "Manager" };
     * const email = { email: "john.doe@example.com", type: "WORK" };
     * const contactId = await replyContact(name, phone, {
     *   org,
     *   emails: [email],
     *   birthday: "1990-05-15",
     * }); // messageId: wamid.XXX=
     */
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
