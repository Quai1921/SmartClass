import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBuilder } from '../hooks/useBuilder';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useSimpleUnsavedChanges } from '../hooks/useSimpleUnsavedChanges';
import { useSaveManagement } from '../hooks/useSaveManagement';
import { useExport } from '../hooks/useExport';
import { useModuleManagement } from '../hooks/useModuleManagement';
import { useCourseManagement } from '../hooks/useCourseManagement';
import { useNavigation } from '../hooks/useNavigation';
import { getCourses } from '../../actions/courses/get-courses';


import { SavedProjectsModal } from './SavedProjectsModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageToolbar } from './PageToolbar';
import { PreviewModal } from './PreviewModal';
import { ExportPreviewModal } from '../components/ExportPreviewModal';
import { FileManagerButton } from '../components/FileManagerButton';
import { CourseInfo } from '../components/CourseInfo';
import { ActionButtons } from '../components/ActionButtons';
import { ViewControls } from '../components/ViewControls';
import { ModuleActions } from '../components/ModuleActions';
import { CourseEditModal } from '../components/course-management/CourseEditModal';
import Alert from '../../ui/components/Alert';

export const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    course, 
    elements,
    sidebarVisible,
    toggleSidebar,
    propertyPanelVisible,
    togglePropertyPanel
  } = useBuilder();
  
  const { hasUnsavedChanges } = useSimpleUnsavedChanges();
  
  // Hooks for functionality
  const { showSaveNotification, handleSave, handleCourseTypeChange } = useSaveManagement();
  const { 
    showExportPreview, 
    exportPreviewData, 
    handleExport, 
    handleConfirmExport, 
    handleCancelExport 
  } = useExport();
  const { 
    showAlert, 
    alertMessage, 
    alertType, 
    handleSaveDraft, 
    handlePublish, 
    restartAlert 
  } = useModuleManagement();
  
  const {
    isUpdating: isCourseUpdating,
    isEditModalOpen: isCourseEditModalOpen,
    editingCourse,
    openCourseEditModal,
    closeCourseEditModal,
    handleUpdateCourse,
    showAlert: showCourseAlert,
    alertMessage: courseAlertMessage,
    alertType: courseAlertType,
    restartAlert: restartCourseAlert
  } = useCourseManagement();
  
  const { handleBackNavigation, handleNewProject } = useNavigation();


  // Local state
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  // Handle course publishing via modal
  const handleCoursePublish = async () => {
    // Get course ID from URL parameters (more reliable than local course object)
    const urlParams = new URLSearchParams(window.location.search);
    const courseIdFromUrl = urlParams.get('courseId');
    
    
    if (!courseIdFromUrl && !course) {
      // console.warn('⚠️ No course ID available from URL or local course data');
      return;
    }

    // Use courseId from URL if available, fallback to local course.id
    const courseIdToUse = courseIdFromUrl || course?.id;
    
    if (!courseIdToUse) {
      // console.warn('⚠️ No valid course ID found');
      return;
    }

    try {
      
      // Fetch complete course data from backend to ensure we have all fields
      const coursesResponse = await getCourses();
      
      if (!coursesResponse.success || !coursesResponse.data) {
        throw new Error('No se pudo obtener la información del curso');
      }


      // Try to find course by string ID first, then by number ID
      const completeeCourse = coursesResponse.data.find((c: any) => 
        c.id === courseIdToUse || 
        c.id === parseInt(courseIdToUse) ||
        c.id.toString() === courseIdToUse
      );
      if (!completeeCourse) {
        // console.warn('⚠️ Course not found in backend');
        if (course) {
          // Fallback to local course data if available
          const courseData = {
            ...course,
            id: course.id,
            grade: course.grade || '',
            subject: course.subject || '',
            createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : course.createdAt || '',
            updatedAt: course.updatedAt instanceof Date ? course.updatedAt.toISOString() : course.updatedAt || ''
          };
          openCourseEditModal(courseData);
        } else {
          // console.error('❌ No course data available for modal');
          alert('No se pudo obtener la información del curso');
        }
        return;
      }

      // Log the complete course from backend

      // Use complete course data from backend
      const courseData = {
        ...completeeCourse,
        grade: completeeCourse.grade || '',
        subject: completeeCourse.subject || '',
        createdAt: completeeCourse.createdAt || '',
        updatedAt: '' // Backend course data doesn't include updatedAt
      };
      

      openCourseEditModal(courseData);
    } catch (error) {
      // console.error('❌ Error fetching course data:', error);
      if (course) {
        // Fallback to local course data if available
        const courseData = {
          ...course,
          id: course.id,
          grade: course.grade || '',
          subject: course.subject || '',
          createdAt: course.createdAt instanceof Date ? course.createdAt.toISOString() : course.createdAt || '',
          updatedAt: course.updatedAt instanceof Date ? course.updatedAt.toISOString() : course.updatedAt || ''
        };
        openCourseEditModal(courseData);
      } else {
        // console.error('❌ No course data available for modal');
        alert('Error al obtener la información del curso');
      }
    }
  };

  return (
    <div className="toolbar bg-gray-800 border-b border-gray-600 px-2 sm:px-4 py-2 flex items-center justify-between flex-shrink-0 overflow-x-auto relative">
      {/* Save notification */}
      {showSaveNotification && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          ✅ Proyecto guardado
        </div>
      )}

      {/* Left side - Course info and page management */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <CourseInfo
          course={course}
          onBackNavigation={handleBackNavigation}
          onCourseTypeChange={handleCourseTypeChange}
        />

        {/* Page Management Toolbar */}
        <PageToolbar />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        {/* Action buttons */}
        <ActionButtons
          canUndo={canUndo}
          canRedo={canRedo}
          hasUnsavedChanges={hasUnsavedChanges}
          onUndo={undo}
          onRedo={redo}
          onSave={handleSave}
          onOpenProjects={() => setShowProjectsModal(true)}
          onExport={handleExport}
        />

        <div className="h-6 border-l border-gray-600" />

        {/* File Manager */}
        <FileManagerButton 
          className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
          onFileSelect={(file) => {
          }}
        />

        <div className="h-6 border-l border-gray-600" />

        {/* View Controls */}
        <ViewControls
          sidebarVisible={sidebarVisible}
          propertyPanelVisible={propertyPanelVisible}
          onToggleSidebar={toggleSidebar}
          onTogglePropertyPanel={togglePropertyPanel}
          onNewProject={() => handleNewProject(setConfirmModal)}
          onPreview={handlePreview}
        />

        <div className="hidden sm:block h-6 border-l border-gray-600" />

        {/* Module Actions */}
        <ModuleActions
          onSaveDraft={handleSaveDraft}
          onPublish={handleCoursePublish}
        />
      </div>

      {/* Modals */}
      {showProjectsModal && (
        <SavedProjectsModal onClose={() => setShowProjectsModal(false)} />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          position="top"
          restartAlert={restartAlert}
        />
      )}

      {/* Course Update Alert */}
      {showCourseAlert && (
        <Alert
          message={courseAlertMessage}
          type={courseAlertType}
          position="right-top"
          restartAlert={restartCourseAlert}
        />
      )}

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />

      <ExportPreviewModal
        isOpen={showExportPreview}
        onClose={handleCancelExport}
        onConfirmExport={handleConfirmExport}
        onCancel={handleCancelExport}
        projectData={exportPreviewData}
      />

      {/* Course Edit Modal */}
      <CourseEditModal
        isOpen={isCourseEditModalOpen}
        course={editingCourse}
        onClose={closeCourseEditModal}
        onSave={handleUpdateCourse}
        isSaving={isCourseUpdating}
      />
    </div>
  );
};
