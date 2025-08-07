// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useRef, useState, useEffect } from "react";
// import * as React from "react";
// import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// import InputField from "../../admin/components/InputField";
// import { useClickOutside } from "../../../hooks/useClickOutside";
// import Alert from "../../../components/Alert";
// import { postCreateStudent } from "../../../../actions/student/post-create-student";
// import { getUserData } from "../../../../actions/user/get-user-data";
// import { useAuthStore } from '../../../store/auth/useAuthStore';

// interface StudentData {
//     id?: string;
//     studentCode?: string;
//     firstName?: string;
//     lastName?: string;
//     grade?: string;
//     group?: string;
//     shift?: string;
//     academicPerformance?: {
//         grade?: string;
//         performance?: number;
//     };
//     status?: string;
// }

// interface Props {
//     isOpen: boolean;
//     onClose: () => void;
//     mode: 'create' | 'edit';
//     studentData?: StudentData | null;
// }

// export const StudentModal = ({ isOpen, onClose, mode, studentData }: Props) => {
//     const modalRef = useRef<HTMLDivElement | null>(null);
//     const queryClient = useQueryClient();

//     const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
//     const [showAlert, setShowAlert] = useState(false);

//     useClickOutside(modalRef, onClose, isOpen);    const [formData, setFormData] = useState<StudentData>({
//         studentCode: '',
//         firstName: '',
//         lastName: '',
//         grade: '',
//         group: '',
//         shift: 'MORNING',
//         status: 'ACTIVE'    });

//     const { role } = useAuthStore();
//     // Fetch user data for institution configuration (shifts)
//     const { data: userData } = useQuery({
//         queryKey: ['userData'],
//         staleTime: 1000 * 60 * 60,
//         queryFn: () => getUserData(),
//         enabled: role === 'INSTITUTION_ADMIN',
//     });// Dynamic options based on institution configuration
//     const shiftOptions = userData?.shifts?.map((shift) => ({
//         label: shift === 'MORNING' ? 'Mañana' : shift === 'AFTERNOON' ? 'Tarde' : 'Noche',
//         value: shift,
//     })) || [
//         { label: 'Mañana', value: 'MORNING' },
//         { label: 'Tarde', value: 'AFTERNOON' },
//         { label: 'Noche', value: 'NIGHT' }
//     ];

//     // Dynamic grade options based on institution configuration
//     const gradeOptions = React.useMemo(() => {
//         if (!userData?.grades) return [{ label: '1', value: '1' }]; // Fallback
        
//         return userData.grades
//             .filter(grade => grade != null)
//             .map((grade) => {
//                 // Handle both string grades and Grade object grades
//                 if (typeof grade === 'string') {
//                     return {
//                         label: grade,
//                         value: grade,
//                     };
//                 } else {
//                     // Grade object with id and name
//                     return grade.id != null && grade.name ? {
//                         label: grade.name,
//                         value: grade.name,
//                     } : null;
//                 }
//             })
//             .filter(Boolean) as Array<{ label: string; value: string }>;
//     }, [userData?.grades]);

//     // Dynamic group options based on institution configuration
//     const groupOptions = userData?.groups?.map((group) => ({
//         label: group,
//         value: group,
//     })) || [{ label: 'A', value: 'A' }]; // Fallback

//     // Load student data when opening in edit mode
//     useEffect(() => {
//         if (mode === 'edit' && studentData) {
//             setFormData({
//                 id: studentData.id,
//                 studentCode: studentData.studentCode,
//                 firstName: studentData.firstName,
//                 lastName: studentData.lastName,
//                 grade: studentData.academicPerformance?.grade || studentData.grade,
//                 group: studentData.group,
//                 shift: studentData.shift,
//                 academicPerformance: studentData.academicPerformance,
//                 status: studentData.status
//             });
//         } else {
//             // Clear form in create mode
//             setFormData({
//                 studentCode: '',
//                 firstName: '',
//                 lastName: '',
//                 grade: '',
//                 group: '',
//                 shift: 'MORNING',
//                 status: 'ACTIVE'
//             });        }
//     }, [mode, studentData]);

