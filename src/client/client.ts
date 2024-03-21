import { EventEmitter } from "events";
import express, { Request, Response } from "express";
import axios, { AxiosResponse, ResponseType, isAxiosError } from "axios";
import fs from "fs";
import FormData from "form-data";
import * as z from "zod";
import Message from "../handlers/message-handler";
import {
  getDisplayNameStatus,
  WhatsAppProfileData,
  CreateTempleteResponse,
} from "../interfaces/client-interface";
import {
  GetAllSubscriptions,
  getPhoneNumbers,
} from "../interfaces/whatsapp-response-interface";
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
  RegistrationError,
  TemplateError,
  ThrottlingError,
  UnknownError,
} from "../errors/error-classes";
import {
  GetPhoneNumberByID,
  isSuccessResponse,
  SendMessageResponse,
} from "../types/internal-types";
import { ClientOptions, GetPhoneDataReturn } from "../types/shared";

type MessageHandlers = {
  messages: (message: Message) => void;
  statuses: (statuses: Update) => void;
  callbacks: (callbacks: Callback) => void;
  ChatOpened: (chat: RequestWelcome) => void;
};

/** @constructor */
export default class Client extends EventEmitter {
  private _untypedOn = this.on;
  public on = <K extends keyof MessageHandlers>(
    event: K,
    listener: MessageHandlers[K]
  ): this => this._untypedOn(event, listener);

  url;
  axiosInstance;
  commonKeys = { messaging_product: "whatsapp", recipient_type: "individual" };
  constructor(
    private readonly phoneID: string | number,
    private readonly token: string,
    private readonly verifyToken?: string,
    private options: Partial<ClientOptions> = {}
  ) {
    super();
    console.clear();

    if (!this.phoneID || !this.token)
      throw new Error("Missing Parameters, phoneID and token are required");

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

    this.axiosInstance.defaults.headers;

    if (this.verifyToken) this.initialize();

    if (this.options?.callbackUrl) {
      if (!this.options.appID || !this.options.appSecret)
        throw new Error("Missing Parameters, appId and appSecret are required");
      else
        this._setCallBackUrl(
          this.options.callbackUrl,
          this.options.appID.toString(),
          this.options.appSecret
        );
    }
  }

  private async initialize(): Promise<void> {
    if (
      !this.options.server ||
      !this.options.server.hasOwnProperty("listen") ||
      typeof this.options.server.listen !== "function"
    ) {
      console.warn(
        "A proper Express instance was not provided, an Express server operator..."
      );
      const port = this.options.port || 3000;
      this.options.server = express();
      this.options.server.listen(port);
      this.options.server.use(express.json());
      console.warn(
        `Express server listening on http://localhost:${port}, port: ${port}`
      );
    }

    if (!this.verifyToken)
      throw new Error("A proper verify token must be provided.");

    this.options.server.get(
      this?.options?.webHookEndpoint || "/",
      (req: Request, res: Response) => {
        return req.query["hub.verify_token"] === this.verifyToken
          ? res.status(200).send(req.query["hub.challenge"])
          : res.status(403).send("Error, invalid verification token");
      }
    );
    this.options.server.post(
      this.options?.webHookEndpoint || "/",
      (req: Request, res: Response) => {
        try {
          const field = req.body.entry[0].changes[0].field;
          const value = req.body.entry[0].changes[0].value;

          if (value.metadata.phone_number_id !== this.phoneID)
            return res.status(200).send();

          if (field === "messages") {
            if ("messages" in value) {
              if (value.messages[0].type === "interactive")
                this.emit("callbacks", new Callback(this, value));
              else if (
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
                this.emit("ChatOpened", new RequestWelcome(this, value));
              } else return;
            } else if ("statuses" in value) {
              this.emit("statuses", new Update(this, value));
            }
          }
          return res.status(200).send();
        } catch (e) {
          res.status(500).send();
        }
      }
    );
  }

  private formatZodError(error: any): void {
    const errorMessages = error.issues.map((issue: any) => {
      return `(${issue.code}): ${issue.path.join(".")} ${
        issue.message
      } expected ${issue.expected} but received ${issue.received}`;
    });
    throw new Error(errorMessages);
  }

  // flows
  async createFlow() {}
  async deleteFlow() {}
  public async sendCatalog() {}
  // public async sendProduct({
  //   to,
  //   catalogId,
  //   productSections,
  //   title,
  //   body,
  //   footer,
  //   replyToMessageId,
  // }: SendProductsParams) {
  //   const action = {
  //     catalog_id: catalogId,
  //     sections: productSections.map((section) => ({
  //       title: section.title,
  //       product_items: section.skus.map((sku) => ({ productRetailerId: sku })),
  //     })),
  //   };

