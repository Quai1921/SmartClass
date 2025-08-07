import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { getCourses } from '../../../actions/courses/get-courses';
import { deleteCourse } from '../../../actions/courses/delete-course';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { LoaderDog } from '../../components/LoaderDog';
import { useNotificationStore } from '../../store/notification/useNotificationStore';
import { CourseModal } from './components/CourseModal';
import ErrorBoundary from '../../components/ErrorBoundary';

const MyCourses = () => {
    
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const queryClient = useQueryClient();
    const { addNotification } = useNotificationStore();
    const { token } = useAuthStore();

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

    const { isLoading, data: coursesResponse, isError, refetch } = useQuery({
        queryKey: ['courses'],
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        queryFn: () => getCourses(),
        enabled: !!token,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    const courses = coursesResponse?.data || [];

    // Filter courses based on search term
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (courseId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            deleteMutation.mutate(courseId);
        }
    };

    const handleEdit = (course: any) => {
        setSelectedCourse(course);
        setIsEditModalOpen(true);
    };

    const handleViewModules = (courseId: string) => {
        navigate(`/modules?courseId=${courseId}`);
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-500 text-4xl mb-4">❌</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los cursos</h3>
                <p className="text-gray-500 mb-4">Hubo un problema al obtener la información de tus cursos.</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

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
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Crear Nuevo Curso
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar cursos
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por título, descripción o materia..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="bg-white rounded-lg shadow-sm">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <LoaderDog width={150} height={150} />
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {courses.length === 0 ? 'No tienes cursos creados' : 'No se encontraron cursos'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {courses.length === 0 
                                    ? 'Comienza creando tu primer curso educativo'
                                    : 'Intenta con diferentes términos de búsqueda'
                                }
                            </p>
                            {courses.length === 0 && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Crear mi primer curso
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {filteredCourses.map((course) => (
                                    <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Course Banner */}
                                        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            {course.banner ? (
                                                <img 
                                                    src={course.banner} 
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-white text-6xl">📚</div>
                                            )}
                                        </div>

                                        {/* Course Info */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {course.title}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    course.status === 'PUBLISHED' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : course.status === 'IN_REVIEW' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {course.status === 'PUBLISHED' ? 'Publicado' : course.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {course.description || 'Sin descripción'}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <span>{course.subject || 'Sin materia'}</span>
                                                <span>Grado {course.grade || 'N/A'}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() => handleViewModules(course.id)}
                                                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Ver módulos →
                                                </button>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(course)}
                                                        className="p-1 text-gray-600 hover:text-gray-800 rounded"
                                                        title="Editar curso"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="p-1 text-red-600 hover:text-red-800 rounded"
                                                        disabled={deleteMutation.isPending}
                                                        title="Eliminar curso"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
