import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { getTeachersForSelection } from '../../actions/teacher/get-teachers-for-selection';
import type { TeacherForSelection } from '../../actions/teacher/get-teachers-for-selection';

interface TeacherSelectorProps {
    label: string;
    placeholder?: string;
    value?: string; // Selected teacher ID
    onChange: (teacherId: string | undefined, teacher?: TeacherForSelection) => void;
    className?: string;
}

export const TeacherSelector: React.FC<TeacherSelectorProps> = ({
    label,
    placeholder = "Seleccionar profesor...",
    value,
    onChange,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [teachers, setTeachers] = useState<TeacherForSelection[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherForSelection | undefined>();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const fetchedTeachers = await getTeachersForSelection(undefined, 20);
            setTeachers(fetchedTeachers);
            
            // Find the selected teacher if value is provided
            if (value) {
                const teacher = fetchedTeachers.find(t => t.id === value);
                setSelectedTeacher(teacher);
            }
        } catch (error) {
            // console.error('Error fetching teachers:', error);
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (value && teachers.length > 0) {
            const teacher = teachers.find(t => t.id === value);
            setSelectedTeacher(teacher);
        } else if (!value) {
            setSelectedTeacher(undefined);
        }
    }, [value, teachers]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);    const handleTeacherSelect = (teacher: TeacherForSelection) => {
        setSelectedTeacher(teacher);
        onChange(teacher.id, teacher);
        setIsOpen(false);
    };

    const handleClear = () => {
        setSelectedTeacher(undefined);
        onChange(undefined);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            
            <div 
                className="relative w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className={selectedTeacher ? "text-gray-900" : "text-gray-500"}>
                            {selectedTeacher ? selectedTeacher.fullName : placeholder}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {selectedTeacher && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                ×
                            </button>
                        )}
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {loading ? (
                        <div className="p-3 text-center text-gray-500">
                            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <span className="mt-2 block text-sm">Cargando profesores...</span>
                        </div>
                    ) : teachers.length > 0 ? (                        teachers.map(teacher => (
                            <div
                                key={teacher.id}
                                onClick={() => handleTeacherSelect(teacher)}
                                className={`p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                                    selectedTeacher?.id === teacher.id ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                            >
                                <div className="font-medium text-sm">{teacher.fullName}</div>
                                <div className="text-xs text-gray-500">{teacher.email}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            No se encontraron profesores
                        </div>
                    )}
                    
                    {/* Cerrar option */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-center text-gray-500 hover:bg-gray-50 cursor-pointer border-t border-gray-200 bg-gray-50"
                    >
                        Cerrar
                    </div>
                </div>
            )}
        </div>
    );
};
