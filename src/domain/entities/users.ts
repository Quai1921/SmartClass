
export interface PaginatedUsers {
    content:       User[];
    totalElements: number;
    page:          number;
    size:          number;
}


export interface User {
    id:         string;
    firstName:  string;
    lastName:   string;
    email:      string;
    documentId: string;
    roles:       string;
    status:     string;
}
