// src/components/ProtectedPlanRoute.jsx
// VERSÃO COM LINK DIRETO PARA STRIPE

import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePlano } from '../contexts/PlanoContext';

const ProtectedPlanRoute = ({ children, requiredPlan }) => {
  const { plano } = usePlano();

  if (plano.loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Verificando seu plano...</p>
      </div>
    );
  }

  // Se não requer plano específico, libera
  if (!requiredPlan) {
    return children;
  }

  // Se o plano atual não bate, mostra tela de bloqueio
  if (plano.tipo !== requiredPlan) {
    return (
      <div style={styles.blocked}>
        <div style={styles.blockedIcon}>🔒</div>
        <h2 style={styles.blockedTitle}>Recurso Exclusivo Enterprise</h2>
        <p style={styles.blockedText}>
          Este Dashboard Enterprise com BI e ROI está disponível apenas para o plano <strong>ENTERPRISE</strong>.
        </p>
        <p style={styles.blockedSubtext}>
          Seu plano atual: <strong>{plano.tipo.toUpperCase()}</strong>
        </p>
        
        <div style={styles.benefits}>
          <h3 style={styles.benefitsTitle}>🚀 O que você ganha no Enterprise:</h3>
          <ul style={styles.benefitsList}>
            <li>💎 Dashboard com ROI e Estoque Recuperado</li>
            <li>📊 Relatórios avançados estilo Totvs</li>
            <li>🗂️ Exportação XML Fiscal</li>
            <li>💰 Múltiplas contas Stripe</li>
            <li>📈 Métricas de performance Uber-style</li>
            <li>∞ Tudo ilimitado (filiais, vendedores, produtos)</li>
          </ul>
        </div>

        {/* LINK DIRETO PARA STRIPE - SEM REDIRECT */}
        <a 
          href="https://buy.stripe.com/6oU4gz6Pm1A0cJUglbgQE06" 
          target="_blank"
          rel="noopener noreferrer"
          style={styles.upgradeButton}
          onClick={(e) => {
            // Não impede o comportamento padrão - vai abrir em nova aba
            console.log('Redirecionando para Stripe Enterprise...');
          }}
        >
          ⬆️ Fazer Upgrade para Enterprise (R$ 360/mês)
        </a>

        <p style={styles.helpText}>
          ℹ️ O upgrade será processado pelo Stripe em uma nova aba
        </p>
      </div>
    );
  }

  // Se passou, libera acesso
  return children;
};

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #bb25a6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  blocked: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '500px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    margin: '20px',
  },
  blockedIcon: {
    fontSize: '5rem',
    marginBottom: '20px',
  },
  blockedTitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '15px',
    fontWeight: '700',
  },
  blockedText: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '10px',
  },
  blockedSubtext: {
    fontSize: '1rem',
    color: '#999',
    marginBottom: '30px',
  },
  benefits: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    textAlign: 'left',
    maxWidth: '600px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  benefitsTitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '20px',
    fontWeight: '600',
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  upgradeButton: {
    backgroundColor: '#bb25a6',
    color: 'white',
    padding: '18px 50px',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
  },
  helpText: {
    marginTop: '15px',
    fontSize: '0.9rem',
    color: '#666',
  },
};

// Estilos para as li do benefitsList
const listItemStyle = document.createElement("style");
listItemStyle.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .benefits-list li {
    padding: 12px 0;
    border-bottom: 1px solid #eee;
    font-size: 1.05rem;
    color: #444;
  }
  
  .benefits-list li:last-child {
    border-bottom: none;
  }
`;
if (!document.head.querySelector('[data-protected-styles]')) {
  listItemStyle.setAttribute('data-protected-styles', 'true');
  document.head.appendChild(listItemStyle);
}

export default ProtectedPlanRoute;