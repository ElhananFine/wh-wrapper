import path from "path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  promises as fsPromises,
  constants as fsConstants,
} from "fs";
import Client from "../client/client";
import { BaseHandler } from "./base-handler";
import { MessageType, MessageValueType } from "../types/whatsapp-types";
import {
  Image,
  Sticker,
  Video,
  Document,
  Audio,
  Location,
  Reaction,
  Contacts,
  Error,
} from "../types/exports-types";

type MessageTypes = Exclude<
  MessageType,
  "order" | "system" | "interactive" | "request_welcome" | "errors"
>;
/** @constructor */
export default class Message extends BaseHandler {
  type: MessageTypes;
  timestamp: Date;
  forwarded: boolean;
  forwardedManyTimes?: boolean;
  isReply: boolean;
  hasMedia: boolean;
  text?: string;
  image?: Image;
  video?: Video;
  sticker?: Sticker;
  document?: Document;
  audio?: Audio;
  location?: Location;
  reaction?: Reaction;
  contacts?: Contacts;
  error?: Error;
  constructor(client: Client, value: MessageValueType<"messages">) {
    if (!(client instanceof Client))
      throw new Error("Invalid client - must be instance of Client");
    super(client, value);
    this.type = value.messages[0].type as MessageTypes;
    this.timestamp = new Date(+value.messages[0].timestamp);
    this.forwarded =
      value.messages[0].context?.forwarded ||
      value.messages[0].context?.frequently_forwarded ||
      false;
    if (this.forwarded)
      this.forwardedManyTimes =
        value.messages[0].context?.frequently_forwarded || false;
    this.isReply = !!value.messages[0].context;
    this.hasMedia = ["image", "video", "sticker", "document", "audio"].includes(
      // @ts-ignore
      this.type
    );

    switch (this.type) {
      case "text":
        this.text = value.messages[0].text?.body;
        break;
      case "image":
        this.image = Object.fromEntries(
          Object.entries(value.messages[0].image!)
            .filter(([key]) => key !== "mime_type")
            .concat([["mimeType", value.messages[0].image!.mime_type]])
        ) as Image;
        break;
      case "video":
        this.video = Object.fromEntries(
          Object.entries(value.messages[0].video!)
            .filter(([key]) => key !== "mime_type")
            .concat([["mimeType", value.messages[0].video!.mime_type]])
        ) as Video;
        break;
      case "sticker":
        this.sticker = Object.fromEntries(
          Object.entries(value.messages[0].sticker!)
            .filter(([key]) => key !== "mime_type")
            .concat([["mimeType", value.messages[0].sticker!.mime_type]])
        ) as Sticker;
        break;
      case "document":
        this.document = Object.fromEntries(
          Object.entries(value.messages[0].document!)
            .filter(([key]) => key !== "mime_type")
            .concat([["mimeType", value.messages[0].document!.mime_type]])
        ) as Document;
        break;
      case "audio":
        this.audio = Object.fromEntries(
          Object.entries(value.messages[0].audio!)
            .filter(([key]) => key !== "mime_type")
            .concat([["mimeType", value.messages[0].audio!.mime_type]])
        ) as Audio;
        break;
      case "location":
        this.location = { ...value.messages[0]!.location } as Location;
        break;
      case "reaction":
        this.reaction = {
          messageID: value.messages[0].reaction!.message_id,
          ...(value.messages[0].reaction!.emoji
            ? { emoji: value.messages[0].reaction!.emoji, type: "react" }
            : { type: "unReact" }),
        };
        break;
      case "unsupported":
        this.error = {
          code: value.messages[0].errors![0].code,
          message: value.messages[0].errors![0].message,
          ...(value.messages[0].errors![0].error_data && {
            details: value.messages[0].errors![0].error_data.details,
          }),
        };
        break;
      case "contacts":
        this.contacts = value.messages[0].contacts!.map((contact) => ({
          name: {
            formattedName: contact.name.formatted_name,
            ...(contact.name.first_name && {
              firstName: contact.name.first_name,
            }),
            ...(contact.name.last_name && {
              lastName: contact.name.last_name,
            }),
            ...(contact.name.middle_name && {
              middleName: contact.name.middle_name,
            }),
          },
          phome: contact.phones.map((phone) => ({
            phone: phone.phone,
            type: phone.type,
            waID: phone.WhId,
          })),
        }));
        break;
    }
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
        url: `${this.client.url}/${this[this.type]!.id}`,
        params: { phone_number_id: this.metadata.phoneNumberID },
      });

      const fileRequest: string = await this.client.makeRequest({
        method: "GET",
        url: linkRequest.url.trim(),
        responseType: "arraybuffer",
      });

      const base64 = Buffer.from(fileRequest, "binary").toString("base64");

      const returnValues: any = {
        mimeType: linkRequest.mime_type,
        fileSize: linkRequest.file_size,
        ...(this.type === "document" && { fileName: this[this.type].filename }),
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
              this[this.type].filename + "-" + linkRequest.id
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

  async markMessageAsRead(): Promise<boolean> {
    return await this.client.markMessageAsRead(this.id);
  }
}
