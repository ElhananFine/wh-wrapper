"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const express_1 = __importDefault(require("express"));
const axios_1 = __importStar(require("axios"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
const message_handler_1 = __importDefault(require("../handlers/message-handler"));
const schema_1 = require("../schemas/schema");
const callback_handler_1 = __importDefault(require("../handlers/callback-handler"));
const update_handler_1 = __importDefault(require("../handlers/update-handler"));
const request_welcome_handler_1 = __importDefault(require("../handlers/request-welcome-handler"));
const error_classes_1 = require("../errors/error-classes");
class Client extends events_1.EventEmitter {
    constructor(phoneID, token, verifyToken, options = {}) {
        var _a, _b, _c, _d;
        super();
        this.phoneID = phoneID;
        this.token = token;
        this.verifyToken = verifyToken;
        this.options = options;
        this._untypedOn = this.on;
        this.on = (event, listener) => this._untypedOn(event, listener);
        this.commonKeys = { messaging_product: "whatsapp", recipient_type: "individual" };
        console.clear();
        if (!this.phoneID || !this.token)
            throw new Error("Missing Parameters, phoneID and token are required");
        this.url = `${((_a = this.options) === null || _a === void 0 ? void 0 : _a.baseURL) || "https://graph.facebook.com"}/v${((_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.apiVersion) === null || _c === void 0 ? void 0 : _c.toString()) || "19.0"}`;
        this.axiosInstance = axios_1.default.create({
            baseURL: this.url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
            },
        });
        if ((_d = this.options) === null || _d === void 0 ? void 0 : _d.callbackUrl) {
            if (!this.options.appID || !this.options.appSecret)
                throw new Error("Missing Parameters, appId and appSecret are required");
            this._setCallBackUrl(this.options.callbackUrl, this.options.appID.toString(), this.options.appSecret);
        }
        if (this.verifyToken)
            this._initialize();
    }
    async _setCallBackUrl(callbackUrl, appID, appSecret) {
        const getAppAcsessToken = await this.makeRequest({
            method: "GET",
            url: `/oauth/access_token`,
            params: {
                grant_type: "client_credentials",
                client_id: appID,
                client_secret: appSecret,
            },
        });
        const response = await this.makeRequest({
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
        if (response.success)
            console.info("CallBack URL successfully registered!");
        return response;
    }
    async _initialize() {
        var _a, _b;
        if (!this.options.server ||
            !this.options.server.hasOwnProperty("listen") ||
            typeof this.options.server.listen !== "function") {
            console.warn("A proper Express instance was not provided, an Express server operator...");
            const port = this.options.port || 3000;
            this.options.server = (0, express_1.default)();
            this.options.server.listen(port);
            this.options.server.use(express_1.default.json());
            console.warn(`Express server listening on http://localhost:${port}, port: ${port}`);
        }
        if (!this.verifyToken)
            throw new Error("A proper verify token must be provided.");
        this.options.server.get(((_a = this === null || this === void 0 ? void 0 : this.options) === null || _a === void 0 ? void 0 : _a.webHookEndpoint) || "/", (req, res) => {
            return req.query["hub.verify_token"] === this.verifyToken
                ? res.status(200).send(req.query["hub.challenge"])
                : res.status(403).send("Error, invalid verification token");
        });
        this.options.server.post(((_b = this.options) === null || _b === void 0 ? void 0 : _b.webHookEndpoint) || "/", (req, res) => {
            try {
                const field = req.body.entry[0].changes[0].field;
                const value = req.body.entry[0].changes[0].value;
                if (value.metadata.phone_number_id !== this.phoneID)
                    return res.status(200).send();
                if (field === "messages") {
                    if ("messages" in value) {
                        if (value.messages[0].type === "interactive")
                            this.emit("callbacks", new callback_handler_1.default(this, value));
                        else if ([
                            "text",
                            "image",
                            "sticker",
                            "video",
                            "document",
                            "audio",
                            "location",
                            "contacts",
                            "unsupported",
                        ].includes(value.messages[0].type)) {
                            this.emit("messages", new message_handler_1.default(this, value));
                        }
                        else if (value.messages[0].type === "request_welcome") {
                            this.emit("ChatOpened", new request_welcome_handler_1.default(this, value));
                        }
                        else
                            return;
                    }
                    else if ("statuses" in value) {
                        this.emit("statuses", new update_handler_1.default(this, value));
                    }
                }
                return res.status(200).send();
            }
            catch (e) {
                res.status(500).send();
            }
        });
    }
    async makeRequest(config) {
        var _a, _b;
        try {
            const response = await this.axiosInstance({
                ...config,
            });
            return response.data;
        }
        catch (e) {
            if ((0, axios_1.isAxiosError)(e)) {
                const response = e.response;
                const code = response.data.error.code;
                const message = response.data.error.message;
                const fbtrace_id = (_a = response.data.error) === null || _a === void 0 ? void 0 : _a.fbtrace_id;
                const type = response.data.error.type;
                const details = (_b = response.data.error.error_data) === null || _b === void 0 ? void 0 : _b.details;
                switch (true) {
                    case [0, 3, 10, 190, 200].includes(code):
                        throw new error_classes_1.AuthError(code, message, fbtrace_id, type, details);
                    case [4, 80007, 130429, 131048, 131056, 133016].includes(code):
                        throw new error_classes_1.ThrottlingError(code, message, fbtrace_id, type, details);
                    case [368, 131031].includes(code):
                        throw new error_classes_1.IntegrityError(code, message, fbtrace_id, type, details);
                    case [100, 131008, 131009].includes(code):
                        throw new error_classes_1.ParameterError(code, message, fbtrace_id, type, details);
                    case [131021, 131026, 131047, 131051, 131052, 131053].includes(code):
                        throw new error_classes_1.MessageError(code, message, fbtrace_id, type, details);
                    case [132000, 132001, 132005, 132007, 132012, 132015, 132016, 132068, 132069].includes(code):
                        throw new error_classes_1.TemplateError(code, message, fbtrace_id, type, details);
                    case [133000, 133004, 133005, 133006, 133008, 133009, 133010, 133015].includes(code):
                        throw new error_classes_1.RegistrationError(code, message, fbtrace_id, type, details);
                    case [131042].includes(code):
                        throw new error_classes_1.BillingError(code, message, fbtrace_id, type, details);
                    default:
                        throw new error_classes_1.UnknownError(code, message, fbtrace_id, type, details);
                }
            }
            else {
                throw new Error("unknown error");
            }
        }
    }
    async createTemplate(template) {
        var _a, _b, _c, _d;
        if (!this.options.businessAccountID)
            throw new Error("You must provide a business account Id before used");
        const validation = schema_1.CreateTempleteSchema.safeParse(template);
        if (!validation.success) {
            throw new error_classes_1.ParametersError("Error in the parameters you provided", validation.error);
        }
        const data = {
            name: template.name.replace(/ /g, "_"),
            language: schema_1.Language[template.language],
            category: template.category,
            allow_category_change: true,
            components: [],
        };
        if (template.header) {
            const header = { type: "HEADER" };
            header.format = template.header.type;
            if (template.header.type === "IMAGE" ||
                template.header.type === "VIDEO" ||
                template.header.type === "DOCUMENT") {
                header.example = { header_handle: [template.header.media] };
            }
            else if (template.header.type === "TEXT" && template.header.text) {
                const variables = template.header.text.match(/\{\{(.*?)\}\}/g);
                if (variables && (variables === null || variables === void 0 ? void 0 : variables.length) > 0) {
                    template.header.text = template.header.text.split(variables[0].trim()).join("{{1}}");
                }
                header.text = template.header.text;
                if (variables)
                    header.example = {
                        header_text: variables === null || variables === void 0 ? void 0 : variables.map((v) => v.slice(2, -2)),
                    };
            }
            (_a = data.components) === null || _a === void 0 ? void 0 : _a.push(header);
        }
        const body = { type: "BODY" };
        if (typeof template.body === "string") {
            const variables = template.body.match(/\{\{(.*?)\}\}/g);
            if (variables && variables.length > 0) {
                variables.map((v, i) => (template.body = template.body.split(v.trim()).join(`{{${i + 1}}}`)));
            }
            body.text = template.body;
            if (variables)
                body.example = {
                    body_text: [(variables === null || variables === void 0 ? void 0 : variables.map((v) => v.slice(2, -2))) || []],
                };
        }
        else {
            body.add_security_recommendation = template.body.addSecurityRecommendation;
        }
        (_b = data.components) === null || _b === void 0 ? void 0 : _b.push(body);
        if (template.footer)
            (_c = data.components) === null || _c === void 0 ? void 0 : _c.push({
                type: "FOOTER",
                text: template.footer,
            });
        if (template.buttons) {
            const buttonsData = { type: "BUTTONS", buttons: [] };
            if (!Array.isArray(template.buttons))
                template.buttons = [template.buttons];
            if (template.buttons.filter((b) => (b === null || b === void 0 ? void 0 : b.type) === "UrlButton").length > 2)
                throw new Error("Max 2 URL buttons allowed");
            if (template.buttons.filter((b) => (b === null || b === void 0 ? void 0 : b.type) === "PhoneNumberButton").length > 1)
                throw new Error("Max 1 phone number button allowed");
            template.buttons.map((button) => {
                switch (button === null || button === void 0 ? void 0 : button.type) {
                    case "UrlButton":
                        const variables = button.url.match(/\{\{(.*?)\}\}/g);
                        variables && variables.map((v, i) => (button.url = button.url.split(v.trim()).join(`{{${i + 1}}}`)));
                        buttonsData.buttons.push({
                            type: "URL",
                            text: button.title,
                            url: button.url,
                            ...(variables && variables.length > 0
                                ? {
                                    example: variables === null || variables === void 0 ? void 0 : variables.map((v) => `${v.slice(2, -2)}`),
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
                        const otp = {
                            type: "OTP",
                            otp_type: button.OTPType,
                        };
                        if (button.packageName)
                            otp.package_name = button.packageName;
                        if (button.signatureHash)
                            otp.signature_hash = button.signatureHash;
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
            buttonsData.buttons.sort((a, b) => {
                const typeOrder = {
                    QUICK_REPLY: 1,
                    URL: 2,
                    PHONE_NUMBER: 3,
                    COPY_CODE: 4,
                };
                return typeOrder[a.type] - typeOrder[b.type];
            });
            (_d = data.components) === null || _d === void 0 ? void 0 : _d.push(buttonsData);
        }
        console.log(JSON.stringify(data));
        const response = await this.makeRequest({
            method: "POST",
            url: `/${this.options.businessAccountID}/message_templates`,
            data,
        });
        return {
            ...response,
            templateName: template.name.replace(/ /g, "_"),
        };
    }
    async sendTemplate(to, template, options) {
        const validation = schema_1.SendTemplateSchema.safeParse(template);
        if (!validation.success) {
            throw new error_classes_1.ParametersError("Error in the parameters you provided", validation.error);
        }
        if (!Array.isArray(template.body))
            template.body = [template.body];
        if (!Array.isArray(template === null || template === void 0 ? void 0 : template.buttons))
            template.buttons = [template.buttons];
        const templateObjsct = {
            to,
            type: "template",
            ...((options === null || options === void 0 ? void 0 : options.messageID) && {
                context: { message_id: options === null || options === void 0 ? void 0 : options.messageID },
            }),
            template: {
                name: template.name,
                language: {
                    code: schema_1.Language[template.language],
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
                                                        [template.header.type.toLowerCase()]: {},
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
                        parameters: template.body.map((c) => typeof c === "string"
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
                                }),
                    },
                    ...(template.buttons
                        ? template.buttons.flatMap((p, i) => {
                            switch (p === null || p === void 0 ? void 0 : p.type) {
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
        return (await this._sendMessage(templateObjsct)).messages[0].id;
    }
    async _sendMessage(content) {
        return await this.makeRequest({
            method: "POST",
            url: `/${this.phoneID}/messages`,
            data: {
                ...this.commonKeys,
                ...content,
            },
        });
    }
    async sendInteractiveMessage(to, text, data, header) {
        let buttonArray;
        let buttonObject = {
            buttons: [],
        };
        let buttonTypes = "";
        if (data.buttons && !Array.isArray(data.buttons))
            buttonArray = [data.buttons];
        else
            buttonArray = data.buttons;
        buttonArray === null || buttonArray === void 0 ? void 0 : buttonArray.map((button) => {
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
            }
            else if ("url" in button) {
                buttonTypes = "cta_url";
                buttonObject = {
                    name: "cta_url",
                    parameters: { display_text: button.title, url: button.url },
                };
            }
            else if ("callbackData" in button) {
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
            }
            else if ("catalog_id" in button) {
            }
            else
                throw new Error("");
        });
        return (await this._sendMessage({
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
                ...((header === null || header === void 0 ? void 0 : header.content) && {
                    header: {
                        type: header === null || header === void 0 ? void 0 : header.type,
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
        })).messages[0].id;
    }
    async sendMedia(type, to, media, options) {
        const validation = await schema_1.sendMediaInteractiveSchema.safeParse(options);
        if (!validation.success) {
            throw new error_classes_1.ParametersError("Error in the parameters you provided", validation.error);
        }
        if (!(options === null || options === void 0 ? void 0 : options.buttons)) {
            return (await this._sendMessage({
                to,
                type: type.toLowerCase(),
                ...((options === null || options === void 0 ? void 0 : options.messageID) && {
                    context: { message_id: options.messageID },
                }),
                [type.toLowerCase()]: {
                    ...((options === null || options === void 0 ? void 0 : options.capiton) && { caption: options.capiton }),
                    ...(media.startsWith("http") && { link: media }),
                    ...(isNaN(Number(media)) &&
                        !media.startsWith("http") && {
                        id: await this.uploadMedia(media),
                    }),
                    ...(Number(media) && { id: media }),
                    ...(type === "DOCUMENT" && (options === null || options === void 0 ? void 0 : options.filename) && { filename: options === null || options === void 0 ? void 0 : options.filename }),
                },
            })).messages[0].id;
        }
        else {
            if (!options.capiton)
                throw new Error("לא ניתן לספק כפתורים ללא תיאור");
            return await this.sendInteractiveMessage(to, options.capiton, {
                ...(options.messageID && { messageId: options.messageID }),
                ...(options.footer && { footer: options.footer }),
                buttons: options.buttons,
            }, {
                type: type.toLowerCase(),
                content: {
                    [type.toLowerCase()]: {
                        ...(media.startsWith("http") && { link: media }),
                        ...(isNaN(Number(media)) &&
                            !media.startsWith("http") && {
                            id: await this.uploadMedia(media),
                        }),
                        ...(Number(media) && { id: media }),
                        ...(type === "DOCUMENT" && (options === null || options === void 0 ? void 0 : options.filename) && { filename: options === null || options === void 0 ? void 0 : options.filename }),
                    },
                },
            });
        }
    }
    async sendMessage(to, text, options) {
        const validation = schema_1.sendMessageSchema.safeParse({ to, text, options });
        if (!validation.success) {
            throw new error_classes_1.ParametersError("Error in the parameters you provided", validation.error);
        }
        const data = {
            to,
        };
        if (options === null || options === void 0 ? void 0 : options.messageID)
            data.context = { message_id: options.messageID };
        if (!(options === null || options === void 0 ? void 0 : options.buttons) && !(options === null || options === void 0 ? void 0 : options.header) && !(options === null || options === void 0 ? void 0 : options.footer)) {
            return (await this._sendMessage({
                ...data,
                type: "text",
                text: { body: text, preview_url: options === null || options === void 0 ? void 0 : options.previewUrl },
            })).messages[0].id;
        }
        else
            return await this.sendInteractiveMessage(to, text, options);
    }
    async sendReaction(to, emoji, messageID) {
        const data = {
            to,
            type: "reaction",
            reaction: {
                message_id: messageID,
                emoji,
            },
        };
        return (await this._sendMessage(data)).messages[0].id;
    }
    async removeReaction(to, messageID) {
        return await this.sendReaction(to, messageID, "");
    }
    async sendLocation(to, location, options) {
        if (!location.latitude || !location.longitude)
            throw new Error("location is must");
        const data = {
            to,
            ...((options === null || options === void 0 ? void 0 : options.messageID) && { context: { message_id: options.messageID } }),
            type: "location",
            location: {
                ...location,
                ...options,
            },
        };
        return (await this._sendMessage(data)).messages[0].id;
    }
    async sendSticker(to, sticker, options) {
        return await this.sendMedia("STICKER", to, sticker, options);
    }
    async sendVideo(to, video, options) {
        return await this.sendMedia("VIDEO", to, video, options);
    }
    async sendDocument(to, document, options) {
        return await this.sendMedia("DOCUMENT", to, document, options);
    }
    async sendAudio(to, audio, options) {
        return await this.sendMedia("AUDIO", to, audio, options);
    }
    async sendImage(to, image, options) {
        return await this.sendMedia("IMAGE", to, image, options);
    }
    async sendContact(to, name, phone, options) {
        const validation = await schema_1.SendContacSchema.safeParse({
            to,
            name,
            phones: phone,
            options,
        });
        if (!validation.success) {
            throw new error_classes_1.ParametersError("Error in the parameters you provided", validation.error);
        }
        return (await this._sendMessage({
            to,
            ...((options === null || options === void 0 ? void 0 : options.messageID) && {
                context: { message_id: options.messageID },
            }),
            type: "contacts",
            contacts: [
                {
                    name: typeof name === "string" ? { first_name: name, formatted_name: name } : name,
                    phones: typeof phone === "string" ? { phone: "+" + phone } : !Array.isArray(phone) ? [phone] : phone,
                    ...((options === null || options === void 0 ? void 0 : options.birthday) && { birthday: options.birthday }),
                    ...((options === null || options === void 0 ? void 0 : options.Org) && { org: options.Org }),
                    ...((options === null || options === void 0 ? void 0 : options.emails) && {
                        emails: !Array.isArray(options.emails) ? [options.emails] : options.emails,
                    }),
                    ...((options === null || options === void 0 ? void 0 : options.addresses) && {
                        addresses: !Array.isArray(options.addresses) ? [options.addresses] : options.addresses,
                    }),
                    ...((options === null || options === void 0 ? void 0 : options.urls) && {
                        urls: !Array.isArray(options.urls) ? [options.urls] : options.urls,
                    }),
                },
            ],
        })).messages[0].id;
    }
    async sendRowRequest(obj) {
        return await this.makeRequest({ ...obj, url: obj.endpoint });
    }
    async markMessageAsRead(messageID) {
        const data = {
            messaging_product: "whatsapp",
            status: "read",
            message_id: messageID,
        };
        return (await this._sendMessage(data)).success;
    }
    async deleteMedia(mediaID) {
        return (await this.makeRequest({
            method: "DELETE",
            url: `/${mediaID.toString()}`,
            params: { phone_number_id: this.phoneID },
        })).success;
    }
    async uploadMedia(media) {
        const data = new form_data_1.default();
        data.append("messaging_product", "whatsapp");
        if (media.startsWith("http")) {
            const response = await axios_1.default.get(media, { responseType: "arraybuffer" });
            const mimeType = response.headers["content-type"];
            data.append("file", response.data, {
                contentType: mimeType,
                filename: media.split("/").pop(),
            });
            data.append("type", mimeType);
        }
        else {
            if (!fs_1.default.existsSync(media))
                throw new Error("חובה לספק נתיב קובץ תקין");
            data.append("file", fs_1.default.createReadStream(media));
        }
        return (await this.makeRequest({
            method: "POST",
            url: `/${this.phoneID}/media`,
            data,
            headers: {
                ...data.getHeaders(),
            },
        })).id;
    }
    async getProfile() {
        const phoneData = await this.makeRequest({
            method: "GET",
            url: `/${this.phoneID}/`,
        });
        const fields = ["about", "address", "description", "email", "profile_picture_url", "websites", "vertical"];
        const profile = (await this.makeRequest({
            method: "GET",
            url: `/${this.phoneID}/whatsapp_business_profile?fields=${fields.join(",")}`,
        })).data[0];
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
    async registerPhoneNumber(pin, dataLocalizationRegion) {
        return await this.makeRequest({
            url: `/${this.phoneID}/register`,
            method: "POST",
            data: {
                ...this.commonKeys,
                pin,
                ...(dataLocalizationRegion ? { dataLocalizationRegion } : {}),
            },
        });
    }
    async setBusinessPublicKey(publicKey) {
        return (await this.makeRequest({
            url: `/${this.phoneID}/whatsapp_business_encryption`,
            method: "POST",
            data: { business_public_key: publicKey },
        })).success;
    }
    async updateBusinessProfile(info) {
        const validation = schema_1.UpdateBusinessProfileSchema.safeParse(info);
        if (!validation.success) {
            throw new error_classes_1.ParametersError("Error in the parameters you provided", validation.error);
        }
        const data = Object.fromEntries(Object.entries({
            about: info.about,
            address: info.address,
            description: info.description,
            email: info.email,
            profile_picture_handle: info.profilePictureHandle,
            vertical: info.industry.toString().toLowerCase(),
            websites: info.websites,
        }).filter(([_, v]) => v != null && v !== ""));
        return (await this.makeRequest({
            url: `/${this.phoneID}/whatsapp_business_profile`,
            method: "POST",
            data,
        }));
    }
}
exports.default = Client;
