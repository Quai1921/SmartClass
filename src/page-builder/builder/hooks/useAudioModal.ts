import { useState, useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

export const useAudioModal = () => {
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [audioChoiceModalOpen, setAudioChoiceModalOpen] = useState(false);
  const [targetContainerId, setTargetContainerId] = useState<string | null>(null);
  const [targetElementType, setTargetElementType] = useState<'audio' | 'audio-true-false'>('audio');
  const [fileManagerAudioUrl, setFileManagerAudioUrl] = useState<string | null>(null);
  const [audioModalContext, setAudioModalContext] = useState<'ADD_ELEMENT' | 'SET_BACKGROUND'>('ADD_ELEMENT');
  const [pendingBackgroundUsage, setPendingBackgroundUsage] = useState<boolean>(false);

  const { addElement, updateElement, elements } = useBuilder();

  const handleModalClose = useCallback(() => {
    setAudioModalOpen(false);
    setAudioChoiceModalOpen(false);
    setTargetContainerId(null);
    setTargetElementType('audio');
    setFileManagerAudioUrl(null);
    setAudioModalContext('ADD_ELEMENT');
    setPendingBackgroundUsage(false);
  }, []);

  // Open the choice modal first when audio is dropped
  const openAudioChoiceModal = useCallback((containerId: string, context: 'ADD_ELEMENT' | 'SET_BACKGROUND' = 'ADD_ELEMENT', elementType: 'audio' | 'audio-true-false' = 'audio') => {
    setTargetContainerId(containerId);
    setTargetElementType(elementType);
    setAudioModalContext(context);
    setAudioChoiceModalOpen(true);
  }, []);

  const handleFileManagerAudioUse = useCallback((audioUrl: string, useAsBackground: boolean) => {
    if (targetContainerId) {
      // Check if this is for a connection audio node
      const connectionCallback = (window as any).connectionAudioCallback;
      const connectionElementId = (window as any).connectionAudioElementId;
      
      if (connectionCallback && connectionElementId === targetContainerId) {
        
        // Call the global callback with the audio URL
        connectionCallback(audioUrl);
        // Clean up
        (window as any).connectionAudioCallback = null;
        (window as any).connectionAudioElementId = null;
        handleModalClose();
        return;
      }
      
      if (useAsBackground) {
        // Get the current container element to preserve its dimensions and position
        const currentElement = elements.find(el => el.id === targetContainerId);
        if (currentElement) {
          updateElement(targetContainerId, {
            properties: {
              ...currentElement.properties, // Preserve all existing properties
              backgroundAudio: audioUrl,
            }
          });
        }
      } else {
        
        const audioElement = {
          id: crypto.randomUUID(),
          type: targetElementType,
          name: targetElementType === 'audio-true-false' ? 'Audio True/False' : 'Audio',
          properties: {
            src: audioUrl,
            title: 'Audio',
            className: targetElementType === 'audio-true-false' ? 'audio-true-false-element' : 'audio-element',
            style: {
              display: 'block',
              width: '100%',
              height: 'auto',
            },
            // Add default properties for audio-true-false
            ...(targetElementType === 'audio-true-false' && {
              buttonPosition: 'south',
              correctAnswer: true,
              allowRetry: true,
              trueButton: {
                text: 'Verdadero',
                backgroundColor: '#059669',
                color: '#ffffff'
              },
              falseButton: {
                text: 'Falso',
                backgroundColor: '#dc2626',
                color: '#ffffff'
              }
            })
          },
          parentId: targetContainerId,
        };

        addElement(audioElement);
      }
    }
    handleModalClose();
  }, [targetContainerId, targetElementType, addElement, updateElement, elements, handleModalClose]);

  const handleAudioChoice = useCallback((useAsBackground: boolean, audioUrl?: string) => {
    
    if (audioUrl) {
      // Direct audio URL provided (from file drop or URL input)
      handleFileManagerAudioUse(audioUrl, useAsBackground);
    } else if (fileManagerAudioUrl) {
      // Use the file manager audio URL
      handleFileManagerAudioUse(fileManagerAudioUrl, useAsBackground);
    } else {
      // Open upload modal for new audio files
      if (useAsBackground) {
        setPendingBackgroundUsage(true);
      } else {
        setPendingBackgroundUsage(false);
      }
      setAudioModalOpen(true);
      setAudioChoiceModalOpen(false);
    }
  }, [fileManagerAudioUrl, handleFileManagerAudioUse]);

  const handleFileManagerAudioSelect = useCallback((audioUrl: string) => {
    setFileManagerAudioUrl(audioUrl);
    setAudioChoiceModalOpen(true);
  }, []);

  const handleAudioUpload = useCallback((audioData: { src: string; title?: string; alt?: string }) => {
    if (targetContainerId) {
      // Check if this is for a connection audio node
      const connectionCallback = (window as any).connectionAudioCallback;
      const connectionElementId = (window as any).connectionAudioElementId;
      
      if (connectionCallback && connectionElementId === targetContainerId) {
        
        // Call the global callback with the audio URL
        connectionCallback(audioData.src);
        // Clean up
        (window as any).connectionAudioCallback = null;
        (window as any).connectionAudioElementId = null;
        handleModalClose();
        return;
      }
      
      if (pendingBackgroundUsage) {
        const currentElement = elements.find(el => el.id === targetContainerId);
        if (currentElement) {
          updateElement(targetContainerId, {
            properties: {
              ...currentElement.properties,
              backgroundAudio: audioData.src,
            }
          });
        }
      } else {
        const audioElement = {
          id: crypto.randomUUID(),
          type: 'audio' as const,
          name: audioData.title || 'Audio',
          properties: {
            src: audioData.src,
            title: audioData.title || 'Audio',
            className: 'audio-element',
            style: {
              display: 'block',
              width: '100%',
              height: 'auto',
            },
          },
          parentId: targetContainerId,
        };

        addElement(audioElement);
      }
    }
    handleModalClose();
  }, [targetContainerId, addElement, updateElement, elements, pendingBackgroundUsage, handleModalClose]);

  return {
    audioModalOpen,
    audioChoiceModalOpen,
    targetContainerId,
    fileManagerAudioUrl,
    audioModalContext,
    openAudioChoiceModal,
    handleModalClose,
    handleAudioChoice,
    handleFileManagerAudioSelect,
    handleAudioUpload,
  };
};
