// app-frontend/src/components/PlanLimitsBar.jsx

import React from 'react';
import { usePlanLimits } from '../hooks/usePlanLimits';

const PlanLimitsBar = ({ lojistaId }) => {
    const { planInfo, getLimits, loading } = usePlanLimits(lojistaId);

    if (loading || !planInfo) {
        return <div style={styles.loading}>Carregando informacoes do plano...</div>;
    }

    const limits = getLimits();

    const renderLimitBar = (label, limit) => {
        const isNearLimit = limit.percentual >= 80;
        const isAtLimit = limit.percentual >= 100;

        return (
            <div style={styles.limitItem}>
                <div style={styles.limitHeader}>
                    <span style={styles.limitLabel}>{label}</span>
                    <span style={styles.limitNumbers}>
                        {limit.usado} / {limit.maximo}
                    </span>
                </div>
                <div style={styles.progressBar}>
                    <div 
                        style={{
                            ...styles.progressFill,
                            width: `${Math.min(limit.percentual, 100)}%`,
                            backgroundColor: isAtLimit ? '#dc3545' : isNearLimit ? '#ffc107' : '#28a745'
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                     Plano: <span style={styles.planName}>{planInfo.plano.nome}</span>
                </h3>
                <a href="/lojista/planos" style={styles.upgradeLink}>
                     Upgrade
                </a>
            </div>

            <div style={styles.limitsGrid}>
                {renderLimitBar('Produtos', limits.produtos)}
                {renderLimitBar('Filiais', limits.filiais)}
                {renderLimitBar('Vendedores', limits.vendedores)}
                {renderLimitBar('Consultores', limits.consultores)}
                {planInfo.plano.permite_video && renderLimitBar('Chamadas Video', limits.chamadasVideo)}
            </div>

            {planInfo.plano.permite_adicionais && (
                <div style={styles.addonInfo}>
                     <strong>Pacotes adicionais disponiveis por R$ {planInfo.plano.pacote_adicional_preco}</strong>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        color: '#666'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #eee'
    },
    title: {
        margin: 0,
        fontSize: '1.2rem',
        color: '#333'
    },
    planName: {
        color: '#2c5aa0',
        fontWeight: 'bold'
    },
    upgradeLink: {
        padding: '8px 16px',
        backgroundColor: '#2c5aa0',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    limitsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
    },
    limitItem: {
        marginBottom: '10px'
    },
    limitHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px'
    },
    limitLabel: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#555'
    },
    limitNumbers: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#333'
    },
    progressBar: {
        height: '8px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        transition: 'width 0.3s ease'
    },
    addonInfo: {
        marginTop: '15px',
        padding: '12px',
        backgroundColor: '#fff3cd',
        borderRadius: '6px',
        fontSize: '14px',
        textAlign: 'center'
    }
};

export default PlanLimitsBar;
