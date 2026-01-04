// src/pages/LojistaDashboard/pages/EmDesenvolvimento.jsx
// Página genérica para funcionalidades em desenvolvimento

import React from 'react';

const EmDesenvolvimento = ({ titulo = "Funcionalidade", icone = "🚧" }) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>{icone}</span>
        </div>
        <h1 style={styles.title}>{titulo}</h1>
        <p style={styles.subtitle}>Esta funcionalidade está em desenvolvimento</p>
        
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            🚀 Estamos trabalhando para trazer esta funcionalidade em breve!
          </p>
          <p style={styles.infoText}>
            💡 Fique atento às atualizações da plataforma.
          </p>
        </div>

        <div style={styles.statusBadge}>
          <span style={styles.statusDot}></span>
          <span style={styles.statusText}>Em Desenvolvimento</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)',
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '60px 40px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '2px solid #e2e8f0',
  },
  iconContainer: {
    marginBottom: '30px',
  },
  icon: {
    fontSize: '5rem',
    display: 'inline-block',
    animation: 'bounce 2s ease-in-out infinite',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '30px',
  },
  infoBox: {
    backgroundColor: '#f1f5f9',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '30px',
  },
  infoText: {
    fontSize: '1rem',
    color: '#475569',
    margin: '10px 0',
    lineHeight: '1.6',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#fef3c7',
    border: '2px solid #fbbf24',
    borderRadius: '20px',
    padding: '10px 20px',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#f59e0b',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusText: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#92400e',
  },
};

// Animações
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
if (!document.head.querySelector('[data-em-desenvolvimento-animations]')) {
  styleSheet.setAttribute('data-em-desenvolvimento-animations', 'true');
  document.head.appendChild(styleSheet);
}

export default EmDesenvolvimento;
