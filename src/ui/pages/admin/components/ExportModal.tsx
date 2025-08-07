import React, { useState, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import CustomSelector from '../../../components/CustomSelector';
import { MultiSelectUserSearch } from '../../../components/MultiSelectUserSearch';
import { TeacherSelector } from '../../../components/TeacherSelector';
import { IconComponent } from './Icon';
import type { UserForSelection } from '../../../../actions/users/get-users-for-selection';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (filters: ExportFilters) => void;
    currentFilters: {
        gradeNames?: string[];
        groupNames?: string[];
        shifts?: string[];
        teacherIds?: string[];
        gradeThreshold?: number;
        status?: string;
        search?: string;
        selectedUsers?: UserForSelection[];
    };
}

interface ExportFilters {
    gradeNames?: string[];
    groupNames?: string[];
    shifts?: string[];
    teacherIds?: string[];
    gradeThreshold?: number;
    status?: string;
    search?: string;
    selectedUsers?: UserForSelection[];
    template: boolean;
    delimiter: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    currentFilters,
}) => {
    const [filters, setFilters] = useState<ExportFilters>({
        ...currentFilters,
        template: false,
        delimiter: ',',
    });    const [selectedSearchUsers, setSelectedSearchUsers] = useState<UserForSelection[]>(
        currentFilters.selectedUsers || []
    );

    const [selectedTeacherId, setSelectedTeacherId] = useState<string | undefined>(
        currentFilters.teacherIds?.[0]
    );

    const shiftOptions = useMemo(() => [
        { label: "Mañana", value: "MORNING" },
        { label: "Tarde", value: "AFTERNOON" },
        { label: "Noche", value: "NIGHT" }
    ], []);

    const statusOptions = useMemo(() => [
        { label: "ACTIVO", value: "ACTIVE" },
        { label: "INACTIVO", value: "INACTIVE" },
    ], []);

    const formatOptions = useMemo(() => [
        { label: "Exportar Archivo", value: "false" },
        { label: "Exportar Plantilla", value: "true" }
    ], []);    const handleExport = useCallback(() => {
        const allTeacherIds = [];
        
        // Add selected teacher if any
        if (selectedTeacherId) {
            allTeacherIds.push(selectedTeacherId);
        }
        
        // Add any existing teacher IDs from filters
        if (filters.teacherIds) {
            allTeacherIds.push(...filters.teacherIds);
        }
        
        // Add selected user IDs
        if (selectedSearchUsers.length > 0) {
            allTeacherIds.push(...selectedSearchUsers.map(user => user.id));
        }

        const exportFilters = {
            ...filters,
            selectedUsers: selectedSearchUsers,
            teacherIds: allTeacherIds.length > 0 ? allTeacherIds : undefined,
        };
        onExport(exportFilters);
        onClose();
    }, [filters, selectedSearchUsers, selectedTeacherId, onExport, onClose]);const handleFilterChange = useCallback((key: keyof ExportFilters, value: string | boolean | string[] | number | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50"></div>
            <div className="fixed inset-0 backdrop-blur-sm z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl relative z-10">
                    <div className="flex items-center justify-between mb-6">                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent name="DownloadIcon" size={16} color="#2563eb" />
                        </div>                        <h2 className="text-lg font-semibold text-gray-900">
                            Exportar Estudiantes
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>                <div className="space-y-4">
                    {/* Search field with user selection - moved to top */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar estudiantes por texto:
                        </label>
                        <input
                            type="text"
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
                            placeholder="Buscar estudiantes por nombre, email, etc..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Multi-select user search */}
                    <MultiSelectUserSearch
                        label="Buscar y seleccionar usuarios específicos:"
                        placeholder="Buscar por nombre o email..."
                        selectedUsers={selectedSearchUsers}
                        onSelectionChange={setSelectedSearchUsers}
                        className="mb-4"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtros de exportación:
                        </label>
                        
                        {/* Grade Names */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombres de grados:
                            </label>
                            <input
                                type="text"
                                value={filters.gradeNames?.join(', ') || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const gradeNames = value ? value.split(',').map(s => s.trim()).filter(s => s) : undefined;
                                    handleFilterChange('gradeNames', gradeNames);
                                }}
                                placeholder="Ejemplo: Grado 1, Grado 2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Group Names */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombres de grupos:
                            </label>
                            <input
                                type="text"
                                value={filters.groupNames?.join(', ') || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const groupNames = value ? value.split(',').map(s => s.trim()).filter(s => s) : undefined;
                                    handleFilterChange('groupNames', groupNames);
                                }}
                                placeholder="Ejemplo: Grupo A, Grupo B"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Grid for dropdowns */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <CustomSelector
                                label="Seleccione Turno"
                                width="w-full"
                                value={filters.shifts?.[0]}
                                options={shiftOptions}
                                onChange={(value) => handleFilterChange('shifts', value ? [value] : undefined)}
                            />

                            <CustomSelector
                                label="Seleccione Estado"
                                width="w-full"
                                value={filters.status}
                                options={statusOptions}
                                onChange={(value) => handleFilterChange('status', value)}
                            />
                        </div>                        {/* Teacher Selector */}
                        <TeacherSelector
                            label="Seleccionar profesor:"
                            placeholder="Seleccionar un profesor específico..."
                            value={selectedTeacherId}
                            onChange={(teacherId) => setSelectedTeacherId(teacherId)}
                            className="mb-4"
                        />

                        {/* Grade Threshold */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Umbral de grado:
                            </label>
                            <input
                                type="number"
                                value={filters.gradeThreshold || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    handleFilterChange('gradeThreshold', value ? parseInt(value) : undefined);
                                }}
                                placeholder="Ingrese umbral de grado"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de archivo:
                        </label>
                        <CustomSelector
                            label="Seleccione formato"
                            width="w-full"
                            value={filters.template ? "true" : "false"}
                            options={formatOptions}
                            onChange={(value) => handleFilterChange('template', value === "true")}
                        />
                    </div>
                </div><div className="flex justify-end gap-3 mt-6">
                    <button                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <IconComponent name="DownloadIcon" size={16} color="#ffffff" />
                        Exportar
                    </button>
                </div>
                </div>
            </div>
        </>
    );
};
