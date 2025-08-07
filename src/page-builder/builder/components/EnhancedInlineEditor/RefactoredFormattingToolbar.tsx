import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  HistoryControls,
  TextFormattingControls,
  AlignmentControls,
  ColorAndStylingControls,
  UtilityControls,
  TypographyControls,
  AdvancedTextControls,
  ContentInsertionControls,
  SearchAndSelectionControls
} from './components/toolbar';

interface RefactoredFormattingToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignJustify: () => void;
  onTextColor: () => void;
  onBackgroundColor: () => void;
  onInsertLink: () => void;
  onTogglePreview: () => void;
  onFontFamily: (font: string) => void;
  onFontSize: (size: string) => void;
  onLineHeight: (height: string) => void;
  onLetterSpacing: (spacing: string) => void;
  onTextTransform: (transform: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearFormatting: () => void;
  onTextShadow: () => void;
  onStrikethrough: () => void;
  onSubscript: () => void;
  onSuperscript: () => void;
  onGradientText: () => void;
  onGradientBackground: () => void;
  onInsertEmoji: () => void;
  onInsertTable: () => void;
  onInsertCode: () => void;
  onInsertQuote: () => void;
  onInsertList: () => void;
  onInsertNumberedList: () => void;
  onIndent: () => void;
  onOutdent: () => void;
  onFindReplace: () => void;
  onSelectAll: () => void;
  onSelectByFormat: () => void;
  isPreviewMode: boolean;
  hasSelection: boolean;
  canUndo: boolean;
  canRedo: boolean;
  wordCount: number;
  charCount: number;
}

export const RefactoredFormattingToolbar: React.FC<RefactoredFormattingToolbarProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignJustify,
  onTextColor,
  onBackgroundColor,
  onInsertLink,
  onTogglePreview,
  onFontFamily,
  onFontSize,
  onLineHeight,
  onLetterSpacing,
  onTextTransform,
  onUndo,
  onRedo,
  onClearFormatting,
  onTextShadow,
  onStrikethrough,
  onSubscript,
  onSuperscript,
  onGradientText,
  onGradientBackground,
  onInsertEmoji,
  onInsertTable,
  onInsertCode,
  onInsertQuote,
  onInsertList,
  onInsertNumberedList,
  onIndent,
  onOutdent,
  onFindReplace,
  onSelectAll,
  onSelectByFormat,
  isPreviewMode,
  hasSelection,
  canUndo,
  canRedo,
  wordCount,
  charCount
}) => {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Handle clicking outside to close dropdowns and hide tooltips
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const target = event.target as Element;
        if (!target.closest('[data-dropdown]')) {
          setOpenDropdown(null);
          hideTooltip();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const showTooltip = (text: string, event: React.MouseEvent) => {
    // Only show tooltip if no dropdown is open
    if (openDropdown) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    
    const tooltipData = {
      text,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10
    };
    
    setTooltip(tooltipData);
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <div className="enhanced-formatting-toolbar" style={{
      background: '#374151',
      borderBottom: '1px solid #4b5563',
      padding: '12px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '4px',
      overflow: 'hidden',
      maxWidth: '100%',
      minHeight: 'fit-content'
    }}>
      {/* History Controls */}
      <HistoryControls
        onUndo={onUndo}
        onRedo={onRedo}
        onClearFormatting={onClearFormatting}
        canUndo={canUndo}
        canRedo={canRedo}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Text Formatting Controls */}
      <TextFormattingControls
        onBold={onBold}
        onItalic={onItalic}
        onUnderline={onUnderline}
        onStrikethrough={onStrikethrough}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Typography Controls */}
      <TypographyControls
        hasSelection={hasSelection}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onFontFamily={onFontFamily}
        onFontSize={onFontSize}
        onLineHeight={onLineHeight}
        onLetterSpacing={onLetterSpacing}
        onTextTransform={onTextTransform}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Alignment Controls */}
      <AlignmentControls
        onAlignLeft={onAlignLeft}
        onAlignCenter={onAlignCenter}
        onAlignRight={onAlignRight}
        onAlignJustify={onAlignJustify}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Advanced Text Controls */}
      <AdvancedTextControls
        onSubscript={onSubscript}
        onSuperscript={onSuperscript}
        onTextShadow={onTextShadow}
        onGradientText={onGradientText}
        onGradientBackground={onGradientBackground}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Color and Styling Controls */}
      <ColorAndStylingControls
        onTextColor={onTextColor}
        onBackgroundColor={onBackgroundColor}
        onInsertEmoji={onInsertEmoji}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Content Insertion Controls */}
      <ContentInsertionControls
        onInsertTable={onInsertTable}
        onInsertCode={onInsertCode}
        onInsertQuote={onInsertQuote}
        onInsertList={onInsertList}
        onInsertNumberedList={onInsertNumberedList}
        onIndent={onIndent}
        onOutdent={onOutdent}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Search and Selection Controls */}
      <SearchAndSelectionControls
        onFindReplace={onFindReplace}
        onSelectAll={onSelectAll}
        onSelectByFormat={onSelectByFormat}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Utility Controls */}
      <UtilityControls
        onInsertLink={onInsertLink}
        onTogglePreview={onTogglePreview}
        isPreviewMode={isPreviewMode}
        wordCount={wordCount}
        charCount={charCount}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />
      
      {/* Render tooltip using React Portal */}
      {tooltip && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            transform: 'translate(-50%, 0%)',
            background: '#1f2937',
            color: '#f9fafb',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            zIndex: 999999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '2px solid #4b5563',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {tooltip.text}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '6px solid transparent',
              borderBottomColor: '#1f2937'
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}; 