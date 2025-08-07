import { useState, useMemo } from 'react';
import type { StoredFile, DateFilter, SortOrder } from '../types';
import { getFilteredAndSortedFiles } from '../utils/filters';

export const useFileFilters = (files: StoredFile[], currentFolderId: string | undefined) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const filteredFiles = useMemo(() => {
    return getFilteredAndSortedFiles(files, currentFolderId, searchTerm, dateFilter, sortOrder);
  }, [files, currentFolderId, searchTerm, dateFilter, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  return {
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    sortOrder,
    setSortOrder,
    toggleSortOrder,
    filteredFiles,
  };
};
