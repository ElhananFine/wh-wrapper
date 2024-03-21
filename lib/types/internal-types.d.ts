export type SendMessageResponse = {
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
};
export type isSuccessResponse = {
    success: boolean;
};
export interface GetPhoneNumberByID {
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
