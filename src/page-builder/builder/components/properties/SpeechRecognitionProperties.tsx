import React, { useState } from 'react';
import type { Element } from '../../../types';

interface SpeechRecognitionPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate: (elementId: string, updates: any) => void;
}

export const SpeechRecognitionProperties: React.FC<SpeechRecognitionPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate
}) => {
  const { properties } = element;
  const [activeTab, setActiveTab] = useState<'basic' | 'styling' | 'advanced'>('basic');

  // Cast properties for custom properties
  const customProps = properties as any;

  return (
    <div className="w-80 bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-blue-400">Speech Recognition</h2>
      
      {/* Important Notice */}
      <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 <strong>Internet Required:</strong> This widget uses Web Speech API which requires an active internet connection for speech processing.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
        {(['basic', 'styling', 'advanced'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Placeholder Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Placeholder Text
            </label>
            <input
              type="text"
              value={customProps.placeholderText || ''}
              onChange={(e) => onPropertyChange('placeholderText', e.target.value)}
              placeholder="Click the microphone to start speaking"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Text shown when no speech has been recorded
            </p>
          </div>

          {/* Allow Retry */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customProps.allowRetry || false}
                onChange={(e) => onPropertyChange('allowRetry', e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">Allow Retry</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Allow users to retry speech recognition after errors
            </p>
          </div>

          {/* Show Accuracy */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customProps.showAccuracy || false}
                onChange={(e) => onPropertyChange('showAccuracy', e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">Show Accuracy</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Display accuracy percentage after speech recognition
            </p>
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Button Size */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Button Size</span>
              <span>{customProps.buttonSize || 20}px</span>
            </label>
            <input
              type="range"
              min="16"
              max="32"
              step="2"
              value={customProps.buttonSize || 20}
              onChange={(e) => onPropertyChange('buttonSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>16px (Small)</span>
              <span>32px (Large)</span>
            </div>
          </div>

          {/* Button Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Button Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customProps.buttonColor || '#3b82f6'}
                onChange={(e) => onPropertyChange('buttonColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={customProps.buttonColor || '#3b82f6'}
                onChange={(e) => onPropertyChange('buttonColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* Button Hover Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Button Hover Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customProps.buttonHoverColor || '#2563eb'}
                onChange={(e) => onPropertyChange('buttonHoverColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={customProps.buttonHoverColor || '#2563eb'}
                onChange={(e) => onPropertyChange('buttonHoverColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#2563eb"
              />
            </div>
          </div>

          {/* Input Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Input Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customProps.inputBackgroundColor || '#ffffff'}
                onChange={(e) => onPropertyChange('inputBackgroundColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={customProps.inputBackgroundColor || '#ffffff'}
                onChange={(e) => onPropertyChange('inputBackgroundColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Input Border Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Input Border Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customProps.inputBorderColor || '#d1d5db'}
                onChange={(e) => onPropertyChange('inputBorderColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={customProps.inputBorderColor || '#d1d5db'}
                onChange={(e) => onPropertyChange('inputBorderColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#d1d5db"
              />
            </div>
          </div>

          {/* Input Border Radius */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Input Border Radius</span>
              <span>{customProps.inputBorderRadius || 8}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={customProps.inputBorderRadius || 8}
              onChange={(e) => onPropertyChange('inputBorderRadius', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px (Square)</span>
              <span>20px (Rounded)</span>
            </div>
          </div>

          {/* Input Padding */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Input Padding</span>
              <span>{customProps.inputPadding || 12}px</span>
            </label>
            <input
              type="range"
              min="8"
              max="24"
              step="2"
              value={customProps.inputPadding || 12}
              onChange={(e) => onPropertyChange('inputPadding', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8px (Compact)</span>
              <span>24px (Spacious)</span>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Speech Recognition Language
            </label>
            <select
              value={customProps.language || 'en-US'}
              onChange={(e) => onPropertyChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish (Spain)</option>
              <option value="es-MX">Spanish (Mexico)</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="pt-BR">Portuguese (Brazil)</option>
              <option value="ru-RU">Russian</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese (Simplified)</option>
              <option value="zh-TW">Chinese (Traditional)</option>
            </select>
          </div>

          {/* Continuous Mode */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customProps.continuous || true}
                onChange={(e) => onPropertyChange('continuous', e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">Continuous Recognition</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Keep listening until manually stopped
            </p>
          </div>

          {/* Interim Results */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customProps.interimResults || true}
                onChange={(e) => onPropertyChange('interimResults', e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-300">Show Interim Results</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Display partial results while speaking
            </p>
          </div>

          {/* Max Alternatives */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Recognition Alternatives
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={customProps.maxAlternatives || 1}
              onChange={(e) => onPropertyChange('maxAlternatives', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Number of alternative transcriptions to consider
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
