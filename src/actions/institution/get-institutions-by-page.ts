import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import type { PaginatedInstitutions } from "../../domain/entities/institution";
import type { InstitutionsResponse } from "../../infrastructure/interfaces/institutions.response";
import { InstitutionMapper } from "../../infrastructure/mappers/institution.mapper";

export const getInstitutionsByPage = async (
    page: number,
    size = 12,
    filters?: {
        cityName?: string;
        createdAt?: string;
        status?: string;
        search?: string; 
    }
): Promise<PaginatedInstitutions> => {
    const token = StorageAdapter.getItem("token");

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());


    if (filters) {
        if (filters.cityName) params.append('cityName', filters.cityName);
        if (filters.createdAt) params.append('createdAt', filters.createdAt);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search); 
    }


    try {
        const finalUrl = `/institutions/all?${params.toString()}`;
        const { data } = await smartClassAPI.get<InstitutionsResponse>(`/institutions/filter?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const institutions = {
            content: data.content.map(InstitutionMapper.smartClassInstitutionToEntity),
            totalElements: data.totalElements,
            page: data.page,
            size: data.size,
        }

        return institutions;

    } catch (error) {
        // console.error(error);
        throw new Error("Error getting institutions");
    }
};
