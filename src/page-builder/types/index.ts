// Core types for the page builder
export interface Element {
  id: string;
  type: ElementType;
  name: string; // Human-readable name like "Container 1", "Text 2", etc.
  properties: ElementProperties;
  children?: Element[];
  parentId?: string;
}

export type ElementType = 
  | 'video'
  | 'audio'
  | 'quote'
  | 'image'
  | 'container'
  | 'simple-container'
  | 'button'
  | 'heading'
  | 'paragraph'
  | 'text'  // Added to fix type comparison
  | 'text-statement'
  | 'image-choice'
  | 'image-comparison'
  | 'audio-comparison'
  | 'audio-true-false'
  | 'area-true-false'
  | 'fill-in-blanks'
  | 'single-choice'
  | 'math-calculator'
  | 'speech-recognition'
  | 'connection-widget'
  | 'connection-text-node'
  | 'connection-image-node'
  | 'drag-drop-widget'
  | 'standalone-widget';

export interface ConnectionWidgetProps {
  text: string;
  imageUrl: string;
  imageAlt?: string;
  allowRetry?: boolean;
  showFeedback?: boolean;
  lineColor?: string;
  lineWidth?: number;
  isConnected?: boolean;
  showResult?: boolean;
  connectionPoints?: 'center' | 'edges' | 'auto';
  connectFromSide?: 'any' | 'specific';
  successMessage?: string;
  feedbackMessage?: string;
  retryMessage?: string;
}

export interface ElementProperties {
  // Common properties
  className?: string;
  style?: React.CSSProperties;
    // Text content
  text?: string;
  content?: string;
  htmlContent?: string; // HTML content for rich text editing
  
  // Connection Widget Properties
  lineColor?: string;
  lineWidth?: number;
  isConnected?: boolean;
  showFeedback?: boolean;
  successMessage?: string;
  retryMessage?: string;
  
  // Connection Node Properties
  connectedNodeId?: string; // ID of the connected node
  connectionGroupId?: string; // ID to group connection nodes together
  nodeType?: 'text' | 'image'; // Type of connection node
  connectionState?: 'disconnected' | 'connecting' | 'connected';
  
  // Connection Node Enhanced Properties
  contentType?: 'text' | 'image' | 'general' | 'video' | 'audio' | 'interactive'; // Content type for connection nodes and drop areas
  imageSrc?: string; // Source for image content
  
  // Drop Area Validation Properties
  areaCategory?: string; // Category for grouping related areas
  allowedWidgetTypes?: string[]; // Specific widget types allowed in this drop area
  belongsToSpecificArea?: string; // ID of the specific area this widget can ONLY be dropped into
  createdByArea?: string; // ID of the area that created this widget
  
  // Enhanced Image Properties
  imageWidth?: number;
  imageHeight?: number;
  imageMaxWidth?: number;
  imageMaxHeight?: number;
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  imageObjectPosition?: string;
  imageBorderRadius?: number;
  imageFilter?: string;
  imageOpacity?: number;
  
  // Icon Properties
  iconSize?: number;
  iconColor?: string;
  moveIconColor?: string;
  
  // Effects and Filters
  filter?: string;
  transform?: string;
  opacity?: number;
  isTransparent?: boolean; // Toggle for complete transparency
  previousOpacity?: number; // Store previous opacity when making transparent
  
  // Drop Area Widget Properties
  draggable?: boolean;
  showSelectionIndicator?: boolean;
  
  // State-Specific Styling for Connection Nodes
  connectedBorderColor?: string;
  connectedBorderTopColor?: string;
  connectedBorderRightColor?: string;
  connectedBorderBottomColor?: string;
  connectedBorderLeftColor?: string;
  connectedBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectedBorderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectedBorderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectedBorderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectedBorderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectedBoxShadow?: string;
  connectedBackgroundColor?: string;
  connectedTransform?: string;
  connectedIconColor?: string;
  connectedImageFilter?: string;
  connectedImageTransform?: string;
  
  connectingBorderColor?: string;
  connectingBorderTopColor?: string;
  connectingBorderRightColor?: string;
  connectingBorderBottomColor?: string;
  connectingBorderLeftColor?: string;
  connectingBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectingBorderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectingBorderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectingBorderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectingBorderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  connectingBoxShadow?: string;
  connectingBackgroundColor?: string;
  connectingAnimation?: string;
  
