import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  // debug log


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
  };

  return (
    <div style={style}>
      {element.type === 'text'   && element.properties.content}
      {element.type === 'button' && element.properties.text}
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

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { course, elements, currentPage, currentSlideIndex, nextSlide, prevSlide } = useBuilder();
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const pages = course?.pages || [];
  const computedPages = React.useMemo(
    () => pages.map((p: any) => (p.id === currentPage?.id ? { ...p, elements } : p)),
    [pages, currentPage, elements]
  );
  const pageData = computedPages[currentSlideIndex];

  // Get all elements and filter top-level ones
  const allElements = pageData?.elements || [];
  const topLevelElements = allElements.filter((el: any) => !el.parentId);

  // Function to open preview in new window
  const openInNewWindow = () => {
    // Prepare data for standalone preview
    const previewData = {
      title: course?.title || 'Untitled Course',
      description: course?.description,
      pages: computedPages.map((page: any) => ({
        id: page.id,
        title: page.title || `Page ${computedPages.indexOf(page) + 1}`,
        elements: page.elements || [],
        background: page.background
      })),
      currentPageIndex: currentSlideIndex
    };

    // Store data in localStorage for the new window to access
    localStorage.setItem('preview-data', JSON.stringify(previewData));

    // Open new window with preview page
    const previewWindow = window.open('/preview', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
    
    if (!previewWindow) {
      alert('Please allow pop-ups to open the preview in a new window.');
    }
  };

  // Calculate scale and offset for proper centering
  useEffect(() => {
    if (!isOpen || topLevelElements.length === 0) return;

    const minX = Math.min(...topLevelElements.map((el: any) => el.properties.left || 0));
    const minY = Math.min(...topLevelElements.map((el: any) => el.properties.top || 0));
    const maxX = Math.max(...topLevelElements.map((el: any) => (el.properties.left || 0) + (typeof el.properties.width === 'number' ? el.properties.width : 200)));
    const maxY = Math.max(...topLevelElements.map((el: any) => (el.properties.top || 0) + (typeof el.properties.height === 'number' ? el.properties.height : 100)));

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const viewportWidth = VIEWPORT_SIZES[viewport].width;
    const viewportHeight = VIEWPORT_SIZES[viewport].height;

    const padding = 80;
    const availableWidth = viewportWidth - padding * 2;
    const availableHeight = viewportHeight - padding * 2;

    const scaleFactor = Math.min(availableWidth / contentWidth, availableHeight / contentHeight, 1);

    const offsetX = (viewportWidth - contentWidth * scaleFactor) / 2 - minX * scaleFactor;
    const offsetY = (viewportHeight - contentHeight * scaleFactor) / 2 - minY * scaleFactor;

    setScale(scaleFactor);
    setOffset({ x: offsetX, y: offsetY });
  }, [isOpen, topLevelElements, viewport]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000]">
      <div className="relative bg-gray-100 rounded-xl shadow-2xl w-[95vw] h-[95vh] max-w-7xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Vista Previa</h2>
            
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
          </div>

          <div className="flex items-center space-x-2">
            {/* Open in new window button */}
            <button 
              onClick={openInNewWindow}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              title="Open preview in new window"
            >
              <ExternalLink size={16} />
              <span>New Window</span>
            </button>
            
            {/* Scale indicator */}
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {Math.round(scale * 100)}%
            </span>
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={20} />
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
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div
              style={{
                position: 'relative',
                width: VIEWPORT_SIZES[viewport].width,
                height: VIEWPORT_SIZES[viewport].height,
                backgroundColor: pageData?.background?.color || '#ffffff',
                backgroundImage: pageData?.background?.image ? `url(${pageData.background.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ position: 'absolute', left: offset.x, top: offset.y }}>
                {topLevelElements.map((el: any) => (
                  <PreviewElement key={el.id} element={el} allElements={allElements} />
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
    </div>
  );
};
