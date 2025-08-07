import { smartClassAPI } from "../../config/smartClassAPI";

export interface CreateTeacherRequest {
    firstName: string;
    lastName: string;
    email: string;
    identificationNumber: string;
    availableAssignment: AvailableAssignment[];
    status: "ACTIVE" | "INACTIVE" | "PENDING";
}

export interface AvailableAssignment {
    shift: "MORNING" | "AFTERNOON";
    grade: number;
    group: string;
    subject: string;
}

export const postCreateTeacher = async (teacherData: CreateTeacherRequest) => {
    try {
        const { data } = await smartClassAPI.post("/teachers/create", teacherData);
        return data;
    } catch (error: any) {
        // console.error("Error creating teacher:", error);
        throw error;
    }
};
