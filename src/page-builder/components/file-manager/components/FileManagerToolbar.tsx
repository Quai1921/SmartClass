import React from 'react';
import { Upload, Plus, Search, ArrowUpDown } from 'lucide-react';
import type { DateFilter, SortOrder } from '../types';

interface FileManagerToolbarProps {
  isUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateFolder: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
  // Multi-select functionality
  isMultiSelectMode?: boolean;
  onToggleMultiSelect?: () => void;
  selectedCount?: number;
  onBatchDelete?: () => void;
}

export const FileManagerToolbar: React.FC<FileManagerToolbarProps> = ({
  isUploading,
  onFileUpload,
  onCreateFolder,
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  sortOrder,
  onToggleSortOrder,
  // Multi-select functionality
  isMultiSelectMode = false,
  onToggleMultiSelect,
  selectedCount = 0,
  onBatchDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
      <div className="flex items-center gap-4">
        {/* Upload Button */}
        <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200">
          <Upload size={16} />
          <span className="font-medium">Subir archivo</span>
          <input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>

        {/* Create Folder Button */}
        <button
          onClick={onCreateFolder}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors duration-200"
        >
          <Plus size={16} />
          <span className="font-medium">Nueva carpeta</span>
        </button>
        
        {/* Multi-select Toggle */}
        {onToggleMultiSelect && (
          <button
            onClick={onToggleMultiSelect}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
              isMultiSelectMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="w-4 h-4 border-2 rounded flex items-center justify-center">
              {isMultiSelectMode && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span className="font-medium">
              {isMultiSelectMode ? `Seleccionado: ${selectedCount}` : 'Seleccionar múltiple'}
            </span>
          </button>
        )}
        
        {/* Batch Delete Button */}
        {isMultiSelectMode && selectedCount > 0 && onBatchDelete && (
          <button
            onClick={onBatchDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors duration-200"
          >
            <span className="font-medium">Eliminar ({selectedCount})</span>
          </button>
        )}
        
        {isUploading && (
          <span className="text-sm text-blue-400 animate-pulse">Subiendo...</span>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        {/* Date Filter */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value as DateFilter)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="all">Todos</option>
            <option value="last5min">Últimos 5 min</option>
            <option value="last15min">Últimos 15 min</option>
            <option value="last30min">Últimos 30 min</option>
            <option value="lasthour">Última hora</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort Order Button */}
        <button
          onClick={onToggleSortOrder}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 transition-colors"
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-400 min-w-[250px]"
          />
        </div>
      </div>
    </div>
  );
};
