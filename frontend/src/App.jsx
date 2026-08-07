import React from 'react'
import ChatInterface from './components/ChatInterface'
import './index.css'

export default function App() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #0b0f14 0%, #1a1f2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <ChatInterface />
    </div>
  )
}