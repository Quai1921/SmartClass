import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createInstitutionStructure, type InstitutionStructureData } from '../../../actions/institution/create-institution-structure';
import { getShifts, type Shift } from '../../../actions/institution/get-shifts';
import { getGrades, type Grade } from '../../../actions/institution/get-grades';
import { getInstitutionDefaults, type InstitutionDefaults } from '../../../actions/institution/get-institution-defaults';
import Alert from '../../components/Alert';

const ConfigureInstitution: React.FC = () => {
    const [formData, setFormData] = useState({
        shift: '',
        fromGrade: 0,
        toGrade: 11,
        groups: [] as string[]
    });
    const [customGroups, setCustomGroups] = useState<string[]>([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch dynamic data using TanStack Query
    const { data: shifts = [], isLoading: loadingShifts } = useQuery<Shift[]>({
        queryKey: ['shifts'],
        queryFn: getShifts,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { data: grades = [], isLoading: loadingGrades } = useQuery<Grade[]>({
        queryKey: ['grades'],
        queryFn: getGrades,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { data: institutionDefaults, isLoading: loadingDefaults } = useQuery<InstitutionDefaults>({
        queryKey: ['institution-defaults'],
        queryFn: getInstitutionDefaults,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Initialize form data when defaults are loaded
    useEffect(() => {
        if (institutionDefaults && formData.groups.length === 0) {
            setFormData(prev => ({
                ...prev,
                groups: institutionDefaults.defaultGroups,
                shift: shifts.length > 0 ? shifts[0].value : ''
            }));
        }
    }, [institutionDefaults, shifts, formData.groups.length]);    const createStructureMutation = useMutation({
        mutationFn: (data: InstitutionStructureData) => createInstitutionStructure(data),
        onSuccess: () => {
            navigate('/onboarding-success');
        },
        onError: (err: Error) => {
            setError(err.message || 'Error al configurar la institución');
        },
    });

    // Check if any data is still loading
    const isLoading = loadingShifts || loadingGrades || loadingDefaults;

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'fromGrade' || name === 'toGrade' ? parseInt(value) : value
        }));
    };

    const addNewGroup = () => {
        if (newGroupName.trim() && !customGroups.includes(newGroupName.trim())) {
            setCustomGroups(prev => [...prev, newGroupName.trim()]);
            setNewGroupName('');
        }
    };

    const removeGroup = (groupToRemove: string) => {
        setCustomGroups(prev => prev.filter(group => group !== groupToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);        // Combine default groups with custom groups for the final structure
        const allGroups = [...formData.groups, ...customGroups];
        
        const structureData: InstitutionStructureData = {
            shifts: [{
                shift: formData.shift,
                fromGrade: formData.fromGrade,
                toGrade: formData.toGrade,
                groupNames: allGroups
            }],            thresholds: institutionDefaults?.thresholds || {
                lowMax: 4.5,
                midMax: 7.0,
                highMax: 10.0
            }
        };

        createStructureMutation.mutate(structureData);
    };

    const restartAlert = () => {
        setError(null);
    };

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
                    <form onSubmit={handleSubmit} className="space-y-6">                        {/* Shift/Schedule */}
                        <div>
                            <label htmlFor="shift" className="block text-sm font-medium text-gray-800 mb-2">
                                Jornada
                            </label>
                            <select
                                id="shift"
                                name="shift"
                                value={formData.shift}
                                onChange={handleInputChange}
                                disabled={loadingShifts}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            >
                                <option value="">
                                    {loadingShifts ? 'Cargando jornadas...' : 'Seleccionar jornada'}
                                </option>
                                {shifts.map((shift: Shift) => (
                                    <option key={shift.value} value={shift.value}>
                                        {shift.label}
                                    </option>
                                ))}
                            </select>
                        </div>                        {/* From Grade */}
                        <div>
                            <label htmlFor="fromGrade" className="block text-sm font-medium text-gray-800 mb-2">
                                Grado mínimo
                            </label>
                            <select
                                id="fromGrade"
                                name="fromGrade"
                                value={formData.fromGrade}
                                onChange={handleInputChange}
                                disabled={loadingGrades}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            >
                                <option value="">
                                    {loadingGrades ? 'Cargando grados...' : 'Seleccionar grado mínimo'}
                                </option>
                                {grades.map((grade: Grade) => (
                                    <option key={grade.value} value={grade.value}>
                                        {grade.label}
                                    </option>
                                ))}
                            </select>
                        </div>                        {/* To Grade */}
                        <div>
                            <label htmlFor="toGrade" className="block text-sm font-medium text-gray-800 mb-2">
                                Grado máximo
                            </label>
                            <select
                                id="toGrade"
                                name="toGrade"
                                value={formData.toGrade}
                                onChange={handleInputChange}
                                disabled={loadingGrades}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            >
                                <option value="">
                                    {loadingGrades ? 'Cargando grados...' : 'Seleccionar grado máximo'}
                                </option>
                                {grades.map((grade: Grade) => (
                                    <option key={grade.value} value={grade.value}>
                                        {grade.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Groups */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                                Grupos
                            </label>
                            <div className="space-y-3">
                                {/* Default groups display */}
                                <div className="text-sm text-gray-600">
                                    Grupos por defecto: {formData.groups.join(', ')}
                                </div>
                                
                                {/* Custom groups */}
                                {customGroups.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm text-gray-600">Grupos personalizados:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {customGroups.map(group => (
                                                <span 
                                                    key={group}
                                                    className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center"
                                                >
                                                    {group}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGroup(group)}
                                                        className="ml-2 text-gray-500 hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Add new group */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        placeholder="Nombre del grupo"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addNewGroup}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Add New Group Button */}
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-gray-600 underline hover:text-gray-800"
                            >
                                Agregar grupo nuevo
                            </button>
                        </div>                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={createStructureMutation.isPending || isLoading || !formData.shift}
                            className={`w-full py-2.5 rounded-md text-sm font-medium transition-all ${
                                !createStructureMutation.isPending && !isLoading && formData.shift
                                    ? 'bg-[#0F1D2E] text-white hover:bg-[#1a2940]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {createStructureMutation.isPending ? 'Procesando...' : 
                             isLoading ? 'Cargando configuración...' : 'Siguiente'}
                        </button>
                    </form>

                    {/* Stepper inside card */}
                    <div className="flex justify-center mt-auto pt-6 space-x-2">
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-sm">
                            1
                        </div>
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-sm">
                            2
                        </div>
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-800 font-medium text-sm">
                            3
                        </div>
                    </div>
                </div>

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

export default ConfigureInstitution;
