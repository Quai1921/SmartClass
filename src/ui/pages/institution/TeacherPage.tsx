import { useState, useCallback, useMemo, useEffect } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomSelector from '../../components/CustomSelector';
import { SelectedTag } from '../../components/SelectTag';
import TableCustomAdmin from '../../components/TableCustomAdmin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeachersByPage } from '../../../actions/teacher/get-teachers-by-page';
import { updateTeacherStatus } from '../../../actions/teacher/update-teacher-status';
import { exportTeachers } from '../../../actions/teacher/export-teachers';
import type { TeacherForSelection } from '../../../actions/teacher/get-teachers-for-selection';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { importTeachers } from '../../../actions/teacher/import-teachers';
import { StatusToggle } from '../../components/StatusToggle';
import { ErrorFallback } from '../../components/ErrorFallback';
import { EmptyState } from '../../components/EmptyState';
import SearchDashboard from '../../components/SearchDashboard';
import { getUserData } from '../../../actions/user/get-user-data';
import { LoaderDog } from '../../components/LoaderDog';
import { IconComponent } from '../admin/components/Icon';
import Tooltip from '../../components/Tooltip';
import { TeacherModal } from './components/TeacherModal';
import { InstitutionExportModal } from './components/InstitutionExportModal';
import { InstitutionImportModal } from './components/InstitutionImportModal';
import { useNotificationStore } from '../../store/notification/useNotificationStore';
import ErrorBoundary from '../../components/ErrorBoundary';

