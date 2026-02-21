// src/pages/LojistaDashboard/components/BotaoRelatoriosConciliacao.jsx

import React, { useState } from 'react';
import RelatoriosConciliacao from './RelatoriosConciliacao';

const BotaoRelatoriosConciliacao = ({ lojistaId, variant = 'primary' }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const styles = {
    primary: {
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: '600',
      backgroundColor: '#2f0d51',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    secondary: {
      padding: '10px 20px',
      fontSize: '0.95rem',
      fontWeight: '600',
      backgroundColor: '#fff',
      color: "#2f0d51",
      border: '2px solid #2f0d51',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
    small: {
      padding: '8px 16px',
      fontSize: '0.9rem',
      fontWeight: '600',
      backgroundColor: '#388e3c',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    },
  };

  return (
    <>
      <button
        onClick={() => setMostrarModal(true)}
        style={styles[variant] || styles.primary}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = variant === 'secondary' ? 'none' : '0 2px 4px rgba(0,0,0,0.1)';
        }}
      >
         Relatórios de Conciliação
      </button>

      {mostrarModal && (
        <RelatoriosConciliacao
          lojistaId={lojistaId}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </>
  );
};

export default BotaoRelatoriosConciliacao;