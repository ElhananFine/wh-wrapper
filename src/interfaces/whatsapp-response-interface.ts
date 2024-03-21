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
