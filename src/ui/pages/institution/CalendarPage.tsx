import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Filter, X, Trash2, Save } from 'lucide-react';
import { createEvent, type CreateEventData } from '../../../actions/calendar/create-event';
import { updateEvent, type UpdateEventData } from '../../../actions/calendar/update-event';
import { deleteEvent } from '../../../actions/calendar/delete-event';
import { getCalendarEvents } from '../../../actions/calendar/get-calendar-events';
import { smartClassAPI } from '../../../config/smartClassAPI';
import { SelectedTag } from '../../components/SelectTag';
import Alert from '../../components/Alert';
import Tooltip from '../../components/Tooltip';

// Define event type interface based on API
interface EventData {
    id?: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    eventType: string;
    grade?: string;
    group?: string;
    shiftType?: string;
    recurrenceType: string;
    recurrenceEndDate?: string;
    allDay: boolean;
}

// Define component props interface
interface AcademicCalendarProps {
    grades?: string[];
    groups?: string[];
    // shiftTypes?: string[];
    shifts?: string[];
    className?: string;
}

const CalendarPage = ({
    grades = [],
    groups = [],
    // shiftTypes: _shiftTypes = ['MORNING', 'AFTERNOON', 'NIGHT'],
    shifts = [],
    className = ''
}: AcademicCalendarProps) => {
    const queryClient = useQueryClient();

    // Estados principales
    const [currentDate, setCurrentDate] = useState(new Date());

    // Estados de filtros
    const [filters, setFilters] = useState({
        grade: '',
        group: '',
        shiftType: '',
        eventType: '',
        search: ''
    });

    const [showFilters, setShowFilters] = useState(false);

    // Alert state for showing success/error messages
    const [alertState, setAlertState] = useState<{
        show: boolean;
        message: string;
        type: 'error' | 'message' | 'alert';
    }>({
        show: false,
        message: '',
        type: 'message'
    });

    // Function to show alert messages
    const showAlert = useCallback((message: string, type: 'error' | 'message' | 'alert' = 'message') => {
        setAlertState({ show: true, message, type });
    }, []);

    // Function to restart/hide alert
    const restartAlert = useCallback(() => {
        setAlertState({ show: false, message: '', type: 'message' });
    }, []);

    // Filter management functions
    const removeFilter = useCallback((key: string) => {
        setFilters((prev) => {
            const updated = { ...prev };
            updated[key as keyof typeof prev] = '';
            return updated;
        });
        // Reset expanded dates when filters change
        setExpandedDates(new Set());
    }, []);

    const clearAllFilters = useCallback(() => {
        setFilters({
            grade: '',
            group: '',
            shiftType: '',
            eventType: '',
            search: ''
        });
        // Reset expanded dates when all filters are cleared
        setExpandedDates(new Set());
    }, []);    // Estados de modal y formulario
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
    const [isModalClosing, setIsModalClosing] = useState(false);

    // Estados para drag selection
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartDate, setDragStartDate] = useState<Date | null>(null);

    // Effect to handle global mouse events for drag selection
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setDragStartDate(null);
            }
        };

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                // Prevent text selection during drag
                e.preventDefault();
            }
        };

        if (isDragging) {
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.addEventListener('mousemove', handleGlobalMouseMove);
        }

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [isDragging]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        eventType: 'CLASS',
        grade: grades.length > 0 ? grades[0] : '1',
        group: groups.length > 0 ? groups[0] : 'A',
        // shiftType: 'MORNING' as 'MORNING' | 'AFTERNOON' | 'NIGHT',
        shiftType: (shifts.length > 0 ? shifts[0] : 'MORNING') as 'MORNING' | 'AFTERNOON' | 'NIGHT',
        recurrenceType: 'NONE', recurrenceEndDate: '',
        allDay: false
    });

    // TanStack Query para obtener eventos del calendario
    const { data: rawEvents = [], isLoading: loadingEvents, error: eventsError } = useQuery({
        queryKey: ['calendarEvents'],
        queryFn: () => {
            return getCalendarEvents();
        },
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
    });

    // Transform API events to component format
    const events: EventData[] = rawEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
        eventType: event.eventType,
        grade: event.grade,
        group: event.group,
        shiftType: event.shiftType,
        recurrenceType: 'NONE',
        recurrenceEndDate: event.recurrenceEndDate,
        allDay: event.allDay
    }));

    // Apply CLIENT-SIDE filtering since backend filtering doesn't work
    const filteredEvents = events.filter(event => {
        // Filter by grade
        if (filters.grade && event.grade !== filters.grade) {
            return false;
        }

        // Filter by group
        if (filters.group && event.group !== filters.group) {
            return false;
        }

        // Filter by shift type
        if (filters.shiftType && event.shiftType !== filters.shiftType) {
            return false;
        }

        // Filter by event type
        if (filters.eventType && event.eventType !== filters.eventType) {
            return false;
        }

        // Filter by search text
        if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Mutations for CRUD operations
    const createEventMutation = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
            if (selectedDates.length > 1) {
                showAlert(`Evento creado para ${selectedDates.length} días seleccionados`, 'message');
            } else {
                showAlert('Evento creado exitosamente', 'message');
            }
            closeModal();
        },
        onError: (error) => {
            // console.error('Error creating event:', error);
            showAlert('Error al crear el evento', 'error');
        }
    });

    const updateEventMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateEventData }) => updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
            showAlert('Evento actualizado exitosamente', 'message');
            closeModal();
        },
        onError: (error) => {
            // console.error('Error updating event:', error);
            showAlert('Error al actualizar el evento', 'error');
        }
    }); const deleteEventMutation = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
            showAlert('Evento eliminado exitosamente', 'message');
            closeModal();
        },
        onError: (error) => {
            // console.error('Error deleting event:', error);
            showAlert('Error al eliminar el evento', 'error');
        }
    });    // Colores para tipos de eventos
    const eventColors: Record<string, string> = {
        CLASS: 'bg-blue-500',
        EXAM: 'bg-red-500',
        MEETING: 'bg-green-500',
        OTHER: 'bg-gray-500'
    };

    // Funciones de navegación
    const navigateDate = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
        // Reset expanded dates when navigating to a different month
        setExpandedDates(new Set());
    };

    // Funciones de fechas
    const formatDate = (date: Date, format: 'full' | 'short' | 'month' | 'year' = 'full') => {
        const options: Record<string, Intl.DateTimeFormatOptions> = {
            full: { year: 'numeric', month: 'long', day: 'numeric' },
            short: { month: 'short', day: 'numeric' },
            month: { year: 'numeric', month: 'long' },
            year: { year: 'numeric' }
        };
        return date.toLocaleDateString('es-ES', options[format]);
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.toDateString() === date2.toDateString();
    };

    const getEventsForDate = (date: Date) => {
        return filteredEvents.filter(event => {
            const eventStart = new Date(event.startTime);
            return isSameDay(date, eventStart);
        });
    };

    // Funciones del modal
    const openCreateModal = () => {
        const startDate = selectedDates[0] || new Date();
        const endDate = selectedDates[selectedDates.length - 1] || startDate;

        setFormData({
            title: '',
            description: '',
            // startTime: startDate.toISOString().slice(0, 16),
            startTime: startDate.toISOString().slice(11, 16),
            // endTime: new Date(endDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
            endTime: new Date(endDate.getTime() + 60 * 60 * 1000).toISOString().slice(11, 16),
            eventType: 'CLASS',
            grade: grades.length > 0 ? grades[0] : '1',
            group: groups.length > 0 ? groups[0] : 'A',
            shiftType: 'MORNING',
            recurrenceType: 'NONE',
            recurrenceEndDate: '',
            allDay: selectedDates.length > 1
        });
        setModalMode('create');
        setShowModal(true);
    };

    const openEditModal = (event: EventData) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            // startTime: event.startTime.slice(0, 16),
            startTime: event.startTime.slice(11, 16),
            // endTime: event.endTime.slice(0, 16),
            endTime: event.endTime.slice(11, 16),
            eventType: event.eventType,
            grade: event.grade || '1',
            group: event.group || 'A',
            shiftType: (event.shiftType as 'MORNING' | 'AFTERNOON' | 'NIGHT') || 'MORNING',
            recurrenceType: event.recurrenceType || 'NONE',
            recurrenceEndDate: event.recurrenceEndDate ? event.recurrenceEndDate.slice(0, 16) : '',
            allDay: event.allDay
        });
        setModalMode('edit');
        setShowModal(true);
    }; const closeModal = () => {
        setIsModalClosing(true);
        // Wait for animation to complete before actually closing
        setTimeout(() => {
            setShowModal(false);
            setSelectedEvent(null);
            setSelectedDates([]);
            setIsModalClosing(false);
            setFormData({
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                eventType: 'CLASS',
                grade: grades.length > 0 ? grades[0] : '1',
                group: groups.length > 0 ? groups[0] : 'A',
                shiftType: 'MORNING',
                recurrenceType: 'NONE',
                recurrenceEndDate: '',
                allDay: false
            });
        }, 300); // Match the animation duration
    };

    // Funciones CRUD con TanStack Query
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.title.trim()) {
            showAlert('El título es requerido', 'error');
            return;
        }
        if (!formData.grade) {
            showAlert('El grado es requerido', 'error');
            return;
        }
        if (!formData.group) {
            showAlert('El grupo es requerido', 'error');
            return;
        }
        if (!formData.shiftType) {
            showAlert('El turno es requerido', 'error');
            return;
        }

        if (modalMode === 'create') {
            // Handle multiple selected dates by creating separate events for each date
            if (selectedDates.length > 1) {
                try {
                    const promises = selectedDates.map(date => {
                        const dateStr = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format

                        const eventData = {
                            title: formData.title,
                            description: formData.description || undefined,
                            startTime: formData.allDay ? `${dateStr}T00:00:00` :
                                formData.startTime.includes('T') ?
                                    `${dateStr}T${formData.startTime.split('T')[1]}:00` :
                                    `${dateStr}T${formData.startTime}:00`,
                            endTime: formData.allDay ? `${dateStr}T23:59:59` :
                                formData.endTime.includes('T') ?
                                    `${dateStr}T${formData.endTime.split('T')[1]}:00` :
                                    `${dateStr}T${formData.endTime}:00`,
                            eventType: formData.eventType,
                            grade: formData.grade,
                            group: formData.group,
                            shiftType: formData.shiftType,
                            recurrenceType: formData.recurrenceType,
                            recurrenceEndDate: formData.recurrenceEndDate || undefined,
                            allDay: formData.allDay
                        };

                        return smartClassAPI.post('/calendar/events/create', eventData);
                    });

                    await Promise.all(promises);

                    // Refresh the events data
                    queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
                    showAlert(`${selectedDates.length} eventos creados exitosamente`, 'message');
                    closeModal();
                } catch (error) {
                    // console.error('Error creating multiple events:', error);
                    showAlert('Error al crear los eventos', 'error');
                }
            } else {
                // Single date event - use the existing mutation
                const singleDate = selectedDates[0] || new Date();
                const dateStr = singleDate.toISOString().split('T')[0];
                const eventData = {
                    title: formData.title,
                    description: formData.description || undefined,
                    startTime: formData.allDay ? `${dateStr}T00:00:00` :
                        formData.startTime.includes('T') ?
                            `${dateStr}T${formData.startTime.split('T')[1]}:00` :
                            `${dateStr}T${formData.startTime}:00`,
                    endTime: formData.allDay ? `${dateStr}T23:59:59` :
                        formData.endTime.includes('T') ?
                            `${dateStr}T${formData.endTime.split('T')[1]}:00` :
                            `${dateStr}T${formData.endTime}:00`,
                    eventType: formData.eventType,
                    grade: formData.grade,
                    group: formData.group,
                    shiftType: formData.shiftType,
                    recurrenceType: formData.recurrenceType,
                    recurrenceEndDate: formData.recurrenceEndDate || undefined,
                    allDay: formData.allDay
                };

                createEventMutation.mutate(eventData as CreateEventData);
            }
        } else if (selectedEvent?.id) {
            // Edit mode - single event only
            const eventData = {
                title: formData.title,
                description: formData.description || undefined,
                startTime: formData.startTime + (formData.startTime.includes('T') ? ':00' : 'T00:00:00'),
                endTime: formData.endTime + (formData.endTime.includes('T') ? ':00' : 'T23:59:59'),
                eventType: formData.eventType,
                grade: formData.grade,
                group: formData.group,
                shiftType: formData.shiftType,
                recurrenceType: formData.recurrenceType,
                recurrenceEndDate: formData.recurrenceEndDate || undefined,
                allDay: formData.allDay
            };

            updateEventMutation.mutate({
                id: selectedEvent.id,
                data: eventData as UpdateEventData
            });
        }
    };

    const handleDelete = async (eventId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            deleteEventMutation.mutate(eventId);
        }
    };

    // Drag selection functionality
    const handleMouseDown = (date: Date, e: React.MouseEvent) => {
        // Don't start drag if clicking on expand/collapse button
        if ((e.target as HTMLElement).closest('[data-expand-button]')) {
            return;
        }

        e.preventDefault();
        setIsDragging(true);
        setDragStartDate(date);
        setSelectedDates([date]);
    };

    const handleMouseEnter = (date: Date) => {
        if (isDragging && dragStartDate) {
            const startTime = dragStartDate.getTime();
            const endTime = date.getTime();
            const start = new Date(Math.min(startTime, endTime));
            const end = new Date(Math.max(startTime, endTime));

            const selectedDateRange = [];
            const current = new Date(start);

            while (current <= end) {
                selectedDateRange.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }

            setSelectedDates(selectedDateRange);
        }
    };

    const handleMouseUp = () => {
        if (isDragging && selectedDates.length > 0) {
            setIsDragging(false);
            setDragStartDate(null);
            openCreateModal();
        }
    };

    const handleDateClick = (date: Date) => {
        // Simple click without drag
        if (!isDragging) {
            setSelectedDates([date]);
            openCreateModal();
        }
    };

    // Helper function to check if a date is selected
    const isDateSelected = (date: Date) => {
        return selectedDates.some(selectedDate =>
            selectedDate.toDateString() === date.toDateString()
        );
    };

    // Function to toggle expanded state for a specific date
    const toggleDateExpansion = (date: Date, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering handleDateClick
        const dateKey = date.toDateString();
        setExpandedDates(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dateKey)) {
                newSet.delete(dateKey);
            } else {
                newSet.add(dateKey);
            }
            return newSet;
        });
    };

    // Render del calendario mensual
    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const weeks = [];
        let currentWeek = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const isCurrentMonth = date.getMonth() === month;
            const isToday = isSameDay(date, new Date());
            const dayEvents = getEventsForDate(date);
            const dateKey = date.toDateString();
            const isExpanded = expandedDates.has(dateKey);
            const isSelected = isDateSelected(date);
            const maxEventsToShow = isExpanded ? dayEvents.length : 3;

            currentWeek.push(
                <div
                    key={date.toISOString()}
                    className={`${isExpanded ? 'min-h-[200px]' : 'min-h-[120px]'} p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-200 select-none ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                        } ${isToday ? 'bg-blue-50 border-blue-300' : ''} ${isExpanded ? 'ring-2 ring-blue-200 z-10 relative' : ''
                        } ${isSelected ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' : ''
                        }`}
                    onMouseDown={(e) => handleMouseDown(date, e)}
                    onMouseEnter={() => handleMouseEnter(date)}
                    onMouseUp={handleMouseUp}
                    onClick={() => handleDateClick(date)}
                >
                    <div className={`text-sm font-medium mb-2 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${isToday ? 'text-blue-600' : ''}`}>
                        {date.getDate()}
                    </div>
                    <div className="space-y-1">
                        {dayEvents.slice(0, maxEventsToShow).map((event, idx) => (
                            <div
                                key={idx}
                                className={`text-xs p-1 rounded text-white truncate ${eventColors[event.eventType] || eventColors.OTHER
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(event);
                                }}
                            >
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div
                                data-expand-button="true"
                                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium flex items-center gap-1 transition-colors duration-200"
                                onClick={(e) => toggleDateExpansion(date, e)}
                                title={isExpanded ? 'Mostrar menos eventos' : 'Mostrar todos los eventos'}
                            >
                                {isExpanded ? (
                                    <>
                                        <ChevronUp className="w-3 h-3" />
                                        Ver menos
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-3 h-3" />
                                        +{dayEvents.length - 3} más
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );

            if (currentWeek.length === 7) {
                weeks.push(
                    <div key={`week-${weeks.length}`} className="grid grid-cols-7">
                        {currentWeek}
                    </div>
                );
                currentWeek = [];
            }
        }

        return (
            <div className="space-y-0">
                {/* Header de días de la semana */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                            {day}
                        </div>
                    ))}
                </div>
                {weeks}
            </div>
        );
    };

    if (loadingEvents) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (eventsError) {
        return (
            <div className="text-center text-red-600 p-4">
                Error al cargar los eventos del calendario
            </div>
        );
    }

    return (
        <div
            className={`w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg ${className} ${isDragging ? 'cursor-crosshair' : ''}`}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                if (isDragging) {
                    setIsDragging(false);
                    setDragStartDate(null);
                }
            }}
        >
            {/* Header del calendario */}
            <div className="p-6 border-b border-gray-200">
                {/* Navegación y vista */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Calendar className="mr-2" size={28} />
                            Calendario Académico
                        </h1>
                        {isDragging && (
                            <span className="text-sm text-blue-600 font-medium">
                                Arrastrando para seleccionar fechas...
                            </span>
                        )}
                        {selectedDates.length > 1 && !isDragging && (
                            <span className="text-sm text-green-600 font-medium">
                                {selectedDates.length} días seleccionados
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Tooltip text="Filtrar eventos" position="bottom">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                            >
                                <Filter size={20} />
                            </button>                        </Tooltip>
                        <Tooltip text="Crear nuevo evento" position="bottom">
                            <button
                                onClick={openCreateModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                            >
                                <Plus size={20} className="mr-2" />
                                Nuevo Evento
                            </button>
                        </Tooltip>
                    </div>
                </div>                {/* Navegación del mes */}
                <div className="flex items-center justify-between">
                    <Tooltip text="Mes anterior" position="bottom">
                        <button
                            onClick={() => navigateDate(-1)}
                            className="p-2 hover:bg-gray-100 rounded"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </Tooltip>
                    <h2 className="text-xl font-semibold">
                        {formatDate(currentDate, 'month')}
                    </h2>
                    <Tooltip text="Mes siguiente" position="bottom">
                        <button
                            onClick={() => navigateDate(1)}
                            className="p-2 hover:bg-gray-100 rounded"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </Tooltip>
                </div>

                {/* Filtros */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <select
                                value={filters.grade}
                                onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Todos los grados</option>
                                {grades.map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                ))}
                            </select>

                            <select
                                value={filters.group}
                                onChange={(e) => setFilters(prev => ({ ...prev, group: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Todos los grupos</option>
                                {groups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>

                            <select
                                value={filters.shiftType}
                                onChange={(e) => setFilters(prev => ({ ...prev, shiftType: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Todos los turnos</option>
                                {/* <option value="MORNING">Mañana</option>
                                <option value="AFTERNOON">Tarde</option>
                                <option value="NIGHT">Noche</option> */}
                                {shifts.map(shift => (
                                    <option key={shift} value={shift}>
                                        {shift === 'MORNING' ? 'Mañana' :
                                            shift === 'AFTERNOON' ? 'Tarde' :
                                                shift === 'NIGHT' ? 'Noche' : shift}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filters.eventType}
                                onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >                                <option value="">Todos los tipos</option>
                                <option value="CLASS">Clase</option>
                                <option value="EXAM">Examen</option>
                                <option value="MEETING">Reunión</option>
                                <option value="OTHER">Otro</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Buscar eventos..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Filter tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {filters.grade && (
                                <SelectedTag
                                    label={`Grado: ${filters.grade}`}
                                    onRemove={() => removeFilter('grade')}
                                />
                            )}
                            {filters.group && (
                                <SelectedTag
                                    label={`Grupo: ${filters.group}`}
                                    onRemove={() => removeFilter('group')}
                                />
                            )}
                            {filters.shiftType && (
                                <SelectedTag
                                    label={`Turno: ${filters.shiftType}`}
                                    onRemove={() => removeFilter('shiftType')}
                                />
                            )}
                            {filters.eventType && (
                                <SelectedTag
                                    label={`Tipo: ${filters.eventType}`}
                                    onRemove={() => removeFilter('eventType')}
                                />
                            )}
                            {filters.search && (
                                <SelectedTag
                                    label={`Búsqueda: ${filters.search}`}
                                    onRemove={() => removeFilter('search')}
                                />
                            )}
                        </div>                        {/* Clear all filters button */}
                        {(filters.grade || filters.group || filters.shiftType || filters.eventType || filters.search) && (
                            <Tooltip text="Remover todos los filtros aplicados" position="top">
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Limpiar filtros
                                </button>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>

            {/* Calendario */}
            <div className="p-6">
                {renderMonthView()}
            </div>            {/* Modal para crear/editar eventos */}
            {showModal && (
                <div className={`fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${isModalClosing ? 'opacity-0' : 'opacity-100'
                    }`}>
                    <div className={`bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl ring-1 ring-black/10 transition-all duration-300 ${isModalClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                {modalMode === 'create' ? 'Crear Evento' : 'Editar Evento'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Show selected dates when multiple dates are selected */}
                            {selectedDates.length > 1 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                                        Fechas Seleccionadas ({selectedDates.length} días)
                                    </h4>
                                    <div className="text-sm text-blue-700">
                                        {selectedDates.length === 2 ? (
                                            <>
                                                {formatDate(selectedDates[0], 'short')} - {formatDate(selectedDates[selectedDates.length - 1], 'short')}
                                            </>
                                        ) : selectedDates.length <= 5 ? (
                                            selectedDates.map((date, idx) => (
                                                <span key={idx}>
                                                    {formatDate(date, 'short')}
                                                    {idx < selectedDates.length - 1 ? ', ' : ''}
                                                </span>
                                            ))
                                        ) : (
                                            <>
                                                {formatDate(selectedDates[0], 'short')} - {formatDate(selectedDates[selectedDates.length - 1], 'short')}
                                                <span className="text-xs"> (y {selectedDates.length - 2} días más)</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Evento
                                    </label>
                                    <select
                                        value={formData.eventType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="CLASS">Clase</option>                                        <option value="EXAM">Examen</option>
                                        <option value="MEETING">Reunión</option>
                                        <option value="OTHER">Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Grado *
                                    </label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        {grades.length > 0 ? grades.map(grade => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        )) : (
                                            <>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Grupo *
                                    </label>
                                    <select
                                        value={formData.group}
                                        onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        {groups.length > 0 ? groups.map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        )) : (
                                            <>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Jornada *
                                    </label>
                                    <select
                                        value={formData.shiftType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, shiftType: e.target.value as 'MORNING' | 'AFTERNOON' | 'NIGHT' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        {/* <option value="MORNING">Mañana</option>
                                        <option value="AFTERNOON">Tarde</option>
                                        <option value="NIGHT">Noche</option> */}
                                        {shifts.map(shift => (
                                            <option key={shift} value={shift}>
                                                {shift === 'MORNING' ? 'Mañana' :
                                                    shift === 'AFTERNOON' ? 'Tarde' :
                                                        shift === 'NIGHT' ? 'Noche' : shift}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.allDay}
                                        onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
                                        className="mr-2"
                                    />
                                    Todo el día
                                </label>
                            </div>

                            {!formData.allDay && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hora de inicio
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hora de fin
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between pt-4">
                                {modalMode === 'edit' && selectedEvent?.id && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(selectedEvent.id!)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Eliminar
                                    </button>
                                )}
                                <div className="flex space-x-2 ml-auto">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                    >
                                        <Save size={16} className="mr-2" />
                                        {modalMode === 'create' ? 'Crear' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Alert component */}
            {alertState.show && (
                <Alert
                    message={alertState.message}
                    type={alertState.type}
                    position="right-bottom"
                    restartAlert={restartAlert}
                />
            )}
        </div>
    );
};

export default CalendarPage;