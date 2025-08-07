import { smartClassAPI } from "../../config/smartClassAPI";



export const postCreateStudent = async (
    studentCode: string,
    firstName: string,
    lastName: string,
    grade: string,
    group: string,
    shiftType: "MORNING" | "AFTERNOON",
    status: "ACTIVE" | "INACTIVE"
) => {

    try {

        const { data } = await smartClassAPI.post("/students/create",
            {
                studentCode,
                firstName,
                lastName,
                grade,
                group,
                shiftType,
                status
            });
        return data;

    } catch (error) {
        return null;
    }
};
