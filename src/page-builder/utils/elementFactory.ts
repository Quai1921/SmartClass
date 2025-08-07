import { v4 as uuidv4 } from 'uuid';
import type { Element, ElementType, ElementProperties } from '../types';
import { generateElementName } from './elementNaming';

export function createElement(
  type: ElementType,
  properties: Partial<ElementProperties> = {},
  parentId?: string
): Element {
  return {
    id: uuidv4(),
    name: generateElementName(type),
    type,
    properties: properties || {},
    parentId,
    children: (type === 'container' || type === 'simple-container') ? [] : undefined,
  };
}

export function createTemporaryElement(
  type: ElementType,
  properties: Partial<ElementProperties> = {},
  parentId?: string
): Element {
  return {
    id: uuidv4(),
    name: `Temp ${type}`, // Don't increment counter for temporary elements
    type,
    properties,
    parentId,
    children: (type === 'container' || type === 'simple-container') ? [] : undefined,
  };
}

// Helper function to get default classes for heading levels
function getHeadingClassName(level: number): string {
  switch (level) {
    case 1: return 'text-3xl font-bold mb-4';
    case 2: return 'text-2xl font-semibold mb-3';
    case 3: return 'text-xl font-medium mb-3';
    case 4: return 'text-lg font-medium mb-2';
    case 5: return 'text-base font-medium mb-2';
    case 6: return 'text-sm font-medium mb-2';
    default: return 'text-2xl font-bold mb-4';
  }
}

