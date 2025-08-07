import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import type { PaginatedUsers } from "../../domain/entities/users";
import type { UsersResponse } from "../../infrastructure/interfaces/users";
import { UsersMapper } from "../../infrastructure/mappers/users.mapper";




export const getUsersByPage = async (page: number,
    size = 12,
    usersFilters?: {
        roles?: string;
        search?: string;
        status?: string
    }

): Promise<PaginatedUsers> => {
    const token = StorageAdapter.getItem("token");

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());


    if (usersFilters) {
        if (usersFilters.roles) params.append('roles', usersFilters.roles);
        if (usersFilters.search) params.append('search', usersFilters.search);
        if (usersFilters.status) params.append('status', usersFilters.status);
    }

    try {

        const { data } = await smartClassAPI.get<UsersResponse>(`/users/filter?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const users = {
            content: data.content.map(UsersMapper.smartClassUsersToEntity),
            totalElements: data.totalElements,
            page: data.page,
            size: data.size,
        };

        return users;

    } catch (error) {
        // console.error(error);
        throw new Error("Error getting institutions");
    }
};