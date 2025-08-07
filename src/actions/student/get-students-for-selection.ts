import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import type { StudentsResponse } from "../../infrastructure/interfaces/stundents.response";
import { StudentMapper } from "../../infrastructure/mappers/student.mapper";

export interface StudentForSelection {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    studentCode: string;
}

export const getStudentsForSelection = async (
    search?: string,
    size = 50
): Promise<StudentForSelection[]> => {
    const token = StorageAdapter.getItem("token");

    const params = new URLSearchParams();
    params.append('page', '0');
    params.append('size', size.toString());
    if (search) {
        params.append('search', search);
    }

    const response = await smartClassAPI.get<StudentsResponse>(`/students/filter?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Convert response to students and then to selection format
    return response.data.content.map(studentResponse => {
        const student = StudentMapper.smartClassStudentToEntity(studentResponse);
        return {
            id: student.id.toString(), // Convert number to string
            firstName: student.firstName,
            lastName: student.lastName,
            email: `${student.studentCode}@institution.edu`, // Generate email from student code
            fullName: `${student.firstName} ${student.lastName}`,
            studentCode: student.studentCode,
        };
    });
};
