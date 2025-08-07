export interface PaginatedTeachers {
    content:       Teacher[];
    totalElements: number;
    page:          number;
    size:          number;
}

export interface Teacher {
    id:                   string;
    firstName:            string;
    lastName:             string;
    email:                string;
    identificationNumber: string;
    currentAssignments:   CurrentAssignment[];
    status:               string;
}

export interface CurrentAssignment {
    shift:       Shift;
    grade:       number;
    group:       Group;
    subject:     string;
    performance: number;
}

export type Group = "A" | "B" | "C";


export type Shift = "AFTERNOON" | "MORNING";
