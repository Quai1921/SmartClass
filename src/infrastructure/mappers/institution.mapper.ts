import type { Institution } from "../../domain/entities/institution";
import type { InstitutionResponse } from "../interfaces/institutions.response";

export class InstitutionMapper {    static smartClassInstitutionToEntity(institution: InstitutionResponse): Institution {
        return {
            id: institution.id,
            name: institution.name,
            address: institution.address,
            cityName: institution.cityName,
            adminUserId: institution.adminUserId,
            adminUserName: institution.adminUserName,
            createdAt: institution.createdAt,
            logoUrl: institution.logoUrl,
            students: institution.students,
            teachers: institution.teachers,
            courses: institution.courses,
            status: institution.status,
            activationKey: institution.activationKey
        };
    }
}
