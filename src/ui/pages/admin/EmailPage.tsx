import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmailTemplates, type EmailTemplate } from '../../../actions/email/get-email-templates';
import { getEmailPlaceholders } from '../../../actions/email/get-email-placeholders';
import { sendEmail, type SendEmailRequest } from '../../../actions/email/send-email';
import { createEmailTemplate } from '../../../actions/email/create-email-template';
import CustomButton from '../../components/CustomButton';
import { useNotificationStore } from '../../store/notification/useNotificationStore';
import { StorageAdapter, type SentEmail } from '../../../config/adapters/storage-adapter';
import { HeaderAdmin } from './components/HeaderAdmin';
import { EmailPreview } from './components/EmailPreview';
import { RichTextEditor } from './components/RichTextEditor';
import { BeautifulEmailTemplates, type BeautifulTemplate } from './components/BeautifulEmailTemplates';

export const EmailComponent: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [recipients, setRecipients] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [showCreateTemplate, setShowCreateTemplate] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newTemplateSubject, setNewTemplateSubject] = useState('');    const [newTemplateBody, setNewTemplateBody] = useState('');
    const [activeTab, setActiveTab] = useState<'compose' | 'preview' | 'sent'>('compose');
    const [sentEmails, setSentEmails] = useState<SentEmail[]>(StorageAdapter.getSentEmails());
    const [showBeautifulTemplates, setShowBeautifulTemplates] = useState(false);

    const { addNotification } = useNotificationStore();
    const queryClient = useQueryClient();

    // Get email templates
    const { data: templates, isLoading: templatesLoading } = useQuery({
        queryKey: ['emailTemplates'],
        queryFn: getEmailTemplates,
    });

    // Get placeholders
    const { data: placeholders } = useQuery({
        queryKey: ['emailPlaceholders'],
        queryFn: getEmailPlaceholders,
    });

    // Send email mutation
    const sendEmailMutation = useMutation({
        mutationFn: sendEmail,
        onSuccess: (_, variables) => {
            // Cache the sent email
            const sentEmail: SentEmail = {
                id: Date.now().toString(),
                to: variables.to,
                subject: variables.subject,
                body: variables.body,
                templateId: variables.templateId,
                templateName: selectedTemplate?.name,
                sentAt: new Date().toISOString(),
                status: 'sent'
            };
            
            StorageAdapter.addSentEmail(sentEmail);
            setSentEmails(StorageAdapter.getSentEmails());
            
            addNotification({
                type: 'message',
                message: 'Email enviado exitosamente',
                position: 'top',
                duration: 3000,
            });
            // Reset form
            setRecipients('');
            setSubject('');
            setBody('');
            setSelectedTemplate(null);
        },
        onError: (error: any, variables) => {
            // Cache the failed email
            const failedEmail: SentEmail = {
                id: Date.now().toString(),
                to: variables.to,
                subject: variables.subject,
                body: variables.body,
                templateId: variables.templateId,
                templateName: selectedTemplate?.name,
                sentAt: new Date().toISOString(),
                status: 'failed'
            };
            
            StorageAdapter.addSentEmail(failedEmail);
            setSentEmails(StorageAdapter.getSentEmails());
            
            addNotification({
                type: 'error',
                message: error.message || 'Error al enviar el email',
                position: 'top',
                duration: 5000,
            });
        },
    });

    // Create template mutation
    const createTemplateMutation = useMutation({
        mutationFn: createEmailTemplate,
        onSuccess: () => {
            addNotification({
                type: 'message',
                message: 'Template creado exitosamente',
                position: 'top',
                duration: 3000,
            });
            queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
            setShowCreateTemplate(false);
            setNewTemplateName('');
            setNewTemplateSubject('');
            setNewTemplateBody('');
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                message: error.message || 'Error al crear el template',
                position: 'top',
                duration: 5000,
            });
        },
    });    // Handle template selection
    const handleTemplateSelect = (template: EmailTemplate) => {
        console.log('handleTemplateSelect called with:', template);
        console.log('Setting subject to:', template.subject);
        console.log('Setting body to:', template.body);
        setSelectedTemplate(template);
        setSubject(template.subject);
        setBody(template.body);
    };    // Handle send test email
    const handleSendTestEmail = () => {
        if (!subject.trim() || !body.trim()) {
            addNotification({
                type: 'error',
                message: 'Por favor complete al menos el asunto y contenido',
                position: 'top',
                duration: 3000,
            });
            return;
        }

        const testEmail = prompt('Ingresa el email de prueba:');
        if (!testEmail || !testEmail.includes('@')) {
            addNotification({
                type: 'error',
                message: 'Por favor ingresa un email válido',
                position: 'top',
                duration: 3000,
            });
            return;
        }

        // Wrap the HTML content in a proper email template for better styling
        const styledBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>[PRUEBA] ${subject}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .test-banner {
                        background-color: #fef3c7;
                        border: 1px solid #f59e0b;
                        color: #92400e;
                        padding: 12px;
                        border-radius: 6px;
                        margin-bottom: 20px;
                        text-align: center;
                        font-weight: bold;
                    }
                    h1 {
                        font-size: 32px !important;
                        font-weight: bold !important;
                        margin: 16px 0 !important;
                        color: #1f2937;
                    }
                    h2 {
                        font-size: 24px !important;
                        font-weight: bold !important;
                        margin: 14px 0 !important;
                        color: #374151;
                    }
                    h3 {
                        font-size: 20px !important;
                        font-weight: bold !important;
                        margin: 12px 0 !important;
                        color: #4b5563;
                    }
                    p {
                        margin: 12px 0;
                    }
                    ul, ol {
                        margin: 12px 0;
                        padding-left: 20px;
                    }
                    li {
                        margin: 4px 0;
                    }
                    a {
                        color: #2563eb;
                        text-decoration: underline;
                    }
                    strong {
                        font-weight: bold;
                    }
                    em {
                        font-style: italic;
                    }
                    u {
                        text-decoration: underline;
                    }
                    hr {
                        border: none;
                        border-top: 1px solid #e5e7eb;
                        margin: 20px 0;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        margin: 12px 0;
                    }
                    .email-footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        font-size: 12px;
                        color: #6b7280;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="test-banner">
                        🧪 ESTE ES UN EMAIL DE PRUEBA - NO REENVIARLO 🧪
                    </div>
                    ${body}
                    <div class="email-footer">
                        <p>Este email fue enviado desde <strong>SmartClass</strong></p>
                        <p>© ${new Date().getFullYear()} SmartClass. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const emailData: SendEmailRequest = {
            to: [testEmail],
            subject: `[PRUEBA] ${subject}`,
            body: styledBody,
            templateId: selectedTemplate?.id,
        };

        sendEmailMutation.mutate(emailData);
    };
    const handleSendEmail = () => {
        if (!recipients.trim() || !subject.trim() || !body.trim()) {
            addNotification({
                type: 'error',
                message: 'Por favor complete todos los campos requeridos',
                position: 'top',
                duration: 3000,
            });
            return;
        }

        // Wrap the HTML content in a proper email template for better styling
        const styledBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        font-size: 32px !important;
                        font-weight: bold !important;
                        margin: 16px 0 !important;
                        color: #1f2937;
                    }
                    h2 {
                        font-size: 24px !important;
                        font-weight: bold !important;
                        margin: 14px 0 !important;
                        color: #374151;
                    }
                    h3 {
                        font-size: 20px !important;
                        font-weight: bold !important;
                        margin: 12px 0 !important;
                        color: #4b5563;
                    }
                    p {
                        margin: 12px 0;
                    }
                    ul, ol {
                        margin: 12px 0;
                        padding-left: 20px;
                    }
                    li {
                        margin: 4px 0;
                    }
                    a {
                        color: #2563eb;
                        text-decoration: underline;
                    }
                    strong {
                        font-weight: bold;
                    }
                    em {
                        font-style: italic;
                    }
                    u {
                        text-decoration: underline;
                    }
                    hr {
                        border: none;
                        border-top: 1px solid #e5e7eb;
                        margin: 20px 0;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        margin: 12px 0;
                    }
                    .email-footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        font-size: 12px;
                        color: #6b7280;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    ${body}
                    <div class="email-footer">
                        <p>Este email fue enviado desde <strong>SmartClass</strong></p>
                        <p>© ${new Date().getFullYear()} SmartClass. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const emailData: SendEmailRequest = {
            to: recipients.split(',').map(email => email.trim()),
            subject,
            body: styledBody,
            templateId: selectedTemplate?.id,
        };

        sendEmailMutation.mutate(emailData);
    };    // Handle create template
    const handleCreateTemplate = () => {
        if (!newTemplateName.trim() || !newTemplateSubject.trim() || !newTemplateBody.trim()) {
            addNotification({
                type: 'error',
                message: 'Por favor complete todos los campos del template',
                position: 'top',
                duration: 3000,
            });
            return;
        }

        // Apply the same email styling to templates
        const styledTemplateBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${newTemplateSubject}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        font-size: 32px !important;
                        font-weight: bold !important;
                        margin: 16px 0 !important;
                        color: #1f2937;
                    }
                    h2 {
                        font-size: 24px !important;
                        font-weight: bold !important;
                        margin: 14px 0 !important;
                        color: #374151;
                    }
                    h3 {
                        font-size: 20px !important;
                        font-weight: bold !important;
                        margin: 12px 0 !important;
                        color: #4b5563;
                    }
                    p {
                        margin: 12px 0;
                    }
                    ul, ol {
                        margin: 12px 0;
                        padding-left: 20px;
                    }
                    li {
                        margin: 4px 0;
                    }
                    a {
                        color: #2563eb;
                        text-decoration: underline;
                    }
                    strong {
                        font-weight: bold;
                    }
                    em {
                        font-style: italic;
                    }
                    u {
                        text-decoration: underline;
                    }
                    hr {
                        border: none;
                        border-top: 1px solid #e5e7eb;
                        margin: 20px 0;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        margin: 12px 0;
                    }
                    .email-footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        font-size: 12px;
                        color: #6b7280;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    ${newTemplateBody}
                    <div class="email-footer">
                        <p>Este email fue enviado desde <strong>SmartClass</strong></p>
                        <p>© ${new Date().getFullYear()} SmartClass. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        `;        createTemplateMutation.mutate({
            name: newTemplateName,
            subject: newTemplateSubject,
            body: styledTemplateBody,
            placeholders: [], // Extract placeholders from body if needed
        });
    };

    // Handle beautiful template selection
    const handleBeautifulTemplateSelect = (template: BeautifulTemplate) => {
        setSelectedTemplate(null); // Clear API template
        setSubject(template.subject);
        setBody(template.body);
        addNotification({
            type: 'message',
            message: `Plantilla "${template.name}" aplicada`,
            position: 'top',
            duration: 3000,
        });
    };

    // Clear sent emails history
    const clearSentEmails = () => {
        StorageAdapter.clearSentEmails();
        setSentEmails([]);
        addNotification({
            type: 'message',
            message: 'Historial de emails eliminado',
            position: 'top',
            duration: 2000,
        });
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };    return (
        <div className="pb-4">
            <HeaderAdmin
                title="Correos"
                subtitle="En esta sección puedes enviar correos masivos y gestionar las plantillas de email."
            />
              {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mt-[38px]">
                <button
                    onClick={() => setActiveTab('compose')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'compose'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Enviar Email
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'preview'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Vista Previa
                </button>
                <button
                    onClick={() => setActiveTab('sent')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'sent'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Emails Enviados ({sentEmails.length})
                </button>
            </div>{/* Compose Tab */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-[30px]">
                    {/* Left Panel - Email Composer */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Enviar Email</h2>
                          {/* Template Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar Template (Opcional)
                            </label>
                            <div className="flex gap-3 mb-3">
                                <select
                                    value={selectedTemplate?.id || ''}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        console.log('Dropdown selection:', selectedValue);
                                        console.log('Available templates:', templates);
                                        
                                        if (selectedValue === '') {
                                            setSelectedTemplate(null);
                                            setSubject('');
                                            setBody('');                                    } else {
                                            const template = templates?.find(t => {
                                                console.log('Comparing:', t.id, 'with', selectedValue, 'types:', typeof t.id, typeof selectedValue);
                                                return String(t.id) === String(selectedValue);
                                            });
                                            console.log('Found template:', template);
                                            if (template) {
                                                console.log('Calling handleTemplateSelect with:', template);
                                                handleTemplateSelect(template);
                                            }
                                        }
                                    }}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">Seleccionar template...</option>
                                    {templates?.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowBeautifulTemplates(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                                    title="Plantillas hermosas"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4v10a1 1 0 11-2 0V4zm14 2H6a1 1 0 00-1 1v8a1 1 0 001 1h11a1 1 0 001-1V7a1 1 0 00-1-1zM6 8h11v6H6V8z" clipRule="evenodd" />
                                    </svg>
                                    ✨ Plantillas
                                </button>
                            </div>
                        </div>

                        {/* Recipients */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Destinatarios (separados por coma) *
                            </label>
                            <input
                                type="text"
                                value={recipients}
                                onChange={(e) => setRecipients(e.target.value)}
                                placeholder="email1@example.com, email2@example.com"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Subject */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Asunto *
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Asunto del email"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>                        {/* Body */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contenido *
                            </label>
                            <RichTextEditor
                                value={body}
                                onChange={setBody}
                                placeholder="Contenido del email"
                                rows={8}
                                placeholders={placeholders}
                            />
                        </div>{/* Action Buttons */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {/* Preview Button */}
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    disabled={!subject && !body}
                                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Vista Previa
                                </button>

                                {/* Test Email Button */}
                                <button
                                    onClick={handleSendTestEmail}
                                    disabled={sendEmailMutation.isPending || (!subject && !body)}
                                    className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-200 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                    </svg>
                                    Enviar Prueba
                                </button>
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSendEmail}
                                disabled={sendEmailMutation.isPending}
                                className="flex items-center justify-center gap-2 bg-surface text-white px-6 py-3 rounded-lg body-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all"
                            >
                                {!sendEmailMutation.isPending && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                                {sendEmailMutation.isPending ? "Enviando..." : "Enviar Email"}
                            </button>
                        </div>
                    </div>                    {/* Right Panel - Templates & Placeholders */}
                    <div className="space-y-8">
                        {/* Templates */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
                                <CustomButton
                                    label="Nuevo Template"
                                    onClick={() => setShowCreateTemplate(!showCreateTemplate)}
                                    icon="Plus"
                                />
                            </div>

                            {showCreateTemplate && (
                                <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
                                    <h4 className="text-base font-medium text-gray-900 mb-4">Crear Nuevo Template</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre del template
                                            </label>
                                            <input
                                                type="text"
                                                value={newTemplateName}
                                                onChange={(e) => setNewTemplateName(e.target.value)}
                                                placeholder="Ej: Bienvenida estudiantes"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Asunto del template
                                            </label>
                                            <input
                                                type="text"
                                                value={newTemplateSubject}
                                                onChange={(e) => setNewTemplateSubject(e.target.value)}
                                                placeholder="Asunto del email"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contenido del template
                                            </label>                                            <RichTextEditor
                                                value={newTemplateBody}
                                                onChange={setNewTemplateBody}
                                                placeholder="Contenido del email"
                                                rows={4}
                                                placeholders={placeholders}
                                            />
                                        </div><div className="flex gap-3 pt-2">
                                            <button
                                                onClick={handleCreateTemplate}
                                                disabled={createTemplateMutation.isPending}
                                                className="flex items-center justify-center gap-2 bg-surface text-white px-4 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all"
                                            >
                                                {!createTemplateMutation.isPending && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                                {createTemplateMutation.isPending ? "Creando..." : "Crear Template"}
                                            </button>
                                            <button
                                                onClick={() => setShowCreateTemplate(false)}
                                                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition-all"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {templatesLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {templates && templates.length > 0 ? (
                                        templates.map((template) => (
                                            <div
                                                key={template.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                    selectedTemplate?.id === template.id
                                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handleTemplateSelect(template)}
                                            >
                                                <h5 className="font-medium text-gray-900 mb-1">{template.name}</h5>
                                                <p className="text-sm text-gray-600 truncate">{template.subject}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-gray-500">                                            <p className="text-sm">No hay templates disponibles</p>
                                            <p className="text-xs mt-1">Crea tu primer template usando el botón superior</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}{/* Sent Emails Tab */}
            {activeTab === 'sent' && (
                <div className="mt-[30px]">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Emails Enviados</h3>                            {sentEmails.length > 0 && (
                                <button
                                    onClick={clearSentEmails}
                                    className="flex items-center justify-center gap-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-red-50 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Limpiar Historial
                                </button>
                            )}
                        </div>

                        {sentEmails.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-medium text-gray-900 mb-2">No hay emails enviados</h3>
                                <p className="text-sm text-gray-500">Los emails que envíes aparecerán aquí</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sentEmails.map((email) => (
                                    <div
                                        key={email.id}
                                        className={`border rounded-lg p-5 transition-all ${
                                            email.status === 'sent' 
                                                ? 'border-green-200 bg-green-50' 
                                                : 'border-red-200 bg-red-50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        email.status === 'sent'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {email.status === 'sent' ? (
                                                            <>
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Enviado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                                Falló
                                                            </>
                                                        )}
                                                    </span>
                                                    {email.templateName && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                            </svg>
                                                            {email.templateName}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-medium text-gray-900 mb-1">{email.subject}</h4>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Para:</span> {email.to.join(', ')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">{formatDate(email.sentAt)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <details className="group">
                                                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 select-none flex items-center">
                                                    <svg className="w-4 h-4 mr-1 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Ver contenido
                                                </summary>
                                                <div className="mt-3 p-4 bg-white rounded-lg border text-sm text-gray-700 max-h-40 overflow-y-auto">
                                                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">{email.body}</pre>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}                    </div>
                </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
                <div className="mt-[30px]">
                    {subject || body ? (
                        <EmailPreview 
                            subject={subject} 
                            body={body} 
                            placeholders={placeholders} 
                        />
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                            <div className="text-center">
                                <div className="mb-4">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenido para previsualizar</h3>
                                <p className="text-gray-500 mb-6">
                                    Selecciona un template o escribe el asunto y cuerpo del email en la pestaña "Enviar Email" para ver la vista previa.
                                </p>
                                <button
                                    onClick={() => setActiveTab('compose')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Ir a Enviar Email
                                </button>
                            </div>
                        </div>
                    )}                </div>
            )}
            
            {/* Beautiful Email Templates Modal */}
            <BeautifulEmailTemplates
                isVisible={showBeautifulTemplates}
                onClose={() => setShowBeautifulTemplates(false)}
                onTemplateSelect={handleBeautifulTemplateSelect}
            />
        </div>
    );
};
