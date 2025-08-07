const TutorProfile = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="mt-2 text-gray-600">
                    Gestiona tu información personal y configuraciones
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Perfil en desarrollo
                    </h3>
                    <p className="text-gray-500">
                        Esta página estará disponible próximamente para gestionar tu información personal.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TutorProfile;
