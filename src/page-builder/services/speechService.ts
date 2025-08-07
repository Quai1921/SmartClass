// Unified Speech Recognition Service - prioritizes simple Web Speech API
import { simpleWebSpeechService } from './simpleWebSpeechService';
import { voskOfflineService } from './voskOfflineService';
import { webSpeechService } from './webSpeechService';
import { testSpeechService } from './testSpeechService';

export type SpeechRecognitionMode = 'online' | 'offline' | 'auto' | 'test';

export class UnifiedSpeechService {
  private currentService: 'simple' | 'vosk' | 'webspeech' | 'test' | null = null;
  private isActive = false;
  private failureCount = 0;

  constructor() {
    // Initialize the simple service
    simpleWebSpeechService.initialize();
  }

  async startRecognition(
    onResult: (text: string) => void, 
    onError: (error: string) => void,
    mode: SpeechRecognitionMode = 'auto'
  ): Promise<{ success: boolean; service: string }> {
    
    if (this.isActive) {
      this.stopRecognition();
    }

    // Test mode for debugging
    if (mode === 'test') {
      const success = await testSpeechService.startRecognition(onResult, onError);
      if (success) {
        this.currentService = 'test';
        this.isActive = true;
        return { success: true, service: 'Test Mode (Demo)' };
      }
    }

    // Priority 1: Simple Web Speech API (most reliable)
    if (mode === 'online' || mode === 'auto') {
      
      if (simpleWebSpeechService.isAvailable()) {
        const success = await simpleWebSpeechService.startRecognition(
          onResult, 
          (error) => {
            this.failureCount++;
            
            // After 2 failures, suggest test mode
            if (this.failureCount >= 2) {
              onError(`${error}\n\n🧪 Tip: You can use Test Mode to try the widget functionality without speech recognition.`);
            } else {
              onError(error);
            }
          }
        );
        
        if (success) {
          this.currentService = 'simple';
          this.isActive = true;
          this.failureCount = 0; // Reset on success
          return { success: true, service: 'Web Speech API (Simple)' };
        }
      }
    }

    // Priority 2: Try offline Vosk (if specifically requested)
    if (mode === 'offline') {
      
      const voskInitialized = await voskOfflineService.initialize();
      if (voskInitialized && voskOfflineService.isAvailable()) {
        const success = await voskOfflineService.startRecognition(onResult, onError);
        if (success) {
          this.currentService = 'vosk';
          this.isActive = true;
          return { success: true, service: 'Vosk (Offline)' };
        }
      }
    }

    // No service available
   
    const errorMsg = mode === 'offline' 
      ? 'Offline speech recognition not available' 
      : 'Speech recognition not available - check internet connection or try Test Mode';
    onError(errorMsg);
    return { success: false, service: 'None' };
  }

  stopRecognition(): void {
    if (!this.isActive) return;

    if (this.currentService === 'simple') {
      simpleWebSpeechService.stopRecognition();
    } else if (this.currentService === 'vosk') {
      voskOfflineService.stopRecognition();
    } else if (this.currentService === 'webspeech') {
      webSpeechService.stopRecognition();
    } else if (this.currentService === 'test') {
      testSpeechService.stopRecognition();
    }

    this.currentService = null;
    this.isActive = false;

  }

  getCurrentService(): string {
    if (!this.isActive) return 'None';
    
    switch (this.currentService) {
      case 'simple':
        return 'Web Speech API (Simple)';
      case 'vosk':
        return 'Vosk (Offline)';
      case 'webspeech':
        return 'Web Speech API (Legacy)';
      case 'test':
        return 'Test Mode (Demo)';
      default:
        return 'None';
    }
  }

  isOfflineAvailable(): boolean {
    // For now, we'll show offline as not available since it's not working reliably
    return false;
  }

  isOnlineAvailable(): boolean {
    return simpleWebSpeechService.isAvailable();
  }

  getStatus(): {
    offline: boolean;
    online: boolean;
    current: string;
    active: boolean;
  } {
    return {
      offline: this.isOfflineAvailable(),
      online: this.isOnlineAvailable(),
      current: this.getCurrentService(),
      active: this.isActive
    };
  }

  // Public method for manual initialization
  async initializeOfflineService(): Promise<boolean> {
    return false; // Offline not working reliably yet
  }
}

export const speechService = new UnifiedSpeechService();
