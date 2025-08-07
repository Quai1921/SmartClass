import React, { useState, useRef } from 'react';

interface EmailPlaceholder {
    key: string;
    description: string;
}

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    placeholders?: EmailPlaceholder[];
}

interface LinkModalData {
    url: string;
    text: string;
}

interface ImageModalData {
    url: string;
    alt: string;
}

interface TableModalData {
    rows: number;
    columns: number;
    hasHeader: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
    value, 
    onChange, 
    placeholder = "Contenido del email",
    rows = 8,
    placeholders = []
}) => {    const [isPreviewMode, setIsPreviewMode] = useState(false);    const [showTokenDropdown, setShowTokenDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [showBgColorModal, setShowBgColorModal] = useState(false);
    const [linkData, setLinkData] = useState<LinkModalData>({ url: '', text: '' });
    const [imageData, setImageData] = useState<ImageModalData>({ url: '', alt: '' });
    const [tableData, setTableData] = useState<TableModalData>({ rows: 3, columns: 3, hasHeader: true });
    const [colorData, setColorData] = useState('');
    const [bgColorData, setBgColorData] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tokenButtonRef = useRef<HTMLDivElement>(null);    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                tokenButtonRef.current && !tokenButtonRef.current.contains(event.target as Node)) {
                setShowTokenDropdown(false);
            }
        };        const handleScroll = (event: Event) => {
            if (showTokenDropdown) {
                // Don't close if scrolling within the dropdown itself
                if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
                    return;
                }
                // Close dropdown if scrolling outside of it
                setShowTokenDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [showTokenDropdown]);

    const updateDropdownPosition = () => {
        if (tokenButtonRef.current) {
            const rect = tokenButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
    };

    const toggleTokenDropdown = () => {
        if (!showTokenDropdown) {
            updateDropdownPosition();
        }
        setShowTokenDropdown(!showTokenDropdown);
    };// Handle text formatting
    const formatText = (tag: string, colorValue?: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        
        let formattedText = '';
        
        switch (tag) {
            case 'bold':
                formattedText = selectedText ? `<strong>${selectedText}</strong>` : '<strong></strong>';
                break;
            case 'italic':
                formattedText = selectedText ? `<em>${selectedText}</em>` : '<em></em>';
                break;
            case 'underline':
                formattedText = selectedText ? `<u>${selectedText}</u>` : '<u></u>';
                break;            case 'color':
                formattedText = selectedText ? `<span style="color: ${colorValue}">${selectedText}</span>` : `<span style="color: ${colorValue}"></span>`;
                break;
            case 'backgroundColor':
                formattedText = selectedText ? `<span style="background-color: ${colorValue}">${selectedText}</span>` : `<span style="background-color: ${colorValue}"></span>`;
                break;
            case 'align-left':
                formattedText = selectedText ? `<div style="text-align: left">${selectedText}</div>` : '<div style="text-align: left"></div>';
                break;
            case 'align-center':
                formattedText = selectedText ? `<div style="text-align: center">${selectedText}</div>` : '<div style="text-align: center"></div>';
                break;
            case 'align-right':
                formattedText = selectedText ? `<div style="text-align: right">${selectedText}</div>` : '<div style="text-align: right"></div>';
                break;
            case 'p':
                formattedText = selectedText ? `<p>${selectedText}</p>` : '<p></p>';
                break;
            case 'h1':
                formattedText = selectedText ? `<h1 style="font-size: 32px; font-weight: bold; margin: 16px 0;">${selectedText}</h1>` : '<h1 style="font-size: 32px; font-weight: bold; margin: 16px 0;"></h1>';
                break;
            case 'h2':
                formattedText = selectedText ? `<h2 style="font-size: 24px; font-weight: bold; margin: 14px 0;">${selectedText}</h2>` : '<h2 style="font-size: 24px; font-weight: bold; margin: 14px 0;"></h2>';
                break;
            case 'h3':
                formattedText = selectedText ? `<h3 style="font-size: 20px; font-weight: bold; margin: 12px 0;">${selectedText}</h3>` : '<h3 style="font-size: 20px; font-weight: bold; margin: 12px 0;"></h3>';
                break;
            case 'ul':
                formattedText = selectedText ? `<ul style="margin: 12px 0; padding-left: 20px;">\n<li>${selectedText}</li>\n</ul>` : '<ul style="margin: 12px 0; padding-left: 20px;">\n<li></li>\n</ul>';
                break;
            case 'ol':
                formattedText = selectedText ? `<ol style="margin: 12px 0; padding-left: 20px;">\n<li>${selectedText}</li>\n</ol>` : '<ol style="margin: 12px 0; padding-left: 20px;">\n<li></li>\n</ol>';
                break;
            case 'br':
                formattedText = '<br>';
                break;
            case 'hr':
                formattedText = '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">';
                break;
            default:
                return;
        }

        const newValue = value.substring(0, start) + formattedText + value.substring(end);
        onChange(newValue);

        // Set cursor position after formatting
        setTimeout(() => {
            if (selectedText) {
                textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
            } else {
                const tagLength = formattedText.includes('><') ? formattedText.indexOf('><') + 1 : formattedText.length / 2;
                textarea.setSelectionRange(start + tagLength, start + tagLength);
            }
            textarea.focus();
        }, 0);
    };    const insertLink = () => {
        setLinkData({ url: '', text: '' });
        setShowLinkModal(true);
    };    const handleLinkSubmit = () => {
        const textarea = textareaRef.current;
        if (!textarea || !linkData.url) return;

        const start = textarea.selectionStart;
        const linkText = linkData.text || linkData.url;
        
        // Add proper spacing around links
        const beforeText = value.substring(0, start);
        const afterText = value.substring(textarea.selectionEnd);
        const needsSpaceBefore = beforeText.length > 0 && !beforeText.endsWith(' ') && !beforeText.endsWith('\n');
        const needsSpaceAfter = afterText.length > 0 && !afterText.startsWith(' ') && !afterText.startsWith('\n');
        
        const linkHtml = `${needsSpaceBefore ? ' ' : ''}<a href="${linkData.url}" style="color: #2563eb; text-decoration: underline;">${linkText}</a>${needsSpaceAfter ? ' ' : ''}`;
        
        const newValue = beforeText + linkHtml + afterText;
        onChange(newValue);

        setTimeout(() => {
            textarea.setSelectionRange(start + linkHtml.length, start + linkHtml.length);
            textarea.focus();
        }, 0);

        setShowLinkModal(false);
        setLinkData({ url: '', text: '' });
    };    const insertImage = () => {
        setImageData({ url: '', alt: '' });
        setShowImageModal(true);
    };

    const insertTable = () => {
        setTableData({ rows: 3, columns: 3, hasHeader: true });
        setShowTableModal(true);
    };const handleImageSubmit = () => {
        const textarea = textareaRef.current;
        if (!textarea || !imageData.url) return;

        const start = textarea.selectionStart;
        
        // Add proper line breaks around images
        const beforeText = value.substring(0, start);
        const afterText = value.substring(textarea.selectionEnd);
        const needsLineBreakBefore = beforeText.length > 0 && !beforeText.endsWith('\n');
        const needsLineBreakAfter = afterText.length > 0 && !afterText.startsWith('\n');
        
        const imageHtml = `${needsLineBreakBefore ? '\n' : ''}<img src="${imageData.url}" alt="${imageData.alt}" style="max-width: 100%; height: auto; margin: 12px 0;">${needsLineBreakAfter ? '\n' : ''}`;
        
        const newValue = beforeText + imageHtml + afterText;
        onChange(newValue);        setTimeout(() => {
            textarea.setSelectionRange(start + imageHtml.length, start + imageHtml.length);
            textarea.focus();
        }, 0);

        setShowImageModal(false);
        setImageData({ url: '', alt: '' });
    };const changeTextColor = () => {
        setColorData('#000000');
        setShowColorModal(true);
    };

    const changeBackgroundColor = () => {
        setBgColorData('#ffff00');
        setShowBgColorModal(true);
    };

    const handleColorSubmit = () => {
        if (!colorData) return;
        formatText('color', colorData);
        setShowColorModal(false);
        setColorData('');
    };    const handleBgColorSubmit = () => {
        if (!bgColorData) return;
        formatText('backgroundColor', bgColorData);
        setShowBgColorModal(false);
        setBgColorData('');
    };    const generateEmailSafeTable = (rows: number, columns: number, hasHeader: boolean): string => {
        // Generate email-safe table with inline styles and proper formatting
        const headerStyle = 'background-color: #f3f4f6; font-weight: bold; text-align: left; padding: 12px; border: 1px solid #d1d5db; vertical-align: top;';
        const cellStyle = 'padding: 12px; border: 1px solid #d1d5db; text-align: left; vertical-align: top;';
        const tableStyle = 'width: 100%; border-collapse: collapse; margin: 16px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;';
        
        let tableHtml = `\n<table style="${tableStyle}">\n`;
        
        // Add header row if requested
        if (hasHeader) {
            tableHtml += '  <thead>\n    <tr>\n';
            for (let j = 0; j < columns; j++) {
                tableHtml += `      <th style="${headerStyle}">Cabecera ${j + 1}</th>\n`;
            }
            tableHtml += '    </tr>\n  </thead>\n';
        }
        
        // Add data rows
        const dataRows = hasHeader ? rows - 1 : rows;
        if (dataRows > 0) {
            tableHtml += '  <tbody>\n';
            for (let i = 0; i < dataRows; i++) {
                tableHtml += '    <tr>\n';
                for (let j = 0; j < columns; j++) {
                    tableHtml += `      <td style="${cellStyle}">Celda ${i + 1}-${j + 1}</td>\n`;
                }
                tableHtml += '    </tr>\n';
            }
            tableHtml += '  </tbody>\n';
        }
        
        tableHtml += '</table>\n';
        return tableHtml;
    };    const handleTableSubmit = () => {
        const textarea = textareaRef.current;
        if (!textarea || tableData.rows < 1 || tableData.columns < 1) return;

        const start = textarea.selectionStart;
        
        // Add proper line breaks around tables
        const beforeText = value.substring(0, start);
        const afterText = value.substring(textarea.selectionEnd);
        const needsLineBreakBefore = beforeText.length > 0 && !beforeText.endsWith('\n') && !beforeText.endsWith('\n\n');
        const needsLineBreakAfter = afterText.length > 0 && !afterText.startsWith('\n') && !afterText.startsWith('\n\n');
        
        const tableHtml = generateEmailSafeTable(tableData.rows, tableData.columns, tableData.hasHeader);
        const formattedTable = `${needsLineBreakBefore ? '\n' : ''}${tableHtml}${needsLineBreakAfter ? '\n' : ''}`;
        
        const newValue = beforeText + formattedTable + afterText;
        onChange(newValue);

        setTimeout(() => {
            textarea.setSelectionRange(start + formattedTable.length, start + formattedTable.length);
            textarea.focus();
        }, 0);

        setShowTableModal(false);
        setTableData({ rows: 3, columns: 3, hasHeader: true });
    };

    const insertToken = (placeholder: EmailPlaceholder) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const placeholderText = `{{${placeholder.key}}}`;
        
        const newValue = value.substring(0, start) + placeholderText + value.substring(textarea.selectionEnd);
        onChange(newValue);

        setTimeout(() => {
            textarea.setSelectionRange(start + placeholderText.length, start + placeholderText.length);
            textarea.focus();
        }, 0);
        
        setShowTokenDropdown(false);
    };

    // Process HTML for preview display
    const processHtmlForDisplay = (html: string): string => {
        return html
            .replace(/\n/g, '<br>')
            .replace(/<p><\/p>/g, '<p><br></p>');
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-1 flex-wrap">
                {/* Text Formatting */}
                <div className="flex items-center gap-1 mr-4">
                    <button
                        type="button"
                        onClick={() => formatText('bold')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Negrita"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h3.5a3.5 3.5 0 110 7H6v2h4a3 3 0 110 6H6a1 1 0 01-1-1V4zm2 6h2.5a1.5 1.5 0 000-3H7v3zm0 2v3h3a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('italic')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Cursiva"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 5a1 1 0 011 1v1.5a.5.5 0 001 0V6a1 1 0 112 0v1.5a2.5 2.5 0 01-2.5 2.5h-1a.5.5 0 000 1h1A2.5 2.5 0 0012 13.5V15a1 1 0 11-2 0v-1.5a.5.5 0 00-1 0V15a1 1 0 01-2 0v-1.5A2.5 2.5 0 019.5 11h1a.5.5 0 000-1h-1A2.5 2.5 0 017 7.5V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('underline')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Subrayado"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 19h14v-2H3v2zm2-4h10v-2H5v2zm0-4h10V9H5v2zm0-6v2h10V5H5z"/>
                        </svg>
                    </button>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1 mr-4">
                    <button
                        type="button"
                        onClick={changeTextColor}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Color de texto"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                        </svg>
                    </button>                    <button
                        type="button"
                        onClick={changeBackgroundColor}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Color de fondo"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4zm2 2v8h8V6H6zm2 2h4v4H8V8z" clipRule="evenodd"/>
                        </svg>
                    </button>
                </div>

                {/* Text Alignment */}
                <div className="flex items-center gap-1 mr-4">
                    <button
                        type="button"
                        onClick={() => formatText('align-left')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Alinear izquierda"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('align-center')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Centrar"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm2 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm-2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm2 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('align-right')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Alinear derecha"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17 4a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1zm0 4a1 1 0 01-1 1H8a1 1 0 110-2h8a1 1 0 011 1zm0 4a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1zm0 4a1 1 0 01-1 1H8a1 1 0 110-2h8a1 1 0 011 1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Headers */}
                <div className="flex items-center gap-1 mr-4">
                    <button
                        type="button"
                        onClick={() => formatText('h1')}
                        className="px-2 py-1 text-sm font-semibold rounded hover:bg-gray-200 transition-colors"
                        title="Título 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('h2')}
                        className="px-2 py-1 text-sm font-semibold rounded hover:bg-gray-200 transition-colors"
                        title="Título 2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('h3')}
                        className="px-2 py-1 text-sm font-semibold rounded hover:bg-gray-200 transition-colors"
                        title="Título 3"
                    >
                        H3
                    </button>
                </div>

                {/* Paragraphs and Lists */}
                <div className="flex items-center gap-1 mr-4">
                    <button
                        type="button"
                        onClick={() => formatText('p')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Párrafo"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('ul')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Lista con viñetas"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zM6 4a1 1 0 011-1h9a1 1 0 110 2H7a1 1 0 01-1-1zm-3 6a1 1 0 100 2h.01a1 1 0 100-2H3zm3 0a1 1 0 011-1h9a1 1 0 110 2H7a1 1 0 01-1-1zm-3 6a1 1 0 100 2h.01a1 1 0 100-2H3zm3 0a1 1 0 011-1h9a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => formatText('ol')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Lista numerada"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>                {/* Links and Media */}
                <div className="flex items-center gap-1 mr-4">
                    <button
                        type="button"
                        onClick={insertLink}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Insertar enlace"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={insertImage}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Insertar imagen"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </button>                    <button
                        type="button"
                        onClick={() => formatText('hr')}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Línea horizontal"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={insertTable}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Insertar tabla"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 100-2H3zm2 2h10v2H5V5zm0 4h4v2H5V9zm6 0h4v2h-4V9zm-6 4h4v2H5v-2zm6 0h4v2h-4v-2z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>{/* Tokens Dropdown */}                {placeholders.length > 0 && (
                    <div ref={tokenButtonRef} className="relative flex items-center gap-1 mr-4">                        <button
                            type="button"
                            onClick={toggleTokenDropdown}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition-colors"
                            title="Insertar token"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                          {showTokenDropdown && (                            <div 
                                ref={dropdownRef} 
                                className="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] max-h-64 overflow-y-auto"
                                style={{
                                    width: '288px',
                                    top: `${dropdownPosition.top}px`,
                                    left: `${dropdownPosition.left}px`
                                }}
                            >
                                {placeholders.map((placeholder) => (
                                    <button
                                        key={placeholder.key}
                                        type="button"
                                        onClick={() => insertToken(placeholder)}
                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-mono text-sm text-blue-600 font-medium">
                                            {`{{${placeholder.key}}}`}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {placeholder.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}{/* Preview Toggle */}
                <div className="flex items-center gap-1 ml-auto">
                    <button
                        type="button"
                        onClick={() => setIsPreviewMode(false)}
                        className={`px-3 py-1 text-sm rounded-l-lg transition-colors border ${
                            !isPreviewMode 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                    >
                        Editar
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreviewMode(true)}
                        className={`px-3 py-1 text-sm rounded-r-lg transition-colors border border-l-0 ${
                            isPreviewMode 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                    >
                        Vista Previa
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="relative">                {isPreviewMode ? (
                    /* Preview Mode */
                    <div 
                        className="p-4 min-h-[200px] bg-white"
                        style={{ minHeight: `${rows * 24}px` }}
                    >                        <div 
                            className="max-w-none"
                            dangerouslySetInnerHTML={{ 
                                __html: processHtmlForDisplay(value || '<p style="color: #999; font-style: italic;">Sin contenido para mostrar</p>') 
                            }}
                            style={{
                                lineHeight: '1.6',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '14px',
                                color: '#333'
                            }}
                        />
                        <style>
                            {`
                                .max-w-none a {
                                    color: #2563eb !important;
                                    text-decoration: underline !important;
                                }
                                .max-w-none strong {
                                    font-weight: bold !important;
                                }
                                .max-w-none em {
                                    font-style: italic !important;
                                }
                                .max-w-none u {
                                    text-decoration: underline !important;
                                }
                                .max-w-none h1 {
                                    font-size: 32px !important;
                                    font-weight: bold !important;
                                    margin: 16px 0 !important;
                                    color: #1f2937 !important;
                                }
                                .max-w-none h2 {
                                    font-size: 24px !important;
                                    font-weight: bold !important;
                                    margin: 14px 0 !important;
                                    color: #374151 !important;
                                }
                                .max-w-none h3 {
                                    font-size: 20px !important;
                                    font-weight: bold !important;
                                    margin: 12px 0 !important;
                                    color: #4b5563 !important;
                                }
                                .max-w-none ul, .max-w-none ol {
                                    margin: 12px 0 !important;
                                    padding-left: 20px !important;
                                }
                                .max-w-none li {
                                    margin: 4px 0 !important;
                                }
                                .max-w-none hr {
                                    border: none !important;
                                    border-top: 1px solid #e5e7eb !important;
                                    margin: 20px 0 !important;
                                }
                                .max-w-none img {
                                    max-width: 100% !important;
                                    height: auto !important;
                                    margin: 12px 0 !important;
                                }
                            `}
                        </style>
                    </div>
                ) : (
                    /* Edit Mode */
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={rows}
                        className="w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none border-0"
                        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                    />
                )}
            </div>            {/* Helper Text */}
            <div className="bg-gray-50 border-t border-gray-300 px-3 py-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                    <span>Usa HTML para formatear tu contenido</span>
                    <span>{value.length} caracteres</span>
                </div>
            </div>            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg font-semibold">🔗 Insertar Enlace</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL del enlace *
                                </label>
                                <input
                                    type="url"
                                    value={linkData.url}
                                    onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                                    placeholder="https://ejemplo.com"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del enlace
                                </label>
                                <input
                                    type="text"
                                    value={linkData.text}
                                    onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                                    placeholder="Texto que aparecerá como enlace"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Si está vacío, se usará la URL como texto</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLinkModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleLinkSubmit}
                                disabled={!linkData.url}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Insertar Enlace
                            </button>
                        </div>
                    </div>
                </div>
            )}            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg font-semibold">🖼️ Insertar Imagen</h3>
                        </div>                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar imagen
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setImageData({ ...imageData, url: event.target?.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">O introduce una URL directamente</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL de la imagen
                                </label>
                                <input
                                    type="url"
                                    value={imageData.url}
                                    onChange={(e) => setImageData({ ...imageData, url: e.target.value })}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto alternativo
                                </label>
                                <input
                                    type="text"
                                    value={imageData.alt}
                                    onChange={(e) => setImageData({ ...imageData, alt: e.target.value })}
                                    placeholder="Descripción de la imagen (para accesibilidad)"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Opcional, pero recomendado para accesibilidad</p>
                            </div>
                            {imageData.url && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vista previa
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <img 
                                            src={imageData.url} 
                                            alt={imageData.alt || "Vista previa"} 
                                            className="max-w-full h-auto max-h-32 mx-auto"
                                            onError={() => setImageData({ ...imageData, url: '' })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleImageSubmit}
                                disabled={!imageData.url}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Insertar Imagen
                            </button>
                        </div>                    </div>
                </div>
            )}            {/* Text Color Modal */}
            {showColorModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg font-semibold">🎨 Color de Texto</h3>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color *
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={colorData}
                                    onChange={(e) => setColorData(e.target.value)}
                                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={colorData}
                                    onChange={(e) => setColorData(e.target.value)}
                                    placeholder="#000000"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Puedes usar hex (#000000), rgb(0,0,0) o nombres de colores</p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
                            <button
                                onClick={() => setShowColorModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleColorSubmit}
                                disabled={!colorData}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Aplicar Color
                            </button>
                        </div>
                    </div>
                </div>
            )}            {/* Background Color Modal */}
            {showBgColorModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg font-semibold">🎨 Color de Fondo</h3>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color de fondo *
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={bgColorData}
                                    onChange={(e) => setBgColorData(e.target.value)}
                                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={bgColorData}
                                    onChange={(e) => setBgColorData(e.target.value)}
                                    placeholder="#ffff00"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Puedes usar hex (#ffff00), rgb(255,255,0) o nombres de colores</p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
                            <button
                                onClick={() => setShowBgColorModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleBgColorSubmit}
                                disabled={!bgColorData}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Aplicar Color
                            </button>
                        </div>
                    </div>
                </div>            )}

            {/* Table Modal */}
            {showTableModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[200]">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
                            <h3 className="text-lg font-semibold">📊 Insertar Tabla</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de filas *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={tableData.rows}
                                    onChange={(e) => setTableData({ ...tableData, rows: parseInt(e.target.value) || 1 })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de columnas *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={tableData.columns}
                                    onChange={(e) => setTableData({ ...tableData, columns: parseInt(e.target.value) || 1 })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="hasHeader"
                                    checked={tableData.hasHeader}
                                    onChange={(e) => setTableData({ ...tableData, hasHeader: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="hasHeader" className="ml-2 block text-sm text-gray-700">
                                    Incluir fila de cabeceras
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                La tabla se insertará con estilos optimizados para clientes de email
                            </p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
                            <button
                                onClick={() => setShowTableModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleTableSubmit}
                                disabled={tableData.rows < 1 || tableData.columns < 1}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Insertar Tabla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
