import React, { useState, useEffect } from 'react';
import { X, BookPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, type Course } from '../../../../actions/courses/get-courses';
import { getInstitutionCourses, type InstitutionCourse } from '../../../../actions/institution/get-institution-courses';
import { assignCoursesToInstitution } from '../../../../actions/institution/assign-courses';
import { removeCourseFromInstitution } from '../../../../actions/institution/remove-course';
import { updateInstitutionStatus } from '../../../../actions/institution/update-institution-status';
import { useNotificationStore } from '../../../store/notification/useNotificationStore';
import { LoaderDog } from '../../../components/LoaderDog';

interface CourseAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export const CourseAssignmentModal: React.FC<CourseAssignmentModalProps> = ({
  isOpen,
  onClose,
  institution,
}) => {  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [originalCourseIds, setOriginalCourseIds] = useState<string[]>([]);
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();
  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    enabled: isOpen,
  });
  const { data: institutionCoursesData, isLoading: isLoadingInstitutionCourses } = useQuery<{
    success: boolean;
    data?: { courses: InstitutionCourse[] };
    error?: string;
  }>({
    queryKey: ['institution-courses', institution?.id],
    queryFn: () => {
      if (!institution?.id) {
        return Promise.resolve({ success: false, data: undefined, error: 'No institution ID' });
      }
      return getInstitutionCourses(institution.id);
    },
    enabled: isOpen && !!institution?.id,
  });
  const manageCoursesMutation = useMutation({
    mutationFn: async ({ 
      institutionId, 
      selectedCourseIds, 
      originalCourseIds 
    }: { 
      institutionId: string; 
      selectedCourseIds: string[]; 
      originalCourseIds: string[];
    }) => {

      // Calculate which courses to add and remove
      const coursesToAdd = selectedCourseIds.filter(id => !originalCourseIds.includes(id));
      const coursesToRemove = originalCourseIds.filter(id => !selectedCourseIds.includes(id));
      
      const results: { success: boolean; message?: string; error?: string }[] = [];
      
      // Remove courses first
      for (const courseId of coursesToRemove) {
        const result = await removeCourseFromInstitution(institutionId, courseId);
        results.push(result);
        if (!result.success) {
          throw new Error(result.error || 'Error al remover curso');
        }
      }
      
      // Add new courses
      if (coursesToAdd.length > 0) {
        const result = await assignCoursesToInstitution(institutionId, coursesToAdd);
        results.push(result);
        if (!result.success) {
          throw new Error(result.error || 'Error al asignar cursos');
        }
      }
      
      return {
        success: true,
        coursesAdded: coursesToAdd.length,
        coursesRemoved: coursesToRemove.length,
        finalCourseCount: selectedCourseIds.length
      };
    },
    onSuccess: async (result) => {
      
      if (result.success && institution) {
        // Update institution status based on course count
        const shouldBeActive = result.finalCourseCount > 0;
        
        const statusResult = await updateInstitutionStatus(institution.id, shouldBeActive);
        
        if (statusResult.success) {
          // Create success message based on what happened
          let message = '';
          if (result.coursesAdded > 0 && result.coursesRemoved > 0) {
            message = `${result.coursesAdded} curso(s) asignado(s) y ${result.coursesRemoved} removido(s). `;
          } else if (result.coursesAdded > 0) {
            message = `${result.coursesAdded} curso(s) asignado(s). `;
          } else if (result.coursesRemoved > 0) {
            message = `${result.coursesRemoved} curso(s) removido(s). `;
          }
          
          if (result.finalCourseCount === 0) {
            message += 'Institución desactivada (sin cursos asignados).';
          } else {
            message += 'Institución activada exitosamente.';
          }
          
          addNotification({
            message,
            type: 'message',
            position: 'right-top',
            duration: 5000,
          });
        } else {
          addNotification({
            message: 'Cursos actualizados pero error al cambiar estado de institución',
            type: 'error',
            position: 'right-top',
            duration: 5000,
          });
        }
          // Refresh data
        queryClient.invalidateQueries({ queryKey: ['institutions'] });
        queryClient.invalidateQueries({ queryKey: ['institution-courses', institution.id] });
        queryClient.invalidateQueries({ queryKey: ['institutions-courses-count'] });
        onClose();
        setSelectedCourseIds([]);
        setOriginalCourseIds([]);
      }
    },
    onError: (error: any) => {
      addNotification({
        message: error.message || 'Error al actualizar cursos de la institución',
        type: 'error',
        position: 'right-top',
        duration: 5000,
      });
    },
  });const handleCourseToggle = (courseId: string) => {
    setSelectedCourseIds(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };
  const handleAssignCourses = () => {
    if (!institution) {
      addNotification({
        message: 'Error: No se encontró información de la institución',
        type: 'error',
        position: 'right-top',
        duration: 3000,
      });
      return;
    }

    // Check if there are any changes
    const hasChanges = 
      selectedCourseIds.length !== originalCourseIds.length ||
      !selectedCourseIds.every(id => originalCourseIds.includes(id)) ||
      !originalCourseIds.every(id => selectedCourseIds.includes(id));

    if (!hasChanges) {
      addNotification({
        message: 'No hay cambios para guardar',
        type: 'alert',
        position: 'right-top',
        duration: 3000,
      });
      return;
    }

    manageCoursesMutation.mutate({
      institutionId: institution.id,
      selectedCourseIds,
      originalCourseIds,
    });
  };
  const handleClose = () => {
    if (!manageCoursesMutation.isPending) {
      onClose();
      setSelectedCourseIds([]);
      setOriginalCourseIds([]);
    }
  };// Reset selection when modal opens and pre-select institution courses
  useEffect(() => {
    if (isOpen) {
      if (institutionCoursesData?.success && institutionCoursesData.data?.courses) {
        // Pre-select existing institution courses
        const existingCourseIds = institutionCoursesData.data.courses.map((course: InstitutionCourse) => course.id);
        setSelectedCourseIds(existingCourseIds);
        setOriginalCourseIds(existingCourseIds);
      } else {
        // Reset to empty if no existing courses or data not loaded yet
        setSelectedCourseIds([]);
        setOriginalCourseIds([]);
      }
    }
  }, [isOpen, institutionCoursesData]);

  if (!isOpen) return null;

  const courses = coursesData?.data || [];
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <BookPlus className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Asignar Cursos
              </h2>
              <p className="text-sm text-gray-600">
                {institution?.name}
              </p>
            </div>
          </div>          <button
            onClick={handleClose}
            disabled={manageCoursesMutation.isPending}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoadingCourses || isLoadingInstitutionCourses ? (
            <div className="flex justify-center py-8">
              <LoaderDog width={60} height={60} />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Seleccione los cursos que desea asignar a esta institución:
                </p>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay cursos disponibles</p>
                </div>
              ) : (                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {courses.map((course: Course) => (
                    <div
                      key={course.id}                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedCourseIds.includes(course.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}onClick={(e) => {
                        // Only handle click if it's not on the checkbox or its label
                        const target = e.target as HTMLElement;
                        const isCheckbox = target instanceof HTMLInputElement && target.type === 'checkbox';
                        const isWithinCheckbox = target.closest('input[type="checkbox"]');
                        
                        if (!isCheckbox && !isWithinCheckbox) {
                          handleCourseToggle(course.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCourseIds.includes(course.id)}
                          onChange={() => handleCourseToggle(course.id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 truncate">
                            {course.title}
                          </h3>                          <p className="text-sm text-gray-600 mb-2 overflow-hidden" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {course.description}
                          </p>
                          <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">Grado: {course.grade}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Tutor: {course.tutorName}</span>
                            <span className={`px-2 py-1 rounded ${
                              course.status === 'PUBLISHED' 
                                ? 'bg-green-100 text-green-800' 
                                : course.status === 'IN_REVIEW' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.status === 'PUBLISHED' ? 'Publicado' : course.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedCourseIds.length} curso(s) seleccionado(s)
          </div>          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={manageCoursesMutation.isPending}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAssignCourses}
              disabled={manageCoursesMutation.isPending}
              className="px-4 py-2 bg-background text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >              {manageCoursesMutation.isPending ? (
                'Actualizando...'
              ) : (
                <>
                  <BookPlus className="w-4 h-4" />
                  Actualizar Cursos
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
