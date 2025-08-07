import React, { useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { IconComponent } from './Icon';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File, updateExisting: boolean, deleteNotFound: boolean) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
    isOpen,
    onClose,
    onImport,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [updateExisting, setUpdateExisting] = useState(true);
    const [deleteNotFound, setDeleteNotFound] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File) => {
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            setSelectedFile(file);
        } else {
            alert('Por favor selecciona un archivo CSV válido.');
        }
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, [handleFileSelect]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    }, [handleFileSelect]);

    const handleImport = useCallback(() => {
        if (!selectedFile) {
            alert('Por favor selecciona un archivo CSV.');
            return;
        }
        
        onImport(selectedFile, updateExisting, deleteNotFound);
        setSelectedFile(null);
        onClose();
    }, [selectedFile, updateExisting, deleteNotFound, onImport, onClose]);

    const openFileDialog = useCallback(() => {
        fileInputRef.current?.click();
    }, []);    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50"></div>
            <div className="fixed inset-0 backdrop-blur-sm z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-xl relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <IconComponent name="UploadIcon" size={16} color="#16a34a" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Importar Usuarios
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                <div className="space-y-6">                    {/* File Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Archivo CSV:
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragActive
                                    ? 'border-blue-400 bg-blue-50'
                                    : selectedFile
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {selectedFile ? (
                                <div className="text-green-600">
                                    <IconComponent name="FileSpreadsheet" size={48} color="#16a34a" />
                                    <p className="mt-3 text-sm font-medium">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <IconComponent name="UploadIcon" size={48} color="#9ca3af" />
                                    <p className="mt-3 text-sm text-gray-600">
                                        Arrastra y suelta tu archivo CSV aquí, o{' '}
                                        <button
                                            type="button"
                                            onClick={openFileDialog}
                                            className="text-blue-600 hover:text-blue-500 underline"
                                        >
                                            selecciona archivo
                                        </button>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Solo archivos CSV (máx. 10MB)
                                    </p>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                    </div>

                    {/* Import Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Opciones de importación:
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={updateExisting}
                                    onChange={(e) => setUpdateExisting(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Actualizar usuarios existentes
                                </span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={deleteNotFound}
                                    onChange={(e) => setDeleteNotFound(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Eliminar usuarios no encontrados en el archivo
                                </span>
                            </label>
                        </div>
                    </div>                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div>
                            <h3 className="text-sm font-semibold text-blue-800 mb-2">
                                Formato del archivo CSV
                            </h3>
                            <div className="text-sm text-blue-700">
                                <p className="mb-2">El archivo debe contener las siguientes columnas:</p>
                                <ul className="space-y-1">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        <strong>email</strong> (obligatorio)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        <strong>firstName</strong>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        <strong>lastName</strong>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        <strong>role</strong> (TUTOR, INSTITUTION_ADMIN, ADMIN)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        <strong>status</strong> (ACTIVE, INACTIVE, PENDING)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <IconComponent name="UploadIcon" size={16} color="#ffffff" />
                        Importar
                    </button>
                </div>
                </div>
            </div>
        </>
    );
};
