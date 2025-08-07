import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import type { PaginatedTeachers } from "../../domain/entities/teacher";
import type { TeachersResponse } from "../../infrastructure/interfaces/teachers.response";
import { TeacherMapper } from "../../infrastructure/mappers/teacher.mapper";



export const getTeachersByPage = async (page: number,
    size = 12,
    filters?: {
        grade?: string;
        group?: string;
        shift?: string;
        performance?: number;
        status?: string;
        search?: string;
    }
): Promise<PaginatedTeachers> => {
    const token = StorageAdapter.getItem("token");

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (filters) {
        if (filters.grade) params.append('grades', filters.grade);
        if (filters.group) params.append('groups', filters.group);
        if (filters.shift) params.append('shifts', filters.shift);
        if (filters.performance !== undefined) params.append('performance', filters.performance.toString());
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
    }

    try {
        const { data } = await smartClassAPI.get<TeachersResponse>(`/teachers/filter?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


        const teachers = {
            content: data.content.map(TeacherMapper.smartClassTeacherToEntity),
            totalElements: data.totalElements,
            page: data.page,
            size: data.size,
        }

        return teachers;

    } catch (error) {
        // console.error(error);
        throw new Error("Error getting institutions");
    }
};
