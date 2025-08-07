import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import type { Element } from '../types';

type ViewportType = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_SIZES = {
  desktop: { width: 1200, height: 800, label: 'Desktop' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  mobile: { width: 375, height: 667, label: 'Mobile' }
};

const PreviewElement: React.FC<{
  element: Element;
  allElements: Element[];
  parent?: Element | null;
}> = ({ element, allElements, parent = null }) => {
  const children = allElements.filter(el => el.parentId === element.id);

  // coordinates must be RELATIVE to their parent
  const relLeft = parent ? (element.properties.left || 0) - (parent.properties.left || 0) : (element.properties.left || 0);
  const relTop  = parent ? (element.properties.top  || 0) - (parent.properties.top  || 0) : (element.properties.top  || 0);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: relLeft,
    top:  relTop,
    width:  element.properties.width || 'auto',
    height: element.properties.height || 'auto',
    backgroundColor: element.properties.backgroundColor,
    backgroundImage: element.properties.src ? `url(${element.properties.src})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    zIndex: element.properties.zIndex || 1,
    fontSize: element.properties.fontSize || '14px',
    fontFamily: element.properties.fontFamily || 'inherit',
    color: element.properties.color || 'inherit',
    fontWeight: element.properties.fontWeight || 'normal',
    textAlign: (element.properties.textAlign as any) || 'left',
    border: element.properties.border || 'none',
    borderRadius: element.properties.borderRadius || '0',
    padding: element.properties.padding || '0',
    margin: element.properties.margin || '0',
  };

  return (
    <div style={style}>
      {element.type === 'text'   && element.properties.content}
      {element.type === 'button' && element.properties.text}
      {element.type === 'image'  && element.properties.src && (
        <img 
          src={element.properties.src} 
          alt={element.properties.alt || ''} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {children.map(child => (
        <PreviewElement
          key={child.id}
          element={child}
          allElements={allElements}
          parent={element}
        />
      ))}
    </div>
  );
};

interface PreviewPage {
  id: string;
  title: string;
  elements: Element[];
  background?: {
    color?: string;
    image?: string;
  };
}

interface PreviewData {
  title: string;
  description?: string;
  pages: PreviewPage[];
  currentPageIndex: number;
}

export const PreviewPage: React.FC = () => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load preview data from localStorage or URL params
  useEffect(() => {
    try {
      // Try to get data from localStorage first
      const storedData = localStorage.getItem('preview-data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setPreviewData(parsed);
        setCurrentSlideIndex(parsed.currentPageIndex || 0);
        setIsLoading(false);
        return;
      }

      // Fallback: try to get from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const dataParam = urlParams.get('data');
      if (dataParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(dataParam));
          setPreviewData(decoded);
          setCurrentSlideIndex(decoded.currentPageIndex || 0);
          setIsLoading(false);
          return;
        } catch (e) {
          // console.error('Failed to parse URL data:', e);
        }
      }

      // No data found
      setError('No preview data found. Please open preview from the page builder.');
      setIsLoading(false);
    } catch (error) {
      // console.error('Failed to load preview data:', error);
      setError('Failed to load preview data.');
      setIsLoading(false);
    }
  }, []);

  // Calculate scale and offset for proper centering
  useEffect(() => {
    if (!previewData) return;
    
    const currentPage = previewData.pages[currentSlideIndex];
    if (!currentPage) return;

    const pageElements = currentPage.elements.filter(el => !el.parentId);
    
    if (pageElements.length === 0) return;

    const minX = Math.min(...pageElements.map(el => el.properties.left || 0));
    const minY = Math.min(...pageElements.map(el => el.properties.top || 0));
    const maxX = Math.max(...pageElements.map(el => (el.properties.left || 0) + (typeof el.properties.width === 'number' ? el.properties.width : 200)));
    const maxY = Math.max(...pageElements.map(el => (el.properties.top || 0) + (typeof el.properties.height === 'number' ? el.properties.height : 100)));

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const viewportSize = VIEWPORT_SIZES[viewport];
    const containerPadding = 40;
    const availableWidth = viewportSize.width - containerPadding;
    const availableHeight = viewportSize.height - containerPadding;

    const scaleX = contentWidth > 0 ? availableWidth / contentWidth : 1;
    const scaleY = contentHeight > 0 ? availableHeight / contentHeight : 1;
    const newScale = Math.min(scaleX, scaleY, 1);

    const offsetX = (availableWidth - contentWidth * newScale) / 2 - minX * newScale;
    const offsetY = (availableHeight - contentHeight * newScale) / 2 - minY * newScale;

    setScale(newScale);
    setOffset({ x: offsetX + containerPadding / 2, y: offsetY + containerPadding / 2 });
  }, [previewData, currentSlideIndex, viewport]);

  const nextSlide = () => {
    if (!previewData) return;
    setCurrentSlideIndex(prev => Math.min(prev + 1, previewData.pages.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ExternalLink className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Preview Not Available</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close Preview
          </button>
        </div>
      </div>
    );
  }

  const pages = previewData.pages || [];
  const currentPage = pages[currentSlideIndex];
  
  // Get elements for current page
  const pageElements = currentPage?.elements.filter(el => !el.parentId) || [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">Vista Previa</h1>
          {previewData.title && (
            <span className="text-sm text-gray-500">
              {previewData.title}
            </span>
          )}
          {currentPage && (
            <span className="text-sm text-gray-500">
              - {currentPage.title || `Página ${currentSlideIndex + 1}`}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Viewport Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {(Object.keys(VIEWPORT_SIZES) as ViewportType[]).map((type) => {
              const Icon = type === 'desktop' ? Monitor : type === 'tablet' ? Tablet : Smartphone;
              return (
                <button
                  key={type}
                  onClick={() => setViewport(type)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewport === type
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{VIEWPORT_SIZES[type].label}</span>
                </button>
              );
            })}
          </div>

          {/* Scale indicator */}
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {Math.round(scale * 100)}%
          </span>

          {/* Close button */}
          <button
            onClick={() => window.close()}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        {/* Navigation buttons */}
        {pages.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={nextSlide}
              disabled={currentSlideIndex >= pages.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-4">
          <div
            style={{
              position: 'relative',
              width: VIEWPORT_SIZES[viewport].width,
              height: VIEWPORT_SIZES[viewport].height,
              backgroundColor: currentPage?.background?.color || '#ffffff',
              backgroundImage: currentPage?.background?.image ? `url(${currentPage.background.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ position: 'absolute', left: offset.x, top: offset.y }}>
              {pageElements.map(el => (
                <PreviewElement 
                  key={el.id} 
                  element={el} 
                  allElements={currentPage?.elements || []} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide counter */}
        {pages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
            {currentSlideIndex + 1} / {pages.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
