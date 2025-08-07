import React from 'react';
import { useNavigate } from 'react-router';

const SuccessPage: React.FC = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        // Navigate to the main app (home or dashboard)
        navigate('/home');
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat relative py-8"
            style={{
                backgroundImage: `url('/src/assets/background-policies.png')`,
                backgroundPosition: 'top center'
            }}
        >
            <div className="w-full max-w-[505px] relative z-20">
                {/* Main Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col justify-center items-center min-h-[600px]">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <img 
                            src="/assets/images/logo-smart_class.svg" 
                            alt="SmartClass" 
                            className="mx-auto h-32 w-32"
                        />
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-medium text-gray-800 mb-4">
                            ¡Institución configurada exitosamente!
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Tu institución ha sido creada y configurada correctamente.<br />
                            Ahora puedes comenzar a usar SmartClass para gestionar<br />
                            estudiantes, docentes y actividades académicas.
                        </p>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        className="w-full py-3 rounded-md text-sm font-medium bg-[#0F1D2E] text-white hover:bg-[#1a2940] transition-all"
                    >
                        Comenzar a usar SmartClass
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
