import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import { register } from "../../../../actions/auth/register";
import { updateUser } from "../../../../actions/users/patch-update-users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import InputField from "./InputField";
import { useClickOutside } from "../../../hooks/useClickOutside";
import Alert from "../../../components/Alert";

interface UserData {
    id?: string;
    email: string;
    role?: string; 
    username?: string | null;
    password?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    identificationNumber?: string | null;
    status?: string; 
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    userData?: UserData | null;
}

export const UserModal = ({ isOpen, onClose, mode, userData }: Props) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    useClickOutside(modalRef, onClose, isOpen);

    const [formData, setFormData] = useState<UserData>({
        email: '',
        role: '',
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        identificationNumber: null
    });

    // Cargar datos del usuario cuando se abre en modo edición
    useEffect(() => {
        if (mode === 'edit' && userData) {
            setFormData({
                id: userData.id,
                email: userData.email,
                role: userData.role || '', // Mantener para referencia pero no se mostrará
                username: userData.username, // Mantener para referencia pero no se mostrará
                password: null, // No cargar contraseña
                firstName: userData.firstName,
                lastName: userData.lastName,
                identificationNumber: userData.identificationNumber
            });
        } else {
            // Limpiar formulario en modo crear
            setFormData({
                email: '',
                role: '',
                username: null,
                password: null,
                firstName: null,
                lastName: null,
                identificationNumber: null
            });
        }
    }, [mode, userData]);

    // Mutación para crear usuario
    const createUserMutation = useMutation({
        mutationFn: (data: UserData) =>
            register(
                data.email,
                data.role || '',
                data.username ?? '',
                data.password ?? '',
                data.firstName ?? '',
                data.lastName ?? '',
                data.identificationNumber ?? ''
            ),
        onSuccess: (response) => {
            if (response.success) {
                setShowAlert(true);
                setAlertData({ type: "success", message: response.data.alert });
                queryClient.invalidateQueries({ queryKey: ['users'] });
                setTimeout(() => onClose(), 2000);
            } else {
                setShowAlert(true);
                setAlertData({ type: "error", message: response.data.alert });
            }
        },
        onError: (error: any) => {
            setAlertData({ type: "error", message: error.data?.alert || "Error al crear usuario" });
            setShowAlert(true);
        },
    });    // Mutación para editar usuario (sin role, username, password)
    const updateUserMutation = useMutation({
        mutationFn: (data: UserData) => 
            updateUser(
                data.id!,
                data.email,
                data.firstName ?? '',
                data.lastName ?? '',
                data.identificationNumber ?? ''
            ),        onSuccess: (response) => {
            if (response.success) {
                setShowAlert(true);
                setAlertData({ type: "success", message: response.message });
                queryClient.invalidateQueries({ queryKey: ['users'] });
                setTimeout(() => onClose(), 2000);
            } else {
                setShowAlert(true);
                setAlertData({ type: "error", message: response.message });
            }
        },
        onError: (error: any) => {
            setAlertData({ type: "error", message: error.message || "Error al actualizar usuario" });
            setShowAlert(true);        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            createUserMutation.mutate(formData);
        } else {
            // En modo edición, solo enviar los campos permitidos
            updateUserMutation.mutate(formData);
        }
    };

    const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition
                    show={isOpen}
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
                </Transition>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition
                            show={isOpen}
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                ref={modalRef}
                                className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="modal-title"
                            >
                                <h2 className="text-lg font-semibold mb-4">
                                    {mode === 'create' ? 'Crear nuevo usuario' : 'Editar usuario'}
                                </h2>
                                
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-4 mt-4 text-[14px]">
                                        {/* Campo ROL - Solo mostrar en modo CREATE */}
                                        {mode === 'create' && (
                                            <label className="flex gap-[18px] justify-end items-center">
                                                <span>Rol</span>
                                                <select
                                                    name="role"
                                                    value={formData.role || ''}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, role: e.target.value }))
                                                    }
                                                    className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
                                                    required
                                                >
                                                    <option value="" disabled>Selecciona un rol</option>
                                                    <option value="ADMIN">Administrador</option>
                                                    <option value="INSTITUTION_ADMIN">Institución</option>
                                                    <option value="TUTOR">Tutor</option>
                                                </select>
                                            </label>
                                        )}

                                        <InputField
                                            id="email"
                                            label="Email"
                                            value={formData.email}
                                            type="email"
                                            onChange={handleInputChange}
                                        />

                                        {/* Campos USERNAME y PASSWORD - Solo mostrar en modo CREATE y si no es INSTITUTION_ADMIN */}
                                        {mode === 'create' && formData.role !== "INSTITUTION_ADMIN" && (
                                            <>
                                                <InputField
                                                    id="username"
                                                    label="Username"
                                                    value={formData.username ?? ''}
                                                    type="text"
                                                    onChange={handleInputChange}
                                                />
                                                <InputField
                                                    id="password"
                                                    label="Contraseña"
                                                    value={formData.password ?? ''}
                                                    type="password"
                                                    onChange={handleInputChange}
                                                />
                                            </>
                                        )}

                                        {/* Campos NOMBRE, APELLIDO, IDENTIFICACIÓN - Mostrar siempre excepto para INSTITUTION_ADMIN en CREATE */}
                                        {(mode === 'edit' || (mode === 'create' && formData.role !== "INSTITUTION_ADMIN")) && (
                                            <>
                                                <InputField
                                                    id="firstName"
                                                    label="Nombre"
                                                    value={formData.firstName ?? ''}
                                                    type="text"
                                                    onChange={handleInputChange}
                                                />
                                                <InputField
                                                    id="lastName"
                                                    label="Apellido"
                                                    value={formData.lastName ?? ''}
                                                    type="text"
                                                    onChange={handleInputChange}
                                                />
                                                <InputField
                                                    id="identificationNumber"
                                                    label="C.C. / N.I.T"
                                                    value={formData.identificationNumber ?? ''}
                                                    type="text"
                                                    onChange={handleInputChange}
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-background text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear usuario' : 'Actualizar usuario'}
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
                        </Transition>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};