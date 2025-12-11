import React, { useState } from 'react';

// Dados mockados de QR Codes gerados
// CORRECAO: Usando IDs e adicionando saleValue (valor simulado da venda)
const MOCK_QRS = [
    { id: 'QR-001-A', source: 'Vendedor', department: 'Eletrodomesticos', status: 'Ativo', creator: 'VEND-202', saleValue: 4899.00 }, 
    { id: 'QR-002-C', source: 'Consultor', department: 'Moveis', status: 'Ativo', creator: 'CONS-101', saleValue: 1250.50 }, // ID do Consultor
    { id: 'QR-003-A', source: 'Vendedor', department: 'Cama/Banho', status: 'Inativo', creator: 'VEND-208', saleValue: 0.00 },
    { id: 'QR-004-C', source: 'Consultor', department: 'Tecnologia', status: 'Ativo', creator: 'CONS-105', saleValue: 8200.00 }, // ID do Consultor
    { id: 'QR-005-A', source: 'Lojista', department: 'Geral', status: 'Ativo', creator: 'Agnes Lojista', saleValue: 349.90 },
];

const DEPARTMENTS = [
    'Eletrodomesticos',
    'Moveis',
    'Tecnologia',
    'Cama/Banho',
    'Geral',
];

const LojistaQRCode = () => {
    const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
    const [generatedLink, setGeneratedLink] = useState('');
    // NOVO ESTADO: Para o modal de visualizacao de QR rastreado
    const [modalData, setModalData] = useState(null); 

    // === GERACAO DE QR CODE (SIMULADA) ===
    const handleGenerateQR = () => {
        // Simula a criacao de um link rastreavel por departamento e loja
        const baseLink = "http://api.comprasmar.com/link";
        const newId = `QR-${Math.floor(Math.random() * 900) + 100}-L`;
        const link = `${baseLink}?source=LOJISTA&dept=${selectedDept}&loja=Agnes&qrId=${newId}`;
        setGeneratedLink(link);
    };

    // --- Funcoes do Modal de Rastreamento ---
    const handleViewTrackedQR = (qr) => {
        setModalData(qr);
    };

    const closeModal = () => {
        setModalData(null);
    };

    const handleCopyLink = () => {
        if (modalData) {
            const tempLink = `http://api.comprasmar.com/rastreamento?id=${modalData.id}&creator=${modalData.creator}`;
            
            // Usando document.execCommand('copy') como fallback seguro em iframes
            const tempInput = document.createElement('input');
            tempInput.value = tempLink;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            console.log(`Link do QR Code ${modalData.id} copiado para a area de transferancia.`);
            closeModal();
        }
    };
    // ----------------------------------------


    // Estilos internos
    const styles = {
        container: {
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        },
        title: {
            color: '#2c5aa0',
            fontSize: '2rem',
            marginBottom: '20px',
            borderBottom: '2px solid #eee',
            paddingBottom: '10px'
        },
        section: {
            marginBottom: '40px',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa'
        },
        sectionTitle: {
            fontSize: '1.5rem',
            color: '#495057',
            marginBottom: '20px',
        },
        // Geracao
        generationArea: {
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginBottom: '20px'
        },
        select: {
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            minWidth: '200px'
        },
        generateButton: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
        },
        generatedBox: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '2px dashed #007bff',
            textAlign: 'center',
        },
        linkText: {
            fontSize: '0.9rem',
            wordBreak: 'break-all',
            marginTop: '10px',
            color: '#007bff'
        },
        // Tabela de Rastreamento
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '700px',
        },
        th: {
            backgroundColor: '#e9f1ff',
            borderBottom: '2px solid #2c5aa0',
            padding: '12px 15px',
            textAlign: 'left',
            color: '#2c5aa0',
            fontSize: '0.9rem',
        },
        td: {
            borderBottom: '1px solid #eee',
            padding: '12px 15px',
            fontSize: '0.9rem',
            color: '#333',
        },
        sourceTag: {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            display: 'inline-block',
        },
        // Estilos do Modal
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '400px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
        },
        linkDisplay: {
            wordBreak: 'break-all',
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            fontSize: '0.9rem',
            textAlign: 'left',
        },
        copyButton: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '15px',
            transition: 'background-color 0.2s',
        },
        closeButton: {
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '10px',
            marginLeft: '10px',
            transition: 'background-color 0.2s',
        },
        infoBox: {
            backgroundColor: '#eaf2ff',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid #c8d9f1',
        }
    };

    // Logica para definir a cor da Tag de Fonte
    const getSourceStyle = (source) => {
        if (source === 'Vendedor') return { backgroundColor: '#fff3cd', color: '#856404' }; // Amarelo para Vendedor
        if (source === 'Consultor') return { backgroundColor: '#d1ecf1', color: '#0c5460' }; // Ciano para Consultor
        return { backgroundColor: '#d4edda', color: '#155724' }; // Verde para Lojista/Outros
    };

    // NOVO COMPONENTE: Modal para visualizar o QR rastreado
    const QRCodeModal = () => {
        if (!modalData) return null;

        const saleValue = modalData.saleValue.toFixed(2).replace('.', ',');
        const fullUrl = `http://api.comprasmar.com/rastreamento?id=${modalData.id}&creator=${modalData.creator}&dept=${modalData.department}`;

        return (
            <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                    <h2 style={{color: styles.title.color, marginBottom: '20px'}}>
                         Detalhes do QR Code {modalData.id}
                    </h2>
                    
                    <div style={styles.infoBox}>
                        <p style={{ margin: '5px 0', fontSize: '1.1rem', fontWeight: 'bold', color: styles.title.color }}>
                            Criador: {modalData.creator} ({modalData.source})
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '1.1rem', fontWeight: 'bold', color: modalData.saleValue > 0 ? '#28a745' : '#dc3545' }}>
                            Valor da Venda (Simulado): R$ {saleValue}
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>
                            Departamento: {modalData.department}
                        </p>
                    </div>

                    {/* Simulacao Visual do QR Code */}
                    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', marginBottom: '15px' }}>
                        <p style={{ margin: 0, color: '#495057', fontWeight: 'bold' }}>[Simulacao de QR Code]</p>
                        <img 
                            src={`https://placehold.co/100x100/6f42c1/ffffff?text=${modalData.id}`} 
                            alt="QR Code Simulado" 
                            style={{marginTop: '10px', borderRadius: '5px'}}
                        />
                    </div>
                    
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Link de Rastreamento:</p>
                    <div style={styles.linkDisplay}>
                        {fullUrl}
                    </div>

                    <button 
                        onClick={handleCopyLink}
                        style={styles.copyButton}
                    >
                         Copiar Link
                    </button>
                    <button 
                        onClick={closeModal}
                        style={styles.closeButton}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}> Gerenciamento de QR Codes de Atendimento</h1>

            {/* 1. Geracao de QR Code por Departamento */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>1. Gerar Novo QR Code (Por Departamento)</h2>
                <p style={{ color: '#666' }}>
                    Selecione o departamento para o qual este QR Code sera usado no ponto de venda:
                </p>
                
                <div style={styles.generationArea}>
                    <select
                        style={styles.select}
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <button 
                        style={styles.generateButton}
                        onClick={handleGenerateQR}
                    >
                        Gerar QR Code/Link
                    </button>
                </div>

                {generatedLink && (
                    <div style={styles.generatedBox}>
                        <h3 style={{ color: '#2c5aa0', marginTop: 0, fontSize: '1.2rem' }}>QR Code Gerado!</h3>
                        <p style={{ color: '#333', marginBottom: '15px' }}>
                            Compartilhe este link ou imprima o QR Code (simulado abaixo).
                        </p>
                        <div style={{ margin: '10px auto', width: '150px', height: '150px', backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
                            <img 
                                src={`https://placehold.co/130x130/007bff/ffffff?text=${selectedDept.split('')[0]}-QR`} 
                                alt="QR Code Simulado" 
                                style={{ width: '100%', height: '100%', borderRadius: '3px' }}
                            />
                        </div>
                        <p style={styles.linkText}>{generatedLink}</p>
                    </div>
                )}
            </div>

            {/* 2. Rastreamento de QR Codes */}
            <div style={{ ...styles.section, backgroundColor: 'white' }}>
                <h2 style={styles.sectionTitle}>2. Rastreamento de QR Codes (Vendedores e Consultores)</h2>
                <p style={{ color: '#666' }}>
                    Visualizacao de todos os QRs criados (Vendedores internos e Consultores externos).
                </p>
                <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Criador</th>
                                <th style={styles.th}>Fonte</th>
                                <th style={styles.th}>Departamento</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Valor Venda (Sim.)</th>
                                <th style={styles.th}>Acao</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_QRS.map((qr) => (
                                <tr key={qr.id}>
                                    <td style={styles.td}>{qr.id}</td>
                                    <td style={styles.td}>
                                        <strong>{qr.creator}</strong> 
                                    </td>
                                    <td style={styles.td}>
                                        <span style={getSourceStyle(qr.source)}>{qr.source}</span>
                                    </td>
                                    <td style={styles.td}>{qr.department}</td>
                                    <td style={styles.td} className={qr.status === 'Ativo' ? 'text-green-600' : 'text-red-600'}>
                                        {qr.status}
                                    </td>
                                    {/* Exibicao do valor na tabela */}
                                    <td style={{...styles.td, fontWeight: 'bold', color: qr.saleValue > 0 ? '#28a745' : '#dc3545'}}>
                                        R$ {qr.saleValue.toFixed(2).replace('.', ',')}
                                    </td>
                                    <td style={styles.td}>
                                        {/* Botao para abrir o modal */}
                                        <button 
                                            onClick={() => handleViewTrackedQR(qr)}
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.2s',
                                            }}
                                        >
                                            Ver QR Code
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Renderiza o Modal */}
            <QRCodeModal />
        </div>
    );
};

export default LojistaQRCode;
