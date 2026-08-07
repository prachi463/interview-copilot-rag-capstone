import React, { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import './index.css'

export default function App() {
  const [activeSection, setActiveSection] = useState('chat')

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
        backdropFilter: 'blur(10px)',
        zIndex: 100
      }}>
        <div style={{ color: '#e8a33d', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveSection('chat')}>
          Interview Copilot
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={() => setActiveSection('chat')} style={{
            background: activeSection === 'chat' ? '#e8a33d' : 'transparent',
            color: activeSection === 'chat' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: activeSection === 'chat' ? 600 : 400
          }}>Chat</button>
          <button onClick={() => setActiveSection('about')} style={{
            background: activeSection === 'about' ? '#e8a33d' : 'transparent',
            color: activeSection === 'about' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: activeSection === 'about' ? 600 : 400
          }}>About</button>
          <button onClick={() => setActiveSection('projects')} style={{
            background: activeSection === 'projects' ? '#e8a33d' : 'transparent',
            color: activeSection === 'projects' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: activeSection === 'projects' ? 600 : 400
          }}>Projects</button>
          <button onClick={() => setActiveSection('contact')} style={{
            background: activeSection === 'contact' ? '#e8a33d' : 'transparent',
            color: activeSection === 'contact' ? '#0b0f14' : '#edeff2',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: activeSection === 'contact' ? 600 : 400
          }}>Contact</button>
        </div>
      </nav>

      {/* Chat Section */}
      {activeSection === 'chat' && <ChatInterface />}

      {/* About Section */}
      {activeSection === 'about' && (
        <div style={{ flex: 1, padding: '2rem', color: '#edeff2', overflow: 'auto', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ color: '#e8a33d' }}>About Me</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            I'm a final-year B.Tech CSE (AI/ML) student at Axis Institute of Technology, Kanpur (affiliated with AKTU).
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            <strong>CGPA:</strong> 8.4/10 | <strong>Class Representative:</strong> 60+ students
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            <strong>Internships:</strong>
          </p>
          <ul style={{ fontSize: '1rem', lineHeight: 1.8 }}>
            <li>NTPC Limited, Auraiya (AI/ML, June-July 2026)</li>
            <li>EduSkills Foundation (Python Full-Stack Developer, Jan-Mar 2026)</li>
          </ul>
        </div>
      )}

      {/* Projects Section */}
      {activeSection === 'projects' && (
        <div style={{ flex: 1, padding: '2rem', color: '#edeff2', overflow: 'auto', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ color: '#e8a33d' }}>Projects</h1>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#c1666b' }}>UNIT-CTRL - Predictive Maintenance System</h3>
            <p>LSTM-based predictive maintenance using Flask, React, Socket.IO, MongoDB Atlas. 99.28% accuracy, 0.9997 AUC.</p>
            <p><strong>Tech:</strong> Python, TensorFlow, Flask, React, MongoDB, ESP32, Render, Vercel</p>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#c1666b' }}>Interview Copilot - RAG Capstone</h3>
            <p>Full-stack RAG application with hybrid retrieval (FAISS + BM25), query routing, and LLM generation.</p>
            <p><strong>Tech:</strong> Flask, React, FAISS, Groq API, Render, Vercel</p>
          </div>
          <div>
            <h3 style={{ color: '#c1666b' }}>House Price Prediction</h3>
            <p>Linear regression model with Streamlit deployment. Achieved 87% accuracy on test data.</p>
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <div style={{ flex: 1, padding: '2rem', color: '#edeff2', overflow: 'auto', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ color: '#e8a33d' }}>Contact</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <strong>Email:</strong> <a href="mailto:vermaprachi463@gmail.com" style={{ color: '#e8a33d', textDecoration: 'none' }}>vermaprachi463@gmail.com</a>
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <strong>GitHub:</strong> <a href="https://github.com/prachi463" style={{ color: '#e8a33d', textDecoration: 'none' }} target="_blank" rel="noreferrer">github.com/prachi463</a>
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/prachi-verma-aiml" style={{ color: '#e8a33d', textDecoration: 'none' }} target="_blank" rel="noreferrer">linkedin.com/in/prachi-verma-aiml</a>
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <strong>Portfolio:</strong> <a href="https://portfolio-seven-hazel-14.vercel.app" style={{ color: '#e8a33d', textDecoration: 'none' }} target="_blank" rel="noreferrer">portfolio-seven-hazel-14.vercel.app</a>
          </p>
        </div>
      )}
    </div>
  )
}