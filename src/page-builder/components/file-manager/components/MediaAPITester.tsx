import React, { useState } from 'react';
import { MediaAPIService } from '../services/mediaAPI';
import { fileManagerConfig } from '../config/fileManagerConfig';

/**
 * Development component to test the Media API integration
 * Only shown in development mode
 */
export const MediaAPITester: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!fileManagerConfig.ui.enableDebugMode) {
    return null;
  }

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true);
    setTestResults(prev => ({ ...prev, [testName]: 'Running...' }));
    
    try {
      const result = await testFn();
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: `✅ Success: ${JSON.stringify(result, null, 2)}` 
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testHealth = () => runTest('health', async () => {
    const response = await fetch('/api/media/health', { method: 'HEAD' });
    return { status: response.status, ok: response.ok };
  });

  const testList = () => runTest('list', async () => {
    return await MediaAPIService.getFilesAndFolders('');
  });

  const testCreateFolder = () => runTest('createFolder', async () => {
    return await MediaAPIService.createFolder('test-folder-' + Date.now(), '');
  });

  const testSearch = () => runTest('search', async () => {
    return await MediaAPIService.searchFiles('test', '');
  });

  const testFilter = () => runTest('filter', async () => {
    return await MediaAPIService.filterFiles('image/', '');
  });

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <h3 className="text-white font-semibold mb-3">Media API Tester</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testHealth}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Test Health
        </button>
        
        <button
          onClick={testList}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          Test List Files
        </button>
        
        <button
          onClick={testCreateFolder}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
        >
          Test Create Folder
        </button>
        
        <button
          onClick={testSearch}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
        >
          Test Search
        </button>
        
        <button
          onClick={testFilter}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
        >
          Test Filter Images
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(testResults).map(([test, result]) => (
          <div key={test} className="text-xs">
            <div className="text-gray-300 font-medium">{test}:</div>
            <div className="text-gray-400 whitespace-pre-wrap break-words">{result}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