//     // Set default values when userData is loaded (for create mode)
//     useEffect(() => {
//         if (userData && mode === 'create' && gradeOptions.length > 0 && groupOptions.length > 0 && shiftOptions.length > 0) {
//             setFormData(prev => ({
//                 ...prev,
//                 grade: gradeOptions[0]?.value || '',
//                 group: groupOptions[0]?.value || '',
//                 shift: shiftOptions[0]?.value || 'MORNING',
//             }));
//         }
//     }, [userData, gradeOptions, groupOptions, shiftOptions, mode]);// TODO: Implement actual API calls for student CRUD
//     const updateStudentMutation = useMutation({
//         mutationFn: async (data: StudentData) => {
//             // Placeholder for actual API call
//             return Promise.resolve({ success: true, data: { alert: "Estudiante actualizado exitosamente" } });
//         },        onSuccess: (response) => {
//             if (response.success) {
//                 setShowAlert(true);
//                 setAlertData({ type: "message", message: response.data.alert });
//                 queryClient.invalidateQueries({ queryKey: ['students'] });
//                 queryClient.invalidateQueries({ queryKey: ['userData'] }); // Refresh institution dashboard counts
//                 setTimeout(() => onClose(), 2000);
//             } else {
//                 setShowAlert(true);
//                 setAlertData({ type: "error", message: response.data.alert });
//             }
//         },
//         onError: (error: any) => {
//             setAlertData({ type: "error", message: error.data?.alert || "Error al actualizar estudiante" });
//             setShowAlert(true);
//         },
//     });    const createStudentMutation = useMutation({
//         mutationFn: async (data: StudentData) => {
//             return await postCreateStudent(
//                 data.studentCode || "",
//                 data.firstName || "",
//                 data.lastName || "",
//                 data.grade || "",
//                 data.group || "",
//                 data.shift as "MORNING" | "AFTERNOON" || "MORNING",
//                 data.status as "ACTIVE" | "INACTIVE" || "ACTIVE"
//             );
//         },        onSuccess: () => {
//             setShowAlert(true);
//             setAlertData({ type: "message", message: "Estudiante creado exitosamente" });
//             queryClient.invalidateQueries({ queryKey: ['students'] });
//             queryClient.invalidateQueries({ queryKey: ['userData'] }); // Refresh institution dashboard counts
//             setTimeout(() => onClose(), 2000);
//         },
//         onError: (error: any) => {
//             setAlertData({ type: "error", message: error?.message || "Error al crear estudiante" });
//             setShowAlert(true);
//         },
//     });

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { id, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [id]: value,
//         }));
//     };    const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (mode === 'edit') {
//             updateStudentMutation.mutate(formData);
//         } else if (mode === 'create') {
//             createStudentMutation.mutate(formData);
//         }
//     };

//     const isLoading = updateStudentMutation.isPending || createStudentMutation.isPending;

//     return (
//         <Transition show={isOpen} as={Fragment}>
//             <Dialog as="div" className="relative z-50" onClose={onClose}>
//                 <Transition
//                     show={isOpen}
//                     as={Fragment}
//                     enter="ease-out duration-200"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-150"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
//                 </Transition>

//                 <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-4">
//                         <Transition
//                             show={isOpen}
//                             as={Fragment}
//                             enter="ease-out duration-200"
//                             enterFrom="opacity-0 scale-95"
//                             enterTo="opacity-100 scale-100"
//                             leave="ease-in duration-150"
//                             leaveFrom="opacity-100 scale-100"
//                             leaveTo="opacity-0 scale-95"
//                         >
//                             <div
//                                 ref={modalRef}
//                                 className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
//                                 role="dialog"
//                                 aria-modal="true"
//                                 aria-labelledby="modal-title"
//                             >
//                                 <h2 className="text-lg font-semibold mb-4">
//                                     {mode === 'create' ? 'Crear nuevo estudiante' : 'Editar estudiante'}
//                                 </h2>
                                
//                                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                                     <div className="flex flex-col gap-4 mt-4 text-[14px]">
//                                         <InputField
//                                             id="studentCode"
//                                             label="Código estudiantil"
//                                             value={formData.studentCode || ''}
//                                             type="text"
//                                             onChange={handleInputChange}
//                                         />

//                                         <InputField
//                                             id="firstName"
//                                             label="Nombre"
//                                             value={formData.firstName || ''}
//                                             type="text"
//                                             onChange={handleInputChange}
//                                         />                                        <InputField
//                                             id="lastName"
//                                             label="Apellido"
//                                             value={formData.lastName || ''}
//                                             type="text"
//                                             onChange={handleInputChange}
//                                         />

//                                         <label className="flex gap-[18px] justify-end items-center">
//                                             <span>Grado</span>
//                                             <select
//                                                 name="grade"
//                                                 value={formData.grade || gradeOptions[0]?.value || ''}
//                                                 onChange={(e) =>
//                                                     setFormData((prev) => ({ ...prev, grade: e.target.value }))
//                                                 }
//                                                 className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
//                                             >
//                                                 {gradeOptions.map(option => (
//                                                     <option key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </label>

//                                         <label className="flex gap-[18px] justify-end items-center">
//                                             <span>Grupo</span>
//                                             <select
//                                                 name="group"
//                                                 value={formData.group || groupOptions[0]?.value || ''}
//                                                 onChange={(e) =>
//                                                     setFormData((prev) => ({ ...prev, group: e.target.value }))
//                                                 }
//                                                 className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
//                                             >
//                                                 {groupOptions.map(option => (
//                                                     <option key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </label><label className="flex gap-[18px] justify-end items-center">
//                                             <span>Jornada</span>
//                                             <select
//                                                 name="shift"
//                                                 value={formData.shift || 'MORNING'}
//                                                 onChange={(e) =>
//                                                     setFormData((prev) => ({ ...prev, shift: e.target.value }))
//                                                 }
//                                                 className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
//                                             >
//                                                 {shiftOptions.map(option => (
//                                                     <option key={option.value} value={option.value}>
//                                                         {option.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </label>

//                                         <label className="flex gap-[18px] justify-end items-center">
//                                             <span>Estado</span>
//                                             <select
//                                                 name="status"
//                                                 value={formData.status || 'ACTIVE'}
//                                                 onChange={(e) =>
//                                                     setFormData((prev) => ({ ...prev, status: e.target.value }))
//                                                 }
//                                                 className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
//                                             >
//                                                 <option value="ACTIVE">Activo</option>
//                                                 <option value="INACTIVE">Inactivo</option>
//                                                 <option value="PENDING">Pendiente</option>
//                                             </select>
//                                         </label>

//                                         {mode === 'edit' && formData.academicPerformance && (
//                                             <div className="flex gap-[18px] justify-end items-center">
//                                                 <span>Promedio actual</span>
//                                                 <span className="min-w-[250px] px-3 py-2 bg-gray-100 rounded-md">
//                                                     {formData.academicPerformance.performance || 'N/A'}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="mt-6 flex justify-end gap-2">
//                                         <button
//                                             type="button"
//                                             onClick={onClose}
//                                             className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                                         >
//                                             Cancelar
//                                         </button>
//                                         <button
//                                             type="submit"
//                                             disabled={isLoading}
//                                             className="bg-background text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-50"
//                                         >
//                                             {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear estudiante' : 'Actualizar estudiante'}
//                                         </button>
//                                     </div>
//                                 </form>
                                
//                                 {alertData && showAlert && (
//                                     <Alert
//                                         type={alertData.type as 'error' | 'message' | 'alert'}
//                                         position="top"
//                                         message={alertData.message}
//                                         duration={4000}
//                                         restartAlert={() => setTimeout(() => {
//                                             setShowAlert(false);
//                                         }, 500)}
//                                     />
//                                 )}
//                             </div>
//                         </Transition>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// };



import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect, useMemo } from "react";
import * as React from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import InputField from "../../admin/components/InputField";
import { useClickOutside } from "../../../hooks/useClickOutside";
import Alert from "../../../components/Alert";
import { postCreateStudent } from "../../../../actions/student/post-create-student";
import { getUserData } from "../../../../actions/user/get-user-data";
import { useAuthStore } from '../../../store/auth/useAuthStore';