export function getDefaultProperties(type: ElementType): ElementProperties {
  switch (type) {    case 'heading':
      return { 
        text: 'Nuevo Título', 
        level: 1, // Default to h1
        className: getHeadingClassName(1), // Default h1 styling
        minHeight: 40,  // Default min height
        width: 300,     // Initial width to prevent 100% expansion
        height: 60,     // Initial height based on content
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        position: 'absolute' as const,
        left: 50,       // Initial position
        top: 50
      };
    
    case 'paragraph':
      return { 
        text: 'Este es un párrafo de ejemplosssss.', 
        htmlContent: undefined, // Will be set when rich text is used
        className: 'mb-4',
        minHeight: 40,  // Default min height
        width: 400,     // Initial width to prevent 100% expansion
        height: 80,     // Initial height based on content
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        position: 'absolute' as const,
        left: 50,       // Initial position
        top: 50
      };
      case 'quote':
      return { 
        content: 'Esta es una cita de ejemplo', 
        className: '',
        minHeight: 40,  // Default min height
        width: 350,     // Initial width to prevent 100% expansion
        height: 70,     // Initial height based on content
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        position: 'absolute' as const,
        left: 50,       // Initial position
        top: 50
      };
      
      
    case 'image':
      return { 
        src: '',
        alt: '',
        className: 'max-w-full h-auto mb-4',
        minHeight: 40  // Default min height when no image
      };
    
    case 'video':
      return { 
        src: '',
        controls: true,
        autoplay: false,
        loop: false,
        className: 'mb-4',  // Removed w-full to allow auto sizing
        height: 400,  // Fixed height
        heightUnit: 'px' as const,
        // No width properties - let video size itself
        minHeight: 400  // Ensure minimum height
      };

    case 'audio':
      return { 
        src: '',
        controls: true,
        autoplay: false,
        loop: false,
        className: 'inline-block',
        title: 'Audio',
        width: 48,  // Icon size width
        height: 48,  // Icon size height
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        minHeight: 48,  // Minimum icon size
        minWidth: 48,   // Minimum icon size
        // Customization properties
        iconType: 'audio-waveform',
        iconSize: 20,
        buttonSize: 48,
        backgroundColor: '#4b5563',
        playingColor: '#7c3aed',
        iconColor: '#ffffff',
        borderRadius: 50,
        borderWidth: 0,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        position: 'absolute' as const,
        left: 50,
        top: 50
      } as any;

    case 'button':
      return { 
        text: 'Botón',
        variant: 'primary',
        size: 'md',
        className: 'mb-4',
        minHeight: 40,  // Default min height
        width: 120,     // Default width to prevent full container width
        height: 40,      // Default height
        // Button styling properties
        buttonActiveTab: 'normal',
        buttonBackgroundColor: '#ffffff',
        buttonTextColor: '#374151',
        buttonBorderColor: '#d1d5db',
        buttonBorderWidth: 2,
        buttonBorderRadius: 6,
        buttonPaddingX: 16,
        buttonPaddingY: 12,
        buttonShadow: 'sm', // 'none', 'sm', 'md', 'lg', 'xl', 'custom'
        buttonCustomShadow: '',
        
        // Button hover state
        buttonHoverEnabled: true,
        buttonHoverBackgroundColor: '#f3f4f6',
        buttonHoverTextColor: '#1f2937',
        buttonHoverBorderColor: '#9ca3af',
        buttonHoverTransform: 'none', // 'none', 'scale-105', 'scale-110', 'translateY-1', 'translateY-2'
        
        // Button selected state
        buttonSelectedBackgroundColor: '#eff6ff',
        buttonSelectedTextColor: '#1d4ed8',
        buttonSelectedBorderColor: '#3b82f6',
        buttonSelectedBorderWidth: 2,
        
        // Button typography
        buttonFontFamily: 'inherit',
        buttonFontSize: 'inherit',
        buttonFontWeight: 'font-medium',
        buttonTextAlign: 'center',
        buttonTextTransform: 'none',
        buttonLetterSpacing: 0,
        
        // Button animations
        buttonAnimationsEnabled: true,
        buttonTransitionDuration: '200ms',

        // Button validation styling (post-selection)
        buttonUseCustomValidationColors: true,
        buttonCorrectBackgroundColor: '#ecfdf5',
        buttonCorrectTextColor: '#065f46',
        buttonCorrectBorderColor: '#10b981',
        buttonCorrectBorderWidth: 2,
        buttonIncorrectBackgroundColor: '#fef2f2',
        buttonIncorrectTextColor: '#991b1b',
        buttonIncorrectBorderColor: '#ef4444',
        buttonIncorrectBorderWidth: 2,
        buttonValidationOpacity: 0.7,
      } as any;

    case 'math-calculator':
      return {
        // Content
        calculatorType: 'algebra',
        problemText: 'Solve the following mathematical expression:',
        initialFormula: '',
        expectedAnswer: '',
        
        // Features
        showSteps: true,
        allowGraphing: true,
        showValidation: true,
        enableHistory: true,
        
        // Styling
        theme: 'modern',
        primaryColor: '#3b82f6',
        secondaryColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        buttonSize: 'medium',
        borderRadius: 8,
        
        // Behavior
        precision: 10,
        angleUnit: 'radian',
        autoCalculate: true,
        showKeyboard: true,
        allowCopy: true,
        showHints: true,
        
        // Layout
        width: 600,
        height: 500,
        className: 'math-calculator-widget',
      } as any;

    case 'container':
      return { 
        layout: 'column',
        gap: 16,
        padding: 24,
        margin: 0,
        width: 600,     // Fixed width that fits well in most canvas sizes
        height: 160,    // Default height
        minHeight: 120,
        minWidth: 200,  // Reasonable minimum width
        // Default units
        widthUnit: 'px', // Use pixels for predictable sizing
        heightUnit: 'px',
        minWidthUnit: 'px',
        minHeightUnit: 'px',
        // Layout positioning
        position: 'absolute', // Use absolute for all containers and children
        left: 0,
        top: 0,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        className: '' // Remove conflicting CSS classes, let inline styles handle it
      };

    case 'simple-container':
      return { 
        layout: 'column',
        gap: 16,
        padding: 16,
        margin: 0,
        width: 200,     // Fixed 200px width
        height: 200,    // Fixed 200px height
        minHeight: 200,
        minWidth: 200,
        // Default units
        widthUnit: 'px',
        heightUnit: 'px',
        minWidthUnit: 'px',
        minHeightUnit: 'px',
        // Layout positioning - will be relative when inside containers
        position: 'relative',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        className: ''
      };
    
    case 'text-statement':
      return {
        statement: 'Esta es una declaración de ejemplo',
        correctAnswer: true,
        userAnswer: undefined,
        showResult: false,
        feedbackMessage: '',
        allowRetry: true,
        width: 500,          // Increased from 400
        height: 200,         // Increased from 150  
        minHeight: 160,      // Increased from 120
        minWidth: 400,       // Increased from 300
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        position: 'absolute' as const,
        left: 50,           // Initial position
        top: 50,            // Initial position
        className: 'text-statement-widget p-4 border rounded-lg',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        fontSize: 16,
        fontWeight: '400',
        // Removed textAlign from here
      };
    
    case 'image-choice':
      return {
        imageUrl: '',
        imageAlt: 'Imagen para evaluar',
        correctAnswer: true,
        userAnswer: undefined,
        showResult: false,
        feedbackMessage: '',
        allowRetry: true,
        width: 300,
        height: 300,
        minHeight: 200,
        minWidth: 200,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        className: 'image-choice-widget p-4 border rounded-lg',
        backgroundColor: '#f8fafc',
        borderRadius: 8
      };
    
    case 'image-comparison':
      return {
        trueImageUrl: '',
        trueImageAlt: 'Imagen verdadera',
        falseImageUrl: '',
        falseImageAlt: 'Imagen falsa',
        userAnswer: undefined,
        showResult: false,
        feedbackMessage: '',
        allowRetry: true,
        width: 500,
        height: 300,
        minHeight: 200,
        minWidth: 400,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        className: 'image-comparison-widget p-4 border rounded-lg',
        backgroundColor: '#f8fafc',
        borderRadius: 8
      };
    
    case 'audio-comparison':
      return {
        trueAudioUrl: '',
        falseAudioUrl: '',
        imageUrl: '',
        imageAlt: 'Imagen para evaluar con audio',
        correctAnswer: true,
        userAnswer: undefined,
        showResult: false,
        feedbackMessage: '',
        allowRetry: true,
        width: 400,
        height: 350,
        minHeight: 200,
        minWidth: 300,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        className: 'audio-comparison-widget p-4 border rounded-lg',
        backgroundColor: '#f8fafc',
        borderRadius: 8
      };
    
    case 'audio-true-false':
      return {
        src: '',
        title: 'Audio',
        buttonPosition: 'south',
        correctAnswer: true,
        userAnswer: undefined,
        showResult: false,
        feedbackMessage: '',
        allowRetry: true,
        trueButton: {
          text: 'Verdadero',
          backgroundColor: '#059669',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '500',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none'
        },
        falseButton: {
          text: 'Falso',
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '500',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none'
        },
        // Icon customization properties
        iconType: 'audio-waveform',
        iconSize: 20,
        buttonSize: 48,
        iconColor: '#ffffff',
        playingColor: '#7c3aed',
        // Remove fixed width/height to allow content fitting
        minHeight: 80,
        minWidth: 120,
        className: 'audio-true-false-widget',
        backgroundColor: '#f8fafc',
        borderRadius: 8
      } as any;
    
    case 'fill-in-blanks':
      return {
        // Content properties
        questionText: 'I like [red] [apples] very much!',
        placeholder: 'Escribe aquí...',
        showPlaceholder: true,
        showMessages: true,
        successMessage: '✓ ¡Correcto!',
        errorMessage: '✗ Intenta de nuevo',
        hint: '',
        explanation: '',
        
        // Validation properties
        caseSensitive: false,
        trimWhitespace: true,
        accentSensitive: false,
        
        // Display properties
        showScore: true,
        showFeedback: true,
        instantFeedback: true,
        showValidationOnAll: false,
        // Behavior properties
        allowRetry: true,
        maxAttempts: 0,
        
        // Text styling
        fontSize: 'text-base',
        fontWeight: 'font-normal',
        fontFamily: 'font-sans',
        textColor: '#374151',
        correctTextColor: '#166534',
        incorrectTextColor: '#991b1b',
        
        // Input field styling
        inputWidth: 30,
        inputHeight: 36,
        inputBackgroundColor: '#ffffff',
        inputTransparent: false,
        inputNoBorder: false,
        inputBorderColor: '#d1d5db',
        inputBorderRadius: 6,
        
        // New independent border configuration
        inputBorders: {
          all: { width: 1, color: '#d1d5db', style: 'solid' },
          top: { width: 0, color: '#000000', style: 'solid' },
          right: { width: 0, color: '#000000', style: 'solid' },
          bottom: { width: 0, color: '#000000', style: 'solid' },
          left: { width: 0, color: '#000000', style: 'solid' }
        },
        
        // Widget background
        hasBackground: false,
        completelyTransparent: false,
        backgroundColor: '#ffffff',
        backgroundOpacity: 1,
        borderRadius: 8,
        padding: 16,
        
        // Layout properties
        width: 400,
        height: 60,
        minHeight: 40,
        minWidth: 200,
        className: 'fill-in-blanks-widget',
      } as any;
    
    case 'area-true-false':
      return {
        correctAnswer: true,
        userAnswer: undefined,
        showResult: true,
        allowRetry: true,
        shakeOnWrong: false,
        clickAnswersTrue: true,
        clickableAreaText: 'Haz clic para responder',
        // Default styling
        width: 300,
        height: 200,
        minHeight: 150,
        minWidth: 250,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        className: 'area-true-false-widget',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        // Result styling
        correctText: '¡Correcto!',
        incorrectText: 'Incorrecto',
        correctTextColor: '#059669',
        incorrectTextColor: '#dc2626',
        resultFontFamily: 'inherit',
        // Card backgrounds
        correctCardBackgroundColor: '#d1fae5',
        correctCardBackgroundOpacity: 0.8,
        correctCardBackgroundTransparent: false,
        incorrectCardBackgroundColor: '#fee2e2',
        incorrectCardBackgroundOpacity: 0.8,
        incorrectCardBackgroundTransparent: false
      } as any;

    case 'speech-recognition':
      return {
        targetText: 'Hello, how are you today?',
        allowRetry: true,
        showResult: true,
        autoStart: false,
        feedbackMode: 'word',
        minAccuracy: 80,
        maxRecordingTime: 30000,
        // Visual customization
        micButtonColor: '#3b82f6',
        micButtonSize: 64,
        resultTextColor: '#1f2937',
        resultTextSize: '16px',
        accuracyBarColor: '#10b981',
        // Audio feedback
        playTargetAudio: true,
        successSound: false,
        // Default dimensions
        width: 400,
        height: 300,
        minHeight: 250,
        minWidth: 300,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        className: 'speech-recognition-widget',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        // User interaction state
        userSpeech: '',
        isRecording: false,
        accuracy: 0,
        completed: false
      } as any;

    case 'connection-widget':
      return {
        text: 'Connect me!',
        imageUrl: '',
        imageAlt: 'Connection target',
        lineColor: '#3b82f6',
        lineWidth: 3,
        allowRetry: true,
        showFeedback: true,
        isConnected: false,
        showResult: false,
        successMessage: '¡Excelente conexión!',
        feedbackMessage: '',
        // Default dimensions
        width: 400,
        height: 200,
        minHeight: 160,
        minWidth: 300,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        className: 'connection-widget',
        backgroundColor: '#f8fafc',
        borderRadius: 8
      };

    case 'connection-text-node':
      return {
        // Content settings
        contentType: 'text',
        text: 'Connect me!',
        imageSrc: '',
        imageAlt: 'Connection image',
        
        // Connection settings
        lineColor: '#3b82f6',
        allowRetry: true,
        showFeedback: true,
        connectionState: 'disconnected',
        nodeType: 'text',
        successMessage: '¡Conectado!',
        
        // Layout & Dimensions
        width: 140,
        height: 40,
        minWidth: 100,
        maxWidth: 300,
        minHeight: 35,
        maxHeight: 150,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        
        // Spacing
        padding: 12,
        paddingTop: undefined,
        paddingRight: undefined,
        paddingBottom: undefined,
        paddingLeft: undefined,
        margin: 0,
        marginTop: undefined,
        marginRight: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
        gap: 8,
        
        // Border controls
        borderWidth: 2,
        borderTopWidth: undefined,
        borderRightWidth: undefined,
        borderBottomWidth: undefined,
        borderLeftWidth: undefined,
        borderStyle: 'solid',
        borderTopStyle: undefined,
        borderRightStyle: undefined,
        borderBottomStyle: undefined,
        borderLeftStyle: undefined,
        borderColor: '',
        borderTopColor: '',
        borderRightColor: '',
        borderBottomColor: '',
        borderLeftColor: '',
        borderRadius: 8,
        borderTopLeftRadius: undefined,
        borderTopRightRadius: undefined,
        borderBottomLeftRadius: undefined,
        borderBottomRightRadius: undefined,
        
        // Background
        backgroundColor: '#ffffff',
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
        // Effects
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
        filter: 'none',
        backdropFilter: 'none',
        opacity: 1,
        transition: 'all 0.3s ease',
        transform: 'none',
        
        // Typography
        fontFamily: 'Poppins, sans-serif',
        fontSize: 14,
        fontWeight: '400',
        fontStyle: 'normal',
        color: '#374151',
        textDecoration: 'none',
        textAlign: 'left',
        lineHeight: 1.4,
        letterSpacing: 0,
        textTransform: 'none',
        textShadow: 'none',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        
        // Image properties
        imageWidth: 100,
        imageHeight: 100,
        imageMaxWidth: 100,
        imageMaxHeight: 100,
        imageObjectFit: 'cover',
        imageObjectPosition: 'center',
        imageBorderRadius: 4,
        imageFilter: 'none',
        imageOpacity: 1,
        
        // Icon properties
        iconSize: 16,
        iconColor: '',
        
        // Layout controls
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        
        // State-specific styling
        connectedBorderColor: '#22c55e',
        connectedBoxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
        connectedBackgroundColor: '',
        connectedTransform: 'scale(1.02)',
        connectedIconColor: '#22c55e',
        
        connectingBorderColor: '',
        connectingBoxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        connectingBackgroundColor: '',
        connectingAnimation: 'pulse 1.5s infinite',
        
        className: 'connection-text-node'
      };

    case 'connection-image-node':
      return {
        // Content settings
        contentType: 'image',
        imageUrl: '',
        imageSrc: '/api/placeholder/120/120',
        imageAlt: 'Connection target',
        text: 'Drop here!',
        showText: true,
        
        // Connection settings
        lineColor: '#3b82f6',
        allowRetry: true,
        showFeedback: true,
        connectionState: 'disconnected',
        nodeType: 'image',
        successMessage: '¡Conectado!',
        
        // Layout & Dimensions
        width: 120,
        height: 120,
        minWidth: 60,
        maxWidth: 300,
        minHeight: 60,
        maxHeight: 300,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        
        // Spacing
        padding: 16,
        paddingTop: undefined,
        paddingRight: undefined,
        paddingBottom: undefined,
        paddingLeft: undefined,
        margin: 0,
        marginTop: undefined,
        marginRight: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
        gap: 8,
        contentGap: 8,
        
        // Border controls
        borderWidth: 3,
        borderTopWidth: undefined,
        borderRightWidth: undefined,
        borderBottomWidth: undefined,
        borderLeftWidth: undefined,
        borderStyle: 'dashed',
        borderTopStyle: undefined,
        borderRightStyle: undefined,
        borderBottomStyle: undefined,
        borderLeftStyle: undefined,
        borderColor: '#94a3b8',
        borderTopColor: '',
        borderRightColor: '',
        borderBottomColor: '',
        borderLeftColor: '',
        borderRadius: 12,
        borderTopLeftRadius: undefined,
        borderTopRightRadius: undefined,
        borderBottomLeftRadius: undefined,
        borderBottomRightRadius: undefined,
        
        // Background
        backgroundColor: '#f8fafc',
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
        // Effects
        boxShadow: '0 2px 8px rgba(148, 163, 184, 0.1)',
        filter: 'none',
        backdropFilter: 'none',
        opacity: 1,
        transition: 'all 0.3s ease',
        transform: 'none',
        
        // Typography (for text content)
        fontFamily: 'Poppins, sans-serif',
        fontSize: 12,
        fontWeight: '500',
        fontStyle: 'normal',
        color: '#64748b',
        textDecoration: 'none',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0,
        textTransform: 'none',
        textShadow: 'none',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        
        // Image properties
        imageWidth: undefined,
        imageHeight: undefined,
        imageMaxWidth: undefined,
        imageMaxHeight: undefined,
        imageObjectFit: 'cover',
        imageObjectPosition: 'center',
        imageBorderRadius: 8,
        imageFilter: 'none',
        imageOpacity: 1,
        
        // Icon properties
        iconSize: 32,
        iconColor: '',
        
        // Layout controls
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        contentDirection: 'column',
        
        // State-specific styling
        connectedBorderColor: '#22c55e',
        connectedBorderStyle: 'solid',
        connectedBoxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
        connectedBackgroundColor: '#f0fdf4',
        connectedTransform: 'scale(1.05)',
        connectedIconColor: '#22c55e',
        connectedImageFilter: 'brightness(1.1)',
        connectedImageTransform: 'scale(1.02)',
        
        targetedBorderColor: '#fbbf24',
        targetedBorderStyle: 'solid',
        targetedBoxShadow: '0 4px 16px rgba(251, 191, 36, 0.4)',
        targetedBackgroundColor: '#fffbeb',
        targetedAnimation: 'targetPulse 1s infinite',
        targetedImageFilter: 'brightness(1.2) saturate(1.2)',
        targetedImageTransform: 'scale(1.05)',
        
        className: 'connection-image-node'
      };

    case 'drag-drop-widget':
      return {
        className: 'drag-drop-widget',
        width: 300,
        height: 200,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        minWidth: 200,
        minHeight: 150,
        position: 'absolute' as const,
        left: 50,
        top: 50,
        backgroundColor: '#f8fafc',
        border: '2px dashed #cbd5e1',
        borderRadius: 8,
        padding: 16,
        
        // Drag and Drop specific properties
        dropZoneText: 'Arrastra elementos aquí',
        allowedTypes: [], // Empty array means accept any type
        maxItems: 0, // 0 means unlimited
        orientation: 'vertical' as const, // 'horizontal' | 'vertical' | 'grid'
        itemSpacing: 8,
        
        // Visual feedback
        dragOverColor: '#e0f2fe',
        dragOverBorder: '2px solid #0284c7',
        successColor: '#dcfce7',
        successBorder: '2px solid #16a34a',
        
        // Animation settings
        enableAnimations: true,
        
        // Grid layout (when orientation is 'grid')
        dragDropGridColumns: 2,
        dragDropGridRows: 0, // 0 means auto
      };
      
    case 'standalone-widget':
      return {
        className: 'standalone-widget',
        width: 80,
        height: 80,
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        position: 'absolute' as const,
        left: 0,
        top: 0,
        
        // Default visual properties
        backgroundColor: 'transparent',
        backgroundImage: '',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
        // Text properties
        text: '',
        color: '#333',
        fontSize: 12,
        fontWeight: '500',
        
        // Border and effects
        border: 'none',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        
        // Interactive properties
        cursor: 'grab',
        zIndex: 10,
        opacity: 1,
        
        // Element identification
        standaloneElementType: 'image',
      };
    
    case 'single-choice':
      return {
        // Layout properties
        width: 300,      // Default width for auto-sizing
        height: 200,     // Default height for auto-sizing
        widthUnit: 'px' as const,
        heightUnit: 'px' as const,
        position: 'absolute' as const,
        left: 50,
        top: 50,

        // Content
        question: '¿Cuál es la respuesta correcta?',
        showQuestion: true,
        options: [
          { text: 'Opción A', isCorrect: true },
          { text: 'Opción B', isCorrect: false },
          { text: 'Opción C', isCorrect: false }
        ],
        showMessages: true,
        successMessage: '✓ ¡Correcto!',
        errorMessage: '✗ Intenta de nuevo',
        hint: '',
        explanation: '',

        // Text styling
        fontSize: 'text-base',
        fontWeight: 'font-normal',
        fontFamily: 'font-sans',
        textColor: '#374151',
        correctTextColor: '#166534',
        incorrectTextColor: '#991b1b',

        // Option styling
        optionStyle: 'radio', // 'radio', 'button', 'card'
        optionSpacing: 8,

        // Button styling (when optionStyle is 'button')
        buttonActiveTab: 'normal',
        buttonBackgroundColor: '#ffffff',
        buttonTextColor: '#374151',
        buttonBorderColor: '#d1d5db',
        buttonBorderWidth: 2,
        buttonBorderRadius: 6,
        buttonPaddingX: 16,
        buttonPaddingY: 12,
        buttonShadow: 'sm', // 'none', 'sm', 'md', 'lg', 'xl', 'custom'
        buttonCustomShadow: '',
        
        // Button hover state
        buttonHoverEnabled: true,
        buttonHoverBackgroundColor: '#f3f4f6',
        buttonHoverTextColor: '#1f2937',
        buttonHoverBorderColor: '#9ca3af',
        buttonHoverTransform: 'none', // 'none', 'scale-105', 'scale-110', 'translateY-1', 'translateY-2'
        
        // Button selected state
        buttonSelectedBackgroundColor: '#eff6ff',
        buttonSelectedTextColor: '#1d4ed8',
        buttonSelectedBorderColor: '#3b82f6',
        buttonSelectedBorderWidth: 2,
        
        // Button typography
        buttonFontFamily: 'inherit',
        buttonFontSize: 'inherit',
        buttonFontWeight: 'font-medium',
        buttonTextAlign: 'center',
        buttonTextTransform: 'none',
        buttonLetterSpacing: 0,
        
        // Button animations
        buttonAnimationsEnabled: true,
        buttonTransitionDuration: '200ms',

        // Button validation styling (post-selection)
        buttonUseCustomValidationColors: true,
        buttonCorrectBackgroundColor: '#ecfdf5',
        buttonCorrectTextColor: '#065f46',
        buttonCorrectBorderColor: '#10b981',
        buttonCorrectBorderWidth: 2,
        buttonIncorrectBackgroundColor: '#fef2f2',
        buttonIncorrectTextColor: '#991b1b',
        buttonIncorrectBorderColor: '#ef4444',
        buttonIncorrectBorderWidth: 2,
        buttonValidationOpacity: 0.7,
      } as any;

    default:
      // console.warn(`Unknown element type: ${type}`);
      return {
        width: 100,
        height: 60,
        position: 'absolute' as const,
        left: 0,
        top: 0
      };
  }
}

