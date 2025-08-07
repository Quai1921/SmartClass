import { smartClassAPI } from "../../config/smartClassAPI";

export interface SendEmailRequest {
    to: string[];
    subject: string;
    body: string;
    templateId?: string;
    variables?: {
        additionalProp1: any;
        additionalProp2: any;
        additionalProp3: any;
    };
}

export const sendEmail = async (emailData: SendEmailRequest): Promise<void> => {
    await smartClassAPI.post('/email/send', emailData);
};
