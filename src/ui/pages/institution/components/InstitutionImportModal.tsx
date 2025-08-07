import React, { useState, useCallback } from 'react';
import { X, Upload, Eye, EyeOff } from 'lucide-react';
import { IconComponent } from '../../admin/components/Icon';

interface CSVPreviewData {
    headers: string[];
    rows: string[][];
    totalRows: number;
    delimiter: string;
}

interface InstitutionImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File, updateExisting: boolean, deleteNotFound: boolean) => void;
    title: string; // "Importar Docentes" or "Importar Estudiantes"
    acceptedFormats?: string;
}

export const InstitutionImportModal: React.FC<InstitutionImportModalProps> = ({
    isOpen,
    onClose,
    onImport,
    title,
    acceptedFormats = ".csv,.xlsx"
}) => {    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [updateExisting, setUpdateExisting] = useState(false);
    const [deleteNotFound, setDeleteNotFound] = useState(false);
    const [dragActive, setDragActive] = useState(false);    const [csvPreview, setCsvPreview] = useState<CSVPreviewData | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isParsingFile, setIsParsingFile] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);    // CSV parsing function with better handling and auto-delimiter detection
    const parseCSV = useCallback((file: File): Promise<CSVPreviewData> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    
                    // Split by line and filter empty lines
                    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
                    
                    if (lines.length === 0) {
                        reject(new Error('El archivo está vacío'));
                        return;
                    }

                    // Auto-detect delimiter by checking the first line
                    const detectDelimiter = (line: string): string => {
                        const delimiters = [';', ',', '\t', '|'];
                        const counts = delimiters.map(delimiter => 
                            (line.match(new RegExp(`\\${delimiter}`, 'g')) || []).length
                        );
                        const maxCount = Math.max(...counts);
                        const delimiterIndex = counts.indexOf(maxCount);
                        return maxCount > 0 ? delimiters[delimiterIndex] : ',';
                    };

                    const delimiter = detectDelimiter(lines[0]);

                    // Enhanced CSV parser that handles quoted fields and different delimiters
                    const parseCSVLine = (line: string, delimiter: string): string[] => {
                        const result: string[] = [];
                        let current = '';
                        let inQuotes = false;
                        
                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            
                            if (char === '"') {
                                inQuotes = !inQuotes;
                            } else if (char === delimiter && !inQuotes) {
                                result.push(current.trim().replace(/^"|"$/g, ''));
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        
                        result.push(current.trim().replace(/^"|"$/g, ''));
                        return result;
                    };

                    // Parse headers (first line)
                    const headers = parseCSVLine(lines[0], delimiter);
                    
                    // Parse rows (limit to first 10 for preview)
                    const rows = lines.slice(1, Math.min(11, lines.length)).map(line => {
                        const cells = parseCSVLine(line, delimiter);
                        // Ensure all rows have the same number of columns as headers
                        while (cells.length < headers.length) {
                            cells.push('');
                        }
                        return cells.slice(0, headers.length);
                    });                    resolve({
                        headers,
                        rows,
                        totalRows: lines.length - 1, // excluding header
                        delimiter
                    });
                } catch (error) {
                    reject(new Error('Error al parsear el archivo CSV'));
                }
            };
            
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file, 'UTF-8');
        });
    }, []);const handleFileSelect = useCallback(async (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            setParseError(null);
            
            // Parse CSV for preview if it's a CSV file
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                setIsParsingFile(true);
                try {
                    const preview = await parseCSV(file);
                    setCsvPreview(preview);
                    setShowPreview(true);
                } catch (error) {
                    // console.error('Error parsing CSV:', error);
                    setParseError(error instanceof Error ? error.message : 'Error desconocido al parsear el archivo');
                    setCsvPreview(null);
                    setShowPreview(false);
                } finally {
                    setIsParsingFile(false);
                }
            } else {
                setCsvPreview(null);
                setShowPreview(false);
            }
        }
    }, [parseCSV]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFileSelect(e.dataTransfer.files);
        }
    }, [handleFileSelect]);

    const handleImport = useCallback(() => {
        if (selectedFile) {
            onImport(selectedFile, updateExisting, deleteNotFound);
            onClose();
            setSelectedFile(null);
            setUpdateExisting(false);
            setDeleteNotFound(false);
            setCsvPreview(null);
            setShowPreview(false);
        }
    }, [selectedFile, updateExisting, deleteNotFound, onImport, onClose]);    const handleClose = useCallback(() => {
        onClose();
        setSelectedFile(null);
        setUpdateExisting(false);
        setDeleteNotFound(false);
        setDragActive(false);
        setCsvPreview(null);
        setShowPreview(false);
        setParseError(null);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50"></div>
            <div className="fixed inset-0 backdrop-blur-sm z-50"></div>            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <IconComponent name="UploadIcon" size={16} color="#16a34a" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* File Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar archivo:
                            </label>
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                                    dragActive
                                        ? 'border-blue-400 bg-blue-50'
                                        : selectedFile
                                        ? 'border-green-400 bg-green-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept={acceptedFormats}
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">                                        {selectedFile ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <IconComponent name="FileSpreadsheet" size={20} color="#16a34a" />
                                                <span className="text-sm font-medium text-green-700">
                                                    {selectedFile.name}
                                                </span>
                                                {isParsingFile && (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-600">
                                                        Arrastra tu archivo aquí o{' '}
                                                        <span className="text-blue-600 hover:text-blue-500 cursor-pointer">
                                                            haz clic para seleccionar
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Formatos soportados: CSV, Excel
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>                            </div>

                            {/* Parse Error */}
                            {parseError && (
                                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex">
                                        <IconComponent name="Bell" size={16} color="#dc2626" />
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">
                                                <strong>Error al procesar el archivo:</strong> {parseError}
                                            </p>
                                            <p className="text-xs text-red-600 mt-1">
                                                Verifica que el archivo tenga el formato CSV correcto con separadores de coma.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CSV Preview */}
                            {csvPreview && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Vista previa del archivo:
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            {showPreview ? (
                                                <>
                                                    <EyeOff className="w-4 h-4" />
                                                    Ocultar
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-4 h-4" />
                                                    Mostrar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {showPreview && (                                        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                                            <div className="mb-2 text-sm text-gray-600 flex items-center justify-between">
                                                <span>Mostrando las primeras 10 filas de {csvPreview.totalRows} registros totales</span>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    Separador: {csvPreview.delimiter === ';' ? 'Punto y coma (;)' : 
                                                              csvPreview.delimiter === ',' ? 'Coma (,)' : 
                                                              csvPreview.delimiter === '\t' ? 'Tabulador' : 
                                                              csvPreview.delimiter === '|' ? 'Barra vertical (|)' : csvPreview.delimiter}
                                                </span>
                                            </div>
                                            <div className="overflow-x-auto max-h-64 overflow-y-auto">
                                                <table className="min-w-full text-sm">
                                                    <thead className="bg-gray-100 sticky top-0">
                                                        <tr>
                                                            {csvPreview.headers.map((header, index) => (
                                                                <th
                                                                    key={index}
                                                                    className="px-3 py-2 border border-gray-300 text-left font-medium text-gray-700"
                                                                >
                                                                    {header}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {csvPreview.rows.map((row, rowIndex) => (
                                                            <tr key={rowIndex} className="even:bg-gray-50">
                                                                {row.map((cell, cellIndex) => (
                                                                    <td
                                                                        key={cellIndex}
                                                                        className="px-3 py-2 border border-gray-300 text-gray-700"
                                                                    >
                                                                        {cell || '-'}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        {/* Import Options */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Opciones de importación:
                            </label>
                            
                            <div className="flex items-center">
                                <input
                                    id="updateExisting"
                                    type="checkbox"
                                    checked={updateExisting}
                                    onChange={(e) => setUpdateExisting(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="updateExisting" className="ml-2 block text-sm text-gray-700">
                                    Actualizar registros existentes
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="deleteNotFound"
                                    type="checkbox"
                                    checked={deleteNotFound}
                                    onChange={(e) => setDeleteNotFound(e.target.checked)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="deleteNotFound" className="ml-2 block text-sm text-gray-700">
                                    Eliminar registros no encontrados en el archivo
                                </label>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <div className="flex">
                                <IconComponent name="Bell" size={16} color="#d97706" />
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-800">
                                        Asegúrate de que el archivo tenga el formato correcto antes de importar.
                                        Esta acción puede modificar o eliminar datos existentes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>                        <button
                            onClick={handleImport}
                            disabled={!selectedFile || isParsingFile || !!parseError}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <IconComponent name="UploadIcon" size={16} color="#ffffff" />
                            {isParsingFile ? 'Procesando...' : 'Importar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
