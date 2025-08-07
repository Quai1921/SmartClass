export interface UsersResponse {
    content: UserResponse[];
    totalElements: number;
    page: number;
    size: number;
}

export interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    documentId: string;
    roles: string;
    status: string;
}
