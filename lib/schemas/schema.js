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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTemplateSchema = exports.SendContacSchema = exports.SendContacOptionSchema = exports.phoneSchema = exports.nameSchema = exports.CreateTempleteSchema = exports.UpdateBusinessProfileSchema = exports.sendMessageSchema = exports.sendMediaInteractiveSchema = exports.sendMessageOptionsSchema = exports.Language = void 0;
const z = __importStar(require("zod"));
const shared_1 = require("../types/shared");
exports.Language = {
    AFRIKAANS: "af",
    ALBANIAN: "sq",
    ARABIC: "ar",
    AZERBAIJANI: "az",
    BENGALI: "bn",
    BULGARIAN: "bg",
    CATALAN: "ca",
    CHINESE_CHN: "zh_CN",
    CHINESE_HKG: "zh_HK",
    CHINESE_TAI: "zh_TW",
    CROATIAN: "hr",
    CZECH: "cs",
    DANISH: "da",
    DUTCH: "nl",
    ENGLISH: "en",
    ENGLISH_UK: "en_GB",
    ENGLISH_US: "en_US",
    ESTONIAN: "et",
    FILIPINO: "fil",
    FINNISH: "fi",
    FRENCH: "fr",
    GEORGIAN: "ka",
    GERMAN: "de",
    GREEK: "el",
    GUJARATI: "gu",
    HAUSA: "ha",
    HEBREW: "he",
    HINDI: "hi",
    HUNGARIAN: "hu",
    INDONESIAN: "id",
    IRISH: "ga",
    ITALIAN: "it",
    JAPANESE: "ja",
    KANNADA: "kn",
    KAZAKH: "kk",
    KINYARWANDA: "rw_RW",
    KOREAN: "ko",
    KYRGYZ_KYRGYZSTAN: "ky_KG",
    LAO: "lo",
    LATVIAN: "lv",
    LITHUANIAN: "lt",
    MACEDONIAN: "mk",
    MALAY: "ms",
    MALAYALAM: "ml",
    MARATHI: "mr",
    NORWEGIAN: "nb",
    PERSIAN: "fa",
    POLISH: "pl",
    PORTUGUESE_BR: "pt_BR",
    PORTUGUESE_POR: "pt_PT",
    PUNJABI: "pa",
    ROMANIAN: "ro",
    RUSSIAN: "ru",
    SERBIAN: "sr",
    SLOVAK: "sk",
    SLOVENIAN: "sl",
    SPANISH: "es",
    SPANISH_ARG: "es_AR",
    SPANISH_SPA: "es_ES",
    SPANISH_MEX: "es_MX",
    SWAHILI: "sw",
    SWEDISH: "sv",
    TAMIL: "ta",
    TELUGU: "te",
    THAI: "th",
    TURKISH: "tr",
    UKRAINIAN: "uk",
    URDU: "ur",
    UZBEK: "uz",
    VIETNAMESE: "vi",
    ZULU: "zu",
};
const replyButtons = z.object({
    title: z.string().max(20),
    callbackData: z.string().max(256),
});
exports.sendMessageOptionsSchema = z.object({
    previewUrl: z.boolean().default(false).optional(),
    messageID: z.string({ invalid_type_error: "The messageId must be a string" }).optional(),
    header: z.string().max(60, { message: "Maximum header 60 characters" }).optional(),
    footer: z.string().max(60, { message: "Maximum footer 256 characters" }).optional(),
    buttons: z
        .union([
        replyButtons,
        z.array(replyButtons).max(3),
        z.object({
            title: z.string().max(20),
            url: z.string().url(),
        }),
        z.object({
            buttonTitle: z.string().max(20),
            sections: z
                .array(z.object({
                title: z.string().max(20),
                rows: z
                    .array(z.object({
                    title: z.string().max(24),
                    callbackData: z.string().max(200),
                    description: z.string().max(72).optional(),
                }))
                    .min(1)
                    .max(10),
            }))
                .min(1)
                .max(10),
        }),
    ])
        .optional(),
});
exports.sendMediaInteractiveSchema = z
    .object({
    buttons: z
        .union([
        replyButtons,
        z.array(replyButtons).max(3),
        z.object({
            title: z.string().max(20),
            url: z.string().url(),
        }),
    ])
        .optional(),
    footer: z.string().max(60, { message: "Maximum footer 256 characters" }).optional(),
    messageID: z.string().optional(),
    capiton: z.string().optional(),
    filename: z.string().optional(),
})
    .optional();
