export interface UserAdminResponse {
    userFirstName: string;
    cities: City[];
    totalUsers: number;
    totalInstitutions: number;
}

export interface Grade {
    id: number;
    name: string;
}

export interface UserInstitutionResponse {
    userFirstName: string;
    institutionName: string;
    urlInstitutionLogo?: string;
    activeTeachers?: number;
    totalTeachers?: number;
    totalStudents?: number;
    nextEventResponseDtos?: NextEvent[];
    grades: string[] | Grade[]; // Can be array of strings or objects
    groups: string[];
    shifts: string[];
    subjects: string[]; // Add subjects array
    thresholds: number[];
    status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export interface NextEvent {
    title: string;
    startTime: string;
}

export interface City {
    id: number;
    name: string;
}

export type UserResponse = UserAdminResponse | UserInstitutionResponse;