interface StudentData {
    id?: string;
    studentCode?: string;
    firstName?: string;
    lastName?: string;
    grade?: string;
    group?: string;
    shift?: string;
    academicPerformance?: {
        grade?: string;
        performance?: number;
    };
    status?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    studentData?: StudentData | null;
}

export const StudentModal = ({ isOpen, onClose, mode, studentData }: Props) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();

    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    useClickOutside(modalRef, onClose, isOpen);

    const [formData, setFormData] = useState<StudentData>({
        studentCode: '',
        firstName: '',
        lastName: '',
        grade: '',
        group: '',
        shift: 'MORNING',
        status: 'ACTIVE'
    });

    const { role } = useAuthStore();
    
    // Fetch user data for institution configuration (shifts)
    const { data: userData } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getUserData(),
        enabled: role === 'INSTITUTION_ADMIN',
    });

    // 🔧 FIXED: Memoize all options to prevent infinite re-renders
    const shiftOptions = useMemo(() => {
        return userData?.shifts?.map((shift) => ({
            label: shift === 'MORNING' ? 'Mañana' : shift === 'AFTERNOON' ? 'Tarde' : 'Noche',
            value: shift,
        })) || [
            { label: 'Mañana', value: 'MORNING' },
            { label: 'Tarde', value: 'AFTERNOON' },
            { label: 'Noche', value: 'NIGHT' }
        ];
    }, [userData?.shifts]);

    // 🔧 FIXED: This was already memoized, but ensure it's stable
    const gradeOptions = useMemo(() => {
        if (!userData?.grades) return [{ label: '1', value: '1' }]; // Fallback
        
        return userData.grades
            .filter(grade => grade != null)
            .map((grade) => {
                // Handle both string grades and Grade object grades
                if (typeof grade === 'string') {
                    return {
                        label: grade,
                        value: grade,
                    };
                } else {
                    // Grade object with id and name
                    return grade.id != null && grade.name ? {
                        label: grade.name,
                        value: grade.name,
                    } : null;
                }
            })
            .filter(Boolean) as Array<{ label: string; value: string }>;
    }, [userData?.grades]);

    // 🔧 FIXED: Memoize group options
    const groupOptions = useMemo(() => {
        return userData?.groups?.map((group) => ({
            label: group,
            value: group,
        })) || [{ label: 'A', value: 'A' }]; // Fallback
    }, [userData?.groups]);

    // Load student data when opening in edit mode
    useEffect(() => {
        if (mode === 'edit' && studentData) {
            setFormData({
                id: studentData.id,
                studentCode: studentData.studentCode,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                grade: studentData.academicPerformance?.grade || studentData.grade,
                group: studentData.group,
                shift: studentData.shift,
                academicPerformance: studentData.academicPerformance,
                status: studentData.status
            });
        } else {
            // Clear form in create mode
            setFormData({
                studentCode: '',
                firstName: '',
                lastName: '',
                grade: '',
                group: '',
                shift: 'MORNING',
                status: 'ACTIVE'
            });
        }
    }, [mode, studentData]);

    // 🔧 FIXED: Set default values when userData is loaded (for create mode)
    // Added check to prevent setting defaults if form already has values
    useEffect(() => {
        if (userData && mode === 'create' && gradeOptions.length > 0 && groupOptions.length > 0 && shiftOptions.length > 0) {
            // Only set defaults if the form fields are empty
            setFormData(prev => {
                const needsDefaults = !prev.grade || !prev.group || !prev.shift;
                if (needsDefaults) {
                    return {
                        ...prev,
                        grade: prev.grade || gradeOptions[0]?.value || '',
                        group: prev.group || groupOptions[0]?.value || '',
                        shift: prev.shift || shiftOptions[0]?.value || 'MORNING',
                    };
                }
                return prev;
            });
        }
    }, [userData, gradeOptions, groupOptions, shiftOptions, mode]);

    // TODO: Implement actual API calls for student CRUD
    const updateStudentMutation = useMutation({
        mutationFn: async (data: StudentData) => {
            // Placeholder for actual API call
            return Promise.resolve({ success: true, data: { alert: "Estudiante actualizado exitosamente" } });
        },
        onSuccess: (response) => {
            if (response.success) {
                setShowAlert(true);
                setAlertData({ type: "message", message: response.data.alert });
                queryClient.invalidateQueries({ queryKey: ['students'] });
                queryClient.invalidateQueries({ queryKey: ['userData'] }); // Refresh institution dashboard counts
                setTimeout(() => onClose(), 2000);
            } else {
                setShowAlert(true);
                setAlertData({ type: "error", message: response.data.alert });
            }
        },
        onError: (error: any) => {
            setAlertData({ type: "error", message: error.data?.alert || "Error al actualizar estudiante" });
            setShowAlert(true);
        },
    });

    const createStudentMutation = useMutation({
        mutationFn: async (data: StudentData) => {
            return await postCreateStudent(
                data.studentCode || "",
                data.firstName || "",
                data.lastName || "",
                data.grade || "",
                data.group || "",
                data.shift as "MORNING" | "AFTERNOON" || "MORNING",
                data.status as "ACTIVE" | "INACTIVE" || "ACTIVE"
            );
        },
        onSuccess: () => {
            setShowAlert(true);
            setAlertData({ type: "message", message: "Estudiante creado exitosamente" });
            queryClient.invalidateQueries({ queryKey: ['students'] });
            queryClient.invalidateQueries({ queryKey: ['userData'] }); // Refresh institution dashboard counts
            setTimeout(() => onClose(), 2000);
        },
        onError: (error: any) => {
            setAlertData({ type: "error", message: error?.message || "Error al crear estudiante" });
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
            updateStudentMutation.mutate(formData);
        } else if (mode === 'create') {
            createStudentMutation.mutate(formData);
        }
    };

    const isLoading = updateStudentMutation.isPending || createStudentMutation.isPending;

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
                                    {mode === 'create' ? 'Crear nuevo estudiante' : 'Editar estudiante'}
                                </h2>
                                
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-4 mt-4 text-[14px]">
                                        <InputField
                                            id="studentCode"
                                            label="Código estudiantil"
                                            value={formData.studentCode || ''}
                                            type="text"
                                            onChange={handleInputChange}
                                        />

                                        <InputField
                                            id="firstName"
                                            label="Nombre"
                                            value={formData.firstName || ''}
                                            type="text"
                                            onChange={handleInputChange}
                                        />

                                        <InputField
                                            id="lastName"
                                            label="Apellido"
                                            value={formData.lastName || ''}
                                            type="text"
                                            onChange={handleInputChange}
                                        />

                                        <label className="flex gap-[18px] justify-end items-center">
                                            <span>Grado</span>
                                            <select
                                                name="grade"
                                                value={formData.grade || gradeOptions[0]?.value || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, grade: e.target.value }))
                                                }
                                                className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
                                            >
                                                {gradeOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="flex gap-[18px] justify-end items-center">
                                            <span>Grupo</span>
                                            <select
                                                name="group"
                                                value={formData.group || groupOptions[0]?.value || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, group: e.target.value }))
                                                }
                                                className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
                                            >
                                                {groupOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="flex gap-[18px] justify-end items-center">
                                            <span>Jornada</span>
                                            <select
                                                name="shift"
                                                value={formData.shift || 'MORNING'}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, shift: e.target.value }))
                                                }
                                                className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
                                            >
                                                {shiftOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="flex gap-[18px] justify-end items-center">
                                            <span>Estado</span>
                                            <select
                                                name="status"
                                                value={formData.status || 'ACTIVE'}
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

                                        {mode === 'edit' && formData.academicPerformance && (
                                            <div className="flex gap-[18px] justify-end items-center">
                                                <span>Promedio actual</span>
                                                <span className="min-w-[250px] px-3 py-2 bg-gray-100 rounded-md">
                                                    {formData.academicPerformance.performance || 'N/A'}
                                                </span>
                                            </div>
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
                                            {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear estudiante' : 'Actualizar estudiante'}
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