const TeacherPage = () => {

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filters, setFilters] = useState<{
        grade?: string;
        group?: string;
        shift?: string;
        performance?: number;
        status?: string;
        search?: string;
    }>({});

    const queryClient = useQueryClient();
    const { addNotification } = useNotificationStore();

    const statusMutation = useMutation({
        mutationFn: ({ teacherId, status }: { teacherId: string; status: string }) =>
            updateTeacherStatus(teacherId, status),
        onSuccess: () => {
            // Refetch the teachers data to update the UI
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
            addNotification({
                message: 'Estado del docente actualizado correctamente',
                type: 'message',
                position: 'top',
                duration: 2000
            });
        },
        onError: (error: Error) => {
            addNotification({
                message: error.message || 'Error al actualizar el estado del docente',
                type: 'error',
                position: 'top',
                duration: 2000
            });
        }
    }); const { role } = useAuthStore();
    const { data: userData } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getUserData(),
        enabled: role === 'INSTITUTION_ADMIN',
    }); const { isLoading, data: teachers, isError, refetch } = useQuery({
        queryKey: ['teachers', currentPage, pageSize, filters],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getTeachersByPage(currentPage, pageSize, filters),
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    }); const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    // Sort teachers data based on sortConfig
    const sortedTeachers = useMemo(() => {
        if (!teachers?.content || !sortConfig) {
            return teachers?.content || [];
        } const sorted = [...teachers.content].sort((a, b) => {
            if (sortConfig.key === 'groups') {
                // Sort by number of group assignments
                const aGroupCount = a.currentAssignments?.length || 0;
                const bGroupCount = b.currentAssignments?.length || 0;
                return sortConfig.direction === 'asc' ? aGroupCount - bGroupCount : bGroupCount - aGroupCount;
            }

            // if (sortConfig.key === 'performance') {
            //     // Sort by average performance
            //     const getAvgPerformance = (teacher: any) => {
            //         if (!teacher.currentAssignments || teacher.currentAssignments.length === 0) return 0;
            //         const validPerformances = teacher.currentAssignments
            //             .map((a: any) => a.performance)
            //             .filter((p: any) => p !== null && p !== undefined);
            //         return validPerformances.length > 0
            //             ? validPerformances.reduce((sum: number, p: number) => sum + p, 0) / validPerformances.length
            //             : 0;
            //     };

            //     const aPerf = getAvgPerformance(a);
            //     const bPerf = getAvgPerformance(b);
            //     return sortConfig.direction === 'asc' ? aPerf - bPerf : bPerf - aPerf;
            // }
            if (sortConfig.key === 'performance') {
                // Sort by average performance across all courses
                const getAvgPerformance = (teacher: any) => {
                    if (!teacher.currentAssignments || teacher.currentAssignments.length === 0) return 0;

                    const validPerformances = teacher.currentAssignments
                        .map((a: any) => a.performance)
                        .filter((p: any) => p !== null && p !== undefined)
                        .map((p: any) => typeof p === 'string' ? parseFloat(p) : Number(p))
                        .filter((p: number) => !isNaN(p));

                    return validPerformances.length > 0
                        ? validPerformances.reduce((sum: number, p: number) => sum + p, 0) / validPerformances.length
                        : 0;
                };

                const aPerf = getAvgPerformance(a);
                const bPerf = getAvgPerformance(b);
                return sortConfig.direction === 'asc' ? aPerf - bPerf : bPerf - aPerf;
            }

            return 0;
        });

        return sorted;
    }, [teachers?.content, sortConfig]);    // Opciones memoizadas para los filtros
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
    ); const performanceOptions = useMemo(() =>
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
    }, [setFiltersWithPageReset]); const handleEditTeacher = useCallback((teacher: any) => {
        setSelectedTeacher(teacher);
        setIsEditModalOpen(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setSelectedTeacher(null);
    }, []); const handleOpenCreateModal = useCallback(() => {
;
        try {
            setIsCreateModalOpen(true);
        } catch (error) {
            // console.error('❌ Error opening modal:', error);
        }
    }, [isCreateModalOpen]); const handleCloseCreateModal = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    // Add debug logging for modal state
    // useEffect(() => {
    //     // console.log('👨‍🏫 TeacherPage: Component mounted');
    //     return () => 
    //         console.log('👨‍🏫 TeacherPage: Component unmounted');
    // }, []);

    useEffect(() => {
    }, [isCreateModalOpen]);

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

    const handleTeacherStatusToggle = useCallback(async (teacherId: string, newStatus: string) => {
        await statusMutation.mutateAsync({ teacherId, status: newStatus });
    }, [statusMutation]); const handleViewTeacherDetails = useCallback((teacher: any) => {        // TODO: Implement teacher details modal/view
        alert(`Ver detalles de: ${teacher.firstName} ${teacher.lastName}`);
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
        selectedTeachers?: TeacherForSelection[];
        template: boolean;
        delimiter: string;
    }) => {
        try {
            await exportTeachers(exportFilters);
            addNotification({
                type: 'message',
                message: 'Docentes exportados exitosamente',
                position: 'right-top',
                duration: 3000,
            });
        } catch (error) {
            addNotification({
                type: 'error',
                message: 'Error al exportar docentes',
                position: 'right-top',
                duration: 5000,
            });
        }
    }, [addNotification]);

    const handleImport = useCallback(async (file: File, updateExisting: boolean, deleteNotFound: boolean) => {
        try {
            await importTeachers(file, updateExisting, deleteNotFound);
            addNotification({
                type: 'message',
                message: 'Docentes importados exitosamente',
                position: 'right-top',
                duration: 3000,
            });
            // Refresh the data
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        } catch (error) {
            addNotification({
                type: 'error',
                message: 'Error al importar docentes',
                position: 'right-top',
                duration: 5000,
            });
        }
    }, [addNotification, queryClient]); return (
        <div className="pb-4">
            <h1 className="title-main mt-10">Docentes</h1><div className='flex items-start justify-between mt-[30px]'>
                <div className="flex items-center gap-3">
                    <CustomButton
                        label="Agregar docente"
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
                    label="Seleccione Estado"
                    value={filters.status}
                    width="w-[162px]"
                    options={statusOptions}
                    onChange={setStatus}
                />                {Object.entries(filters)
                    .filter(([key, value]) => value !== null && value !== undefined && key !== 'search')
                    .map(([key, value]) => (
                        <SelectedTag
                            key={key}
                            label={value!.toString()}
                            onRemove={() => removeFilter(key)}
                        />))}
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
                        message="No se pudieron cargar los docentes. Verifica tu conexión a internet e inténtalo nuevamente."
                        onRetry={handleRetry}
                    />
                ) : teachers?.content && teachers.content.length === 0 ? (
                    <EmptyState
                        title="No hay docentes" message={filters.search
                            ? `No se encontraron docentes que coincidan con "${filters.search}".`
                            : Object.keys(filters).filter(key => key !== 'search').length > 0
                                ? "No se encontraron docentes que coincidan con los filtros aplicados."
                                : "No hay docentes registrados en el sistema. ¡Crea el primer docente!"
                        }
                        actionLabel="Nuevo docente"
                        onAction={handleOpenCreateModal}
                        icon="Teacher"
                    />
                ) : (<TableCustomAdmin
                    headers={[
                        'Documento de identidad',
                        'Nombre y apellido',
                        { title: 'Grupos a cargo', sortable: true, sortKey: 'groups' },
                        { title: 'Promedio', sortable: true, sortKey: 'performance' },
                        'Estado',
                        'Acciones'
                    ]}
                    data={sortedTeachers}
                    withRowBorder
                    withCellGap={false}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    rowRenderer={(teacher) => (
                        <>
                            <td className="px-4 py-2">{teacher.identificationNumber}</td>
                            <td className="px-4 py-2">{teacher.firstName} {teacher.lastName}</td>
                            <td className="px-4 py-2">
                                {/* {teacher.currentAssignments && teacher.currentAssignments.length > 0 ? (
                                    teacher.currentAssignments.map((assignment, index) => (
                                        <span key={index}>
                                            {assignment.grade}{assignment.group}
                                            {index < teacher.currentAssignments.length - 1 && ', '}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )} */}

                                {/* {teacher.currentAssignments && teacher.currentAssignments.length > 0 ? (
                                    <div className="space-y-1">
                                        {teacher.currentAssignments.map((assignment, index) => (
                                            <div key={index} className="text-sm">
                                                {assignment.grade}{assignment.group}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )} */}



                                {teacher.currentAssignments && teacher.currentAssignments.length > 0 ? (
                                    <div className="group relative">
                                        <div className="cursor-pointer">
                                            <div className="font-medium text-sm">
                                                {teacher.currentAssignments.length} {teacher.currentAssignments.length === 1 ? 'curso' : 'cursos'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {(() => {
                                                    const validPerformances = teacher.currentAssignments
                                                        .map(a => a.performance)
                                                        .filter(p => p !== null && p !== undefined)
                                                        .map(p => typeof p === 'string' ? parseFloat(p) : Number(p))
                                                        .filter(p => !isNaN(p));

                                                    if (validPerformances.length === 0) return 'Sin promedio';

                                                    const avg = validPerformances.reduce((sum, p) => sum + p, 0) / validPerformances.length;
                                                    return `Prom: ${avg.toFixed(1)}`;
                                                })()}
                                            </div>
                                        </div>

                                        {/* Tooltip expandido */}
                                        <div className="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                            {teacher.currentAssignments.map((assignment, index) => {
                                                const performance = typeof assignment.performance === 'string'
                                                    ? parseFloat(assignment.performance)
                                                    : Number(assignment.performance);

                                                return (
                                                    <div key={index}>
                                                        {assignment.grade}{assignment.group}: {!isNaN(performance) ? performance.toFixed(1) : 'N/A'}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td><td className="px-4 py-2">
                                {/* {(() => {
                                    if (!teacher.currentAssignments || teacher.currentAssignments.length === 0) {
                                        return (<span className="text-gray-400">-</span>);
                                    }

                                    // Calculate average performance from all assignments
                                    const validPerformances = teacher.currentAssignments
                                        .map(a => a.performance)
                                        .filter(p => p !== null && p !== undefined);

                                    if (validPerformances.length === 0) {
                                        return <span className="text-gray-400">-</span>;
                                    }

                                    const averagePerformance = validPerformances.reduce((sum, p) => sum + p, 0) / validPerformances.length;
                                    return averagePerformance.toFixed(1);
                                })()} */}


                                {/* {(() => {
                                    if (!teacher.currentAssignments || teacher.currentAssignments.length === 0) {
                                        return <span className="text-gray-400">-</span>;
                                    }

                                    // Show each course with its individual performance
                                    const coursePerformances = teacher.currentAssignments
                                        .filter(assignment => assignment.performance !== null && assignment.performance !== undefined)
                                        .map((assignment) => {
                                            // Convert performance to number
                                            const performance = typeof assignment.performance === 'string'
                                                ? parseFloat(assignment.performance)
                                                : Number(assignment.performance);

                                            // Skip if performance is invalid
                                            if (isNaN(performance)) return null;

                                            return (
                                                <span className="ml-1 font-medium">
                                                    {performance.toFixed(1)}
                                                </span>

                                            );
                                        })
                                        .filter(Boolean); // Remove null values

                                    if (coursePerformances.length === 0) {
                                        return <span className="text-gray-400">-</span>;
                                    }

                                    // If there's only one course, show it simply
                                    if (coursePerformances.length === 1) {
                                        return coursePerformances[0];
                                    }

                                    // If there are multiple courses, show them with separators
                                    return (
                                        <div className="space-y-1">
                                            {coursePerformances.map((course, index) => (
                                                <div key={index} className="text-sm">
                                                    {course}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()} */}


                                {(() => {
                                    if (!teacher.currentAssignments || teacher.currentAssignments.length === 0) {
                                        return <span className="text-gray-400">-</span>;
                                    }

                                    const coursePerformances = teacher.currentAssignments
                                        .filter(assignment => assignment.performance !== null && assignment.performance !== undefined)
                                        .map((assignment) => {
                                            const performance = typeof assignment.performance === 'string'
                                                ? parseFloat(assignment.performance)
                                                : Number(assignment.performance);

                                            if (isNaN(performance)) return null;

                                            return {
                                                course: `${assignment.grade}${assignment.group}`,
                                                performance: performance.toFixed(1)
                                            };
                                        })
                                        .filter(Boolean);

                                    if (coursePerformances.length === 0) {
                                        return <span className="text-gray-400">-</span>;
                                    }

                                    // Si hay 1-2 cursos, mostrar inline
                                    if (coursePerformances.length <= 2) {
                                        return (
                                            <div className="space-y-0.5">
                                                {coursePerformances.map((item, index) => (
                                                    <div key={index} className="text-xs">
                                                        {/* <span className="text-gray-500">{item?.course}:</span> */}
                                                        <span className="ml-1 font-medium">{item?.performance}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }

                                    // Si hay más de 2, mostrar promedio general + tooltip con detalles
                                    const avgPerformance = coursePerformances?.reduce((sum, item) =>
                                        item ? sum + parseFloat(item.performance) : sum, 0) / coursePerformances?.length;

                                    return (
                                        <Tooltip
                                            text={coursePerformances.map(item =>
                                                `${item?.course}: ${item?.performance}`).join('\n')}
                                            position="top"
                                        >
                                            <div className="text-center">
                                                <div className="font-medium">{avgPerformance.toFixed(1)}</div>
                                                {/* <div className="text-xs text-gray-500">promedio</div> */}
                                            </div>
                                        </Tooltip>
                                    );
                                })()}



                            </td>
                            <td className="px-4 py-2">
                                <StatusToggle
                                    status={teacher.status}
                                    onToggle={(newStatus) => handleTeacherStatusToggle(teacher.id, newStatus)}
                                />
                            </td><td className="px-4 py-2 flex gap-2">
                                <Tooltip text="Ver detalles" position="top">
                                    <div
                                        className="cursor-pointer hover:text-blue-600"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleViewTeacherDetails(teacher);
                                        }}
                                    >
                                        <IconComponent name='SearchIcon' />
                                    </div>
                                </Tooltip>
                                <Tooltip text="Editar docente" position="top">
                                    <div
                                        className="cursor-pointer hover:text-blue-600"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditTeacher(teacher);
                                        }}
                                    >
                                        <IconComponent name='EditIcon' />
                                    </div>
                                </Tooltip>
                            </td>
                        </>)}
                    totalElements={teachers?.totalElements}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />)}
            </div>            <TeacherModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                mode="edit"
                teacher={selectedTeacher}
            />            <ErrorBoundary>
                <TeacherModal
                    isOpen={isCreateModalOpen}
                    onClose={handleCloseCreateModal}
                    mode="create"
                />
            </ErrorBoundary><InstitutionExportModal
                isOpen={isExportModalOpen}
                onClose={handleCloseExportModal}
                onExport={handleExport}
                currentFilters={filters}
                title="Exportar Docentes"
                searchPlaceholder="Buscar docentes..."
                type="teachers"
            />

            <InstitutionImportModal
                isOpen={isImportModalOpen}
                onClose={handleCloseImportModal}
                onImport={handleImport} title="Importar Docentes"
            />
        </div>
    );
};

export default TeacherPage;