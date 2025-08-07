export interface PaginatedInstitutions {
    content:       Institution[];
    totalElements: number;
    page:          number;
    size:          number;
}

export interface Institution{
    id:            number;
    name:          string;
    address:       string;
    cityName:      string;
    adminUserId:   string;
    adminUserName: string;
    createdAt:     Date;
    logoUrl:       string;
    students:      number;
    teachers:      number;
    courses?:      number; // Optional since it might not always be available
    status:        string;
    activationKey: string;
}