  //   return await this._sendMessage({
  //     to,
  //     type: "interactive",
  //     interactive: {
  //       type: "product_list",
  //       action,
  //     },
  //   });
  // }

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

    if (!this.options.businessAccountID)
      throw new Error("You must provide a business account Id before used");
    const validation = CreateTempleteSchema.safeParse(template);
    if (!validation.success) this.formatZodError(validation.error);

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
          template.header.text = template.header.text
            .split(variables[0].trim())
            .join("{{1}}");
        }

        header.text = template.header.text;
        header.example = {
          header_text: variables?.map((v) => v.slice(2, -2)) || [],
        };
      }
      data.components?.push(header);
    }

    // body
    const body: Partial<componentsType> = { type: "BODY" };

    if (typeof template.body === "string") {
      const variables = template.body.match(/\{\{(.*?)\}\}/g);

      if (variables && variables.length > 0) {
        variables.map(
          (v, i) =>
            (template.body = (template.body as string)
              .split(v.trim())
              .join(`{{${i + 1}}}`))
        );
      }

      body.text = template.body;
      body.example = {
        body_text: [variables?.map((v) => v.slice(2, -2)) || []],
      };
    } else {
      body.add_security_recommendation =
        template.body.addSecurityRecommendation;
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
      if (!Array.isArray(template.buttons))
        template.buttons = [template.buttons];

      if (template.buttons.filter((b) => b?.type === "UrlButton").length > 2)
        throw new Error("Max 2 URL buttons allowed");

      if (
        template.buttons.filter((b) => b?.type === "PhoneNumberButton").length >
        1
      )
        throw new Error("Max 1 phone number button allowed");

      template.buttons.map((button) => {
        switch (button?.type) {
          case "UrlButton":
            const variables = button.url.match(/\{\{(.*?)\}\}/g);
            variables &&
              variables.map(
                (v, i) =>
                  (button.url = button.url.split(v.trim()).join(`{{${i + 1}}}`))
              );
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
  public async sendMessage(
    to: string,
    text: string,
    options?: z.infer<typeof sendMessageOptionsSchema>
  ): Promise<string> {
    const validation = sendMessageSchema.safeParse({ to, text, options });

    if (!validation.success) {
      this.formatZodError(validation.error);
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
    if (data.buttons && !Array.isArray(data.buttons))
      buttonArray = [data.buttons];
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

  public async sendTemplate(
    to: string,
    template: z.infer<typeof SendTemplateSchema>,
    options?: { messageID: string }
  ) {
    const validation = SendTemplateSchema.safeParse(template);
    if (!validation.success) this.formatZodError(validation.error);

    if (!Array.isArray(template.body)) template.body = [template.body];
    if (!Array.isArray(template?.buttons))
      template.buttons = [template.buttons];

    return await this._sendMessage({
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
          template?.header && {
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
                            ...(template.header.type === "LOCATION" && {
                              ...((obj: { [key: string]: string }) => {
                                delete obj["type"];
                                return obj;
                              })(template.header),
                            }),
                            ...(template.header.type !== "LOCATION" && {
                              ...(template.header.media.startsWith("http") && {
                                link: template.header.media,
                              }),
                              ...(isNaN(Number(template.header.media)) &&
                                !template.header.media.startsWith("http") && {
                                  id: await this.uploadMedia(
                                    template.header.media
                                  ),
                                }),
                              ...(Number(template.header.media) && {
                                id: template.header.media,
                              }),
                            }),
                          },
                        },
                      ],
                    }),
              },
            ],
          },
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
          template?.buttons &&
            template?.buttons.map((p, i) => {
              let d: any = { type: "button" };
              switch (p?.type) {
                case "QuickReplyButton":
                  d = {
                    ...d,
                    sub_type: "quick_reply",
                    index: i,
                    parameters: [{ type: "payload", payload: p.text }],
                  };
                  break;

                case "UrlButton":
                  d = {
                    ...d,
                    sub_type: "url",
                    index: i,
                    text: p.title,
                    url: p.url,
                  };

                default:
                  break;
              }
            }),
        ],
      },
    });
  }

  // public async updateCommerceSettings(settings: CommerceSettings) {
  //   if (!settings.isCartEnabled && !settings.isCatalogVisible) {
  //     throw new Error("At least one setting must be provided");
  //   }
  //   const data = {
  //     is_cart_enabled: settings.isCartEnabled,
  //     is_catalog_visible: settings.isCatalogVisible,
  //   };

  //   // add type UpdateCommerceSettingsResponse to makeRequest funtion

  //   return await this.makeRequest({
  //     method: "POST",
  //     url: `/${this.phoneID}/whatsapp_commerce_settings`,
  //     params: data,
  //   });
  // }

  // public async getCommerceSettings() {
  //   return await this.makeRequest<{
  //     data: CommerceSettings & { catalog_id: string }[];
  //   }>({
  //     method: "GET",
  //     url: `/${this.phoneID}/whatsapp_commerce_settings`,
  //   });
  // }

  // נבדק
  // הוספת טיפול מותאם אישית בשגיאות
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
          case [
            132000, 132001, 132005, 132007, 132012, 132015, 132016, 132068,
            132069,
          ].includes(code):
            throw new TemplateError(code, message, fbtrace_id, type, details);
          case [
            133000, 133004, 133005, 133006, 133008, 133009, 133010, 133015,
          ].includes(code):
            throw new RegistrationError(
              code,
              message,
              fbtrace_id,
              type,
              details
            );
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
  private async _sendMessage(content: object) {
    return await this.makeRequest<SendMessageResponse | isSuccessResponse>({
      method: "POST",
      url: `/${this.phoneID}/messages`,
      data: {
        ...this.commonKeys,
        ...content,
      },
    });
  }
  public async getPhoneNumbers(): Promise<getPhoneNumbers> {
    if (!this.options?.businessAccountID)
      throw new Error("You must provide a business account to getPhoneNumbers");

    return await this.makeRequest<getPhoneNumbers>({
      method: "GET",
      url: `/${this.options?.businessAccountID}/phone_numbers/`,
    });
  }
  public async getPhoneData(): Promise<GetPhoneDataReturn> {
    const r = await this.makeRequest<GetPhoneNumberByID>({
      method: "GET",
      url: `/${this.phoneID}/`,
    });
    return {
      verifiedName: r.verified_name,
      phoneNumber: r.display_phone_number,
      qualityRating: r.quality_rating,
      platformType: r.quality_rating,
      phoneNumberID: r.id,
    };
  }

  public async getNameStatus(): Promise<getDisplayNameStatus> {
    return await this.makeRequest<getDisplayNameStatus>({
      method: "GET",
      url: `/${this.phoneID}/`,
      params: { fields: "name_status" },
    });
  }
  public async getAllSubscriptions(): Promise<GetAllSubscriptions[]> {
    if (!this.options?.businessAccountID)
      throw new Error(
        "You must provide a business account to getAllSubscriptions"
      );

    return (
      await this.makeRequest<{ data: GetAllSubscriptions[] }>({
        method: "GET",
        url: `/${this.options?.businessAccountID}/subscribed_apps/`,
      })
    ).data;
  }
  public async deleteMedia(mediaID: string | number): Promise<boolean> {
    return (
      await this.makeRequest<isSuccessResponse>({
        method: "DELETE",
        url: `/${mediaID.toString()}`,
        params: { phone_number_id: this.phoneID },
      })
    ).success;
  }
  public async markMessageAsRead(messageID: string): Promise<boolean> {
    const data = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageID,
    };
    return ((await this._sendMessage(data)) as isSuccessResponse).success;
  }
  public async sendReaction(
    to: string,
    emoji: string,
    messageID: string
  ): Promise<string> {
    const data = {
      to,
      type: "reaction",
      reaction: {
        message_id: messageID,
        emoji,
      },
    };

    return ((await this._sendMessage(data)) as SendMessageResponse).messages[0]
      .id;
  }
  public async removeReaction(to: string, messageID: string): Promise<string> {
    return await this.sendReaction(to, messageID, "");
  }
  public async sendLocation(
    to: string,
    location: { latitude: number | string; longitude: number | string },
    options?: { name?: string; address?: string; messageID?: string }
  ): Promise<string> {
    if (!location.latitude || !location.longitude)
      throw new Error("location is must");
    const data = {
      to,
      ...(options?.messageID && { context: { message_id: options.messageID } }),
      type: "location",
      location: {
        ...location,
        ...options,
      },
    };
    return ((await this._sendMessage(data)) as SendMessageResponse).messages[0]
      .id;
  }
  async getBusinessProfile(): Promise<
    Omit<WhatsAppProfileData, "messaging_product">
  > {
    const fields = [
      "about",
      "address",
      "description",
      "email",
      "profile_picture_url",
      "websites",
      "vertical",
    ];

    return (
      await this.makeRequest<{ data: WhatsAppProfileData[] }>({
        method: "GET",
        url: `/${this.phoneID}/whatsapp_business_profile?fields=${fields.join(
          ","
        )}`,
      })
    ).data.map((p) => {
      delete p.messaging_product;
      return p;
    })[0];
  }
  async registerPhoneNumber(
    pin: string,
    dataLocalizationRegion?:
      | "AU"
      | "ID"
      | "IN"
      | "JP"
      | "SG"
      | "KR"
      | "DE"
      | "CH"
      | "GB"
      | "BR"
      | "BH"
      | "ZA"
      | "CA"
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

  async sendSticker(
    to: string,
    sticker: string,
    options?: { messageID: string }
  ): Promise<string> {
    return await this.sendMedia("STICKER", to, sticker, options);
  }
  async sendVideo(
    to: string,
    video: string,
    options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">
  ): Promise<string> {
    return await this.sendMedia("VIDEO", to, video, options);
  }
  async sendDocument(
    to: string,
    document: string,
    options?: z.infer<typeof sendMediaInteractiveSchema>
  ): Promise<string> {
    return await this.sendMedia("DOCUMENT", to, document, options);
  }

  async sendAudio(
    to: string,
    audio: string,
    options?: { messageID: string }
  ): Promise<string> {
    return await this.sendMedia("AUDIO", to, audio, options);
  }
  private async sendMedia(
    type: "IMAGE" | "VIDEO" | "DOCUMENT" | "STICKER" | "AUDIO",
    to: string,
    media: string,
    options?: z.infer<typeof sendMediaInteractiveSchema>
  ): Promise<string> {
    const validation = await sendMediaInteractiveSchema.safeParse(options);
    if (!validation.success) this.formatZodError(validation.error);

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
            ...(type === "DOCUMENT" &&
              options?.filename && { filename: options?.filename }),
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
              ...(type === "DOCUMENT" &&
                options?.filename && { filename: options?.filename }),
            },
          },
        }
      );
    }
  }

  async sendImage(
    to: string,
    image: string,
    options?: Omit<z.infer<typeof sendMediaInteractiveSchema>, "filename">
  ) {
    return await this.sendMedia("IMAGE", to, image, options);
  }

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

    if (!validation.success) this.formatZodError(validation.error);

    return (
      (await this._sendMessage({
        to,
        ...(options?.messageID && {
          context: { message_id: options.messageID },
        }),
        type: "contacts",
        contacts: [
          {
            name:
              typeof name === "string"
                ? { first_name: name, formatted_name: name }
                : name,
            phones:
              typeof phone === "string"
                ? { phone: "+" + phone }
                : !Array.isArray(phone)
                ? [phone]
                : phone,
            ...(options?.birthday && { birthday: options.birthday }),
            ...(options?.Org && { org: options.Org }),
            ...(options?.emails && {
              emails: !Array.isArray(options.emails)
                ? [options.emails]
                : options.emails,
            }),
            ...(options?.addresses && {
              addresses: !Array.isArray(options.addresses)
                ? [options.addresses]
                : options.addresses,
            }),
            ...(options?.urls && {
              urls: !Array.isArray(options.urls)
                ? [options.urls]
                : options.urls,
            }),
          },
        ],
      })) as SendMessageResponse
    ).messages[0].id;
  }

  public async sendRowRequest<T>(obj: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    endpoint: string;
    data?: object;
    headers?: object;
  }) {
    return await this.makeRequest<T>({ ...obj, url: obj.endpoint });
  }

  private async _setCallBackUrl(
    callbackUrl: string,
    appID: string,
    appSecret: string
  ): Promise<{ success: boolean }> {
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

    return await this.makeRequest<{ success: boolean }>({
      method: "POST",
      url: `/${appID}/subscriptions`,
      params: {
        object: "whatsapp_business_account",
        callback_url: callbackUrl + "/" + this.options.webHookEndpoint || "",
        verify_token: this.verifyToken,
        access_token: getAppAcsessToken.access_token,
        fields: ["message_template_status_update", "messages"].join(","),
      },
    });
  }

  async updateBusinessProfile(
    info: z.infer<typeof UpdateBusinessProfileSchema>
  ): Promise<isSuccessResponse> {
    const validation = UpdateBusinessProfileSchema.safeParse(info);

    if (!validation.success) {
      this.formatZodError(validation.error);
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
}
