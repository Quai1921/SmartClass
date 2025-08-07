import type { Student } from "../../domain/entities/student";
import type { StudentResponse } from "../interfaces/stundents.response";



export class StudentMapper {
    static smartClassStudentToEntity(student: StudentResponse): Student {
        return {
            id: student.id,
            studentCode: student.studentCode,
            firstName: student.firstName,
            lastName: student.lastName,
            academicPerformance: student.academicPerformance,
            status: student.status
        };
    }
}
