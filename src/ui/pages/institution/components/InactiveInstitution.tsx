import type { User } from "../../../../domain/entities/user";

interface InactiveInstitutionProps {
    userData: User;
}

const InactiveInstitution = ({ userData }: InactiveInstitutionProps) => {
    const statusText = userData.status === 'PENDING' 
        ? 'Pendiente de activación' 
        : userData.status === 'INACTIVE' 
        ? 'Inactiva' 
        : 'Pendiente de activación';
    
    const statusColor = userData.status === 'PENDING' 
        ? 'text-yellow-600' 
        : userData.status === 'INACTIVE' 
        ? 'text-red-600' 
        : 'text-yellow-600';
    
    return (
        <div className="bg-gray-50 min-h-full">
            {/* 👋 Encabezado de bienvenida */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Hola, {userData.userFirstName}
                </h1>
                <p className="text-lg text-gray-600">
                    Bienvenido a {userData.institutionName}
                </p>
            </div>

            {/* 🚧 Mensaje de institución inactiva */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                        <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Institución {statusText.toLowerCase()}
                    </h2>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                        Tu institución <strong>{userData.institutionName}</strong> está configurada correctamente, 
                        pero aún está {statusText.toLowerCase()}. La institución se activará automáticamente 
                        una vez que se asignen cursos a la misma.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-lg mx-auto">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    ¿Qué necesitas hacer?
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>Contacta al administrador del sistema para que asigne los cursos necesarios a tu institución. Una vez completado este paso, tendrás acceso completo a todas las funcionalidades de la plataforma.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-900">
                            Mientras tanto, puedes:
                        </h3>
                        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                            <li className="flex items-center">
                                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Explorar la interfaz de la plataforma
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Revisar la configuración de tu perfil
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Familiarizarte con las funciones disponibles
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 📊 Información básica de la institución */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Información de tu institución
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Institución</p>
                                <p className="text-sm text-gray-600">{userData.institutionName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Administrador</p>
                                <p className="text-sm text-gray-600">{userData.userFirstName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Estado</p>
                                <p className={`text-sm font-semibold ${statusColor}`}>{statusText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InactiveInstitution;
