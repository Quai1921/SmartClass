// @ts-nocheck - File manager with implicit any types
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';

import type { FileManagerProps } from './types';
import { useFileManager, useFileFilters, useDragAndDrop } from './hooks';
import {
  DraggableFile,
  DroppableFolder,
  RootDroppable,
  FileManagerToolbar,
  FileDetailsSidebar,
  CreateFolderModal,
  DeleteConfirmationModal,
  FileDragOverlay,
  EmptyState,
  BreadcrumbNavigation,
} from './components';

// Import debug testing function
import { testMediaAPI } from './debug-api-test';

// Expose to window for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).testMediaAPI = testMediaAPI;
}

export const FileManager: React.FC<FileManagerProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  isImageSelectionMode = false,
}) => {

  
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string; type: 'file' | 'folder' } | null>(null);
  
  // Multi-selection state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Main file manager state and operations (Server-based only)
  const {
    files,
    currentFolderId,
    selectedFile,
    isLoading,
    isUploading,
    error,
    uploadStatus,
    uploadMessage,
    setSelectedFile,
    handleFileUpload,
    handleCreateFolder,
    navigateToFolder,
    getCurrentFolders,
    getCurrentPath,
    handleDeleteFile,
    handleDeleteFolder,
    moveFileToFolder,
    refresh,
    // Filter-related properties
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    sortOrder,
    toggleSortOrder,
    filteredFiles,
    fileTypeFilter,
    setFileTypeFilter,
    isSearching,
    clearFilters,
    hasActiveFilters,
  } = useServerFileManager(isOpen);

  // Debug logging for UI rendering




  // Drag and drop functionality
  const {
    handleDragStart,
    handleDragEnd,
    getActiveFile,
  } = useDragAndDrop(files, moveFileToFolder);

  // Handle create folder
  const handleCreateFolderSubmit = (folderName: string) => {
    handleCreateFolder(folderName);
    setShowCreateFolder(false);
  };

  // Handle delete file with confirmation
  const handleDeleteFileClick = (fileId: string, fileName: string) => {
    setFileToDelete({ id: fileId, name: fileName, type: 'file' });
    setShowDeleteConfirmation(true);
  };

  // Handle delete folder with confirmation (if needed)
  const handleDeleteFolderClick = (folderId: string, folderName: string) => {
    setFileToDelete({ id: folderId, name: folderName, type: 'folder' });
    setShowDeleteConfirmation(true);
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    if (fileToDelete) {
      if (fileToDelete.id === 'batch') {
        // Handle batch deletion
        executeBatchDelete();
      } else if (fileToDelete.type === 'file') {
        handleDeleteFile(fileToDelete.id);
      } else if (fileToDelete.type === 'folder' && handleDeleteFolder) {
        handleDeleteFolder(fileToDelete.id);
      }
      setFileToDelete(null);
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setFileToDelete(null);
    setShowDeleteConfirmation(false);
  };

  // Multi-selection handlers
  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (isMultiSelectMode) {
      // Clear selections when exiting multi-select mode
      setSelectedItems(new Set());
    }
  };

  const toggleItemSelection = (itemId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    const allItemIds = new Set([
      ...filteredFiles.map(file => file.id),
      ...currentFolders.map(folder => folder.id)
    ]);
    setSelectedItems(allItemIds);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  // Batch delete selected items
  const handleBatchDelete = () => {
    if (selectedItems.size === 0) return;
    
    const selectedFiles = filteredFiles.filter(file => selectedItems.has(file.id));
    const selectedFolders = currentFolders.filter(folder => selectedItems.has(folder.id));
    
    // Create a summary for confirmation
    const fileNames = selectedFiles.map(f => f.name);
    const folderNames = selectedFolders.map(f => f.name);
    const allNames = [...fileNames, ...folderNames];
    
    // Set up for batch deletion confirmation
    setFileToDelete({
      id: 'batch',
      name: `${selectedItems.size} elementos: ${allNames.slice(0, 3).join(', ')}${allNames.length > 3 ? '...' : ''}`,
      type: selectedFolders.length > 0 ? 'folder' : 'file'
    });
    setShowDeleteConfirmation(true);
  };

  // Execute batch deletion
  const executeBatchDelete = async () => {
    if (selectedItems.size === 0) return;
    
    try {
      // Get selected files and folders
      const selectedFiles = filteredFiles.filter(file => selectedItems.has(file.id));
      const selectedFolders = currentFolders.filter(folder => selectedItems.has(folder.id));
      
      // Create batch delete promises
      const deletePromises = [
        ...selectedFiles.map(file => handleDeleteFile(file.id)),
        // Now properly handle folder deletion
        ...selectedFolders.map(folder => 
          handleDeleteFolder ? handleDeleteFolder(folder.id) : Promise.resolve()
        )
      ];
      
      // Execute all deletions
      await Promise.all(deletePromises);
      
      // Clear selection and exit multi-select mode
      setSelectedItems(new Set());
      setIsMultiSelectMode(false);
      
    } catch (error) {
      // console.error('❌ Failed to delete some items:', error);
    }
  };

  if (!isOpen) return null;

  const currentFolders = getCurrentFolders();
  const activeFile = getActiveFile();
  const hasContent = currentFolders.length > 0 || filteredFiles.length > 0;

  // Debug logging for folders and content


  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-[90vw] h-[90vh] max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-100">Gestor de Archivos</h2>
            

            
            {/* Upload status with success/error animations */}
            {uploadStatus !== 'idle' && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-full transition-all duration-300 ${
                uploadStatus === 'uploading' 
                  ? 'text-blue-300 bg-blue-900/30' 
                  : uploadStatus === 'success'
                  ? 'text-green-300 bg-green-900/30'
                  : 'text-red-300 bg-red-900/30'
              }`}>
                {uploadStatus === 'uploading' && (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                  </svg>
                )}
                {uploadStatus === 'success' && (
                  <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
                {uploadStatus === 'error' && (
                  <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                )}
                <span>{uploadMessage}</span>
              </div>
            )}
            
            {/* Multi-selection status */}
            {isMultiSelectMode && selectedItems.size > 0 && (
              <span className="text-sm text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full">
                {selectedItems.size} elemento{selectedItems.size !== 1 ? 's' : ''} seleccionado{selectedItems.size !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Multi-Select Toggle Button */}
            <button
              onClick={toggleMultiSelectMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                isMultiSelectMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              title="Modo de selección múltiple"
            >
              {isMultiSelectMode ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Salir
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Selección
                </>
              )}
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200 disabled:opacity-50"
              title="Actualizar"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Multi-Select Actions Bar (shown when items are selected) */}
        {isMultiSelectMode && selectedItems.size > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-purple-900/20 border-b border-purple-700/30">
            <div className="flex items-center gap-4">
              <span className="text-sm text-purple-200 font-medium">
                Acciones para {selectedItems.size} elemento{selectedItems.size !== 1 ? 's' : ''}:
              </span>
              
              {/* Select All Button */}
              <button
                onClick={selectAllItems}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Seleccionar todo"
              >
                Seleccionar todo
              </button>

              {/* Clear Selection Button */}
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                title="Limpiar selección"
              >
                Limpiar selección
              </button>
            </div>

            {/* Batch Delete Button */}
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              title={`Eliminar ${selectedItems.size} elementos`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar ({selectedItems.size})
            </button>
          </div>
        )}

        {/* Toolbar */}
        <FileManagerToolbar
          isUploading={isUploading}
          onFileUpload={handleFileUpload}
          onCreateFolder={() => setShowCreateFolder(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          sortOrder={sortOrder}
          onToggleSortOrder={toggleSortOrder}
          fileTypeFilter={fileTypeFilter || ''}
          onFileTypeFilterChange={setFileTypeFilter}
          isSearching={isSearching || false}
          hasActiveFilters={hasActiveFilters || false}
          onClearFilters={clearFilters}
          isMultiSelectMode={isMultiSelectMode}
        />

        {/* Breadcrumb Navigation */}
        <div className="px-6 flex items-center h-24">
          <BreadcrumbNavigation
            currentPath={getCurrentPath()}
            onNavigateToFolder={navigateToFolder}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-900">
            {/* Content Grid with DND Context */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="text-gray-400">Cargando archivos...</p>
                </div>
              </div>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {!hasContent ? (
                  <EmptyState currentFolderId={currentFolderId} />
                ) : (
                  <RootDroppable currentFolderId={currentFolderId}>
                    {/* Folders */}
                    {currentFolders.map((folder, index) => (
                      <DroppableFolder
                        key={folder.id}
                        folder={folder}
                        onNavigateToFolder={navigateToFolder}
                        onDeleteFolder={(folderId) => handleDeleteFolderClick(folderId, folder.name)}
                        isMultiSelectMode={isMultiSelectMode}
                        isSelected={selectedItems.has(folder.id)}
                        onToggleSelection={toggleItemSelection}
                        data-sort-index={index}
                        data-folder-name={folder.name}
                      />
                    ))}

                    {/* Files */}
                    {filteredFiles.map((file) => (
                      <DraggableFile
                        key={file.id}
                        file={file}
                        selectedFile={selectedFile}
                        onFileSelect={setSelectedFile}
                        onFileDoubleClick={onFileSelect}
                        onDeleteFile={(fileId) => handleDeleteFileClick(fileId, file.name)}
                        isImageSelectionMode={isImageSelectionMode}
                        isMultiSelectMode={isMultiSelectMode}
                        isSelected={selectedItems.has(file.id)}
                        onToggleSelection={toggleItemSelection}
                      />
                    ))}
                  </RootDroppable>
                )}

                {/* Drag Overlay */}
                <DragOverlay dropAnimation={null}>
                  {activeFile && <FileDragOverlay file={activeFile} />}
                </DragOverlay>
              </DndContext>
            )}
          </div>

          {/* File Details Sidebar */}
          {selectedFile && (
            <FileDetailsSidebar
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onDeleteFile={handleDeleteFile}
            />
          )}
        </div>

        {/* Create Folder Modal */}
        <CreateFolderModal
          isOpen={showCreateFolder}
          onClose={() => setShowCreateFolder(false)}
          onCreateFolder={handleCreateFolderSubmit}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={handleCancelDelete}
          onConfirmDelete={handleConfirmDelete}
          fileName={fileToDelete?.name || ''}
          fileType={fileToDelete?.type || 'file'}
        />
      </div>
    </div>,
    document.body
  );
};
