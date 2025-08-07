import { useState, useEffect, useCallback } from 'react';
import type { StoredFile, Folder } from '../types';
import { MediaAPIService, MediaAPIConverter } from '../services/mediaAPI';
import { useServerFileFilters } from './useServerFileFilters';

/**
 * Natural sort function for folder/file names with numbers
 * Handles cases like "clase 1", "clase 2", "clase 10" correctly
 */
const naturalSort = (a: string, b: string): number => {
  // Extract numeric parts for "clase X" pattern
  const extractNumber = (str: string): number => {
    const match = str.match(/clase\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  };
  
  // Check if both strings follow the "clase X" pattern
  const aIsClase = /clase\s*\d+/i.test(a);
  const bIsClase = /clase\s*\d+/i.test(b);
  
  if (aIsClase && bIsClase) {
    const aNum = extractNumber(a);
    const bNum = extractNumber(b);
    return aNum - bNum;
  }
  
  // Fallback to Intl.Collator for other cases
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
    caseFirst: 'lower'
  });
  
  const result = collator.compare(a, b);
  return result;
};

/**
 * Server-based file manager hook - replaces localStorage implementation
 */
export const useServerFileManager = (isOpen: boolean) => {
  
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Upload feedback state
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  
  // Track the navigation path for breadcrumbs (as folder path segments)
  const [currentFolderPath, setCurrentFolderPath] = useState<string>('');

  // Load files and folders from server
  const loadData = useCallback(async () => {
    if (!isOpen) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use current folder path as the API path parameter
      const currentPath = MediaAPIConverter.folderPathToBucketPath(currentFolderPath);
      
      
      const result = await MediaAPIService.getFilesAndFolders(currentPath);
      
      // The MediaAPIService already returns converted data, so we need to convert it to our local format
      const convertedFiles: StoredFile[] = result.files.map(apiFile => ({
        id: apiFile.fileKey,
        name: apiFile.name,
        url: apiFile.url,
        type: apiFile.type,
        size: apiFile.size,
        uploadedAt: new Date(apiFile.uploadedAt),
        description: apiFile.description,
        folderId: currentFolderId,
      }));
      
      const convertedFolders: Folder[] = result.folders.map(apiFolder => ({
        id: apiFolder.fileKey,
        name: apiFolder.name,
        parentId: apiFolder.parentPath || undefined,
        createdAt: new Date(apiFolder.createdAt),
      }));
      
      setFiles(convertedFiles);
      setFolders(convertedFolders);
      
    } catch (err) {
      setError('Failed to load files and folders');
      setFiles([]);
      setFolders([]);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, currentFolderPath]);

  // Load data when component mounts or opens, or when currentFolderId changes
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, currentFolderId, loadData]);

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadMessage('Subiendo archivo...');
    setError(null);

    try {
      const bucketPath = MediaAPIConverter.folderPathToBucketPath(currentFolderPath);
      
      const apiFile = await MediaAPIService.uploadFile(file, bucketPath);
      
      // Set success status
      setUploadStatus('success');
      setUploadMessage(`¡Archivo "${file.name}" subido exitosamente!`);
      
      // Refresh data from server instead of manually updating state
      // This ensures we get the latest state from the backend
      await loadData();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 3000);
      
    } catch (err) {
      // console.error('Failed to upload file:', err);
      setError('Failed to upload file');
      setUploadStatus('error');
      setUploadMessage('Error al subir el archivo');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 5000);
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset input
    }
  }, [currentFolderId, currentFolderPath, loadData]);

  // Create new folder
  const handleCreateFolder = useCallback(async (folderName: string) => {
    if (!folderName.trim()) return;

    setError(null);

    try {
      const parentPath = MediaAPIConverter.folderIdToParentPath(currentFolderId);
      const apiFolder = await MediaAPIService.createFolder(folderName.trim(), parentPath);
      
      // Refresh data from server instead of manually updating state
      // This ensures we get the latest state from the backend
      await loadData();
      
    } catch (err) {
      // console.error('Failed to create folder:', err);
      setError('Failed to create folder');
    }
  }, [currentFolderId, loadData]);

  // Navigate to folder
  const navigateToFolder = useCallback((folderId: string | undefined) => {
    
    setCurrentFolderId(folderId);
    setSelectedFile(null);
    
    // Update folder path for breadcrumbs
    if (folderId === undefined) {
      setCurrentFolderPath('');
    } else {
      setCurrentFolderPath(folderId);
    }
  }, []);

  // Get current folder path for breadcrumb
  const getCurrentPath = useCallback(() => {
    // Convert current folder path to breadcrumb format
    if (!currentFolderPath) {
      return []; // Root folder
    }
    
    // Split the path and create folder objects for breadcrumb
    const pathSegments = currentFolderPath.split('/').filter(Boolean);
    const breadcrumbPath: Folder[] = [];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      breadcrumbPath.push({
        id: currentPath,
        name: segment,
        parentId: index > 0 ? breadcrumbPath[index - 1].id : undefined,
        createdAt: new Date()
      });
    });
    
    return breadcrumbPath;
  }, [currentFolderPath]);

  // Get folders in current directory
  const getCurrentFolders = useCallback(() => {

    
    const filtered = folders.filter(folder => {
      const targetParentId = currentFolderId || undefined;
      if (targetParentId === undefined) {
        return folder.parentId === undefined || folder.parentId === '';
      }
      if (folder.parentId === targetParentId) {
        return true;
      }
      if (folder.parentId && folder.parentId.startsWith(targetParentId + '/')) {
        const rest = folder.parentId.slice(targetParentId.length + 1);
        const isDirectChild = !rest.includes('/');
        return isDirectChild;
      }
      return false;
    });
    
    
    // Sort folders naturally (handles numbers correctly)
    const sorted = [...filtered].sort((a, b) => naturalSort(a.name, b.name));
    
    return sorted;
  }, [folders, currentFolderId]);

  // Handle file deletion
  const handleDeleteFile = useCallback(async (fileId: string) => {
    setError(null);

    try {
      await MediaAPIService.deleteFile(fileId);
      
      
      // Refresh data from server instead of manually updating state
      // This ensures we get the latest state from the backend
      await loadData();
      setSelectedFile(null);
      
    } catch (err) {
      // console.error('Failed to delete file:', err);
      setError('Failed to delete file');
    }
  }, [loadData]);

  // Handle folder deletion
  const handleDeleteFolder = useCallback(async (folderId: string) => {
    setError(null);

    try {
      // Folders use the same delete API as files (fileKey-based)
      await MediaAPIService.deleteFile(folderId);
      
      // Refresh data from server to get updated state
      await loadData();
      
    } catch (err) {
      // console.error('Failed to delete folder:', err);
      setError('Failed to delete folder');
    }
  }, [loadData]);

  // Move file to folder
  const moveFileToFolder = useCallback(async (fileId: string, targetFolderId: string | undefined) => {
    setError(null);

    try {
      // Find the file to move
      const fileToMove = files.find(file => file.id === fileId);
      if (!fileToMove) return;

      // Generate destination path
      const destinationPath = MediaAPIConverter.folderPathToBucketPath(targetFolderId);
      
      // Use the proper API call with sourceKey and destinationPath
      await MediaAPIService.moveFile(fileId, destinationPath);
      
      // Refresh data from server instead of manually updating state
      // This ensures we get the latest state from the backend
      await loadData();
      
    } catch (err) {
      // console.error('Failed to move file:', err);
      setError('Failed to move file');
    }
  }, [files, loadData]);

  // Refresh data from server
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Enhanced filtering with server-side search
  const filterHook = useServerFileFilters(files, currentFolderId, true);

  return {
    files,
    folders,
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
    getCurrentPath,
    getCurrentFolders,
    handleDeleteFile,
    handleDeleteFolder,
    moveFileToFolder,
    refresh,
    // Enhanced filtering capabilities
    ...filterHook,
  };
};
