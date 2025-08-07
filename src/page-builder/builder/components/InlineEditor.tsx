import React from 'react';

interface InlineEditorProps {
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  onComplete: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  isEditing,
  editText,
  setEditText,
  onComplete,
  onKeyDown,
}) => {
  if (!isEditing) return null;

  return (
    <textarea
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      onBlur={onComplete}
      onKeyDown={onKeyDown}
      autoFocus
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        background: 'transparent',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        color: 'inherit',
        padding: '8px',
        margin: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
      }}
    />
  );
};
