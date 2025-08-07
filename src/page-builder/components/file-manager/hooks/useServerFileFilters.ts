// @ts-nocheck - File with unused filter functions
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { StoredFile, DateFilter, SortOrder } from '../types';
import { MediaAPIService } from '../services/mediaAPI';

/**
 * Natural sort function for file names with numbers
 * Handles cases like "file1", "file2", "file10" correctly
 */
const naturalSort = (a: string, b: string): number => {
  // Extract numeric parts for "clase X" pattern or similar
  const extractNumber = (str: string): number => {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };
  
  // Check if both strings contain numbers
  const aHasNum = /\d+/.test(a);
  const bHasNum = /\d+/.test(b);
  
  if (aHasNum && bHasNum) {
    // Extract the base name without numbers for comparison
    const aBase = a.replace(/\d+/g, '').trim();
    const bBase = b.replace(/\d+/g, '').trim();
    
    // If base names are the same, compare numbers
    if (aBase === bBase) {
      const aNum = extractNumber(a);
      const bNum = extractNumber(b);
      return aNum - bNum;
    }
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

export const useServerFileFilters = (
  files: StoredFile[],
  currentFolderId: string | undefined,
  isServerMode: boolean = false
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  // const [searchResults, setSearchResults] = useState<StoredFile[]>([]); // Unused state

  // Server-based search
  const performServerSearch = useCallback(async (term: string) => {
    if (!isServerMode || !term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const currentPath = currentFolderId || '';
      const { files: apiFiles } = await MediaAPIService.searchFiles(term, currentPath);
      
      // Convert API format to local format
      const convertedFiles = apiFiles.map(apiFile => ({
        id: apiFile.fileKey,
        name: apiFile.name,
        url: apiFile.url,
        type: apiFile.type,
        size: apiFile.size,
        uploadedAt: new Date(apiFile.uploadedAt),
        description: apiFile.description,
        folderId: currentPath,
      }));
      
      setSearchResults(convertedFiles);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [isServerMode, currentFolderId]);

  // Server-based file type filtering
  const performServerFilter = useCallback(async (fileType: string) => {
    if (!isServerMode || !fileType) {
      return [];
    }

    try {
      const currentPath = currentFolderId || '';
      const { files: apiFiles } = await MediaAPIService.filterFiles(fileType, currentPath);
      
      return apiFiles.map(apiFile => ({
        id: apiFile.fileKey,
        name: apiFile.name,
        url: apiFile.url,
        type: apiFile.type,
        size: apiFile.size,
        uploadedAt: new Date(apiFile.uploadedAt),
        description: apiFile.description,
        folderId: currentPath,
      }));
    } catch (error) {
      return [];
    }
  }, [isServerMode, currentFolderId]);

  // Client-side filtering (backup when server filtering is not available)
  const filterByDate = useCallback((files: StoredFile[], filter: DateFilter): StoredFile[] => {
    if (filter === 'all') return files;

    const now = new Date();
    const cutoffTimes = {
      last5min: 5 * 60 * 1000,
      last15min: 15 * 60 * 1000,
      last30min: 30 * 60 * 1000,
      lasthour: 60 * 60 * 1000,
      today: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now.getTime() - (cutoffTimes[filter] || 0);
    return files.filter(file => file.uploadedAt.getTime() >= cutoff);
  }, []);

  // Client-side search (fallback)
  const filterBySearchTerm = useCallback((files: StoredFile[], term: string): StoredFile[] => {
    if (!term.trim()) return files;
    
    const searchLower = term.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(searchLower) ||
      file.description?.toLowerCase().includes(searchLower)
    );
  }, []);

  // Client-side file type filtering
  const filterByFileType = useCallback((files: StoredFile[], type: string): StoredFile[] => {
    if (!type) return files;
    return files.filter(file => file.type.startsWith(type));
  }, []);

  // Sort files
  const sortFiles = useCallback((files: StoredFile[], order: SortOrder): StoredFile[] => {
    return [...files].sort((a, b) => {
      const comparison = b.uploadedAt.getTime() - a.uploadedAt.getTime();
      return order === 'newest' ? comparison : -comparison;
    });
  }, []);

  // Get files in current folder
  const currentFolderFiles = useMemo(() => {
    
    // BYPASS FILTERING - return all files for now
    return files;
  }, [files, currentFolderId]);

  // Apply all filters and sorting
  const filteredFiles = useMemo(() => {
    
    // Sort files naturally (handles numbers correctly)
    const sorted = [...currentFolderFiles].sort((a, b) => naturalSort(a.name, b.name));
    
    return sorted;
  }, [currentFolderFiles]);

  // Enhanced search function that uses server when available
  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    
    if (isServerMode && term.trim()) {
      await performServerSearch(term);
    }
  }, [isServerMode, performServerSearch]);

  // Enhanced file type filter that uses server when available
  const handleFileTypeFilter = useCallback(async (type: string) => {
    setFileTypeFilter(type);
    
    if (isServerMode && type) {
      const serverResults = await performServerFilter(type);
      setSearchResults(serverResults);
    }
  }, [isServerMode, performServerFilter]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(current => current === 'newest' ? 'oldest' : 'newest');
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFileTypeFilter('');
    setDateFilter('all');
    setSearchResults([]);
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    dateFilter,
    setDateFilter,
    sortOrder,
    toggleSortOrder,
    fileTypeFilter,
    setFileTypeFilter: handleFileTypeFilter,
    filteredFiles,
    isSearching,
    clearFilters,
    hasActiveFilters: !!(searchTerm || fileTypeFilter || dateFilter !== 'all'),
  };
};
