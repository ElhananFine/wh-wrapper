export type HeaderType = "text" | "document" | "image";
export interface InteractiveObject {
    type: "list" | "button";
    header: {
        type: HeaderType;
        text?: string;
    };
}
