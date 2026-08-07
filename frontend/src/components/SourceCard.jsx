import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SourceCard({ source }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(17, 24, 32, 0.6)',
        border: '1px solid rgba(193, 102, 107, 0.4)',
        borderLeft: '3px solid #c1666b',
        borderRadius: '4px',
        padding: '0.6rem 0.8rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
      }}
      whileHover={{ background: 'rgba(17, 24, 32, 0.8)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#edeff2', fontWeight: 500 }}>{source.source}</div>
        <div style={{ fontSize: '0.7rem', color: '#6fcf97', fontWeight: 500 }}>{source.confidence}% match</div>
      </div>

      {/* Confidence bar */}
      <div style={{ height: '3px', background: '#22303b', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.4rem' }}>
        <div
          style={{
            height: '100%',
            background: `linear-gradient(90deg, #c1666b, #e8a33d)`,
            width: `${source.confidence}%`,
            transition: 'width 0.2s',
          }}
        />
      </div>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ fontSize: '0.75rem', color: '#7c8894', marginTop: '0.4rem', lineHeight: 1.4 }}>
          {source.text.substring(0, 200)}...
        </motion.div>
      )}
    </motion.div>
  );
}
