import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { putDataCenter } from "../../../../actions/configuration-admin/put-data-center";
import Alert from "../../../components/Alert";
import Tooltip from "../../../components/Tooltip";
import { Eye, EyeOff } from 'lucide-react';

export const DataCenterConfig = () => {
    const [formData, setFormData] = useState({
        endpoint: '',
        accessKey: '',
        secretKey: '',
        bucketName: '',
    });

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);

    const dataCenterMutation = useMutation({
        mutationFn: ({ endpoint, accessKey, secretKey, bucketName }: typeof formData) =>
            putDataCenter(endpoint, accessKey, secretKey, bucketName),
        onSuccess: () => {
            setAlertData({ type: "success", message: "Configuración del data center enviada exitosamente" });
            setShowAlert(true);
            setFormData({ endpoint: '', accessKey: '', secretKey: '', bucketName: '' });
        },
        onError: () => {
            setAlertData({ type: "error", message: "Error al enviar la configuración del data center" });
            setShowAlert(true);
        },
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dataCenterMutation.mutate(formData);
    };    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Data Center</h3>
            <p className="text-gray-500 mb-6">Configura la conexión con el centro de datos.</p>
            
            <div className="max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="endpoint" className="text-sm font-medium text-gray-600 mb-2">
                                Endpoint
                            </label>
                            <input
                                type="text"
                                id="endpoint"
                                placeholder="https://endpoint.example.com"
                                value={formData.endpoint}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="accessKey" className="text-sm font-medium text-gray-600 mb-2">
                                Access Key
                            </label>
                            <input
                                type="text"
                                id="accessKey"
                                placeholder="Tu access key"
                                value={formData.accessKey}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>                        <div className="flex flex-col">
                            <label htmlFor="secretKey" className="text-sm font-medium text-gray-600 mb-2">
                                Secret Key
                            </label>
                            <div className="flex items-center relative">
                                <input
                                    type={showSecretKey ? "text" : "password"}
                                    id="secretKey"
                                    placeholder="Tu secret key"
                                    value={formData.secretKey}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                    required
                                />
                                <div 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowSecretKey(!showSecretKey)}
                                >
                                    <Tooltip
                                        text={showSecretKey ? "Ocultar secret key" : "Mostrar secret key"}
                                        position="top"
                                    >
                                        {showSecretKey ? (
                                            <EyeOff color="#6B7280" size={18} />
                                        ) : (
                                            <Eye color="#6B7280" size={18} />
                                        )}
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="bucketName" className="text-sm font-medium text-gray-600 mb-2">
                                Bucket Name
                            </label>
                            <input
                                type="text"
                                id="bucketName"
                                placeholder="nombre-del-bucket"
                                value={formData.bucketName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition font-medium text-sm mt-6"
                        disabled={dataCenterMutation.isPending}
                    >
                        {dataCenterMutation.isPending ? 'Enviando...' : 'Guardar configuración'}
                    </button>
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
    )
}