  targetedBorderColor?: string;
  targetedBorderTopColor?: string;
  targetedBorderRightColor?: string;
  targetedBorderBottomColor?: string;
  targetedBorderLeftColor?: string;
  targetedBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  targetedBorderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  targetedBorderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  targetedBorderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  targetedBorderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  targetedBoxShadow?: string;
  targetedBackgroundColor?: string;
  targetedAnimation?: string;
  targetedImageFilter?: string;
  targetedImageTransform?: string;
  
  // Content Display Properties
  showText?: boolean; // Whether to show text content
  contentDirection?: 'row' | 'column'; // Layout direction for content
  
  // Heading-specific properties
  level?: 1 | 2 | 3 | 4 | 5 | 6; // Heading level (h1-h6)
    // Typography properties
  fontFamily?: string;
  fontSize?: number; // in pixels
  fontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  color?: string; // hex, rgb, hsl, etc.
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number; // multiplier (e.g., 1.5)
  letterSpacing?: number; // in pixels
  wordSpacing?: number; // in pixels
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textDecorationColor?: string;
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
  textDecorationThickness?: number; // in pixels
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textIndent?: number; // in pixels
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  textOverflow?: 'clip' | 'ellipsis';
  fontVariant?: string; // CSS font-variant property
  WebkitTextStroke?: string; // CSS webkit text stroke for outlined text
    // Media properties
  src?: string;
  alt?: string;
  title?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  objectPosition?: string;
  
  // Interactive Widget Properties
  // Text Statement widget
  statement?: string; // The statement/sentence to evaluate
  correctAnswer?: boolean; // Whether the statement is true or false
  userAnswer?: boolean; // User's selected answer
  showResult?: boolean; // Whether to show if answer is correct/incorrect
  
  // Image Choice widget  
  imageUrl?: string; // URL of the image to display
  imageAlt?: string; // Alt text for the image
  
  // Image Comparison widget
  trueImageUrl?: string; // URL of the "true" image
  trueImageAlt?: string; // Alt text for true image
  falseImageUrl?: string; // URL of the "false" image  
  falseImageAlt?: string; // Alt text for false image
  
  // Audio Comparison widget
  trueAudioUrl?: string; // URL of the "true" audio file
  falseAudioUrl?: string; // URL of the "false" audio file
  
  // Audio Widget Styling Properties
  audioIconType?: string; // Type of icon for audio widgets
  audioIconSize?: number; // Size of icon for audio widgets
  audioButtonSize?: number; // Size of the audio button
  audioBackgroundColor?: string; // Background color for audio widgets
  audioPlayingColor?: string; // Color when audio is playing
  audioIconColor?: string; // Color of icon for audio widgets
  audioBorderRadius?: number; // Border radius for audio widgets
  audioBorderWidth?: number; // Border width for audio widgets
  audioBorderColor?: string; // Border color for audio widgets
  audioBorderStyle?: string; // Border style for audio widgets
  
  // Container Styling Properties
  containerBackgroundColor?: string; // Background color for the container
  containerBorderRadius?: number; // Border radius for the container
  
  // Audio Card Styling Properties
  cardBackgroundColor?: string; // Background color for audio cards (default state)
  cardBorderColor?: string; // Border color for audio cards (default state)
  cardBorderWidth?: number; // Border width for audio cards
  cardBorderRadius?: number; // Border radius for audio cards
  cardPadding?: number; // Padding inside audio cards
  cardMinHeight?: number; // Minimum height of audio cards
  cardMaxWidth?: number; // Maximum width of audio cards
  cardGap?: number; // Gap between audio cards
  cardHoverBackgroundColor?: string; // Background color on hover
  cardHoverBorderColor?: string; // Border color on hover
  cardHoverTransform?: string; // Transform effect on hover (e.g., 'scale(1.02)')
  cardHoverShadow?: string; // Box shadow on hover
  
  // Audio Card Answer State Colors
  cardCorrectBackgroundColor?: string; // Background color when answer is correct
  cardCorrectBorderColor?: string; // Border color when answer is correct
  cardIncorrectBackgroundColor?: string; // Background color when answer is incorrect
  cardIncorrectBorderColor?: string; // Border color when answer is incorrect
  cardAnsweredTransform?: string; // Transform effect when answered (e.g., 'scale(1.02)')
  
  // Audio Card Text Styling Properties
  cardTitleFontFamily?: string; // Font family for card titles (Audio A, Audio B)
  cardTitleFontSize?: number; // Font size for card titles
  cardTitleFontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'; // Font weight for card titles
  cardTitleColor?: string; // Color for card titles
  cardTitleTextAlign?: 'left' | 'center' | 'right' | 'justify'; // Text alignment for card titles
  
