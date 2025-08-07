import { smartClassAPI } from "../../config/smartClassAPI";

export interface CreateTemplateRequest {
    name: string;
    subject: string;
    body: string;
    placeholders: string[];
}

export const createEmailTemplate = async (templateData: CreateTemplateRequest): Promise<void> => {
    await smartClassAPI.post('/email/template/create', templateData);
};
