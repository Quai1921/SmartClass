import React, { useState, useCallback, useMemo } from 'react';
import { X, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import CustomSelector from '../../../components/CustomSelector';
import { MultiSelectDropdown } from '../../../components/MultiSelectDropdown';
import { MultiSelectTeacherSearch } from '../../../components/MultiSelectTeacherSearch';
import { MultiSelectStudentSearch } from '../../../components/MultiSelectStudentSearch';
import { TeacherSelector } from '../../../components/TeacherSelector';
import { IconComponent } from '../../admin/components/Icon';
import { getUserData } from '../../../../actions/user/get-user-data';
import type { TeacherForSelection } from '../../../../actions/teacher/get-teachers-for-selection';
import type { StudentForSelection } from '../../../../actions/student/get-students-for-selection';
import { useAuthStore } from '../../../store/auth/useAuthStore';

interface InstitutionExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (filters: ExportFilters) => void;    currentFilters: {
        performance?: number;
        status?: string;
        search?: string;
    };
    title: string; // "Exportar Docentes" or "Exportar Estudiantes"
    searchPlaceholder: string; // "Buscar docentes..." or "Buscar estudiantes..."
    type: 'teachers' | 'students'; // To determine which fields to show
}

interface ExportFilters {
    // Basic filters
    performance?: number;
    status?: string;
    search?: string;
    
    // Advanced filters
    gradeNames?: string[];
    groupNames?: string[];
    shifts?: string[];
    teacherIds?: string[];
    gradeThreshold?: number;
    selectedTeachers?: TeacherForSelection[];
    selectedStudents?: StudentForSelection[];
    
    // Export configuration
    template: boolean;
    delimiter: string;
}

