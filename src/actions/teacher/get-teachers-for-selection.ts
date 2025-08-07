import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import type { TeachersResponse } from "../../infrastructure/interfaces/teachers.response";
import { TeacherMapper } from "../../infrastructure/mappers/teacher.mapper";

export interface TeacherForSelection {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
}

export const getTeachersForSelection = async (
    search?: string,
    size = 50
): Promise<TeacherForSelection[]> => {
    const token = StorageAdapter.getItem("token");

    const params = new URLSearchParams();
    params.append('page', '0');
    params.append('size', size.toString());
    if (search) {
        params.append('search', search);
    }    const response = await smartClassAPI.get<TeachersResponse>(`/teachers/filter?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Convert response to teachers and then to selection format
    return response.data.content.map(teacherResponse => {
        const teacher = TeacherMapper.smartClassTeacherToEntity(teacherResponse);
        return {
            id: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            fullName: `${teacher.firstName} ${teacher.lastName}`,
        };
    });
};
