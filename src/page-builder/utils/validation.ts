import { z } from 'zod';
import type { Element, ValidationResult, ValidationError } from '../types';

const ElementPropertiesSchema = z.object({
  className: z.string().optional(),
  style: z.record(z.any()).optional(),
  text: z.string().optional(),
  content: z.string().optional(),
  src: z.string().url().optional().or(z.literal('')),
  alt: z.string().optional(),
  questions: z.array(z.any()).optional(),
  layout: z.enum(['row', 'column', 'grid']).optional(),
  gap: z.number().min(0).optional(),
  padding: z.number().min(0).optional(),
  margin: z.number().min(0).optional(),
  autoplay: z.boolean().optional(),
  controls: z.boolean().optional(),
  loop: z.boolean().optional(),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  onClick: z.string().optional(),
});

const ElementSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  type: z.enum([
    'video', 'audio', 'quote', 'image', 'container', 'simple-container', 
    'button', 'heading', 'paragraph', 'text', 'text-statement',
    'image-choice', 'image-comparison', 'audio-comparison', 'audio-true-false',
    'area-true-false', 'speech-recognition', 'connection-widget',
    'connection-text-node', 'connection-image-node', 'drag-drop-widget',
    'standalone-widget', 'fill-in-blanks', 'single-choice', 'math-calculator'
  ]),
  properties: ElementPropertiesSchema,
  children: z.array(z.any()).optional(),
  parentId: z.string().optional(),
});

export function validateElement(element: Element): ValidationResult {
  const errors: ValidationError[] = [];
  
  try {
    ElementSchema.parse(element);
    
    // Additional validation based on element type
    switch (element.type) {
      case 'image':
        if (!element.properties.src) {
          errors.push({
            elementId: element.id,
            field: 'src',
            message: 'La imagen requiere una URL de origen',
          });
        }
        break;
      
      case 'video':
        if (!element.properties.src) {
          errors.push({
            elementId: element.id,
            field: 'src',
            message: 'El video requiere una URL de origen',
          });
        }
        break;
      
      case 'audio':
        if (!element.properties.src) {
          errors.push({
            elementId: element.id,
            field: 'src',
            message: 'El audio requiere una URL de origen',
          });
        }
        break;
      
      case 'heading':
      case 'paragraph':
      case 'quote':
      case 'button':
      case 'text':
        if (!element.properties.text && !element.properties.content) {
          errors.push({
            elementId: element.id,
            field: element.type === 'quote' ? 'content' : 'text',
            message: 'Este elemento requiere texto',
          });
        }
        break;
      
      case 'text-statement':
        if (!element.properties.statement) {
          errors.push({
            elementId: element.id,
            field: 'statement',
            message: 'La declaración requiere un enunciado',
          });
        }
        break;
      
      case 'image-choice':
      case 'image-comparison':
        if (!element.properties.imageUrl) {
          errors.push({
            elementId: element.id,
            field: 'imageUrl',
            message: 'Este elemento requiere una imagen',
          });
        }
        break;
      
      case 'math-calculator':
        // Math calculator doesn't require specific validation as it's self-contained
        break;
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          elementId: element.id,
          field: err.path.join('.'),
          message: err.message,
        });
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateElements(elements: Element[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  
  elements.forEach((element) => {
    const result = validateElement(element);
    allErrors.push(...result.errors);
    
    // Validate children recursively
    if (element.children) {
      const childrenResult = validateElements(element.children);
      allErrors.push(...childrenResult.errors);
    }
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
