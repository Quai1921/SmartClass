import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Teacher } from '../../../../domain/entities/teacher';
import { postCreateTeacher, type CreateTeacherRequest } from '../../../../actions/teacher/post-create-teacher';
import InputField from '../../admin/components/InputField';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useNotificationStore } from '../../../store/notification/useNotificationStore';

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


  // Basic state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    identificationNumber: '',
    status: 'ACTIVE'
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();


  // Simple click outside handler
  useClickOutside(modalRef, onClose);

  // Basic form reset on open/close
  useEffect(() => {
    if (isOpen && mode === 'create') {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        identificationNumber: '',
        status: 'ACTIVE'
      });
    }
  }, [isOpen, mode]);

  // Simple mutation
  const createTeacherMutation = useMutation({
    mutationFn: async (data: CreateTeacherRequest) => {
      return await postCreateTeacher(data);
    },
    onSuccess: () => {
      addNotification({
        message: 'Profesor creado exitosamente',
        type: 'message',
        position: 'top',
        duration: 3000
      });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      onClose();
    },
    onError: (error: any) => {
      // console.error('❌ Error creating teacher:', error);
      addNotification({
        message: error?.response?.data?.message || 'Error al crear el profesor',
        type: 'error',
        position: 'top',
        duration: 5000
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.identificationNumber) {
      addNotification({
        message: 'Por favor complete todos los campos',
        type: 'error',
        position: 'top',
        duration: 3000
      });
      return;
    }

    const createData: CreateTeacherRequest = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      identificationNumber: formData.identificationNumber.trim(),
      availableAssignment: [],
      status: formData.status as "ACTIVE" | "INACTIVE" | "PENDING"
    };

    createTeacherMutation.mutate(createData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };


  try {
    return (
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  ref={modalRef}
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    {mode === 'edit' ? 'Editar Profesor' : 'Crear Profesor'}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ACTIVE">Activo</option>
                        <option value="INACTIVE">Inactivo</option>
                        <option value="PENDING">Pendiente</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={createTeacherMutation.isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {createTeacherMutation.isPending ? 'Guardando...' : 'Crear'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  } catch (error) {
    // console.error('❌ TeacherModal render error:', error);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-4">Error al cargar el modal: {(error as Error)?.message}</p>
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
