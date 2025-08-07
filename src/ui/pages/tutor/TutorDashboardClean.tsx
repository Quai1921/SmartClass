import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router';
import { getUserData } from '../../../actions/user/get-user-data';
import { getCourses } from '../../../actions/courses/get-courses';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { LoaderDog } from "../../components/LoaderDog";

const TutorDashboardClean = () => {
    
    const { token, role } = useAuthStore();
    const navigate = useNavigate();
    
    // Debug logging
    
    // 📊 Fetch tutor data
    const { data: userData, isLoading: loadingUser } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 30,
        queryFn: () => getUserData(),
        enabled: !!token && role === 'TUTOR',
    });

    // 📚 Fetch tutor's courses
    const { data: coursesResponse, isLoading: loadingCourses } = useQuery({
        queryKey: ['tutorCourses'],
        staleTime: 1000 * 60 * 30,
        queryFn: () => getCourses(),
        enabled: !!token && role === 'TUTOR',
    });

    // 🔄 Loading states
    if (loadingUser) return <LoaderDog width={200} height={200} />;
    if (!userData) return <p>Error cargando datos del usuario.</p>;

    // 📊 Calculate basic stats
    const courses = coursesResponse?.data || [];
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((course: any) => course.status === 'PUBLISHED').length;
    const draftCourses = courses.filter((course: any) => course.status === 'DRAFT').length;
    const inReviewCourses = courses.filter((course: any) => course.status === 'IN_REVIEW').length;

    return (
        <div className="bg-gray-50 min-h-full">
            {/* 👋 Welcome Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Hola, {userData?.userFirstName || 'Tutor'}
                </h1>
                <p className="text-lg text-gray-600">
                    Bienvenido a tu panel de tutor. Aquí podrás gestionar tus cursos y crear contenido educativo.
                </p>
            </div>

            {/* 📊 Simple KPI Cards */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Resumen de tu actividad
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Courses */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-3xl">📚</div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    {totalCourses}
                                </div>
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                            Cursos totales
                        </h3>
                        <p className="text-xs text-gray-500">
                            {publishedCourses} publicados, {draftCourses} borradores, {inReviewCourses} en revisión
                        </p>
                    </div>

                    {/* Published Courses */}
                    <div className="bg-green-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-3xl">✅</div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    {publishedCourses}
                                </div>
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                            Cursos publicados
                        </h3>
                        <p className="text-xs text-gray-500">
                            Disponibles para estudiantes
                        </p>
                    </div>

                    {/* Draft Courses */}
                    <div className="bg-yellow-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-3xl">📝</div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    {draftCourses}
                                </div>
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                            Borradores
                        </h3>
                        <p className="text-xs text-gray-500">
                            En desarrollo
                        </p>
                    </div>
                </div>
            </div>

            {/* 📚 Courses & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* Recent Courses */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Mis cursos
                        </h3>
                        <button
                            onClick={() => navigate('/mis-cursos')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Ver todos →
                        </button>
                    </div>
                    
                    {loadingCourses ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="space-y-4">
                            {courses.slice(0, 3).map((course: any, index: number) => (
                                <div key={course.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600">📚</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{course.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {course.subject} - Grado {course.grade}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        course.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 
                                        course.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {course.status === 'PUBLISHED' ? 'Publicado' : course.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500 mb-4">No tienes cursos creados aún</p>
                            <button
                                onClick={() => navigate('/crear-curso')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Crear mi primer curso
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Acciones rápidas
                    </h3>
                    
                    <div className="space-y-4">
                        <div 
                            className="bg-blue-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => navigate('/crear-curso')}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">➕</div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Crear nuevo curso</h4>
                                    <p className="text-sm text-gray-600">Diseña y publica un nuevo curso educativo</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="bg-green-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => navigate('/mis-cursos')}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">📖</div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Gestionar cursos</h4>
                                    <p className="text-sm text-gray-600">Edita y administra tus cursos existentes</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="bg-purple-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => navigate('/page-builder')}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">🎨</div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Diseñar contenido</h4>
                                    <p className="text-sm text-gray-600">Usa el constructor visual de páginas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboardClean;
