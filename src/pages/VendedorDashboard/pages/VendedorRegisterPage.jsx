import React, { useState } from 'react';

const VendedorRegisterPage = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        matricula: '',
        cpf: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logica real de registro ou link com Supabase
        console.log("Dados de registro de vendedor:", formData);
        alert("Registro enviado para aprovacao/complemento. Verifique seu e-mail.");
        // Redirecionar para tela de login ou aguardando aprovacao
    };

    const styles = {
        container: {
            padding: '50px 20px',
            maxWidth: '450px',
            margin: '50px auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
        },
        title: {
            color: '#007bff',
            marginBottom: '30px'
        },
        formGroup: {
            marginBottom: '20px',
            textAlign: 'left'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600'
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box'
        },
        submitButton: {
            width: '100%',
            padding: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            marginTop: '20px'
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}> Registro de Vendedor</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Nome Completo</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>E-mail</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>CPF</label>
                    <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} style={styles.input} placeholder="000.000.000-00" required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Crie uma Senha</label>
                    <input type="password" name="senha" value={formData.senha} onChange={handleInputChange} style={styles.input} required />
                </div>
                <button type="submit" style={styles.submitButton}>Cadastrar</button>
                <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                    Se ja possui cadastro, <a href="/vendedor/login" style={{ color: '#007bff', textDecoration: 'none' }}>faca login aqui</a>.
                </p>
            </form>
        </div>
    );
};

export default VendedorRegisterPage;

