import { smartClassAPI } from "../../config/smartClassAPI";

export interface InstitutionDetails {
  id: string;
  name: string;
  address: string;
  cityId: number;
  city?: {
    id: number;
    municipality: string;
    department: string;
    country: string;
  };
  urlInstitutionLogo?: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export const getCurrentInstitution = async (): Promise<InstitutionDetails> => {
  try {
    const { data } = await smartClassAPI.get<InstitutionDetails>("/institutions/me", {
      params: {
        id: "current"
      }
    });
    return data;
  } catch (error) {
    // console.error("Error fetching current institution:", error);
    throw new Error("Error al obtener los datos de la institución");
  }
};
