import type { StoredFile, Folder } from '../types';

const STORAGE_KEY = 'smartclass_file_manager';
const FOLDERS_STORAGE_KEY = 'smartclass_folders';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const loadFilesFromStorage = (): StoredFile[] => {
  try {
    const storedFiles = localStorage.getItem(STORAGE_KEY);
    if (storedFiles) {
      const parsedFiles = JSON.parse(storedFiles);
      return parsedFiles.map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt)
      }));
    }
    return [];
  } catch (error) {
    // console.error('Error loading files:', error);
    return [];
  }
};

export const saveFilesToStorage = (files: StoredFile[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    // console.error('Error saving files:', error);
  }
};

export const loadFoldersFromStorage = (): Folder[] => {
  try {
    const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (storedFolders) {
      const parsedFolders = JSON.parse(storedFolders);
      return parsedFolders.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt)
      }));
    }
    return [];
  } catch (error) {
    // console.error('Error loading folders:', error);
    return [];
  }
};

export const saveFoldersToStorage = (folders: Folder[]): void => {
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  } catch (error) {
    // console.error('Error saving folders:', error);
  }
};

export const initializeTestData = (): void => {
  const existingFiles = loadFilesFromStorage();
  if (existingFiles.length === 0) {
    // Add some sample images for testing
    const sampleImages: StoredFile[] = [
      {
        id: 'test-image-1',
        name: 'sample-image-1.jpg',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        type: 'image/jpeg',
        size: 125000,
        uploadedAt: new Date(),
        description: 'Sample landscape image'
      },
      {
        id: 'test-image-2',
        name: 'sample-image-2.jpg',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        type: 'image/jpeg',
        size: 98000,
        uploadedAt: new Date(Date.now() - 3600000), // 1 hour ago
        description: 'Sample forest image'
      },
      {
        id: 'test-image-3',
        name: 'sample-image-3.jpg',
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
        type: 'image/jpeg',
        size: 112000,
        uploadedAt: new Date(Date.now() - 7200000), // 2 hours ago
        description: 'Sample ocean image'
      }
    ];
    saveFilesToStorage(sampleImages);
  }
};
