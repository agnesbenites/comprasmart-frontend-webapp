// app-frontend/src/components/TermsCheckbox.jsx
// Componente reutilizável para aceitação de termos

import React from 'react';

const TermsCheckbox = ({ checked, onChange, userType = 'geral' }) => {
  const getTermsLinks = () => {
    const baseLinks = {
      termos: "https://merciful-keyboard-70e.notion.site/2d0cb8e9243180938a66c6b53a4aed5b",
      privacidade: "https://merciful-keyboard-70e.notion.site/2d1cb8e924318015a8b0dea48170d820",
    };

    // Lojistas e Consultores também precisam aceitar o Termo de Adesão
    if (userType === 'lojista' || userType === 'consultor') {
      return {
        ...baseLinks,
        adesao: "https://merciful-keyboard-70e.notion.site/2cfcb8e9243180a08bbbf914d582e8bf"
      };
    }

    return baseLinks;
  };

  const links = getTermsLinks();

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={styles.checkbox}
          required
        />
        <span style={styles.text}>
          Li e aceito os{' '}
          <a
            href={links.termos}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Termos e Condições de Uso
          </a>
          {' '}e a{' '}
          <a
            href={links.privacidade}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Política de Privacidade
          </a>
          {links.adesao && (
            <>
              , bem como o{' '}
              <a
                href={links.adesao}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Termo de Adesão e Contratação de Serviços
              </a>
            </>
          )}
          .
        </span>
      </label>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid #e9ecef',
  },
  label: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginTop: '2px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  text: {
    fontSize: '0.95rem',
    color: '#333',
    lineHeight: '1.6',
  },
  link: {
    color: "#2f0d51",
    textDecoration: 'none',
    fontWeight: '600',
    borderBottom: '1px solid transparent',
    transition: 'border-color 0.3s',
  },
};

export default TermsCheckbox;