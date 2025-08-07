import React from 'react';
import { FillInTheBlanksWidget } from '../components/interactive/FillInTheBlanksWidget';
import type { Element } from '../types';

export const FillInBlanksTest: React.FC = () => {
  // Test cases with different [word] patterns
  const testCases: Array<{ title: string; element: Element }> = [
    {
      title: "Single blank: I like [red] apples",
      element: {
        id: 'test-1',
        name: 'Test 1',
        type: 'fill-in-blanks',
        properties: {
          questionText: 'I like [red] apples',
          caseSensitive: false,
          trimWhitespace: true,
          showScore: true,
          showFeedback: true,
          instantFeedback: true,
        },
        position: { x: 0, y: 0 },
        size: { width: 400, height: 60 },
      } as Element
    },
    {
      title: "Multiple blanks: I like [red] [apples]!",
      element: {
        id: 'test-2',
        name: 'Test 2',
        type: 'fill-in-blanks',
        properties: {
          questionText: 'I like [red] [apples]!',
          caseSensitive: false,
          trimWhitespace: true,
          showScore: true,
          showFeedback: true,
          instantFeedback: true,
        },
        position: { x: 0, y: 0 },
        size: { width: 400, height: 60 },
      } as Element
    },
    {
      title: "Case sensitive: My name is [John]",
      element: {
        id: 'test-3',
        name: 'Test 3',
        type: 'fill-in-blanks',
        properties: {
          questionText: 'My name is [John]',
          caseSensitive: true,
          trimWhitespace: true,
          showScore: true,
          showFeedback: true,
          instantFeedback: true,
        },
        position: { x: 0, y: 0 },
        size: { width: 400, height: 60 },
      } as Element
    },
    {
      title: "Multiple words in brackets: I love [red apples] and [orange juice]",
      element: {
        id: 'test-4',
        name: 'Test 4',
        type: 'fill-in-blanks',
        properties: {
          questionText: 'I love [red apples] and [orange juice]',
          caseSensitive: false,
          trimWhitespace: true,
          showScore: true,
          showFeedback: true,
          instantFeedback: true,
        },
        position: { x: 0, y: 0 },
        size: { width: 500, height: 60 },
      } as Element
    },
    {
      title: "No blanks: Just regular text",
      element: {
        id: 'test-5',
        name: 'Test 5',
        type: 'fill-in-blanks',
        properties: {
          questionText: 'Just regular text without any blanks',
          caseSensitive: false,
          trimWhitespace: true,
          showScore: true,
          showFeedback: true,
          instantFeedback: true,
        },
        position: { x: 0, y: 0 },
        size: { width: 400, height: 60 },
      } as Element
    },
    {
      title: "Longer words: I love [strawberries] and [pineapples]",
      element: {
        id: 'test-6',
        name: 'Test 6',
        type: 'fill-in-blanks',
        properties: {
          questionText: 'I love [strawberries] and [pineapples]',
          caseSensitive: false,
          trimWhitespace: true,
          showScore: true,
          showFeedback: true,
          instantFeedback: true,
        },
        position: { x: 0, y: 0 },
        size: { width: 500, height: 60 },
      } as Element
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Fill-in-the-Blanks Widget Test</h1>
      <p className="text-gray-600 mb-6">
        This page tests the new [word] format for fill-in-the-blanks widgets. 
        The expected answers are automatically extracted from the brackets.
      </p>
      
      {testCases.map((testCase, index) => (
        <div key={testCase.element.id} className="border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{testCase.title}</h3>
          <div className="bg-gray-50 p-4 rounded">
            <FillInTheBlanksWidget 
              element={testCase.element} 
              isSelected={false} 
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <strong>Expected answers:</strong> {(() => {
              const bracketRegex = /\[([^\]]+)\]/g;
              const questionText = (testCase.element.properties as any).questionText;
              const matches = questionText.match(bracketRegex);
              if (!matches) return 'None (no brackets found)';
              return matches.map((match: string) => match.slice(1, -1)).join(', ');
            })()}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <strong>Debug - Parsed structure:</strong> {(() => {
              const bracketRegex = /\[([^\]]+)\]/g;
              const questionText = (testCase.element.properties as any).questionText;
              const textParts: string[] = [];
              const expectedAnswers: string[] = [];
              let lastIndex = 0;
              let match;
              
              while ((match = bracketRegex.exec(questionText)) !== null) {
                textParts.push(questionText.slice(lastIndex, match.index));
                expectedAnswers.push(match[1]);
                lastIndex = match.index + match[0].length;
              }
              textParts.push(questionText.slice(lastIndex));
              
              return `Text parts: [${textParts.map(p => `"${p}"(${p.length})`).join(', ')}] | Expected: [${expectedAnswers.join(', ')}]`;
            })()}
          </div>
        </div>
      ))}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-blue-700 space-y-1">
          <li>• Use <code>[word]</code> format to mark blanks in your text</li>
          <li>• The word inside brackets becomes the expected answer</li>
          <li>• Multiple blanks are supported: <code>I like [red] [apples]</code></li>
          <li>• Multi-word answers work: <code>[red apples]</code></li>
          <li>• Case sensitivity and other validation options still work</li>
        </ul>
      </div>
    </div>
  );
}; 