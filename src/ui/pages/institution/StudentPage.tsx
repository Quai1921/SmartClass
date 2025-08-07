import { useState, useCallback, useMemo, useEffect } from 'react';
import CustomSelector from '../../components/CustomSelector';
import { SelectedTag } from '../../components/SelectTag';
import TableCustomAdmin from '../../components/TableCustomAdmin';
import CustomButton from '../../components/CustomButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentsByPage } from '../../../actions/student/get-students-by-page';
import { updateStudentStatus } from '../../../actions/student/update-student-status';
import { exportStudents } from '../../../actions/student/export-students';
import type { StudentForSelection } from '../../../actions/student/get-students-for-selection';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { importStudents } from '../../../actions/student/import-students';
import { StatusToggle } from '../../components/StatusToggle';
import { ErrorFallback } from '../../components/ErrorFallback';
import { EmptyState } from '../../components/EmptyState';
import { getUserData } from '../../../actions/user/get-user-data';
import SearchDashboard from '../../components/SearchDashboard';
import { LoaderDog } from '../../components/LoaderDog';
import { IconComponent } from '../admin/components/Icon';
import Tooltip from '../../components/Tooltip';
import { StudentModal } from './components/StudentModal';
import { InstitutionExportModal } from './components/InstitutionExportModal';
import { InstitutionImportModal } from './components/InstitutionImportModal';
import { useNotificationStore } from '../../store/notification/useNotificationStore';

