import { useState, useCallback } from 'react';

export interface StoredFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  description?: string;
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
}

const STORAGE_KEY = 'smartclass_file_manager';
const FOLDERS_STORAGE_KEY = 'smartclass_folders';

export const useFileManager = () => {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load files from localStorage
  const loadFiles = useCallback(() => {
    try {
      const storedFiles = localStorage.getItem(STORAGE_KEY);
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        setFiles(parsedFiles.map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        })));
      }
    } catch (error) {
      // console.error('Error loading files:', error);
    }
  }, []);

  // Load folders from localStorage
  const loadFolders = useCallback(() => {
    try {
      const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
      if (storedFolders) {
        const parsedFolders = JSON.parse(storedFolders);
        setFolders(parsedFolders.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt)
        })));
      }
    } catch (error) {
      // console.error('Error loading folders:', error);
    }
  }, []);

  // Save files to localStorage
  const saveFiles = useCallback((filesToSave: StoredFile[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filesToSave));
      setFiles(filesToSave);
    } catch (error) {
      // console.error('Error saving files:', error);
    }
  }, []);

  // Save folders to localStorage
  const saveFolders = useCallback((foldersToSave: Folder[]) => {
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(foldersToSave));
      setFolders(foldersToSave);
    } catch (error) {
      // console.error('Error saving folders:', error);
    }
  }, []);

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
        folderId: currentFolderId
      };

      const updatedFiles = [...files, newFile];
      saveFiles(updatedFiles);
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }, [files, saveFiles, currentFolderId]);

  // Handle file deletion
  const handleDeleteFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    saveFiles(updatedFiles);
    setSelectedFile(null);
  }, [files, saveFiles]);

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

  // Move file to folder
  const moveFileToFolder = useCallback((fileId: string, targetFolderId: string | undefined) => {
    const updatedFiles = files.map(file =>
      file.id === fileId ? { ...file, folderId: targetFolderId } : file
    );
    saveFiles(updatedFiles);
  }, [files, saveFiles]);

  return {
    // State
    files,
    folders,
    currentFolderId,
    selectedFile,
    isUploading,
    
    // Actions
    loadFiles,
    loadFolders,
    handleFileUpload,
    handleDeleteFile,
    handleCreateFolder,
    navigateToFolder,
    moveFileToFolder,
    setSelectedFile,
    
    // Computed
    getCurrentPath,
    getCurrentFolders,
  };
};
