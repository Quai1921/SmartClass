import { smartClassAPI } from "../../config/smartClassAPI";

export interface EmailPlaceholder {
    key: string;
    category: string;
    description: string;
}

export const getEmailPlaceholders = async (): Promise<EmailPlaceholder[]> => {
    const { data } = await smartClassAPI.get<EmailPlaceholder[]>('/email/placeholders');
    return data;
};
