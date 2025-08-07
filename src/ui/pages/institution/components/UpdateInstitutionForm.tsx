// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useState, useRef, useEffect } from "react";
// import { updateInstitution, type UpdateInstitutionRequest } from "../../../../actions/institution/update-institution";
// import { getCities, type City } from "../../../../actions/institution/get-cities";
// import { getCurrentInstitution } from "../../../../actions/institution/get-current-institution";
// import { useAuthStore } from "../../../store/auth/useAuthStore";
// import Alert from "../../../components/Alert";
// import { useNotificationStore } from "../../../store/notification/useNotificationStore";
// import { useInstitutionStatus } from '../../../hooks/useInstitutionStatus';


// export default function UpdateInstitutionForm() {
//     const { role } = useAuthStore();
//     const { addNotification } = useNotificationStore();
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     // Fetch current institution data
//     const { data: institutionData } = useQuery({
//         queryKey: ['currentInstitution'],
//         queryFn: getCurrentInstitution,
//         enabled: role === 'INSTITUTION_ADMIN',
//         staleTime: 1000 * 60 * 5, // 5 minutes
//     });

//     const { userData } = useInstitutionStatus();

    
//     const [formData, setFormData] = useState({
//         name: '',
//         address: '',
//         cityId: 0,
//     });
    
//     // Update form data when institution data loads
//     useEffect(() => {
//         if (institutionData) {
//             setFormData({
//                 name: institutionData.name,
//                 address: institutionData.address,
//                 cityId: institutionData.cityId,
//             });
//         }
//     }, [institutionData]);
    
//     const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
//     const [logoPreview, setLogoPreview] = useState<string | null>(null);
//     const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
//     const [showAlert, setShowAlert] = useState(false);

//     // Fetch cities for dropdown
//     const { data: cities = [], isLoading: loadingCities } = useQuery({
//         queryKey: ['cities'],
//         queryFn: getCities,
//         staleTime: 1000 * 60 * 60, // 1 hour
//     });

