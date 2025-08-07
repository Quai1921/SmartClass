import React from 'react';
import { Search, ChevronDown, Grid, List } from 'lucide-react';
import type { User } from '../../../domain/entities/user';

interface CourseFiltersProps {
  searchTerm: string;
  gradeFilter: string;
  subjectFilter: string;
  statusFilter: string;
  viewMode: 'grid' | 'list';
  userData?: User | null;
  onSearchChange: (value: string) => void;
  onGradeFilterChange: (value: string) => void;
  onSubjectFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  gradeFilter,
  subjectFilter,
  statusFilter,
  viewMode,
  userData,
  onSearchChange,
  onGradeFilterChange,
  onSubjectFilterChange,
  onStatusFilterChange,
  onViewModeChange,
}) => {
  // Get available grades - hardcoded from 1 to 11
  const getGrades = () => {
    const hardcodedGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return ['Todos los grados', ...hardcodedGrades.map(grade => `Grado ${grade}`)];
  };

  const getSubjects = () => {
    const subjects = userData?.subjects || [];
    return ['Todas las materias', ...subjects];
  };

  const getStatusOptions = () => {
    return ['Todos los estados', 'Publicado', 'Borrador'];
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Grade Filter */}
      <div className="relative">
        <select
          value={gradeFilter}
          onChange={(e) => onGradeFilterChange(e.target.value)}
          className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {getGrades().map((grade: string) => (
            <option key={grade} value={grade} className="bg-gray-800">
              {grade}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>

      {/* Subject Filter */}
      <div className="relative">
        <select
          value={subjectFilter}
          onChange={(e) => onSubjectFilterChange(e.target.value)}
          className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {getSubjects().map((subject: string) => (
            <option key={subject} value={subject} className="bg-gray-800">
              {subject}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {getStatusOptions().map((status: string) => (
            <option key={status} value={status} className="bg-gray-800">
              {status}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>

      {/* View Mode Toggle */}
      <div className="flex rounded-lg border border-gray-700 overflow-hidden">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'} transition-colors`}
          title="Vista de cuadrícula"
        >
          <Grid size={18} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'} transition-colors`}
          title="Vista de lista"
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
};