  cardSubtitleFontFamily?: string; // Font family for card subtitles (Escuchar Audio)
  cardSubtitleFontSize?: number; // Font size for card subtitles
  cardSubtitleFontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'; // Font weight for card subtitles
  cardSubtitleColor?: string; // Color for card subtitles
  cardSubtitleTextAlign?: 'left' | 'center' | 'right' | 'justify'; // Text alignment for card subtitles
  
  resultTextFontFamily?: string; // Font family for result text (¡Correcto!, Incorrecto)
  resultTextFontSize?: number; // Font size for result text
  resultTextFontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'; // Font weight for result text
  resultTextColor?: string; // Color for result text
  resultTextTextAlign?: 'left' | 'center' | 'right' | 'justify'; // Text alignment for result text
  
  feedbackTextFontFamily?: string; // Font family for feedback message
  feedbackTextFontSize?: number; // Font size for feedback message
  feedbackTextFontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'; // Font weight for feedback message
  feedbackTextColor?: string; // Color for feedback message
  feedbackTextTextAlign?: 'left' | 'center' | 'right' | 'justify'; // Text alignment for feedback message
  
  // Common interactive properties
  feedbackMessage?: string; // Message shown after user answers
  allowRetry?: boolean; // Whether user can change their answer
  
  // Container properties
  layout?: 'row' | 'column' | 'grid';
  gap?: number;
  padding?: number | string; // Support both numeric and CSS padding shorthand
  paddingTop?: number;
  paddingBottom?: number | string; // Bottom padding (support both for templates)
  paddingLeft?: number | string;
  paddingRight?: number | string;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  
  // Advanced container layout properties
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  gridColumns?: number;
  gridRows?: number;
  gridRow?: number | string; // CSS grid row position (1-based) or span
  gridColumn?: number | string; // CSS grid column position (1-based) or span
  
  // CSS Grid template properties
  gridTemplateColumns?: string; // CSS grid-template-columns
  gridTemplateRows?: string; // CSS grid-template-rows
  gridTemplateAreas?: string; // CSS grid-template-areas
  // Dimensions
  width?: number | string; // value for width (number for specific values, string for CSS keywords like 'max-content')
  height?: number | string; // value for height (number for specific values, string for CSS keywords like 'max-content')
  minHeight?: number; // pixels
  maxHeight?: number; // pixels
  minWidth?: number; // pixels
  maxWidth?: number | string; // pixels or CSS units for text templates
  // Dimension units
  widthUnit?: 'px' | 'vw' | 'dvw' | '%' | 'max-content' | 'min-content' | 'fit-content';
  heightUnit?: 'px' | 'vh' | 'dvh' | 'vw' | 'dvw' | '%' | 'max-content' | 'min-content' | 'fit-content';
  minWidthUnit?: 'px' | 'vw' | 'dvw' | '%';
  minHeightUnit?: 'px' | 'vh' | 'dvh' | 'vw' | 'dvw' | '%';
    // Styling
  backgroundColor?: string;
  background?: string; // CSS background shorthand (gradients, etc.)
  backgroundImage?: string;
  backgroundSize?: 'auto' | 'cover' | 'contain' | '100% 100%' | string;
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right' | string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'space' | 'round';
  backgroundAttachment?: 'scroll' | 'fixed' | 'local';
  borderRadius?: number | string; // allow CSS units strings for templates
  borderTopLeftRadius?: number | string;
  borderTopRightRadius?: number | string;
  borderBottomLeftRadius?: number | string;
  borderBottomRightRadius?: number | string;
  borderWidth?: number | string; // allow CSS units strings for templates
  borderTopWidth?: number | string;
  borderRightWidth?: number | string;
  borderBottomWidth?: number | string;
  borderLeftWidth?: number | string;
  borderColor?: string;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  border?: string; // CSS border shorthand
  borderTop?: string; // CSS border-top shorthand
  borderRight?: string; // CSS border-right shorthand
  borderBottom?: string; // CSS border-bottom shorthand
  borderLeft?: string; // CSS border-left shorthand
  boxShadow?: string; // CSS box-shadow value
  
  // Video properties
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  
  // Background video property
  backgroundVideo?: string;
  
  // Background audio property
  backgroundAudio?: string;
    // Button properties
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: string; // Action identifier
  buttonText?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  href?: string; // For link buttons
  target?: '_self' | '_blank' | '_parent' | '_top'; // Link target
  
  // Advanced styling properties
  cursor?: string; // CSS cursor property
  transition?: string; // CSS transition property
  customCSS?: string; // Custom CSS string
  backgroundImageAlt?: string; // Alt text for background image
  backdropFilter?: string; // CSS backdrop-filter property
  
