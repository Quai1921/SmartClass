import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { pathChangePwd } from "../../../../actions/configuration-admin/patch-change-pwd";
import Alert from "../../../components/Alert";
import Tooltip from "../../../components/Tooltip";
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: '',
    });    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const changePasswordMutation = useMutation({
        mutationFn: ({ password, newPassword }: { password: string; newPassword: string }) =>
            pathChangePwd(password, newPassword),
        onSuccess: () => {
            setAlertData({ type: "success", message: "Contraseña cambiada exitosamente" });
            setShowAlert(true);
            setFormData({ password: '', newPassword: '', confirmPassword: '' });
        },
        onError: () => {
            setAlertData({ type: "error", message: "Error al cambiar la contraseña" });
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
        
        // Validate password confirmation
        if (formData.newPassword !== formData.confirmPassword) {
            setAlertData({ type: "error", message: "Las contraseñas no coinciden" });
            setShowAlert(true);
            return;
        }

        changePasswordMutation.mutate({
            password: formData.password,
            newPassword: formData.newPassword
        });
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Cambiar contraseña</h3>
            <p className="text-gray-500 mb-6">Aquí puedes cambiar la contraseña de tu cuenta</p>
              <div className="max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-4">                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm font-medium text-gray-600 mb-2">
                                Ingresa tu contraseña actual
                            </label>
                            <div className="flex items-center relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="password"
                                    placeholder=""
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                    required
                                />
                                <div 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    <Tooltip
                                        text={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        position="top"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff color="#6B7280" size={18} />
                                        ) : (
                                            <Eye color="#6B7280" size={18} />
                                        )}
                                    </Tooltip>
                                </div>
                            </div>
                        </div>                        <div className="flex flex-col">
                            <label htmlFor="newPassword" className="text-sm font-medium text-gray-600 mb-2">
                                Ingresa la contraseña nueva
                            </label>
                            <div className="flex items-center relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    placeholder=""
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                    required
                                />
                                <div 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <Tooltip
                                        text={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        position="top"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff color="#6B7280" size={18} />
                                        ) : (
                                            <Eye color="#6B7280" size={18} />
                                        )}
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span>•</span>
                                    <span>8 caracteres mínimo</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>•</span>
                                    <span>Una mayúscula</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>•</span>
                                    <span>Un carácter especial</span>
                                </div>
                            </div>
                        </div>                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600 mb-2">
                                Ingresa de nuevo la contraseña nueva
                            </label>
                            <div className="flex items-center relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder=""
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                    required
                                />
                                <div 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Tooltip
                                        text={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        position="top"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff color="#6B7280" size={18} />
                                        ) : (
                                            <Eye color="#6B7280" size={18} />
                                        )}
                                    </Tooltip>                                </div>
                            </div>
                        </div>
                    </div><button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition font-medium text-sm mt-6"
                        disabled={changePasswordMutation.isPending}
                    >
                        {changePasswordMutation.isPending ? 'Cambiando...' : 'Cambiar contraseña'}
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
    );
}