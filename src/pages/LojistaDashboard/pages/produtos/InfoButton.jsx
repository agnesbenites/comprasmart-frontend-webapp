import React, { useState } from 'react';

/**
 * Botão de Ajuda com Tooltip
 * Mostra dicas e explicações ao passar o mouse ou clicar
 */
const InfoButton = ({ title, children, position = 'right' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={styles.container}>
      <button
        type="button"
        style={styles.button}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        ℹ️
      </button>

      {showTooltip && (
        <div style={{
          ...styles.tooltip,
          ...(position === 'left' ? styles.tooltipLeft : styles.tooltipRight)
        }}>
          {title && <strong style={styles.tooltipTitle}>{title}</strong>}
          <div style={styles.tooltipContent}>{children}</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  button: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  tooltip: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#333',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    lineHeight: '1.5',
    width: '280px',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  tooltipRight: {
    left: '32px',
  },
  tooltipLeft: {
    right: '32px',
  },
  tooltipTitle: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.9rem',
    color: '#ffc107',
  },
  tooltipContent: {
    fontSize: '0.8rem',
  },
};

export default InfoButton;