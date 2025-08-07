import React, { useState, useEffect } from 'react';
import { Eye, Palette, Type, Settings } from 'lucide-react';
import type { Element } from '../../../types';
import { BasicTab } from './components/BasicTab';
import { StylingTab } from './components/StylingTab';
import { TemplatesTab } from './components/TemplatesTab';

export interface TextElementPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: unknown) => void;
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void;
  initialTab?: 'basic' | 'styling' | 'templates';
}

export const RefactoredTextElementProperties: React.FC<TextElementPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate,
  initialTab = 'basic',
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'styling' | 'templates'>(initialTab);

  // Update active tab when initialTab changes (e.g., when "Configuración" is clicked)
  useEffect(() => {
    console.log('🔧 TextElementProperties: initialTab changed to:', initialTab);
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="property-section">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'basic'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Settings size={16} />
          <span>Básico</span>
        </button>
        <button
          onClick={() => setActiveTab('styling')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'styling'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Type size={16} />
          <span>Estilo</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Palette size={16} />
          <span>Plantillas</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && (
        <BasicTab
          element={element}
          onPropertyChange={onPropertyChange}
          onElementUpdate={onElementUpdate}
        />
      )}
      {activeTab === 'styling' && (
        <StylingTab
          element={element}
          onPropertyChange={onPropertyChange}
        />
      )}
      {activeTab === 'templates' && (
        <TemplatesTab
          element={element}
          onPropertyChange={onPropertyChange}
        />
      )}
    </div>
  );
}; 