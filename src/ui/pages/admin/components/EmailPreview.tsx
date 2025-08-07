import React from 'react';
import type { EmailPlaceholder } from '../../../../actions/email/get-email-placeholders';

interface EmailPreviewProps {
    subject: string;
    body: string;
    placeholders?: EmailPlaceholder[];
}

// Sample data for placeholder replacement in preview
const samplePlaceholderValues: Record<string, string> = {
    'STUDENT_NAME': 'María García',
    'TEACHER_NAME': 'Prof. Juan Pérez',
    'INSTITUTION_NAME': 'Colegio San Martín',
    'COURSE_NAME': 'Matemáticas',
    'GRADE': '5to Grado',
    'DATE': new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }),
    'TIME': new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    }),
    'ASSIGNMENT_NAME': 'Examen de Álgebra',
    'DUE_DATE': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
    'GRADE_SCORE': '8.5',
    'PARENT_NAME': 'Sr. García',
    'EVENT_NAME': 'Reunión de Padres',
    'LOCATION': 'Aula 201',
};

const replacePlaceholders = (text: string): string => {
    let processedText = text;
    
    // Replace placeholders with sample data first
    Object.entries(samplePlaceholderValues).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedText = processedText.replace(regex, `<span style="background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-weight: 600; margin: 0 2px;">${value}</span>`);
    });
    
    // The text already contains HTML from the RichTextEditor, so we just need to process line breaks
    processedText = processedText.replace(/\n/g, '<br>');
    
    return processedText;
};

export const EmailPreview: React.FC<EmailPreviewProps> = ({ subject, body }) => {
    const processedSubject = replacePlaceholders(subject);
    const processedBody = replacePlaceholders(body);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Vista Previa del Email</h3>
                        <p className="text-sm text-gray-600">
                            Así se verá el email con los datos de ejemplo
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-blue-100 rounded"></div>
                            <span>Placeholders reemplazados</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                {/* Email Header */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">SC</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">SmartClass</p>
                                <p className="text-sm text-gray-600">noreply@smartclass.com</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('es-ES')}
                        </div>
                    </div>
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-sm text-gray-600 mb-1">Para: usuario@ejemplo.com</p>
                        <div className="font-semibold text-gray-900 text-lg">
                            <div 
                                dangerouslySetInnerHTML={{ __html: processedSubject }}
                            />
                        </div>
                    </div>
                </div>                {/* Email Body */}
                <div className="email-body-preview bg-white border border-gray-200 rounded-lg p-6 min-h-[200px]">
                    <div 
                        dangerouslySetInnerHTML={{ __html: processedBody || '<p style="color: #999; font-style: italic;">Sin contenido para mostrar</p>' }}
                        style={{
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: '#333'
                        }}
                    />
                    <style>
                        {`
                            .email-body-preview a {
                                color: #2563eb !important;
                                text-decoration: underline !important;
                            }
                            .email-body-preview strong {
                                font-weight: bold !important;
                            }
                            .email-body-preview em {
                                font-style: italic !important;
                            }
                            .email-body-preview u {
                                text-decoration: underline !important;
                            }
                            .email-body-preview h1 {
                                font-size: 32px !important;
                                font-weight: bold !important;
                                margin: 16px 0 !important;
                                color: #1f2937 !important;
                            }
                            .email-body-preview h2 {
                                font-size: 24px !important;
                                font-weight: bold !important;
                                margin: 14px 0 !important;
                                color: #374151 !important;
                            }
                            .email-body-preview h3 {
                                font-size: 20px !important;
                                font-weight: bold !important;
                                margin: 12px 0 !important;
                                color: #4b5563 !important;
                            }
                            .email-body-preview ul, .email-body-preview ol {
                                margin: 12px 0 !important;
                                padding-left: 20px !important;
                            }
                            .email-body-preview li {
                                margin: 4px 0 !important;
                            }
                            .email-body-preview hr {
                                border: none !important;
                                border-top: 1px solid #e5e7eb !important;
                                margin: 20px 0 !important;
                            }                            .email-body-preview img {
                                max-width: 100% !important;
                                height: auto !important;
                                margin: 12px 0 !important;
                            }                            .email-body-preview table {
                                width: 100% !important;
                                border-collapse: collapse !important;
                                margin: 16px 0 !important;
                                font-family: Arial, sans-serif !important;
                                font-size: 14px !important;
                                line-height: 1.5 !important;
                            }
                            .email-body-preview th, .email-body-preview td {
                                border: 1px solid #d1d5db !important;
                                padding: 12px !important;
                                text-align: left !important;
                                vertical-align: top !important;
                            }
                            .email-body-preview th {
                                background-color: #f3f4f6 !important;
                                font-weight: bold !important;
                            }
                            .email-body-preview thead {
                                background-color: #f3f4f6 !important;
                            }
                            .email-body-preview tbody tr:nth-child(even) {
                                background-color: #fafafa !important;
                            }
                        `}
                    </style>
                </div>

                {/* Email Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center text-sm text-gray-500">
                        <p className="mb-2">
                            Este email fue enviado desde <strong>SmartClass</strong>
                        </p>
                        <p>
                            © 2025 SmartClass. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
