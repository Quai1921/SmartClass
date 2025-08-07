import { useState, useRef, useCallback } from 'react';

/**
 * Hook for managing dropdown menu state and positioning
 */
export function useDropdownMenu() {
  const [showPageMenu, setShowPageMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback((pageId: string) => {
    setShowPageMenu(current => current === pageId ? null : pageId);
  }, []);

  const closeMenu = useCallback(() => {
    setShowPageMenu(null);
  }, []);

  const isMenuOpen = (pageId: string) => showPageMenu === pageId;

  const getMenuPosition = useCallback(() => {
    if (!menuRef.current) return { top: 0, right: 0 };
    
    const rect = menuRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    };
  }, []);

  return {
    showPageMenu,
    menuRef,
    toggleMenu,
    closeMenu,
    isMenuOpen,
    getMenuPosition,
  };
}
