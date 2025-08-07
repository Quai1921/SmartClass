import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Alert from "../../../components/Alert";

export const OtherPoliciesConfig = () => {
    const [formData, setFormData] = useState({
        enableNotifications: true,
        maxLoginAttempts: 5,
        sessionTimeout: 30, // minutes
        enableTwoFactorAuth: false,
        passwordComplexity: 'medium', // 'low' | 'medium' | 'high'
        enableAccountLockout: true,
        lockoutDuration: 15, // minutes
        enableAuditLog: true,
        logRetentionDays: 90
    });

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    // Placeholder mutation - replace with actual API call
    const otherPoliciesMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            // Replace with actual API call
            return Promise.resolve();
        },
        onSuccess: () => {
            setAlertData({ type: "success", message: "Otras políticas guardadas exitosamente" });
            setShowAlert(true);
        },
        onError: () => {
            setAlertData({ type: "error", message: "Error al guardar las otras políticas" });
            setShowAlert(true);
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        otherPoliciesMutation.mutate(formData);
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Configuración de otras políticas</h3>
            <p className="text-gray-500 mb-6">Configura políticas adicionales de seguridad y comportamiento del sistema</p>
            
            <div className="">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Seguridad de sesiones */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-medium mb-4">Seguridad de sesiones</h4>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-600 min-w-fit">
                                    Máximo intentos de inicio de sesión:
                                </label>
                                <input
                                    type="number"
                                    name="maxLoginAttempts"
                                    value={formData.maxLoginAttempts}
                                    onChange={handleInputChange}
                                    min="3"
                                    max="10"
                                    className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                />
                                <span className="text-sm text-gray-600">intentos</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-600 min-w-fit">
                                    Tiempo de espera de sesión:
                                </label>
                                <input
                                    type="number"
                                    name="sessionTimeout"
                                    value={formData.sessionTimeout}
                                    onChange={handleInputChange}
                                    min="5"
                                    max="120"
                                    className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                />
                                <span className="text-sm text-gray-600">minutos</span>
                            </div>

                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Habilitar autenticación de dos factores</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="enableTwoFactorAuth"
                                        checked={formData.enableTwoFactorAuth}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${formData.enableTwoFactorAuth ? 'bg-slate-600' : 'bg-gray-300'}`}>
                                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${formData.enableTwoFactorAuth ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Políticas de contraseña */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-medium mb-4">Políticas de contraseña</h4>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-2">
                                    Complejidad de contraseña
                                </label>
                                <select 
                                    name="passwordComplexity"
                                    value={formData.passwordComplexity}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm bg-white"
                                >
                                    <option value="low">Baja (mínimo 6 caracteres)</option>
                                    <option value="medium">Media (8+ caracteres, mayúsculas y números)</option>
                                    <option value="high">Alta (12+ caracteres, mayúsculas, números y símbolos)</option>
                                </select>
                            </div>

                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Habilitar bloqueo de cuenta</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="enableAccountLockout"
                                        checked={formData.enableAccountLockout}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${formData.enableAccountLockout ? 'bg-slate-600' : 'bg-gray-300'}`}>
                                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${formData.enableAccountLockout ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </div>
                            </label>

                            {formData.enableAccountLockout && (
                                <div className="flex items-center space-x-4">
                                    <label className="text-sm font-medium text-gray-600 min-w-fit">
                                        Duración del bloqueo:
                                    </label>
                                    <input
                                        type="number"
                                        name="lockoutDuration"
                                        value={formData.lockoutDuration}
                                        onChange={handleInputChange}
                                        min="5"
                                        max="60"
                                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                    />
                                    <span className="text-sm text-gray-600">minutos</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Auditoría y registro */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-medium mb-4">Auditoría y registro</h4>
                        
                        <div className="space-y-4">
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Habilitar registro de auditoría</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="enableAuditLog"
                                        checked={formData.enableAuditLog}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${formData.enableAuditLog ? 'bg-slate-600' : 'bg-gray-300'}`}>
                                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${formData.enableAuditLog ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </div>
                            </label>

                            {formData.enableAuditLog && (
                                <div className="flex items-center space-x-4">
                                    <label className="text-sm font-medium text-gray-600 min-w-fit">
                                        Retención de registros:
                                    </label>
                                    <input
                                        type="number"
                                        name="logRetentionDays"
                                        value={formData.logRetentionDays}
                                        onChange={handleInputChange}
                                        min="30"
                                        max="365"
                                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                    />
                                    <span className="text-sm text-gray-600">días</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notificaciones */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-medium mb-4">Notificaciones del sistema</h4>
                        
                        <label className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Habilitar notificaciones por correo electrónico</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="enableNotifications"
                                    checked={formData.enableNotifications}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${formData.enableNotifications ? 'bg-slate-600' : 'bg-gray-300'}`}>
                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${formData.enableNotifications ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-slate-800 text-white py-3 px-8 rounded-lg hover:bg-slate-700 transition font-medium text-sm"
                            disabled={otherPoliciesMutation.isPending}
                        >
                            {otherPoliciesMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>

                {alertData && showAlert && (
                    <Alert
                        type={alertData.type as 'error' | 'message' | 'alert'}
                        position="top"
                        message={alertData.message}
                        duration={4000}
                        restartAlert={() => setTimeout(() => {
                            setShowAlert(false);
                        }, 500)}
                    />
                )}
            </div>
        </div>
    );
};
