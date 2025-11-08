// web-consultor/src/components/NominatePanel.jsx

import React, { useState } from 'react';

const MAX_NOMINATIONS = 15; // Limite de indicações por consultor

const mockNominations = [
    { email: 'indicacao1@email.com', status: 'Cadastrado e Ativo' },
    { email: 'indicacao2@email.com', status: 'Pendente' },
];

const NominatePanel = () => {
    const [email, setEmail] = useState('');
    const nominationsUsed = mockNominations.length; // Simula indicações já feitas
    const nominationsRemaining = MAX_NOMINATIONS - nominationsUsed;

    const handleNominate = () => {
        if (nominationsRemaining <= 0) {
            alert(`Limite de ${MAX_NOMINATIONS} indicações atingido. Entre em contato com o suporte.`);
            return;
        }

        if (email.trim()) {
            alert(`E-mail ${email} enviado para indicação!`);
            setEmail('');
        }
    };

    return (
        <div style={styles.container}>
            {/* LOGO E TÍTULO */}
            <div style={styles.header}>
                <img src="/img/logo_compra_smart.png" alt="Compra Smart Logo" style={styles.logo} />
                <h2 style={styles.title}>Indique e Cresça Conosco!</h2>
            </div>

            {/* REGRAS DE INDICAÇÃO */}
            <div style={styles.rulesBox}>
                <h3>Faça suas indicações e ganhe!</h3>
                <p style={styles.limitText}>
                    Você pode indicar um total de {MAX_NOMINATIONS} pessoas por mês. ({nominationsRemaining} restantes)
                </p>
                <ul style={styles.rulesList}>
                    <li>O indicado deve fazer o cadastro completo na plataforma.</li>
                    <li>Após o consultor ser aprovado, você recebe *R$ 10 por indicação.</li>
                </ul>
                <p style={styles.highlightText}>Indique, ganhe e cresça conosco!</p>
            </div>

            {/* CAMPO DE INDICAÇÃO */}
            <h3 style={styles.subtitle}>Indicar Novo Consultor</h3>
            <div style={styles.inputGroup}>
                <input 
                    type="email" 
                    placeholder="E-mail da pessoa que você deseja indicar" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <button 
                    onClick={handleNominate} 
                    disabled={nominationsRemaining <= 0}
                    style={styles.button}
                >
                    Indicar Agora
                </button>
            </div>

            {/* STATUS DAS INDICAÇÕES */}
            <h3 style={styles.subtitle}>Status das Minhas Indicações ({mockNominations.length} pessoas)</h3>
            <ul style={styles.list}>
                {mockNominations.map((nom) => (
                    <li key={nom.email} style={styles.listItem}>
                        {nom.email} - <strong style={{ color: nom.status === 'Cadastrado e Ativo' ? '#28a745' : '#ffc107' }}>{nom.status}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: { 
        padding: '30px', 
        backgroundColor: 'white', 
        minHeight: '100%',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        marginBottom: '30px',
    },
    title: { 
        marginLeft: '15px',
        fontSize: '24px',
        color: '#364fab',
        margin: 0,
    },
    logo: {
        width: '60px',
        height: 'auto',
    },
    rulesBox: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
    },
    limitText: {
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: '10px',
    },
    rulesList: {
        listStyle: 'disc',
        paddingLeft: '20px',
        lineHeight: '1.6',
        fontSize: '15px',
    },
    highlightText: {
        marginTop: '15px',
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#28a745', // Cor verde para destaque positivo
    },
    subtitle: { 
        marginTop: '30px', 
        color: '#495057',
        borderBottom: '1px solid #eee',
        paddingBottom: '5px',
    },
    inputGroup: { display: 'flex', marginBottom: '20px' },
    input: { flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px', fontSize: '16px' },
    button: { 
        padding: '10px 15px', 
        backgroundColor: '#ffc107', 
        color: '#333', 
        border: 'none', 
        borderRadius: '0 4px 4px 0', 
        cursor: 'pointer', 
        fontSize: '16px', 
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    },
    list: { listStyle: 'none', padding: 0 },
    listItem: { padding: '10px 0', borderBottom: '1px dashed #eee' },
};

export default NominatePanel;