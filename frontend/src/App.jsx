import React, { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import './index.css'

export default function App() {
  const [activeSection, setActiveSection] = useState('home')

  const navItems = ['home', 'about', 'projects', 'contact']

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #0b0f14 0%, #1a1f2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'rgba(11, 15, 20, 0.95)',
        borderBottom: '1px solid #22303b',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ color: '#e8a33d', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveSection('home')}>
          Interview Copilot
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              style={{
                background: activeSection === item ? '#e8a33d' : 'transparent',
                color: activeSection === item ? '#0b0f14' : '#edeff2',
                border: activeSection === item ? 'none' : '1px solid #22303b',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: activeSection === item ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      {activeSection === 'home' && (
        <ChatInterface />
      )}
      {activeSection === 'about' && (
        <div style={{ flex: 1, padding: '2rem', color: '#edeff2', overflow: 'auto' }}>
          <h2>About Me</h2>
          <p>Final-year B.Tech CSE (AI/ML) student at Axis Institute of Technology. CGPA: 8.4/10</p>
          <p>Internships: NTPC (UNIT-CTRL Predictive Maintenance), EduSkills (Python Full-Stack)</p>
        </div>
      )}
      {activeSection === 'projects' && (
        <div style={{ flex: 1, padding: '2rem', color: '#edeff2', overflow: 'auto' }}>
          <h2>Projects</h2>
          <p><strong>UNIT-CTRL:</strong> Predictive maintenance system using LSTM, Flask, React, MongoDB. 99.28% accuracy.</p>
          <p><strong>Interview Copilot:</strong> RAG-based interview prep with hybrid retrieval and LLM generation.</p>
          <p><strong>House Price Prediction:</strong> Linear regression model deployed on Streamlit.</p>
        </div>
      )}
      {activeSection === 'contact' && (
        <div style={{ flex: 1, padding: '2rem', color: '#edeff2', overflow: 'auto' }}>
          <h2>Contact</h2>
          <p><strong>Email:</strong> vermaprachi463@gmail.com</p>
          <p><strong>GitHub:</strong> github.com/prachi463</p>
          <p><strong>LinkedIn:</strong> linkedin.com/in/prachi-verma-aiml</p>
          <p><strong>Portfolio:</strong> portfolio-seven-hazel-14.vercel.app</p>
        </div>
      )}
    </div>
  )
}