import React, { useState, useRef } from 'react';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { CourseManager } from '../../../components/CourseManager';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { ModulesView, type ModulesViewRef } from './ModulesView';
import { useCourseBuilder } from '../../../hooks/useCourseBuilder';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';
import { useCourseModuleState } from '../hooks/useCourseModuleState';
import { useCourseContext } from '../../../context/CourseContext';
import { DraftModuleService } from '../../../services/draftModuleService';
import { DraftCourseService } from '../../../services/draftCourseService';
import type { Course } from '../../../../actions/courses/get-courses';

export const CoursesTab: React.FC = () => {
  const modulesViewRef = useRef<ModulesViewRef>(null);
  const { currentCourse, currentPage } = useCourseContext();
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  const { hasUnsavedChanges } = useUnsavedChanges();
  const { 
    setCurrentCourse: setCourseContext,
    createNewPage,
    loadPage
  } = useCourseBuilder();

  const {
    selectedCourse,
    viewMode,
    handleCourseSelect: selectCourse,
    handleModuleSelect,
    handleBackToCourses,
    setSelectedCourse
  } = useCourseModuleState();

  const handleCourseSelect = (course: Course) => {
    if (hasUnsavedChanges) {
      setConfirmDialog({
        isOpen: true,
        title: 'Cambios sin guardar',
        message: 'Tienes cambios sin guardar en el módulo actual. ¿Deseas continuar sin guardar?',
        onConfirm: () => {
          selectCourse(course);
          setCourseContext(course);
          setSelectedCourse(course);
        }
      });
    } else {
      selectCourse(course);
      setCourseContext(course);
      setSelectedCourse(course);
    }
  };

  const handleModuleEdit = async (module: any) => {
    // Set the module in the builder context
    handleModuleSelect(module);
    
    if (module.isDraft) {
      // Load draft content into builder
      // Here you would load the draft content into the page builder
    } else {
      // Load published module
      try {
        const page = await loadPage(module.courseId, module.id);
        if (page) {
        } else {
          alert('Error al cargar el módulo. Inténtalo de nuevo.');
        }
      } catch (error) {
        // console.error('Error loading module:', error);
        alert('Error al cargar el módulo. Inténtalo de nuevo.');
      }
    }
  };

  const handleCreatePage = async (courseId: string) => {
    try {
      // Check if this is a draft course
      const isDraftCourse = selectedCourse && 'isDraft' in selectedCourse && selectedCourse.isDraft;
      
      const title = prompt('Nombre del nuevo módulo:');
      if (!title) return;

      if (isDraftCourse) {
        // Create a draft module directly
        
        const draftModule = DraftModuleService.saveDraft({
          courseId,
          type: 'ACADEMIC',
          title,
          content: JSON.stringify([]), // Empty content initially
          estimatedTime: 15
        });
        
        // Refresh the modules view to show the new draft module
        if (viewMode === 'modules' && modulesViewRef.current) {
          modulesViewRef.current.refresh();
        }
      } else {
        // Create a regular published module
        const success = await createNewPage(courseId, title);
        
        if (success) {
        } else {
          alert('Error al crear el módulo. Inténtalo de nuevo.');
        }
      }
    } catch (error) {
      // console.error('Error creating page:', error);
      alert('Error al crear el módulo. Inténtalo de nuevo.');
    }
  };

  const handleEditPage = async (courseId: string, pageId: string) => {
    try {
      const page = await loadPage(courseId, pageId);
      
      if (page) {
      } else {
        alert('Error al cargar el módulo. Inténtalo de nuevo.');
      }
    } catch (error) {
      // console.error('Error loading page:', error);
      alert('Error al cargar el módulo. Inténtalo de nuevo.');
    }
  };

  // Render different views based on the current mode
  if (viewMode === 'modules' && selectedCourse) {
    return (
      <div className="h-full bg-gray-800">
        {/* Back button */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={handleBackToCourses}
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a cursos
          </button>
        </div>
        
        <ModulesView
          ref={modulesViewRef}
          course={selectedCourse}
          onEditModule={handleModuleEdit}
          onCreateModule={handleCreatePage}
        />
      </div>
    );
  }

  // Default courses view
  return (
    <div className="h-full bg-gray-800">
      <CourseManager
        onSelectCourse={handleCourseSelect}
        selectedCourseId={selectedCourse?.id}
        onCreatePage={handleCreatePage}
        onEditPage={handleEditPage}
      />
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Continuar sin guardar"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
};
