import { useQuery } from "@tanstack/react-query"
import { getUpcomingHolidays, formatEventDate } from "../../../actions/calendar/get-calendar-events"
import CustomButton from '../../components/CustomButton';
import { LoaderDog } from "../../components/LoaderDog";
import { getUserData } from '../../../actions/user/get-user-data';
import { getCourses } from '../../../actions/courses/get-courses';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { TutorKpiCard } from './components/TutorKpiCard';
import { CourseCard } from './components/CourseCard';
import { QuickActionCard } from './components/QuickActionCard';

// Extended course interface for the dashboard
interface ExtendedCourse {
    id: string;
    title: string;
    banner: string;
    description: string;
    tutorName: string;
    grade: string;
    group: string;
    subject: string;
    status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
    createdAt: string;
    // Additional properties for dashboard
    enrolledStudents?: number;
    rating?: number;
}

const TutorDashboard = () => {
    
    const { token, role } = useAuthStore();
    
    // Debug logging

    
    // Ensure we're on the right route for tutors
    if (role === 'TUTOR' && window.location.pathname !== '/tutor-dashboard') {
        window.location.href = '/tutor-dashboard';
        return null;
    }
    
    // 📊 Fetch user data (tutor-specific)
    const { data: userData, isLoading: loadingUser } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 30, // 30 minutes cache
        queryFn: () => getUserData(),
        enabled: !!token,
    })

    // 📚 Fetch tutor's courses
    const { data: coursesResponse, isLoading: loadingCourses } = useQuery({
        queryKey: ['tutorCourses'],
        staleTime: 1000 * 60 * 30, // 30 minutes cache
        queryFn: () => getCourses(),
        enabled: !!token,
    })

    // 📅 Fetch upcoming events
    const { data: upcomingEvents = [], isLoading: loadingEvents } = useQuery({
        queryKey: ['upcomingHolidays'],
        staleTime: 1000 * 60 * 30, // 30 minutes cache
        queryFn: () => getUpcomingHolidays(),
        enabled: !!userData,
    })

    // 🔄 Loading states
    if (loadingUser) return <LoaderDog width={200} height={200} />
    if (!userData) return <p>Error cargando datos del usuario.</p>;

    // 📊 Calculate KPIs from courses data
    const courses = coursesResponse?.data || [];
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((course: ExtendedCourse) => course.status === 'PUBLISHED').length;
    const draftCourses = totalCourses - publishedCourses;
    
    // Calculate total enrolled students across all courses
    const totalStudents = courses.reduce((sum: number, course: ExtendedCourse) => sum + (course.enrolledStudents || 0), 0);
    
    // Calculate average rating across all courses
    const coursesWithRatings = courses.filter((course: ExtendedCourse) => course.rating && course.rating > 0);
    const averageRating = coursesWithRatings.length > 0 
        ? coursesWithRatings.reduce((sum: number, course: ExtendedCourse) => sum + (course.rating || 0), 0) / coursesWithRatings.length
        : 0;

    // 🎯 Process upcoming events
    const displayEvents = upcomingEvents.length > 0
        ? upcomingEvents.slice(0, 3).map(event => ({
            date: formatEventDate(event.startTime),
            event: event.title
        }))
        : [
            { date: "Jul 2", event: "Evaluación de progreso" },
            { date: "Jul 18", event: "Revisión de contenidos" }
        ];

    // 📊 Recent courses for quick access
    const recentCourses = courses.slice(0, 3);

    return (
        <div className="bg-gray-50 min-h-full">
            {/* 👋 Welcome Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Hola, {userData?.userFirstName || 'Tutor'}
                </h1>
                <p className="text-lg text-gray-600">
                    Bienvenido a tu panel de tutor. Aquí podrás gestionar tus cursos, ver estadísticas y acceder a herramientas de creación de contenido.
                </p>
            </div>

            {/* 📊 KPI Cards */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Resumen de tu actividad
                    </h2>
                    {(loadingCourses || loadingEvents) && (
                        <span className="text-sm text-blue-600 flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            Actualizando datos...
                        </span>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <TutorKpiCard
                        label="Cursos totales"
                        value={totalCourses}
                        subtitle={`${publishedCourses} publicados, ${draftCourses} borradores`}
                        emoji="📚"
                        bgColor="bg-blue-50"
                    />
                    <TutorKpiCard
                        label="Estudiantes inscritos"
                        value={totalStudents}
                        subtitle={totalCourses > 0 ? `en ${totalCourses} curso${totalCourses > 1 ? 's' : ''}` : "sin cursos creados"}
                        emoji="👨‍🎓"
                        bgColor="bg-green-50"
                    />
                    <TutorKpiCard
                        label="Calificación promedio"
                        value={averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                        subtitle={coursesWithRatings.length > 0 ? `basado en ${coursesWithRatings.length} curso${coursesWithRatings.length > 1 ? 's' : ''}` : "sin calificaciones"}
                        emoji="⭐"
                        bgColor="bg-yellow-50"
                    />
                    <TutorKpiCard
                        label="Próximos eventos"
                        value={displayEvents.length}
                        subtitle={loadingEvents ? "Cargando eventos..." : displayEvents.map(e => `• ${e.date} - ${e.event}`).join('\n')}
                        emoji="🗓️"
                        bgColor="bg-purple-50"
                        isEventCard={true}
                    />
                </div>
            </div>

            {/* 📚 Recent Courses & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* Recent Courses */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Cursos recientes
                        </h3>
                        <CustomButton
                            label="Ver todos"
                            path="/mis-cursos"
                        />
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
                    ) : recentCourses.length > 0 ? (
                        <div className="space-y-4">
                            {recentCourses.map((course: ExtendedCourse, index: number) => (
                                <CourseCard key={course.id || index} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500 mb-4">No tienes cursos creados aún</p>
                            <CustomButton
                                label="Crear mi primer curso"
                                path="/crear-curso"
                            />
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Acciones rápidas
                    </h3>
                    
                    <div className="space-y-4">
                        <QuickActionCard
                            icon="➕"
                            title="Crear nuevo curso"
                            description="Diseña y publica un nuevo curso educativo"
                            path="/crear-curso"
                            bgColor="bg-blue-50"
                        />
                        <QuickActionCard
                            icon="📊"
                            title="Ver estadísticas"
                            description="Analiza el rendimiento de tus cursos"
                            path="/estadisticas"
                            bgColor="bg-green-50"
                        />
                        <QuickActionCard
                            icon="🎨"
                            title="Diseñar contenido"
                            description="Usa el constructor visual de páginas"
                            path="/page-builder"
                            bgColor="bg-purple-50"
                        />
                        <QuickActionCard
                            icon="👤"
                            title="Mi perfil"
                            description="Actualiza tu información personal"
                            path="/mi-perfil"
                            bgColor="bg-orange-50"
                        />
                    </div>
                </div>
            </div>

            {/* 📈 Performance Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Rendimiento de cursos
                </h3>
                
                {courses.length > 0 ? (
                    <div className="h-64 flex items-end justify-between px-2 overflow-x-auto">
                        {courses.slice(0, 10).map((course: ExtendedCourse, index: number) => (
                            <div key={course.id || index} className="flex flex-col items-center min-w-0 flex-shrink-0 mx-1">
                                <div
                                    className={`w-8 rounded-t transition-all duration-300 ${
                                        (course.enrolledStudents || 0) >= 50 ? 'bg-green-500' :
                                        (course.enrolledStudents || 0) >= 20 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ height: `${Math.max(((course.enrolledStudents || 0) / 100) * 200, 20)}px` }}
                                ></div>
                                <span className="text-xs text-gray-600 mt-2 text-center" title={course.title}>
                                    {course.title?.substring(0, 8)}...
                                </span>
                                <span className="text-xs text-gray-400">
                                    {course.enrolledStudents || 0}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <p>Las estadísticas aparecerán cuando tengas cursos con estudiantes inscritos</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                            <span>Alto (50+ estudiantes)</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                            <span>Medio (20-49 estudiantes)</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                            <span>Bajo (0-19 estudiantes)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TutorDashboard
