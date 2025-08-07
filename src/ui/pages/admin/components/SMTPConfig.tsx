import { useState } from "react";
import { putSMTP } from "../../../../actions/configuration-admin/put-smtp";
import { useMutation } from "@tanstack/react-query";
import Alert from "../../../components/Alert";
import Tooltip from "../../../components/Tooltip";
import { Eye, EyeOff } from 'lucide-react';

export const SMTPConfig = () => {
    const [formData, setFormData] = useState({
        host: '',
        port: 587,
        username: '',
        password: '',
        auth: true,
        starttls: true,
    });

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const sMTPMutation = useMutation({
        mutationFn: ({ host, port, username, password, auth, starttls }: typeof formData) =>
            putSMTP(host, port, username, password, auth, starttls),
        onSuccess: () => {
            setAlertData({ type: "success", message: "Configuración SMTP enviada exitosamente" });
            setShowAlert(true);
            setFormData({ host: '', port: 587, username: '', password: '', auth: true, starttls: true });
        },
        onError: () => {
            setAlertData({ type: "error", message: "Error al enviar la configuración SMTP" });
            setShowAlert(true);
        },
    });    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : type === 'number' || id === 'port' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sMTPMutation.mutate(formData);
    };    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Configuración SMTP</h3>
            <p className="text-gray-500 mb-6">Configura el servidor SMTP para el envío de correos electrónicos.</p>
            
            <div className="max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="host" className="text-sm font-medium text-gray-600 mb-2">
                                Host del servidor SMTP
                            </label>
                            <input
                                type="text"
                                id="host"
                                placeholder="smtp.gmail.com"
                                value={formData.host}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>                        <div className="flex flex-col">
                            <label htmlFor="port" className="text-sm font-medium text-gray-600 mb-2">
                                Puerto
                            </label>
                            <select
                                id="port"
                                value={formData.port}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm bg-white"
                                required
                            >
                                <option value={25}>25 (SMTP sin cifrado)</option>
                                <option value={465}>465 (SMTP con SSL/TLS)</option>
                                <option value={587}>587 (SMTP con STARTTLS) - Recomendado</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-sm font-medium text-gray-600 mb-2">
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="tu-email@example.com"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm font-medium text-gray-600 mb-2">
                                Contraseña
                            </label>
                            <div className="flex items-center relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Tu contraseña SMTP"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                    required
                                />
                                <div 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Tooltip
                                        text={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        position="top"
                                    >
                                        {showPassword ? (
                                            <EyeOff color="#6B7280" size={18} />
                                        ) : (
                                            <Eye color="#6B7280" size={18} />
                                        )}
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="auth"
                                    checked={formData.auth}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                                />
                                <label htmlFor="auth" className="text-sm font-medium text-gray-600">
                                    Habilitar autenticación
                                </label>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="starttls"
                                    checked={formData.starttls}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-slate-600 bg-gray-100 border-gray-300 rounded focus:ring-slate-500 focus:ring-2"
                                />
                                <label htmlFor="starttls" className="text-sm font-medium text-gray-600">
                                    Habilitar STARTTLS
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition font-medium text-sm mt-6"
                        disabled={sMTPMutation.isPending}
                    >
                        {sMTPMutation.isPending ? 'Enviando...' : 'Guardar configuración'}
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
