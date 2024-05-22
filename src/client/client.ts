import { EventEmitter } from "events";
import express, { Request, Response } from "express";
import axios, { AxiosResponse, ResponseType, isAxiosError } from "axios";
import fs from "fs";
import FormData from "form-data";
import * as z from "zod";
import Message from "../handlers/message-handler";
import {
    CreateTempleteSchema,
    Language,
    SendContacOptionSchema,
    SendContacSchema,
    SendTemplateSchema,
    UpdateBusinessProfileSchema,
    nameSchema,
    phoneSchema,
    sendMediaInteractiveSchema,
    sendMessageOptionsSchema,
    sendMessageSchema,
} from "../schemas/schema";
import Callback from "../handlers/callback-handler";
import Update from "../handlers/update-handler";
import RequestWelcome from "../handlers/request-welcome-handler";
import {
    AuthError,
    BillingError,
    IntegrityError,
    MessageError,
    ParameterError,
    ParametersError,
    RegistrationError,
    TemplateError,
    ThrottlingError,
    UnknownError,
} from "../errors/error-classes";
import {
    ClassMessageType,
    CreateTempleteResponse,
    GetPhoneNumberByID,
    isSuccessResponse,
    SendMessageResponse,
    WhatsAppProfileData,
} from "../types/internal-types";
import { ClientOptions } from "../types/shared";
import FlowCompletion from "../handlers/flow-handler";

type MessageHandlers = {
    messages: (message: Message) => void;
    statuses: (statuses: Update) => void;
    callbacks: (callbacks: Callback) => void;
    chatOpened: (chat: RequestWelcome) => void;
    flowCompletion: (flow: FlowCompletion) => void;
};

/**
 * @class Client
 * @extends EventEmitter
 * @classdesc The main class for interacting with the WhatsApp Cloud API.
 */
export default class Client extends EventEmitter {
    private _untypedOn = this.on;
    public on = <K extends keyof MessageHandlers>(event: K, listener: MessageHandlers[K]): this =>
        this._untypedOn(event, listener);