export function createElementFromType(
  type: ElementType, 
  parentId?: string, 
  customProperties?: Partial<ElementProperties>
): Element {
  const defaultProperties = getDefaultPropertiesWithContext(type, parentId);
  
  // Special handling for heading level to set appropriate className
  if (type === 'heading' && customProperties?.level) {
    const level = customProperties.level;
    customProperties.className = getHeadingClassName(level);
  }
  
  const mergedProperties = customProperties ? { ...defaultProperties, ...customProperties } : defaultProperties;
  const element = createElement(type, mergedProperties, parentId);

  return element;
}

export function createTemporaryElementFromType(
  type: ElementType, 
  parentId?: string, 
  customProperties?: Partial<ElementProperties>
): Element {
  const defaultProperties = getDefaultPropertiesWithContext(type, parentId);
  
  // Special handling for heading level to set appropriate className
  if (type === 'heading' && customProperties?.level) {
    const level = customProperties.level;
    customProperties.className = getHeadingClassName(level);
  }
  
  const mergedProperties = customProperties ? { ...defaultProperties, ...customProperties } : defaultProperties;
  const element = createTemporaryElement(type, mergedProperties, parentId);

  return element;
}

// Utility function to create connection node pairs
export function createConnectionNodePair(
  parentId?: string,
  textContent?: string,
  imageUrl?: string,
  basePosition: { x: number; y: number } = { x: 50, y: 50 }
): { textNode: Element; imageNode: Element } {
  try {


    const connectionGroupId = uuidv4();
    const sharedProperties = {
      connectionGroupId,
      lineColor: '#3b82f6',
      allowRetry: true,
      showFeedback: true,
      successMessage: '¡Conectado!'
    };

    // Create text node (positioned on the left)

    const textNode = createElementFromType('connection-text-node', parentId, {
      ...sharedProperties,
      text: textContent || 'Connect me!',
      left: basePosition.x,
      top: basePosition.y,
      nodeType: 'text'
    });

 

    // Create image node (positioned on the right, 200px apart)

    const imageNode = createElementFromType('connection-image-node', parentId, {
      ...sharedProperties,
      imageUrl: imageUrl || '',
      imageAlt: 'Connection target',
      left: basePosition.x + 200,
      top: basePosition.y,
      nodeType: 'image'
    });



    if (!textNode || !imageNode) {
      throw new Error('Failed to create one or both connection nodes');
    }

    return { textNode, imageNode };
  } catch (error) {
    // console.error('❌ Error creating connection node pair:', error);
    throw error;
  }
}

