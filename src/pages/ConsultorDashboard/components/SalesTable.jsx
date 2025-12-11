// web-consultor/src/components/AnalyticsPanel.jsx

import React, { useState } from 'react';

// Dados mockados para simular o que vira do Supabase
const mockAnalytics = {
    avgTime: '12 min',          // 1. Tempo medio de atendimento
    dailyCount: 15,             // 2. Quantidade de atendimento diario
    commissionValue: 'R$ 350,00',// 3. Valor de comissao
    closedSales: 8,             // 7. Quantidade de compras fechadas
    qrCodesSent: 25,            // 6. Quantidade de qr codes enviados
    indicatedConsultants: 3,    // 5. Pessoas indicadas
    rating: 4.8,                // 11. Avaliacao
    associatedStores: ['Magazine X', 'Loja Y'], // 12. Lojas
    associatedSegments: ['Eletr´nicos', 'Decoracao'] // 13. Segmentos
};

const MetricCard = ({ title, value, detail }) => (
    <div style={analyticsStyles.card}>
        <h4 style={analyticsStyles.cardTitle}>{title}</h4>
        <p style={analyticsStyles.cardValue}>{value}</p>
        {detail && <small style={analyticsStyles.cardDetail}>{detail}</small>}
    </div>
);

const AnalyticsPanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [productStock, setProductStock] = useState(null);

    // 9. Pesquisa de Produtos e Estoque (Simulacao)
    const handleSearch = () => {
        // Logica futura: axios.get('/api/estoque?sku=' + searchTerm)
        if (searchTerm.toLowerCase().includes('sku123')) {
            setProductStock('Produto X: 50 unidades em Estoque na Loja Y.');
        } else {
            setProductStock('Produto nao encontrado ou estoque baixo.');
        }
    };

    // 10. Geracao de QR Code (Simulacao)
    const handleGenerateQR = () => {
        alert('Funcionalidade de Geracao de QR Code Final sera implementada no Backend.');
    };

    // 4. Campo de Indicacao (Simulacao)
    const handleNominate = () => {
        alert('Formulario de Indicacao de Consultor sera implementado.');
    };

    return (
        <div style={analyticsStyles.container}>
            
            {/* 1. M‰TRICAS DE DESEMPENHO (Itens 1, 2, 3, 5, 6, 7, 11) */}
            <h2>Visao Geral e Desempenho</h2>
            <div style={analyticsStyles.metricsGrid}>
                <MetricCard title="Atendimento Diario" value={mockAnalytics.dailyCount} />
                <MetricCard title="Vendas Fechadas" value={mockAnalytics.closedSales} />
                <MetricCard title="Comissao (Mas)" value={mockAnalytics.commissionValue} />
                <MetricCard title="Avaliacao Media" value={mockAnalytics.rating} detail="(Item 11)" />
                <MetricCard title="Indicacoes Ativas" value={mockAnalytics.indicatedConsultants} detail="(Item 5)" />
            </div>

            {/* 2. FERRAMENTAS ESSENCIAIS (Itens 9, 10) */}
            <h3>Ferramentas de Atendimento</h3>
            
            <div style={analyticsStyles.toolContainer}>
                {/* 9. Pesquisa de Estoque */}
                <input 
                    type="text" 
                    placeholder="Pesquisar Produto/Estoque (SKU, Nome)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={analyticsStyles.searchInput} 
                />
                <button onClick={handleSearch} style={{...analyticsStyles.toolButton, backgroundColor: '#364fab'}}>
                    Buscar Estoque
                </button>
            </div>
            {productStock && <p style={analyticsStyles.stockResult}>{productStock}</p>}

            {/* 10. Gerar QR Code Final */}
            <button onClick={handleGenerateQR} style={{...analyticsStyles.toolButtonLarge, backgroundColor: '#28a745'}}>
                Gerar QR Code Final do Carrinho (Item 10)
            </button>


            {/* 3. INFORMACOES PESSOAIS E INDICACAO (Itens 4, 12, 13) */}
            <h3 style={{ marginTop: '30px' }}>Minha Afiliacao e Indicacoes</h3>

            <div style={analyticsStyles.infoGrid}>
                <div>
                    <h4>Lojas Associadas (Item 12)</h4>
                    <p>{mockAnalytics.associatedStores.join(', ')}</p>
                </div>
                <div>
                    <h4>Segmentos (Item 13)</h4>
                    <p>{mockAnalytics.associatedSegments.join(', ')}</p>
                </div>
                <div>
                    {/* 4. Campo para Indicar Pessoas */}
                    <h4>Indicar Novo Consultor (Item 4)</h4>
                    <button onClick={handleNominate} style={analyticsStyles.nominateButton}>
                        Indicar Nova Pessoa
                    </button>
                </div>
            </div>

            {/* 4. HIST“RICO DE COMPRAS (Item 8) */}
            <h3 style={{ marginTop: '30px' }}>Historico de Compras Finalizadas (Item 8)</h3>
            <p>O historico detalhado (Pedido, Valor, Loja, Data) sera exibido aqui.</p>
        </div>
    );
};

const analyticsStyles = {
    container: {
        padding: '30px',
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100%',
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
    },
    cardTitle: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '0 0 5px 0',
    },
    cardValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#364fab',
        margin: 0,
    },
    cardDetail: {
        fontSize: '10px',
        color: '#888',
    },
    // Ferramentas
    toolContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    searchInput: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        flexGrow: 1,
        marginRight: '10px',
    },
    stockResult: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #ffeeba',
    },
    toolButton: {
        padding: '10px 15px',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    toolButtonLarge: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        marginBottom: '20px',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        padding: '20px 0',
        borderTop: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    nominateButton: {
        padding: '10px 15px',
        backgroundColor: '#ffc107',
        color: '#333',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
    }
};

export default AnalyticsPanel;
