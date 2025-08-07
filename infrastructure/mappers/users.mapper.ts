import type { UserResponse } from "../interfaces/users";
import type { User } from "../../domain/entities/users";




export class UsersMapper {
    static smartClassUsersToEntity(users: UserResponse): User {
        return {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            documentId: users.documentId,
            roles: users.roles,
            status: users.status
        }
    }
}