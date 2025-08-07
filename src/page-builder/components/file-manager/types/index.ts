export interface StoredFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  description?: string;
  folderId?: string; // ID of the folder this file belongs to
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string; // For nested folders
  createdAt: Date;
}

export interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (file: StoredFile) => void;
  isImageSelectionMode?: boolean; // New prop to indicate if this is for image selection
}

export type DateFilter = 'all' | 'last5min' | 'last15min' | 'last30min' | 'lasthour' | 'today' | 'week' | 'month';
export type SortOrder = 'newest' | 'oldest';
