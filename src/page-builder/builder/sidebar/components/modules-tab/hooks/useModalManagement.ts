import { useState, useCallback } from 'react';

export const useModalManagement = () => {
  // Edit Modal State
  const [editingModule, setEditingModule] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Create Module Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Handle edit modal
  const handleEditModule = useCallback((module: any) => {
    setEditingModule(module);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingModule(null);
    setIsSaving(false);
  }, []);

  // Handle create modal
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsCreating(false);
  }, []);

  return {
    // Edit modal state
    editingModule,
    isEditModalOpen,
    isSaving,
    setIsSaving,
    handleEditModule,
    handleCloseEditModal,
    
    // Create modal state
    isCreateModalOpen,
    isCreating,
    setIsCreating,
    handleOpenCreateModal,
    handleCloseCreateModal
  };
};
