import React, { useState, useEffect } from 'react';
import { runAllTests, testEnhancedModuleContent, testLegacyFormatCompatibility, testContentLoading, testFormatDetection } from '../utils/test-enhanced-module-content';

interface TestResult {
  success: boolean;
  error?: any;
  [key: string]: any;
}

interface TestResults {
  test1?: TestResult;
  test2?: TestResult;
  test3?: TestResult;
  test4?: TestResult;
}

export const TestEnhancedModuleContent: React.FC = () => {
  const [results, setResults] = useState<TestResults>({});
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Capture console output
  const captureConsole = () => {
    const originalLog = console.log;
    const originalError = console.error;
    
    const logs: string[] = [];
    
    // console.log = (...args: any[]) => {
    //   logs.push(args.join(' '));
    //   originalLog(...args);
    // };
    
    // console.error = (...args: any[]) => {
    //   logs.push(`❌ ${args.join(' ')}`);
    //   originalError(...args);
    // };
    
    return () => {
      // console.error = originalError;
      return logs;
    };
  };

  const runTest = async (testFunction: () => any, testName: string) => {
    setIsRunning(true);
    setConsoleOutput([]);
    
    const restoreConsole = captureConsole();
    
    try {
      const result = await testFunction();
      const logs = restoreConsole();
      
      setResults(prev => ({ ...prev, [testName]: result }));
      setConsoleOutput(logs);
      
    } catch (error) {
      const logs = restoreConsole();
      setConsoleOutput(logs);
      // console.error(`❌ ${testName} failed:`, error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTestsHandler = async () => {
    setIsRunning(true);
    setConsoleOutput([]);
    setResults({});
    
    const restoreConsole = captureConsole();
    
    try {
      const results = await runAllTests();
      const logs = restoreConsole();
      
      setResults(results);
      setConsoleOutput(logs);
      
      const passedTests = Object.values(results).filter(result => result.success).length;
      const totalTests = Object.keys(results).length;
      

    } catch (error) {
      const logs = restoreConsole();
      setConsoleOutput(logs);
      // console.error('❌ Tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setResults({});
    setConsoleOutput([]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Enhanced Module Content Tests</h1>
        
        <div className="mb-8">
          <p className="text-gray-300 mb-6 text-lg">
            This test suite verifies that the enhanced module content with page structure is working correctly.
          </p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={runAllTestsHandler}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium"
            >
              {isRunning ? 'Running...' : '🚀 Run All Tests'}
            </button>
            
            <button
              onClick={() => runTest(testEnhancedModuleContent, 'test1')}
              disabled={isRunning}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium"
            >
              Test 1: Enhanced Content Creation
            </button>
            
            <button
              onClick={() => runTest(testLegacyFormatCompatibility, 'test2')}
              disabled={isRunning}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded-lg font-medium"
            >
              Test 2: Legacy Compatibility
            </button>
            
            <button
              onClick={() => runTest(testFormatDetection, 'test4')}
              disabled={isRunning}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-medium"
            >
              Test 4: Format Detection
            </button>
            
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
            >
              Clear Results
            </button>
            
            <button
              onClick={scrollToTop}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
            >
              ↑ Scroll to Top
            </button>
          </div>
        </div>

        {/* Test Results Summary */}
        {Object.keys(results).length > 0 && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">📊 Test Results Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(results).map(([testName, result]) => (
                <div key={testName} className="p-3 bg-gray-700 rounded-lg">
                  <div className="font-medium">{testName.toUpperCase()}</div>
                  <div className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.success ? '✅ PASSED' : '❌ FAILED'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Console Output */}
        {consoleOutput.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">📝 Console Output</h2>
            <div className="bg-black p-4 rounded-lg font-mono text-sm overflow-y-auto max-h-96 border border-gray-600">
              {consoleOutput.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Results */}
        {Object.keys(results).length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">🔍 Detailed Results</h2>
            <div className="space-y-4">
              {Object.entries(results).map(([testName, result]) => (
                <div key={testName} className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">{testName.toUpperCase()}</h3>
                  <pre className="text-sm text-gray-300 overflow-y-auto max-h-64 border border-gray-600 p-3 rounded bg-gray-900">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">📖 How to Use This Test</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Run All Tests" to execute the complete test suite</li>
            <li>Or run individual tests to focus on specific functionality</li>
            <li>Check the console output for detailed information</li>
            <li>Review the test results summary for pass/fail status</li>
            <li>Examine detailed results for specific data structures</li>
          </ol>
        </div>
      </div>
      
      {/* Floating scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}; 