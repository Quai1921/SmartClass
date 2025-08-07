import { useState, useCallback, useMemo } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomSelector from '../../components/CustomSelector';
import { SelectedTag } from '../../components/SelectTag';
import TableCustomAdmin from '../../components/TableCustomAdmin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses } from '../../../actions/courses/get-courses';
import { deleteCourse } from '../../../actions/courses/delete-course';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { ErrorFallback } from '../../components/ErrorFallback';
import { EmptyState } from '../../components/EmptyState';
import { getUserData } from '../../../actions/user/get-user-data';
import SearchDashboard from '../../components/SearchDashboard';
import { LoaderDog } from '../../components/LoaderDog';
import { IconComponent } from '../admin/components/Icon';
import Tooltip from '../../components/Tooltip';
import { useNotificationStore } from '../../store/notification/useNotificationStore';
import { CourseModal } from './components/CourseModal';
import ErrorBoundary from '../../components/ErrorBoundary';

const MyCourses = () => {
    
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filters, setFilters] = useState<{
        subject?: string;
        grade?: string;
        published?: string;
        search?: string;
    }>({});

    const queryClient = useQueryClient();
    const { addNotification } = useNotificationStore();

    const deleteMutation = useMutation({
        mutationFn: (courseId: string) => deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            addNotification({
                message: 'Curso eliminado correctamente',
                type: 'message',
                position: 'top',
                duration: 2000
            });
        },
        onError: (error: Error) => {
            addNotification({
                message: error.message || 'Error al eliminar el curso',
                type: 'error',
                position: 'top',
                duration: 2000
            });
        }
    });

    const { role } = useAuthStore();
    const { data: userData } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getUserData(),
        enabled: role === 'TUTOR',
    });

    const { isLoading, data: coursesResponse, isError, refetch } = useQuery({
        queryKey: ['courses', currentPage, pageSize, filters],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getCourses(),
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    // Sort courses data based on sortConfig
    const sortedCourses = useMemo(() => {
        const courses = coursesResponse?.data || [];
        if (!courses || !sortConfig) {
            return courses;
        }

        const sorted = [...courses].sort((a, b) => {
            if (sortConfig.key === 'enrolledStudents') {
                // Sort by enrolled students
                const aStudents = a.enrolledStudents || 0;
                const bStudents = b.enrolledStudents || 0;
                return sortConfig.direction === 'asc' ? aStudents - bStudents : bStudents - aStudents;
            }
            
            if (sortConfig.key === 'title') {
                // Sort by title
                const aVal = a.title || '';
                const bVal = b.title || '';
                return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            
            if (sortConfig.key === 'subject') {
                // Sort by subject
                const aVal = a.subject || '';
                const bVal = b.subject || '';
                return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            
            if (sortConfig.key === 'createdAt') {
                // Sort by creation date
                const aDate = new Date(a.createdAt || 0);
                const bDate = new Date(b.createdAt || 0);
                return sortConfig.direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
            }
            
            return 0;
        });

        return sorted;
    }, [coursesResponse?.data, sortConfig]);

    // Handle filters
    const filteredCourses = useMemo(() => {
        let filtered = sortedCourses;

        if (filters.search) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
                course.description?.toLowerCase().includes(filters.search!.toLowerCase()) ||
                course.subject?.toLowerCase().includes(filters.search!.toLowerCase())
            );
        }

        if (filters.subject) {
            filtered = filtered.filter(course => course.subject === filters.subject);
        }

        if (filters.grade) {
            filtered = filtered.filter(course => course.grade === filters.grade);
        }

        if (filters.published !== undefined) {
            if (filters.published === 'true') {
                filtered = filtered.filter(course => course.status === 'PUBLISHED');
            } else if (filters.published === 'false') {
                filtered = filtered.filter(course => course.status === 'DRAFT');
            }
        }

        return filtered;
    }, [sortedCourses, filters]);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleEdit = (course: any) => {
        setSelectedCourse(course);
        setIsEditModalOpen(true);
    };

    const handleDelete = (courseId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            deleteMutation.mutate(courseId);
        }
    };

    const handleViewModules = (courseId: string) => {
        window.location.href = `/modules?courseId=${courseId}`;
    };

    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? undefined : value
        }));
        setCurrentPage(0);
    }, []);

    const handleSearchChange = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search: search || undefined }));
        setCurrentPage(0);
    }, []);

    const clearFilters = () => {
        setFilters({});
        setCurrentPage(0);
    };

    const hasActiveFilters = Object.values(filters).some(filter => filter !== undefined && filter !== '');

    // Prepare data for the table
    const tableData = useMemo(() => {
        return filteredCourses.map(course => ({
            id: course.id,
            title: course.title,
            subject: course.subject || 'N/A',
            grade: course.grade || 'N/A',
            status: course.status,
            enrolledStudents: course.enrolledStudents || 0,
            rating: course.rating || 0,
            createdAt: course.createdAt,
            banner: course.banner,
        }));
    }, [filteredCourses]);

    // Table columns configuration
    const columns = [
        {
            key: 'title',
            label: 'Título del Curso',
            sortable: true,
            render: (value: string, row: any) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {row.banner ? (
                            <img 
                                src={row.banner} 
                                alt={value}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <span className="text-blue-600">📚</span>
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                        <div className="text-sm text-gray-500">{row.subject}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'grade',
            label: 'Grado',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Estado',
            sortable: true,
            render: (value: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    value === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800' 
                        : value === 'IN_REVIEW' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {value === 'PUBLISHED' ? 'Publicado' : value === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
                </span>
            )
        },
        {
            key: 'enrolledStudents',
            label: 'Estudiantes',
            sortable: true,
            render: (value: number) => (
                <div className="text-center">
                    <div className="font-medium">{value}</div>
                    <div className="text-xs text-gray-500">inscritos</div>
                </div>
            )
        },
        {
            key: 'rating',
            label: 'Calificación',
            sortable: true,
            render: (value: number) => (
                <div className="flex items-center">
                    <span className="text-yellow-400">⭐</span>
                    <span className="ml-1">{value > 0 ? value.toFixed(1) : 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'createdAt',
            label: 'Fecha de Creación',
            sortable: true,
            render: (value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: (_: any, row: any) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleViewModules(row.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Ver módulos"
                    >
                        👁️
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                        title="Editar curso"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        disabled={deleteMutation.isPending}
                        title="Eliminar curso"
                    >
                        🗑️
                    </button>
                </div>
            )
        }
    ];

    if (isError) {
        return <ErrorFallback onRetry={handleRetry} />;
    }

    const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;
    const subjectsOptions = userData?.subjects || [];
    const gradesOptions = userData?.grades || [];

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Cursos</h1>
                        <p className="mt-2 text-gray-600">
                            Gestiona y visualiza todos tus cursos creados
                        </p>
                    </div>
                    <CustomButton
                        label="Crear Nuevo Curso"
                        path="/crear-curso"
                    />
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <SearchDashboard
                                onSearch={handleSearchChange}
                                placeholder="Buscar por título, descripción o materia..."
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <CustomSelector
                                options={[
                                    { label: 'Todas las materias', value: 'all' },
                                    ...subjectsOptions.map(subject => ({
                                        label: subject.name,
                                        value: subject.name
                                    }))
                                ]}
                                value={filters.subject || 'all'}
                                onChange={(value) => handleFilterChange('subject', value)}
                                placeholder="Materia"
                            />

                            <CustomSelector
                                options={[
                                    { label: 'Todos los grados', value: 'all' },
                                    ...gradesOptions.map(grade => ({
                                        label: `${grade.name}°`,
                                        value: grade.name
                                    }))
                                ]}
                                value={filters.grade || 'all'}
                                onChange={(value) => handleFilterChange('grade', value)}
                                placeholder="Grado"
                            />

                            <CustomSelector
                                options={[
                                    { label: 'Todos los estados', value: 'all' },
                                    { label: 'Publicados', value: 'true' },
                                    { label: 'Borradores', value: 'false' }
                                ]}
                                value={filters.published || 'all'}
                                onChange={(value) => handleFilterChange('published', value)}
                                placeholder="Estado"
                            />

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Limpiar filtros ({activeFiltersCount})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Tags */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {Object.entries(filters).map(([key, value]) => {
                                if (!value) return null;
                                
                                let displayValue = value;
                                if (key === 'published') {
                                    displayValue = value === 'true' ? 'Publicados' : 'Borradores';
                                }
                                
                                return (
                                    <SelectedTag
                                        key={key}
                                        text={`${key === 'search' ? 'Búsqueda' : 
                                               key === 'subject' ? 'Materia' : 
                                               key === 'grade' ? 'Grado' : 
                                               'Estado'}: ${displayValue}`}
                                        onRemove={() => handleFilterChange(key, 'all')}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="bg-white rounded-lg shadow-sm">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <LoaderDog width={150} height={150} />
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <EmptyState
                            title="No se encontraron cursos"
                            description={hasActiveFilters 
                                ? "No hay cursos que coincidan con los filtros aplicados."
                                : "Aún no has creado ningún curso. ¡Comienza creando tu primer curso!"}
                            actionLabel={hasActiveFilters ? "Limpiar filtros" : "Crear mi primer curso"}
                            onAction={hasActiveFilters ? clearFilters : () => window.location.href = '/crear-curso'}
                        />
                    ) : (
                        <>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
                                    </h3>
                                    <div className="text-sm text-gray-500">
                                        Mostrando {Math.min(pageSize, filteredCourses.length)} de {filteredCourses.length}
                                    </div>
                                </div>
                            </div>

                            <TableCustomAdmin
                                data={tableData}
                                columns={columns}
                                currentPage={currentPage}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={setPageSize}
                                onSort={handleSort}
                                sortConfig={sortConfig}
                                totalItems={filteredCourses.length}
                            />
                        </>
                    )}
                </div>

                {/* Course Modal */}
                <CourseModal 
                    isOpen={isEditModalOpen || isCreateModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setIsCreateModalOpen(false);
                        setSelectedCourse(null);
                    }}
                    mode={isEditModalOpen ? "edit" : "create"}
                    courseData={selectedCourse}
                />
            </div>
        </ErrorBoundary>
    );
};

export default MyCourses;
