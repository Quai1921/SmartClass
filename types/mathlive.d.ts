// Type declarations for MathLive custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<any>;
        'virtual-keyboard-mode'?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

export {};
