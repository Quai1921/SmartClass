import { useState, useEffect, useCallback } from 'react';
import type { StoredFile, Folder } from '../types';
import { 
  loadFilesFromStorage, 
  saveFilesToStorage, 
  loadFoldersFromStorage, 
  saveFoldersToStorage,
  initializeTestData
} from '../utils/storage';

export const useFileManager = (isOpen: boolean) => {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load files and folders from localStorage
  const loadFiles = useCallback(() => {
    const loadedFiles = loadFilesFromStorage();
    setFiles(loadedFiles);
  }, []);

  const loadFolders = useCallback(() => {
    const loadedFolders = loadFoldersFromStorage();
    setFolders(loadedFolders);
  }, []);

  // Save files to localStorage
  const saveFiles = useCallback((filesToSave: StoredFile[]) => {
    saveFilesToStorage(filesToSave);
    setFiles(filesToSave);
  }, []);

  // Save folders to localStorage
  const saveFolders = useCallback((foldersToSave: Folder[]) => {
    saveFoldersToStorage(foldersToSave);
    setFolders(foldersToSave);
  }, []);

  // Load files and folders when component mounts
  useEffect(() => {
    if (isOpen) {
      initializeTestData(); // Initialize test data if no files exist
      loadFiles();
      loadFolders();
    }
  }, [isOpen, loadFiles, loadFolders]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const newFile: StoredFile = {
        id: Date.now().toString(),
        name: file.name,
        url,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        folderId: currentFolderId // Assign to current folder
      };

      const updatedFiles = [...files, newFile];
      saveFiles(updatedFiles);
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
  }, [files, saveFiles, currentFolderId]);

  // Create new folder
  const handleCreateFolder = useCallback((folderName: string) => {
    if (!folderName.trim()) return;

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: folderName.trim(),
      parentId: currentFolderId,
      createdAt: new Date()
    };

    const updatedFolders = [...folders, newFolder];
    saveFolders(updatedFolders);
  }, [currentFolderId, folders, saveFolders]);

  // Navigate to folder
  const navigateToFolder = useCallback((folderId: string | undefined) => {
    setCurrentFolderId(folderId);
    setSelectedFile(null);
  }, []);

  // Get current folder path for breadcrumb
  const getCurrentPath = useCallback(() => {
    const path: Folder[] = [];
    let currentId = currentFolderId;
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    
    return path;
  }, [currentFolderId, folders]);

  // Get folders in current directory
  const getCurrentFolders = useCallback(() => {
    return folders.filter(folder => folder.parentId === currentFolderId);
  }, [folders, currentFolderId]);

  // Handle file deletion
  const handleDeleteFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    saveFiles(updatedFiles);
    setSelectedFile(null);
  }, [files, saveFiles]);

  // Move file to folder
  const moveFileToFolder = useCallback((fileId: string, targetFolderId: string | undefined) => {
    const updatedFiles = files.map(file =>
      file.id === fileId
        ? { ...file, folderId: targetFolderId }
        : file
    );
    saveFiles(updatedFiles);
  }, [files, saveFiles]);

  return {
    files,
    folders,
    currentFolderId,
    selectedFile,
    isUploading,
    setSelectedFile,
    handleFileUpload,
    handleCreateFolder,
    navigateToFolder,
    getCurrentPath,
    getCurrentFolders,
    handleDeleteFile,
    moveFileToFolder,
  };
};
