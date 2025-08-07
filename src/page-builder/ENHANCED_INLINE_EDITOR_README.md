# Enhanced Inline Editor for Paragraphs

## Overview

The Enhanced Inline Editor provides rich text editing capabilities for paragraph elements in the page builder, similar to the email editor but specifically designed for paragraph content.

## Features

### Text Formatting
- **Bold** (Ctrl+B)
- **Italic** (Ctrl+I) 
- **Underline** (Ctrl+U)
- **Text Color** - Custom color picker with preset colors
- **Background Color** - Custom color picker with preset colors

### Text Alignment
- **Left Align**
- **Center Align**
- **Right Align**
- **Justify**

### Links
- **Insert Links** (Ctrl+K) - Add URLs with custom link text
- **Link Preview** - See how links will appear before inserting

### Preview Mode
- **Toggle Preview** - Switch between edit and preview modes
- **Real-time HTML Rendering** - See formatted content as it will appear
- **Safe HTML Sanitization** - Only allows safe HTML tags and attributes

## How to Use

### Starting the Editor
1. Select a paragraph element in the page builder
2. Press **Enter** to start editing
3. The enhanced inline editor will appear with a formatting toolbar

### Text Formatting
1. Select the text you want to format
2. Click the appropriate formatting button in the toolbar:
   - **B** for bold
   - **I** for italic
   - **U** for underline
   - **Color** buttons for text and background colors

### Keyboard Shortcuts
- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+U` - Underline
- `Ctrl+K` - Insert link

### Adding Links
1. Select the text you want to make into a link
2. Click the link button or press `Ctrl+K`
3. Enter the URL and optional link text
4. Click "Insert" to add the link

### Preview Mode
1. Click the eye icon in the toolbar to toggle preview mode
2. See how your formatted content will appear
3. Click the eye icon again to return to edit mode

## Technical Implementation

### Components
- `EnhancedInlineEditor.tsx` - Main editor component
- `FormattingToolbar.tsx` - Toolbar with formatting buttons
- `ColorPicker.tsx` - Color selection modal
- `LinkModal.tsx` - Link insertion modal
- `useEnhancedEditing.ts` - Hook for formatting logic
- `htmlSanitizer.ts` - HTML sanitization utility

### Data Storage
- **Plain Text**: Stored in `properties.text`
- **HTML Content**: Stored in `properties.htmlContent` when formatting is used
- **Backward Compatibility**: Existing plain text paragraphs continue to work

### HTML Sanitization
The editor includes a built-in HTML sanitizer that:
- Allows only safe HTML tags: `strong`, `b`, `em`, `i`, `u`, `span`, `div`, `a`, `br`, `p`
- Validates CSS properties and values
- Prevents XSS attacks
- Strips unsafe content

### Supported HTML Tags
```html
<strong>Bold text</strong>
<em>Italic text</em>
<u>Underlined text</u>
<span style="color: #ff0000;">Colored text</span>
<span style="background-color: #ffff00;">Highlighted text</span>
<div style="text-align: center;">Centered text</div>
<a href="https://example.com">Link text</a>
```

## Integration

### ElementRenderer
The `ElementRenderer` component automatically detects HTML content and renders it appropriately:
- If `htmlContent` exists and contains HTML tags, renders with `dangerouslySetInnerHTML`
- Otherwise, renders as plain text with `contentEditable`

### ManualDragWidget
The `ManualDragWidget` component uses the enhanced editor for paragraphs:
- Paragraphs use `EnhancedInlineEditor`
- Other text elements continue using the basic `InlineEditor`

### Properties Panel
The properties panel shows both plain text and HTML content, allowing users to:
- Edit content directly in the properties panel
- See the current content format (plain text vs HTML)
- Switch between formats if needed

## Styling

The enhanced inline editor includes responsive CSS styles:
- Clean, modern toolbar design
- Responsive layout for mobile devices
- Consistent styling with the page builder theme
- Hover effects and visual feedback

## Future Enhancements

Potential improvements for future versions:
- **More Formatting Options**: Strikethrough, subscript, superscript
- **Font Size Controls**: Adjustable font sizes
- **Lists**: Bullet points and numbered lists
- **Tables**: Insert and edit tables
- **Images**: Insert images within paragraphs
- **Undo/Redo**: History management
- **Spell Check**: Built-in spell checking
- **Auto-save**: Automatic content saving

## Browser Compatibility

The enhanced inline editor works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

- All HTML content is sanitized before rendering
- Only safe HTML tags and attributes are allowed
- CSS properties are validated to prevent injection attacks
- Links are properly formatted with security attributes 