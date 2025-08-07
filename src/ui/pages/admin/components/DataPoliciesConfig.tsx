import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Alert from "../../../components/Alert";

export const DataPoliciesConfig = () => {
    const [formData, setFormData] = useState({
        dataRetentionPeriod: '6 meses',
        retentionAction: 'anonimizar', // 'anonimizar' | 'eliminar' | 'notificar'
        anonymizeStudentsTeachers: true,
        anonymizationThreshold: '6 meses',
        inactiveStudentsMonths: 6,
        allowPersonalDataExport: true,
        requireAuthorizationForExport: false,
        showDataPolicyNotice: false,
        enableTraceability: {
            exports: false,
            massDeletes: false,
            backupRestores: false
        }
    });

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    // Placeholder mutation - replace with actual API call
    const policiesMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            // Replace with actual API call
            return Promise.resolve();
        },
        onSuccess: () => {
            setAlertData({ type: "success", message: "Políticas de datos guardadas exitosamente" });
            setShowAlert(true);
        },
        onError: () => {
            setAlertData({ type: "error", message: "Error al guardar las políticas de datos" });
            setShowAlert(true);
        },
    });

    const handleSelectChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleTraceabilityChange = (field: keyof typeof formData.enableTraceability, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            enableTraceability: {
                ...prev.enableTraceability,
                [field]: checked
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        policiesMutation.mutate(formData);
    };    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-6 pb-4">
                <h3 className="text-2xl font-semibold mb-2">Configuración de políticas de datos</h3>
                <p className="text-gray-500 mb-6">En esta sección puedes configurar las políticas de datos</p>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6">                <div className="">
                    <form id="data-policies-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Tiempo de retención de datos personales */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800">Tiempo de retención de datos personales</h4>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Período de retención
                                </label>
                                <select 
                                    value={formData.dataRetentionPeriod}
                                    onChange={(e) => handleSelectChange('dataRetentionPeriod', e.target.value)}
                                    className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
                                >
                                    <option value="3 meses">3 meses</option>
                                    <option value="6 meses">6 meses</option>
                                    <option value="1 año">1 año</option>
                                    <option value="2 años">2 años</option>
                                    <option value="5 años">5 años</option>
                                </select>                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700">Al finalizar el período de retención:</p>
                                
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="retentionAction"
                                            value="anonimizar"
                                            checked={formData.retentionAction === 'anonimizar'}
                                            onChange={(e) => handleSelectChange('retentionAction', e.target.value)}
                                            className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500 focus:ring-2"
                                        />
                                        <span className="text-sm text-gray-800">Anonimizar automáticamente</span>
                                    </label>
                                      <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="retentionAction"
                                            value="eliminar"
                                            checked={formData.retentionAction === 'eliminar'}
                                            onChange={(e) => handleSelectChange('retentionAction', e.target.value)}
                                            className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500 focus:ring-2"
                                        />
                                        <span className="text-sm text-gray-800">Eliminar definitivamente</span>
                                    </label>
                                    
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="retentionAction"
                                            value="notificar"
                                            checked={formData.retentionAction === 'notificar'}
                                            onChange={(e) => handleSelectChange('retentionAction', e.target.value)}
                                            className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500 focus:ring-2"
                                        />
                                        <span className="text-sm text-gray-800">Notificar al administrador para decidir</span>
                                    </label>
                                </div>
                            </div>
                        </div>                    </div>

                    {/* Anonimización de estudiantes y docentes */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800">Anonimización de estudiantes y docentes</h4>
                        
                        <div className="space-y-4">
                            <label className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-gray-800">Activar anonimización automática</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="anonymizeStudentsTeachers"
                                        checked={formData.anonymizeStudentsTeachers}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-12 h-7 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${formData.anonymizeStudentsTeachers ? 'bg-slate-600' : 'bg-gray-300'}`}>
                                        <div className={`absolute left-0.5 top-0.5 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${formData.anonymizeStudentsTeachers ? 'transform translate-x-5' : ''}`}></div>
                                    </div>
                                </div>
                            </label>                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Umbral de anonimización
                                </label>
                                <select 
                                    value={formData.anonymizationThreshold}
                                    onChange={(e) => handleSelectChange('anonymizationThreshold', e.target.value)}
                                    className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
                                    disabled={!formData.anonymizeStudentsTeachers}
                                >
                                    <option value="3 meses">3 meses</option>
                                    <option value="6 meses">6 meses</option>
                                    <option value="1 año">1 año</option>
                                </select>
                            </div>                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Estudiantes inactivos por más de esta cantidad de meses:
                                </label>
                                <input
                                    type="number"
                                    name="inactiveStudentsMonths"
                                    value={formData.inactiveStudentsMonths}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="24"
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm"
                                />
                                <span className="text-sm text-gray-700">meses</span>
                            </div>
                        </div>
                    </div>                    {/* Exportación de datos personales */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800">Exportación de datos personales</h4>
                          <div className="space-y-4">
                            <label className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-gray-800">Permitir exportar datos personales</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="allowPersonalDataExport"
                                        checked={formData.allowPersonalDataExport}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-12 h-7 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${formData.allowPersonalDataExport ? 'bg-slate-600' : 'bg-gray-300'}`}>
                                        <div className={`absolute left-0.5 top-0.5 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${formData.allowPersonalDataExport ? 'transform translate-x-5' : ''}`}></div>
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="requireAuthorizationForExport"
                                    checked={formData.requireAuthorizationForExport}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                                    disabled={!formData.allowPersonalDataExport}
                                />
                                <span className="text-sm text-gray-800">Requerir rol autorizado para habilitar o deshabilitar esta opción</span>
                            </label>
                        </div>
                    </div>                    {/* Consentimiento informado */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800">Consentimiento informado</h4>
                          <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="showDataPolicyNotice"
                                checked={formData.showDataPolicyNotice}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-800">Mostrar aviso de política de datos a docentes y estudiantes al primer inicio de sesión</span>
                        </label>
                    </div>                    {/* Activar trazabilidad de */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold mb-4 text-gray-800">Activar trazabilidad de:</h4>
                          <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={formData.enableTraceability.exports}
                                    onChange={(e) => handleTraceabilityChange('exports', e.target.checked)}
                                    className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-800">Exportaciones</span>
                            </label>
                            
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={formData.enableTraceability.massDeletes}
                                    onChange={(e) => handleTraceabilityChange('massDeletes', e.target.checked)}
                                    className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-800">Eliminaciones masivas</span>
                            </label>
                            
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={formData.enableTraceability.backupRestores}
                                    onChange={(e) => handleTraceabilityChange('backupRestores', e.target.checked)}
                                    className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-800">Restauraciones de backup</span>
                            </label>                        </div>
                    </div>
                    </form>
                </div>
            </div>
            
            {/* Fixed Submit Button */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
                <div className="max-w-3xl flex justify-end">
                    <button
                        type="submit"
                        form="data-policies-form"
                        className="bg-slate-800 text-white py-3 px-8 rounded-lg hover:bg-slate-700 transition font-medium text-sm"
                        disabled={policiesMutation.isPending}
                    >
                        {policiesMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </div>

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
    );
};
