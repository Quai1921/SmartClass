// infrastructure/mappers/user.mapper.ts

import type { UserResponse, UserAdminResponse, UserInstitutionResponse } from '../interfaces/user.response';
import type { User } from '../../domain/entities/user';


export class UserMapper {
    // Type guard to check if user is admin
    private static isAdminUser(user: UserResponse): user is UserAdminResponse {
        const hasValidObject = user !== null && user !== undefined && typeof user === 'object';
        const hasTotalInstitutions = hasValidObject && 'totalInstitutions' in user;
        const hasCities = hasValidObject && 'cities' in user;
        
        return hasValidObject && hasTotalInstitutions && hasCities;
    }    static smartClassUserToEntity(user: UserResponse): User {
        // Add null/undefined check
        if (!user || typeof user !== 'object') {
            throw new Error(`Invalid user data received: ${typeof user}`);
        }

        if (this.isAdminUser(user)) {
            // Es un usuario Admin
            return {
                userFirstName: user.userFirstName,
                cities: user.cities,
                totalUsers: user.totalUsers,
                totalInstitutions: user.totalInstitutions,
            };        } else {
            // Es un usuario Institucional
            const institutionUser = user as UserInstitutionResponse;
            return {
                userFirstName: institutionUser.userFirstName,
                institutionName: institutionUser.institutionName,
                urlInstitutionLogo: institutionUser.urlInstitutionLogo,
                activeTeachers: institutionUser.activeTeachers,
                totalTeachers: institutionUser.totalTeachers,
                totalStudents: institutionUser.totalStudents,
                nextEventResponseDtos: institutionUser.nextEventResponseDtos,
                grades: institutionUser.grades,
                groups: institutionUser.groups,
                shifts: institutionUser.shifts,
                subjects: institutionUser.subjects, // Add subjects mapping
                thresholds: institutionUser.thresholds,
                status: institutionUser.status,
            };
        }
    }
}
