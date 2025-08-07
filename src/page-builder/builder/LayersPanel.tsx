import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Eye, 
  EyeOff,
  Trash2
} from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import { 
  buildHierarchy, 
  getVisibleNodes, 
  filterNodes,
  getElementIcon,
  type HierarchyNode 
} from '../utils/hierarchy';
import { ConfirmationModal } from '../components/ConfirmationModal';

/**
 * LayersPanel Component
 * 
 * Displays a hierarchical (tree) view of all elements in the canvas, similar to 
 * Elementor or Figma layers panel. Features include:
 * 
 * - Hierarchical tree view with proper indentation for nested elements
 * - Search functionality to filter elements by name or type
 * - Expand/collapse containers to show/hide their children
 * - Element selection (single and multi-select with Ctrl/Cmd+Click)
 * - Visibility toggle for individual elements
 * - Element deletion with confirmation
 * - Auto-expansion of parent containers when children are selected
 * - Auto-scroll to selected elements in the canvas
 * - Live updates as the canvas structure changes
 */
export const LayersPanel: React.FC = () => {
  const { 
    elements, 
    selectedElementIds, 
    selectElement, 
    removeElement,
    updateElement 
  } = useBuilder();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    elementId: string | null;
    elementName: string;
  }>({
    isOpen: false,
    elementId: null,
    elementName: ''
  });

  // Build hierarchy from elements
  const hierarchy = useMemo(() => {
    const nodes = buildHierarchy(elements);
    
    // Apply expanded state from local state
    function applyExpandedState(nodeList: HierarchyNode[]): HierarchyNode[] {
      return nodeList.map(node => ({
        ...node,
        isExpanded: expandedNodes.has(node.element.id) ?? node.isExpanded,
        children: applyExpandedState(node.children)
      }));
    }
    
    // Apply search filter
    const filteredNodes = filterNodes(applyExpandedState(nodes), searchTerm);
    return getVisibleNodes(filteredNodes);
  }, [elements, expandedNodes, searchTerm]);

  // Handle node expansion
  const handleToggleExpanded = (elementId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      return newSet;
    });
  };

  // Handle node visibility toggle
  const handleToggleVisibility = (elementId: string) => {
    setHiddenNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      return newSet;
    });

    // Update element properties to reflect visibility
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const isCurrentlyHidden = hiddenNodes.has(elementId);
      updateElement(elementId, {
        properties: {
          ...element.properties,
          style: {
            ...element.properties.style,
            opacity: isCurrentlyHidden ? 1 : 0.3,
            pointerEvents: isCurrentlyHidden ? 'auto' : 'none'
          }
        }
      });
    }
  };
  // Handle element selection
  const handleSelect = (elementId: string, event: React.MouseEvent) => {
    const multiSelect = event.ctrlKey || event.metaKey;
    selectElement(elementId, multiSelect);
    
    // Scroll the element into view in the canvas
    setTimeout(() => {
      const element = document.querySelector(`[data-element-id="${elementId}"]`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
    }, 100);
  };
  // Handle element deletion
  const handleDelete = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setDeleteModal({
        isOpen: true,
        elementId,
        elementName: element.name
      });
    }
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (deleteModal.elementId) {
      removeElement(deleteModal.elementId);
      setDeleteModal({
        isOpen: false,
        elementId: null,
        elementName: ''
      });
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      elementId: null,
      elementName: ''
    });
  };

  // Get type name in Spanish
  const getTypeName = (type: string): string => {
    const typeNames: Record<string, string> = {
      container: 'Contenedor',
      heading: 'Título',
      paragraph: 'Párrafo',
      text: 'Texto',
      image: 'Imagen',
      video: 'Video',
      button: 'Botón',
    };
    return typeNames[type] || type;
  };

  // Auto-expand parent nodes when child is selected
  React.useEffect(() => {
    if (selectedElementIds.length > 0) {
      // Find all parent IDs for selected elements
      const parentIds = new Set<string>();
      
      selectedElementIds.forEach(selectedId => {
        const element = elements.find(el => el.id === selectedId);        if (element?.parentId) {
          // Add all ancestor containers to expansion
          let parentId: string | undefined = element.parentId;
          while (parentId) {
            parentIds.add(parentId);
            const parent = elements.find(el => el.id === parentId);
            parentId = parent?.parentId;
          }
        }
      });
      
      // Update expanded nodes to include all parents
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        parentIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  }, [selectedElementIds, elements]);

  return (
    <div className="layers-panel bg-gray-800 p-4 h-full max-h-full overflow-y-auto flex flex-col pb-20">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white">Capas</h3>
          <span className="text-xs text-gray-400">
            {elements.length} elemento{elements.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar elementos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
          />
        </div>
      </div>      {/* Layers Tree */}
      <div className="flex-1 overflow-y-auto space-y-1 layers-panel">
        {hierarchy.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-xs">
              {searchTerm ? 'No se encontraron elementos' : 'No hay elementos en el lienzo'}
            </p>
          </div>
        ) : (
          hierarchy.map(node => (
            <LayerNode
              key={node.element.id}
              node={node}
              isSelected={selectedElementIds.includes(node.element.id)}
              isHidden={hiddenNodes.has(node.element.id)}
              onToggleExpanded={() => handleToggleExpanded(node.element.id)}
              onToggleVisibility={() => handleToggleVisibility(node.element.id)}
              onSelect={(event) => handleSelect(node.element.id, event)}
              onDelete={(event) => handleDelete(node.element.id, event)}
              getTypeName={getTypeName}
            />
          ))
        )}
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="pt-2 border-t border-gray-700">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• <strong>Alt+T:</strong> Cambiar pestañas</div>
          <div>• <strong>Ctrl+Click:</strong> Selección múltiple</div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Eliminar Elemento"
        message={`¿Estás seguro de que quieres eliminar "${deleteModal.elementName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

interface LayerNodeProps {
  node: HierarchyNode;
  isSelected: boolean;
  isHidden: boolean;
  onToggleExpanded: () => void;
  onToggleVisibility: () => void;
  onSelect: (event: React.MouseEvent) => void;
  onDelete: (event: React.MouseEvent) => void;
  getTypeName: (type: string) => string;
}

const LayerNode: React.FC<LayerNodeProps> = ({
  node,
  isSelected,
  isHidden,
  onToggleExpanded,
  onToggleVisibility,
  onSelect,
  onDelete,
  getTypeName
}) => {
  const hasChildren = node.children.length > 0;
  const paddingLeft = 8 + (node.depth * 16); // 16px per level
  return (
    <div
      className={`layer-node group relative flex items-center py-1.5 px-2 rounded text-xs cursor-pointer transition-colors ${
        isSelected 
          ? 'selected bg-blue-600 text-white' 
          : 'hover:bg-gray-700 text-gray-300'
      } ${isHidden ? 'hidden opacity-50' : ''}`}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={onSelect}
    >
      {/* Expand/Collapse Button */}
      <div className="w-4 h-4 flex items-center justify-center mr-1">
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {node.isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <div className="w-3 h-3" />
        )}
      </div>

      {/* Element Icon */}
      <div className="w-4 h-4 flex items-center justify-center mr-2 text-xs">
        {getElementIcon(node.element.type)}
      </div>

      {/* Element Name and Type */}
      <div className="flex-1 min-w-0 truncate">
        <span className="font-medium">{node.element.name}</span>
        <span className="ml-1 opacity-60">({getTypeName(node.element.type)})</span>
      </div>

      {/* Actions */}
      <div className="layer-actions flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className="p-0.5 text-gray-400 hover:text-white transition-colors"
          title={isHidden ? 'Mostrar elemento' : 'Ocultar elemento'}
        >
          {isHidden ? (
            <EyeOff className="w-3 h-3" />
          ) : (
            <Eye className="w-3 h-3" />
          )}
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="p-0.5 text-gray-400 hover:text-red-400 transition-colors"
          title="Eliminar elemento"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
