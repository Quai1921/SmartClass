import type { City, Grade, NextEvent } from "../../infrastructure/interfaces/user.response";

// domain/entities/user.entity.ts
export interface User {
    userFirstName: string;
    
    // Propiedades específicas para admin
    totalUsers?: number;
    totalInstitutions?: number;
    cities?: City[];

    // Propiedades específicas para institution
    institutionName?: string;
    urlInstitutionLogo?: string;
    activeTeachers?: number;
    totalTeachers?: number;
    totalStudents?: number;
    nextEventResponseDtos?: NextEvent[];
    grades?: (string | Grade)[];
    groups?: string[];
    shifts?: string[];
    subjects?: string[]; // Add subjects array
    thresholds?: number[];
    status?: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}
