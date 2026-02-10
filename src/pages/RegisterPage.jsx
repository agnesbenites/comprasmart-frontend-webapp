// src/pages/RegisterPage.jsx
// Pagina de Cadastro - Consultor e Lojista

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from '../supabaseClient';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detectar tipo pela URL
  const userType = location.pathname.includes('consultor') ? 'consultor' : 'lojista';
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    cpfCnpj: "",
  });
  
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = {
    consultor: { primary: "#17a2b8", bg: "#e0f7fa" },
    lojista: { primary: "#bb25a6", bg: "#e8f5e9" },
  };

  const currentColor = colors[userType];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    // Validacoes
    if (!formData.nome || !formData.email || !formData.senha) {
      setErro("Preencha todos os campos obrigatorios");
      return;
    }

    if (formData.senha.length < 6) {
      setErro("A senha deve ter no minimo 6 caracteres");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas nao coincidem");
      return;
    }

    setLoading(true);

    try {
      //  CHAMADA REAL: Cadastrar o usuario via Supabase Auth
      const { error } = await supabase.auth.signUp({
        email: formData.email, 
        password: formData.senha,
        options: {
            data: { 
                // Passa dados extras (metadata) para o auth.users
                nome: formData.nome,
            }
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // A Trigger no banco de dados agora criara o perfil na tabela 'usuarios'.

      alert(`Cadastro de ${userType} realizado! Verifique seu e-mail para confirmar a conta e aguarde aprovacao.`);
      
      // Redirecionar para a tela de espera/confirmacao
      navigate('/aguardando-aprovacao');

    } catch (error) {
      setErro(`Erro ao cadastrar: ${error.message || 'Verifique sua conexao.'}`);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return userType === 'consultor' 
      ? 'Cadastro de Consultor' 
      : 'Cadastro de Lojista';
  };

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.card,
        borderTop: `4px solid ${currentColor.primary}`
      }}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={{
            ...styles.title,
            color: currentColor.primary
          }}>
            {getTitle()}
          </h1>
          <p style={styles.subtitle}>
            Preencha os dados para criar sua conta
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Nome */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Telefone */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* CPF/CNPJ */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              {userType === 'consultor' ? 'CPF' : 'CNPJ'}
            </label>
            <input
              type="text"
              name="cpfCnpj"
              value={formData.cpfCnpj}
              onChange={handleChange}
              placeholder={userType === 'consultor' ? '000.000.000-00' : '00.000.000/0000-00'}
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Senha */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha *</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Minimo 6 caracteres"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Confirmar Senha */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Senha *</label>
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Repita a senha"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Erro */}
          {erro && (
            <div style={styles.erro}>
               {erro}
            </div>
          )}

          {/* Botao */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: currentColor.primary,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>

          {/* Link de Login */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Ja tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate(`/${userType}/login`)}
                style={{
                  ...styles.linkButton,
                  color: currentColor.primary
                }}
              >
                Faca login aqui
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos (fora do componente)
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.3s',
  },
  erro: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  button: {
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  footerText: {
    fontSize: '14px',
    color: '#666',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

//  CORRECAO: Exportar como default
export default RegisterPage;
