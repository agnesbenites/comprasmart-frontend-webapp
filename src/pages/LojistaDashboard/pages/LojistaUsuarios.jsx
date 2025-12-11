import React, { useState } from 'react';

const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '32px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#2c5aa0',
        borderBottom: '2px solid #2c5aa0',
        paddingBottom: '8px',
        marginBottom: '16px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '32px',
    },
    sectionCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '32px',
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#2c5aa0',
        marginBottom: '16px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '8px',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        alignItems: 'end',
        marginBottom: '24px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '4px',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
    },
    buttonPrimary: {
        padding: '12px 16px',
        backgroundColor: '#2c5aa0',
        color: 'white',
        fontWeight: '600',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.15s',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#f9fafb',
    },
    th: {
        padding: '12px 24px',
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: '500',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '1px solid #e5e7eb',
    },
    td: {
        padding: '16px 24px',
        fontSize: '14px',
        borderBottom: '1px solid #e5e7eb',
    },
    badge: {
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: '600',
        borderRadius: '9999px',
        display: 'inline-block',
    },
    badgeSuccess: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
    },
    badgeWarning: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
    },
    badgeDanger: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
    },
    buttonSmall: {
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: '600',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s',
    },
    buttonGreen: {
        backgroundColor: '#10b981',
        color: 'white',
    },
    buttonRed: {
        backgroundColor: '#ef4444',
        color: 'white',
    },
};

const initialUsers = [
    { id: 1, nome: 'Ana Paula Matos', email: 'ana.matos@lojista.com', perfil: 'Admin Lojista', filial: 'Matriz', status: 'ativo' },
    { id: 2, nome: 'Joao Silva', email: 'joao.silva@lojista.com', perfil: 'Vendedor', filial: 'Loja Centro - SP', status: 'ativo' },
    { id: 3, nome: 'Carla Dias', email: 'carla.dias@lojista.com', perfil: 'Vendedor', filial: 'Filial Online', status: 'ativo' },
    { id: 4, nome: 'Pedro Costa', email: 'pedro.costa@lojista.com', perfil: 'Admin Lojista', filial: 'Matriz', status: 'inativo' },
];

const initialConsultores = [
    { id: 101, nome: 'Marcus Vinicius (Consultor Externo)', email: 'marcus.v@consultor.com', status: 'pendente' },
    { id: 102, nome: 'Juliana Lima (Consultora Externa)', email: 'juliana.l@consultor.com', status: 'aprovado' },
];

