import React, { useState, useEffect } from 'react';
import { Mic, MicOff, CheckCircle } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';

interface SpeechRecognitionExtendedProps {
  allowRetry?: boolean;
  showAccuracy?: boolean;
  placeholderText?: string;
  buttonSize?: number;
  buttonColor?: string;
  buttonHoverColor?: string;
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputBorderRadius?: number;
  inputPadding?: number;
}

interface SpeechRecognitionElementProps {
  element: Element;
  isPreviewMode?: boolean;
  isSelected?: boolean;
}

export default function SpeechRecognitionWidget({ element, isPreviewMode }: SpeechRecognitionElementProps) {
  const { updateElement } = useBuilder();
  const extendedProps = ((element as any).props as SpeechRecognitionExtendedProps) || {};
  
  // React Speech Recognition hook (as backup)
  const {
    transcript: hookTranscript,
    listening: hookListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Local state
  const [userSpeech, setUserSpeech] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isLocalListening, setIsLocalListening] = useState(false);
  
  // Native Speech Recognition state
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  // Get styling properties with defaults
  const placeholderText = extendedProps.placeholderText || "Click the microphone to start speaking";
  const buttonSize = extendedProps.buttonSize || 20;
  const buttonColor = extendedProps.buttonColor || '#3b82f6';
  const buttonHoverColor = extendedProps.buttonHoverColor || '#2563eb';
  const inputBackgroundColor = extendedProps.inputBackgroundColor || '#ffffff';
  const inputBorderColor = extendedProps.inputBorderColor || '#d1d5db';
  const inputBorderRadius = extendedProps.inputBorderRadius || 8;
  const inputPadding = extendedProps.inputPadding || 12;

  // Check support on mount
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Initialize native speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsLocalListening(true);
        setError(null);
      };
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        if (finalTranscript) {
          setUserSpeech(finalTranscript.trim());
          setCompleted(true);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        // Handle different error types with user-friendly messages
        switch (event.error) {
          case 'network':
            setError('Network error. Please check your internet connection and try again.');
            break;
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone access and try again.');
            break;
          case 'no-speech':
            setError('No speech detected. Please speak clearly and try again.');
            break;
          case 'audio-capture':
            setError('Audio capture error. Please check your microphone and try again.');
            break;
          case 'service-not-allowed':
            setError('Speech recognition service not allowed. Please try again.');
            break;
          default:
            setError(`Speech recognition error: ${event.error}. Please try again.`);
        }
        setIsLocalListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsLocalListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const startListening = async () => {
    if (!recognition) {
      setError('Speech recognition not available. Please refresh the page and try again.');
      return;
    }

    try {
      setError(null);
      setCompleted(false);
      setUserSpeech('');
      setTranscript('');
      recognition.start();
    } catch (err) {
      // console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition. Please try again.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const toggleRecording = () => {
    if (isLocalListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const updateProps = (newProps: Partial<SpeechRecognitionExtendedProps>) => {
    updateElement(element.id, {
      ...(element as any),
      props: { ...extendedProps, ...newProps }
    } as any);
  };

  return (
    <div className="w-full">
      {/* Main Input Area */}
      <div 
        className="flex items-center gap-2 overflow-hidden"
        style={{
          border: `1px solid ${inputBorderColor}`,
          borderRadius: `${inputBorderRadius}px`
        }}
      >
        {/* Text Area - shows live transcript */}
        <div 
          className="flex-1 min-h-[40px] p-3"
          style={{
            backgroundColor: inputBackgroundColor,
            padding: `${inputPadding}px`
          }}
        >
          {isLocalListening ? (
            <div className="text-gray-800">
              {transcript || (
                <span className="text-gray-400 italic">Listening... speak now</span>
              )}
              {isLocalListening && (
                <span className="inline-block w-1 h-4 bg-blue-500 ml-1 animate-pulse"></span>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              {userSpeech || placeholderText}
            </div>
          )}
        </div>

        {/* Microphone Button */}
        <button
          onClick={toggleRecording}
          disabled={!browserSupportsSpeechRecognition || !!error}
          className="p-3 m-2 rounded-full transition-all duration-200 flex-shrink-0 cursor-pointer"
          style={{
            backgroundColor: isLocalListening 
              ? '#ef4444' // red when listening
              : completed
                ? '#10b981' // green when completed
                : buttonColor,
            opacity: (!browserSupportsSpeechRecognition || error) ? 0.5 : 1,
            cursor: (!browserSupportsSpeechRecognition || error) ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (browserSupportsSpeechRecognition && !error) {
              e.currentTarget.style.backgroundColor = isLocalListening 
                ? '#dc2626' // darker red
                : completed
                  ? '#059669' // darker green
                  : buttonHoverColor;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isLocalListening 
              ? '#ef4444'
              : completed
                ? '#10b981'
                : buttonColor;
          }}
        >
          {isLocalListening ? (
            <MicOff size={buttonSize} className="text-white" />
          ) : completed ? (
            <CheckCircle size={buttonSize} className="text-white" />
          ) : (
            <Mic size={buttonSize} className="text-white" />
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-center">
          <p className="text-red-700 text-xs">{error}</p>
          {error.includes('Network') && (
            <div className="mt-2">
              <button
                onClick={() => {
                  setError(null);
                  if (!isLocalListening) {
                    startListening();
                  }
                }}
                className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          {error.includes('not allowed') && (
            <p className="text-xs text-gray-600 mt-1">
              Please refresh the page and allow microphone access
            </p>
          )}
        </div>
      )}
    </div>
  );
}