// Utility function to determine if an element has content and should use adaptive sizing
export function hasContentForAdaptiveSize(element: Element): boolean {
  const { type, properties } = element;
  
  switch (type) {
    case 'heading':
    case 'paragraph':
      // Has content if text is not empty and not default
      return !!(properties.text && 
                properties.text.trim() !== '' && 
                properties.text !== 'Nuevo Título' && 
                properties.text !== 'Este es un párrafo de ejemplos.');
    
    case 'quote':
      // Has content if content is not empty and not default
      return !!(properties.content && 
                properties.content.trim() !== '' && 
                properties.content !== 'Esta es una cita de ejemplo');
    
    case 'image':
      // Has content if src is provided
      return !!(properties.src && properties.src.trim() !== '');
    
    case 'video':
      // Has content if src is provided
      return !!(properties.src && properties.src.trim() !== '');
    
    case 'audio':
      // Has content if src is provided
      return !!(properties.src && properties.src.trim() !== '');
    
    case 'button':
      // Always considered to have content (button text)
      return true;
    
    case 'container':
      // Containers use their own sizing logic
      return false;
    
    case 'simple-container':
      // Simple containers use their own sizing logic
      return false;
    
    default:
      return false;
  }
}

// Get adaptive height for elements based on content
export function getAdaptiveHeight(element: Element): string | undefined {
  if (element.type === 'container' || element.type === 'simple-container') {
    // Containers use their own height logic
    return element.properties.height ? `${element.properties.height}px` : undefined;
  }
  
  if (hasContentForAdaptiveSize(element)) {
    // If element has content, use max-content to fit content
    return 'max-content';
  } else {
    // If no content, use minimum height
    return `${element.properties.minHeight || 40}px`;
  }
}

