import { smartClassAPI } from "../../config/smartClassAPI";

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    placeholders: string[];
}

export interface EmailTemplatesResponse {
    templates: EmailTemplate[];
}

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
    const { data } = await smartClassAPI.get<EmailTemplate[]>('/email/templates');
    return data;
};
