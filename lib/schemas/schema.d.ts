import * as z from "zod";
import { WhatsAppProfileVertical } from "../types/shared";
export declare const Language: {
    readonly AFRIKAANS: "af";
    readonly ALBANIAN: "sq";
    readonly ARABIC: "ar";
    readonly AZERBAIJANI: "az";
    readonly BENGALI: "bn";
    readonly BULGARIAN: "bg";
    readonly CATALAN: "ca";
    readonly CHINESE_CHN: "zh_CN";
    readonly CHINESE_HKG: "zh_HK";
    readonly CHINESE_TAI: "zh_TW";
    readonly CROATIAN: "hr";
    readonly CZECH: "cs";
    readonly DANISH: "da";
    readonly DUTCH: "nl";
    readonly ENGLISH: "en";
    readonly ENGLISH_UK: "en_GB";
    readonly ENGLISH_US: "en_US";
    readonly ESTONIAN: "et";
    readonly FILIPINO: "fil";
    readonly FINNISH: "fi";
    readonly FRENCH: "fr";
    readonly GEORGIAN: "ka";
    readonly GERMAN: "de";
    readonly GREEK: "el";
    readonly GUJARATI: "gu";
    readonly HAUSA: "ha";
    readonly HEBREW: "he";
    readonly HINDI: "hi";
    readonly HUNGARIAN: "hu";
    readonly INDONESIAN: "id";
    readonly IRISH: "ga";
    readonly ITALIAN: "it";
    readonly JAPANESE: "ja";
    readonly KANNADA: "kn";
    readonly KAZAKH: "kk";
    readonly KINYARWANDA: "rw_RW";
    readonly KOREAN: "ko";
    readonly KYRGYZ_KYRGYZSTAN: "ky_KG";
    readonly LAO: "lo";
    readonly LATVIAN: "lv";
    readonly LITHUANIAN: "lt";
    readonly MACEDONIAN: "mk";
    readonly MALAY: "ms";
    readonly MALAYALAM: "ml";
    readonly MARATHI: "mr";
    readonly NORWEGIAN: "nb";
    readonly PERSIAN: "fa";
    readonly POLISH: "pl";
    readonly PORTUGUESE_BR: "pt_BR";
    readonly PORTUGUESE_POR: "pt_PT";
    readonly PUNJABI: "pa";
    readonly ROMANIAN: "ro";
    readonly RUSSIAN: "ru";
    readonly SERBIAN: "sr";
    readonly SLOVAK: "sk";
    readonly SLOVENIAN: "sl";
    readonly SPANISH: "es";
    readonly SPANISH_ARG: "es_AR";
    readonly SPANISH_SPA: "es_ES";
    readonly SPANISH_MEX: "es_MX";
    readonly SWAHILI: "sw";
    readonly SWEDISH: "sv";
    readonly TAMIL: "ta";
    readonly TELUGU: "te";
    readonly THAI: "th";
    readonly TURKISH: "tr";
    readonly UKRAINIAN: "uk";
    readonly URDU: "ur";
    readonly UZBEK: "uz";
    readonly VIETNAMESE: "vi";
    readonly ZULU: "zu";
};
export declare const sendMessageOptionsSchema: z.ZodObject<{
    previewUrl: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    messageID: z.ZodOptional<z.ZodString>;
    header: z.ZodOptional<z.ZodString>;
    footer: z.ZodOptional<z.ZodString>;
    buttons: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        title: z.ZodString;
        callbackData: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        callbackData: string;
    }, {
        title: string;
        callbackData: string;
    }>, z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        callbackData: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        callbackData: string;
    }, {
        title: string;
        callbackData: string;
    }>, "many">, z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
    }, {
        title: string;
        url: string;
    }>, z.ZodObject<{
        buttonTitle: z.ZodString;
        sections: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            rows: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                callbackData: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }, {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            title: string;
            rows: {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }[];
        }, {
            title: string;
            rows: {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        buttonTitle: string;
        sections: {
            title: string;
            rows: {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }[];
        }[];
    }, {
        buttonTitle: string;
        sections: {
            title: string;
            rows: {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }[];
        }[];
    }>]>>;
}, "strip", z.ZodTypeAny, {
    previewUrl?: boolean | undefined;
    messageID?: string | undefined;
    header?: string | undefined;
    footer?: string | undefined;
    buttons?: {
        title: string;
        callbackData: string;
    } | {
        title: string;
        callbackData: string;
    }[] | {
        title: string;
        url: string;
    } | {
        buttonTitle: string;
        sections: {
            title: string;
            rows: {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }[];
        }[];
    } | undefined;
}, {
    previewUrl?: boolean | undefined;
    messageID?: string | undefined;
    header?: string | undefined;
    footer?: string | undefined;
    buttons?: {
        title: string;
        callbackData: string;
    } | {
        title: string;
        callbackData: string;
    }[] | {
        title: string;
        url: string;
    } | {
        buttonTitle: string;
        sections: {
            title: string;
            rows: {
                title: string;
                callbackData: string;
                description?: string | undefined;
            }[];
        }[];
    } | undefined;
}>;
export declare const sendMediaInteractiveSchema: z.ZodOptional<z.ZodObject<{
    buttons: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        title: z.ZodString;
        callbackData: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        callbackData: string;
    }, {
        title: string;
        callbackData: string;
    }>, z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        callbackData: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        callbackData: string;
    }, {
        title: string;
        callbackData: string;
    }>, "many">, z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
    }, {
        title: string;
        url: string;
    }>]>>;
    footer: z.ZodOptional<z.ZodString>;
    messageID: z.ZodOptional<z.ZodString>;
    capiton: z.ZodOptional<z.ZodString>;
    filename: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    messageID?: string | undefined;
    footer?: string | undefined;
    buttons?: {
        title: string;
        callbackData: string;
    } | {
        title: string;
        callbackData: string;
    }[] | {
        title: string;
        url: string;
    } | undefined;
    capiton?: string | undefined;
    filename?: string | undefined;
}, {
    messageID?: string | undefined;
    footer?: string | undefined;
    buttons?: {
        title: string;
        callbackData: string;
    } | {
        title: string;
        callbackData: string;
    }[] | {
        title: string;
        url: string;
    } | undefined;
    capiton?: string | undefined;
    filename?: string | undefined;
}>>;
export declare const sendMessageSchema: z.ZodObject<{
    to: z.ZodString;
    text: z.ZodString;
    options: z.ZodOptional<z.ZodObject<{
        previewUrl: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        messageID: z.ZodOptional<z.ZodString>;
        header: z.ZodOptional<z.ZodString>;
        footer: z.ZodOptional<z.ZodString>;
        buttons: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            title: z.ZodString;
            callbackData: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            title: string;
            callbackData: string;
        }, {
            title: string;
            callbackData: string;
        }>, z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            callbackData: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            title: string;
            callbackData: string;
        }, {
            title: string;
            callbackData: string;
        }>, "many">, z.ZodObject<{
            title: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            title: string;
            url: string;
        }, {
            title: string;
            url: string;
        }>, z.ZodObject<{
            buttonTitle: z.ZodString;
            sections: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                rows: z.ZodArray<z.ZodObject<{
                    title: z.ZodString;
                    callbackData: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }, {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }, {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            buttonTitle: string;
            sections: {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }[];
        }, {
            buttonTitle: string;
            sections: {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }[];
        }>]>>;
    }, "strip", z.ZodTypeAny, {
        previewUrl?: boolean | undefined;
        messageID?: string | undefined;
        header?: string | undefined;
        footer?: string | undefined;
        buttons?: {
            title: string;
            callbackData: string;
        } | {
            title: string;
            callbackData: string;
        }[] | {
            title: string;
            url: string;
        } | {
            buttonTitle: string;
            sections: {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }[];
        } | undefined;
    }, {
        previewUrl?: boolean | undefined;
        messageID?: string | undefined;
        header?: string | undefined;
        footer?: string | undefined;
        buttons?: {
            title: string;
            callbackData: string;
        } | {
            title: string;
            callbackData: string;
        }[] | {
            title: string;
            url: string;
        } | {
            buttonTitle: string;
            sections: {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }[];
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    text: string;
    to: string;
    options?: {
        previewUrl?: boolean | undefined;
        messageID?: string | undefined;
        header?: string | undefined;
        footer?: string | undefined;
        buttons?: {
            title: string;
            callbackData: string;
        } | {
            title: string;
            callbackData: string;
        }[] | {
            title: string;
            url: string;
        } | {
            buttonTitle: string;
            sections: {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }[];
        } | undefined;
    } | undefined;
}, {
    text: string;
    to: string;
    options?: {
        previewUrl?: boolean | undefined;
        messageID?: string | undefined;
        header?: string | undefined;
        footer?: string | undefined;
        buttons?: {
            title: string;
            callbackData: string;
        } | {
            title: string;
            callbackData: string;
        }[] | {
            title: string;
            url: string;
        } | {
            buttonTitle: string;
            sections: {
                title: string;
                rows: {
                    title: string;
                    callbackData: string;
                    description?: string | undefined;
                }[];
            }[];
        } | undefined;
    } | undefined;
}>;
export declare const UpdateBusinessProfileSchema: z.ZodObject<{
    about: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    industry: z.ZodNativeEnum<typeof WhatsAppProfileVertical>;
    profilePictureHandle: z.ZodOptional<z.ZodString>;
    websites: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    industry: WhatsAppProfileVertical;
    description?: string | undefined;
    about?: string | undefined;
    address?: string | undefined;
    email?: string | undefined;
    profilePictureHandle?: string | undefined;
    websites?: string[] | undefined;
}, {
    industry: WhatsAppProfileVertical;
    description?: string | undefined;
    about?: string | undefined;
    address?: string | undefined;
    email?: string | undefined;
    profilePictureHandle?: string | undefined;
    websites?: string[] | undefined;
}>;
export declare const CreateTempleteSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<["AUTHENTICATION", "MARKETING", "UTILITY"]>;
    language: z.ZodEnum<["AFRIKAANS", "ALBANIAN", "ARABIC", "AZERBAIJANI", "BENGALI", "BULGARIAN", "CATALAN", "CHINESE_CHN", "CHINESE_HKG", "CHINESE_TAI", "CROATIAN", "CZECH", "DANISH", "DUTCH", "ENGLISH", "ENGLISH_UK", "ENGLISH_US", "ESTONIAN", "FILIPINO", "FINNISH", "FRENCH", "GEORGIAN", "GERMAN", "GREEK", "GUJARATI", "HAUSA", "HEBREW", "HINDI", "HUNGARIAN", "INDONESIAN", "IRISH", "ITALIAN", "JAPANESE", "KANNADA", "KAZAKH", "KINYARWANDA", "KOREAN", "KYRGYZ_KYRGYZSTAN", "LAO", "LATVIAN", "LITHUANIAN", "MACEDONIAN", "MALAY", "MALAYALAM", "MARATHI", "NORWEGIAN", "PERSIAN", "POLISH", "PORTUGUESE_BR", "PORTUGUESE_POR", "PUNJABI", "ROMANIAN", "RUSSIAN", "SERBIAN", "SLOVAK", "SLOVENIAN", "SPANISH", "SPANISH_ARG", "SPANISH_SPA", "SPANISH_MEX", "SWAHILI", "SWEDISH", "TAMIL", "TELUGU", "THAI", "TURKISH", "UKRAINIAN", "URDU", "UZBEK", "VIETNAMESE", "ZULU"]>;
    allowCategoryChange: z.ZodOptional<z.ZodBoolean>;
    header: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"TEXT">;
        text: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        type: "TEXT";
    }, {
        text: string;
        type: "TEXT";
    }>, z.ZodObject<{
        type: z.ZodEnum<["IMAGE", "DOCUMENT", "VIDEO"]>;
        media: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    }, {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"LOCATION">;
    }, "strip", z.ZodTypeAny, {
        type: "LOCATION";
    }, {
        type: "LOCATION";
    }>]>>;
    body: z.ZodUnion<[z.ZodString, z.ZodObject<{
        codeExpirationMinutes: z.ZodNumber;
        addSecurityRecommendation: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        codeExpirationMinutes: number;
        addSecurityRecommendation: boolean;
    }, {
        codeExpirationMinutes: number;
        addSecurityRecommendation?: boolean | undefined;
    }>]>;
    footer: z.ZodOptional<z.ZodString>;
    buttons: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"UrlButton">;
        title: z.ZodEffects<z.ZodString, string, string>;
        url: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "UrlButton";
        url: string;
    }, {
        title: string;
        type: "UrlButton";
        url: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"PhoneNumberButton">;
        title: z.ZodString;
        phoneNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"QuickReplyButton">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        type: "QuickReplyButton";
    }, {
        text: string;
        type: "QuickReplyButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CopyCodeButton">;
        example: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "CopyCodeButton";
        example: string;
    }, {
        type: "CopyCodeButton";
        example: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"MPMButton">;
    }, "strip", z.ZodTypeAny, {
        type: "MPMButton";
    }, {
        type: "MPMButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CatalogButton">;
    }, "strip", z.ZodTypeAny, {
        type: "CatalogButton";
    }, {
        type: "CatalogButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"OTPButton">;
        OTPType: z.ZodEnum<["COPY_CODE", "ONE_TAP", "ZERO_TAP"]>;
        title: z.ZodOptional<z.ZodString>;
        autofillText: z.ZodOptional<z.ZodString>;
        packageName: z.ZodOptional<z.ZodString>;
        signatureHash: z.ZodOptional<z.ZodString>;
        zeroTapTermsAccepted: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }>>]>>, z.ZodArray<z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"UrlButton">;
        title: z.ZodEffects<z.ZodString, string, string>;
        url: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "UrlButton";
        url: string;
    }, {
        title: string;
        type: "UrlButton";
        url: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"PhoneNumberButton">;
        title: z.ZodString;
        phoneNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"QuickReplyButton">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        type: "QuickReplyButton";
    }, {
        text: string;
        type: "QuickReplyButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CopyCodeButton">;
        example: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "CopyCodeButton";
        example: string;
    }, {
        type: "CopyCodeButton";
        example: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"MPMButton">;
    }, "strip", z.ZodTypeAny, {
        type: "MPMButton";
    }, {
        type: "MPMButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CatalogButton">;
    }, "strip", z.ZodTypeAny, {
        type: "CatalogButton";
    }, {
        type: "CatalogButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"OTPButton">;
        OTPType: z.ZodEnum<["COPY_CODE", "ONE_TAP", "ZERO_TAP"]>;
        title: z.ZodOptional<z.ZodString>;
        autofillText: z.ZodOptional<z.ZodString>;
        packageName: z.ZodOptional<z.ZodString>;
        signatureHash: z.ZodOptional<z.ZodString>;
        zeroTapTermsAccepted: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }>>]>>, "many">]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    category: "AUTHENTICATION" | "MARKETING" | "UTILITY";
    language: "AFRIKAANS" | "ALBANIAN" | "ARABIC" | "AZERBAIJANI" | "BENGALI" | "BULGARIAN" | "CATALAN" | "CHINESE_CHN" | "CHINESE_HKG" | "CHINESE_TAI" | "CROATIAN" | "CZECH" | "DANISH" | "DUTCH" | "ENGLISH" | "ENGLISH_UK" | "ENGLISH_US" | "ESTONIAN" | "FILIPINO" | "FINNISH" | "FRENCH" | "GEORGIAN" | "GERMAN" | "GREEK" | "GUJARATI" | "HAUSA" | "HEBREW" | "HINDI" | "HUNGARIAN" | "INDONESIAN" | "IRISH" | "ITALIAN" | "JAPANESE" | "KANNADA" | "KAZAKH" | "KINYARWANDA" | "KOREAN" | "KYRGYZ_KYRGYZSTAN" | "LAO" | "LATVIAN" | "LITHUANIAN" | "MACEDONIAN" | "MALAY" | "MALAYALAM" | "MARATHI" | "NORWEGIAN" | "PERSIAN" | "POLISH" | "PORTUGUESE_BR" | "PORTUGUESE_POR" | "PUNJABI" | "ROMANIAN" | "RUSSIAN" | "SERBIAN" | "SLOVAK" | "SLOVENIAN" | "SPANISH" | "SPANISH_ARG" | "SPANISH_SPA" | "SPANISH_MEX" | "SWAHILI" | "SWEDISH" | "TAMIL" | "TELUGU" | "THAI" | "TURKISH" | "UKRAINIAN" | "URDU" | "UZBEK" | "VIETNAMESE" | "ZULU";
    body: string | {
        codeExpirationMinutes: number;
        addSecurityRecommendation: boolean;
    };
    header?: {
        text: string;
        type: "TEXT";
    } | {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    } | {
        type: "LOCATION";
    } | undefined;
    footer?: string | undefined;
    buttons?: {
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | ({
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | undefined)[] | undefined;
    allowCategoryChange?: boolean | undefined;
}, {
    name: string;
    category: "AUTHENTICATION" | "MARKETING" | "UTILITY";
    language: "AFRIKAANS" | "ALBANIAN" | "ARABIC" | "AZERBAIJANI" | "BENGALI" | "BULGARIAN" | "CATALAN" | "CHINESE_CHN" | "CHINESE_HKG" | "CHINESE_TAI" | "CROATIAN" | "CZECH" | "DANISH" | "DUTCH" | "ENGLISH" | "ENGLISH_UK" | "ENGLISH_US" | "ESTONIAN" | "FILIPINO" | "FINNISH" | "FRENCH" | "GEORGIAN" | "GERMAN" | "GREEK" | "GUJARATI" | "HAUSA" | "HEBREW" | "HINDI" | "HUNGARIAN" | "INDONESIAN" | "IRISH" | "ITALIAN" | "JAPANESE" | "KANNADA" | "KAZAKH" | "KINYARWANDA" | "KOREAN" | "KYRGYZ_KYRGYZSTAN" | "LAO" | "LATVIAN" | "LITHUANIAN" | "MACEDONIAN" | "MALAY" | "MALAYALAM" | "MARATHI" | "NORWEGIAN" | "PERSIAN" | "POLISH" | "PORTUGUESE_BR" | "PORTUGUESE_POR" | "PUNJABI" | "ROMANIAN" | "RUSSIAN" | "SERBIAN" | "SLOVAK" | "SLOVENIAN" | "SPANISH" | "SPANISH_ARG" | "SPANISH_SPA" | "SPANISH_MEX" | "SWAHILI" | "SWEDISH" | "TAMIL" | "TELUGU" | "THAI" | "TURKISH" | "UKRAINIAN" | "URDU" | "UZBEK" | "VIETNAMESE" | "ZULU";
    body: string | {
        codeExpirationMinutes: number;
        addSecurityRecommendation?: boolean | undefined;
    };
    header?: {
        text: string;
        type: "TEXT";
    } | {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    } | {
        type: "LOCATION";
    } | undefined;
    footer?: string | undefined;
    buttons?: {
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | ({
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | undefined)[] | undefined;
    allowCategoryChange?: boolean | undefined;
}>;
export declare const nameSchema: z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
    formatted_name: z.ZodString;
    first_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    middle_name: z.ZodOptional<z.ZodString>;
    suffix: z.ZodOptional<z.ZodString>;
    prefix: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    formatted_name: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
    middle_name?: string | undefined;
    suffix?: string | undefined;
    prefix?: string | undefined;
}, {
    formatted_name: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
    middle_name?: string | undefined;
    suffix?: string | undefined;
    prefix?: string | undefined;
}>, {
    formatted_name: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
    middle_name?: string | undefined;
    suffix?: string | undefined;
    prefix?: string | undefined;
}, {
    formatted_name: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
    middle_name?: string | undefined;
    suffix?: string | undefined;
    prefix?: string | undefined;
}>]>;
export declare const phoneSchema: z.ZodUnion<[z.ZodString, z.ZodObject<{
    phone: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["IPHONE", "CELL", "MAIN", "HOME", "WORK"]>>;
    waID: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
    phone?: string | undefined;
    waID?: string | undefined;
}, {
    type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
    phone?: string | undefined;
    waID?: string | undefined;
}>, z.ZodArray<z.ZodObject<{
    phone: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["IPHONE", "CELL", "MAIN", "HOME", "WORK"]>>;
    waID: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
    phone?: string | undefined;
    waID?: string | undefined;
}, {
    type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
    phone?: string | undefined;
    waID?: string | undefined;
}>, "many">]>;
export declare const SendContacOptionSchema: z.ZodObject<{
    messageID: z.ZodOptional<z.ZodString>;
    addresses: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodOptional<z.ZodString>;
        zip: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        country_code: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
    }, "strip", z.ZodTypeAny, {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    }, {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    }>, z.ZodArray<z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodOptional<z.ZodString>;
        zip: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        country_code: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
    }, "strip", z.ZodTypeAny, {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    }, {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    }>, "many">]>>;
    emails: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        email: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    }, {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    }>, z.ZodArray<z.ZodObject<{
        email: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    }, {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    }>, "many">]>>;
    urls: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        url: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    }, {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    }>, z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    }, {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    }>, "many">]>>;
    Org: z.ZodOptional<z.ZodObject<{
        company: z.ZodString;
        department: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        company: string;
        title?: string | undefined;
        department?: string | undefined;
    }, {
        company: string;
        title?: string | undefined;
        department?: string | undefined;
    }>>;
    birthday: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
}, "strip", z.ZodTypeAny, {
    messageID?: string | undefined;
    addresses?: {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    } | {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    }[] | undefined;
    emails?: {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    } | {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    }[] | undefined;
    urls?: {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    } | {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    }[] | undefined;
    Org?: {
        company: string;
        title?: string | undefined;
        department?: string | undefined;
    } | undefined;
    birthday?: string | undefined;
}, {
    messageID?: string | undefined;
    addresses?: {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    } | {
        street: string;
        city: string;
        type?: "HOME" | "WORK" | undefined;
        state?: string | undefined;
        zip?: string | undefined;
        country?: string | undefined;
        country_code?: string | undefined;
    }[] | undefined;
    emails?: {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    } | {
        email: string;
        type?: "HOME" | "WORK" | undefined;
    }[] | undefined;
    urls?: {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    } | {
        url: string;
        type?: "HOME" | "WORK" | undefined;
    }[] | undefined;
    Org?: {
        company: string;
        title?: string | undefined;
        department?: string | undefined;
    } | undefined;
    birthday?: string | undefined;
}>;
export declare const SendContacSchema: z.ZodObject<{
    to: z.ZodString;
    name: z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodObject<{
        formatted_name: z.ZodString;
        first_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        middle_name: z.ZodOptional<z.ZodString>;
        suffix: z.ZodOptional<z.ZodString>;
        prefix: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        formatted_name: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        middle_name?: string | undefined;
        suffix?: string | undefined;
        prefix?: string | undefined;
    }, {
        formatted_name: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        middle_name?: string | undefined;
        suffix?: string | undefined;
        prefix?: string | undefined;
    }>, {
        formatted_name: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        middle_name?: string | undefined;
        suffix?: string | undefined;
        prefix?: string | undefined;
    }, {
        formatted_name: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        middle_name?: string | undefined;
        suffix?: string | undefined;
        prefix?: string | undefined;
    }>]>;
    phones: z.ZodUnion<[z.ZodString, z.ZodObject<{
        phone: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["IPHONE", "CELL", "MAIN", "HOME", "WORK"]>>;
        waID: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    }, {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    }>, z.ZodArray<z.ZodObject<{
        phone: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["IPHONE", "CELL", "MAIN", "HOME", "WORK"]>>;
        waID: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    }, {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    }>, "many">]>;
    options: z.ZodObject<{
        messageID: z.ZodOptional<z.ZodString>;
        addresses: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            street: z.ZodString;
            city: z.ZodString;
            state: z.ZodOptional<z.ZodString>;
            zip: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            country_code: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
        }, "strip", z.ZodTypeAny, {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }, {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }>, z.ZodArray<z.ZodObject<{
            street: z.ZodString;
            city: z.ZodString;
            state: z.ZodOptional<z.ZodString>;
            zip: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            country_code: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
        }, "strip", z.ZodTypeAny, {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }, {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }>, "many">]>>;
        emails: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            email: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }, {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }>, z.ZodArray<z.ZodObject<{
            email: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }, {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }>, "many">]>>;
        urls: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            url: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }, {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }>, z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<["WORK", "HOME"]>>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }, {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }>, "many">]>>;
        Org: z.ZodOptional<z.ZodObject<{
            company: z.ZodString;
            department: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            company: string;
            title?: string | undefined;
            department?: string | undefined;
        }, {
            company: string;
            title?: string | undefined;
            department?: string | undefined;
        }>>;
        birthday: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    }, "strip", z.ZodTypeAny, {
        messageID?: string | undefined;
        addresses?: {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        } | {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }[] | undefined;
        emails?: {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        urls?: {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        Org?: {
            company: string;
            title?: string | undefined;
            department?: string | undefined;
        } | undefined;
        birthday?: string | undefined;
    }, {
        messageID?: string | undefined;
        addresses?: {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        } | {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }[] | undefined;
        emails?: {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        urls?: {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        Org?: {
            company: string;
            title?: string | undefined;
            department?: string | undefined;
        } | undefined;
        birthday?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    options: {
        messageID?: string | undefined;
        addresses?: {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        } | {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }[] | undefined;
        emails?: {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        urls?: {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        Org?: {
            company: string;
            title?: string | undefined;
            department?: string | undefined;
        } | undefined;
        birthday?: string | undefined;
    };
    to: string;
    name: string | {
        formatted_name: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        middle_name?: string | undefined;
        suffix?: string | undefined;
        prefix?: string | undefined;
    };
    phones: string | {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    } | {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    }[];
}, {
    options: {
        messageID?: string | undefined;
        addresses?: {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        } | {
            street: string;
            city: string;
            type?: "HOME" | "WORK" | undefined;
            state?: string | undefined;
            zip?: string | undefined;
            country?: string | undefined;
            country_code?: string | undefined;
        }[] | undefined;
        emails?: {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            email: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        urls?: {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        } | {
            url: string;
            type?: "HOME" | "WORK" | undefined;
        }[] | undefined;
        Org?: {
            company: string;
            title?: string | undefined;
            department?: string | undefined;
        } | undefined;
        birthday?: string | undefined;
    };
    to: string;
    name: string | {
        formatted_name: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        middle_name?: string | undefined;
        suffix?: string | undefined;
        prefix?: string | undefined;
    };
    phones: string | {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    } | {
        type?: "HOME" | "WORK" | "CELL" | "IPHONE" | "MAIN" | undefined;
        phone?: string | undefined;
        waID?: string | undefined;
    }[];
}>;
export declare const SendTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    language: z.ZodEnum<["AFRIKAANS", "ALBANIAN", "ARABIC", "AZERBAIJANI", "BENGALI", "BULGARIAN", "CATALAN", "CHINESE_CHN", "CHINESE_HKG", "CHINESE_TAI", "CROATIAN", "CZECH", "DANISH", "DUTCH", "ENGLISH", "ENGLISH_UK", "ENGLISH_US", "ESTONIAN", "FILIPINO", "FINNISH", "FRENCH", "GEORGIAN", "GERMAN", "GREEK", "GUJARATI", "HAUSA", "HEBREW", "HINDI", "HUNGARIAN", "INDONESIAN", "IRISH", "ITALIAN", "JAPANESE", "KANNADA", "KAZAKH", "KINYARWANDA", "KOREAN", "KYRGYZ_KYRGYZSTAN", "LAO", "LATVIAN", "LITHUANIAN", "MACEDONIAN", "MALAY", "MALAYALAM", "MARATHI", "NORWEGIAN", "PERSIAN", "POLISH", "PORTUGUESE_BR", "PORTUGUESE_POR", "PUNJABI", "ROMANIAN", "RUSSIAN", "SERBIAN", "SLOVAK", "SLOVENIAN", "SPANISH", "SPANISH_ARG", "SPANISH_SPA", "SPANISH_MEX", "SWAHILI", "SWEDISH", "TAMIL", "TELUGU", "THAI", "TURKISH", "UKRAINIAN", "URDU", "UZBEK", "VIETNAMESE", "ZULU"]>;
    header: z.ZodUnion<[z.ZodString, z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["VIDEO", "IMAGE", "DOCUMENT"]>;
        media: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    }, {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"LOCATION">;
        latitude: z.ZodString;
        longitude: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "LOCATION";
        latitude: string;
        longitude: string;
        address?: string | undefined;
        name?: string | undefined;
    }, {
        type: "LOCATION";
        latitude: string;
        longitude: string;
        address?: string | undefined;
        name?: string | undefined;
    }>>]>;
    body: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        currency: z.ZodString;
        code: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        code: string;
        currency: string;
        amount: number;
    }, {
        code: string;
        currency: string;
        amount: number;
    }>, z.ZodObject<{
        dateTime: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        dateTime: string;
    }, {
        dateTime: string;
    }>]>, "many">]>;
    buttons: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"UrlButton">;
        title: z.ZodEffects<z.ZodString, string, string>;
        url: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "UrlButton";
        url: string;
    }, {
        title: string;
        type: "UrlButton";
        url: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"PhoneNumberButton">;
        title: z.ZodString;
        phoneNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"QuickReplyButton">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        type: "QuickReplyButton";
    }, {
        text: string;
        type: "QuickReplyButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CopyCodeButton">;
        example: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "CopyCodeButton";
        example: string;
    }, {
        type: "CopyCodeButton";
        example: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"MPMButton">;
    }, "strip", z.ZodTypeAny, {
        type: "MPMButton";
    }, {
        type: "MPMButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CatalogButton">;
    }, "strip", z.ZodTypeAny, {
        type: "CatalogButton";
    }, {
        type: "CatalogButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"OTPButton">;
        OTPType: z.ZodEnum<["COPY_CODE", "ONE_TAP", "ZERO_TAP"]>;
        title: z.ZodOptional<z.ZodString>;
        autofillText: z.ZodOptional<z.ZodString>;
        packageName: z.ZodOptional<z.ZodString>;
        signatureHash: z.ZodOptional<z.ZodString>;
        zeroTapTermsAccepted: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }>>]>>, z.ZodArray<z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"UrlButton">;
        title: z.ZodEffects<z.ZodString, string, string>;
        url: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "UrlButton";
        url: string;
    }, {
        title: string;
        type: "UrlButton";
        url: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"PhoneNumberButton">;
        title: z.ZodString;
        phoneNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }, {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"QuickReplyButton">;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        type: "QuickReplyButton";
    }, {
        text: string;
        type: "QuickReplyButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CopyCodeButton">;
        example: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "CopyCodeButton";
        example: string;
    }, {
        type: "CopyCodeButton";
        example: string;
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"MPMButton">;
    }, "strip", z.ZodTypeAny, {
        type: "MPMButton";
    }, {
        type: "MPMButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"CatalogButton">;
    }, "strip", z.ZodTypeAny, {
        type: "CatalogButton";
    }, {
        type: "CatalogButton";
    }>>, z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"OTPButton">;
        OTPType: z.ZodEnum<["COPY_CODE", "ONE_TAP", "ZERO_TAP"]>;
        title: z.ZodOptional<z.ZodString>;
        autofillText: z.ZodOptional<z.ZodString>;
        packageName: z.ZodOptional<z.ZodString>;
        signatureHash: z.ZodOptional<z.ZodString>;
        zeroTapTermsAccepted: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }, {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    }>>]>>, "many">]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    language: "AFRIKAANS" | "ALBANIAN" | "ARABIC" | "AZERBAIJANI" | "BENGALI" | "BULGARIAN" | "CATALAN" | "CHINESE_CHN" | "CHINESE_HKG" | "CHINESE_TAI" | "CROATIAN" | "CZECH" | "DANISH" | "DUTCH" | "ENGLISH" | "ENGLISH_UK" | "ENGLISH_US" | "ESTONIAN" | "FILIPINO" | "FINNISH" | "FRENCH" | "GEORGIAN" | "GERMAN" | "GREEK" | "GUJARATI" | "HAUSA" | "HEBREW" | "HINDI" | "HUNGARIAN" | "INDONESIAN" | "IRISH" | "ITALIAN" | "JAPANESE" | "KANNADA" | "KAZAKH" | "KINYARWANDA" | "KOREAN" | "KYRGYZ_KYRGYZSTAN" | "LAO" | "LATVIAN" | "LITHUANIAN" | "MACEDONIAN" | "MALAY" | "MALAYALAM" | "MARATHI" | "NORWEGIAN" | "PERSIAN" | "POLISH" | "PORTUGUESE_BR" | "PORTUGUESE_POR" | "PUNJABI" | "ROMANIAN" | "RUSSIAN" | "SERBIAN" | "SLOVAK" | "SLOVENIAN" | "SPANISH" | "SPANISH_ARG" | "SPANISH_SPA" | "SPANISH_MEX" | "SWAHILI" | "SWEDISH" | "TAMIL" | "TELUGU" | "THAI" | "TURKISH" | "UKRAINIAN" | "URDU" | "UZBEK" | "VIETNAMESE" | "ZULU";
    body: string | (string | {
        code: string;
        currency: string;
        amount: number;
    } | {
        dateTime: string;
    })[];
    header?: string | {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    } | {
        type: "LOCATION";
        latitude: string;
        longitude: string;
        address?: string | undefined;
        name?: string | undefined;
    } | undefined;
    buttons?: {
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | ({
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | undefined)[] | undefined;
}, {
    name: string;
    language: "AFRIKAANS" | "ALBANIAN" | "ARABIC" | "AZERBAIJANI" | "BENGALI" | "BULGARIAN" | "CATALAN" | "CHINESE_CHN" | "CHINESE_HKG" | "CHINESE_TAI" | "CROATIAN" | "CZECH" | "DANISH" | "DUTCH" | "ENGLISH" | "ENGLISH_UK" | "ENGLISH_US" | "ESTONIAN" | "FILIPINO" | "FINNISH" | "FRENCH" | "GEORGIAN" | "GERMAN" | "GREEK" | "GUJARATI" | "HAUSA" | "HEBREW" | "HINDI" | "HUNGARIAN" | "INDONESIAN" | "IRISH" | "ITALIAN" | "JAPANESE" | "KANNADA" | "KAZAKH" | "KINYARWANDA" | "KOREAN" | "KYRGYZ_KYRGYZSTAN" | "LAO" | "LATVIAN" | "LITHUANIAN" | "MACEDONIAN" | "MALAY" | "MALAYALAM" | "MARATHI" | "NORWEGIAN" | "PERSIAN" | "POLISH" | "PORTUGUESE_BR" | "PORTUGUESE_POR" | "PUNJABI" | "ROMANIAN" | "RUSSIAN" | "SERBIAN" | "SLOVAK" | "SLOVENIAN" | "SPANISH" | "SPANISH_ARG" | "SPANISH_SPA" | "SPANISH_MEX" | "SWAHILI" | "SWEDISH" | "TAMIL" | "TELUGU" | "THAI" | "TURKISH" | "UKRAINIAN" | "URDU" | "UZBEK" | "VIETNAMESE" | "ZULU";
    body: string | (string | {
        code: string;
        currency: string;
        amount: number;
    } | {
        dateTime: string;
    })[];
    header?: string | {
        type: "IMAGE" | "DOCUMENT" | "VIDEO";
        media: string;
    } | {
        type: "LOCATION";
        latitude: string;
        longitude: string;
        address?: string | undefined;
        name?: string | undefined;
    } | undefined;
    buttons?: {
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | ({
        title: string;
        type: "UrlButton";
        url: string;
    } | {
        title: string;
        type: "PhoneNumberButton";
        phoneNumber: string;
    } | {
        text: string;
        type: "QuickReplyButton";
    } | {
        type: "CopyCodeButton";
        example: string;
    } | {
        type: "MPMButton";
    } | {
        type: "CatalogButton";
    } | {
        type: "OTPButton";
        OTPType: "COPY_CODE" | "ONE_TAP" | "ZERO_TAP";
        title?: string | undefined;
        autofillText?: string | undefined;
        packageName?: string | undefined;
        signatureHash?: string | undefined;
        zeroTapTermsAccepted?: boolean | undefined;
    } | undefined)[] | undefined;
}>;
