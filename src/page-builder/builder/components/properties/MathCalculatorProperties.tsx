import React, { useState } from 'react';
import type { Element } from '../../../types';

interface MathCalculatorPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

export const MathCalculatorProperties: React.FC<MathCalculatorPropertiesProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.properties as any;
  const [activeTab, setActiveTab] = useState<'content' | 'styling' | 'behavior'>('content');

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'styling', label: 'Styling' },
    { id: 'behavior', label: 'Behavior' }
  ];

  // Toggle Switch Component
  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    label, 
    description 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    label: string; 
    description?: string; 
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Color Picker Component
  const ColorPicker = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Math Calculator Widget</h4>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-600">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Tab */}
      <div className={`space-y-6 ${activeTab === 'content' ? '' : 'hidden'}`}>
        {/* Widget Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Widget Title</label>
          <input
            type="text"
            value={properties.title || 'Math Calculator'}
            onChange={(e) => onPropertyChange('title', e.target.value)}
            placeholder="Math Calculator"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Show Title Toggle */}
        <ToggleSwitch
          checked={properties.showTitle !== false}
          onChange={(checked) => onPropertyChange('showTitle', checked)}
          label="Show Widget Title"
          description="Display the title at the top of the calculator"
        />

        {/* Calculator Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Calculator Mode</label>
          <select
            value={properties.calculatorMode || 'basic'}
            onChange={(e) => onPropertyChange('calculatorMode', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="basic">🔢 Basic - Arithmetic operations</option>
            <option value="algebra">📐 Algebra - Symbolic math</option>
            <option value="calculus">∫ Calculus - Derivatives & integrals</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Changes available functions and calculation capabilities
          </p>
        </div>
      </div>

      {/* Styling Tab */}
      <div className={`space-y-6 ${activeTab === 'styling' ? '' : 'hidden'}`}>
        {/* Text Styling */}
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Text Style</h5>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
              <select
                value={properties.fontSize || 'text-base'}
                onChange={(e) => onPropertyChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text-xs">Extra Small</option>
                <option value="text-sm">Small</option>
                <option value="text-base">Normal</option>
                <option value="text-lg">Large</option>
                <option value="text-xl">Extra Large</option>
                <option value="text-2xl">2X Large</option>
              </select>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Font Family</label>
              <select
                value={properties.fontFamily || 'font-mono'}
                onChange={(e) => onPropertyChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="font-mono">Monospace</option>
                <option value="font-sans">Sans Serif</option>
                <option value="font-serif">Serif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Container Styling */}
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Container Style</h5>
          
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <select
              value={properties.theme || 'dark'}
              onChange={(e) => {
                const theme = e.target.value;
                onPropertyChange('theme', theme);
                // Auto-update colors based on theme
                if (theme === 'dark') {
                  onPropertyChange('backgroundColor', '#1f2937');
                } else {
                  onPropertyChange('backgroundColor', '#ffffff');
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dark">🌙 Dark Mode (Recommended)</option>
              <option value="light">☀️ Light Mode</option>
              <option value="custom">🎨 Custom</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Dark mode provides a modern, professional appearance
            </p>
          </div>
          
          <ColorPicker
            label="Background Color"
            value={properties.backgroundColor || '#1f2937'}
            onChange={(value) => onPropertyChange('backgroundColor', value)}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Border Radius</label>
              <input
                type="range"
                min="0"
                max="20"
                value={properties.borderRadius || 12}
                onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{properties.borderRadius || 12}px</div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Padding</label>
              <input
                type="range"
                min="8"
                max="32"
                value={properties.padding || 24}
                onChange={(e) => onPropertyChange('padding', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{properties.padding || 24}px</div>
            </div>
          </div>
        </div>
      </div>

      {/* Behavior Tab */}
      <div className={`space-y-6 ${activeTab === 'behavior' ? '' : 'hidden'}`}>
        {/* History Settings */}
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">History Settings</h5>
          
          <ToggleSwitch
            checked={properties.allowHistory !== false}
            onChange={(checked) => onPropertyChange('allowHistory', checked)}
            label="Enable History"
            description="Allow users to view and reuse previous calculations"
          />

          {properties.allowHistory !== false && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max History Items</label>
              <input
                type="number"
                min="1"
                max="50"
                value={properties.maxHistoryItems || 10}
                onChange={(e) => onPropertyChange('maxHistoryItems', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of calculations to store in history
              </p>
            </div>
          )}
        </div>

        {/* Layout Settings */}
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Layout Settings</h5>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">History Layout</label>
            <select
              value={properties.historyLayout || 'sidebar'}
              onChange={(e) => onPropertyChange('historyLayout', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sidebar">📱 Right Sidebar (Recommended)</option>
              <option value="bottom">📄 Below Calculator</option>
              <option value="popup">🗂️ Popup Modal</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose how calculation history is displayed
            </p>
          </div>

          <ToggleSwitch
            checked={properties.responsiveLayout !== false}
            onChange={(checked) => onPropertyChange('responsiveLayout', checked)}
            label="Responsive Layout"
            description="Automatically adjust layout for mobile devices"
          />
        </div>

        {/* User Interface Settings */}
        <div className="space-y-4">
          <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Interface Settings</h5>
          
          <ToggleSwitch
            checked={properties.showQuickButtons !== false}
            onChange={(checked) => onPropertyChange('showQuickButtons', checked)}
            label="Show Quick Symbol Buttons"
            description="Display buttons for common mathematical symbols"
          />

          <ToggleSwitch
            checked={properties.showVirtualKeyboard !== false}
            onChange={(checked) => onPropertyChange('showVirtualKeyboard', checked)}
            label="Virtual Keyboard Button"
            description="Show button to toggle MathLive virtual keyboard"
          />

          <ToggleSwitch
            checked={properties.autoCalculate === true}
            onChange={(checked) => onPropertyChange('autoCalculate', checked)}
            label="Auto Calculate"
            description="Automatically calculate as user types (experimental)"
          />
        </div>
      </div>
    </div>
  );
};
