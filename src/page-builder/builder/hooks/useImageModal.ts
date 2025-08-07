import { useState, useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

export const useImageModal = () => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageChoiceModalOpen, setImageChoiceModalOpen] = useState(false);
  const [targetContainerId, setTargetContainerId] = useState<string | null>(null);
  const [fileManagerImageUrl, setFileManagerImageUrl] = useState<string | null>(null);
  const [imageModalContext, setImageModalContext] = useState<'ADD_ELEMENT' | 'SET_BACKGROUND'>('ADD_ELEMENT');
  const [useAsBackground, setUseAsBackground] = useState(false);

  const { addElement, updateElement, elements } = useBuilder();

  const handleModalClose = useCallback(() => {
    
    setImageModalOpen(false);
    setImageChoiceModalOpen(false);
    setTargetContainerId(null);
    setFileManagerImageUrl(null);
    setImageModalContext('ADD_ELEMENT'); // Reset context to default
    
  }, [imageModalOpen, imageChoiceModalOpen, targetContainerId]);

  // Open the choice modal first when image is dropped
  const openImageChoiceModal = useCallback((containerId: string, context: 'ADD_ELEMENT' | 'SET_BACKGROUND' = 'ADD_ELEMENT') => {
    setTargetContainerId(containerId);
    setImageModalContext(context); // Set the context
    
    // Automatically set useAsBackground to true when context is SET_BACKGROUND
    if (context === 'SET_BACKGROUND') {
      setUseAsBackground(true);
    } else {
      setUseAsBackground(false);
    }
    
    setImageChoiceModalOpen(true);
  }, []);

  const handleFileManagerImageUse = useCallback((imageUrl: string, useAsBackground: boolean) => {
    
    if (targetContainerId) {
      // Check if this is for a connection image node
      const connectionCallback = (window as any).connectionImageCallback;
      const connectionElementId = (window as any).connectionImageElementId;
      
      if (connectionCallback && connectionElementId === targetContainerId) {
        
        // Extract filename from URL to use as alt text
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const altText = filename.replace(/\.[^/.]+$/, ''); // Remove extension
        connectionCallback(imageUrl, altText);
        // Clean up
        (window as any).connectionImageCallback = null;
        (window as any).connectionImageElementId = null;
        handleModalClose();
        return;
      }
      
      if (useAsBackground) {
        
        // Get the current container element to preserve its dimensions and position
        const currentElement = elements.find(el => el.id === targetContainerId);
        
        if (currentElement) {
          // Test different URL formats for CSS compatibility
          const urlFormats = [
            `url("${imageUrl}")`,  // Quoted URL (most compatible)
            `url('${imageUrl}')`,  // Single quoted
            `url(${imageUrl})`     // Unquoted (original)
          ];
          
          // Use the quoted version as default
          const backgroundImageValue = urlFormats[0];
          
          const newProperties = {
            ...currentElement.properties, // Preserve all existing properties
            backgroundImage: backgroundImageValue,
            backgroundSize: 'cover' as const,
            backgroundPosition: 'center' as const,
            backgroundRepeat: 'no-repeat' as const
          };
          
          updateElement(targetContainerId, {
            properties: newProperties
          });
          
          // Immediate verification using fresh element lookup
          const verifyBackgroundImage = () => {
            // Use document query to verify the DOM element
            const domElement = document.querySelector(`[data-element-id="${targetContainerId}"]`);
            if (domElement) {
              const computedStyle = window.getComputedStyle(domElement);
              
              // Test if the URL is accessible
              if (computedStyle.backgroundImage === 'none') {
                
                // Test if image loads
                const testImg = new Image();
                testImg.onload = () => {
                  
                  // Try applying CSS directly to test formats
                  const testDiv = document.createElement('div');
                  testDiv.style.width = '100px';
                  testDiv.style.height = '100px';
                  
                  urlFormats.forEach((format, index) => {
                    testDiv.style.backgroundImage = format;
                    const testStyle = window.getComputedStyle(testDiv);
                  });
                };
                testImg.onerror = () => {
                };
                testImg.src = imageUrl;
              }
            } else {
            }
          };
          
          // Verify immediately and after delays
          setTimeout(verifyBackgroundImage, 10);
          setTimeout(verifyBackgroundImage, 100);
          setTimeout(verifyBackgroundImage, 500);
        } else {
          // console.error('❌ Could not find container element with ID:', targetContainerId);
        }
      } else {
        const imageElement = {
          id: crypto.randomUUID(),
          type: 'image' as const,
          name: 'Image',
          parentId: targetContainerId,
          properties: {
            src: imageUrl,
            alt: '',
            width: 200,
            height: 150,
          },
        };
        
        addElement(imageElement);
      }
    }
    
    handleModalClose();
  }, [targetContainerId, elements, updateElement, addElement]);

  // Handle choice: background or element (modified to check for file manager image)
  const handleImageUseChoice = useCallback((useAsBackground: boolean, imageUrl?: string) => {
    if (imageUrl || fileManagerImageUrl) {
      // Use file manager selected image
      const urlToUse = imageUrl || fileManagerImageUrl;
      handleFileManagerImageUse(urlToUse!, useAsBackground);
    } else {
      // Normal flow - open image upload modal
      setImageChoiceModalOpen(false);
      setImageModalOpen(true);
      setUseAsBackground(useAsBackground);
    }
  }, [fileManagerImageUrl, handleFileManagerImageUse]);

  const handleImageSelect = useCallback((src: string, alt?: string) => {
    
    // Check if this is for a connection image node
    const connectionCallback = (window as any).connectionImageCallback;
    const connectionElementId = (window as any).connectionImageElementId;
    
    if (connectionCallback && connectionElementId === targetContainerId) {
      
      // Extract filename from URL to use as alt text if not provided
      let finalAlt = alt;
      if (!finalAlt && src) {
        const urlParts = src.split('/');
        const filename = urlParts[urlParts.length - 1];
        finalAlt = filename.replace(/\.[^/.]+$/, ''); // Remove extension
      }
      
      connectionCallback(src, finalAlt);
      // Clean up
      (window as any).connectionImageCallback = null;
      (window as any).connectionImageElementId = null;
      handleModalClose();
      return;
    }
    
    // Use the URL as-is since it's already in the correct format
    const transformedSrc = src;
    
    // Properly format the URL for CSS
    let backgroundImageValue;
    if (transformedSrc.startsWith('url(')) {
      backgroundImageValue = transformedSrc;
    } else {
      // Quote the URL to handle special characters
      backgroundImageValue = `url("${transformedSrc}")`;
    }
    
    if (targetContainerId) {
      if (useAsBackground) {
        
        // Test if the URL is accessible
        const testImage = new Image();
        testImage.onload = () => {
        };
        testImage.onerror = (error) => {
        };
        testImage.src = transformedSrc;
        
        // Test the CSS format directly
        
        // Create a test element to validate the CSS
        const testDiv = document.createElement('div');
        try {
          testDiv.style.backgroundImage = backgroundImageValue.replace(/^url\("?/, '').replace(/"?\)$/, '');
          testDiv.style.backgroundImage = `url("${testDiv.style.backgroundImage}")`;
        } catch (error) {
          // console.error('❌ CSS format is invalid:', error);
          // Try alternative format
          try {
            testDiv.style.backgroundImage = `url(${transformedSrc})`;
            backgroundImageValue = `url(${transformedSrc})`;
          } catch (altError) {
            // console.error('❌ Alternative format also failed:', altError);
          }
        }
        
        // Update container's background image        
        updateElement(targetContainerId, {
          properties: {
            backgroundImage: backgroundImageValue,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
        });
        
        // Verify the element was updated
        setTimeout(() => {
          const updatedElement = document.querySelector(`[data-element-id="${targetContainerId}"]`);
          if (updatedElement) {
            const computedStyle = window.getComputedStyle(updatedElement);
          }
        }, 100);
      } else {
        // Create image element
        const imageElement = {
          id: crypto.randomUUID(),
          type: 'image' as const,
          name: 'Image',
          parentId: targetContainerId,
          properties: {
            src,
            alt: alt || '',
            width: 200,
            height: 150,
          },
        };
        
        addElement(imageElement);
      }
    }
    
    handleModalClose();
  }, [targetContainerId, useAsBackground, addElement, updateElement, handleModalClose]);

  // Handle file manager selection (stores URL for choice modal)
  const handleFileManagerSelect = useCallback((imageUrl: string) => {
    setFileManagerImageUrl(imageUrl);
    // The choice modal is already open, user will choose how to use the image
  }, []);

  return {
    imageModalOpen,
    imageChoiceModalOpen,
    targetContainerId,
    fileManagerImageUrl,
    imageModalContext,
    setImageModalOpen,
    setTargetContainerId,
    openImageChoiceModal,
    handleImageUseChoice,
    handleModalClose,
    handleImageSelect,
    handleFileManagerSelect,
  };
};