const StudentPage = () => {
    
    // useEffect(() => {
    //     // console.log('👨‍🎓 StudentPage: Component mounted');
    //     return () => 
    //         console.log('👨‍🎓 StudentPage: Component unmounted');
    // }, []);
    
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filters, setFilters] = useState<{
        grade?: string;
        group?: string;
        shift?: string;
        performance?: number;
        status?: string;
        search?: string;
    }>({});    const queryClient = useQueryClient();
    const { addNotification } = useNotificationStore();    const statusMutation = useMutation({
        mutationFn: ({ studentId, status }: { studentId: number; status: string }) =>
            updateStudentStatus(studentId, status),
        onSuccess: () => {
            // Refetch the students data to update the UI
            queryClient.invalidateQueries({ queryKey: ['students'] });
            addNotification({
                message: 'Estado del estudiante actualizado correctamente',
                type: 'message',
                position: 'top',
                duration: 2000
            });
        },
        onError: (error: Error) => {
            addNotification({
                message: error.message || 'Error al actualizar el estado del estudiante',
                type: 'error',
                position: 'top',
                duration: 2000
            });
        }
    });    const { role } = useAuthStore();
    const { data: userData } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getUserData(),
        enabled: role === 'INSTITUTION_ADMIN',
    });const { isLoading, data: students, isError, refetch } = useQuery({
        queryKey: ['students', currentPage, pageSize, filters],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getStudentsByPage(currentPage, pageSize, filters),
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);    

    // Sort students data based on sortConfig
    const sortedStudents = useMemo(() => {
        if (!students?.content || !sortConfig) {
            return students?.content || [];
        }

        const sorted = [...students.content].sort((a, b) => {
            if (sortConfig.key === 'performance') {
                // Sort by performance value
                const aPerf = a.academicPerformance?.performance ?? -1; // Put null values at end for asc
                const bPerf = b.academicPerformance?.performance ?? -1;
                
                // Handle null values: put them at the end for ascending, at the beginning for descending
                if (aPerf === -1 && bPerf === -1) return 0;
                if (aPerf === -1) return sortConfig.direction === 'asc' ? 1 : -1;
                if (bPerf === -1) return sortConfig.direction === 'asc' ? -1 : 1;
                
                return sortConfig.direction === 'asc' ? aPerf - bPerf : bPerf - aPerf;
            }
            
            return 0;
        });

        return sorted;
    }, [students?.content, sortConfig]);    // Opciones memoizadas para los filtros
    const gradeOptions = useMemo(() => {
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
        userData?.groups?.map((group) => ({
            label: `Grupo ${group}`,
            value: group,
        })) || [],
        [userData?.groups]
    );

    const shiftOptions = useMemo(() => 
        userData?.shifts?.map((shift) => ({
            label: shift === 'MORNING' ? 'Mañana' : 'Tarde',
            value: shift,
        })) || [],
        [userData?.shifts]
    );

    const performanceOptions = useMemo(() => 
        userData?.thresholds?.map((threshold) => ({
            label: `≥ ${threshold.toFixed(1)}`,
            value: threshold.toString(),
        })) || [],
        [userData?.thresholds]
    );

    const statusOptions = useMemo(() => [
        { label: "ACTIVO", value: "ACTIVE" },
        { label: "INACTIVO", value: "INACTIVE" },
        { label: "PENDIENTE", value: "PENDING" },
    ], []);

    // Función para resetear página cuando se aplican filtros
    const setFiltersWithPageReset = useCallback((updaterFn: (prev: typeof filters) => typeof filters) => {
        setCurrentPage(0);
        setFilters(updaterFn);
    }, []);

    // Funciones específicas para cada filtro
    const setSearch = useCallback((value: string) => {
        setFiltersWithPageReset((prev) => ({ ...prev, search: value || undefined }));
    }, [setFiltersWithPageReset]);

    const setGrade = useCallback((grade: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, grade }));
    }, [setFiltersWithPageReset]);

    const setGroup = useCallback((group: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, group }));
    }, [setFiltersWithPageReset]);

    const setShift = useCallback((shift: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, shift }));
    }, [setFiltersWithPageReset]);

    const setPerformance = useCallback((performance: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ 
            ...prev, 
            performance: performance ? Number(performance) : undefined 
        }));
    }, [setFiltersWithPageReset]);

    const setStatus = useCallback((status: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, status }));
    }, [setFiltersWithPageReset]);

    // Función para remover filtros individuales
    const removeFilter = useCallback((key: string) => {
        setFiltersWithPageReset((prev) => {
            const updated = { ...prev };
            delete updated[key as keyof typeof prev];
            return updated;
        });
    }, [setFiltersWithPageReset]);    const handleEditStudent = useCallback((student: any) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setSelectedStudent(null);
    }, []);

    const handleOpenCreateModal = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);    const handleCloseCreateModal = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleOpenExportModal = useCallback(() => {
        setIsExportModalOpen(true);
    }, []);

    const handleOpenImportModal = useCallback(() => {
        setIsImportModalOpen(true);
    }, []);

    const handleCloseExportModal = useCallback(() => {
        setIsExportModalOpen(false);
    }, []);

    const handleCloseImportModal = useCallback(() => {
        setIsImportModalOpen(false);
    }, []);

    const handleStudentStatusToggle = useCallback(async (studentId: number, newStatus: string) => {
        await statusMutation.mutateAsync({ studentId, status: newStatus });
    }, [statusMutation]);    const handleViewStudentDetails = useCallback((student: any) => {        // TODO: Implement student details modal/view
        alert(`Ver detalles de: ${student.firstName} ${student.lastName}`);
    }, []);    

    const handleSort = useCallback((key: string) => {
        setSortConfig(prevConfig => {
            if (prevConfig?.key === key) {
                return prevConfig.direction === 'asc' 
                    ? { key, direction: 'desc' }
                    : null; // Remove sorting on third click
            }
            return { key, direction: 'asc' };
        });
    }, []);

    const handleExport = useCallback(async (exportFilters: {
        search?: string;
        status?: string;
        performance?: number;
        gradeNames?: string[];
        groupNames?: string[];
        shifts?: string[];
        teacherIds?: string[];
        gradeThreshold?: number;
        selectedStudents?: StudentForSelection[];
        template: boolean;
        delimiter: string;
    }) => {
        try {
            await exportStudents(exportFilters);
            addNotification({
                type: 'message',
                message: 'Estudiantes exportados exitosamente',
                position: 'right-top',
                duration: 3000,
            });
        } catch (error) {
            addNotification({
                type: 'error',
                message: 'Error al exportar estudiantes',
                position: 'right-top',
                duration: 5000,
            });
        }
    }, [addNotification]);

    const handleImport = useCallback(async (file: File, updateExisting: boolean, deleteNotFound: boolean) => {
        try {
            await importStudents(file, updateExisting, deleteNotFound);
            addNotification({
                type: 'message',
                message: 'Estudiantes importados exitosamente',
                position: 'right-top',
                duration: 3000,
            });
            // Refresh the data
            queryClient.invalidateQueries({ queryKey: ['students'] });
        } catch (error) {
            addNotification({
                type: 'error',
                message: 'Error al importar estudiantes',
                position: 'right-top',
                duration: 5000,
            });
        }
    }, [addNotification, queryClient]);    return (
        <div className="pb-4">
            <h1 className="title-main mt-10">Estudiantes</h1><div className='flex items-start justify-between mt-[30px]'>
                <div className="flex items-center gap-3">
                    <CustomButton 
                        label="Agregar estudiante" 
                        icon='Plus' 
                        onClick={handleOpenCreateModal}
                    />
                </div>
                <div className="w-64">
                    <SearchDashboard 
                        search={filters.search || ''}
                        setSearch={setSearch}
                    />
                </div>
            </div>

            <div className='flex items-center gap-4 mt-[30px]'>
                <CustomSelector
                    label="Grado"
                    value={filters.grade}
                    options={gradeOptions}
                    onChange={setGrade}
                />
                <CustomSelector
                    label="Grupo"
                    value={filters.group}
                    options={groupOptions}
                    onChange={setGroup}
                />
                <CustomSelector
                    label="Jornada"
                    value={filters.shift}
                    options={shiftOptions}
                    onChange={setShift}
                />
                <CustomSelector
                    label="Desempeño"
                    value={filters.performance?.toString()}
                    options={performanceOptions}
                    onChange={setPerformance}
                />
                <CustomSelector
                    label="Estado"
                    value={filters.status}
                    options={statusOptions}
                    onChange={setStatus}
                />                {Object.entries(filters)
                    .filter(([key, value]) => value !== null && value !== undefined && key !== 'search')
                    .map(([key, value]) => (
                        <SelectedTag
                            key={key}
                            label={value!.toString()}
                            onRemove={() => removeFilter(key)}
                        />                    ))}
            </div>            {/* Import/Export buttons */}
            <div className="flex justify-end gap-3 mt-4 mb-4">
                <button
                    onClick={handleOpenImportModal}
                    className="h-[40px] px-4 py-2 border border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-[14px] leading-[14px] font-medium group"
                >                    <IconComponent name="UploadIcon" size={14} color="#d1d5db" />
                    Importar lista
                </button>
                <button
                    onClick={handleOpenExportModal}
                    className="h-[40px] px-4 py-2 border border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-[14px] leading-[14px] font-medium group"
                >
                    <IconComponent name="DownloadIcon" size={14} color="#d1d5db" />
                    Exportar lista
                </button>
            </div>

            <div className="mt-[30px]">
                {isLoading ? (
                    <LoaderDog width={100} height={100} className="mt-[50px]" />
                ) : isError ? (
                    <ErrorFallback 
                        title="Error de conexión"
                        message="No se pudieron cargar los estudiantes. Verifica tu conexión a internet e inténtalo nuevamente."
                        onRetry={handleRetry}
                    />
                ) : students?.content && students.content.length === 0 ? (
                    <EmptyState 
                        title="No hay estudiantes"                        message={filters.search 
                            ? `No se encontraron estudiantes que coincidan con "${filters.search}".`
                            : Object.keys(filters).filter(key => key !== 'search').length > 0 
                                ? "No se encontraron estudiantes que coincidan con los filtros aplicados."
                                : "No hay estudiantes registrados en el sistema. ¡Crea el primer estudiante!"
                        }
                        actionLabel="Nuevo estudiante"
                        onAction={handleOpenCreateModal}
                        icon="Student"
                    />
                ) : (                    <TableCustomAdmin
                        headers={[
                            'Código', 
                            'Apellido', 
                            'Nombre', 
                            'Grado', 
                            { title: 'Promedio', sortable: true, sortKey: 'performance' }, 
                            'Estado', 
                            'Acciones'
                        ]}
                        data={sortedStudents}
                        withRowBorder
                        withCellGap={false}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        rowRenderer={(student) => (
                            <>
                                <td className="px-4 py-2">{student.studentCode}</td>                                <td className="px-4 py-2">{student.lastName}</td>
                                <td className="px-4 py-2">{student.firstName}</td>
                                <td className="px-4 py-2">
                                    {student.academicPerformance?.grade && student.academicPerformance?.group
                                        ? `${student.academicPerformance.grade}${student.academicPerformance.group}`
                                        : '-'
                                    }
                                </td><td className="px-4 py-2">
                                    {(() => {
                                        const performance = student.academicPerformance?.performance;
                                        return performance !== null && performance !== undefined && typeof performance === 'number'
                                            ? performance.toFixed(1)
                                            : '-';
                                    })()}
                                </td>
                                <td className="px-4 py-2">
                                    <StatusToggle 
                                        status={student.status}
                                        onToggle={(newStatus) => handleStudentStatusToggle(student.id, newStatus)}
                                    />
                                </td><td className="px-4 py-2 flex gap-2">
                                    <Tooltip text="Ver detalles" position="top">
                                        <div 
                                            className="cursor-pointer hover:text-blue-600"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleViewStudentDetails(student);
                                            }}
                                        >
                                            <IconComponent name='SearchIcon' />
                                        </div>
                                    </Tooltip>
                                    <Tooltip text="Editar estudiante" position="top">
                                        <div 
                                            className="cursor-pointer hover:text-blue-600"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEditStudent(student);
                                            }}
                                        >
                                            <IconComponent name='EditIcon' />
                                        </div>
                                    </Tooltip>
                                </td>
                            </>                        )}
                        totalElements={students?.totalElements}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />)}
            </div>            <StudentModal 
                isOpen={isEditModalOpen} 
                onClose={handleCloseEditModal}
                mode="edit"
                studentData={selectedStudent}
            />

            <StudentModal 
                isOpen={isCreateModalOpen} 
                onClose={handleCloseCreateModal}
                mode="create"
            />            <InstitutionExportModal 
                isOpen={isExportModalOpen}
                onClose={handleCloseExportModal}
                onExport={handleExport}
                currentFilters={filters}
                title="Exportar Estudiantes"
                searchPlaceholder="Buscar estudiantes..."
                type="students"
            />

            <InstitutionImportModal 
                isOpen={isImportModalOpen}
                onClose={handleCloseImportModal}
                onImport={handleImport}                title="Importar Estudiantes"
            />
        </div>
    );
};

export default StudentPage;