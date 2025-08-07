import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Folder, File, Search, ChevronLeft, RefreshCw, ChevronRight, ChevronDown, CheckSquare, Square, Trash2, Move, MoreVertical, ArrowUpDown } from 'lucide-react';
import { MediaAPIService, type MediaAPIItem } from './services/mediaAPI';
import { fileManagerState } from '../../services/fileManagerState';

// Types for filtering and sorting
type DateFilter = 'all' | 'last5min' | 'last15min' | 'last30min' | 'lasthour' | 'today' | 'week' | 'month';
type SortOrder = 'newest' | 'oldest';
type FileType = 'all' | 'images' | 'videos' | 'audio' | 'documents';

interface WorkingFileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: { url: string; name: string }) => void;
  isImageSelectionMode?: boolean;
}

interface TreeNode {
  name: string;
  path: string;
  children: TreeNode[];
  isExpanded: boolean;
  isLoaded: boolean;
}

export const WorkingFileManager: React.FC<WorkingFileManagerProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  isImageSelectionMode = false,
}) => {
  const [items, setItems] = useState<MediaAPIItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  
  // Filtering and sorting state
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [fileTypeFilter, setFileTypeFilter] = useState<FileType>('all');
  
  // Multi-selection state
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedTreeNodes, setSelectedTreeNodes] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    node: TreeNode | null;
  }>({ isOpen: false, x: 0, y: 0, node: null });

  // Helper function to check if file is an image
  const isImageFile = (filename: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(filename);
  };

  // Effect to reload files when filters change (except search which filters client-side)
  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [dateFilter, fileTypeFilter]); // Don't include searchTerm as it's client-side filtered

  // Load the folder tree structure
  const loadFolderTree = async (path: string = ''): Promise<TreeNode[]> => {
    try {

      const result = await MediaAPIService.getFilesAndFolders(path);
      const folders = result.folders.map(folder => ({
        name: folder.name,
        path: folder.fileKey,
        children: [],
        isExpanded: false,
        isLoaded: false
      }));

      return folders;
    } catch (err) {
      // console.error('Failed to load folder tree:', err);
      return [];
    }
  };

  // Expand/collapse tree node
  const toggleTreeNode = async (nodePath: string) => {
    
    // Helper function to find node in tree
    const findNode = (nodes: TreeNode[], path: string): TreeNode | null => {
      for (const node of nodes) {
        if (node.path === path) return node;
        const found = findNode(node.children, path);
        if (found) return found;
      }
      return null;
    };
    
    // Special handling for root
    if (nodePath === 'ROOT') {
      const rootNode = treeData.find(n => n.path === 'ROOT');
      const willBeExpanded = !rootNode?.isExpanded;
      
      setTreeData(prev => {
        if (rootNode) {
          return prev.map(n => 
            n.path === 'ROOT' 
              ? { ...n, isExpanded: willBeExpanded }
              : n
          );
        } else {
          return [{
            name: 'Root',
            path: 'ROOT',
            children: [],
            isExpanded: true,
            isLoaded: false
          }];
        }
      });

      // Load root children if expanding and not loaded yet
      if (willBeExpanded && (!rootNode || !rootNode.isLoaded)) {
        const children = await loadFolderTree('');
        setTreeData(prev => 
          prev.map(n => 
            n.path === 'ROOT' 
              ? { ...n, children, isLoaded: true }
              : n
          )
        );
      }
      return;
    }

    // Find the current node before updating
    const currentNode = findNode(treeData, nodePath);
    const willBeExpanded = !currentNode?.isExpanded;
    

    // Update the tree to toggle expansion
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.path === nodePath) {
          return { ...node, isExpanded: willBeExpanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    setTreeData(prev => updateNode(prev));

    // Load children if expanding and not loaded yet
    if (currentNode && willBeExpanded && !currentNode.isLoaded) {
      const children = await loadFolderTree(nodePath);
      const updateNodeChildren = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(n => {
          if (n.path === nodePath) {
            return { ...n, children, isLoaded: true };
          }
          if (n.children.length > 0) {
            return { ...n, children: updateNodeChildren(n.children) };
          }
          return n;
        });
      };
      setTreeData(prev => updateNodeChildren(prev));
    }
  };

  // Navigate to folder from tree
  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSearchTerm('');
  };

  // Load files when component opens or path changes
  useEffect(() => {
    if (isOpen) {
      if (searchTerm) {
        searchFiles();
      } else {
        loadFiles();
      }
    }
  }, [isOpen, currentPath, searchTerm]);

  // Load root tree when component opens
  useEffect(() => {
    if (isOpen && treeData.length === 0) {
      // Initialize with root node
      setTreeData([{
        name: 'Root',
        path: 'ROOT',
        children: [],
        isExpanded: false,
        isLoaded: false
      }]);
    }
  }, [isOpen]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await MediaAPIService.getFilesAndFolders(currentPath);
      
      // Convert API response to MediaAPIItem format
      const allItems: MediaAPIItem[] = [
        ...result.folders.map(folder => ({
          name: folder.name,
          lastModified: folder.createdAt || '',
          path: folder.fileKey,
          type: 'folder',
          size: 0
        })),
        ...result.files.map(file => ({
          name: file.name,
          lastModified: file.uploadedAt || '',
          path: file.fileKey,
          type: 'file',
          size: file.size,
          url: file.url
        }))
      ];
      
      setItems(allItems);
    } catch (err) {
      // console.error('❌ Failed to load files:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar archivos');
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await MediaAPIService.searchFiles(searchTerm, currentPath);
      
      // Convert search results
      const allItems: MediaAPIItem[] = [
        ...result.folders.map(folder => ({
          name: folder.name,
          lastModified: folder.createdAt || '',
          path: folder.fileKey,
          type: 'folder',
          size: 0
        })),
        ...result.files.map(file => ({
          name: file.name,
          lastModified: file.uploadedAt || '',
          path: file.fileKey,
          type: 'file',
          size: file.size,
          url: file.url
        }))
      ];
      
      setItems(allItems);
    } catch (err) {
      // console.error('❌ Search error:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      
      const bucketPath = currentPath || '';

      
      await MediaAPIService.uploadFile(file, bucketPath);
      
      
      // Reload files after upload
      if (searchTerm) {
        await searchFiles();
      } else {
        await loadFiles();
      }
      
    } catch (err) {
      // console.error('❌ Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleItemClick = (item: MediaAPIItem) => {
    
    // If in multi-select mode, toggle selection instead of navigating
    if (isMultiSelectMode) {
      toggleItemSelection(item.path);
      return;
    }
    
    if (item.type === 'folder') {
      // Use the folder NAME, not the full path to avoid corruption
      let newPath;
      if (!currentPath) {
        newPath = item.name;
      } else {
        newPath = currentPath + '/' + item.name;
      }
      

      setCurrentPath(newPath);
      setSearchTerm('');
    } else if (item.type === 'file' && item.url) {
      
      // Register server file with file manager state for export functionality
      const bucketPath = extractBucketPath(item.url, currentPath, item.name);
      const serverUrl = getServerBaseUrl(item.url);
      const fileType = getFileType(item.name);
      
      // Register the file for future export functionality
      fileManagerState.registerServerFile(item.url, `fm_${Date.now()}`, {
        bucketPath,
        serverUrl,
        filename: item.name,
        mimeType: getMimeType(item.name),
        size: item.size || 0,
        lastModified: item.lastModified || new Date().toISOString(),
        type: fileType,
        originalUrl: item.url
      });
      
      onFileSelect({
        url: item.url,
        name: item.name
      });
    }
  };

  const goBack = () => {
    
    if (currentPath) {
      const pathParts = currentPath.split('/');
      pathParts.pop();
      const parentPath = pathParts.join('/');
      
      setCurrentPath(parentPath);
      setSearchTerm('');
    }
  };

  const resetToRoot = () => {
    setCurrentPath('');
    setSearchTerm('');
  };

  // Multi-selection functions
  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (isMultiSelectMode) {
      // Clear selections when exiting multi-select mode
      setSelectedItems(new Set());
      setSelectedTreeNodes(new Set());
    }
  };

  const toggleItemSelection = (itemPath: string) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(itemPath)) {
        newSelection.delete(itemPath);
      } else {
        newSelection.add(itemPath);
      }
      return newSelection;
    });
  };

  const toggleTreeNodeSelection = (nodePath: string) => {
    setSelectedTreeNodes(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(nodePath)) {
        newSelection.delete(nodePath);
      } else {
        newSelection.add(nodePath);
      }
      return newSelection;
    });
  };

  const selectAllItems = () => {
    const allPaths = new Set(items.map(item => item.path));
    setSelectedItems(allPaths);
  };

  const clearAllSelections = () => {
    setSelectedItems(new Set());
    setSelectedTreeNodes(new Set());
  };

  const batchDeleteSelected = async () => {
    const allSelected = [...selectedItems, ...selectedTreeNodes];
    if (allSelected.length === 0) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete ${allSelected.length} selected items?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      // Delete each selected item
      for (const itemPath of allSelected) {
        await MediaAPIService.deleteFile(itemPath);
      }
      
      // Clear selections and reload
      clearAllSelections();
      await loadFiles();
      
      // Reload tree to reflect deletions
      const updatedTree = await loadFolderTree('');
      setTreeData([{
        name: 'Root',
        path: 'ROOT',
        children: updatedTree,
        isExpanded: true,
        isLoaded: true
      }]);
      
    } catch (err) {
      // console.error('❌ Batch delete failed:', err);
      setError('Error al eliminar elementos seleccionados');
    } finally {
      setLoading(false);
    }
  };

  const deleteIndividualItem = async (itemPath: string, itemName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${itemName}"?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await MediaAPIService.deleteFile(itemPath);
      
      // Reload files and tree
      await loadFiles();
      const updatedTree = await loadFolderTree('');
      setTreeData([{
        name: 'Root',
        path: 'ROOT',
        children: updatedTree,
        isExpanded: true,
        isLoaded: true
      }]);
      
    } catch (err) {
      // console.error('❌ Delete failed:', err);
      setError(`Error al eliminar "${itemName}"`);
    } finally {
      setLoading(false);
    }
  };

  // Delete folder function
  const deleteFolder = async (folderPath: string) => {
    try {
      
      // Call delete API
      await MediaAPIService.deleteFile(folderPath);
      
      // Refresh the tree and current view
      if (currentPath.startsWith(folderPath)) {
        // If we're inside the deleted folder, go back to root
        setCurrentPath('');
      }
      
      // Reload tree and files
      setTreeData([{
        name: 'Root',
        path: 'ROOT',
        children: [],
        isExpanded: false,
        isLoaded: false
      }]);
      
      loadFiles();
    } catch (err) {
      // console.error('❌ Failed to delete folder:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar carpeta');
    }
  };

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      node: node
    });
  };

  // Close context menu when clicking elsewhere
  const closeContextMenu = () => {
    setContextMenu({ isOpen: false, x: 0, y: 0, node: null });
  };

  // Tree Node Component
  const TreeNodeComponent: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
    const isRoot = node.path === 'ROOT';
    const isCurrentPath = isRoot ? currentPath === '' : currentPath === node.path;
    const isSelected = selectedTreeNodes.has(node.path);
    
    const handleNodeClick = () => {
      if (isMultiSelectMode && !isRoot) {
        // In multi-select mode, toggle selection (except for root)
        toggleTreeNodeSelection(node.path);
      } else {
        // Normal navigation
        if (isRoot) {
          navigateToPath('');
        } else {
          navigateToPath(node.path);
        }
      }
    };
    
    return (
      <div>
        <div
          className={`flex items-center py-2 px-3 mb-1 cursor-pointer rounded-lg border transition-all duration-200 ${
            isCurrentPath && !isMultiSelectMode
              ? 'bg-blue-600 hover:bg-blue-700 border-blue-500 shadow-md text-white' 
              : isSelected && isMultiSelectMode
              ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 shadow-md text-white'
              : 'hover:bg-gray-700 border-gray-600 hover:border-gray-500 bg-gray-800/50 text-gray-200'
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={handleNodeClick}
          onContextMenu={(e) => {
            if (!isRoot) {
              handleContextMenu(e, node);
            }
          }}
        >
          {/* Multi-select checkbox */}
          {isMultiSelectMode && !isRoot && (
            <div className="mr-2">
              {isSelected ? (
                <CheckSquare size={16} className="text-purple-200" />
              ) : (
                <Square size={16} className="text-gray-400 hover:text-purple-400" />
              )}
            </div>
          )}
          
          {/* Expand/collapse button with blue color and border */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTreeNode(node.path);
            }}
            className="mr-2 p-1 hover:bg-gray-600 rounded border border-gray-600 hover:border-blue-400 transition-all duration-200"
          >
            {node.isExpanded ? (
              <ChevronDown size={16} className="text-blue-400" />
            ) : (
              <ChevronRight size={16} className="text-blue-400" />
            )}
          </button>
          
          <Folder size={18} className="mr-3 text-blue-400" />
          <span className="text-base truncate font-medium">{node.name}</span>
        </div>
        
        {/* Render children when expanded */}
        {node.isExpanded && node.children.map((child) => (
          <TreeNodeComponent key={child.path} node={child} level={level + 1} />
        ))}
      </div>
    );
  };

  // Helper function to check if file matches date filter
  const matchesDateFilter = (item: MediaAPIItem): boolean => {
    if (dateFilter === 'all' || !item.lastModified) return true;
    
    const now = new Date();
    const itemDate = new Date(item.lastModified);
    const diffMs = now.getTime() - itemDate.getTime();
    
    switch (dateFilter) {
      case 'last5min': return diffMs <= 5 * 60 * 1000;
      case 'last15min': return diffMs <= 15 * 60 * 1000;
      case 'last30min': return diffMs <= 30 * 60 * 1000;
      case 'lasthour': return diffMs <= 60 * 60 * 1000;
      case 'today': return diffMs <= 24 * 60 * 60 * 1000;
      case 'week': return diffMs <= 7 * 24 * 60 * 60 * 1000;
      case 'month': return diffMs <= 30 * 24 * 60 * 60 * 1000;
      default: return true;
    }
  };

  // Helper function to check if file matches type filter
  const matchesTypeFilter = (item: MediaAPIItem): boolean => {
    if (fileTypeFilter === 'all' || item.type === 'folder') return true;
    
    const extension = item.name.toLowerCase().split('.').pop() || '';
    
    switch (fileTypeFilter) {
      case 'images': 
        return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(item.name);
      case 'videos': 
        return /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)$/i.test(item.name);
      case 'audio': 
        return /\.(mp3|wav|ogg|aac|flac|m4a|wma)$/i.test(item.name);
      case 'documents': 
        return /\.(pdf|doc|docx|txt|rtf|xls|xlsx|ppt|pptx)$/i.test(item.name);
      default: 
        return true;
    }
  };

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      // Basic image mode filtering
      if (isImageSelectionMode && item.type === 'file' && !isImageFile(item.name)) {
        return false;
      }
      
      // Search filter
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Date filter
      if (!matchesDateFilter(item)) {
        return false;
      }
      
      // Type filter
      if (!matchesTypeFilter(item)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Always put folders first
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      
      // Then sort by date
      const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      
      if (sortOrder === 'newest') {
        return bDate - aDate; // Newest first
      } else {
        return aDate - bDate; // Oldest first
      }
    });

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={closeContextMenu}
    >
      <div className="bg-gray-900 rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-7xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">
              {isImageSelectionMode ? 'Seleccionar Imagen' : 'Gestor de Archivos'}
            </h2>
            {currentPath && (
              <>
                <button
                  onClick={goBack}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                >
                  <ChevronLeft size={16} />
                  <span>Atrás</span>
                </button>
                <button
                  onClick={resetToRoot}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-700 hover:bg-red-600 rounded-lg text-red-300"
                  title="Reiniciar a raíz (corrige rutas corruptas)"
                >
                  <span>🏠 Raíz</span>
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Multi-selection toggle */}
            <button
              onClick={toggleMultiSelectMode}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isMultiSelectMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              title="Alternar modo de selección múltiple"
            >
              <CheckSquare size={16} />
              <span className="text-sm font-medium">Selección Múltiple</span>
            </button>
            
            {/* Multi-selection actions */}
            {isMultiSelectMode && (
              <>
                <span className="text-sm text-purple-300">
                  {selectedItems.size + selectedTreeNodes.size} seleccionados
                </span>
                
                <button
                  onClick={selectAllItems}
                  className="px-2 py-1 bg-purple-700 hover:bg-purple-600 rounded text-purple-100 text-sm"
                  title="Seleccionar todos los elementos visibles"
                >
                  Todos
                </button>
                
                <button
                  onClick={clearAllSelections}
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-sm"
                  title="Limpiar todas las selecciones"
                >
                  Limpiar
                </button>
                
                <button
                  onClick={batchDeleteSelected}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-red-100"
                  disabled={selectedItems.size + selectedTreeNodes.size === 0}
                  title="Eliminar elementos seleccionados"
                >
                  <Trash2 size={14} />
                  <span className="text-sm">Eliminar</span>
                </button>
              </>
            )}
            
            <button
              onClick={() => searchTerm ? searchFiles() : loadFiles()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload size={16} />
              <span>Subir</span>
              <input
                type="file"
                accept={isImageSelectionMode ? "image/*" : "*/*"}
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {uploading && (
              <span className="text-sm text-blue-400 animate-pulse">Subiendo...</span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* File Type Filter */}
            <div className="relative">
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value as FileType)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer min-w-[120px]"
              >
                <option value="all">Todos los tipos</option>
                <option value="images">Imágenes</option>
                <option value="videos">Videos</option>
                <option value="audio">Audio</option>
                <option value="documents">Documentos</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="all">Todas las fechas</option>
                <option value="last5min">Últimos 5 min</option>
                <option value="last15min">Últimos 15 min</option>
                <option value="last30min">Últimos 30 min</option>
                <option value="lasthour">Última hora</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Sort Order Button */}
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors"
              title={sortOrder === 'newest' ? 'Ordenar: Más recientes primero' : 'Ordenar: Más antiguos primero'}
            >
              <ArrowUpDown size={16} />
              <span className="text-sm font-medium">
                {sortOrder === 'newest' ? 'Más recientes' : 'Más antiguos'}
              </span>
            </button>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar archivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 min-w-[200px]"
              />
            </div>
          </div>
        </div>

        {/* Current path display */}
        {currentPath && (
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-sm text-gray-400">Ruta: /{currentPath}</span>
          </div>
        )}

        {/* Filter Status Display */}
        {(dateFilter !== 'all' || fileTypeFilter !== 'all' || searchTerm) && (
          <div className="px-4 py-2 bg-blue-900/20 border-b border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-blue-300">Filtros activos:</span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-600/30 text-blue-200 rounded">
                    Búsqueda: "{searchTerm}"
                  </span>
                )}
                {dateFilter !== 'all' && (
                  <span className="px-2 py-1 bg-blue-600/30 text-blue-200 rounded">
                    Fecha: {dateFilter === 'last5min' ? 'Últimos 5 min' : 
                           dateFilter === 'last15min' ? 'Últimos 15 min' :
                           dateFilter === 'last30min' ? 'Últimos 30 min' :
                           dateFilter === 'lasthour' ? 'Última hora' :
                           dateFilter === 'today' ? 'Hoy' :
                           dateFilter === 'week' ? 'Esta semana' :
                           dateFilter === 'month' ? 'Este mes' : dateFilter}
                  </span>
                )}
                {fileTypeFilter !== 'all' && (
                  <span className="px-2 py-1 bg-blue-600/30 text-blue-200 rounded">
                    Tipo: {fileTypeFilter === 'images' ? 'Imágenes' :
                           fileTypeFilter === 'videos' ? 'Videos' :
                           fileTypeFilter === 'audio' ? 'Audio' :
                           fileTypeFilter === 'documents' ? 'Documentos' : fileTypeFilter}
                  </span>
                )}
                <span className="text-blue-300">
                  ({filteredItems.length} {filteredItems.length === 1 ? 'elemento' : 'elementos'})
                </span>
              </div>
              <button
                onClick={() => {
                  setDateFilter('all');
                  setFileTypeFilter('all');
                  setSearchTerm('');
                }}
                className="text-xs text-blue-300 hover:text-blue-100 underline"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar with Folder Tree */}
          <div className="w-80 bg-gray-800/30 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Carpetas</h3>
              {treeData.map((node) => (
                <TreeNodeComponent key={node.path} node={node} level={0} />
              ))}
            </div>
          </div>

          {/* Main File Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-3 text-gray-400">
                  <RefreshCw size={24} className="animate-spin" />
                  <span>Cargando archivos...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredItems.map((item, index) => {
                  const isSelected = selectedItems.has(item.path);
                  return (
                    <div
                      key={`${item.path}-${index}`}
                      onClick={() => handleItemClick(item)}
                      className={`group relative p-4 rounded-lg cursor-pointer transition-colors border ${
                        isSelected && isMultiSelectMode
                          ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {/* Multi-select checkbox */}
                      {isMultiSelectMode && (
                        <div className="absolute top-2 left-2 z-10">
                          {isSelected ? (
                            <CheckSquare size={18} className="text-purple-200" />
                          ) : (
                            <Square size={18} className="text-gray-400 hover:text-purple-400" />
                          )}
                        </div>
                      )}

                      {/* Individual delete button */}
                      {!isMultiSelectMode && (
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteIndividualItem(item.path, item.name);
                            }}
                            className="p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg"
                            title={`Delete ${item.name}`}
                          >
                            <Trash2 size={14} className="text-white" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center space-y-2">
                        {/* Icon */}
                        <div className="w-12 h-12 flex items-center justify-center">
                          {item.type === 'folder' ? (
                            <Folder size={32} className="text-blue-400" />
                          ) : item.url && isImageFile(item.name) ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <File size={32} className="text-gray-400" />
                          )}
                          {/* Fallback icon for broken images */}
                          {item.type === 'file' && item.url && isImageFile(item.name) && (
                            <File size={32} className="text-gray-400 hidden" />
                          )}
                        </div>

                        {/* Name */}
                        <span className={`text-sm text-center truncate w-full ${
                          isSelected && isMultiSelectMode ? 'text-white' : 'text-white'
                        }`} title={item.name}>
                          {item.name}
                        </span>

                        {/* Size for files */}
                        {item.type === 'file' && (
                          <span className={`text-xs ${
                            isSelected && isMultiSelectMode ? 'text-purple-200' : 'text-gray-400'
                          }`}>
                            {(item.size / 1024).toFixed(1)} KB
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Folder size={48} className="mb-4" />
                {(dateFilter !== 'all' || fileTypeFilter !== 'all' || searchTerm) ? (
                  <>
                    <p className="text-lg font-medium text-gray-300 mb-2">
                      No se encontraron archivos con los filtros actuales
                    </p>
                    <p className="text-sm text-center mb-4">
                      {searchTerm && `Búsqueda: "${searchTerm}"`}
                      {dateFilter !== 'all' && (searchTerm ? ', ' : '') + `Fecha: ${
                        dateFilter === 'last5min' ? 'Últimos 5 min' : 
                        dateFilter === 'last15min' ? 'Últimos 15 min' :
                        dateFilter === 'last30min' ? 'Últimos 30 min' :
                        dateFilter === 'lasthour' ? 'Última hora' :
                        dateFilter === 'today' ? 'Hoy' :
                        dateFilter === 'week' ? 'Esta semana' :
                        dateFilter === 'month' ? 'Este mes' : dateFilter
                      }`}
                      {fileTypeFilter !== 'all' && ((searchTerm || dateFilter !== 'all') ? ', ' : '') + `Tipo: ${
                        fileTypeFilter === 'images' ? 'Imágenes' :
                        fileTypeFilter === 'videos' ? 'Videos' :
                        fileTypeFilter === 'audio' ? 'Audio' :
                        fileTypeFilter === 'documents' ? 'Documentos' : fileTypeFilter
                      }`}
                    </p>
                    <button
                      onClick={() => {
                        setDateFilter('all');
                        setFileTypeFilter('all');
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-300 mb-2">No se encontraron archivos</p>
                    <p className="text-sm">Esta carpeta está vacía</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.isOpen && contextMenu.node && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 py-1"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              if (contextMenu.node) {
                // Navigate to the clicked folder
                navigateToPath(contextMenu.node.path);
              }
              closeContextMenu();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Abrir
          </button>
          
          <button
            onClick={() => {
              if (contextMenu.node) {
                // Delete the clicked folder
                deleteFolder(contextMenu.node.path);
              }
              closeContextMenu();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

// Helper functions for file management
const extractBucketPath = (url: string, currentPath: string, filename: string): string => {
  try {
    const urlObj = new URL(url);
    // Try to extract path from URL
    const pathMatch = urlObj.pathname.match(/\/(api\/files|uploads)\/(.+)$/);
    if (pathMatch) {
      return `/${pathMatch[2]}`;
    }
    
    // Construct from current path and filename
    const fullPath = currentPath ? `/${currentPath}/${filename}` : `/${filename}`;
    return fullPath;
  } catch {
    const fullPath = currentPath ? `/${currentPath}/${filename}` : `/${filename}`;
    return fullPath;
  }
};

const getServerBaseUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    return window.location.origin;
  }
};

const getFileType = (filename: string): 'image' | 'audio' | 'video' | 'document' => {
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(filename)) {
    return 'image';
  } else if (/\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)$/i.test(filename)) {
    return 'video';
  } else if (/\.(mp3|wav|ogg|aac|flac|m4a|wma)$/i.test(filename)) {
    return 'audio';
  } else {
    return 'document';
  }
};

const getMimeType = (filename: string): string => {
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    mp4: 'video/mp4',
    avi: 'video/avi',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    m4v: 'video/x-m4v',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    flac: 'audio/flac',
    m4a: 'audio/m4a',
    wma: 'audio/x-ms-wma',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    rtf: 'application/rtf',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};
