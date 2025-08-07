import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import type { PaginatedStudents } from "../../domain/entities/student";
import type { StudentsResponse } from "../../infrastructure/interfaces/stundents.response";
import { StudentMapper } from "../../infrastructure/mappers/student.mapper";



export const getStudentsByPage = async (
    page: number,
    size = 12,
    filters?: {
        grade?: string;
        group?: string;
        shift?: string;
        performance?: number;
        status?: string;
        search?: string;
    }
): Promise<PaginatedStudents> => {
    const token = StorageAdapter.getItem("token");

    // Construir query params
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
        const { data } = await smartClassAPI.get<StudentsResponse>(`/students/filter?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },        });

        const students = {
            content: data.content.map(StudentMapper.smartClassStudentToEntity),
            totalElements: data.totalElements,
            page: data.page,
            size: data.size,
        };

        return students;
    } catch (error) {
        // console.error(error);
        throw new Error("Error getting students");
    }
};

