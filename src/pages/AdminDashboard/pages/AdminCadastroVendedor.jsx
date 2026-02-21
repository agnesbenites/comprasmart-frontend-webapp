// src/pages/AdminCadastroVendedor.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { House, CheckCircle, XCircle, Clock, Tag, HourglassHigh, Lifebuoy, Storefront, ChatCircle } from '@phosphor-icons/react';

const AdminCadastroVendedor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    email: "",
    telefone: "",
    loja: "",
    departamento: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validacoes basicas
    if (
      !formData.matricula ||
      !formData.nome ||
      !formData.email ||
      !formData.telefone
    ) {
      setError("Preencha todos os campos obrigatorios.");
      return;
    }

    // Gerar senha temporaria
    const senhaTemporaria = generateRandomPassword();

    try {
      // Simulacao de cadastro no sistema
      console.log("Cadastrando vendedor:", {
        ...formData,
        senhaTemporaria,
        tipo: "vendedor_interno",
        dataCadastro: new Date().toISOString(),
      });

      // Aqui viria a integracao com a API/Supabase
      // await axios.post('/api/admin/vendedores', { ...formData, senhaTemporaria });

      setSuccess(`Vendedor cadastrado com sucesso! 
        Numero de Matricula: ${formData.matricula}
        Senha Temporaria: ${senhaTemporaria}
        
        Estas informacoes foram enviadas para o e-mail do vendedor.`);

      // Limpar formulario
      setFormData({
        matricula: "",
        nome: "",
        email: "",
        telefone: "",
        loja: "",
        departamento: "",
      });
    } catch (err) {
      setError("Erro ao cadastrar vendedor. Tente novamente.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Cabecalho com identificacao clara que e area restrita */}
        <div style={styles.header}>
          <div style={styles.headerIcon}><House size={24} weight="duotone" color="#2f0d51" /></div>
          <h1 style={styles.title}>Cadastro de Vendedor Interno</h1>
          <p style={styles.subtitle}>
            rea exclusiva para administradores - Sistema Interno
          </p>
        </div>

        {/* Aviso de confidencialidade */}
        <div style={styles.alert}>
          <strong>  ACESSO RESTRITO</strong>
          <br />
          Esta pagina nao esta visivel para consultores externos ou vendedores.
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Numero de Matricula */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Numero de Matricula *</label>
            <input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              placeholder="Ex: VEND001, FUNC123"
              style={styles.input}
              required
            />
            <small style={styles.helpText}>
              Numero unico de identificacao do vendedor na empresa
            </small>
          </div>

          {/* Dados Pessoais */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome do vendedor"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>E-mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@empresa.com"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Telefone/WhatsApp *</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Loja/Filial</label>
              <select
                name="loja"
                value={formData.loja}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Selecione a loja</option>
                <option value="matriz">Matriz</option>
                <option value="filial-norte">Filial Shopping Norte</option>
                <option value="filial-centro">Filial Centro</option>
                <option value="filial-sul">Filial Zona Sul</option>
              </select>
            </div>
          </div>

          {/* Departamento */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Departamento/Setor</label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Selecione o departamento</option>
              <option value="vendas">Vendas</option>
              <option value="atendimento">Atendimento ao Cliente</option>
              <option value="telemarketing">Telemarketing</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          </div>

          {error && <div style={styles.errorAlert}>{error}</div>}

          {success && (
            <div style={styles.successAlert}>
              <pre style={styles.successText}>{success}</pre>
              <small>  Salve estas informacoes em local seguro</small>
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/lojista/dashboard")}
              style={styles.cancelButton}
            >
              &#8592; Voltar ao Dashboard
            </button>
            <button type="submit" style={styles.submitButton}>
               Cadastrar Vendedor
            </button>
          </div>
        </form>

        {/* Informacoes do processo */}
        <div style={styles.infoBox}>
          <h4> Como funciona:</h4>
          <ul style={styles.infoList}>
            <li> Sistema gera senha temporaria automaticamente</li>
            <li> Credenciais sao enviadas por e-mail para o vendedor</li>
            <li> Vendedor deve alterar a senha no primeiro acesso</li>
            <li> Acesso imediato ao sistema apos cadastro</li>
            <li>
               <strong>Comissoes configuradas internamente</strong> (nao
              visivel aqui)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "30px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    borderBottom: "2px solid #dc3545",
    paddingBottom: "20px",
  },
  headerIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },
  title: {
    color: "#dc3545",
    margin: "0 0 10px 0",
    fontSize: "28px",
  },
  subtitle: {
    color: "#666",
    fontSize: "16px",
    margin: 0,
  },
  alert: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeaa7",
    color: "#856404",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "25px",
    textAlign: "center",
    fontSize: "14px",
  },
  form: {
    marginBottom: "30px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "15px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  helpText: {
    display: "block",
    marginTop: "5px",
    color: "#666",
    fontSize: "12px",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  },
  successAlert: {
    backgroundColor: "#d1edff",
    color: "#0c5460",
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "20px",
    border: "1px solid #bee5eb",
  },
  successText: {
    margin: "0 0 10px 0",
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    fontSize: "14px",
    fontWeight: "bold",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "30px",
  },
  cancelButton: {
    padding: "12px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    flex: 1,
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    flex: 2,
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "5px",
    border: "1px solid #dee2e6",
  },
  infoList: {
    margin: "10px 0 0 0",
    paddingLeft: "20px",
    color: "#555",
  },
};

export default AdminCadastroVendedor;