    url;
    axiosInstance;
    commonKeys = { messaging_product: "whatsapp", recipient_type: "individual" };
    /**
     * @constructor
     * @param {string|number} phoneID - The Phone number ID.
     * @param {string} token - The token of the WhatsApp business account.
     * @param {string} [verifyToken] - The verify token of the registered callbackUrl (required when using a webhook).
     * @param {Partial<ClientOptions>} [options] - Additional configuration options.
     * @param {string} [options.baseURL] - The base URL of the WhatsApp API.
     * @param {string|number} [options.apiVersion] - The API version of the WhatsApp Cloud API.
     * @param {string} [options.webHookEndpoint] - The endpoint to listen for incoming messages.
     * @param {string} [options.callbackUrl] - The callback URL to register.
     * @param {number|string} [options.appID] - The ID of the app in the App Basic Settings.
     * @param {string} [options.appSecret] - The secret of the app in the App Basic Settings.
     * @param {string} [options.businessAccountID] - The WhatsApp business account ID that owns the phone ID.
     * @param {Express} [options.server] - The Express app instance to use for the webhook.
     * @param {number} [options.port] - The port to listen on for the webhook server.
     */
    constructor(
        private readonly phoneID: string | number,
        private readonly token: string,
        private readonly verifyToken?: string,
        private options: Partial<ClientOptions> = {}
    ) {
        super();
        console.clear();

        if (!this.phoneID || !this.token) throw new Error("Missing Parameters, phoneID and token are required");

        this.url = `${this.options?.baseURL || "https://graph.facebook.com"}/v${
            this.options?.apiVersion?.toString() || "19.0"
        }`;

        this.axiosInstance = axios.create({
            baseURL: this.url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (this.options?.callbackUrl) {
            if (!this.options.appID || !this.options.appSecret)
                throw new Error("Missing Parameters, appId and appSecret are required");

            this._setCallBackUrl(this.options.callbackUrl, this.options.appID.toString(), this.options.appSecret);
        }

        if (this.verifyToken) this._initialize();
    }

    async _setCallBackUrl(callbackUrl: string, appID: string, appSecret: string): Promise<{ success: boolean }> {
        const getAppAcsessToken = await this.makeRequest<{
            access_token: string;
            token_type: "bearer";
        }>({
            method: "GET",
            url: `/oauth/access_token`,
            params: {
                grant_type: "client_credentials",
                client_id: appID,
                client_secret: appSecret,
            },
        });

        const response = await this.makeRequest<{ success: boolean }>({
            method: "POST",
            url: `/${appID}/subscriptions`,
            params: {
                object: "whatsapp_business_account",
                callback_url: callbackUrl + this.options.webHookEndpoint || "",
                verify_token: this.verifyToken,
                access_token: getAppAcsessToken.access_token,
                fields: ["message_template_status_update", "messages"].join(","),
            },
        });

        if (response.success) console.info("CallBack URL successfully registered!");

        return response;
    }

    async _initialize(): Promise<void> {
        if (
            !this.options.server ||
            !this.options.server.hasOwnProperty("listen") ||
            typeof this.options.server.listen !== "function"
        ) {
            console.warn("A proper Express instance was not provided, an Express server operator...");
            const port = this.options.port || 3000;
            this.options.server = express();
            this.options.server.listen(port);
            this.options.server.use(express.json());
            console.warn(`Express server listening on http://localhost:${port}, port: ${port}`);
        }

        if (!this.verifyToken) throw new Error("A proper verify token must be provided.");

        this.options.server.get(this?.options?.webHookEndpoint || "/", (req: Request, res: Response) => {
            return req.query["hub.verify_token"] === this.verifyToken
                ? res.status(200).send(req.query["hub.challenge"])
                : res.status(403).send("Error, invalid verification token");
        });
        this.options.server.post(this.options?.webHookEndpoint || "/", (req: Request, res: Response) => {
            try {
                const field = req.body.entry[0].changes[0].field;
                const value = req.body.entry[0].changes[0].value;

                if (value.metadata.phone_number_id !== this.phoneID) return res.status(200).send();

                if (field === "messages") {
                    if ("messages" in value) {
                        if (value.messages[0].type === "interactive") {
                            if (value.messagesmessages[0].interactive.type === "nfm_reply")
                                this.emit("flowCompletion", new FlowCompletion(this, value));
                            else this.emit("callbacks", new Callback(this, value));
                        } else if (
                            [
                                "text",
                                "image",
                                "sticker",
                                "video",
                                "document",
                                "audio",
                                "location",
                                "contacts",
                                "unsupported",
                            ].includes(value.messages[0].type)
                        ) {
                            this.emit("messages", new Message(this, value));
                        } else if (value.messages![0].type === "request_welcome") {
                            this.emit("chatOpened", new RequestWelcome(this, value));
                        } else return;
                    } else if ("statuses" in value) {
                        this.emit("statuses", new Update(this, value));
                    }
                }
                return res.status(200).send();
            } catch (e) {
                res.status(500).send();
            }
        });
    }
    async makeRequest<T>(config: {
        method: string;
        url: string;
        data?: object;
        headers?: object;
        params?: object;
        responseType?: ResponseType;
    }): Promise<T> {
        try {
            const response: AxiosResponse = await this.axiosInstance({
                ...config,
            });
            return response.data;
        } catch (e: any) {
            if (isAxiosError(e)) {
                const response = e.response!;
                const code = response.data.error.code;
                const message = response.data.error.message;
                const fbtrace_id = response.data.error?.fbtrace_id;
                const type = response.data.error.type;
                const details = response.data.error.error_data?.details;

                switch (true) {
                    case [0, 3, 10, 190, 200].includes(code):
                        throw new AuthError(code, message, fbtrace_id, type, details);
                    case [4, 80007, 130429, 131048, 131056, 133016].includes(code):
                        throw new ThrottlingError(code, message, fbtrace_id, type, details);
                    case [368, 131031].includes(code):
                        throw new IntegrityError(code, message, fbtrace_id, type, details);
                    case [100, 131008, 131009].includes(code):
                        throw new ParameterError(code, message, fbtrace_id, type, details);
                    case [131021, 131026, 131047, 131051, 131052, 131053].includes(code):
                        throw new MessageError(code, message, fbtrace_id, type, details);
                    case [132000, 132001, 132005, 132007, 132012, 132015, 132016, 132068, 132069].includes(code):
                        throw new TemplateError(code, message, fbtrace_id, type, details);
                    case [133000, 133004, 133005, 133006, 133008, 133009, 133010, 133015].includes(code):
                        throw new RegistrationError(code, message, fbtrace_id, type, details);
                    case [131042].includes(code):
                        throw new BillingError(code, message, fbtrace_id, type, details);
                    default:
                        throw new UnknownError(code, message, fbtrace_id, type, details);
                }
            } else {
                throw new Error("unknown error");
            }
        }
    }

    // async createFlow() {}
    // async deleteFlow() {}
    // public async sendCatalog() {}
    // public async sendProduct() {}

    // templates
    /**
     * Creates a new WhatsApp message template.
     *
     * Templates can be used to send structured messages with placeholders, buttons, and other interactive elements.
     * Before creating and sending templates, it's recommended to go through the Library's "Managing Message Templates" guide
     * for a better understanding of templates and their usage.
     *
     * @async
     * @method createTemplate
     * @param {Object} template - The template object containing the template details.
     * @param {string} template.name - Name of the template (up to 512 characters, must be unique).
     * @param {string} template.category - Category of the template. Valid values are "AUTHENTICATION", "MARKETING", or "UTILITY".
     * @param {string} template.language - The language of the template (See Template language and locale code).
     * @param {boolean} [template.allowCategoryChange=true] - Whether to allow category change for the template.
     * @param {Object} [template.header] - Header of the template.
     * @param {string} [template.header.type="TEXT"] - Type of the header. Valid values are "TEXT", "IMAGE", "DOCUMENT", "VIDEO", or "LOCATION".
     * @param {string} [template.header.text] - Text content for the header (up to 60 characters, supports 1 variable).
     * @param {string} [template.header.media] - Media URL or ID for image, document, or video header.
     * @param {string|Object} template.body - Body of the template.
     * @param {string} [template.body] - Text content for the body (up to 1024 characters, supports multiple variables).
     * @param {Object} [template.body] - Configuration for an authentication template body.
     * @param {number} [template.body.codeExpirationMinutes] - Number of minutes the code or password is valid (between 1 and 90).
     * @param {boolean} [template.body.addSecurityRecommendation=false] - Whether to include the security recommendation for sharing the code.
     * @param {string} [template.footer] - Footer text for the template (up to 60 characters).
     * @param {Array|Object} [template.buttons] - Buttons to include with the template (max 10).
     * @returns {Promise<Object>} A Promise that resolves with an object containing the template ID, status, category, and (if successful) the template name.
     * @throws {Error} If the WhatsApp Business account ID is not provided.
     * @throws {ParametersError} If the provided parameters are invalid.
     *
     *  @example
     * const response = await createTemplate({
     *   name: 'new productlaunch',
     *   category: 'MARKETING',
     *   language: 'ENGLISH_US',
     *   header: {
     *     type: 'TEXT',
     *     media: 'the header text'
     *   },
     *   body: 'Introducing the all-new {{item}}! Get {{10%}} off when you pre-order now using the code {{#6567}}.',
     *   footer: 'Limited time offer',
     *   buttons: [
     *     {
     *       type: 'UrlButton',
     *       title: 'Pre-Order Now',
     *       url: 'https://example.com/pre-order/{{item}}'
     *     },
     *     {
     *       type: 'QuickReplyButton',
     *       text: 'More Details'
     *     },
     *     {
     *       type: 'OTPButton',
     *       OTPType: 'ONE_TAP',
     *       packageName: 'com.example.app',
     *       signatureHash: '1234567890ABCDEF1234567890ABCDEF12345678'
     *     }
     *   ]
     * });
     *
     * console.log(response.templateName); // Output: ....
     */
    public async createTemplate(
        template: z.infer<typeof CreateTempleteSchema>
    ): Promise<CreateTempleteResponse & { templateName: string }> {
        interface componentsType {
            type?: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
            format?: string;
            text?: string;
            add_security_recommendation?: boolean;
            code_expiration_minutes?: number;
            buttons?: {
                type: "PHONE_NUMBER" | "URL" | "QUICK_REPLY" | "COPY_CODE";
                text?: string;
                example?: string | string[];
                phone_number?: string;
                url?: string;
            }[];
            example?: {
                [key: string]: string[] | string[][];
            };
        }

        if (!this.options.businessAccountID) throw new Error("You must provide a business account Id before used");
        const validation = CreateTempleteSchema.safeParse(template);

        if (!validation.success) {
            throw new ParametersError("Error in the parameters you provided", validation.error);
        }
        const data: Partial<{
            name: string;
            category: string;
            allow_category_change?: boolean;
            language: string;
            components: componentsType[];
        }> = {
            name: template.name.replace(/ /g, "_"),
            language: Language[template.language],
            category: template.category,
            allow_category_change: true,
            components: [],
        };

        // header
        if (template.header) {
            const header: Partial<componentsType> = { type: "HEADER" };

            header.format = template.header.type;

            if (
                template.header.type === "IMAGE" ||
                template.header.type === "VIDEO" ||
                template.header.type === "DOCUMENT"
            ) {
                header.example = { header_handle: [template.header.media] };
            } else if (template.header.type === "TEXT" && template.header.text) {
                const variables = template.header.text.match(/\{\{(.*?)\}\}/g);

                if (variables && variables?.length > 0) {
                    template.header.text = template.header.text.split(variables[0].trim()).join("{{1}}");
                }

                header.text = template.header.text;
                if (variables)
                    header.example = {
                        header_text: variables?.map((v) => v.slice(2, -2)),
                    };
            }
            data.components?.push(header);
        }

        // body
        const body: Partial<componentsType> = { type: "BODY" };

        if (typeof template.body === "string") {
            const variables = template.body.match(/\{\{(.*?)\}\}/g);

            if (variables && variables.length > 0) {
                variables.map((v, i) => (template.body = (template.body as string).split(v.trim()).join(`{{${i + 1}}}`)));
            }

            body.text = template.body;
            if (variables)
                body.example = {
                    body_text: [variables?.map((v) => v.slice(2, -2)) || []],
                };
        } else {
            body.add_security_recommendation = template.body.addSecurityRecommendation;
            // body.code_expiration_minutes = template.body.codeExpirationMinutes; to footer
        }

        data.components?.push(body);

        // footer
        if (template.footer)
            data.components?.push({
                type: "FOOTER",
                text: template.footer,
            });

        // buttons
        if (template.buttons) {
            const buttonsData: any = { type: "BUTTONS", buttons: [] };
            if (!Array.isArray(template.buttons)) template.buttons = [template.buttons];

            if (template.buttons.filter((b) => b?.type === "UrlButton").length > 2)
                throw new Error("Max 2 URL buttons allowed");

            if (template.buttons.filter((b) => b?.type === "PhoneNumberButton").length > 1)
                throw new Error("Max 1 phone number button allowed");

            template.buttons.map((button) => {
                switch (button?.type) {
                    case "UrlButton":
                        const variables = button.url.match(/\{\{(.*?)\}\}/g);
                        variables && variables.map((v, i) => (button.url = button.url.split(v.trim()).join(`{{${i + 1}}}`)));
                        buttonsData.buttons.push({
                            type: "URL",
                            text: button.title,
                            url: button.url,
                            ...(variables && variables.length > 0
                                ? {
                                      example: variables?.map((v) => `${v.slice(2, -2)}`),
                                  }
                                : { example: [button.url] }),
                        });
                        break;
                    case "PhoneNumberButton":
                        buttonsData.buttons.push({
                            type: "PHONE_NUMBER",
                            text: button.title,
                            phone_number: button.phoneNumber,
                        });
                        break;
                    case "QuickReplyButton":
                        buttonsData.buttons.push({
                            type: "QUICK_REPLY",
                            text: button.text,
                        });
                        break;
                    case "OTPButton":
                        const otp: any = {
                            type: "OTP",
                            otp_type: button.OTPType,
                        };
                        if (button.packageName) otp.package_name = button.packageName;
                        if (button.signatureHash) otp.signature_hash = button.signatureHash;
                        buttonsData.buttons.push(otp);
                        break;
                    case "CopyCodeButton":
                        buttonsData.buttons.push({
                            type: "QUICK_REPLY",
                            example: button.example,
                        });
                        break;
                    default:
                        break;
                }
            });

            buttonsData.buttons!.sort((a: { type: string }, b: any) => {
                const typeOrder: { [key: string]: number } = {
                    QUICK_REPLY: 1,
                    URL: 2,
                    PHONE_NUMBER: 3,
                    COPY_CODE: 4,
                };
                return typeOrder[a.type] - typeOrder[b.type];
            });

            data.components?.push(buttonsData as componentsType);
        }
        console.log(JSON.stringify(data));
        const response = await this.makeRequest<{
            id: string;
            status: string;
            category: string;
        }>({
            method: "POST",
            url: `/${this.options.businessAccountID}/message_templates`,
            data,
        });

        return {
            ...response,
            templateName: template.name.replace(/ /g, "_"),
        } as CreateTempleteResponse & { templateName: string };
    }

    /**
     * Sends a WhatsApp message template to a specified recipient.
     *
     * @async
     * @method sendTemplate
     * @param {string} to - The phone number of the recipient.
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
     * @param {string} [options.messageID] - The ID of a previous message to associate this template with (for context).
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
     * const messageId = await sendTemplate('+1234567890', templateParams);
     * // messageId: wamid.XXX=
     */
    public async sendTemplate(
        to: string,
        template: z.infer<typeof SendTemplateSchema>,
        options?: { messageID: string }
    ): Promise<string> {
        const validation = SendTemplateSchema.safeParse(template);

        if (!validation.success) {
            throw new ParametersError("Error in the parameters you provided", validation.error);
        }
        if (!Array.isArray(template.body)) template.body = [template.body];
        if (!Array.isArray(template?.buttons)) template.buttons = [template.buttons];

        const templateObjsct = {
            to,
            type: "template",
            ...(options?.messageID && {
                context: { message_id: options?.messageID },
            }),
            template: {
                name: template.name,
                language: {
                    code: Language[template.language],
                },
                components: [
                    ...(template.header
                        ? [
                              {
                                  type: "header",
                                  parameters: [
                                      {
                                          ...(typeof template.header === "string"
                                              ? {
                                                    type: "text",
                                                    value: template.header,
                                                }
                                              : {
                                                    parameters: [
                                                        {
                                                            type: template.header.type.toLowerCase(),
                                                            [template.header.type.toLowerCase()]: {
                                                                // ...
                                                            },
                                                        },
                                                    ],
                                                }),
                                      },
                                  ],
                              },
                          ]
                        : []),
                    {
                        type: "body",
                        parameters: template.body.map((c) =>
                            typeof c === "string"
                                ? { type: "text", text: c }
                                : "currency" in c
                                ? {
                                      type: "currency",
                                      currency: {
                                          fallback_value: c.currency,
                                          code: c.code,
                                          amount_1000: c.amount,
                                      },
                                  }
                                : "dateTime" in c && {
                                      type: "date_time",
                                      date_time: { fallback_value: c.dateTime },
                                  }
                        ),
                    },
                    ...(template.buttons
                        ? template.buttons.flatMap((p, i) => {
                              switch (p?.type) {
                                  case "QuickReplyButton":
                                      return {
                                          type: "button",
                                          sub_type: "quick_reply",
                                          index: i,
                                          parameters: [{ type: "payload", payload: p.text }],
                                      };
                                  case "UrlButton":
                                      return {
                                          type: "button",
                                          sub_type: "url",
                                          index: i,
                                          text: p.title,
                                          url: p.url,
                                      };
                                  case "PhoneNumberButton":
                                      return {
                                          type: "button",
                                          sub_type: "phone_number",
                                          index: i,
                                          text: p.title,
                                          phone_number: p.phoneNumber,
                                      };
                                  default:
                                      return [];
                              }
                          })
                        : []),
                ].filter(Boolean),
            },
        };

        return ((await this._sendMessage(templateObjsct)) as SendMessageResponse).messages[0].id;
    }

    // messages
    private async _sendMessage(content: object): Promise<SendMessageResponse | isSuccessResponse> {
        return await this.makeRequest<SendMessageResponse | isSuccessResponse>({
            method: "POST",
            url: `/${this.phoneID}/messages`,
            data: {
                ...this.commonKeys,
                ...content,
            },
        });
    }
    private async sendInteractiveMessage(
        to: string,
        text: string,
        data: z.infer<typeof sendMessageOptionsSchema>,
        header?: { type: string; content: object }
    ) {
        let buttonArray;
        let buttonObject: any = {
            buttons: [],
        };
        let buttonTypes: string = "";
        if (data.buttons && !Array.isArray(data.buttons)) buttonArray = [data.buttons];
        else buttonArray = data.buttons;

        buttonArray?.map((button) => {
            if ("sections" in button) {
                buttonTypes = "list";
                buttonObject = {
                    button: button.buttonTitle,
                    sections: button.sections.map((section) => ({
                        title: section.title,
                        rows: section.rows.map((row) => ({
                            title: row.title,
                            id: row.callbackData,
                            description: row.description,
                        })),
                    })),
                };
            } else if ("url" in button) {
                buttonTypes = "cta_url";
                buttonObject = {
                    name: "cta_url",
                    parameters: { display_text: button.title, url: button.url },
                };
            } else if ("callbackData" in button) {
                buttonTypes = "button";
                buttonObject = {
                    buttons: [
                        ...buttonObject.buttons,
                        {
                            type: "reply",
                            reply: { title: button.title, id: button.callbackData },
                        },
                    ],
                };
            } else if ("catalog_id" in button) {
            } else throw new Error("");
        });
        return (
            (await this._sendMessage({
                to,
                ...(data.messageID && {
                    context: { message_id: data.messageID },
                }),
                type: "interactive",
                interactive: {
                    type: buttonTypes,
                    body: { text },
                    ...(data.header && {
                        header: {
                            type: "text",
                            text: data.header,
                        },
                    }),
                    ...(header?.content && {
                        header: {
                            type: header?.type,
                            ...header.content,
                        },
                    }),
                    ...(data.footer && {
                        footer: {
                            text: data.footer,
                        },
                    }),
                    action: buttonObject,
                },
            })) as SendMessageResponse
        ).messages[0].id;
    }
    private async sendMedia(
        type: "IMAGE" | "VIDEO" | "DOCUMENT" | "STICKER" | "AUDIO",
        to: string,
        media: string,
        options?: z.infer<typeof sendMediaInteractiveSchema>
    ): Promise<string> {
        const validation = await sendMediaInteractiveSchema.safeParse(options);

        if (!validation.success) {
            throw new ParametersError("Error in the parameters you provided", validation.error);
        }

        if (!options?.buttons) {
            return (
                (await this._sendMessage({
                    to,
                    type: type.toLowerCase(),
                    ...(options?.messageID && {
                        context: { message_id: options.messageID },
                    }),
                    [type.toLowerCase()]: {
                        ...(options?.capiton && { caption: options.capiton }),
                        ...(media.startsWith("http") && { link: media }),
                        ...(isNaN(Number(media)) &&
                            !media.startsWith("http") && {
                                id: await this.uploadMedia(media),
                            }),
                        ...(Number(media) && { id: media }),
                        ...(type === "DOCUMENT" && options?.filename && { filename: options?.filename }),
                    },
                })) as SendMessageResponse
            ).messages[0].id;
        } else {
            if (!options.capiton) throw new Error("לא ניתן לספק כפתורים ללא תיאור");
            return await this.sendInteractiveMessage(
                to,
                options.capiton,
                {
                    ...(options.messageID && { messageId: options.messageID }),
                    ...(options.footer && { footer: options.footer }),
                    buttons: options.buttons,
                },
                {
                    type: type.toLowerCase(),
                    content: {
                        [type.toLowerCase()]: {
                            ...(media.startsWith("http") && { link: media }),
                            ...(isNaN(Number(media)) &&
                                !media.startsWith("http") && {
                                    id: await this.uploadMedia(media),
                                }),
                            ...(Number(media) && { id: media }),
                            ...(type === "DOCUMENT" && options?.filename && { filename: options?.filename }),
                        },
                    },
                }
            );
        }
    }

    /**
     * Sends a message to the specified recipient.
     *
     * @async
     * @method sendMessage
     * @param {string} to - The phone number of the recipient.
     * @param {string} text - The text to send (markdown allowed, max 4096 characters).
     * @param {object} [options] - Additional options for the message.
     * @param {boolean} [options.previewUrl=false] - Whether to show a preview of the URL in the message (if any).
     * @param {string} [options.messageID] - The message ID to reply to.
     * @param {string} [options.header] - The header of the message (if keyboard is provided, up to 60 characters, no markdown allowed).
     * @param {string} [options.footer] - The footer of the message (if keyboard is provided, up to 60 characters, markdown has no effect).
     * @param {object|Array|null} [options.buttons] - The buttons to send with the message. Can be one of the following:
     *   - An object with `title` and `callbackData` properties (single button).
     *   - An array of objects with `title` and `callbackData` properties (up to 3 buttons).
     *   - An object with `title` and `url` properties (single URL button).
     *   - An object with `buttonTitle` and `sections` properties (section list).
     * @returns {Promise<string>} A Promise that resolves with the message ID.
     *
     * @example
     * const messageId = await sendMessage(recipientPhoneNumber, "Hello, World!");
     * // messageId: wamid.XXX=
     *
     * @example
     * const buttons = [
     *   { title: "Help", callbackData: "help" },
     *   { title: "About", callbackData: "about" }
     * ];
     * const messageId = await sendMessage(recipientPhoneNumber, "What can I help you with?", {
     *   footer: "Powered by wh-wrapper",
     *   buttons
     * });
     * // messageId: wamid.XXX=
     */
    public async sendMessage(to: string, text: string, options?: z.infer<typeof sendMessageOptionsSchema>): Promise<string> {
        const validation = sendMessageSchema.safeParse({ to, text, options });

        if (!validation.success) {
            throw new ParametersError("Error in the parameters you provided", validation.error);
        }

        const data: Partial<{
            to: string;
            type: "interactive" | "text";
            context: { message_id: string };
            interactive: Partial<{
                type: "list" | "button";
                header: { type: string; text: string };
                body: {};
                footer: { text: string };
                action: {};
            }>;
        }> = {
            to,
        };

        if (options?.messageID) data.context = { message_id: options.messageID };

        if (!options?.buttons && !options?.header && !options?.footer) {
            return (
                (await this._sendMessage({
                    ...data,
                    type: "text",
                    text: { body: text, preview_url: options?.previewUrl },
                })) as SendMessageResponse
            ).messages[0].id;
        } else return await this.sendInteractiveMessage(to, text, options);
    }

    /**
     * Reacts to a message with an emoji.
     *
     * @async
     * @method sendReaction
     * @param {string} to - The phone number of the recipient.
     * @param {string} emoji - The emoji to react with.
     * @param {string} messageID - The ID of the message to react to.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the reaction message.
     * Note: that this reaction message ID cannot be used to remove the reaction or perform any other action on it, Instead, use the original message ID.
     * @example const reactionMessageId = await sendReaction(recipientPhoneNumber, "👍", "wamid.XXX="); // wamid.XXX=
     */
    public async sendReaction(to: string, emoji: string, messageID: string): Promise<string> {
        const data = {
            to,
            type: "reaction",
            reaction: {
                message_id: messageID,
                emoji,
            },
        };

        return ((await this._sendMessage(data)) as SendMessageResponse).messages[0].id;
    }

    /**
     * Removes a reaction from a message.
     *
     * @async
     * @method removeReaction
     * @param {string} to - The phone number of the recipient.
     * @param {string} messageID - The ID of the message to remove the reaction from.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the reaction removal message.
     * Note that this reaction removal message ID cannot be used to re-react or perform any other action on it, nstead, use the original message ID.
     * @example const reactionRemovalMessageId = await removeReaction(recipientPhoneNumber, "wamid.XXX="); // wamid.XXX=
     */
    public async removeReaction(to: string, messageID: string): Promise<string> {
        return await this.sendReaction(to, messageID, "");
    }

    /**
     * Sends a location to a WhatsApp user.
     *
     * @async
     * @method sendLocation
     * @param {string} to - The phone ID of the WhatsApp user.
     * @param {object} location - The location object.
     * @param {number|string} location.latitude - The latitude of the location.
     * @param {number|string} location.longitude - The longitude of the location.
     * @param {object} [options] - Additional options.
     * @param {string} [options.name] - The name of the location.
     * @param {string} [options.address] - The address of the location.
     * @param {string} [options.messageID] - The message ID to reply to.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent location message.
     *
     * @example
     * const location = {
     *   latitude: 37.4847483695049,
     *   longitude: -122.1473373086664,
     * };
     * const messageId = await sendLocation(recipientPhoneNumber, location, {
     *   name: 'WhatsApp HQ',
     *   address: 'Menlo Park, 1601 Willow Rd, United States',
     * }); // messageId
     *
     * @throws {Error} Will throw an error if the `latitude` or `longitude` is missing from the `location` object.
     */
    public async sendLocation(
        to: string,
        location: { latitude: number | string; longitude: number | string },
        options?: { name?: string; address?: string; messageID?: string }
    ): Promise<string> {
        // handle error
        if (!location.latitude || !location.longitude) throw new Error("location is must");
        const data = {
            to,
            ...(options?.messageID && { context: { message_id: options.messageID } }),
            type: "location",
            location: {
                ...location,
                ...options,
            },
        };
        return ((await this._sendMessage(data)) as SendMessageResponse).messages[0].id;
    }

    /**
     * Sends a sticker to a WhatsApp user.
     *
     * @async
     * @method sendSticker
     * @param {string} to - The phone ID of the WhatsApp user.
     * @param {string} sticker - The sticker to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options.
     * @param {string} [options.messageID] - The message ID to reply to.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent sticker message.
     *
     * @example
     * const stickerUrl = 'https://example.com/sticker.webp';
     * const messageId = await sendSticker(recipientPhoneNumber, stickerUrl); // messageId: wamid.XXX=
     */
    async sendSticker(to: string, sticker: string, options?: { messageID: string }): Promise<string> {
        return await this.sendMedia("STICKER", to, sticker, options);
    }

    /**
     * Sends a video to a WhatsApp user.
     *
     * @async
     * @method sendVideo
     * @param {string} to - The phone ID of the WhatsApp user.
     * @param {string} video - The video to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options for the video message.
     * @param {string} [options.caption] - The caption of the video (markdown allowed). Required when buttons are provided.
     * @param {string} [options.footer] - The footer of the message (max 60 characters, markdown has no effect). Only applicable when buttons are provided.
     * @param {object|Array|null} [options.buttons] - The buttons to send with the video. See the `sendMessage` documentation for more details on button options.
     * @param {string} [options.messageID] - The message ID to reply to. Only works if buttons are provided.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent video message.
     *
     * @example
     * const videoUrl = 'https://example.com/video.mp4';
     * const messageId = await sendVideo(recipientPhoneNumber, videoUrl, {
     *   caption: 'This is a video',
     *   footer: 'Powered by wh-wrapper',
     *   buttons: {
     *     title: 'Watch More',
     *     url: 'https://example.com/videos',
     *   },
     * }); // messageId: wamid.XXX=
     */
    async sendVideo(
        to: string,
        video: string,
        options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">
    ): Promise<string> {
        return await this.sendMedia("VIDEO", to, video, options);
    }

    /**
     * Sends a document to a WhatsApp user.
     *
     * @async
     * @method sendDocument
     * @param {string} to - The phone ID of the WhatsApp user.
     * @param {string} document - The document to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options for the document message.
     * @param {string} [options.caption] - The caption of the document (markdown allowed). Required when buttons are provided.
     * @param {string} [options.footer] - The footer of the message (max 60 characters, markdown has no effect). Only applicable when buttons are provided.
     * @param {object|Array|null} [options.buttons] - The buttons to send with the document. See the `sendMessage` documentation for more details on button options.
     * @param {string} [options.messageID] - The message ID to reply to. Only works if buttons are provided.
     * @param {string} [options.filename] - The filename of the document. The extension of the filename will specify the format in which the document is displayed in WhatsApp.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent document message.
     *
     * @example
     * const documentUrl = 'https://example.com/example.pdf';
     * const messageId = await sendDocument(recipientPhoneNumber, documentUrl, {
     *   filename: 'fileexample.pdf',
     *   caption: 'Example PDF',
     *   footer: 'Powered by wh-wrapper',
     *   buttons: [
     *     { title: 'View', callbackData: 'view_document' },
     *     { title: 'Share', callbackData: 'share_document' },
     *   ],
     * }); // messageId: wamid.XXX=
     */
    async sendDocument(to: string, document: string, options?: z.infer<typeof sendMediaInteractiveSchema>): Promise<string> {
        return await this.sendMedia("DOCUMENT", to, document, options);
    }

    /**
     * Sends an audio file to a WhatsApp user.
     *
     * @async
     * @method sendAudio
     * @param {string} to - The phone ID of the WhatsApp user.
     * @param {string} audio - The audio file to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options.
     * @param {string} [options.messageID] - The message ID to reply to.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent audio message.
     *
     * @example
     * const audioUrl = 'https://example.com/audio.mp3';
     * const messageId = await sendAudio(recipientPhoneNumber, audioUrl); // messageId: wamid.XXX=
     */
    async sendAudio(to: string, audio: string, options?: { messageID: string }): Promise<string> {
        return await this.sendMedia("AUDIO", to, audio, options);
    }

    /**
     * Sends an image to a WhatsApp user.
     *
     * @async
     * @method sendImage
     * @param {string} to - The phone ID of the WhatsApp user.
     * @param {string} image - The image to send (can be a media ID, URL, or file path).
     * @param {object} [options] - Additional options for the image message.
     * @param {string} [options.caption] - The caption of the image (markdown allowed). Required when buttons are provided.
     * @param {string} [options.footer] - The footer of the message (max 60 characters, markdown has no effect). Only applicable when buttons are provided.
     * @param {object|Array|null} [options.buttons] - The buttons to send with the image. See the `sendMessage` documentation for more details on button options.
     * @param {string} [options.messageID] - The message ID to reply to. Only works if buttons are provided.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent image message.
     *
     * @example
     * const imageUrl = 'https://example.com/image.png';
     * const messageId = await sendImage(recipientPhoneNumber, imageUrl, {
     *   caption: 'This is an image!',
     *   footer: 'Powered by wh-wrapper',
     *   buttons: [
     *     { title: 'View', callbackData: 'view_image' },
     *     { title: 'Share', callbackData: 'share_image' },
     *   ],
     * }); // messageId: wamid.XXX=
     */
    async sendImage(to: string, image: string, options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">) {
        return await this.sendMedia("IMAGE", to, image, options);
    }

    /**
     * Sends a contact to a WhatsApp recipient.
     *
     * @async
     * @method sendContact
     * @param {string} to - The phone number of the recipient.
     * @param {string|object} name - The name of the contact. If a string, it's considered the full name. If an object, it can include fields like `firstName`, `lastName`, etc.
     * @param {string|object|Array<object>} phone - The phone number(s) of the contact. If a string, it's considered a regular phone number. If an object, it can include additional fields like `type` (phone type) and `waID` (WhatsApp ID).
     * @param {object} [options] - Additional options for the contact.
     * @param {string} [options.messageID] - The message ID to reply to.
     * @param {object|Array<object>} [options.addresses] - The addresses of the contact.
     * @param {object|Array<object>} [options.emails] - The email addresses of the contact.
     * @param {object|Array<object>} [options.urls] - The website URLs of the contact.
     * @param {object} [options.org] - The organization details of the contact.
     * @param {string} [options.birthday] - The birthday of the contact in "YYYY-MM-DD" format.
     * @returns {Promise<string>} A Promise that resolves with the message ID of the sent contact.
     *
     * @example
     * const contactId = await sendContact(recipientPhoneNumber, "John Doe", "972XXXXXXXXX"); // messageId: wamid.XXX=
     *
     * @example
     * const name = { firstName: "John", lastName: "Doe" };
     * const phone = { phone: "+1234567890", type: "MOBILE" };
     * const org = { company: "Acme Inc.", title: "Manager" };
     * const email = { email: "john.doe@example.com", type: "WORK" };
     * const contactId = await sendContact(recipientPhoneNumber, name, phone, {
     *   org,
     *   emails: [email],
     *   birthday: "1990-05-15",
     * }); // messageId: wamid.XXX=
     */
    public async sendContact(
        to: string,
        name: z.infer<typeof nameSchema>,
        phone: z.infer<typeof phoneSchema>,
        options?: z.infer<typeof SendContacOptionSchema>
    ): Promise<string> {
        const validation = await SendContacSchema.safeParse({
            to,
            name,
            phones: phone,
            options,
        });

        if (!validation.success) {
            throw new ParametersError("Error in the parameters you provided", validation.error);
        }
        return (
            (await this._sendMessage({
                to,
                ...(options?.messageID && {
                    context: { message_id: options.messageID },
                }),
                type: "contacts",
                contacts: [
                    {
                        name: typeof name === "string" ? { first_name: name, formatted_name: name } : name,
                        phones: typeof phone === "string" ? { phone: "+" + phone } : !Array.isArray(phone) ? [phone] : phone,
                        ...(options?.birthday && { birthday: options.birthday }),
                        ...(options?.Org && { org: options.Org }),
                        ...(options?.emails && {
                            emails: !Array.isArray(options.emails) ? [options.emails] : options.emails,
                        }),
                        ...(options?.addresses && {
                            addresses: !Array.isArray(options.addresses) ? [options.addresses] : options.addresses,
                        }),
                        ...(options?.urls && {
                            urls: !Array.isArray(options.urls) ? [options.urls] : options.urls,
                        }),
                    },
                ],
            })) as SendMessageResponse
        ).messages[0].id;
    }

    /**
     * Sends a raw request to the WhatsApp API.
     *
     * @async
     * @method sendRowRequest
     * @param {Object} obj - The request details.
     * @param {string} obj.method - The HTTP method (GET, POST, PUT, DELETE).
     * @param {string} obj.endpoint - The API endpoint to send the request to.
     * @param {Object} [obj.data] - The data to send with the request (for POST, PUT methods).
     * @param {Object} [obj.headers] - Additional headers to include in the request.
     * @returns {Promise<T>} A Promise that resolves with the response data.
     * @template T
     */
    public async sendRowRequest<T>(obj: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        endpoint: string;
        data?: object;
        headers?: object;
    }) {
        return await this.makeRequest<T>({ ...obj, url: obj.endpoint });
    }

    /**
     * Marks a message as read.
     *
     * @async
     * @method markMessageAsRead
     * @param {string} messageID - The ID of the message to mark as read.
     * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating whether the message was successfully marked as read.
     *
     * @example
     * const markAsReadSuccess = await markMessageAsRead("wamid.XXX="); // markAsReadSuccess: boolean
     */
    public async markMessageAsRead(messageID: string): Promise<boolean> {
        const data = {
            messaging_product: "whatsapp",
            status: "read",
            message_id: messageID,
        };
        return ((await this._sendMessage(data)) as isSuccessResponse).success;
    }

    // media

    /**
     * Deletes media from the WhatsApp server.
     *
     * @async
     * @method deleteMedia
     * @param {string|number} mediaID - The ID of the media to be deleted.
     * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating whether the media was successfully deleted.
     *
     * @example
     * const mediaId = '923733282676675';
     * const deleteSuccess = await deleteMedia(mediaId); // deleteSuccess: boolean
     */
    public async deleteMedia(mediaID: string | number): Promise<boolean> {
        return (
            await this.makeRequest<isSuccessResponse>({
                method: "DELETE",
                url: `/${mediaID.toString()}`,
                params: { phone_number_id: this.phoneID },
            })
        ).success;
    }

    /**
     * Uploads media to WhatsApp servers.
     *
     * @async
     * @method uploadMedia
     * @param {string|} media - The path to the media file or a URL pointing to the media file.
     * @returns {Promise<string>} A Promise that resolves with a string of the uploaded media.
     *
     * @example
     * const mediaPath = '/path/to/image.jpg';
     * const mediaId = await uploadMedia(mediaPath); // mediaId: 'wamid.XXX='
     */
    async uploadMedia(media: string): Promise<string> {
        const data = new FormData();
        data.append("messaging_product", "whatsapp");

        if (media.startsWith("http")) {
            const response = await axios.get(media, { responseType: "arraybuffer" });
            const mimeType = response.headers["content-type"];
            data.append("file", response.data, {
                contentType: mimeType,
                filename: media.split("/").pop(),
            });
            data.append("type", mimeType);
        } else {
            if (!fs.existsSync(media)) throw new Error("חובה לספק נתיב קובץ תקין");
            data.append("file", fs.createReadStream(media));
        }

        return (
            await this.makeRequest<{ id: string }>({
                method: "POST",
                url: `/${this.phoneID}/media`,
                data,
                headers: {
                    ...data.getHeaders(),
                },
            })
        ).id;
    }

    // profile
    async getProfile() {
        // add the return type
        const phoneData = await this.makeRequest<GetPhoneNumberByID>({
            method: "GET",
            url: `/${this.phoneID}/`,
        });
        const fields = ["about", "address", "description", "email", "profile_picture_url", "websites", "vertical"];
        const profile = (
            await this.makeRequest<{ data: WhatsAppProfileData[] }>({
                method: "GET",
                url: `/${this.phoneID}/whatsapp_business_profile?fields=${fields.join(",")}`,
            })
        ).data[0];

        return {
            verifiedName: phoneData.verified_name,
            phoneNumber: phoneData.display_phone_number,
            phoneNumberID: phoneData.id,
            qualityRating: phoneData.quality_rating,
            about: profile.about,
            description: profile.description,
            address: profile.address,
            email: profile.email,
            profilePictureUrl: profile.profile_picture_url,
            websites: profile.websites,
            vertical: profile.vertical,
        };
    }
    async registerPhoneNumber(
        pin: string,
        dataLocalizationRegion?: "AU" | "ID" | "IN" | "JP" | "SG" | "KR" | "DE" | "CH" | "GB" | "BR" | "BH" | "ZA" | "CA"
    ): Promise<{ success: boolean }> {
        return await this.makeRequest<{ success: boolean }>({
            url: `/${this.phoneID}/register`,
            method: "POST",
            data: {
                ...this.commonKeys,
                pin,
                ...(dataLocalizationRegion ? { dataLocalizationRegion } : {}),
            },
        });
    }
    async setBusinessPublicKey(publicKey: string): Promise<boolean> {
        return (
            await this.makeRequest<{ success: boolean }>({
                url: `/${this.phoneID}/whatsapp_business_encryption`,
                method: "POST",
                data: { business_public_key: publicKey },
            })
        ).success;
    }
    async updateBusinessProfile(info: z.infer<typeof UpdateBusinessProfileSchema>): Promise<isSuccessResponse> {
        const validation = UpdateBusinessProfileSchema.safeParse(info);

        if (!validation.success) {
            throw new ParametersError("Error in the parameters you provided", validation.error);
        }

        const data = Object.fromEntries(
            Object.entries({
                about: info.about,
                address: info.address,
                description: info.description,
                email: info.email,
                profile_picture_handle: info.profilePictureHandle,
                vertical: info.industry.toString().toLowerCase(),
                websites: info.websites,
            }).filter(([_, v]) => v != null && v !== "")
        );

        return (await this.makeRequest<isSuccessResponse>({
            url: `/${this.phoneID}/whatsapp_business_profile`,
            method: "POST",
            data,
        })) as isSuccessResponse;
    }

    // public async updateCommerceSettings(settings: CommerceSettings) {
    //   if (!settings.isCartEnabled && !settings.isCatalogVisible) {
    //     throw new Error("At least one setting must be provided");
    //   }
    //   const data = {
    //     is_cart_enabled: settings.isCartEnabled,
    //     is_catalog_visible: settings.isCatalogVisible,
    //   };
    //   return await this.makeRequest({
    //     method: "POST",
    //     url: `/${this.phoneID}/whatsapp_commerce_settings`,
    //     params: data,
    //   });
    // }
    ////////////////////////////////////////////////////////////////
    // public async getCommerceSettings() {
    //   return await this.makeRequest<{
    //     data: CommerceSettings & { catalog_id: string }[];
    //   }>({
    //     method: "GET",
    //     url: `/${this.phoneID}/whatsapp_commerce_settings`,
    //   });
    // }
    ////////////////////////////////////////////////////////////////
    // public async getNameStatus() {
    //     return await this.makeRequest<{ id: string; name_status: string }>({
    //         method: "GET",
    //         url: `/${this.phoneID}/`,
    //         params: { fields: "name_status" },
    //     });
    // }
    ////////////////////////////////////////////////////////////////
    // public async getAllSubscriptions(): Promise<GetAllSubscriptions[]> {
    //     if (!this.options?.businessAccountID) throw new Error("You must provide a business account to getAllSubscriptions");

    //     return (
    //         await this.makeRequest<{ data: GetAllSubscriptions[] }>({
    //             method: "GET",
    //             url: `/${this.options?.businessAccountID}/subscribed_apps/`,
    //         })
    //     ).data;
    // }
}
