import type { StoredFile, DateFilter, SortOrder } from '../types';

export const filterFilesBySearch = (files: StoredFile[], searchTerm: string): StoredFile[] => {
  if (!searchTerm.trim()) return files;
  
  return files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterFilesByDate = (files: StoredFile[], dateFilter: DateFilter): StoredFile[] => {
  if (dateFilter === 'all') return files;
  
  const now = new Date();
  
  return files.filter(file => {
    const fileDate = new Date(file.uploadedAt);
    
    switch (dateFilter) {
      case 'last5min':
        const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
        return fileDate >= fiveMinAgo;
      case 'last15min':
        const fifteenMinAgo = new Date(now.getTime() - 15 * 60 * 1000);
        return fileDate >= fifteenMinAgo;
      case 'last30min':
        const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
        return fileDate >= thirtyMinAgo;
      case 'lasthour':
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        return fileDate >= hourAgo;
      case 'today':
        return fileDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return fileDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return fileDate >= monthAgo;
      default:
        return true;
    }
  });
};

export const filterFilesByFolder = (files: StoredFile[], currentFolderId: string | undefined): StoredFile[] => {
  return files.filter(file => file.folderId === currentFolderId);
};

export const sortFiles = (files: StoredFile[], sortOrder: SortOrder): StoredFile[] => {
  return [...files].sort((a, b) => {
    const dateA = new Date(a.uploadedAt).getTime();
    const dateB = new Date(b.uploadedAt).getTime();
    
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

export const getFilteredAndSortedFiles = (
  files: StoredFile[],
  currentFolderId: string | undefined,
  searchTerm: string,
  dateFilter: DateFilter,
  sortOrder: SortOrder
): StoredFile[] => {
  let filteredFiles = filterFilesByFolder(files, currentFolderId);
  filteredFiles = filterFilesBySearch(filteredFiles, searchTerm);
  filteredFiles = filterFilesByDate(filteredFiles, dateFilter);
  return sortFiles(filteredFiles, sortOrder);
};
