import { smartClassAPI } from "../../config/smartClassAPI";

interface ExportUsersParams {
    // Basic filters
    role?: string;
    search?: string;
    status?: string;
    
    // Advanced filters for students
    gradeNames?: string[];
    groupNames?: string[];
    shifts?: string[];
    teacherIds?: string[];
    gradeThreshold?: number;
    
    // Export configuration
    template: boolean;
    delimiter: string;
}

export const exportUsers = async (params: ExportUsersParams) => {
    try {
        const queryParams = new URLSearchParams();
        
        // Add basic filters
        if (params.role) queryParams.append('role', params.role);
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        
        // Add advanced filters for students
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
        if (params.gradeThreshold !== undefined) {
            queryParams.append('gradeThreshold', params.gradeThreshold.toString());
        }
        
        // Add export specific params
        queryParams.append('template', params.template.toString());
        queryParams.append('delimiter', params.delimiter);

        const response = await smartClassAPI.get(`/api/users/export-csv?${queryParams.toString()}`, {
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
            ? `usuarios_plantilla_${timestamp}.csv`
            : `usuarios_${timestamp}.csv`;
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        // console.error('Error exporting users:', error);
        throw new Error('Error al exportar usuarios');
    }
};