const LojistaUsuarios = () => {
    const [usuarios, setUsuarios] = useState(initialUsers);
    const [consultores, setConsultores] = useState(initialConsultores);
    const [novoNome, setNovoNome] = useState('');
    const [novoEmail, setNovoEmail] = useState('');
    const [novoPerfil, setNovoPerfil] = useState('Vendedor');
    const [novaFilial, setNovaFilial] = useState('Loja Centro - SP');
    const [filiaisMock] = useState(['Matriz', 'Loja Centro - SP', 'Filial Online', 'Quiosque Shopping']);

    const handleAddUser = () => {
        if (novoNome && novoEmail) {
            const newUser = {
                id: Date.now(),
                nome: novoNome,
                email: novoEmail,
                perfil: novoPerfil,
                filial: novoPerfil === 'Vendedor' ? novaFilial : 'Matriz',
                status: 'ativo'
            };
            setUsuarios([...usuarios, newUser]);
            setNovoNome('');
            setNovoEmail('');
        }
    };

    const handleToggleStatus = (id) => {
        setUsuarios(usuarios.map(u =>
            u.id === id ? { ...u, status: u.status === 'ativo' ? 'inativo' : 'ativo' } : u
        ));
    };

    const handleAprovarConsultor = (id) => {
        setConsultores(consultores.map(c => 
            c.id === id ? { ...c, status: 'aprovado' } : c
        ));
    };

    const handleRecusarConsultor = (id) => {
        setConsultores(consultores.map(c => 
            c.id === id ? { ...c, status: 'recusado' } : c
        ));
    };
    
    const renderStatusBadge = (status) => {
        const badgeStyle = { ...styles.badge };
        
        switch (status) {
            case 'ativo': 
                return <span style={{...badgeStyle, ...styles.badgeSuccess}}>Ativo</span>;
            case 'inativo': 
                return <span style={{...badgeStyle, ...styles.badgeDanger}}>Inativo</span>;
            case 'pendente': 
                return <span style={{...badgeStyle, ...styles.badgeWarning}}>Aguardando</span>;
            case 'aprovado': 
                return <span style={{...badgeStyle, ...styles.badgeSuccess}}>Aprovado</span>;
            case 'recusado': 
                return <span style={{...badgeStyle, ...styles.badgeDanger}}>Recusado</span>;
            default: 
                return <span style={badgeStyle}>{status}</span>;
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.title}> Gestao de Usuarios e Acessos</h1>
            <p style={styles.subtitle}>Controle quem pode acessar o painel e quais permissoes cada usuario possui.</p>

            {/* Cadastro de Novo Usuario Interno */}
            <section style={styles.sectionCard}>
                <h2 style={styles.cardTitle}>O Adicionar Usuario Interno (Lojista/Vendedor)</h2>
                <div style={styles.formRow}>
                    <div style={{...styles.formGroup, gridColumn: 'span 2'}}>
                        <label style={styles.label}>Nome</label>
                        <input 
                            type="text" 
                            value={novoNome} 
                            onChange={(e) => setNovoNome(e.target.value)} 
                            placeholder="Nome completo" 
                            style={styles.input} 
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                            type="email" 
                            value={novoEmail} 
                            onChange={(e) => setNovoEmail(e.target.value)} 
                            placeholder="email@lojista.com" 
                            style={styles.input} 
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Perfil</label>
                        <select 
                            value={novoPerfil} 
                            onChange={(e) => setNovoPerfil(e.target.value)} 
                            style={styles.input}
                        >
                            <option value="Admin Lojista">Admin Lojista</option>
                            <option value="Vendedor">Vendedor</option>
                        </select>
                    </div>
                    {novoPerfil === 'Vendedor' && (
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Filial/Unidade</label>
                            <select 
                                value={novaFilial} 
                                onChange={(e) => setNovaFilial(e.target.value)} 
                                style={styles.input}
                            >
                                {filiaisMock.map(filial => (
                                    <option key={filial} value={filial}>{filial}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button onClick={handleAddUser} style={styles.buttonPrimary}>
                        Salvar Usuario
                    </button>
                </div>
            </section>

            {/* Tabela de Usuarios Internos */}
            <section style={styles.sectionCard}>
                <h2 style={styles.cardTitle}> Equipe Interna ({usuarios.length})</h2>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.th}>Nome</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Perfil</th>
                                <th style={styles.th}>Filial</th>
                                <th style={{...styles.th, textAlign: 'center'}}>Status</th>
                                <th style={{...styles.th, textAlign: 'center'}}>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(user => (
                                <tr key={user.id}>
                                    <td style={{...styles.td, fontWeight: '500', color: '#111827'}}>{user.nome}</td>
                                    <td style={{...styles.td, color: '#6b7280'}}>{user.email}</td>
                                    <td style={{...styles.td, fontWeight: '600'}}>{user.perfil}</td>
                                    <td style={{...styles.td, color: '#6b7280'}}>{user.filial}</td>
                                    <td style={{...styles.td, textAlign: 'center'}}>{renderStatusBadge(user.status)}</td>
                                    <td style={{...styles.td, textAlign: 'center'}}>
                                        <button 
                                            onClick={() => handleToggleStatus(user.id)}
                                            style={{
                                                ...styles.buttonSmall,
                                                backgroundColor: user.status === 'ativo' ? '#dc3545' : '#17a2b8',
                                                color: 'white'
                                            }}
                                        >
                                            {user.status === 'ativo' ? 'Desativar' : 'Ativar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Aprovacao de Consultores */}
            <section style={styles.sectionCard}>
                <h2 style={styles.cardTitle}> Solicitacoes de Consultores Externos ({consultores.filter(c => c.status === 'pendente').length})</h2>
                <p style={{color: '#6b7280', marginBottom: '16px', fontSize: '14px'}}>
                    Aprove ou recuse os consultores da plataforma que desejam vender seus produtos em parceria.
                </p>
                
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.th}>Nome do Consultor</th>
                                <th style={styles.th}>Email</th>
                                <th style={{...styles.th, textAlign: 'center'}}>Status da Parceria</th>
                                <th style={{...styles.th, textAlign: 'center'}}>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultores.map(consultor => (
                                <tr key={consultor.id}>
                                    <td style={{...styles.td, fontWeight: '500', color: '#111827'}}>{consultor.nome}</td>
                                    <td style={{...styles.td, color: '#6b7280'}}>{consultor.email}</td>
                                    <td style={{...styles.td, textAlign: 'center'}}>{renderStatusBadge(consultor.status)}</td>
                                    <td style={{...styles.td, textAlign: 'center'}}>
                                        {consultor.status === 'pendente' ? (
                                            <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                                <button 
                                                    onClick={() => handleAprovarConsultor(consultor.id)}
                                                    style={{...styles.buttonSmall, ...styles.buttonGreen}}
                                                >
                                                    Aprovar
                                                </button>
                                                <button 
                                                    onClick={() => handleRecusarConsultor(consultor.id)}
                                                    style={{...styles.buttonSmall, ...styles.buttonRed}}
                                                >
                                                    Recusar
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{color: '#6b7280', fontSize: '12px'}}>
                                                Parceria {consultor.status === 'aprovado' ? 'Ativa' : 'Recusada'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default LojistaUsuarios;
