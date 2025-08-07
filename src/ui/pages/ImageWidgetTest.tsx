import React, { useState } from 'react';
import { ImageWidget } from '../../page-builder/components/ImageWidget';
import type { Element } from '../../page-builder/types';

export const ImageWidgetTest: React.FC = () => {  const [imageElement, setImageElement] = useState<Element>({
    id: 'test-image-1',
    name: 'Imagen 1',
    type: 'image',
    properties: {
      src: '',
      alt: '',
      className: 'max-w-full h-auto mb-4'
    }
  });

  const [imageElementWithSrc, setImageElementWithSrc] = useState<Element>({
    id: 'test-image-2',
    name: 'Imagen 2',
    type: 'image',
    properties: {
      src: 'https://picsum.photos/400/300',
      alt: 'Imagen de ejemplo',
      className: 'max-w-full h-auto mb-4'
    }
  });

  const handleUpdate = (elementId: string) => (updates: Partial<Element['properties']>) => {
    if (elementId === 'test-image-1') {
      setImageElement(prev => ({
        ...prev,
        properties: { ...prev.properties, ...updates }
      }));
    } else {
      setImageElementWithSrc(prev => ({
        ...prev,
        properties: { ...prev.properties, ...updates }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ImageWidget Test Page</h1>
        
        <div className="space-y-12">
          {/* Test 1: Empty Image Widget (should show placeholder) */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Test 1: Empty Image Widget (Placeholder State)
            </h2>
            <p className="text-gray-600 mb-4">
              This should show the "+" placeholder with drag-and-drop and click functionality:
            </p>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <ImageWidget
                element={imageElement}
                isSelected={false}
                onUpdate={handleUpdate('test-image-1')}
              />
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <strong>Current properties:</strong>
              <pre className="mt-1">{JSON.stringify(imageElement.properties, null, 2)}</pre>
            </div>
          </section>

          {/* Test 2: Selected Empty Image Widget */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Test 2: Selected Empty Image Widget
            </h2>
            <p className="text-gray-600 mb-4">
              Same as above but with isSelected=true (should show blue border):
            </p>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <ImageWidget
                element={imageElement}
                isSelected={true}
                onUpdate={handleUpdate('test-image-1')}
              />
            </div>
          </section>

          {/* Test 3: Image Widget with existing image */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Test 3: Image Widget with Existing Image
            </h2>
            <p className="text-gray-600 mb-4">
              This should show an actual image with hover controls:
            </p>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <ImageWidget
                element={imageElementWithSrc}
                isSelected={true}
                onUpdate={handleUpdate('test-image-2')}
              />
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <strong>Current properties:</strong>
              <pre className="mt-1">{JSON.stringify(imageElementWithSrc.properties, null, 2)}</pre>
            </div>
          </section>

          {/* Test 4: Manual Element Creation Test */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Test 4: Element Factory Test
            </h2>
            <p className="text-gray-600 mb-4">
              Test creating a new image element like the sidebar would:
            </p>            <button
              onClick={() => {
                const newElement: Element = {
                  id: `test-${Date.now()}`,
                  name: `Imagen ${Date.now()}`,
                  type: 'image',
                  properties: {
                    src: '',
                    alt: '',
                    className: 'max-w-full h-auto mb-4'
                  }
                };
                setImageElement(newElement);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create New Empty Image Element
            </button>
          </section>

          {/* Debug Info */}
          <section className="bg-gray-800 text-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-2 text-sm font-mono">
              <div>Empty element hasImage: {imageElement.properties.src ? 'true' : 'false'}</div>
              <div>Empty element src: "{imageElement.properties.src}"</div>
              <div>With image hasImage: {imageElementWithSrc.properties.src ? 'true' : 'false'}</div>
              <div>With image src: "{imageElementWithSrc.properties.src}"</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
