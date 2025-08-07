import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createInstitution, type CreateInstitutionData } from '../../../actions/institution/create-institution';
import { getCities, type City } from '../../../actions/institution/get-cities';
import Alert from '../../components/Alert';

const CreateInstitution: React.FC = () => {    const [formData, setFormData] = useState({
        institutionName: '',
        address: '',
        city: '',
        logo: null as File | null
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();    // Hooks de TanStack Query para gestión de datos del servidor
    // useQuery para obtener las ciudades disponibles con cache automático
    // useMutation para el proceso de creación de institución con manejo de estados
    const { data: cities = [], isLoading: loadingCities, error: citiesError } = useQuery<City[]>({
        queryKey: ['cities'],
        staleTime: 3000, // 5 minutos - tiempo de validez del cache
        queryFn: () => getCities(),
    });

    const createInstitutionMutation = useMutation({
        mutationFn: (data: CreateInstitutionData) => createInstitution(data),
        onSuccess: (result) => {
            if (result.success) {
                navigate('/configure-institution'); // Redirige al siguiente paso del onboarding
            } else {
                setError(result.message);
            }
        },
        onError: (err: Error) => {
            setError(err.message || 'Error al crear la institución');
        },
    });

    // Handle cities error
    useEffect(() => {
        if (citiesError) {
            setError('Error al cargar las ciudades');
        }
    }, [citiesError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === "image/png" || file.type === "image/jpeg") {
                setFormData(prev => ({
                    ...prev,
                    logo: file
                }));
                setError(null);
            } else {
                setError("El archivo debe ser PNG o JPG");
            }
        }
    };    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);        // Validate form data
        if (!formData.institutionName || !formData.address || !formData.city) {
            setError('Todos los campos obligatorios deben ser completados');
            return;
        }// Find the selected city ID
        const selectedCityId = parseInt(formData.city);
        const selectedCity = cities.find((city) => city.id === selectedCityId);
        if (!selectedCity) {
            setError('Ciudad seleccionada no válida');
            return;
        }        // Prepare data for API call
        const institutionData: CreateInstitutionData = {
            name: formData.institutionName,
            address: formData.address,
            cityId: selectedCityId,
        };
        
        // Only include logo if one was selected
        if (formData.logo) {
            institutionData.logo = formData.logo;
        }

        // Call the mutation
        createInstitutionMutation.mutate(institutionData);
    };

    const restartAlert = () => {
        setError(null);
    };    const isFormValid = formData.institutionName && formData.address && formData.city;

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat relative py-8"
            style={{
                backgroundImage: `url('/src/assets/background-policies.png')`,
                backgroundPosition: 'top center'
            }}
        >
            <div className="w-full max-w-[505px] relative z-20">
                {/* Main Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col justify-between min-h-[800px]">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <img 
                            src="/assets/images/logo-smart_class.svg" 
                            alt="SmartClass" 
                            className="mx-auto h-32 w-32"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-base font-medium text-gray-800 mb-6">
                        Crear institución
                    </h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Institution Name */}
                        <div>
                            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-800 mb-2">
                                Institución
                            </label>
                            <input
                                type="text"
                                id="institutionName"
                                name="institutionName"
                                value={formData.institutionName}
                                onChange={handleInputChange}
                                placeholder="Nombre de la institución"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-800 mb-2">
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Dirección de la institución"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                required
                            />
                        </div>                        {/* City */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-800 mb-2">
                                Ciudad
                            </label>
                            <select
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                disabled={loadingCities}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            >
                                <option value="">
                                    {loadingCities ? 'Cargando ciudades...' : 'Ciudad de la institución'}
                                </option>                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.municipality}, {city.department}
                                    </option>
                                ))}
                            </select>
                        </div>                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Subir logo de la institución (opcional)
                            </label>
                            <div className="w-full px-3 py-8 border border-gray-300 rounded-md text-center">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="logo"
                                        className="cursor-pointer text-sm text-gray-400 hover:text-gray-600"
                                    >
                                        {formData.logo ? formData.logo.name : 'Seleccionar archivo'}
                                        <input
                                            id="logo"
                                            name="logo"
                                            type="file"
                                            className="sr-only"
                                            accept=".png,.jpg,.jpeg"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-400">
                                        Formato PNG o JPG
                                    </p>
                                </div>
                            </div>
                        </div>{/* Submit Button */}                        <button
                            type="submit"
                            disabled={!isFormValid || createInstitutionMutation.isPending}
                            className={`w-full py-2.5 rounded-md text-sm font-medium transition-all ${
                                isFormValid && !createInstitutionMutation.isPending
                                    ? 'bg-[#0F1D2E] text-white hover:bg-[#1a2940]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {createInstitutionMutation.isPending ? 'Procesando...' : 'Siguiente'}
                        </button>
                    </form>

                    {/* Stepper inside card */}
                    <div className="flex justify-center mt-auto pt-6 space-x-2">
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-sm">
                            1
                        </div>
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-800 font-medium text-sm">
                            2
                        </div>
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-sm">
                            3
                        </div>
                    </div>                </div> {/* Closing Main Card div */}

                {/* Error Alert */}
                {error && (
                    <Alert
                        message={error}
                        type="error"
                        position="left-bottom"
                        restartAlert={restartAlert}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateInstitution;
