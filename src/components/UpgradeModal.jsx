// app-frontend/src/components/UpgradeModal.jsx

import React from 'react';

const UpgradeModal = ({ isOpen, onClose, limitInfo }) => {
    if (!isOpen) return null;

    const handleUpgrade = () => {
        // Redirecionar para pagina de planos/upgrade
        window.location.href = '/lojista/planos';
    };

    const handleBuyAddon = () => {
        // Redirecionar para compra do addon
        if (limitInfo.addon) {
            window.location.href = `/lojista/addons?preco=${limitInfo.addon.preco}`;
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}> Limite do Plano Atingido</h2>
                    <button style={styles.closeBtn} onClick={onClose}>O</button>
                </div>

                <div style={styles.body}>
                    <p style={styles.errorMessage}>{limitInfo.error}</p>

                    {limitInfo.tempoRestante && (
                        <div style={styles.waitBox}>
                            <p>° Tempo restante: <strong>{limitInfo.tempoRestante}h</strong></p>
                        </div>
                    )}

                    {limitInfo.diasRestantes && (
                        <div style={styles.waitBox}>
                            <p> Dias restantes: <strong>{limitInfo.diasRestantes} dias</strong></p>
                        </div>
                    )}

                    {limitInfo.addon && (
                        <div style={styles.addonBox}>
                            <h3> Ou compre um pacote adicional:</h3>
                            <p><strong>R$ {limitInfo.addon.preco}</strong></p>
                            <p>{limitInfo.addon.beneficios}</p>
                            <button style={styles.addonBtn} onClick={handleBuyAddon}>
                                Comprar Pacote Adicional
                            </button>
                        </div>
                    )}

                    <div style={styles.upgradeBox}>
                        <h3> Faca upgrade do seu plano!</h3>
                        <p>Tenha acesso a mais recursos e limites maiores.</p>
                        <button style={styles.upgradeBtn} onClick={handleUpgrade}>
                            Ver Planos Disponiveis
                        </button>
                    </div>
                </div>

                <div style={styles.footer}>
                    <button style={styles.cancelBtn} onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
    },
    header: {
        padding: '20px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        margin: 0,
        color: '#dc3545',
        fontSize: '1.5rem'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#999'
    },
    body: {
        padding: '20px'
    },
    errorMessage: {
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '6px'
    },
    waitBox: {
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    addonBox: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    addonBtn: {
        padding: '12px 24px',
        backgroundColor: '#bb25a6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px'
    },
    upgradeBox: {
        padding: '20px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        textAlign: 'center'
    },
    upgradeBtn: {
        padding: '12px 24px',
        backgroundColor: '#2f0d51',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px'
    },
    footer: {
        padding: '20px',
        borderTop: '1px solid #eee',
        textAlign: 'right'
    },
    cancelBtn: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    }
};

export default UpgradeModal;
