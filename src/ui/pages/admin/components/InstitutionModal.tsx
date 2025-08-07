import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import InputField from "./InputField";
import { useClickOutside } from "../../../hooks/useClickOutside";
import Alert from "../../../components/Alert";

interface InstitutionData {
    id?: string;
    name: string;
    adminUserName?: string;
    cityName?: string;
    status?: string;
    students?: number;
    teachers?: number;
    createdAt?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    institutionData?: InstitutionData | null;
}

export const InstitutionModal = ({ isOpen, onClose, mode, institutionData }: Props) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    useClickOutside(modalRef, onClose, isOpen);

    const [formData, setFormData] = useState<InstitutionData>({
        name: '',
        adminUserName: '',
        cityName: '',
        status: 'ACTIVE'
    });

    // Load institution data when opening in edit mode
    useEffect(() => {
        if (mode === 'edit' && institutionData) {
            setFormData({
                id: institutionData.id,
                name: institutionData.name,
                adminUserName: institutionData.adminUserName,
                cityName: institutionData.cityName,
                status: institutionData.status,
                students: institutionData.students,
                teachers: institutionData.teachers,
                createdAt: institutionData.createdAt
            });
        } else {
            // Clear form in create mode
            setFormData({
                name: '',
                adminUserName: '',
                cityName: '',
                status: 'ACTIVE'
            });
        }
    }, [mode, institutionData]);

    // TODO: Implement actual API calls for institution CRUD
    const updateInstitutionMutation = useMutation({
        mutationFn: async (data: InstitutionData) => {
            // Placeholder for actual API call
            return Promise.resolve({ success: true, data: { alert: "Institución actualizada exitosamente" } });
        },
        onSuccess: (response) => {
            if (response.success) {
                setShowAlert(true);
                setAlertData({ type: "message", message: response.data.alert });
                queryClient.invalidateQueries({ queryKey: ['institutions'] });
                setTimeout(() => onClose(), 2000);
            } else {
                setShowAlert(true);
                setAlertData({ type: "error", message: response.data.alert });
            }
        },
        onError: (error: any) => {
            setAlertData({ type: "error", message: error.data?.alert || "Error al actualizar institución" });
            setShowAlert(true);
        },
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
        if (mode === 'edit') {
            updateInstitutionMutation.mutate(formData);
        }
        // TODO: Implement create functionality when needed
    };

    const isLoading = updateInstitutionMutation.isPending;

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
                                    {mode === 'create' ? 'Crear nueva institución' : 'Editar institución'}
                                </h2>
                                
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-4 mt-4 text-[14px]">                                        <InputField
                                            id="name"
                                            label="Nombre de la institución"
                                            value={formData.name}
                                            type="text"
                                            onChange={handleInputChange}
                                        />

                                        <InputField
                                            id="adminUserName"
                                            label="Encargado"
                                            value={formData.adminUserName || ''}
                                            type="text"
                                            onChange={handleInputChange}
                                        />

                                        <InputField
                                            id="cityName"
                                            label="Ciudad"
                                            value={formData.cityName || ''}
                                            type="text"
                                            onChange={handleInputChange}
                                        />

                                        <label className="flex gap-[18px] justify-end items-center">
                                            <span>Estado</span>
                                            <select
                                                name="status"
                                                value={formData.status || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                                                }
                                                className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
                                            >
                                                <option value="ACTIVE">Activo</option>
                                                <option value="INACTIVE">Inactivo</option>
                                                <option value="PENDING">Pendiente</option>
                                            </select>
                                        </label>

                                        {mode === 'edit' && (
                                            <>
                                                <div className="flex gap-[18px] justify-end items-center">
                                                    <span>Estudiantes</span>
                                                    <span className="min-w-[250px] px-3 py-2 bg-gray-100 rounded-md">
                                                        {formData.students || 0}
                                                    </span>
                                                </div>
                                                <div className="flex gap-[18px] justify-end items-center">
                                                    <span>Docentes</span>
                                                    <span className="min-w-[250px] px-3 py-2 bg-gray-100 rounded-md">
                                                        {formData.teachers || 0}
                                                    </span>
                                                </div>
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
                                            {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear institución' : 'Actualizar institución'}
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
