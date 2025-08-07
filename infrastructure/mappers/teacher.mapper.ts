import type { Teacher } from "../../domain/entities/teacher";
import type { TeacherResponse } from "../interfaces/teachers.response";


export class TeacherMapper {
    static smartClassTeacherToEntity( teacher: TeacherResponse): Teacher {
        return {
            id: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            identificationNumber: teacher.identificationNumber,
            currentAssignments: teacher.currentAssignments,
            status: teacher.status
        };
    }
}