exports.sendMessageSchema = z.object({
    to: z.string({ invalid_type_error: "The to must be a string" }),
    text: z
        .string({
        required_error: "Must provide a string to send to the user",
        invalid_type_error: "The message (text) must be a string",
    })
        .max(4096),
    options: exports.sendMessageOptionsSchema.optional(),
});
exports.UpdateBusinessProfileSchema = z.object({
    about: z.string().min(1).max(139).optional(),
    address: z.string().max(256).optional(),
    description: z.string().max(512).optional(),
    email: z.string().email().max(128).optional(),
    industry: z.nativeEnum(shared_1.WhatsAppProfileVertical),
    profilePictureHandle: z.string().optional(),
    websites: z.array(z.string().url().max(256)).max(2, { message: "Maximum of two sites per profile" }).optional(),
});
const languages = z.enum([
    "AFRIKAANS",
    "ALBANIAN",
    "ARABIC",
    "AZERBAIJANI",
    "BENGALI",
    "BULGARIAN",
    "CATALAN",
    "CHINESE_CHN",
    "CHINESE_HKG",
    "CHINESE_TAI",
    "CROATIAN",
    "CZECH",
    "DANISH",
    "DUTCH",
    "ENGLISH",
    "ENGLISH_UK",
    "ENGLISH_US",
    "ESTONIAN",
    "FILIPINO",
    "FINNISH",
    "FRENCH",
    "GEORGIAN",
    "GERMAN",
    "GREEK",
    "GUJARATI",
    "HAUSA",
    "HEBREW",
    "HINDI",
    "HUNGARIAN",
    "INDONESIAN",
    "IRISH",
    "ITALIAN",
    "JAPANESE",
    "KANNADA",
    "KAZAKH",
    "KINYARWANDA",
    "KOREAN",
    "KYRGYZ_KYRGYZSTAN",
    "LAO",
    "LATVIAN",
    "LITHUANIAN",
    "MACEDONIAN",
    "MALAY",
    "MALAYALAM",
    "MARATHI",
    "NORWEGIAN",
    "PERSIAN",
    "POLISH",
    "PORTUGUESE_BR",
    "PORTUGUESE_POR",
    "PUNJABI",
    "ROMANIAN",
    "RUSSIAN",
    "SERBIAN",
    "SLOVAK",
    "SLOVENIAN",
    "SPANISH",
    "SPANISH_ARG",
    "SPANISH_SPA",
    "SPANISH_MEX",
    "SWAHILI",
    "SWEDISH",
    "TAMIL",
    "TELUGU",
    "THAI",
    "TURKISH",
    "UKRAINIAN",
    "URDU",
    "UZBEK",
    "VIETNAMESE",
    "ZULU",
]);
const buttonsSchema = z
    .union([
    z
        .object({
        type: z.literal("UrlButton"),
        title: z
            .string()
            .max(25)
            .refine((t) => {
            const variables = t.match(/\{\{(.*?)\}\}/g) || [];
            return variables.length <= 1;
        }, {
            message: "URL Button (title) supports only 1 variable",
        }),
        url: z
            .string()
            .url()
            .max(2000)
            .refine((url) => {
            const variables = url.match(/\{\{(.*?)\}\}/g) || [];
            return variables.length <= 1;
        }, {
            message: "URL Button (url) supports only 1 variable",
        }),
    })
        .optional(),
    z
        .object({
        type: z.literal("PhoneNumberButton"),
        title: z.string().max(25),
        phoneNumber: z.string().max(20),
    })
        .optional(),
    z
        .object({
        type: z.literal("QuickReplyButton"),
        text: z.string().max(25),
    })
        .optional(),
    z
        .object({
        type: z.literal("CopyCodeButton"),
        example: z.string().max(15),
    })
        .optional(),
    z
        .object({
        type: z.literal("MPMButton"),
    })
        .optional(),
    z
        .object({
        type: z.literal("CatalogButton"),
    })
        .optional(),
    z
        .object({
        type: z.literal("OTPButton"),
        OTPType: z.enum(["COPY_CODE", "ONE_TAP", "ZERO_TAP"]),
        title: z.string().optional(),
        autofillText: z.string().optional(),
        packageName: z.string().optional(),
        signatureHash: z.string().optional(),
        zeroTapTermsAccepted: z.boolean().default(true).optional(),
    })
        .optional(),
])
    .optional();
