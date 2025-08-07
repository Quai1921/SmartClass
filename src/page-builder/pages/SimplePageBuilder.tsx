import React from 'react';
import { BuilderProvider } from '../context/BuilderContext';

const SimplePageBuilder: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      backgroundColor: '#1f2937', 
      color: 'white',
      padding: '20px'
    }}>
      <h1>Simple Page Builder - Testing BuilderProvider</h1>
      <p>This version includes BuilderProvider</p>
      
      <BuilderProvider>
        <div style={{ padding: '20px', backgroundColor: '#374151', marginTop: '20px' }}>
          <p>✅ BuilderProvider is working!</p>
        </div>
      </BuilderProvider>
    </div>
  );
};

export default SimplePageBuilder;