export const InstitutionExportModal: React.FC<InstitutionExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    currentFilters,
    title,
    searchPlaceholder,
    type,
}) => {
    const [filters, setFilters] = useState<ExportFilters>({
        ...currentFilters,
        template: false,
        delimiter: ',',
    });    const [selectedTeachers, setSelectedTeachers] = useState<TeacherForSelection[]>([]);    const [selectedStudents, setSelectedStudents] = useState<StudentForSelection[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | undefined>();

    const { role } = useAuthStore();
    // Get user data for grades and groups options
    const { data: userData } = useQuery({
        queryKey: ['userData'],
        queryFn: getUserData,
        enabled: role === 'INSTITUTION_ADMIN',
    });const gradeOptions = useMemo(() => {
        if (!userData?.grades) return [];
        
        return userData.grades
            .filter(grade => grade != null)
            .map((grade) => {
                // Handle both string grades and Grade object grades
                if (typeof grade === 'string') {
                    return {
                        label: `Grado ${grade}`,
                        value: grade,
                    };
                } else {
                    // Grade object with id and name
                    return grade.id != null && grade.name ? {
                        label: grade.name,
                        value: grade.id.toString(),
                    } : null;
                }
            })
            .filter(Boolean) as Array<{ label: string; value: string }>;
    }, [userData?.grades]);

    const groupOptions = useMemo(() => 
        ['A', 'B', 'C', 'D', 'E'].map((group) => ({
            label: `Grupo ${group}`,
            value: group,
        })),
        []
    );

    const shiftOptions = useMemo(() => [
        { label: "Mañana", value: "MORNING" },
        { label: "Tarde", value: "AFTERNOON" },
        { label: "Noche", value: "NIGHT" }
    ], []);

    const statusOptions = useMemo(() => [
        { label: "ACTIVO", value: "ACTIVE" },
        { label: "INACTIVO", value: "INACTIVE" },
        { label: "PENDIENTE", value: "PENDING" },
    ], []);    const formatOptions = useMemo(() => [
        { label: "Exportar Archivo", value: "false" },
        { label: "Exportar Plantilla", value: "true" }
    ], []);

    const gradeThresholdOptions = useMemo(() => [
        { label: "≤ 5.0", value: "1" },
        { label: "> 7.0", value: "2" },
        { label: "≥ 8.0", value: "3" }
    ], []);const handleExport = useCallback(() => {
        // For teachers: collect teacher IDs from multi-select and teacher dropdown
        const allTeacherIds = [];
        if (type === 'teachers') {
            if (selectedTeachers.length > 0) {
                allTeacherIds.push(...selectedTeachers.map(teacher => teacher.id));
            }
            if (selectedTeacherId) {
                allTeacherIds.push(selectedTeacherId);
            }
            if (filters.teacherIds) {
                allTeacherIds.push(...filters.teacherIds);
            }
        }
        
        // For students: use teacherIds for filtering by teacher, selectedStudents for specific students
        const teacherIds = type === 'students' && selectedTeacherId ? [selectedTeacherId] : 
                          (filters.teacherIds || []);

        const exportFilters = {
            ...filters,
            selectedTeachers: type === 'teachers' ? selectedTeachers : undefined,
            selectedStudents: type === 'students' ? selectedStudents : undefined,
            teacherIds: type === 'teachers' ? 
                       (allTeacherIds.length > 0 ? allTeacherIds : undefined) :
                       (teacherIds.length > 0 ? teacherIds : undefined),
        };
        onExport(exportFilters);
        onClose();
    }, [filters, selectedTeachers, selectedStudents, selectedTeacherId, onExport, onClose, type]);

    const handleFilterChange = useCallback((key: keyof ExportFilters, value: string | boolean | string[] | number | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50"></div>
            <div className="fixed inset-0 backdrop-blur-sm z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <IconComponent name="DownloadIcon" size={16} color="#2563eb" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>                    <div className="space-y-4">
                        {/* Export information indicator */}                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-start gap-2">
                                <Info size={16} color="#2563eb" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium">Información de exportación:</p>
                                    <p>Si no selecciona ningún filtro específico, se exportará la lista completa de {type === 'teachers' ? 'docentes' : 'estudiantes'}.</p>
                                </div>
                            </div>
                        </div>

                        {/* Type-specific multi-select search */}
                        {type === 'teachers' ? (
                            <MultiSelectTeacherSearch
                                label="Seleccionar docentes específicos:"
                                placeholder={searchPlaceholder}
                                selectedTeachers={selectedTeachers}
                                onSelectionChange={setSelectedTeachers}
                                className="mb-4"
                            />
                        ) : (
                            <MultiSelectStudentSearch
                                label="Seleccionar estudiantes específicos:"
                                placeholder={searchPlaceholder}
                                selectedStudents={selectedStudents}
                                onSelectionChange={setSelectedStudents}
                                className="mb-4"
                            />                        )}                        <div>
                            {/* Grade Names Multi-Select */}
                            <div className="mb-4">
                                <MultiSelectDropdown
                                    label="Seleccionar grados:"
                                    placeholder="Seleccionar grados..."
                                    options={gradeOptions}
                                    selectedValues={filters.gradeNames || []}
                                    onSelectionChange={(values) => handleFilterChange('gradeNames', values.length > 0 ? values : undefined)}
                                    className="w-full"
                                />
                            </div>                            {/* Group Names Multi-Select */}
                            <div className="mb-4">
                                <MultiSelectDropdown
                                    label="Seleccionar grupos:"
                                    placeholder="Ejemplo: A, B, C"
                                    options={groupOptions}
                                    selectedValues={filters.groupNames || []}
                                    onSelectionChange={(values) => handleFilterChange('groupNames', values.length > 0 ? values : undefined)}
                                    className="w-full"
                                />
                            </div>

                            {/* Grid for dropdowns */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <CustomSelector
                                    label="Seleccione Turno"
                                    width="w-full"
                                    value={filters.shifts?.[0]}
                                    options={shiftOptions}
                                    onChange={(value) => handleFilterChange('shifts', value ? [value] : undefined)}
                                />

                                <CustomSelector
                                    label="Seleccione Estado"
                                    width="w-full"
                                    value={filters.status}
                                    options={statusOptions}
                                    onChange={(value) => handleFilterChange('status', value)}
                                />
                            </div>

                            {/* Teacher Selector - only show for students */}
                            {type === 'students' && (
                                <TeacherSelector
                                    label="Seleccionar profesor:"
                                    placeholder="Seleccionar un profesor específico..."
                                    value={selectedTeacherId}
                                    onChange={(teacherId) => setSelectedTeacherId(teacherId)}
                                    className="mb-4"
                                />
                            )}                            {/* Grade Threshold - only show for students */}
                            {type === 'students' && (
                                <div className="mb-4">
                                    <CustomSelector
                                        label="Promedio:"
                                        width="w-full"
                                        value={filters.gradeThreshold?.toString()}
                                        options={gradeThresholdOptions}
                                        onChange={(value) => handleFilterChange('gradeThreshold', value ? parseInt(value) : undefined)}
                                    />
                                </div>
                            )}{/* Current filter display */}
                            {Object.entries(currentFilters).some(([, value]) => {
                                return value !== undefined && value !== '' && value !== null;
                            }) && (                                <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded-md">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filtros actuales de la página:
                                    </label>
                                    {currentFilters.performance !== undefined && (
                                        <div className="text-sm text-gray-600">
                                            Desempeño: ≥ {currentFilters.performance.toFixed(1)}
                                        </div>
                                    )}
                                    {currentFilters.status && (
                                        <div className="text-sm text-gray-600">
                                            Estado: {currentFilters.status === 'ACTIVE' ? 'ACTIVO' : currentFilters.status === 'INACTIVE' ? 'INACTIVO' : 'PENDIENTE'}
                                        </div>
                                    )}
                                    {currentFilters.search && (
                                        <div className="text-sm text-gray-600">
                                            Búsqueda: "{currentFilters.search}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de archivo:
                            </label>
                            <CustomSelector
                                label="Seleccione formato"
                                width="w-full"
                                value={filters.template ? "true" : "false"}
                                options={formatOptions}
                                onChange={(value) => handleFilterChange('template', value === "true")}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <IconComponent name="DownloadIcon" size={16} color="#ffffff" />
                            Exportar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