exports.CreateTempleteSchema = z.object({
    name: z.string().max(512),
    category: z.enum(["AUTHENTICATION", "MARKETING", "UTILITY"]),
    language: languages,
    allowCategoryChange: z.boolean().optional(),
    header: z
        .union([
        z.object({
            type: z.literal("TEXT"),
            text: z
                .string()
                .max(60)
                .refine((t) => {
                const variables = t.match(/\{\{(.*?)\}\}/g) || [];
                return variables.length <= 1;
            }, {
                message: "Text supports only 1 variable",
            }),
        }),
        z.object({
            type: z.enum(["IMAGE", "DOCUMENT", "VIDEO"]),
            media: z.string(),
        }),
        z.object({
            type: z.literal("LOCATION"),
        }),
    ])
        .optional(),
    body: z.union([
        z.string().max(1024),
        z.object({
            codeExpirationMinutes: z.number().min(1).max(90),
            addSecurityRecommendation: z.boolean().default(false),
        }),
    ]),
    footer: z.string().max(60).optional(),
    buttons: z.union([buttonsSchema, z.array(buttonsSchema).max(10)]).optional(),
});
const phonesObject = z.object({
    phone: z.string().optional(),
    type: z.enum(["IPHONE", "CELL", "MAIN", "HOME", "WORK"]).optional(),
    waID: z.string().optional(),
});
const homeOrWork = z.enum(["WORK", "HOME"]).optional();
const addresses = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    country_code: z.string().optional(),
    type: homeOrWork,
});
const emails = z.object({
    email: z.string(),
    type: homeOrWork,
});
const urls = z.object({
    url: z.string(),
    type: homeOrWork,
});
exports.nameSchema = z.union([
    z.string(),
    z
        .object({
        formatted_name: z.string(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        middle_name: z.string().optional(),
        suffix: z.string().optional(),
        prefix: z.string().optional(),
    })
        .refine((data) => Object.keys(data).filter((key) => key !== "formattedName" && data[key] !== undefined).length > 0, {
        message: "At least one of firstName, lastName, middleName, suffix, or prefix must be provided.",
    }),
]);
exports.phoneSchema = z.union([z.string(), phonesObject, z.array(phonesObject)]);
exports.SendContacOptionSchema = z.object({
    messageID: z.string().optional(),
    addresses: z.union([addresses, z.array(addresses)]).optional(),
    emails: z.union([emails, z.array(emails)]).optional(),
    urls: z.union([urls, z.array(urls)]).optional(),
    Org: z
        .object({
        company: z.string(),
        department: z.string().optional(),
        title: z.string().optional(),
    })
        .optional(),
    birthday: z
        .string()
        .refine((isYYYYMMDD) => /^\d{4}-\d{2}-\d{2}$/.test(isYYYYMMDD), {
        message: "Birthday must be in YYYY-MM-DD format.",
    })
        .optional(),
});
exports.SendContacSchema = z.object({
    to: z.string(),
    name: exports.nameSchema,
    phones: exports.phoneSchema,
    options: exports.SendContacOptionSchema,
});
exports.SendTemplateSchema = z.object({
    name: z.string().max(512),
    language: languages,
    header: z.union([
        z.string(),
        z
            .object({
            type: z.enum(["VIDEO", "IMAGE", "DOCUMENT"]),
            media: z.string(),
        })
            .optional(),
        z
            .object({
            type: z.literal("LOCATION"),
            latitude: z.string(),
            longitude: z.string(),
            name: z.string().optional(),
            address: z.string().optional(),
        })
            .optional(),
    ]),
    body: z.union([
        z.string(),
        z.array(z.union([
            z.string(),
            z.object({
                currency: z.string(),
                code: z.string(),
                amount: z.number(),
            }),
            z.object({
                dateTime: z.string(),
            }),
        ])),
    ]),
    buttons: z.union([buttonsSchema, z.array(buttonsSchema).max(10)]).optional(),
});
