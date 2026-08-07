import React, { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import './index.css'

export default function App() {
  const [activeSection, setActiveSection] = useState('chat')

  const renderContent = () => {
    if (activeSection === 'chat') {
      return <ChatInterface />
    } else if (activeSection === 'about') {
      return (
        <div style={{ padding: '2rem', color: '#edeff2', overflowY: 'auto' }}>
          <h1 style={{ color: '#e8a33d', marginBottom: '1rem' }}>About Me</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            I'm a final-year B.Tech CSE (AI/ML) student at Axis Institute of Technology, Kanpur.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            <strong>CGPA:</strong> 8.4/10 | <strong>Class Representative:</strong> 60+ students
          </p>
          <h3 style={{ color: '#c1666b', marginTop: '2rem', marginBottom: '1rem' }}>Internships</h3>
          <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '0.5rem' }}>• NTPC Limited, Auraiya (AI/ML, June-July 2026)</p>
          <p style={{ fontSize: '1rem', lineHeight: 1.8 }}>• EduSkills Foundation (Python Full-Stack, Jan-Mar 2026)</p>
        </div>
      )
    } else if (activeSection === 'projects') {
      return (
        <div style={{ padding: '2rem', color: '#edeff2', overflowY: 'auto' }}>
          <h1 style={{ color: '#e8a33d', marginBottom: '1rem' }}>Projects</h1>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#c1666b', marginBottom: '0.5rem' }}>UNIT-CTRL - Predictive Maintenance</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>LSTM-based system using Flask, React, MongoDB. 99.28% accuracy, 0.9997 AUC.</p>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#c1666b', marginBottom: '0.5rem' }}>Interview Copilot - RAG Capstone</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>Full-stack RAG with hybrid retrieval, query routing, and LLM generation.</p>
          </div>
          <div>
            <h3 style={{ color: '#c1666b', marginBottom: '0.5rem' }}>House Price Prediction</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>Linear regression with Streamlit deployment. 87% accuracy.</p>
          </div>
        </div>
      )
    } else if (activeSection === 'contact') {
      return (
        <div style={{ padding: '2rem', color: '#edeff2', overflowY: 'auto' }}>
          <h1 style={{ color: '#e8a33d', marginBottom: '2rem' }}>Contact</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 2 }}><strong>Email:</strong> vermaprachi463@gmail.com</p>
          <p style={{ fontSize: '1.1rem', lineHeight: 2 }}><strong>GitHub:</strong> github.com/prachi463</p>
          <p style={{ fontSize: '1.1rem', lineHeight: 2 }}><strong>LinkedIn:</strong> linkedin.com/in/prachi-verma-aiml</p>
          <p style={{ fontSize: '1.1rem', lineHeight: 2 }}><strong>Portfolio:</strong> portfolio-seven-hazel-14.vercel.app</p>
        </div>
      )
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #0b0f14 0%, #1a1f2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Navigation */}
      <div style={{
        background: 'rgba(11, 15, 20, 0.95)',
        borderBottom: '1px solid #22303b',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: '#e8a33d', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveSection('chat')}>
          Interview Copilot
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActiveSection('chat')} style={{
            background: activeSection === 'chat' ? '#e8a33d' : 'transparent',
            color: activeSection === 'chat' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeSection === 'chat' ? 600 : 400
          }}>Chat</button>
          <button onClick={() => setActiveSection('about')} style={{
            background: activeSection === 'about' ? '#e8a33d' : 'transparent',
            color: activeSection === 'about' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeSection === 'about' ? 600 : 400
          }}>About</button>
          <button onClick={() => setActiveSection('projects')} style={{
            background: activeSection === 'projects' ? '#e8a33d' : 'transparent',
            color: activeSection === 'projects' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeSection === 'projects' ? 600 : 400
          }}>Projects</button>
          <button onClick={() => setActiveSection('contact')} style={{
            background: activeSection === 'contact' ? '#e8a33d' : 'transparent',
            color: activeSection === 'contact' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeSection === 'contact' ? 600 : 400
          }}>Contact</button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  )
}