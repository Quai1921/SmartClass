import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTeachersForSelection, type TeacherForSelection } from '../../actions/teacher/get-teachers-for-selection';

interface MultiSelectTeacherSearchProps {
    label: string;
    placeholder?: string;
    selectedTeachers: TeacherForSelection[];
    onSelectionChange: (teachers: TeacherForSelection[]) => void;
    className?: string;
}

export const MultiSelectTeacherSearch: React.FC<MultiSelectTeacherSearchProps> = ({
    label,
    placeholder = "Buscar docentes...",
    selectedTeachers,
    onSelectionChange,
    className = "",
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { data: teachers = [], isLoading } = useQuery({
        queryKey: ['teachers-selection', searchTerm],
        queryFn: () => getTeachersForSelection(searchTerm || undefined),
        enabled: isOpen || searchTerm.length > 0,
    });    const filteredTeachers = useMemo(() => {
        return teachers.filter((teacher: TeacherForSelection) => 
            !selectedTeachers.some(selected => selected.id === teacher.id)
        );
    }, [teachers, selectedTeachers]);

    const handleSelectTeacher = useCallback((teacher: TeacherForSelection) => {
        onSelectionChange([...selectedTeachers, teacher]);
        setSearchTerm("");
        setIsOpen(false);
    }, [selectedTeachers, onSelectionChange]);

    const handleRemoveTeacher = useCallback((teacherId: string) => {
        onSelectionChange(selectedTeachers.filter(teacher => teacher.id !== teacherId));
    }, [selectedTeachers, onSelectionChange]);

    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            
            {/* Selected teachers */}
            {selectedTeachers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTeachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                        >
                            <User className="w-3 h-3" />
                            <span>{teacher.fullName}</span>
                            <button
                                onClick={() => handleRemoveTeacher(teacher.id)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {isLoading ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                            Buscando docentes...
                        </div>
                    ) : filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher: TeacherForSelection) => (
                            <button
                                key={teacher.id}
                                onClick={() => handleSelectTeacher(teacher)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {teacher.fullName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {teacher.email}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                            {searchTerm ? 'No se encontraron docentes' : 'Escribe para buscar docentes'}
                        </div>
                    )}
                    
                    {/* Close dropdown button */}
                    <div className="border-t border-gray-200 p-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
