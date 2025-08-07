import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import type { UsersResponse } from "../../infrastructure/interfaces/users";
import { UsersMapper } from "../../infrastructure/mappers/users.mapper";

export interface UserForSelection {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
}

export const getUsersForSelection = async (
    search?: string,
    roles?: string,
    size = 50
): Promise<UserForSelection[]> => {
    const token = StorageAdapter.getItem("token");

    const params = new URLSearchParams();
    params.append('page', '0');
    params.append('size', size.toString());
    
    if (search) params.append('search', search);
    if (roles) params.append('roles', roles);

    try {
        const { data } = await smartClassAPI.get<UsersResponse>(`/users/filter?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const users = data.content.map(user => {
            const mapped = UsersMapper.smartClassUsersToEntity(user);
            return {
                id: mapped.id,
                firstName: mapped.firstName,
                lastName: mapped.lastName,
                email: mapped.email,
                fullName: `${mapped.firstName} ${mapped.lastName}`.trim(),
            };
        });

        return users;
    } catch (error) {
        // console.error('Error getting users for selection:', error);
        throw new Error("Error getting users for selection");
    }
};