  // Text-specific advanced properties for templates
  WebkitBackgroundClip?: string; // For gradient text effects
  WebkitTextFillColor?: string; // For gradient text effects
  
  // Advanced layout options
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  
  // Element ordering within parent container
  order?: number; // CSS order property for flexbox/grid ordering
  
  // Positioning properties (for absolute/relative positioned containers)
  top?: number; // pixels from top
  left?: number; // pixels from left
  right?: number; // pixels from right
  bottom?: number; // pixels from bottom
  zIndex?: number; // stacking order
  
  // Responsive behavior
  responsiveMode?: 'desktop' | 'tablet' | 'mobile';
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;
  
  // Drop Area Content Widget Properties
  dropAreaContentStyle?: 'minimal' | 'card' | 'outlined' | 'filled' | 'elevated' | 'gradient';
  
  // Content Layout Properties  
  contentAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  contentPadding?: number;
  contentMargin?: number;
  contentGap?: number;
  
  // Typography Properties for Drop Area Content
  titleSize?: number;
  titleWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  titleColor?: string;
  subtitleSize?: number;
  subtitleWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  subtitleColor?: string;
  textShadow?: string;
  
  // Icon Properties for Drop Area Content
  iconType?: 'target' | 'file' | 'image' | 'video' | 'audio' | 'text' | 'custom';
  iconPosition?: 'top' | 'left' | 'right' | 'bottom' | 'center' | 'none';
  iconBackground?: string;
  iconBorderRadius?: number;
  customIcon?: string; // URL or icon name
  
  // Advanced Visual Effects
  hoverEffect?: 'none' | 'scale' | 'shadow' | 'glow' | 'rotate' | 'bounce';
  hoverScale?: number;
  hoverShadow?: string;
  animation?: 'none' | 'pulse' | 'bounce' | 'spin' | 'fade' | 'slide';
  animationDuration?: number;
  animationDelay?: number;
  
  // Background Enhancements
  backgroundType?: 'solid' | 'gradient' | 'image' | 'pattern';
  gradientDirection?: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-bottom-right' | 'to-bottom-left' | 'to-top-right' | 'to-top-left' | 'radial';
  gradientStartColor?: string;
  gradientEndColor?: string;
  backgroundPattern?: 'dots' | 'grid' | 'stripes' | 'checkers' | 'none';
  patternOpacity?: number;
  patternSize?: number;

  // Drag and Drop Widget Properties
  dropZoneText?: string; // Text displayed in the drop zone
  allowedTypes?: string[]; // Array of allowed element types (empty = accept all)
  maxItems?: number; // Maximum number of items (0 = unlimited)
  orientation?: 'vertical' | 'horizontal' | 'grid'; // Layout orientation
  itemSpacing?: number; // Spacing between dropped items in pixels
  
  // Visual feedback for drag and drop
  dragOverColor?: string; // Background color when dragging over
  dragOverBorder?: string; // Border style when dragging over
  dragOverBorderColor?: string; // Border color when dragging over
  successColor?: string; // Background color on successful drop
  successBorder?: string; // Border style on successful drop
  successBorderColor?: string; // Border color on successful drop
  
  // Animation settings (using existing animationDuration)
  enableAnimations?: boolean; // Whether to enable animations
  
  // Grid layout settings for drag-drop (different from existing grid properties)
  dragDropGridColumns?: number; // Number of columns in drag-drop grid layout
  dragDropGridRows?: number; // Number of rows in drag-drop grid layout (0 = auto)

  // Element Ownership for Drag-Drop Widgets
  ownedBy?: string; // ID of the drag-drop widget that owns this element
  dragDropOwner?: string; // Additional ownership marker for drag-drop relationships
  originalPosition?: { x: number; y: number }; // Store original position for snap-back
  
  // Standalone Draggable Element Properties (similar to ConnectionImageNode)
  standaloneElementType?: 'text' | 'image' | 'mixed'; // Type of standalone element
  standaloneImageUrl?: string; // Image URL for standalone image elements
  standaloneImageAlt?: string; // Alt text for standalone images
  standaloneImageFit?: 'cover' | 'contain' | 'fill' | 'none'; // How image should fit
  standaloneBackgroundTransparent?: boolean; // Whether background should be transparent for images

  // Enhanced Styling Properties for DragDropWidget
  isFullyRounded?: boolean; // When true, makes element completely round (overrides individual corner radius)
  buttonTransparency?: 'transparent' | 'semi-transparent' | 'opaque'; // Controls button transparency level
}

// Export ModulePage type for consistency
export type { ModulePage } from './modulePage';
