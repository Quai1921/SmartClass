export interface StudentsResponse {
    content: StudentResponse[];
    totalElements: number;
    page: number;
    size: number;
}

export interface StudentResponse {
    id: number;
    studentCode: string;
    firstName: string;
    lastName: string;
    academicPerformance: AcademicPerformance;
    status: string;
}

export interface AcademicPerformance {
    shift: Shift;
    grade: number;
    group: Group;
    subject: string | null;
    performance: number | null;
}

export type Group = "A" | "B" | "C";


export type Shift = "AFTERNOON" | "MORNING";
