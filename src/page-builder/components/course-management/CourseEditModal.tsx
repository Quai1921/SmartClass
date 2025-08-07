import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Eye, AlertCircle } from 'lucide-react';

type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';

interface CourseEditModalProps {
  isOpen: boolean;
  course: any;
  onClose: () => void;
  onSave: (courseData: {
    title: string;
    description: string;
    grade: string;
    subject: string;
    status: CourseStatus;
  }) => void;
  isSaving?: boolean;
}

const statusOptions: Array<{
  value: CourseStatus;
  label: string;
  description: string;
  color: string;
  icon: any;
}> = [
  {
    value: 'DRAFT',
    label: 'Borrador',
    description: 'El curso está en desarrollo',
    color: 'text-gray-600',
    icon: Clock
  },
  {
    value: 'IN_REVIEW',
    label: 'En Revisión',
    description: 'El curso está siendo revisado',
    color: 'text-orange-600',
    icon: AlertCircle
  },
  {
    value: 'PUBLISHED',
    label: 'Publicado',
    description: 'El curso está disponible para estudiantes',
    color: 'text-green-600',
    icon: Eye
  }
];

export const CourseEditModal: React.FC<CourseEditModalProps> = ({
  isOpen,
  course,
  onClose,
  onSave,
  isSaving = false
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    grade: string;
    subject: string;
    status: CourseStatus;
  }>({
    title: '',
    description: '',
    grade: '',
    subject: '',
    status: 'DRAFT'
  });

  useEffect(() => {
    if (course) {
      
      // Smart grade mapping - handle different grade formats
      let mappedGrade = course.grade || '';
      if (mappedGrade && !mappedGrade.includes('°')) {
        // If grade is just a number, add the degree symbol
        const gradeNum = parseInt(mappedGrade);
        if (!isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 12) {
          mappedGrade = `${gradeNum}°`;
        }
      }
      
      // Smart subject mapping - handle different subject formats
      let mappedSubject = course.subject || '';
      // Handle common variations in subject names
      const subjectMappings: { [key: string]: string } = {
        'matematicas': 'Matemáticas',
        'espanol': 'Español',
        'español': 'Español',
        'ciencias': 'Ciencias',
        'historia': 'Historia',
        'geografia': 'Geografía',
        'ingles': 'Inglés',
        'educacion fisica': 'Educación Física',
        'arte': 'Arte'
      };
      
      const lowerSubject = mappedSubject.toLowerCase();
      if (subjectMappings[lowerSubject]) {
        mappedSubject = subjectMappings[lowerSubject];
      }
      
      
      setFormData({
        title: course.title || '',
        description: course.description || '',
        grade: mappedGrade,
        subject: mappedSubject,
        status: course.status || 'DRAFT'
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  // Debug: Log current form data values


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Publicar Curso
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Revisa y actualiza la información del curso antes de publicar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-3 h-full overflow-y-auto">
          {/* Info message for empty fields */}
          {(!formData.title || !formData.description || !formData.grade || !formData.subject) && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-black font-bold">!</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-yellow-300 mb-1">
                    Información del curso incompleta
                  </h4>
                  <p className="text-xs text-yellow-200">
                    Por favor completa todos los campos requeridos antes de publicar el curso.
                    {!formData.grade && !formData.subject && " Especialmente el grado y la materia son necesarios."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título del Curso *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Ingresa el título del curso"
              required
              disabled={isSaving}
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción del Curso
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Describe el contenido y objetivos del curso..."
              disabled={isSaving}
            />
          </div>

          {/* Grade and Subject Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Grade Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grado
                {!formData.grade && <span className="text-xs text-yellow-400 ml-1">(requerido para publicar)</span>}
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleChange('grade', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isSaving}
              >
                <option value="">Seleccionar grado</option>
                <option value="1°">1° (Primero)</option>
                <option value="2°">2° (Segundo)</option>
                <option value="3°">3° (Tercero)</option>
                <option value="4°">4° (Cuarto)</option>
                <option value="5°">5° (Quinto)</option>
                <option value="6°">6° (Sexto)</option>
                <option value="7°">7° (Séptimo)</option>
                <option value="8°">8° (Octavo)</option>
                <option value="9°">9° (Noveno)</option>
                <option value="10°">10° (Décimo)</option>
                <option value="11°">11° (Once)</option>
                <option value="12°">12° (Doce)</option>
              </select>
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Materia
                {!formData.subject && <span className="text-xs text-yellow-400 ml-1">(requerido para publicar)</span>}
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isSaving}
              >
                <option value="">Seleccionar materia</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Español">Español</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Historia">Historia</option>
                <option value="Geografía">Geografía</option>
                <option value="Inglés">Inglés</option>
                <option value="Educación Física">Educación Física</option>
                <option value="Arte">Arte</option>
              </select>
            </div>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estado del Curso
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.status === option.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="sr-only"
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        formData.status === option.value ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {formData.status === option.value && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Course Information Display */}
          {course && (
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Información del Curso</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {course.grade && (
                  <div>
                    <span className="text-gray-400">Grado:</span>
                    <span className="ml-2 text-white">{course.grade}</span>
                  </div>
                )}
                {course.subject && (
                  <div>
                    <span className="text-gray-400">Materia:</span>
                    <span className="ml-2 text-white">{course.subject}</span>
                  </div>
                )}
                {course.tutorName && (
                  <div>
                    <span className="text-gray-400">Tutor:</span>
                    <span className="ml-2 text-white">{course.tutorName}</span>
                  </div>
                )}
                {course.createdAt && (
                  <div>
                    <span className="text-gray-400">Creado:</span>
                    <span className="ml-2 text-white">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700 bg-gray-800/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !formData.title.trim() || !formData.description.trim() || !formData.grade.trim() || !formData.subject.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publicar Curso</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
