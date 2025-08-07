import React, { useState, useRef, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import { create, all } from 'mathjs';
import * as Algebrite from 'algebrite';
import 'katex/dist/katex.min.css';
import type { Element } from '../../types';

// Declare math-field custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<any>;
        'virtual-keyboard-mode'?: string;
        'virtual-keyboards'?: string;
        'smart-fence'?: string;
        'smart-mode'?: string;
        'smart-superscript'?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

// Create mathjs instance
const math = create(all);

interface MathCalculatorWidgetProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode?: boolean;
}

interface CalculationStep {
  input: string;
  result: string;
  latex: string;
  timestamp: number;
}

export const MathCalculatorWidget: React.FC<MathCalculatorWidgetProps> = ({ 
  element, 
  isSelected, 
  isPreviewMode 
}) => {
  const properties = element.properties as any;
  const mathfieldRef = useRef<any>(null);
  
  // Add global dark scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .math-calculator-widget *::-webkit-scrollbar {
        width: 8px;
      }
      .math-calculator-widget *::-webkit-scrollbar-track {
        background: #1f2937;
        border-radius: 4px;
      }
      .math-calculator-widget *::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 4px;
      }
      .math-calculator-widget *::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // State
  const [currentInput, setCurrentInput] = useState('');
  const [calculationResult, setCalculationResult] = useState('');
  const [calculationHistory, setCalculationHistory] = useState<CalculationStep[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mathLiveLoaded, setMathLiveLoaded] = useState(false);

  // Load MathLive when component mounts
  useEffect(() => {
    const loadMathLive = async () => {
      try {
        // Dynamic import of MathLive
        const MathLive = await import('mathlive');
        
        // Configure MathLive globally
        MathLive.renderMathInDocument();
        
        setMathLiveLoaded(true);
        setErrorMessage('');
      } catch (err) {
        // console.error('Failed to load MathLive:', err);
        setErrorMessage('Failed to load math editor');
        setMathLiveLoaded(false);
      }
    };

    loadMathLive();
  }, []);

  // Initialize math field when MathLive is loaded
  useEffect(() => {
    if (mathLiveLoaded && mathfieldRef.current && !isPreviewMode) {
      const mathfield = mathfieldRef.current;
      
      // Configure the math field
      mathfield.addEventListener('input', (evt: any) => {
        const latex = evt.target.value;
        setCurrentInput(latex);
      });

      // Configure options
      mathfield.setOptions({
        virtualKeyboardMode: 'manual',
        virtualKeyboards: 'numeric functions greek symbols',
        smartFence: true,
        smartMode: true,
        smartSuperscript: true
      });

      // Set initial value if exists
      if (currentInput) {
        mathfield.value = currentInput;
      }
    }
  }, [mathLiveLoaded, isPreviewMode]);

  // Widget properties with defaults
  const widgetTitle = properties.title || 'Math Calculator';
  const showTitle = properties.showTitle !== false;
  const calculatorMode = properties.calculatorMode || 'basic'; // basic, algebra, calculus
  const allowHistory = properties.allowHistory !== false;
  const maxHistoryItems = properties.maxHistoryItems || 10;
  const historyLayout = properties.historyLayout || 'sidebar'; // sidebar, bottom, popup
  const showQuickButtons = properties.showQuickButtons !== false;
  const showVirtualKeyboard = properties.showVirtualKeyboard !== false;
  
  // Styling properties
  const widgetBackgroundColor = properties.backgroundColor || '#1f2937';
  const widgetBorderRadius = properties.borderRadius || 12;
  const widgetPadding = properties.padding || 24;
  const widgetFontSize = properties.fontSize || 'text-base';
  const widgetFontFamily = properties.fontFamily || 'font-mono';

  // Convert LaTeX to mathjs-compatible expression
  const convertLatexToMathjs = (latex: string): string => {
    let expression = latex;
    
    // Handle mathematical constants first
    expression = expression.replace(/\\pi/g, 'pi');
    expression = expression.replace(/π/g, 'pi');
    expression = expression.replace(/\\e/g, 'e');
    
    // Handle algebraic solve syntax FIRST
    // solve(equation = value, variable) format
    expression = expression.replace(/solve\s*\(\s*([^=]+)\s*=\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, (match, left, right, variable) => {
      // Clean up the equation parts
      const leftSide = left.trim();
      const rightSide = right.trim();
      const var_ = variable.trim();
      return `solve(${leftSide} - (${rightSide}), ${var_})`;
    });
    
    // Handle common LaTeX symbols
    expression = expression.replace(/\\cdot/g, '*');
    expression = expression.replace(/\\times/g, '*');
    expression = expression.replace(/\\div/g, '/');
    
    // Handle derivative notation d/dx
    expression = expression.replace(/d\/dx\s*\(([^)]+)\)/g, 'derivative($1, x)');
    expression = expression.replace(/\\frac\{d\}\{dx\}\s*\(([^)]+)\)/g, 'derivative($1, x)');
    expression = expression.replace(/\\frac\{d\}\{dx\}([^()]+)/g, 'derivative($1, x)');
    
    // Handle integral notation
    expression = expression.replace(/∫\s*([^d]+)\s*dx/g, 'integral($1, x)');
    expression = expression.replace(/\\int\s*([^d]+)\s*dx/g, 'integral($1, x)');
    
    // Handle e^ patterns BEFORE any other processing
    expression = expression.replace(/e\^(\([^)]+\))/g, 'exp$1');
    expression = expression.replace(/e\^\{([^}]+)\}/g, 'exp($1)');
    
    // Convert braces to parentheses  
    expression = expression.replace(/\{([^}]+)\}/g, '($1)');
    
    // Clean backslashes
    expression = expression.replace(/\\/g, '');
    
    // Handle implicit multiplication BUT avoid exp*(...)
    expression = expression.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    expression = expression.replace(/([a-zA-Z])(\d)/g, '$1*$2');
    expression = expression.replace(/\)(\d|[a-zA-Z])/g, ')*$1');
    // Skip the pattern that adds * between letters and ( to avoid exp*(...)
    expression = expression.replace(/(\d)\(/g, '$1*(');
    
    return expression;
  };

  // Initialize MathLive when component mounts
  useEffect(() => {
    const initMathLive = async () => {
      if (!isPreviewMode && mathfieldRef.current) {
        try {
          const MathLive = await import('mathlive');
          
          if (!customElements.get('math-field')) {
            customElements.define('math-field', MathLive.MathfieldElement);
          }
          
          const mathfield = mathfieldRef.current;
          
          // Use more modern event handling
          const handleInput = (event: any) => {
            setCurrentInput(event.target.value);
            setErrorMessage('');
          };
          
          const handleChange = (event: any) => {
            calculateResult(event.target.value);
          };
          
          mathfield.addEventListener('input', handleInput);
          mathfield.addEventListener('change', handleChange);
          
          // Cleanup function
          return () => {
            if (mathfield) {
              mathfield.removeEventListener('input', handleInput);
              mathfield.removeEventListener('change', handleChange);
            }
          };
          
        } catch (error) {
          // console.error('Failed to load MathLive:', error);
          setErrorMessage('Failed to load math editor');
        }
      }
    };

    initMathLive();
  }, [isPreviewMode]);

  // Calculate result based on mode
  const calculateResult = (latexExpression: string) => {
    if (!latexExpression.trim()) {
      setCalculationResult('');
      return;
    }

    try {
      // Convert LaTeX to mathjs-compatible expression
      const expression = convertLatexToMathjs(latexExpression);
      
      // Debug: log the conversion
      
      let calculatedResult = '';
      let latexResult = '';

      switch (calculatorMode) {
        case 'basic':
          // Basic arithmetic using mathjs
          try {
            const basicResult = math.evaluate(expression);
            calculatedResult = math.format(basicResult, { precision: 14 });
            latexResult = String(basicResult);
          } catch (err) {
            throw new Error(`Basic calculation error: ${err}`);
          }
          break;
          
        case 'algebra':
          // Algebraic operations using Algebrite
          try {
            const algebraResult = Algebrite.run(expression);
            calculatedResult = algebraResult;
            latexResult = Algebrite.run(`latex(${expression})`);
          } catch (err) {
            // Fallback to mathjs for complex expressions
            try {
              const fallbackResult = math.evaluate(expression);
              calculatedResult = math.format(fallbackResult, { precision: 14 });
              latexResult = String(fallbackResult);
            } catch (mathErr) {
              throw new Error(`Algebra calculation error: ${err}`);
            }
          }
          break;
          
        case 'calculus':
          // Calculus operations using Algebrite with mathjs fallback
          try {
            const calculusResult = Algebrite.run(expression);
            calculatedResult = calculusResult;
            latexResult = Algebrite.run(`latex(${expression})`);
          } catch (err) {
            // Fallback to mathjs for supported operations
            try {
              const fallbackResult = math.evaluate(expression);
              calculatedResult = math.format(fallbackResult, { precision: 14 });
              latexResult = String(fallbackResult);
            } catch (mathErr) {
              throw new Error(`Calculus calculation error: ${err}`);
            }
          }
          break;
          
        default:
          const defaultResult = math.evaluate(expression);
          calculatedResult = math.format(defaultResult, { precision: 14 });
          latexResult = String(defaultResult);
      }

      setCalculationResult(calculatedResult);
      setErrorMessage('');

      // Add to history if enabled
      if (allowHistory && calculatedResult) {
        const step: CalculationStep = {
          input: latexExpression,
          result: calculatedResult,
          latex: latexResult,
          timestamp: Date.now()
        };
        
        setCalculationHistory(prev => {
          const newHistory = [step, ...prev.slice(0, maxHistoryItems - 1)];
          return newHistory;
        });
      }
      
    } catch (error: any) {
      setErrorMessage(`Calculation error: ${error.message}`);
      setCalculationResult('');
    }
  };

  // Clear calculator
  const clearCalculator = () => {
    setCurrentInput('');
    setCalculationResult('');
    setErrorMessage('');
    if (mathfieldRef.current) {
      mathfieldRef.current.value = '';
    }
  };

  // Clear history
  const clearHistory = () => {
    setCalculationHistory([]);
    setShowHistory(false);
  };

  // Safe LaTeX display component
  const SafeMathDisplay = ({ latex, className = "" }: { latex: string; className?: string }) => {
    // Handle derivative notation that displays as columns
    if (latex.includes('d/dx')) {
      // Convert d/dx(expression) to readable format
      const derivativeText = latex
        .replace(/d\/dx\(([^)]+)\)/g, "d/dx($1)")
        .replace(/d\/dx/g, "d/dx");
      return <span className={`${className} font-mono`}>{derivativeText}</span>;
    }
    
    // Handle simple multiplication patterns that display as columns
    if (latex.match(/^\d+\*[a-zA-Z]$/)) {
      // Pattern like "2*x" → "2x"
      const parts = latex.split('*');
      return <span className={`${className}`}>{parts[0]}{parts[1]}</span>;
    }
    
    if (latex.match(/^[a-zA-Z]\*\d+$/)) {
      // Pattern like "x*2" → "x·2"
      const parts = latex.split('*');
      return <span className={`${className}`}>{parts[0]}·{parts[1]}</span>;
    }
    
    // For simple expressions like "1\cdot5", let's just display them as plain text with symbols
    if (latex.match(/^\d+\\cdot\d+$/)) {
      const parts = latex.split('\\cdot');
      return (
        <span className={`${className}`}>
          {parts[0]} · {parts[1]}
        </span>
      );
    }
    
    if (latex.match(/^\d+\\times\d+$/)) {
      const parts = latex.split('\\times');
      return (
        <span className={`${className}`}>
          {parts[0]} × {parts[1]}
        </span>
      );
    }
    
    if (latex.match(/^\d+\\div\d+$/)) {
      const parts = latex.split('\\div');
      return (
        <span className={`${className}`}>
          {parts[0]} ÷ {parts[1]}
        </span>
      );
    }
    
    // Handle simple numbers and basic expressions
    if (latex.match(/^-?\d+(\.\d+)?$/)) {
      // Simple number (including negative), just display as is
      return <span className={`${className}`}>{latex}</span>;
    }
    
    // Handle complex numbers
    if (latex.includes('i') || latex.includes('I')) {
      // Complex number result, display as plain text to avoid formatting issues
      const complexText = latex
        .replace(/\*/g, '·')
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' - ')
        .replace(/(\d+)\s*i/g, '$1i'); // Keep imaginary unit close to coefficient
      return <span className={`${className}`}>{complexText}</span>;
    }
    
    // Handle common mathematical constants that might display as columns
    if (latex.includes('e') || latex.includes('π') || latex.includes('pi')) {
      // For results containing constants, display as plain text to avoid column issues
      const simpleText = latex
        .replace(/\\pi/g, 'π')
        .replace(/\\e/g, 'e')
        .replace(/\*/g, '·')
        .replace(/\\/g, '');
      return <span className={`${className}`}>{simpleText}</span>;
    }
    
    // Handle syntax errors and special messages
    if (latex.includes('error') || latex.includes('Error') || latex.includes('Stop')) {
      return <span className={`${className} text-red-400`}>{latex}</span>;
    }
    
    // For more complex expressions, try KaTeX but with fallback
    try {
      return <InlineMath math={latex} />;
    } catch (error) {
      // Fallback to plain text conversion
      const fallbackText = latex
        .replace(/\\cdot/g, ' · ')
        .replace(/\\times/g, ' × ')
        .replace(/\\div/g, ' ÷ ')
        .replace(/\\pi/g, 'π')
        .replace(/\\e/g, 'e')
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
        .replace(/\\/g, '');
      return <span className={`font-mono ${className}`}>{fallbackText}</span>;
    }
  };

  // Render quick input buttons based on mode
  const renderQuickButtons = () => {
    let buttons: string[] = [];
    
    switch (calculatorMode) {
      case 'basic':
        buttons = ['+', '-', '*', '/', '^', '(', ')', 'sqrt', 'sin', 'cos', 'tan', 'log'];
        break;
      case 'algebra':
        buttons = ['x', 'y', 'solve', 'factor', 'expand', 'simplify', '=', '+', '-', '*', '/', '^'];
        break;
      case 'calculus':
        buttons = ['d/dx', '∫', 'lim', 'x', 'y', '+', '-', '*', '/', '^', 'e', 'π'];
        break;
    }

    return (
      <div className="grid grid-cols-6 gap-2 mt-4">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => insertSymbol(btn)}
            className="px-2 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-xs font-medium border border-gray-600 hover:border-gray-500 transition-all duration-150 shadow-sm"
            disabled={isPreviewMode}
          >
            {btn}
          </button>
        ))}
      </div>
    );
  };

  // Insert symbol into mathfield
  const insertSymbol = (symbol: string) => {
    if (mathfieldRef.current && mathLiveLoaded) {
      // Convert common symbols to LaTeX
      const symbolMap: { [key: string]: string } = {
        '+': '+',
        '-': '-',
        '*': '\\cdot',
        '/': '\\frac{#@}{#?}',
        '^': '^{#?}',
        '(': '(',
        ')': ')',
        'sqrt': '\\sqrt{#?}',
        'sin': '\\sin(',
        'cos': '\\cos(',
        'tan': '\\tan(',
        'log': '\\log(',
        'ln': '\\ln(',
        'pi': '\\pi',
        'e': 'e'
      };

      const latexSymbol = symbolMap[symbol] || symbol;
      mathfieldRef.current.executeCommand(['insert', latexSymbol]);
      mathfieldRef.current.focus();
    }
  };

  // Container styles with forced dark theme
  const containerStyles = {
    backgroundColor: widgetBackgroundColor || '#0f172a', // Force dark background if not set
    borderRadius: `${widgetBorderRadius}px`,
    padding: `${widgetPadding}px`,
    fontFamily: widgetFontFamily.startsWith('font-') ? undefined : widgetFontFamily,
  };

  const containerClasses = `math-calculator-widget bg-gradient-to-br from-slate-800 to-slate-900 text-gray-100 ${widgetFontSize} ${
    widgetFontFamily.startsWith('font-') ? widgetFontFamily : ''
  } border-2 border-gray-600 shadow-2xl ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}`;

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* Title */}
      {showTitle && (
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {widgetTitle}
        </h3>
      )}

      {/* Main Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* Left Panel - Calculator */}
        <div className="lg:col-span-3 col-span-1 max-w-none">
          
          {/* Math Input Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Math Expression
            </label>
            {!isPreviewMode && mathLiveLoaded ? (
              React.createElement('math-field', {
                ref: mathfieldRef,
                style: {
                  width: '100%',
                  minHeight: '70px',
                  border: '2px solid #374151',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '18px',
                  backgroundColor: '#111827',
                  color: '#f3f4f6',
                  display: 'block',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease-in-out'
                },
                'virtual-keyboard-mode': 'manual',
                'virtual-keyboards': 'numeric functions greek symbols',
                'smart-fence': true,
                'smart-mode': true,
                'smart-superscript': true
              })
            ) : !isPreviewMode && !mathLiveLoaded ? (
              <div className="w-full min-h-[70px] border-2 border-red-500 rounded-xl p-4 bg-red-900 bg-opacity-20 backdrop-blur-sm flex items-center">
                <span className="text-red-400 text-sm font-medium">
                  {errorMessage || 'Loading math editor...'}
                </span>
              </div>
            ) : (
              <div className="w-full min-h-[70px] border-2 border-gray-600 rounded-xl p-4 bg-gray-800 backdrop-blur-sm flex items-center">
                <span className="text-gray-400 italic">Interactive math editor (preview mode)</span>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          {!isPreviewMode && mathLiveLoaded && (
            <div className="mb-4">
              <button
                onClick={() => {
                  if (mathfieldRef.current) {
                    const latex = mathfieldRef.current.value;
                    calculateResult(latex);
                  }
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-base shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentInput.trim()}
              >
                Calculate
              </button>
            </div>
          )}

          {/* Quick Input Buttons */}
          {!isPreviewMode && showQuickButtons && renderQuickButtons()}

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={clearCalculator}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-sm transition-all duration-150 shadow-md"
              disabled={isPreviewMode}
            >
              Clear
            </button>

            {mathLiveLoaded && !isPreviewMode && showVirtualKeyboard && (
              <button
                onClick={() => {
                  if (mathfieldRef.current) {
                    mathfieldRef.current.executeCommand(['toggleVirtualKeyboard']);
                  }
                }}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium text-sm transition-all duration-150 shadow-md"
              >
                Keyboard
              </button>
            )}
            
            {allowHistory && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-sm transition-all duration-150 shadow-md"
                disabled={isPreviewMode}
              >
                {showHistory ? 'Hide' : 'Show'} History ({calculationHistory.length})
              </button>
            )}
            
            {allowHistory && calculationHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium text-sm transition-all duration-150 shadow-md"
                disabled={isPreviewMode}
              >
                Clear History
              </button>
            )}
          </div>

          {/* Result Display */}
          {calculationResult && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-900 to-emerald-900 border-2 border-green-600 rounded-xl backdrop-blur-sm shadow-xl">
              <h4 className="text-xs font-bold text-green-300 mb-2 uppercase tracking-wide">Result:</h4>
              <div className="text-xl text-green-100 font-mono">
                <SafeMathDisplay latex={calculationResult} />
              </div>
            </div>
          )}

          {/* Error Display */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-900 to-pink-900 border-2 border-red-500 rounded-xl backdrop-blur-sm shadow-xl">
              <h4 className="text-xs font-bold text-red-300 mb-2 uppercase tracking-wide">Error:</h4>
              <p className="text-red-100 font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Mode Indicator */}
          <div className="mt-4 text-center">
            <span className="inline-flex items-center px-3 py-1 bg-gray-700 rounded-full text-xs font-medium text-gray-300 border border-gray-600">
              Mode: {calculatorMode.charAt(0).toUpperCase() + calculatorMode.slice(1)}
            </span>
          </div>

          {/* Bottom History Layout */}
          {allowHistory && showHistory && calculationHistory.length > 0 && historyLayout === 'bottom' && (
            <div className="mt-6 p-6 bg-gray-800 border-2 border-gray-600 rounded-xl backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-200">Calculation History</h4>
                <div className="flex gap-2">
                  <button
                    onClick={clearHistory}
                    className="px-3 py-2 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    disabled={isPreviewMode}
                    title="Clear all history"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="px-3 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    title="Hide history panel"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                   style={{
                     scrollbarWidth: 'thin',
                     scrollbarColor: '#4B5563 #1F2937'
                   }}>
                {calculationHistory.map((step) => (
                  <div
                    key={step.timestamp}
                    className="p-4 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 hover:border-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    onClick={() => !isPreviewMode && insertSymbol(step.input)}
                    title="Click to insert this expression"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Input:</div>
                        <div className="text-sm text-gray-200">
                          <SafeMathDisplay latex={step.input} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Result:</div>
                        <div className="text-base text-gray-100">
                          <SafeMathDisplay latex={step.result} />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - History Sidebar */}
        <div className="lg:col-span-2 col-span-1">
          {allowHistory && showHistory && calculationHistory.length > 0 && historyLayout === 'sidebar' ? (
            <div className="p-6 bg-gray-800 border-2 border-gray-600 rounded-xl h-full backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-200">History</h4>
                <div className="flex gap-2">
                  <button
                    onClick={clearHistory}
                    className="px-3 py-2 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    disabled={isPreviewMode}
                    title="Clear all history"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="px-3 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    title="Hide history panel"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                   style={{
                     scrollbarWidth: 'thin',
                     scrollbarColor: '#4B5563 #1F2937'
                   }}>
                {calculationHistory.map((step) => (
                  <div
                    key={step.timestamp}
                    className="p-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 hover:border-blue-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                    onClick={() => !isPreviewMode && insertSymbol(step.input)}
                    title="Click to insert this expression"
                  >
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Input:</div>
                        <div className="text-sm text-gray-200">
                          <SafeMathDisplay latex={step.input} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Result:</div>
                        <div className="text-sm text-gray-100">
                          <SafeMathDisplay latex={step.result} />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : allowHistory && historyLayout === 'sidebar' ? (
            <div className="hidden lg:block p-6 bg-gray-900 bg-opacity-30 border-2 border-gray-700 border-dashed rounded-xl h-full backdrop-blur-sm">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-sm font-medium mb-2">History Panel</div>
                  <div className="text-xs">Click "Show History" to view calculations</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Popup History Modal */}
      {allowHistory && showHistory && calculationHistory.length > 0 && historyLayout === 'popup' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-8 max-w-4xl max-h-[85vh] w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Calculation History
              </h4>
              <div className="flex gap-3">
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  disabled={isPreviewMode}
                  title="Clear all history"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  title="Close history"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: '#4B5563 #1F2937'
                 }}>
              {calculationHistory.map((step) => (
                <div
                  key={step.timestamp}
                  className="p-5 bg-gray-700 border border-gray-600 rounded-xl cursor-pointer hover:bg-gray-600 hover:border-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  onClick={() => {
                    if (!isPreviewMode) {
                      insertSymbol(step.input);
                      setShowHistory(false); // Close popup after selection
                    }
                  }}
                  title="Click to insert this expression"
                >
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Input:</div>
                      <div className="text-sm text-gray-200">
                        <SafeMathDisplay latex={step.input} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Result:</div>
                      <div className="text-lg text-gray-100">
                        <SafeMathDisplay latex={step.result} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
