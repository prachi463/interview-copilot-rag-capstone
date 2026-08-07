import React from 'react';
import ThreeBackground from './components/ThreeBackground';
import ChatInterface from './components/ChatInterface';

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <ThreeBackground />
      <ChatInterface />
    </div>
  );
}