//     const updateInstitutionMutation = useMutation({
//         mutationFn: (data: UpdateInstitutionRequest) => updateInstitution(data),        onSuccess: (response) => {
//             if (response.success) {
//                 setAlertData({ type: "success", message: response.message || "Institución actualizada exitosamente" });
//                 setShowAlert(true);
//                 addNotification({
//                     message: "Institución actualizada exitosamente",
//                     type: "message",
//                     position: "top",
//                     duration: 4000
//                 });
//                 // Reset logo selection
//                 setSelectedLogo(null);
//                 setLogoPreview(null);
//                 if (fileInputRef.current) {
//                     fileInputRef.current.value = '';
//                 }
//             } else {
//                 setAlertData({ type: "error", message: response.error || "Error al actualizar la institución" });
//                 setShowAlert(true);
//             }
//         },
//         onError: () => {
//             setAlertData({ type: "error", message: "Error al actualizar la institución" });
//             setShowAlert(true);
//         },
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { id, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [id]: id === 'cityId' ? parseInt(value) : value,
//         }));
//     };

//     const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setSelectedLogo(file);
//             // Create preview URL
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setLogoPreview(e.target?.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         // Validate required fields
//         if (!formData.name.trim()) {
//             setAlertData({ type: "error", message: "El nombre de la institución es requerido" });
//             setShowAlert(true);
//             return;
//         }

//         if (!formData.address.trim()) {
//             setAlertData({ type: "error", message: "La dirección es requerida" });
//             setShowAlert(true);
//             return;
//         }

//         if (!formData.cityId || formData.cityId === 0) {
//             setAlertData({ type: "error", message: "Selecciona una ciudad" });
//             setShowAlert(true);
//             return;
//         }

//         const updateData: UpdateInstitutionRequest = {
//             name: formData.name,
//             address: formData.address,
//             cityId: formData.cityId,
//         };

//         if (selectedLogo) {
//             updateData.logo = selectedLogo;
//         }

//         updateInstitutionMutation.mutate(updateData);
//     };

//     return (
//         <div className="p-6">
//             <div className="max-w-2xl">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-2">Actualizar Institución</h2>
//                 <p className="text-gray-600 mb-6">
//                     Aquí puedes actualizar la información de tu institución.
//                 </p>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="flex flex-col">
//                             <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-2">
//                                 Nombre de la institución
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 placeholder="Ingresa el nombre de la institución"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
//                                 required
//                             />
//                         </div>

//                         <div className="flex flex-col">
//                             <label htmlFor="cityId" className="text-sm font-medium text-gray-600 mb-2">
//                                 Ciudad
//                             </label>
//                             <select
//                                 id="cityId"
//                                 value={formData.cityId}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
//                                 required
//                                 disabled={loadingCities}
//                             >
//                                 <option value={0}>Selecciona una ciudad</option>
//                                 {cities.map((city: City) => (
//                                     <option key={city.id} value={city.id}>
//                                         {city.municipality}, {city.department}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="address" className="text-sm font-medium text-gray-600 mb-2">
//                             Dirección
//                         </label>
//                         <input
//                             type="text"
//                             id="address"
//                             placeholder="Ingresa la dirección de la institución"
//                             value={formData.address}
//                             onChange={handleChange}
//                             className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="logo" className="text-sm font-medium text-gray-600 mb-2">
//                             Logo de la institución (opcional)
//                         </label>
//                         <input
//                             ref={fileInputRef}
//                             type="file"
//                             id="logo"
//                             accept="image/*"
//                             onChange={handleLogoChange}
//                             className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
//                         />
//                         {logoPreview && (
//                             <div className="mt-3">
//                                 <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
//                                 <img
//                                     src={logoPreview}
//                                     alt="Logo preview"
//                                     className="w-20 h-20 object-contain border border-gray-200 rounded-lg"
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition font-medium text-sm"
//                         disabled={updateInstitutionMutation.isPending}
//                     >
//                         {updateInstitutionMutation.isPending ? 'Actualizando...' : 'Actualizar Institución'}
//                     </button>
//                 </form>

//                 {alertData && showAlert && (
//                     <Alert
//                         type={alertData.type as 'error' | 'message' | 'alert'}
//                         position="top"
//                         message={alertData.message}
//                         duration={4000}
//                         restartAlert={() => setTimeout(() => {
//                             setShowAlert(false);
//                         }, 500)}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }




import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { updateInstitution, type UpdateInstitutionRequest } from "../../../../actions/institution/update-institution";
import { getCities, type City } from "../../../../actions/institution/get-cities";
import { useAuthStore } from "../../../store/auth/useAuthStore";
import Alert from "../../../components/Alert";
import { useNotificationStore } from "../../../store/notification/useNotificationStore";
import { useInstitutionStatus } from '../../../hooks/useInstitutionStatus';

export default function UpdateInstitutionForm() {
    const { role } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { userData } = useInstitutionStatus();


    const [formData, setFormData] = useState({
        name: '',
        address: '',
        cityId: 0,
    });
    
    // Update form data when userData loads
    useEffect(() => {
        if (userData?.institutionName) {
            setFormData(prev => ({
                ...prev,
                name: userData.institutionName || '',
                // Puedes agregar más campos aquí si userData tiene más información
                // address: userData.institutionAddress || '',
                // cityId: userData.institutionCityId || 0,
            }));
        }
    }, [userData]);
    
    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [alertData, setAlertData] = useState<{ type: string; message: string } | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch cities for dropdown
    const { data: cities = [], isLoading: loadingCities } = useQuery({
        queryKey: ['cities'],
        queryFn: getCities,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const updateInstitutionMutation = useMutation({
        mutationFn: (data: UpdateInstitutionRequest) => updateInstitution(data, {
            onProgress: (progress) => {
                setUploadProgress(progress);
            },
            onStart: () => {
                setIsUploading(true);
                setUploadProgress(0);
            },
            onComplete: () => {
                setIsUploading(false);
                setUploadProgress(0);
            }
        }),
        onSuccess: (response) => {
            if (response.success) {
                // Solo usar la notificación global, eliminar la alerta local
                addNotification({
                    message: response.message || "Institución actualizada exitosamente",
                    type: "message",
                    position: "top",
                    duration: 4000
                });
                // Reset logo selection
                setSelectedLogo(null);
                setLogoPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setAlertData({ type: "error", message: response.error || "Error al actualizar la institución" });
                setShowAlert(true);
            }
        },
        onError: () => {
            setAlertData({ type: "error", message: "Error al actualizar la institución" });
            setShowAlert(true);
            setIsUploading(false);
            setUploadProgress(0);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === 'cityId' ? parseInt(value) : value,
        }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedLogo(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name.trim()) {
            setAlertData({ type: "error", message: "El nombre de la institución es requerido" });
            setShowAlert(true);
            return;
        }

        if (!formData.address.trim()) {
            setAlertData({ type: "error", message: "La dirección es requerida" });
            setShowAlert(true);
            return;
        }

        if (!formData.cityId || formData.cityId === 0) {
            setAlertData({ type: "error", message: "Selecciona una ciudad" });
            setShowAlert(true);
            return;
        }

        const updateData: UpdateInstitutionRequest = {
            name: formData.name,
            address: formData.address,
            cityId: formData.cityId,
        };

        if (selectedLogo) {
            updateData.logo = selectedLogo;
        }

        updateInstitutionMutation.mutate(updateData);
    };

    return (
        <div className="p">
            <div className="max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Actualizar Institución</h2>
                <p className="text-gray-600 mb-6">
                    Aquí puedes actualizar la información de tu institución.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-2">
                                Nombre de la institución
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Ingresa el nombre de la institución"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="cityId" className="text-sm font-medium text-gray-600 mb-2">
                                Ciudad
                            </label>
                            <select
                                id="cityId"
                                value={formData.cityId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                                required
                                disabled={loadingCities}
                            >
                                <option value={0}>Selecciona una ciudad</option>
                                {cities.map((city: City) => (
                                    <option key={city.id} value={city.id}>
                                        {city.municipality}, {city.department}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="address" className="text-sm font-medium text-gray-600 mb-2">
                            Dirección
                        </label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Ingresa la dirección de la institución"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="logo" className="text-sm font-medium text-gray-600 mb-2">
                            Logo de la institución (opcional)
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                            disabled={isUploading}
                        />
                        {logoPreview && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-20 h-20 object-contain border border-gray-200 rounded-lg"
                                />
                            </div>
                        )}
                        {isUploading && (
                            <div className="mt-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-slate-800 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">{uploadProgress.toFixed(0)}%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={updateInstitutionMutation.isPending || isUploading}
                    >
                        {isUploading 
                            ? `Subiendo logo... ${uploadProgress.toFixed(0)}%` 
                            : updateInstitutionMutation.isPending 
                                ? 'Actualizando...' 
                                : 'Actualizar Institución'
                        }
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