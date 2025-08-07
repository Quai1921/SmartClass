import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getUpcomingHolidays, formatEventDate } from "../../../actions/calendar/get-calendar-events"
import CustomButton from '../../components/CustomButton';
import InstitutionCard from './components/InstitutionCard';
import { LoaderDog } from "../../components/LoaderDog";
import { StudentModal } from './components/StudentModal';
import InactiveInstitution from './components/InactiveInstitution';
import { useInstitutionStatus } from '../../hooks/useInstitutionStatus';
import { useAuthStore } from '../../store/auth/useAuthStore';

const HomePageInstitution = () => {
    const { role } = useAuthStore();
    
    // Redirect tutors to their dashboard if they accidentally access institution routes
    if (role === 'TUTOR') {
        window.location.href = '/tutor-dashboard';
        return null;
    }
    
    // 🎯 Use the custom hook for institution status
    const { userData, isLoading: loadingUser, isInstitutionInactive } = useInstitutionStatus();

    // const  userInfo  = useInstitutionStatus();

    // 📅 TanStack Query para obtener eventos próximos del calendario
    const { data: upcomingEvents = [], isLoading: loadingEvents } = useQuery({
        queryKey: ['upcomingHolidays'],
        staleTime: 1000 * 60 * 30, // 30 minutos de cache para eventos
        queryFn: () => getUpcomingHolidays(),
        enabled: !!userData, // Solo ejecutar si tenemos datos del usuario
    })

    // 🎯 Estado para el modal de estudiante
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

    // 🔄 Estados de carga y error
    if (loadingUser) return <LoaderDog width={200} height={200} />
    if (!userData) return <p>Error cargando datos del usuario.</p>;    // 🏫 Verificar si la institución está activa
    // Una institución se considera inactiva si no tiene grados/grupos asignados
      // 🚧 Mostrar componente de institución inactiva
    if (isInstitutionInactive) {
        // Debug: Log the original userData
        
        // Convertir User a UserInstitutionResponse para el componente InactiveInstitution
        const institutionData = {
            userFirstName: userData.userFirstName,
            institutionName: userData.institutionName || 'Institución',
            urlInstitutionLogo: userData.urlInstitutionLogo || '',
            activeTeachers: userData.activeTeachers || 0,
            totalTeachers: userData.totalTeachers || 0,
            totalStudents: userData.totalStudents || 0,
            grades: userData.grades || [],
            groups: userData.groups || [],
            shifts: userData.shifts || [],
            thresholds: userData.thresholds || [],
        };
        

        return <InactiveInstitution userData={institutionData} />;
    }

    // 📊 Datos hardcodeados para KPIs que no están en el endpoint actual
    const hardcodedKPIs = {
        classesThisMonth: 25,
        monthlyGrades: [
            { grade: "1ro", value: 8.5 },
            { grade: "2do", value: 7.2 },
            { grade: "3ro", value: 3.8 },
            { grade: "4to", value: 5.9 },
            { grade: "5to", value: 6.4 },
            { grade: "6to", value: 9.1 },
            { grade: "7mo", value: 6.2 },
            { grade: "8vo", value: 2.8 },
            { grade: "9no", value: 6.1 },
            { grade: "10mo", value: 2.9 },
            { grade: "11vo", value: 8.7 }
        ],
        teacherPerformance: [
            { name: "Daniela Castro", groups: "5 grupos", students: "50 estudiantes", risk: "10 estudiantes en riesgo" },
            { name: "Mauricio Leal", groups: "5 grupos", students: "50 estudiantes", risk: "16 estudiantes en riesgo" },
            { name: "Isabela Gómez", groups: "5 grupos", students: "50 estudiantes", risk: "10 estudiantes en riesgo" },
            { name: "Daniel González", groups: "5 grupos", students: "50 estudiantes", risk: "10 estudiantes en riesgo" }
        ]
    };

    // 🎯 Procesar eventos próximos del API o fallback a datos hardcodeados
    const displayEvents = upcomingEvents.length > 0
        ? upcomingEvents.map(event => ({
            date: formatEventDate(event.startTime),
            event: event.title
        }))
        : [
            { date: "Jul 2", event: "Semana de evaluaciones" },
            { date: "Jul 18", event: "Viernes cultural" }
        ];

    return (
        <div className="bg-gray-50 min-h-full">
            {/* 👋 Encabezado de bienvenida */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Hola, {userData?.userFirstName}
                </h1>
                <p className="text-lg text-gray-600">
                    Acá podrás ver un resumen general de la institución. Para acceder a una sección solo haz click sobre ella.
                </p>
            </div>

            {/* 📊 KPI Cards - Desempeño de la institución */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Desempeño de la institución
                    </h2>
                    {loadingEvents && (
                        <span className="text-sm text-blue-600 flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            Actualizando eventos...
                        </span>
                    )}
                </div>                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InstitutionCard
                        label="Docentes activos"
                        value={userData.activeTeachers || 0}
                        subtitle={`de ${userData.totalTeachers || 0} registrados`}
                        emoji="👩‍🏫"
                        bgColor="bg-blue-50"
                    />                    <InstitutionCard
                        label="Estudiantes activos"
                        value={userData.totalStudents || 0}
                        subtitle={
                            (userData.totalStudents || 0) > 0 
                                ? `repartidos en ${userData.groups?.length || 'varios'} grupo(s)` 
                                : "ningún estudiante registrado"
                        }
                        emoji="👨‍🎓"
                        bgColor="bg-green-50"
                    />
                    <InstitutionCard
                        label="Clases impartidas este mes"
                        value={hardcodedKPIs.classesThisMonth}
                        subtitle="de 80 programadas"
                        emoji="📘"
                        bgColor="bg-purple-50"
                    />
                    <InstitutionCard
                        label="Próximas fechas importantes"
                        value={displayEvents.length}
                        subtitle={loadingEvents ? "Cargando eventos..." : displayEvents.map(e => `• ${e.date} - ${e.event}`).join('\n')}
                        emoji="🗓️"
                        bgColor="bg-orange-50"
                        isEventCard={true}
                    />
                </div>
            </div>

            {/* 📈 Sección de gráficos y análisis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* 📊 Promedio de calificaciones por grados */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Promedio de calificaciones por grados
                    </h3>
                    <div className="h-64 flex items-end justify-between px-2 overflow-x-auto">
                        {hardcodedKPIs.monthlyGrades.map((item, index) => (
                            <div key={index} className="flex flex-col items-center min-w-0 flex-shrink-0 mx-1">
                                <div
                                    className={`w-8 rounded-t transition-all duration-300 ${item.value >= 7 ? 'bg-green-500' :
                                            item.value >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ height: `${(item.value / 10) * 200}px` }}
                                ></div>
                                <span className="text-xs text-gray-600 mt-2">{item.grade}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-4">
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                                <span>Excelente (7-10)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                                <span>Regular (5-6.9)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                                <span>En riesgo (0-4.9)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 👨‍🏫 Desempeño docentes */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Desempeño docentes
                        </h3>
                        <span className="text-sm text-gray-500">
                            You made 265 sales this month
                        </span>
                    </div>
                    <div className="space-y-4">
                        {hardcodedKPIs.teacherPerformance.map((teacher, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-gray-600">
                                            {teacher.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{teacher.name}</p>
                                        <p className="text-sm text-gray-500">{teacher.groups}</p>
                                        <p className="text-sm text-gray-500">{teacher.students}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {teacher.risk}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🚀 Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Acciones rápidas
                </h3>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => setIsStudentModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-surface text-white text-center label-large px-[17px] py-[10px] body-medium rounded-[6px] cursor-pointer hover:bg-opacity-90 transition-all"
                    >
                        Agregar estudiante
                    </button>
                    <CustomButton
                        label="Ver informe"
                        path="/reports"
                    />
                </div>
            </div>

            {/* 📝 Modal de estudiante */}
            <StudentModal 
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                mode="create"
                studentData={null}
            />
        </div>
    )
}

export default HomePageInstitution
