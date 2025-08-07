// Simple HTML sanitizer for safe content rendering
// This is a basic implementation - in production, consider using DOMPurify

const ALLOWED_TAGS = [
  'strong', 'b', 'em', 'i', 'u', 'span', 'div', 'a', 'br', 'p'
];

const ALLOWED_ATTRIBUTES = {
  'span': ['style'],
  'div': ['style'],
  'a': ['href', 'target', 'rel', 'style']
};

const ALLOWED_STYLES = [
  'color', 'background-color', 'text-align', 'font-weight', 'font-style', 'text-decoration'
];

export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Recursively sanitize nodes
  const sanitizeNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Check if tag is allowed
      if (!ALLOWED_TAGS.includes(tagName)) {
        // If not allowed, return only the text content
        return Array.from(element.childNodes)
          .map(child => sanitizeNode(child))
          .join('');
      }

      // Build opening tag with allowed attributes
      let openingTag = `<${tagName}`;
      const allowedAttrs = ALLOWED_ATTRIBUTES[tagName as keyof typeof ALLOWED_ATTRIBUTES] || [];
      
      for (const attr of allowedAttrs) {
        const value = element.getAttribute(attr);
        if (value) {
          if (attr === 'style') {
            // Sanitize style attribute
            const sanitizedStyle = sanitizeStyle(value);
            if (sanitizedStyle) {
              openingTag += ` ${attr}="${sanitizedStyle}"`;
            }
          } else {
            openingTag += ` ${attr}="${value}"`;
          }
        }
      }
      openingTag += '>';

      // Process child nodes
      const childContent = Array.from(element.childNodes)
        .map(child => sanitizeNode(child))
        .join('');

      // Self-closing tags
      if (['br'].includes(tagName)) {
        return openingTag;
      }

      return openingTag + childContent + `</${tagName}>`;
    }

    return '';
  };

  // Sanitize the entire content
  const sanitizedContent = Array.from(tempDiv.childNodes)
    .map(child => sanitizeNode(child))
    .join('');

  return sanitizedContent;
};

const sanitizeStyle = (style: string): string => {
  const stylePairs = style.split(';').filter(pair => pair.trim());
  const sanitizedPairs: string[] = [];

  for (const pair of stylePairs) {
    const [property, value] = pair.split(':').map(s => s.trim());
    if (property && value && ALLOWED_STYLES.includes(property)) {
      // Basic value validation - you might want to add more sophisticated validation
      if (isValidStyleValue(property, value)) {
        sanitizedPairs.push(`${property}: ${value}`);
      }
    }
  }

  return sanitizedPairs.join('; ');
};

const isValidStyleValue = (property: string, value: string): boolean => {
  // Basic validation - in production, use a more robust validation library
  const valueLower = value.toLowerCase();
  
  // Check for potentially dangerous values
  const dangerousPatterns = [
    /javascript:/i,
    /expression\(/i,
    /url\(javascript:/i,
    /eval\(/i,
    /<script/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(valueLower)) {
      return false;
    }
  }

  // Basic color validation
  if (property === 'color' || property === 'background-color') {
    return /^#[0-9a-f]{3,6}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(|^transparent$|^inherit$|^initial$|^unset$/i.test(value);
  }

  // Basic text-align validation
  if (property === 'text-align') {
    return /^left$|^center$|^right$|^justify$|^inherit$|^initial$|^unset$/i.test(value);
  }

  return true;
}; 