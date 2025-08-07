import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { pathChangeEmail } from "../../../../actions/configuration-admin/patch-change-email";
import Alert from "../../../components/Alert";


export default function ChangeEmailForm() {
    const [formData, setFormData] = useState({
        newEmail: '',
        confirmEmail: '',
        currentEmail: '',
    });

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    const changeEmailMutation = useMutation({
        mutationFn: ({ newEmail, currentEmail }: { newEmail: string; currentEmail: string }) =>
            pathChangeEmail(newEmail, currentEmail),
        onSuccess: () => {
            setAlertData({ type: "success", message: "Correo cambiado exitosamente" });
            setShowAlert(true);
            setFormData({ newEmail: '', confirmEmail: '', currentEmail: '' });
        },
        onError: () => {
            setAlertData({ type: "error", message: "Error al cambiar el correo" });
            setShowAlert(true);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate email confirmation
        if (formData.newEmail !== formData.confirmEmail) {
            setAlertData({ type: "error", message: "Los correos no coinciden" });
            setShowAlert(true);
            return;
        }

        changeEmailMutation.mutate({
            newEmail: formData.newEmail,
            currentEmail: formData.currentEmail
        });
    };
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Cambiar correo</h3>
            <p className="text-gray-500 mb-6">Aquí puedes cambiar tu correo principal para iniciar sesión.</p>
              <div className="max-w-lg mx-auto">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-4">                        <div className="flex flex-col">
                            <label htmlFor="currentEmail" className="text-sm font-medium text-gray-600 mb-2">
                                Ingresa tu correo actual
                            </label>
                            <input
                                type="email"
                                id="currentEmail"
                                placeholder="name@example.com"
                                value={formData.currentEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>                        <div className="flex flex-col">
                            <label htmlFor="newEmail" className="text-sm font-medium text-gray-600 mb-2">
                                Ingresa el nuevo correo
                            </label>
                            <input
                                type="email"
                                id="newEmail"
                                placeholder="name@example.com"
                                value={formData.newEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>                        <div className="flex flex-col">
                            <label htmlFor="confirmEmail" className="text-sm font-medium text-gray-600 mb-2">
                                Confirma el nuevo correo
                            </label>
                            <input
                                type="email"
                                id="confirmEmail"
                                placeholder="name@example.com"
                                value={formData.confirmEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>
                    </div>                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition font-medium text-sm mt-6"
                        disabled={changeEmailMutation.isPending}
                    >
                        {changeEmailMutation.isPending ? 'Cambiando...' : 'Cambiar correo'}
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
