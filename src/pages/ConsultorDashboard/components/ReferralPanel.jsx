// web-consultor/src/components/NominatePanel.jsx

import React, { useState } from 'react';

const MAX_NOMINATIONS = 15; // Limite de indicacoes por consultor

const mockNominations = [
    { email: 'indicacao1@email.com', status: 'Cadastrado e Ativo' },
    { email: 'indicacao2@email.com', status: 'Pendente' },
];

const NominatePanel = () => {
    const [email, setEmail] = useState('');
    const nominationsUsed = mockNominations.length; // Simula indicacoes ja feitas
    const nominationsRemaining = MAX_NOMINATIONS - nominationsUsed;

    const handleNominate = () => {
        if (nominationsRemaining <= 0) {
            alert(`Limite de ${MAX_NOMINATIONS} indicacoes atingido. Entre em contato com o suporte.`);
            return;
        }

        if (email.trim()) {
            alert(`E-mail ${email} enviado para indicacao!`);
            setEmail('');
        }
    };

    return (
        <div style={styles.container}>
            {/* LOGO E TTULO */}
            <div style={styles.header}>
                <img src="/img/Logo Clara.png" alt="Kaslee Logo" style={styles.logo} />
                <h2 style={styles.title}>Indique e Cresca Conosco!</h2>
            </div>

            {/* REGRAS DE INDICACAO */}
            <div style={styles.rulesBox}>
                <h3>Faca suas indicacoes e ganhe!</h3>
                <p style={styles.limitText}>
                    Voca pode indicar um total de {MAX_NOMINATIONS} pessoas por mas. ({nominationsRemaining} restantes)
                </p>
                <ul style={styles.rulesList}>
                    <li>O indicado deve fazer o cadastro completo na plataforma.</li>
                    <li>Apos o consultor ser aprovado, voca recebe *R$ 10 por indicacao.</li>
                </ul>
                <p style={styles.highlightText}>Indique, ganhe e cresca conosco!</p>
            </div>

            {/* CAMPO DE INDICACAO */}
            <h3 style={styles.subtitle}>Indicar Novo Consultor</h3>
            <div style={styles.inputGroup}>
                <input 
                    type="email" 
                    placeholder="E-mail da pessoa que voca deseja indicar" 
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

            {/* STATUS DAS INDICACOES */}
            <h3 style={styles.subtitle}>Status das Minhas Indicacoes ({mockNominations.length} pessoas)</h3>
            <ul style={styles.list}>
                {mockNominations.map((nom) => (
                    <li key={nom.email} style={styles.listItem}>
                        {nom.email} - <strong style={{ color: nom.status === 'Cadastrado e Ativo' ? '#bb25a6' : '#ffc107' }}>{nom.status}</strong>
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
        color: '#2f0d51',
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
        color: '#bb25a6', // Cor verde para destaque positivo
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
