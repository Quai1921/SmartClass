import React, { useEffect, useState } from 'react';
import { PageBuilder } from '../builder/PageBuilderRefactored';

// Error boundary for PageBuilderPage
class PageBuilderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // console.error('PageBuilderPage Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '32px',
          background: '#fee2e2',
          border: '2px solid #fecaca',
          borderRadius: '8px',
          fontSize: '16px',
          color: '#dc2626',
          textAlign: 'center',
          margin: '20px'
        }}>
          <h2>Page Builder Error</h2>
          <p>Something went wrong with the page builder.</p>
          <p>Error: {this.state.error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '8px 16px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const PageBuilderPage: React.FC = () => {
  // 🎯 NEW: More sophisticated loading state that waits for proper module setup
  const [isAutoSelectionComplete, setIsAutoSelectionComplete] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    
    // Handle URL parameters for course context
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const moduleId = urlParams.get('moduleId');
    const action = urlParams.get('action');

    if (courseId) {
      
      // Auto-select module if moduleId is provided in URL (from ModuleManagementPage navigation)
      if (moduleId) {
        
        // 🎯 Listen for both auto-selection completion AND tab readiness
        const handleAutoSelectionComplete = () => {
          setIsAutoSelectionComplete(true);
        };
        
        const handleTabSwitchComplete = () => {
          // Wait a bit more for module state to stabilize
          setTimeout(() => {
            setIsAutoSelectionComplete(true);
          }, 1000);
        };
        
        window.addEventListener('modulesTab:autoSelectComplete', handleAutoSelectionComplete);
        window.addEventListener('switchToModulesTabComplete', handleTabSwitchComplete);
        
        // 🔧 SAFETY: Fallback timeout to prevent infinite loading
        const fallbackTimer = setTimeout(() => {
          // console.warn('🔧 Auto-selection timeout reached, showing content anyway');
          setIsAutoSelectionComplete(true);
        }, 5000); // 5 second timeout as final safety
        
        // Create module object for auto-selection - WITHOUT temporary title
        const moduleToSelect = {
          id: moduleId,
          courseId: courseId,
          // ❌ REMOVED: title: 'Loading...', - This was causing the loading title bug
          type: 'ACADEMIC' as const,
          isDraft: false,
          status: 'PUBLISHED' as const
        };
        
        // Switch to modules tab and trigger auto-selection - OPTIMIZED TIMING
        setTimeout(() => {
          const tabSwitchEvent = new CustomEvent('switchToModulesTab');
          window.dispatchEvent(tabSwitchEvent);
          
          // 🔧 OPTIMIZED: Reduced auto-select delay
          setTimeout(() => {
            const autoSelectEvent = new CustomEvent('modulesTab:autoSelectModule', {
              detail: { module: moduleToSelect }
            });
            window.dispatchEvent(autoSelectEvent);
            
            // ⚡ BALANCED SPEED: Optimized but stable timing
            setTimeout(() => {
              setIsAutoSelectionComplete(true);
            }, 500); // Increased from 300ms to 500ms for stability
          }, 200); // Increased from 150ms to 200ms  
        }, 700); // Increased from 500ms to 700ms
        
        // Cleanup event listeners and timer
        return () => {
          window.removeEventListener('modulesTab:autoSelectComplete', handleAutoSelectionComplete);
          window.removeEventListener('switchToModulesTabComplete', handleTabSwitchComplete);
          clearTimeout(fallbackTimer);
        };
      } else {
        // No module auto-selection, show content immediately
        setIsAutoSelectionComplete(true);
      }
      
      // The module context will be handled by the useToolbarState hook
    } else {
      // No course context, show content immediately
      setIsAutoSelectionComplete(true);
    }
  }, []);

  return (
    <div className="page-builder">
      <PageBuilderErrorBoundary>
        <div className="page-builder-page h-screen w-full overflow-visible flex flex-col bg-gray-900">
          {/* 🎯 NEW: Show loading state only during auto-selection, add backdrop blur */}
          {!isAutoSelectionComplete ? (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading module content...</p>
              </div>
            </div>
          ) : null}
          
          {/* Always render PageBuilder but overlay loading when needed */}
          <PageBuilder />
        </div>
      </PageBuilderErrorBoundary>
    </div>
  );
};

export default PageBuilderPage;
