import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createCourse } from '../../../actions/courses/create-course';
import type { CreateCourseRequest } from '../../../actions/courses/create-course';

interface CreateCourseSimpleProps {}

interface FormData {
  title: string;
  description: string;
  grade: string;
  subject: string;
}

const CreateCourseSimple: React.FC<CreateCourseSimpleProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    grade: '',
    subject: ''
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const createCourseMutation = useMutation({
    mutationFn: async ({ courseData, banner }: { courseData: CreateCourseRequest; banner?: File }) => {
      return createCourse(courseData, banner);
    },
    onSuccess: (response) => {
      // Navigate to the created course
      if (response.success && response.data) {
        window.location.href = `/tutor/courses/${response.data.id}`;
      }
    },
    onError: (error) => {
      // console.error('Error creating course:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData: CreateCourseRequest = {
      title: formData.title,
      description: formData.description,
      grade: formData.grade,
      subject: formData.subject,
      status: 'DRAFT'
    };

    createCourseMutation.mutate({ 
      courseData, 
      banner: bannerFile || undefined 
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Crear Nuevo Curso</h1>
          </div>

          <p className="text-gray-300 mb-8">
            Completa la información básica para crear tu curso educativo
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del curso *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ingresa el título del curso"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe brevemente el contenido del curso"
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Grade and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grado
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Grado 1</option>
                  <option value="1">Grado 1</option>
                  <option value="2">Grado 2</option>
                  <option value="3">Grado 3</option>
                  <option value="4">Grado 4</option>
                  <option value="5">Grado 5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Materia
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Seleccionar materia</option>
                  <option value="Matemáticas">Matemáticas</option>
                  <option value="Español">Español</option>
                  <option value="Sociales">Sociales</option>
                  <option value="Inglés">Inglés</option>
                </select>
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen del curso (opcional)
              </label>
              <div className="w-full px-4 py-8 bg-gray-700 border border-gray-600 border-dashed rounded-lg text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <div className="mb-2">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <span className="text-blue-400 font-medium">Choose File</span>
                  <span className="text-gray-400 text-sm mt-1">
                    {bannerFile ? bannerFile.name : 'JPG, PNG, GIF hasta 5MB'}
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => window.location.href = '/tutor/courses'}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createCourseMutation.isPending}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {createCourseMutation.isPending ? 'Creando...' : 'Crear Curso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseSimple;