export function getDefaultPropertiesWithContext(type: ElementType, parentId?: string): ElementProperties {
  const defaultProps = getDefaultProperties(type);
  
  // Special case: child containers should have fixed 200x200 size
  if ((type === 'container' || type === 'simple-container') && parentId) {
    return {
      ...defaultProps,
      width: 200,      // Fixed width for child containers
      height: 200,     // Fixed height for child containers
      minWidth: 200,   // Minimum width
      minHeight: 200,  // Minimum height
      widthUnit: 'px', // Use pixels for child containers
      heightUnit: 'px',
      backgroundColor: '#f1f5f9', // Slightly different background for child containers
      borderColor: '#cbd5e1',     // Different border color
      position: 'absolute',       // Use absolute positioning for repositioning
      left: 20,                   // Default position within parent
      top: 20,                    // Default position within parent
    };
  }
  
  // Text-based elements should use content-based sizing when inside containers
  if (['heading', 'paragraph', 'quote'].includes(type)) {
    const textProps = { ...defaultProps };
    
    // Only use content-based sizing if inside a container (parentId exists)
    if (parentId) {
      // Remove any fixed dimensions and use content-based sizing for container elements
      delete textProps.width;
      delete textProps.height;
      textProps.widthUnit = 'max-content';
      textProps.heightUnit = 'max-content';

      // Use natural flow positioning within the container
      delete textProps.position;
      delete textProps.left;
      delete textProps.top;
      delete textProps.right;
      delete textProps.bottom;
      textProps.position = 'relative';
    } else {
      // For canvas elements (no parentId), use max-content to prevent CSS from forcing 100% width
      textProps.widthUnit = 'max-content';
      textProps.heightUnit = 'max-content';
      // Remove explicit dimensions to let content determine size
      delete textProps.width;
      delete textProps.height;
    }
    
    // For canvas elements, ensure they have positioning
    if (!parentId) {
      textProps.position = 'absolute';
      textProps.left = textProps.left || 50;
      textProps.top = textProps.top || 50;
    }
    
    return textProps;
  }

  // For widgets inside containers, remove absolute positioning and use layout-friendly properties
  if (parentId && type !== 'container') {
    const layoutFriendlyProps = { ...defaultProps };
    
    // Remove absolute positioning properties - let parent container layout handle positioning
    delete layoutFriendlyProps.position;
    delete layoutFriendlyProps.left;
    delete layoutFriendlyProps.top;
    delete layoutFriendlyProps.right;
    delete layoutFriendlyProps.bottom;
    
    // Set relative positioning for layout containers
    layoutFriendlyProps.position = 'relative';
      // For better layout behavior in containers
    if (type === 'button') {
      // Buttons should not take full width in containers
      layoutFriendlyProps.width = 120;
      layoutFriendlyProps.widthUnit = 'px';    } else if (['heading', 'paragraph', 'quote'].includes(type)) {
      // Text elements should use content-based sizing in containers
      delete layoutFriendlyProps.width; // Let CSS fit-content handle width
      delete layoutFriendlyProps.height; // Let content determine height
    }else if (['image', 'video'].includes(type)) {
      // Media elements should be responsive within containers
      delete layoutFriendlyProps.width;
      delete layoutFriendlyProps.height;
      // Don't set maxWidth as number since it should be handled differently
    } else if (['text-statement', 'image-choice', 'image-comparison', 'audio-comparison', 'single-choice'].includes(type)) {
      // Interactive widgets should be smaller inside containers
      if (type === 'text-statement') {
        layoutFriendlyProps.width = 400;      // Increased from 300
        layoutFriendlyProps.height = 180;     // Increased from 120
      } else if (type === 'image-choice') {
        layoutFriendlyProps.width = 250;
        layoutFriendlyProps.height = 250;
      } else if (type === 'image-comparison') {
        layoutFriendlyProps.width = 400;
        layoutFriendlyProps.height = 250;
      } else if (type === 'audio-comparison') {
        layoutFriendlyProps.width = 300;
        layoutFriendlyProps.height = 150;
      } else if (type === 'single-choice') {
        layoutFriendlyProps.width = 300;      // Auto-width for single choice
        layoutFriendlyProps.height = 200;     // Auto-height for single choice
      }
    }
    
    return layoutFriendlyProps;
  }
  
  return defaultProps;
}

