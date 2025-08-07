import { smartClassAPI } from "../../config/smartClassAPI";
import type { EmailTemplate } from "./get-email-templates";

export const getEmailTemplate = async (id: string): Promise<EmailTemplate> => {
    const { data } = await smartClassAPI.get<EmailTemplate>(`/email/template/${id}`);
    return data;
};
