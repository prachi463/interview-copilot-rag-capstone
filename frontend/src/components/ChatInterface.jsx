import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SourceCard from './SourceCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SUGGESTIONS = [
  'Walk me through your NTPC project',
  "What's your CGPA and college?",
  'What was the hardest technical problem you solved?',
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (query) => {
    if (!query.trim()) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.answer,
          meta: {
            route: result.route,
            sources: result.sources,
            backend: result.backend,
          },
        },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}`, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 10, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #22303b',
          background: 'rgba(11, 15, 20, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ color: '#e8a33d', fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            RAG + Three.js
          </div>
          <h1 style={{ color: '#edeff2', fontSize: '2rem', margin: '0.5rem 0 0 0', fontWeight: 700 }}>Interview Copilot</h1>
          <p style={{ color: '#7c8894', fontSize: '0.9rem', margin: '0.4rem 0 0 0' }}>
            AI-powered interview prep — ask anything about my background
          </p>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '2rem',
          background: 'linear-gradient(180deg, rgba(11, 15, 20, 0.7) 0%, rgba(11, 15, 20, 0.9) 100%)',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '3rem' }}>
            <div style={{ color: '#7c8894', marginBottom: '2rem' }}>No messages yet. Try asking a question below:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {SUGGESTIONS.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubmit(s)}
                  style={{
                    padding: '1rem',
                    background: 'rgba(232, 163, 61, 0.1)',
                    border: '1px solid rgba(232, 163, 61, 0.3)',
                    borderRadius: '6px',
                    color: '#edeff2',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: msg.role === 'user' ? '70%' : '100%',
                padding: msg.role === 'user' ? '0.9rem 1.2rem' : '1rem',
                background: msg.role === 'user' ? 'rgba(193, 102, 107, 0.8)' : 'rgba(17, 24, 32, 0.8)',
                border: msg.role === 'user' ? '1px solid #c1666b' : '1px solid #22303b',
                borderRadius: '8px',
                color: msg.error ? '#c1666b' : '#edeff2',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</div>

              {msg.meta && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '0.8rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#e8a33d', marginBottom: '0.6rem' }}>
                    Route: {msg.meta.route.replace(/_/g, ' ')} | Backend: {msg.meta.backend}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7c8894', marginBottom: '0.4rem' }}>
                    {msg.meta.sources.length} sources:
                  </div>
                  {msg.meta.sources.slice(0, 2).map((source, sidx) => (
                    <SourceCard key={sidx} source={source} />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: '#7c8894', fontSize: '0.9rem' }}>
            Thinking...
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid #22303b',
          background: 'rgba(11, 15, 20, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
            style={{ display: 'flex', gap: '0.8rem' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my projects, internships, skills..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.9rem 1.2rem',
                background: 'rgba(17, 24, 32, 0.8)',
                border: '1px solid #22303b',
                borderRadius: '6px',
                color: '#edeff2',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#e8a33d')}
              onBlur={(e) => (e.target.style.borderColor = '#22303b')}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '0.9rem 1.8rem',
                background: loading ? '#666' : '#e8a33d',
                border: 'none',
                borderRadius: '6px',
                color: '#0b0f14',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Send
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
