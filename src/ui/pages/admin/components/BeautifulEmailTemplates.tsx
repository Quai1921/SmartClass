import React from 'react';

export interface BeautifulTemplate {
    id: string;
    name: string;
    description: string;
    subject: string;
    body: string;
    preview: string;
    category: 'welcome' | 'notification' | 'reminder' | 'announcement' | 'general';
}

export const beautifulTemplates: BeautifulTemplate[] = [
    {
        id: 'welcome-student',
        name: 'Bienvenida Estudiante',
        description: 'Template moderno de bienvenida para nuevos estudiantes',
        category: 'welcome',
        subject: '¡Bienvenido a {{institutionName}}! 🎓',
        preview: '/api/placeholder/400/200',        body: `
            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333333;">
                <tr>
                    <td align="center" style="padding-bottom: 30px;">
                        <h1 style="color: #2563eb; margin: 0 0 10px 0; font-size: 28px;">¡Bienvenido a SmartClass!</h1>
                        <table width="60" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height: 4px; background-color: #2563eb;"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 20px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0;">Hola <strong>{{firstName}}</strong>,</p>
                        
                        <p style="margin: 0 0 20px 0;">¡Nos complace darte la bienvenida a <strong>{{institutionName}}</strong>! Estás a punto de comenzar una experiencia educativa increíble.</p>
                        
                        <table width="100%" cellpadding="25" cellspacing="0" style="background-color: #667eea; margin: 25px 0;">
                            <tr>
                                <td align="center" style="color: white;">
                                    <h2 style="color: white; margin: 0 0 15px 0; font-size: 20px;">🚀 Tu aventura comienza ahora</h2>
                                    <p style="margin: 0; color: #f0f0f0;">Prepárate para aprender, crecer y alcanzar tus metas académicas</p>
                                </td>
                            </tr>
                        </table>
                        
                        <h3 style="color: #374151; margin: 25px 0 15px 0;">¿Qué sigue?</h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 15px 0;">
                            <tr>
                                <td style="padding: 12px; background-color: #f8fafc; border-left: 4px solid #2563eb;">
                                    📚 <strong>Explora tus cursos:</strong> Revisa el material disponible
                                </td>
                            </tr>
                            <tr><td style="height: 10px;"></td></tr>
                            <tr>
                                <td style="padding: 12px; background-color: #f8fafc; border-left: 4px solid #10b981;">
                                    👥 <strong>Conecta con compañeros:</strong> Únete a las discusiones
                                </td>
                            </tr>
                            <tr><td style="height: 10px;"></td></tr>
                            <tr>
                                <td style="padding: 12px; background-color: #f8fafc; border-left: 4px solid #f59e0b;">
                                    🎯 <strong>Establece objetivos:</strong> Define tus metas académicas
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                                <td align="center">
                                    <table cellpadding="15" cellspacing="0" style="background-color: #2563eb;">
                                        <tr>
                                            <td>
                                                <a href="https://smartclass.com/dashboard" style="color: white; text-decoration: none; font-weight: bold;">
                                                    🎓 Acceder a mi Dashboard
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0 0; font-style: italic; color: #6b7280;">¡Estamos aquí para apoyarte en cada paso del camino!</p>
                    </td>
                </tr>
            </table>
        `
    },
    {
        id: 'grade-notification',
        name: 'Notificación de Calificación',
        description: 'Template elegante para notificar calificaciones',
        category: 'notification',
        subject: '📊 Nueva calificación disponible - {{courseName}}',
        preview: '/api/placeholder/400/200',        body: `
            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333333;">
                <tr>
                    <td align="center" style="padding-bottom: 30px;">
                        <table cellpadding="15" cellspacing="0" style="background-color: #10b981; margin-bottom: 15px;">
                            <tr>
                                <td align="center" style="color: white; font-size: 24px;">📊</td>
                            </tr>
                        </table>
                        <h1 style="color: #1f2937; margin: 0;">Nueva Calificación</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 20px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0;">Hola <strong>{{firstName}}</strong>,</p>
                        
                        <p style="margin: 0 0 20px 0;">Tu profesor ha publicado una nueva calificación para el curso <strong>{{courseName}}</strong>.</p>
                        
                        <table width="100%" cellpadding="25" cellspacing="0" style="background-color: white; border: 2px solid #e5e7eb; margin: 25px 0;">
                            <tr>
                                <td>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="color: #6b7280; font-size: 14px; padding-bottom: 15px;">CALIFICACIÓN</td>
                                            <td align="right" style="padding-bottom: 15px;">
                                                <table cellpadding="8" cellspacing="0" style="background-color: #10b981;">
                                                    <tr>
                                                        <td style="color: white; font-weight: bold; font-size: 18px;">{{gradeScore}}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                                                <div style="margin-bottom: 10px;"><strong>Curso:</strong> {{courseName}}</div>
                                                <div style="margin-bottom: 10px;"><strong>Evaluación:</strong> {{assignmentName}}</div>
                                                <div><strong>Profesor:</strong> {{teacherName}}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #3b82f6; margin: 25px 0;">
                            <tr>
                                <td align="center" style="color: white;">
                                    <p style="margin: 0; font-size: 16px;">💡 <strong>¡Sigue así!</strong> Tu dedicación está dando frutos.</p>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                                <td align="center">
                                    <table cellpadding="12" cellspacing="0" style="background-color: #1f2937;">
                                        <tr>
                                            <td>
                                                <a href="https://smartclass.com/grades" style="color: white; text-decoration: none; font-weight: bold;">
                                                    Ver Todas las Calificaciones
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `
    },
    {
        id: 'assignment-reminder',
        name: 'Recordatorio de Tarea',
        description: 'Template llamativo para recordar tareas pendientes',
        category: 'reminder',
        subject: '⏰ Recordatorio: {{assignmentName}} - Vence {{dueDate}}',
        preview: '/api/placeholder/400/200',        body: `
            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333333;">
                <tr>
                    <td align="center" style="padding-bottom: 30px;">
                        <table cellpadding="15" cellspacing="0" style="background-color: #f59e0b; margin-bottom: 15px;">
                            <tr>
                                <td align="center" style="color: white; font-size: 24px;">⏰</td>
                            </tr>
                        </table>
                        <h1 style="color: #dc2626; margin: 0;">¡No olvides tu tarea!</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 20px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0;">Hola <strong>{{firstName}}</strong>,</p>
                        
                        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #fef3c7; border-left: 5px solid #f59e0b; margin: 20px 0;">
                            <tr>
                                <td style="color: #92400e;">
                                    <p style="margin: 0;"><strong>📝 Tienes una tarea pendiente que vence pronto</strong></p>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="25" cellspacing="0" style="background-color: white; border: 2px solid #e5e7eb; margin: 25px 0;">
                            <tr>
                                <td>
                                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📋 Detalles de la Tarea</h3>
                                    <div style="margin-bottom: 12px;">
                                        <strong style="color: #374151;">Tarea:</strong> 
                                        <span style="color: #1f2937;">{{assignmentName}}</span>
                                    </div>
                                    <div style="margin-bottom: 12px;">
                                        <strong style="color: #374151;">Curso:</strong> 
                                        <span style="color: #1f2937;">{{courseName}}</span>
                                    </div>
                                    <div style="margin-bottom: 12px;">
                                        <strong style="color: #374151;">Profesor:</strong> 
                                        <span style="color: #1f2937;">{{teacherName}}</span>
                                    </div>
                                    <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #fee2e2;">
                                        <tr>
                                            <td align="center" style="color: #dc2626; font-weight: bold;">
                                                🔥 Fecha límite: {{dueDate}}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                                <td align="center">
                                    <table cellpadding="15" cellspacing="0" style="background-color: #dc2626;">
                                        <tr>
                                            <td>
                                                <a href="https://smartclass.com/assignments" style="color: white; text-decoration: none; font-weight: bold;">
                                                    📚 Ver Tarea Completa
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="font-style: italic; color: #6b7280; text-align: center; margin: 0;">💪 ¡Tú puedes hacerlo! Organiza tu tiempo y entrega a tiempo.</p>
                    </td>
                </tr>
            </table>
        `
    },
    {
        id: 'event-announcement',
        name: 'Anuncio de Evento',
        description: 'Template festivo para anunciar eventos escolares',
        category: 'announcement',
        subject: '🎉 ¡Evento especial! {{eventName}} - {{date}}',
        preview: '/api/placeholder/400/200',        body: `
            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333333;">
                <tr>
                    <td align="center" style="background-color: #7c3aed; padding: 30px; margin-bottom: 30px;">
                        <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
                        <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px;">¡Evento Especial!</h1>
                        <p style="margin: 0; color: #e9d5ff; font-size: 16px;">Te invitamos a participar</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 20px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0;">Estimado <strong>{{firstName}}</strong>,</p>
                        
                        <p style="margin: 0 0 20px 0;">Nos complace invitarte a un evento especial que hemos organizado para toda la comunidad educativa.</p>
                        
                        <table width="100%" cellpadding="30" cellspacing="0" style="background-color: white; border: 3px solid #7c3aed; margin: 30px 0; position: relative;">
                            <tr>
                                <td align="right" style="background-color: #fbbf24; color: #92400e; font-weight: bold; font-size: 12px; padding: 8px 20px;">
                                    ¡IMPERDIBLE!
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h2 style="color: #7c3aed; margin: 0 0 20px 0; font-size: 24px;">{{eventName}}</h2>
                                    
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <table cellpadding="8" cellspacing="0" style="background-color: #ede9fe;">
                                                    <tr>
                                                        <td align="center" style="color: #7c3aed; width: 40px;">📅</td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td style="padding: 8px 10px;">
                                                <strong>Fecha:</strong> {{date}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <table cellpadding="8" cellspacing="0" style="background-color: #ede9fe;">
                                                    <tr>
                                                        <td align="center" style="color: #7c3aed; width: 40px;">🕐</td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td style="padding: 8px 10px;">
                                                <strong>Hora:</strong> {{time}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <table cellpadding="8" cellspacing="0" style="background-color: #ede9fe;">
                                                    <tr>
                                                        <td align="center" style="color: #7c3aed; width: 40px;">📍</td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td style="padding: 8px 10px;">
                                                <strong>Lugar:</strong> {{location}}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #10b981; margin: 25px 0;">
                            <tr>
                                <td align="center" style="color: white;">
                                    <h3 style="color: white; margin: 0 0 10px 0;">🌟 ¿Por qué asistir?</h3>
                                    <p style="margin: 0; color: #d1fae5;">Una oportunidad única para aprender, conectar y disfrutar junto a toda la comunidad educativa.</p>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                                <td align="center">
                                    <table cellpadding="15" cellspacing="0" style="background-color: #7c3aed;">
                                        <tr>
                                            <td>
                                                <a href="https://smartclass.com/events" style="color: white; text-decoration: none; font-weight: bold;">
                                                    🎟️ Confirmar Asistencia
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="text-align: center; font-style: italic; color: #6b7280; margin: 0;">¡Te esperamos! Será un evento memorable para todos. 🎊</p>
                    </td>
                </tr>
            </table>
        `
    },
    {
        id: 'password-reset',
        name: 'Restablecimiento de Contraseña',
        description: 'Template seguro para restablecer contraseñas',
        category: 'general',
        subject: '🔐 Restablece tu contraseña - SmartClass',
        preview: '/api/placeholder/400/200',        body: `
            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333333;">
                <tr>
                    <td align="center" style="padding-bottom: 30px;">
                        <table cellpadding="15" cellspacing="0" style="background-color: #ef4444; margin-bottom: 15px;">
                            <tr>
                                <td align="center" style="color: white; font-size: 24px;">🔐</td>
                            </tr>
                        </table>
                        <h1 style="color: #1f2937; margin: 0;">Restablecimiento de Contraseña</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 20px;">
                        <p style="font-size: 16px; margin: 0 0 20px 0;">Hola <strong>{{firstName}}</strong>,</p>
                        
                        <p style="margin: 0 0 20px 0;">Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>{{institutionName}}</strong>.</p>
                        
                        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #fef2f2; border-left: 4px solid #ef4444; margin: 25px 0;">
                            <tr>
                                <td style="color: #b91c1c;">
                                    <p style="margin: 0;"><strong>⚠️ Importante:</strong> Si no solicitaste este cambio, puedes ignorar este email.</p>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="25" cellspacing="0" style="background-color: white; border: 2px solid #e5e7eb; margin: 25px 0;">
                            <tr>
                                <td align="center">
                                    <h3 style="color: #374151; margin: 0 0 15px 0;">🔑 Para restablecer tu contraseña:</h3>
                                    <p style="margin: 0 0 20px 0; color: #6b7280;">Haz clic en el botón de abajo y sigue las instrucciones</p>
                                    
                                    <table cellpadding="15" cellspacing="0" style="background-color: #ef4444; margin: 0 0 20px 0;">
                                        <tr>
                                            <td>
                                                <a href="{{resetUrl}}" style="color: white; text-decoration: none; font-weight: bold;">
                                                    🔐 Restablecer Contraseña
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">Este enlace expira en 24 horas por seguridad</p>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #f0f9ff; border: 1px solid #0ea5e9; margin: 25px 0;">
                            <tr>
                                <td>
                                    <h4 style="color: #0c4a6e; margin: 0 0 10px 0;">💡 Consejos de seguridad:</h4>
                                    <ul style="margin: 0; padding-left: 20px; color: #0369a1;">
                                        <li>Usa una contraseña única y segura</li>
                                        <li>Combina letras, números y símbolos</li>
                                        <li>No compartas tu contraseña con nadie</li>
                                    </ul>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="font-size: 14px; color: #6b7280; margin: 30px 0 10px 0;">Si tienes problemas con el enlace, copia y pega esta URL en tu navegador:</p>
                        <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9fafb; margin: 0;">
                            <tr>
                                <td style="font-size: 12px; color: #9ca3af; word-break: break-all;">{{resetUrl}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `
    },
    {
        id: 'parent-progress',
        name: 'Reporte de Progreso para Padres',
        description: 'Template informativo para reportes de progreso estudiantil',
        category: 'notification',
        subject: '📈 Reporte de Progreso - {{firstName}} {{lastName}}',
        preview: '/api/placeholder/400/200',
        body: `
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 15px; border-radius: 50%; margin-bottom: 15px;">
                    <span style="font-size: 24px;">📈</span>
                </div>
                <h1 style="color: #1f2937; margin: 0;">Reporte de Progreso Académico</h1>
            </div>
            
            <p style="font-size: 16px;">Estimado/a <strong>{{parentName}}</strong>,</p>
            
            <p>Le compartimos el reporte de progreso académico de <strong>{{firstName}} {{lastName}}</strong> correspondiente al período actual.</p>
            
            <div style="background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
                <h2 style="color: white; margin: 0 0 10px 0;">🌟 Resumen General</h2>
                <p style="margin: 0; opacity: 0.9; font-size: 18px;">{{firstName}} está mostrando un excelente progreso</p>
            </div>
            
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #374151; margin: 0 0 20px 0;">📊 Calificaciones por Materia</h3>
                
                <div style="margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #374151;">Matemáticas</span>
                        <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold;">8.5</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #374151;">Ciencias</span>
                        <span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold;">9.0</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #374151;">Literatura</span>
                        <span style="background: #8b5cf6; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold;">7.8</span>
                    </div>
                </div>
            </div>
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="color: #065f46; margin: 0 0 15px 0;">✨ Aspectos Destacados</h4>
                <ul style="margin: 0; padding-left: 20px; color: #047857;">
                    <li style="margin-bottom: 8px;">Excelente participación en clase</li>
                    <li style="margin-bottom: 8px;">Entrega puntual de tareas</li>
                    <li style="margin-bottom: 8px;">Trabajo colaborativo excepcional</li>
                    <li>Actitud positiva hacia el aprendizaje</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://smartclass.com/parent-portal" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);">
                    📋 Ver Reporte Completo
                </a>
            </div>
            
            <p style="font-style: italic; color: #6b7280; text-align: center;">Gracias por su apoyo continuo en la educación de {{firstName}}. 👨‍👩‍👧‍👦</p>
        `
    }
];

