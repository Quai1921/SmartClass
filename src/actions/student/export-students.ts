import { smartClassAPI } from "../../config/smartClassAPI";
import { StorageAdapter } from "../../config/adapters/storage-adapter";
import type { StudentForSelection } from "./get-students-for-selection";

interface ExportStudentsParams {
    // Basic filters
    search?: string;
    status?: string;
    performance?: number;

    // Advanced filters (arrays)
    gradeNames?: string[];
    groupNames?: string[];
    shifts?: string[];
    teacherIds?: string[];
    gradeThreshold?: number;
    selectedStudents?: StudentForSelection[];

    // Export configuration
    template: boolean;
    delimiter: string;
}

export const exportStudents = async (params: ExportStudentsParams) => {
    try {
        const token = StorageAdapter.getItem("token");
        const queryParams = new URLSearchParams();
        // Add basic filters
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.performance !== undefined) queryParams.append('performance', params.performance.toString());

        // Add advanced array filters - use consistent parameter names
        if (params.gradeNames && params.gradeNames.length > 0) {
            params.gradeNames.forEach(grade => queryParams.append('gradeNames', grade));
        }

        if (params.groupNames && params.groupNames.length > 0) {
            params.groupNames.forEach(group => queryParams.append('groupNames', group));
        }

        if (params.shifts && params.shifts.length > 0) {
            params.shifts.forEach(shift => queryParams.append('shifts', shift));
        }

        if (params.teacherIds && params.teacherIds.length > 0) {
            params.teacherIds.forEach(teacherId => queryParams.append('teacherIds', teacherId));
        }
        // Add selected users from multi-select
        if (params.selectedStudents && params.selectedStudents.length > 0) {
            params.selectedStudents.forEach(student => queryParams.append('studentIds', student.id));
        }

        // Add grade threshold
        if (params.gradeThreshold !== undefined) {
            queryParams.append('gradeThreshold', params.gradeThreshold.toString());
        }
        // Add export specific params
        queryParams.append('template', params.template.toString());
        queryParams.append('delimiter', params.delimiter);


        const response = await smartClassAPI.get(`/institutions/students/export-csv?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'blob'
        });

        // Create download link
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = params.template
            ? `estudiantes_plantilla_${timestamp}.csv`
            : `estudiantes_${timestamp}.csv`;

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); return { success: true };
    } catch (error: any) {
        // console.error('Error exporting students:', error);
        // console.error('Error response:', error.response?.data);
        // console.error('Error status:', error.response?.status);
        // console.error('Error message:', error.message);

        // Extract more specific error information
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Error al exportar estudiantes';

        throw new Error(errorMessage);
    }
};