/*
// Helper function to create specialized drop areas - DEPRECATED: drop areas removed
export function createSpecializedDropArea(
  contentType: 'text' | 'image' | 'video' | 'audio' | 'interactive' | 'general' = 'general',
  customProperties: Partial<ElementProperties> = {}
): Element {
  const contentTypeConfigs = {
    text: {
      backgroundColor: '#f0f9ff',
      border: '2px dashed #0284c7',
      allowedWidgetTypes: ['heading', 'paragraph', 'quote', 'text-statement']
    },
    image: {
      backgroundColor: '#f0fdf4', 
      border: '2px dashed #16a34a',
      allowedWidgetTypes: ['image', 'image-choice', 'image-comparison']
    },
    video: {
      backgroundColor: '#fef3c7',
      border: '2px dashed #d97706',
      allowedWidgetTypes: ['video']
    },
    audio: {
      backgroundColor: '#f3e8ff',
      border: '2px dashed #9333ea',
      allowedWidgetTypes: ['audio', 'audio-comparison', 'audio-true-false']
    },
    interactive: {
      backgroundColor: '#ecfdf5',
      border: '2px dashed #059669',
      allowedWidgetTypes: ['button', 'connection-widget', 'speech-recognition']
    },
    general: {
      backgroundColor: '#fafafa',
      border: '2px dashed #ccc',
      allowedWidgetTypes: [] // No restrictions
    }
  };

  const config = contentTypeConfigs[contentType];
  
  return createElement('drop-area', {
    ...config,
    contentType,
    areaCategory: contentType,
    ...customProperties
  });
}
*/