interface BeautifulEmailTemplatesProps {
    onTemplateSelect: (template: BeautifulTemplate) => void;
    isVisible: boolean;
    onClose: () => void;
}

export const BeautifulEmailTemplates: React.FC<BeautifulEmailTemplatesProps> = ({
    onTemplateSelect,
    isVisible,
    onClose
}) => {
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
    
    const categories = [
        { id: 'all', name: 'Todos', icon: '📧' },
        { id: 'welcome', name: 'Bienvenida', icon: '🎓' },
        { id: 'notification', name: 'Notificaciones', icon: '🔔' },
        { id: 'reminder', name: 'Recordatorios', icon: '⏰' },
        { id: 'announcement', name: 'Anuncios', icon: '📢' },
        { id: 'general', name: 'General', icon: '📄' }
    ];
    
    const filteredTemplates = selectedCategory === 'all' 
        ? beautifulTemplates 
        : beautifulTemplates.filter(t => t.category === selectedCategory);
    
    if (!isVisible) return null;    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">{/* Header */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                ✨ Plantillas Hermosas
                                <span className="text-yellow-300">🎨</span>
                            </h2>
                            <p className="opacity-90">Selecciona una plantilla profesional para tu email</p>
                        </div>                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 hover:scale-110 p-2 rounded-full transition-all duration-200 ease-in-out"
                            title="Cerrar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Categories */}
                <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex gap-2 overflow-x-auto">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border-2 border-blue-300'
                                        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                                }`}
                            >
                                <span className="text-lg">{category.icon}</span>
                                <span className="font-medium">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                  {/* Templates Grid */}
                <div className="p-6 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white hover:scale-105 hover:border-transparent overflow-hidden"
                                onClick={() => {
                                    onTemplateSelect(template);
                                    onClose();
                                }}
                            >
                                {/* Colorful header bar based on category */}
                                <div className={`h-2 ${
                                    template.category === 'welcome' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                    template.category === 'notification' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    template.category === 'reminder' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                    template.category === 'announcement' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                    'bg-gradient-to-r from-gray-500 to-slate-500'
                                }`}></div>
                                
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                                            {template.name}
                                        </h3>
                                        <span className={`text-lg p-2 rounded-full ${
                                            template.category === 'welcome' ? 'bg-blue-100' :
                                            template.category === 'notification' ? 'bg-yellow-100' :
                                            template.category === 'reminder' ? 'bg-purple-100' :
                                            template.category === 'announcement' ? 'bg-green-100' :
                                            'bg-gray-100'
                                        }`}>
                                            {categories.find(c => c.id === template.category)?.icon}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                        {template.description}
                                    </p>
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border text-xs text-gray-700 mb-4">
                                        <strong className="text-blue-700">Asunto:</strong> 
                                        <span className="ml-1">{template.subject}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Plantilla profesional
                                        </span>
                                        <button className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                                            template.category === 'welcome' ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700' :
                                            template.category === 'notification' ? 'text-orange-600 hover:bg-orange-50 hover:text-orange-700' :
                                            template.category === 'reminder' ? 'text-purple-600 hover:bg-purple-50 hover:text-purple-700' :
                                            template.category === 'announcement' ? 'text-green-600 hover:bg-green-50 hover:text-green-700' :
                                            'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                                        }`}>
                                            Usar plantilla →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
