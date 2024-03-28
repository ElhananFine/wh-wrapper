/// <reference types="node" />
import { ClientOptions, GetPhoneDataReturn, HomeWork, LocationType, MediaBase, ReactionType } from "./shared";
export type Metadata = {
    displayPhoneNumber: string;
    phoneNumberID: string;
};
export type FromUser = {
    name?: string;
    WhID: string;
};
export type Context = {
    messageFrom: string;
    messageID: string;
};
export type Image = Omit<MediaBase, "mime_type"> & {
    mimeType: string;
    caption?: string;
};
export type Video = Omit<MediaBase, "mime_type"> & {
    mimeType: string;
    caption?: string;
};
export type Audio = Omit<MediaBase, "mime_type"> & {
    mimeType: string;
    voice?: boolean;
};
export type Sticker = Omit<MediaBase, "mime_type"> & {
    mimeType: string;
    animated?: boolean;
};
export type Document = Omit<MediaBase, "mime_type"> & {
    mimeType: string;
    fileName?: string;
    caption?: string;
};
export type Location = LocationType;
export type Reaction = Omit<ReactionType, "message_id"> & {
    messageID: string;
    type: "react" | "unReact";
};
export type Contacts = {
    name: {
        formattedName: string;
        firstName?: string;
        lastName?: string;
        middleName?: string;
    };
    phome: {
        phone: string;
        waID: String;
        type: HomeWork & "CELL";
    }[];
}[];
export type Error = {
    code: number;
    message: string;
    details?: string;
};
export type Options = ClientOptions;
export type GetPhoneData = GetPhoneDataReturn;
export type Media = {
    mimeType: string;
    fileSize: string;
    filePath?: string;
    fileBuffer?: Buffer;
};
