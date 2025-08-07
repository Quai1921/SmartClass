/**
 * DOM analysis utilities for debugging and extracting media element information
 * Provides comprehensive analysis of images, audio, video, and file inputs
 */

export class DOMAnalyzer {
  
  // Debug function to analyze DOM media elements
  static debugMediaElements(): void {
    
    // Check all image elements
    const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
    images.forEach((img, index) => {
    });
    
    // Check all audio elements
    const audios = Array.from(document.querySelectorAll('audio')) as HTMLAudioElement[];
    audios.forEach((audio, index) => {
    });
    
    // Check all video elements
    const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
    videos.forEach((video, index) => {
    });
    
    // Check all file inputs
    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')) as HTMLInputElement[];
    fileInputs.forEach((input, index) => {
    });
    
    console.log('🔍 === END MEDIA DEBUG ===');
  }

  // Get all image elements with their metadata
  static getAllImages(): Array<{
    element: HTMLImageElement;
    src: string;
    naturalWidth: number;
    naturalHeight: number;
    complete: boolean;
    elementId: string | null;
  }> {
    const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
    return images.map(img => ({
      element: img,
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      elementId: img.getAttribute('data-element-id')
    }));
  }

  // Get all audio elements with their metadata
  static getAllAudio(): Array<{
    element: HTMLAudioElement;
    src: string;
    readyState: number;
    duration: number;
    elementId: string | null;
  }> {
    const audios = Array.from(document.querySelectorAll('audio')) as HTMLAudioElement[];
    return audios.map(audio => ({
      element: audio,
      src: audio.src,
      readyState: audio.readyState,
      duration: audio.duration,
      elementId: audio.getAttribute('data-element-id')
    }));
  }

  // Get all video elements with their metadata
  static getAllVideos(): Array<{
    element: HTMLVideoElement;
    src: string;
    readyState: number;
    duration: number;
    videoWidth: number;
    videoHeight: number;
    elementId: string | null;
  }> {
    const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
    return videos.map(video => ({
      element: video,
      src: video.src,
      readyState: video.readyState,
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      elementId: video.getAttribute('data-element-id')
    }));
  }

  // Get all file inputs with their files
  static getAllFileInputs(): Array<{
    element: HTMLInputElement;
    files: Array<{
      name: string;
      size: number;
      type: string;
      file: File;
    }>;
    accept: string;
  }> {
    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')) as HTMLInputElement[];
    return fileInputs.map(input => ({
      element: input,
      files: input.files ? Array.from(input.files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        file: f
      })) : [],
      accept: input.accept
    }));
  }

  // Find specific media element by source URL
  static findMediaElementBySrc(src: string, type: 'image' | 'audio' | 'video'): HTMLElement | null {
    const selector = type === 'image' ? 'img' : type;
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    return elements.find(element => (element as any).src === src) || null;
  }

  // Find media element by element ID attribute
  static findMediaElementById(elementId: string, type?: 'image' | 'audio' | 'video'): HTMLElement | null {
    if (type) {
      const selector = type === 'image' ? 'img' : type;
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      return elements.find(element => element.getAttribute('data-element-id') === elementId) || null;
    } else {
      // Search all media types
      const selectors = ['img', 'audio', 'video'];
      for (const selector of selectors) {
        const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
        const found = elements.find(element => element.getAttribute('data-element-id') === elementId);
        if (found) return found;
      }
      return null;
    }
  }

  // Get summary of all media elements in the DOM
  static getMediaSummary(): {
    images: number;
    audio: number;
    videos: number;
    fileInputs: number;
    totalElements: number;
    blobUrls: number;
    dataUrls: number;
    externalUrls: number;
  } {
    const images = DOMAnalyzer.getAllImages();
    const audios = DOMAnalyzer.getAllAudio();
    const videos = DOMAnalyzer.getAllVideos();
    const fileInputs = DOMAnalyzer.getAllFileInputs();

    // Count URL types
    const allSrcs = [
      ...images.map(i => i.src),
      ...audios.map(a => a.src),
      ...videos.map(v => v.src)
    ].filter(Boolean);

    const blobUrls = allSrcs.filter(src => src.startsWith('blob:')).length;
    const dataUrls = allSrcs.filter(src => src.startsWith('data:')).length;
    const externalUrls = allSrcs.filter(src => !src.startsWith('blob:') && !src.startsWith('data:')).length;

    return {
      images: images.length,
      audio: audios.length,
      videos: videos.length,
      fileInputs: fileInputs.length,
      totalElements: images.length + audios.length + videos.length,
      blobUrls,
      dataUrls,
      externalUrls
    };
  }
}
