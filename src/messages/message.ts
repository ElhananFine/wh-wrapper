import path from "path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  promises as fsPromises,
  constants as fsConstants,
} from "fs";
import Client from "../client/client";
import {
  Media,
  MessageType,
  Metadata,
  User,
  WhatsAppBusinessAccountObject,
  Location,
  Contact,
  Order,
  System,
  Reaction,
  ReplyToMessage,
  downloadMediaReturn,
  interactive,
} from "./messageType";
import {
  SendContacOptionSchema,
  SendTemplateSchema,
  nameSchema,
  phoneSchema,
  sendMediaInteractiveSchema,
  sendMessageOptionsSchema,
} from "../schemas/schema";
import * as z from "zod";

export default class Message {
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
  // errors?: WhError[] | undefined;

  ////////////////////////////////////////////////////////////////
  constructor(
    private client: Client,
    messageObject: WhatsAppBusinessAccountObject
  ) {
    if (!(client instanceof Client))
      throw new Error("Invalid client - must be instance of Client");

    const value = messageObject.entry[0].changes[0].value;

    console.log(JSON.stringify(value));

    this.id = value.messages[0].id;
    this.metadata = value.metadata;
    this.type = value.messages[0].type;
    this.fromUser = value.contacts[0];
    this.sender = this.fromUser.wa_id;
    this.timestamp = new Date(+value.messages[0].timestamp * 1000);
    this.isReply = !!value.messages[0].context;
    if (value.messages[0].context)
      this.replyToMessage = {
        messageID: value.messages[0].context?.id,
        fromUserID: value.messages[0].context?.from,
        ...(value.messages[0].context?.referredProduct && {
          referredProduct: value.messages[0].context?.referredProduct,
        }),
      };
    this.forwarded =
      value.messages[0].context?.forwarded ||
      value.messages[0].context?.frequently_forwarded ||
      false;
    this.forwardedManyTimes =
      value.messages[0].context?.frequently_forwarded || false;
    if (value.messages[0].text?.body) this.text = value.messages[0].text?.body;
    if (value.messages[0].interactive)
      this.interactive = value.messages[0].interactive;
    const mediaTypes = ["image", "video", "sticker", "document", "audio"];
    if (mediaTypes.includes(value.messages[0].type))
      this.media =
        value.messages[0][
          value.messages[0].type as
            | "image"
            | "video"
            | "sticker"
            | "document"
            | "audio"
        ];
    this.hasMedia = !!this.media;
    if (value.messages[0].reaction) this.reaction = value.messages[0].reaction;
    if (value.messages[0].location) this.location = value.messages[0].location;
    if (value.messages[0].contacts) this.contacts = value.messages[0].contacts;
    if (value.messages[0].order) this.order = value.messages[0].order;
    if (value.messages[0].system) this.system = value.messages[0].system;
    // this.errors = value.messages[0].errors;

    Object.defineProperty(this, "client", { enumerable: false });
  }

  async downloadMedia(options?: {
    saveInDisk?: boolean;
    fileName?: string;
    folderPath?: string;
  }) {
    if (!this.hasMedia) throw new Error("There is no media in the message");

    try {
      const linkRequest = await this.client.makeRequest<{
        messaging_product: "whatsapp";
        url: string;
        mime_type: string;
        sha256: string;
        file_size: string;
        id: string;
      }>({
        method: "GET",
        url: `${this.client.url}/${this.media!.id}`,
        params: { phone_number_id: this.metadata.phone_number_id },
      });

      const fileRequest: string = await this.client.makeRequest({
        method: "GET",
        url: linkRequest.url.trim(),
        responseType: "arraybuffer",
      });

      const base64 = Buffer.from(fileRequest, "binary").toString("base64");

      const returnValues: Partial<downloadMediaReturn> = {
        mimeType: linkRequest.mime_type,
        fileSize: linkRequest.file_size,
        fileName: this.media?.filename || "default-file-name",
        mediaID: linkRequest.id,
      };

      if (options?.saveInDisk) {
        const dirPath =
          options.folderPath || path.join(__dirname, "../../files");

        if (!existsSync(dirPath)) mkdirSync(dirPath);

        try {
          await fsPromises.access(dirPath, fsConstants.R_OK);
          const fileName = path.join(
            dirPath,
            `${
              options?.fileName?.replace(/[\/\\:*?"<>|]/g, "") ||
              this.media?.filename + "-" + linkRequest.id
            }.${linkRequest.mime_type.split("/")[1]}`
          );
          writeFileSync(fileName, base64, "base64");

          returnValues.path = fileName;
        } catch (e) {
          throw new Error("אין הרשאת כתיבה לתיקייה");
        }
      } else {
        returnValues.base64 = base64;
      }

      return returnValues;
    } catch (e) {
      throw e;
    }
  }

  async replyText(
    text: string,
    options?: Omit<z.infer<typeof sendMessageOptionsSchema>, "messageID">
  ): Promise<string> {
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

  async replyTemplate(template: z.infer<typeof SendTemplateSchema>) {
    return await this.client.sendTemplate(
      this.sender,
      {
        name: "",
        language: "ENGLISH_US",
        body: [
          "הנחה",
          "הנחה שניה",
          { currency: "VALUE", code: "USD", amount: 1550 },
          { dateTime: "DATE" },
        ],
        // body: "str",
      },
      { messageID: this.id }
    );
  }

  async react(emoji: string): Promise<string> {
    return await this.client.sendReaction(this.sender, emoji, this.id);
  }
  async unreact(): Promise<string> {
    return await this.client.removeReaction(this.sender, this.id);
  }
  async markMessageAsRead(): Promise<boolean> {
    return await this.client.markMessageAsRead(this.id);
  }
}
