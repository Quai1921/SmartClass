import { useState, useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

export const useVideoModal = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoChoiceModalOpen, setVideoChoiceModalOpen] = useState(false);
  const [targetContainerId, setTargetContainerId] = useState<string | null>(null);
  const [fileManagerVideoUrl, setFileManagerVideoUrl] = useState<string | null>(null);
  const [videoModalContext, setVideoModalContext] = useState<'ADD_ELEMENT' | 'SET_BACKGROUND'>('ADD_ELEMENT');
  const [pendingBackgroundUsage, setPendingBackgroundUsage] = useState<boolean>(false);

  const { addElement, updateElement, elements } = useBuilder();

  const handleModalClose = useCallback(() => {
    setVideoModalOpen(false);
    setVideoChoiceModalOpen(false);
    setTargetContainerId(null);
    setFileManagerVideoUrl(null);
    setVideoModalContext('ADD_ELEMENT');
    setPendingBackgroundUsage(false);
  }, []);

  // Open the choice modal first when video is dropped
  const openVideoChoiceModal = useCallback((containerId: string, context: 'ADD_ELEMENT' | 'SET_BACKGROUND' = 'ADD_ELEMENT') => {
    setTargetContainerId(containerId);
    setVideoModalContext(context);
    setVideoChoiceModalOpen(true);
  }, []);

  const handleFileManagerVideoUse = useCallback((videoUrl: string, useAsBackground: boolean) => {
    if (targetContainerId) {
      if (useAsBackground) {
        // Get the current container element to preserve its dimensions and position
        const currentElement = elements.find(el => el.id === targetContainerId);
        if (currentElement) {
          updateElement(targetContainerId, {
            properties: {
              ...currentElement.properties, // Preserve all existing properties
              backgroundVideo: videoUrl,
              // Note: CSS background-video is not standard, so this might need custom handling
            }
          });
        }
      } else {
        const videoElement = {
          id: crypto.randomUUID(),
          type: 'video' as const,
          name: 'Video',
          properties: {
            src: videoUrl,
            controls: true,
            autoplay: false,
            loop: false,
            muted: false,
            className: 'mb-4',  // Removed w-full to allow auto sizing
            height: 400,  // Fixed height
            heightUnit: 'px' as const,
            // No width properties - let video size itself
            minHeight: 400
          },
          parentId: targetContainerId
        };
        
        addElement(videoElement);
      }
    }
    handleModalClose();
  }, [targetContainerId, addElement, updateElement, elements, handleModalClose]);

  const handleVideoChoice = useCallback((useAsBackground: boolean, videoUrl?: string) => {
    if (videoUrl) {
      // Direct video URL provided (e.g., from file manager selection)
      handleFileManagerVideoUse(videoUrl, useAsBackground);
    } else {
      // Store the intended usage and open upload modal for new video
      setPendingBackgroundUsage(useAsBackground);
      setVideoModalOpen(true);
      setVideoChoiceModalOpen(false); // Close choice modal when opening upload modal
    }
  }, [handleFileManagerVideoUse]);

  const handleVideoUpload = useCallback((videoUrl: string, title?: string) => {
    const useAsBackground = pendingBackgroundUsage;
    if (targetContainerId) {
      if (useAsBackground) {
        const currentElement = elements.find(el => el.id === targetContainerId);
        if (currentElement) {
          updateElement(targetContainerId, {
            properties: {
              ...currentElement.properties,
              backgroundVideo: videoUrl,
            }
          });
        }
      } else {
        const videoElement = {
          id: crypto.randomUUID(),
          type: 'video' as const,
          name: 'Video',
          properties: {
            src: videoUrl,
            controls: true,
            autoplay: false,
            loop: false,
            muted: false,
            className: 'mb-4',  // Removed w-full to allow auto sizing
            height: 400,  // Fixed height
            heightUnit: 'px' as const,
            // No width properties - let video size itself
            minHeight: 400
          },
          parentId: targetContainerId
        };
        
        addElement(videoElement);
      }
    }
    handleModalClose();
  }, [targetContainerId, addElement, updateElement, elements, handleModalClose, pendingBackgroundUsage]);

  return {
    videoModalOpen,
    videoChoiceModalOpen,
    targetContainerId,
    fileManagerVideoUrl,
    videoModalContext,
    openVideoChoiceModal,
    handleModalClose,
    handleVideoChoice,
    handleVideoUpload,
    handleFileManagerVideoUse
  };
};
