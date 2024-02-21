export interface MssageIDResponse {
    messaging_product: "whatsapp";
    contacts: [
        {
            input: string;
            wa_id: string;
        }
    ];
    messages: [
        {
            id: string;
        }
    ];
}
export interface BooleanResponse {
    success: boolean;
}
export interface getPhoneNumberByID {
    verified_name: string;
    display_phone_number: string;
    id: string;
    quality_rating: string;
    code_verification_status?: string;
    platform_type?: string;
    throughput?: {
        level: string;
    };
}
export interface getPhoneNumbers {
    data: getPhoneNumberByID[];
    paging?: {
        cursors?: {
            before: string;
            after: string;
        };
    };
}
export interface GetAllSubscriptions {
    whatsapp_business_api_data: {
        category?: string;
        link: string;
        name: string;
        id: string;
    };
}
