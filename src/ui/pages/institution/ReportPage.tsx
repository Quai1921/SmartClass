import { useState } from "react"
import CustomButton from "../../components/CustomButton"
import SearchDashboard from "../../components/SearchDashboard"
import { StateTag } from "../../components/StateTag"

interface Report {
    id: number;
    institution: string;
    name: string;
    period: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

const ReportPage = () => {
    const [search, setSearch] = useState("")
    const [reportType, setReportType] = useState("academic")
    const [statusFilters, setStatusFilters] = useState({
        generated: true,
        error: true,
        inProgress: true
    })

    // Hardcoded report data matching Figma design exactly
    const reportData: Report[] = [
        {
            id: 1,
            institution: "Escuela 1",
            name: "Progreso académico",
            period: "11 Marzo 2025",
            status: "ACTIVE"
        },
        {
            id: 2,
            institution: "Escuela 2", 
            name: "Estudiantes en riesgo",
            period: "11 Marzo 2025",
            status: "ACTIVE"
        },
        {
            id: 3,
            institution: "Escuela 3",
            name: "Por docente", 
            period: "11 Marzo 2025",
            status: "ACTIVE"
        },
        {
            id: 4,
            institution: "Escuela 4",
            name: "Comparativas por grupo",
            period: "11 Marzo 2025", 
            status: "ACTIVE"
        },
        {
            id: 5,
            institution: "Escuela 5",
            name: "Individual por estudiante",
            period: "11 Marzo 2025",
            status: "INACTIVE"
        },
        {
            id: 6,
            institution: "Escuela 5",
            name: "Por período",
            period: "11 Marzo 2025",
            status: "PENDING"
        },
        {
            id: 7,
            institution: "Escuela 5", 
            name: "Por asistencia",
            period: "11 Marzo 2025",
            status: "PENDING"        }
    ]

    const ReportCard = ({ report }: { report: Report }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">{report.institution}</h3>
                    <p className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{report.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1H2V9a2 2 0 012-2h3zM2 10v8a2 2 0 002 2h16a2 2 0 002-2v-8H2z" />
                        </svg>
                        {report.period}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <StateTag state={report.status} />
                <div className="flex items-center gap-1">
                    <button 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver reporte"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </button>
                    <button 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Más opciones"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
                <p className="text-gray-600 text-sm mt-1">En esta sección puedes generar reportes de diferentes tipos.</p>
            </div>

            <div className="p-6">
                {/* Action Bar */}
                <div className='flex items-center justify-between mb-6'>
                    <CustomButton label="Nuevo reporte" icon='Plus' />
                    <SearchDashboard search={search} setSearch={setSearch} />
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Tipo de reporte</span>
                            <div className="flex flex-wrap items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="reportType" 
                                        value="academic" 
                                        checked={reportType === "academic"}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Progreso académico</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="reportType" 
                                        value="risk"
                                        checked={reportType === "risk"}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Estudiantes en riesgo</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="reportType" 
                                        value="teacher"
                                        checked={reportType === "teacher"}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Por docente</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="reportType" 
                                        value="comparative"
                                        checked={reportType === "comparative"}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Comparativas por grupo</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Status Toggles */}
                    <div className="flex flex-wrap items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={statusFilters.generated}
                                onChange={(e) => setStatusFilters(prev => ({...prev, generated: e.target.checked}))}
                                className="rounded text-blue-600 border-gray-300 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-600">Generados</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={statusFilters.error}
                                onChange={(e) => setStatusFilters(prev => ({...prev, error: e.target.checked}))}
                                className="rounded text-blue-600 border-gray-300 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-600">Error</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={statusFilters.inProgress}
                                onChange={(e) => setStatusFilters(prev => ({...prev, inProgress: e.target.checked}))}
                                className="rounded text-blue-600 border-gray-300 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-600">En progreso</span>
                        </label>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {reportData.map((report) => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ReportPage
