import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, RotateCcw, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';

interface SpeechRecognitionExtendedProps {
  targetText?: string;
  allowRetry?: boolean;
  showResult?: boolean;
  autoStart?: boolean;
  feedbackMode?: 'word' | 'sentence' | 'pronunciation';
  minAccuracy?: number;
  maxRecordingTime?: number;
  speechMode?: SpeechRecognitionMode; // 'offline', 'online', 'auto'
  
  // Visual customization
  micButtonColor?: string;
  micButtonSize?: number;
  resultTextColor?: string;
  resultTextSize?: string;
  accuracyBarColor?: string;
  
  // Audio feedback
  playTargetAudio?: boolean;
  successSound?: boolean;
  
  // User interaction state
  userSpeech?: string;
  isRecording?: boolean;
  accuracy?: number;
  completed?: boolean;
  currentService?: string;
}

interface SpeechRecognitionWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
}

export const SpeechRecognitionWidget: React.FC<SpeechRecognitionWidgetProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false
}) => {
  const { updateElement } = useBuilder();
  const { properties } = element;
  const extendedProps = properties as SpeechRecognitionExtendedProps;

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [currentService, setCurrentService] = useState<string>('None');
  const [serviceStatus, setServiceStatus] = useState({
    offline: false,
    online: false,
    current: 'None',
    active: false
  });

  // Refs
  const timeoutRef = useRef<number | null>(null);

  // Calculate dimensions
  const width = parseInt(properties.width?.toString() || '400');
  const height = parseInt(properties.height?.toString() || '300');
  const isCompact = width < 300 || height < 200;

  // Check service status and initialize
  useEffect(() => {
    const initializeServices = async () => {
      
      // Force initialization of offline service
      try {
        await speechService.initializeOfflineService();
      } catch (error) {
        // console.error('Failed to initialize offline service:', error);
      }
      
      // Update status
      const updateStatus = () => {
        const status = speechService.getStatus();
        setServiceStatus(status);
        setCurrentService(status.current);
      };

      updateStatus();
      
      // Update status periodically
      const interval = setInterval(updateStatus, 3000);
      
      return () => clearInterval(interval);
    };

    const cleanup = initializeServices();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setError(null);
      const status = speechService.getStatus();
      setServiceStatus(status);
    };

    const handleOffline = () => {
      if (currentService.includes('Online')) {
        setError('Lost internet connection');
      }
      const status = speechService.getStatus();
      setServiceStatus(status);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentService]);

  // Calculate word accuracy
  const calculateAccuracy = (spoken: string, target: string) => {
    if (!target.trim()) return 0;
    
    const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
    const targetWords = target.toLowerCase().trim().split(/\s+/);
    
    let correctWords = 0;
    
    for (let i = 0; i < Math.min(spokenWords.length, targetWords.length); i++) {
      if (spokenWords[i] === targetWords[i]) {
        correctWords++;
      }
    }
    
    const accuracyPercentage = targetWords.length > 0 ? Math.round((correctWords / targetWords.length) * 100) : 0;
    setAccuracy(accuracyPercentage);
    
    // Check if completed successfully
    const minAccuracy = extendedProps.minAccuracy || 80;
    if (accuracyPercentage >= minAccuracy) {
      setCompleted(true);
      setTimeout(() => stopRecording(), 1000); // Stop after 1 second delay
    }
    
    return accuracyPercentage;
  };

  // Start recording with unified service
  const startRecording = async () => {
    if (isRecording) return;
    
    try {
      setError(null);
      setUserSpeech('');
      setAccuracy(0);
      setCompleted(false);
      
      const mode = extendedProps.speechMode || 'auto';
      
      const result = await speechService.startRecognition(
        (text: string) => {
          setUserSpeech(text);
          calculateAccuracy(text, extendedProps.targetText || '');
        },
        (error: string) => {
          setError(error);
          setIsRecording(false);
        },
        mode
      );
      
      if (result.success) {
        setIsRecording(true);
        setCurrentService(result.service);
        
        // Set timeout for max recording time
        const maxTime = extendedProps.maxRecordingTime || 30000;
        timeoutRef.current = setTimeout(() => {
          stopRecording();
          if (!userSpeech.trim()) {
            setError('Recording timeout - No speech detected');
          }
        }, maxTime);
      } else {
        setError('Failed to start speech recognition');
      }
      
    } catch (err) {
      // console.error('Failed to start recording:', err);
      setError('Failed to start recording - Please try again');
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    speechService.stopRecognition();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsRecording(false);
    setCurrentService(speechService.getCurrentService());
    
    // Update element with results
    updateElement(element.id, {
      properties: {
        ...properties,
        userSpeech: userSpeech,
        accuracy: accuracy,
        completed: completed,
        isRecording: false,
        currentService: currentService
      } as any
    });
  };

  // Reset widget
  const resetWidget = () => {
    setUserSpeech('');
    setAccuracy(0);
    setCompleted(false);
    setError(null);
    
    updateElement(element.id, {
      properties: {
        ...properties,
        userSpeech: '',
        accuracy: 0,
        completed: false,
        isRecording: false
      } as any
    });
  };

  // Play target audio (Text-to-Speech)
  const playTargetAudio = () => {
    if (!extendedProps.targetText) return;
    
    const utterance = new SpeechSynthesisUtterance(extendedProps.targetText);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Slower for learning
    speechSynthesis.speak(utterance);
  };

  // Component styles
  const containerStyles: React.CSSProperties = {
    width: properties.width || '400px',
    height: properties.height || '300px',
    backgroundColor: properties.backgroundColor || '#f8fafc',
    border: (properties as any).showBorder ? '2px solid #e2e8f0' : 'none',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isCompact ? '12px' : '20px',
    gap: isCompact ? '8px' : '12px',
    position: 'relative',
    boxShadow: isSelected ? '0 0 0 2px #3b82f6' : '0 2px 8px rgba(0,0,0,0.1)',
  };

  const micButtonSize = extendedProps.micButtonSize || (isCompact ? 48 : 64);

  return (
    <div style={containerStyles}>
      {/* Target Text Display */}
      {extendedProps.targetText && (
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600">Say:</span>
            {extendedProps.playTargetAudio && (
              <button
                onClick={playTargetAudio}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Play audio"
              >
                <Volume2 size={16} className="text-blue-600" />
              </button>
            )}
          </div>
          <p 
            className="font-medium text-gray-800"
            style={{ 
              fontSize: extendedProps.resultTextSize || (isCompact ? '14px' : '16px'),
              color: extendedProps.resultTextColor || '#1f2937'
            }}
          >
            "{extendedProps.targetText}"
          </p>
        </div>
      )}

      {/* Microphone Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={(!serviceStatus.offline && !serviceStatus.online) || isPreviewMode}
        className={`rounded-full flex items-center justify-center transition-all duration-200 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        } ${(!serviceStatus.offline && !serviceStatus.online) || isPreviewMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          width: micButtonSize,
          height: micButtonSize,
          backgroundColor: isRecording 
            ? '#ef4444' 
            : (extendedProps.micButtonColor || '#3b82f6')
        }}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <MicOff size={micButtonSize * 0.4} className="text-white" />
        ) : (
          <Mic size={micButtonSize * 0.4} className="text-white" />
        )}
      </button>

      {/* Service Status Indicator */}
      {currentService !== 'None' && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <Wifi size={12} className="text-blue-600" />
          <span className="text-blue-600">Online Mode</span>
        </div>
      )}

      {/* Connection Status for Development */}
      {!isPreviewMode && (
        <div className="text-xs text-gray-500 text-center space-y-2">
          <div>
            Status: {serviceStatus.online ? '✅ Ready' : '❌ Not Available'}
          </div>
          <div>
            Service: {currentService}
          </div>
        </div>
      )}

      {/* Status Text */}
      <p className="text-sm text-gray-600 text-center">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : isRecording ? (
          <span className="text-blue-600">🎤 Listening...</span>
        ) : completed ? (
          <span className="text-green-600">✅ Great job!</span>
        ) : (serviceStatus.offline || serviceStatus.online) ? (
          'Click the microphone to start'
        ) : (
          'Speech recognition not available'
        )}
      </p>

      {/* Network Error Help */}
      {error && error.includes('Network') && (
        <div className="text-center space-y-2">
          <div className="text-xs text-gray-600">
            Try these solutions:
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={async () => {
                setError(null);
                const mode = extendedProps.speechMode || 'auto';
                const result = await speechService.startRecognition(
                  (text: string) => {
                    setUserSpeech(text);
                    calculateAccuracy(text, extendedProps.targetText || '');
                  },
                  (error: string) => {
                    setError(error);
                    setIsRecording(false);
                  },
                  'test' as any // Use test mode
                );
                
                if (result.success) {
                  setIsRecording(true);
                  setCurrentService(result.service);
                }
              }}
              className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
            >
              🧪 Try Test Mode (Demo)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Refresh page and try again
            </button>
            <button
              onClick={async () => {
                setError(null);
                // Test network connectivity
                try {
                  await fetch('https://www.google.com/favicon.ico', { method: 'HEAD', mode: 'no-cors' });
                  setError('Network test passed - Please try recording again');
                } catch (e) {
                  setError('Network test failed - Check your internet connection');
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Test network connection
            </button>
            <div className="text-xs text-gray-500">
              Speech recognition requires internet access
            </div>
          </div>
        </div>
      )}

      {/* General Error Help */}
      {error && !error.includes('Network') && (
        <div className="text-center">
          <button
            onClick={() => {
              setError(null);
              setUserSpeech('');
              setAccuracy(0);
              setCompleted(false);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Clear error and try again
          </button>
        </div>
      )}

      {/* Connection Status Indicator */}
      {!navigator.onLine && (
        <div className="flex items-center justify-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>Offline - Internet required</span>
        </div>
      )}

      {/* User Speech Display */}
      {userSpeech && (
        <div className="w-full text-center">
          <p className="text-xs text-gray-500 mb-1">You said:</p>
          <p 
            className="font-medium text-gray-700 italic"
            style={{ fontSize: isCompact ? '12px' : '14px' }}
          >
            "{userSpeech}"
          </p>
        </div>
      )}

      {/* Accuracy Bar */}
      {userSpeech && extendedProps.showResult !== false && (
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Accuracy</span>
            <span className="text-xs font-medium text-gray-700">{accuracy}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${accuracy}%`,
                backgroundColor: accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(completed || userSpeech) && extendedProps.allowRetry !== false && (
        <div className="flex gap-2">
          <button
            onClick={resetWidget}
            className="flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            title="Try again"
          >
            <RotateCcw size={14} />
            {!isCompact && 'Try Again'}
          </button>
        </div>
      )}

      {/* Success/Error Icons */}
      {completed && (
        <div className="absolute top-2 right-2">
          {accuracy >= (extendedProps.minAccuracy || 80) ? (
            <CheckCircle size={24} className="text-green-500" />
          ) : (
            <XCircle size={24} className="text-red-500" />
          )}
        </div>
      )}
    </div>
  );
};
