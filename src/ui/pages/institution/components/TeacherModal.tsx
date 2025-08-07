import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import type { Teacher } from '../../../../domain/entities/teacher';
import { postCreateTeacher, type CreateTeacherRequest, type AvailableAssignment } from '../../../../actions/teacher/post-create-teacher';
import InputField from '../../admin/components/InputField';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useNotificationStore } from '../../../store/notification/useNotificationStore';
import { getUserData } from '../../../../actions/user/get-user-data';
import { useAuthStore } from '../../../store/auth/useAuthStore';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  teacher?: Teacher;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  mode,
  teacher
}) => {

  // Early return with debugging
  if (!isOpen) {
    return null;
  }


  // State with error handling
  const [formData, setFormData] = useState(() => {
    try {
      return {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        identificationNumber: '',
        currentAssignments: [] as any[],
        availableAssignment: [] as AvailableAssignment[],
        status: 'ACTIVE'
      };
    } catch (error) {
      // console.error('❌ Error initializing formData:', error);
      return {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        identificationNumber: '',
        currentAssignments: [],
        availableAssignment: [],
        status: 'ACTIVE'
      };
    }
  });
  const [newAssignment, setNewAssignment] = useState<AvailableAssignment>(() => {
    try {
      return {
        shift: "MORNING",
        grade: 1,
        group: "A",
        subject: ""
      };
    } catch (error) {
      // console.error('❌ Error initializing newAssignment:', error);
      return {
        shift: "MORNING" as const,
        grade: 1,
        group: "A",
        subject: ""
      };
    }
  });
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { role } = useAuthStore();

  // Fetch user data for institution configuration (grades, groups, shifts)
  const { data: userData } = useQuery({
    queryKey: ['userData'],
    staleTime: 1000 * 60 * 60,
    queryFn: () => getUserData(),
    enabled: role === 'INSTITUTION_ADMIN',
  });


  // Dynamic options based on institution configuration
  const gradeOptions = React.useMemo(() => {
    if (!userData?.grades) return [{ label: '1', value: 1 }]; // Fallback
    
    return userData.grades
      .filter(grade => grade != null)
      .map((grade) => {
        // Handle both string grades and Grade object grades
        if (typeof grade === 'string') {
          return {
            label: grade,
            value: parseInt(grade) || 1,
          };
        } else {
          // Grade object with id and name
          return grade.id != null && grade.name ? {
            label: grade.name,
            value: grade.id,
          } : null;
        }
      })
      .filter(Boolean) as Array<{ label: string; value: number }>;
  }, [userData?.grades]);

  const groupOptions = React.useMemo(() => 
    userData?.groups?.map((group) => ({
      label: group,
      value: group,
    })) || [{ label: 'A', value: 'A' }], // Fallback
    [userData?.groups]
  );

  const shiftOptions = React.useMemo(() => 
    userData?.shifts?.map((shift) => ({
      label: shift === 'MORNING' ? 'Mañana' : 'Tarde',
      value: shift,
    })) || [
      { label: 'Mañana', value: 'MORNING' },
      { label: 'Tarde', value: 'AFTERNOON' }
    ], // Fallback
    [userData?.shifts]
  );

  // Update initial values when userData is loaded
  React.useEffect(() => {
    if (userData && gradeOptions.length > 0 && groupOptions.length > 0 && shiftOptions.length > 0) {
      setNewAssignment(prev => ({
        ...prev,
        shift: shiftOptions[0]?.value as "MORNING" | "AFTERNOON" || "MORNING",
        grade: gradeOptions[0]?.value || 1,
        group: groupOptions[0]?.value || "A",
      }));
    }
  }, [userData, gradeOptions, groupOptions, shiftOptions]);

  // Safe click outside handler
  try {
    useClickOutside(modalRef, onClose);
  } catch (error) {
    // console.error('❌ Error with useClickOutside:', error);
  }

  // Update teacher mutation with error handling
  const updateTeacherMutation = useMutation({
    mutationFn: async (data: Partial<Teacher>) => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return data;
      } catch (error) {
        // console.error('❌ Error in update mutation function:', error);
        throw error;
      }
    },    onSuccess: () => {
      try {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['userData'] }); // Refresh institution dashboard counts
        addNotification({
          message: "Profesor actualizado exitosamente",
          type: 'message',
          position: 'top',
          duration: 2000
        });
        onClose();
      } catch (error) {
        // console.error('❌ Error in update success handler:', error);
      }
    },
    onError: () => {
      // console.error('❌ Update teacher mutation error');
      try {
        addNotification({
          message: "Error al actualizar el profesor",
          type: 'error',
          position: 'top',
          duration: 2000
        });
      } catch (notifError) {
        // console.error('❌ Error showing notification:', notifError);
      }
    }
  });

  // Create teacher mutation with error handling
  const createTeacherMutation = useMutation({
    mutationFn: async (data: CreateTeacherRequest) => {
      try {
        const result = await postCreateTeacher(data);
        return result;
      } catch (error) {
        // console.error('❌ Error in postCreateTeacher:', error);
        throw error;
      }
    },    onSuccess: () => {
      try {
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        queryClient.invalidateQueries({ queryKey: ['userData'] }); // Refresh institution dashboard counts
        addNotification({
          message: 'Profesor creado exitosamente',
          type: 'message',
          position: 'top',
          duration: 3000
        });
        onClose();
      } catch (error) {
        // console.error('❌ Error in create success handler:', error);
      }
    },
    onError: (error: any) => {
      // console.error('❌ Create teacher mutation error:', error);
      try {
        addNotification({
          message: error?.response?.data?.message || 'Error al crear el profesor',
          type: 'error',
          position: 'top',
          duration: 5000
        });
      } catch (notifError) {
        // console.error('❌ Error showing notification:', notifError);
      }
    }
  });

  // Safe form handlers
  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      
      // Basic validation
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.identificationNumber.trim()) {
        addNotification({
          message: 'Por favor complete todos los campos requeridos',
          type: 'error',
          position: 'top',
          duration: 3000
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        addNotification({
          message: 'Por favor ingrese un email válido',
          type: 'error',
          position: 'top',
          duration: 3000
        });
        return;
      }


      if (mode === 'edit') {
        updateTeacherMutation.mutate(formData);
      } else {
        const createData: CreateTeacherRequest = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          identificationNumber: formData.identificationNumber.trim(),
          availableAssignment: formData.availableAssignment || [],
          status: formData.status as "ACTIVE" | "INACTIVE" | "PENDING"
        };
        createTeacherMutation.mutate(createData);
      }
    } catch (error) {
      // console.error('❌ Error in handleSubmit:', error);
      addNotification({
        message: 'Error al procesar el formulario',
        type: 'error',
        position: 'top',
        duration: 3000
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { id, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    } catch (error) {
      // console.error('❌ Error in handleInputChange:', error);
    }
  };

  const handleAddAssignment = () => {
    try {
      if (newAssignment.subject) {
        setFormData(prev => ({
          ...prev,
          availableAssignment: [...(prev.availableAssignment || []), { ...newAssignment }]
        }));        setNewAssignment({
          shift: shiftOptions[0]?.value as "MORNING" | "AFTERNOON" || "MORNING",
          grade: gradeOptions[0]?.value || 1,
          group: groupOptions[0]?.value || "A",
          subject: ""
        });
      }
    } catch (error) {
      // console.error('❌ Error adding assignment:', error);
    }
  };

  const handleRemoveAssignment = (index: number) => {
    try {
      setFormData(prev => ({
        ...prev,
        availableAssignment: (prev.availableAssignment || []).filter((_, i) => i !== index)
      }));
    } catch (error) {
      // console.error('❌ Error removing assignment:', error);
    }
  };

  // Safe useEffect handlers
  useEffect(() => {
    try {
      if (mode === 'edit' && teacher) {
        setFormData({
          id: teacher.id || '',
          firstName: teacher.firstName || '',
          lastName: teacher.lastName || '',
          email: teacher.email || '',
          identificationNumber: teacher.identificationNumber || '',
          currentAssignments: teacher.currentAssignments || [],
          availableAssignment: [],
          status: teacher.status || 'ACTIVE'
        });      } else if (mode === 'create') {
        setFormData({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          identificationNumber: '',
          currentAssignments: [],
          availableAssignment: [],
          status: 'ACTIVE'
        });
        setNewAssignment({
          shift: shiftOptions[0]?.value as "MORNING" | "AFTERNOON" || "MORNING",
          grade: gradeOptions[0]?.value || 1,
          group: groupOptions[0]?.value || "A",
          subject: ""
        });
      }
    } catch (error) {
      // console.error('❌ Error in useEffect:', error);
    }
  }, [mode, teacher, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    try {
      if (!isOpen) {
        setFormData({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          identificationNumber: '',
          currentAssignments: [],
          availableAssignment: [],
          status: 'ACTIVE'        });
        setNewAssignment({
          shift: shiftOptions[0]?.value as "MORNING" | "AFTERNOON" || "MORNING",
          grade: gradeOptions[0]?.value || 1,
          group: groupOptions[0]?.value || "A",
          subject: ""
        });
      }
    } catch (error) {
      // console.error('❌ Error resetting form:', error);
    }
  }, [isOpen]);

  const isLoading = updateTeacherMutation.isPending || createTeacherMutation.isPending;

  // Safe render with comprehensive error handling
  try {
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
              ><Dialog.Panel
                  ref={modalRef}
                  className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                >
                  <h2 className="text-lg font-semibold mb-4">
                    {mode === 'edit' ? 'Editar Profesor' : 'Crear Profesor'}
                  </h2>                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 mt-4 text-[14px]">
                      {/* Basic Information Section */}
                      <InputField
                        id="firstName"
                        label="Nombres"
                        value={formData.firstName}
                        type="text"
                        onChange={handleInputChange}
                      />

                      <InputField
                        id="lastName"
                        label="Apellidos"
                        value={formData.lastName}
                        type="text"
                        onChange={handleInputChange}
                      />

                      <InputField
                        id="email"
                        label="Email"
                        value={formData.email}
                        type="email"
                        onChange={handleInputChange}
                      />

                      <InputField
                        id="identificationNumber"
                        label="Número de Identificación"
                        value={formData.identificationNumber}
                        type="text"
                        onChange={handleInputChange}
                      />

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
                      </label>                      {/* Assignment Section */}
                      {formData.availableAssignment && formData.availableAssignment.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-base font-medium text-gray-700 mb-3">Asignaciones actuales:</h4>
                          <div className="space-y-2">
                            {formData.availableAssignment.map((assignment, index) => (
                              <div key={index} className="flex items-center justify-between bg-[#E3EBF5] border border-gray-200 p-3 rounded-md">
                                <span className="text-sm text-gray-900">
                                  <span className="font-medium">{assignment.subject}</span> - 
                                  Grado {assignment.grade}{assignment.group} 
                                  ({assignment.shift === 'MORNING' ? 'Mañana' : 'Tarde'})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAssignment(index)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                                  aria-label="Eliminar asignación"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add New Assignment */}
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mt-4">
                        <h4 className="text-base font-medium text-gray-700 mb-4">Agregar nueva asignación:</h4>
                        
                        <div className="flex flex-col gap-3">                          <label className="flex gap-[18px] justify-end items-center">
                            <span>Jornada</span>
                            <select
                              value={newAssignment.shift}
                              onChange={(e) => setNewAssignment(prev => ({ ...prev, shift: e.target.value as "MORNING" | "AFTERNOON" }))}
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
                            <span>Grado</span>
                            <select
                              value={newAssignment.grade}
                              onChange={(e) => setNewAssignment(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
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
                              value={newAssignment.group}
                              onChange={(e) => setNewAssignment(prev => ({ ...prev, group: e.target.value }))}
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
                            <span>Materia</span>
                            <select
                              value={newAssignment.subject}
                              onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                              className="min-w-[250px] border border-zinc-200 rounded-md px-3 py-2"
                            >
                              <option value="">Seleccionar materia</option>
                              <option value="Matemáticas">Matemáticas</option>
                              <option value="Español">Español</option>
                              <option value="Ciencias Naturales">Ciencias Naturales</option>
                              <option value="Ciencias Sociales">Ciencias Sociales</option>
                              <option value="Inglés">Inglés</option>
                              <option value="Educación Física">Educación Física</option>
                              <option value="Artes">Artes</option>
                              <option value="Tecnología">Tecnología</option>
                            </select>
                          </label>

                          <button
                            type="button"
                            onClick={handleAddAssignment}
                            disabled={!newAssignment.subject}
                            className="w-full bg-background text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar Asignación
                          </button>
                        </div>
                      </div>
                    </div>                    <div className="mt-6 flex justify-end gap-2">
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
                        {isLoading ? 'Guardando...' : mode === 'edit' ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </form>                </Dialog.Panel>
              </Transition>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  } catch (error) {
    // console.error('❌ Complex TeacherModal render error:', error);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-4">
            Error al cargar el modal complejo: {(error as Error)?.message}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Por favor revisa la consola para más detalles.
          </p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }
};
