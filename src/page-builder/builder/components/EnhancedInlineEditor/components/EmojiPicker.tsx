import React from 'react';
import { createPortal } from 'react-dom';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  emojiSearchTerm: string;
  setEmojiSearchTerm: (term: string) => void;
  selectedEmojiCategory: string;
  setSelectedEmojiCategory: (category: string) => void;
  emojiCategories: Record<string, string[]>;
  filteredEmojis: string[];
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onClose,
  onEmojiSelect,
  emojiSearchTerm,
  setEmojiSearchTerm,
  selectedEmojiCategory,
  setSelectedEmojiCategory,
  emojiCategories,
  filteredEmojis
}) => {
  if (!isOpen) return null;

  // Debug logging
  if (selectedEmojiCategory === 'symbols') {
  }

  return (
    <>
      <style>
        {`
          .emoji-grid-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .emoji-grid-scrollbar::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 4px;
          }
          .emoji-grid-scrollbar::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 4px;
          }
          .emoji-grid-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}
      </style>
      {createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
          }}
          onClick={onClose}
        >
          <div
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '20px',
              width: '500px',
              maxHeight: '600px',
              border: '2px solid #4b5563',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#f9fafb', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Selector de Emojis</h3>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar emojis..."
              value={emojiSearchTerm}
              onChange={(e) => setEmojiSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #4b5563',
                backgroundColor: '#374151',
                color: '#f9fafb',
                marginBottom: '16px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#4b5563';
              }}
            />

            {/* Categories */}
            {!emojiSearchTerm && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {Object.keys(emojiCategories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedEmojiCategory(category)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #4b5563',
                      backgroundColor: selectedEmojiCategory === category ? '#3b82f6' : '#374151',
                      color: '#f9fafb',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}
                  >
                    {category === 'smileys' && '😀'}
                    {category === 'gestures' && '👍'}
                    {category === 'people' && '👶'}
                    {category === 'nature' && '🐶'}
                    {category === 'food' && '🍎'}
                    {category === 'activities' && '⚽'}
                    {category === 'travel' && '🚗'}
                    {category === 'objects' && '⌚'}
                    {category === 'symbols' && '❤️'}
                    {category === 'flags' && '⭐'}
                  </button>
                ))}
              </div>
            )}

            {/* Emojis Grid */}
            <div
              className="emoji-grid-scrollbar"
              key={`${selectedEmojiCategory}-${filteredEmojis.length}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '8px',
                flex: 1,
                minHeight: '200px',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '8px',
                backgroundColor: '#374151',
                borderRadius: '6px',
                marginBottom: '16px',
                // Dark mode scrollbar styling
                scrollbarWidth: 'thin',
                scrollbarColor: '#6b7280 #374151'
              }}
            >
              {filteredEmojis.map((emoji, index) => (
                <button
                  key={`${selectedEmojiCategory}-${index}-${emoji}`}
                  onClick={() => onEmojiSelect(emoji)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", "EmojiOne Mozilla", "Twemoji Mozilla", "Segoe UI Symbol", "Arial Unicode MS", "Arial", sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div style={{ 
              marginTop: 'auto',
              paddingTop: '8px',
              textAlign: 'center', 
              color: '#9ca3af', 
              fontSize: '12px',
              borderTop: '1px solid #374151',
              flexShrink: 0
            }}>
              Haz clic en un emoji para insertarlo
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}; 