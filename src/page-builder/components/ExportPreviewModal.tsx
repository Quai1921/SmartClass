import React, { useState, useEffect } from 'react';
import { X, FileDown, FolderOpen, Image, Music, Video, Container, Eye, EyeOff } from 'lucide-react';

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExport: () => void;
  projectData: any;
  onCancel: () => void;
}

export const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirmExport,
  projectData,
  onCancel
}) => {
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    elements: false,
    mediaFiles: false,
    metadata: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen || !projectData) return null;

  const mediaFiles = projectData.mediaFiles || {};
  const elements = projectData.elements || [];
  const metadata = projectData.exportMetadata || {};

  // Count different types of media
  const mediaCounts = {
    images: Object.keys(mediaFiles).filter(k => k.includes('image')).length,
    audio: Object.keys(mediaFiles).filter(k => k.includes('audio')).length,
    videos: Object.keys(mediaFiles).filter(k => k.includes('video')).length
  };

  // Calculate actual media presence (override metadata if needed)
  const totalMediaFiles = Object.keys(mediaFiles).length;
  const hasActualMediaFiles = totalMediaFiles > 0;

  // Debug logging


  // Count different types of elements
  const elementCounts = elements.reduce((acc: { [key: string]: number }, element: any) => {
    const type = element.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const formatFileSize = (exportData: any) => {
    if (!exportData) return '0 KB';
    
    // Handle new export data format
    if (typeof exportData === 'object') {
      let bytes = 0;
      
      switch (exportData.type) {
        case 'server-reference':
          bytes = exportData.metadata?.size || 0;
          break;
        case 'base64-embedded':
          if (exportData.base64) {
            bytes = (exportData.base64.length * 3) / 4;
          }
          break;
        case 'reference-only':
          return 'N/A';
        default:
          // Legacy format support
          if (exportData.base64) {
            bytes = (exportData.base64.length * 3) / 4;
          } else if (exportData.size) {
            bytes = exportData.size;
          }
      }
      
      if (bytes < 1024) return `${bytes.toFixed(0)} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    
    // Legacy format (just base64 string)
    if (typeof exportData === 'string') {
      const bytes = (exportData.length * 3) / 4;
      if (bytes < 1024) return `${bytes.toFixed(0)} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    
    return '0 KB';
  };

  const totalSize = Object.values(mediaFiles).reduce((total: number, exportData: any) => {
    if (typeof exportData === 'object') {
      switch (exportData.type) {
        case 'server-reference':
          return total + (exportData.metadata?.size || 0);
        case 'base64-embedded':
          return total + (exportData.base64 ? (exportData.base64.length * 3) / 4 : 0);
        default:
          // Legacy format support
          return total + (exportData.base64 ? (exportData.base64.length * 3) / 4 : (exportData.size || 0));
      }
    }
    if (typeof exportData === 'string') {
      return total + ((exportData.length * 3) / 4);
    }
    return total;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" style={{ zIndex: 1000000, position: 'relative' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Vista Previa de Exportación</h2>
            <p className="text-blue-100 text-sm">{projectData.title || 'Proyecto Sin Título'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            style={{ zIndex: 1000001 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Summary Section */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileDown size={20} className="text-blue-600" />
              Resumen del Proyecto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Container size={20} className="text-blue-600" />
                  <span className="font-medium text-blue-800">Elementos</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{elements.length}</div>
                <div className="text-sm text-blue-600 mt-1">
                  {Object.entries(elementCounts).map(([type, count]) => (
                    <span key={type} className="inline-block mr-2">
                      {String(type)}: {String(count)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Image size={20} className="text-green-600" />
                  <span className="font-medium text-green-800">Archivos Multimedia</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{totalMediaFiles}</div>
                <div className="text-sm text-green-600 mt-1">
                  <div className="flex items-center gap-3">
                    {mediaCounts.images > 0 && (
                      <span className="flex items-center gap-1">
                        <Image size={12} /> {mediaCounts.images}
                      </span>
                    )}
                    {mediaCounts.audio > 0 && (
                      <span className="flex items-center gap-1">
                        <Music size={12} /> {mediaCounts.audio}
                      </span>
                    )}
                    {mediaCounts.videos > 0 && (
                      <span className="flex items-center gap-1">
                        <Video size={12} /> {mediaCounts.videos}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen size={20} className="text-purple-600" />
                  <span className="font-medium text-purple-800">Tamaño Total</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {totalSize < 1024 ? `${totalSize.toFixed(0)} B` :
                   totalSize < 1024 * 1024 ? `${(totalSize / 1024).toFixed(1)} KB` :
                   `${(totalSize / (1024 * 1024)).toFixed(1)} MB`}
                </div>
                <div className="text-sm text-purple-600 mt-1">
                  {hasActualMediaFiles ? 'Con archivos embebidos' : 'Solo datos del proyecto'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="p-6 space-y-4">
            {/* Elements Section */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('elements')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Container size={20} className="text-blue-600" />
                  <span className="font-medium">Elementos del Proyecto ({elements.length})</span>
                </div>
                {expandedSections.elements ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              
              {expandedSections.elements && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {elements.map((element: any, index: number) => (
                      <div key={element.id || index} className="bg-white p-3 rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          {element.type === 'image' && <Image size={16} className="text-blue-500" />}
                          {element.type === 'audio' && <Music size={16} className="text-green-500" />}
                          {element.type === 'video' && <Video size={16} className="text-red-500" />}
                          {element.type === 'container' && <Container size={16} className="text-purple-500" />}
                          <span className="font-medium text-sm">{element.type}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div>ID: {element.id?.substring(0, 8)}...</div>
                          {element.name && <div>Nombre: {element.name}</div>}
                          {element.properties?.src && (
                            <div>Fuente: {element.properties.src.substring(0, 30)}...</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Media Files Section */}
            {totalMediaFiles > 0 && (
              <div className="border rounded-lg">
                <button
                  onClick={() => toggleSection('mediaFiles')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Image size={20} className="text-green-600" />
                    <span className="font-medium">Archivos Multimedia Embebidos ({totalMediaFiles})</span>
                  </div>
                  {expandedSections.mediaFiles ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                
                {expandedSections.mediaFiles && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="space-y-2">
                      {Object.entries(mediaFiles).map(([key, exportData]: [string, any]) => (
                        <div key={key} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {key.includes('image') && <Image size={16} className="text-blue-500" />}
                              {key.includes('audio') && <Music size={16} className="text-green-500" />}
                              {key.includes('video') && <Video size={16} className="text-red-500" />}
                              <span className="font-medium text-sm">{key}</span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {formatFileSize(exportData)}
                            </span>
                          </div>
                          
                          {/* Show export type and details */}
                          {typeof exportData === 'object' && (
                            <div className="mt-2 text-xs text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Tipo:</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  exportData.type === 'server-reference' ? 'bg-green-100 text-green-700' :
                                  exportData.type === 'base64-embedded' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {exportData.type === 'server-reference' ? '☁️ Servidor' :
                                   exportData.type === 'base64-embedded' ? '📄 Embebido' :
                                   '🔗 Solo Referencia'}
                                </span>
                              </div>
                              
                              {exportData.type === 'server-reference' && exportData.bucketPath && (
                                <div className="bg-green-50 p-2 rounded">
                                  <div><span className="font-medium">📁 Ruta:</span> {exportData.bucketPath}</div>
                                  {exportData.metadata?.filename && (
                                    <div><span className="font-medium">📄 Archivo:</span> {exportData.metadata.filename}</div>
                                  )}
                                  {exportData.serverUrl && (
                                    <div><span className="font-medium">🌐 Servidor:</span> {exportData.serverUrl}</div>
                                  )}
                                </div>
                              )}
                              
                              {exportData.type === 'base64-embedded' && (
                                <div className="bg-blue-50 p-2 rounded">
                                  <div><span className="font-medium">📊 Base64:</span> {exportData.base64?.length || 0} caracteres</div>
                                  {exportData.reason && (
                                    <div><span className="font-medium">💡 Razón:</span> {exportData.reason}</div>
                                  )}
                                </div>
                              )}
                              
                              {exportData.type === 'reference-only' && (
                                <div className="bg-yellow-50 p-2 rounded">
                                  <div><span className="font-medium">⚠️ URL:</span> {exportData.originalSrc?.substring(0, 50)}...</div>
                                  {exportData.error && (
                                    <div><span className="font-medium text-red-600">❌ Error:</span> {exportData.error}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Metadata Section */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('metadata')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileDown size={20} className="text-purple-600" />
                  <span className="font-medium">Metadatos de Exportación</span>
                </div>
                {expandedSections.metadata ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              
              {expandedSections.metadata && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Fecha de Exportación:</span>
                      <div className="text-gray-600">
                        {metadata.exportedAt ? new Date(metadata.exportedAt).toLocaleString('es-ES') : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Versión:</span>
                      <div className="text-gray-600">{metadata.version || '1.0.0'}</div>
                    </div>
                    <div>
                      <span className="font-medium">Archivos Multimedia:</span>
                      <div className="text-gray-600">{totalMediaFiles}</div>
                    </div>
                    <div>
                      <span className="font-medium">Contiene Media:</span>
                      <div className="text-gray-600">{hasActualMediaFiles ? 'Sí' : 'No'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* JSON Preview Toggle */}
            <div className="border rounded-lg">
              <button
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileDown size={20} className="text-gray-600" />
                  <span className="font-medium">Vista Previa JSON</span>
                </div>
                {showJsonPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              
              {showJsonPreview && (
                <div className="border-t p-4 bg-gray-900">
                  <pre className="text-green-400 text-xs overflow-auto max-h-60 font-mono">
                    {JSON.stringify({
                      ...projectData,
                      mediaFiles: Object.keys(projectData.mediaFiles || {}).reduce((acc: any, key) => {
                        acc[key] = `[Base64 data - ${projectData.mediaFiles[key]?.length || 0} characters]`;
                        return acc;
                      }, {})
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-4 flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-600">
            El archivo se descargará como: <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              {projectData.title || 'proyecto'}-enhanced.json
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmExport}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileDown size={16} />
              Exportar Proyecto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
