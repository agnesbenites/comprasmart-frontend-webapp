// src/pages/RegisterPage.jsx
// Cadastro de Consultor com Validacao Biometrica

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BiometricValidation from "../components/BiometricValidation";

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [etapa, setEtapa] = useState(1); // 1: Biometria, 2: Dados, 3: Senha
  const [validacaoConcluida, setValidacaoConcluida] = useState(false);
  const [dadosValidados, setDadosValidados] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    rg: "",
    dataNascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Callback da validacao biometrica
  const handleValidationComplete = (result) => {
    if (result.aprovado) {
      setValidacaoConcluida(true);
      setDadosValidados(result.dados);
      
      // Preencher automaticamente os dados extraidos do documento
      setFormData({
        ...formData,
        nome: result.dados.nome || "",
        cpf: result.dados.cpf || "",
        rg: result.dados.rg || "",
        dataNascimento: result.dados.data_nascimento || "",
      });
      
      setEtapa(2);
      alert(" Identidade validada! Score: " + result.score + "%\n\nDados preenchidos automaticamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarEtapa2 = () => {
    if (!formData.email || !formData.telefone) {
      setErro("Preencha Email e Telefone");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErro("Email invalido");
      return false;
    }
    setErro("");
    return true;
  };

  const validarEtapa3 = () => {
    if (!formData.senha || formData.senha.length < 6) {
      setErro("Senha deve ter no minimo 6 caracteres");
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas nao coincidem");
      return false;
    }
    setErro("");
    return true;
  };

  const proximaEtapa = () => {
    if (etapa === 2 && !validarEtapa2()) return;
    if (etapa === 3 && !validarEtapa3()) return;
    
    if (etapa < 3) {
      setEtapa(etapa + 1);
    } else {
      handleSubmit();
    }
  };

  const etapaAnterior = () => {
    if (etapa > 2) { // Nao volta para biometria
      setEtapa(etapa - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErro("");

    try {
      const payload = {
        ...formData,
        tipo: "consultor",
        validacao_biometrica: {
          aprovado: true,
          score: dadosValidados?.score || 95,
          dados_extraidos: dadosValidados,
        },
      };

      // TODO: Enviar para API
      console.log("Enviando:", payload);
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(" Cadastro realizado com sucesso!\n\nFaca login para comecar.");
      navigate("/consultor/login");
    } catch (error) {
      setErro("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* ETAPA 1: VALIDACAO BIOM‰TRICA */}
      {etapa === 1 && !validacaoConcluida && (
        <BiometricValidation
          onValidationComplete={handleValidationComplete}
          userType="consultor"
        />
      )}

      {/* ETAPAS 2 e 3: FORMULRIO */}
      {etapa >= 2 && validacaoConcluida && (
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}> Cadastro de Consultor</h1>
            <p style={styles.subtitle}>Complete seus dados para comecar</p>
            
            {/* Badge de validacao */}
            <div style={styles.validatedBadge}>
               Identidade Verificada - Score: {dadosValidados?.score || 95}%
            </div>

            {/* Progress */}
            <div style={styles.progressBar}>
              <div style={{...styles.progressStep, backgroundColor: "#28a745"}}>“</div>
              <div style={{...styles.progressStep, backgroundColor: etapa >= 2 ? "#28a745" : "#e0e0e0"}}>2</div>
              <div style={{...styles.progressStep, backgroundColor: etapa >= 3 ? "#28a745" : "#e0e0e0"}}>3</div>
            </div>
            <div style={styles.progressLabels}>
              <span style={styles.labelActive}>Biometria</span>
              <span style={etapa >= 2 ? styles.labelActive : styles.label}>Dados</span>
              <span style={etapa >= 3 ? styles.labelActive : styles.label}>Senha</span>
            </div>
          </div>

          <form style={styles.form}>
            {/* ETAPA 2: DADOS PESSOAIS */}
            {etapa === 2 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}> Dados Pessoais</h2>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      backgroundColor: dadosValidados?.nome ? "#e8f5e9" : "white"
                    }}
                    readOnly={!!dadosValidados?.nome}
                  />
                  {dadosValidados?.nome && (
                    <span style={styles.autoFilled}> Extraido do documento</span>
                  )}
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>CPF *</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      style={{
                        ...styles.input,
                        backgroundColor: dadosValidados?.cpf ? "#e8f5e9" : "white"
                      }}
                      readOnly={!!dadosValidados?.cpf}
                    />
                    {dadosValidados?.cpf && (
                      <span style={styles.autoFilled}> Extraido</span>
                    )}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>RG *</label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleChange}
                      placeholder="00.000.000-0"
                      style={{
                        ...styles.input,
                        backgroundColor: dadosValidados?.rg ? "#e8f5e9" : "white"
                      }}
                      readOnly={!!dadosValidados?.rg}
                    />
                    {dadosValidados?.rg && (
                      <span style={styles.autoFilled}> Extraido</span>
                    )}
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Data de Nascimento *</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      backgroundColor: dadosValidados?.data_nascimento ? "#e8f5e9" : "white"
                    }}
                    readOnly={!!dadosValidados?.data_nascimento}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Telefone *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Endereco</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, Numero"
                    style={styles.input}
                  />
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="Cidade"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      <option value="">UF</option>
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                      <option value="ES">ES</option>
                      <option value="PR">PR</option>
                      <option value="SC">SC</option>
                      <option value="RS">RS</option>
                      {/* Adicionar outros estados */}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: SENHA */}
            {etapa === 3 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}> Criar Senha de Acesso</h2>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Senha *</label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Minimo 6 caracteres"
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirmar Senha *</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Repita a senha"
                    style={styles.input}
                  />
                </div>

                <div style={styles.resumo}>
                  <h3 style={styles.resumoTitle}> Resumo do Cadastro</h3>
                  <div style={styles.resumoItem}>
                    <strong>Nome:</strong> {formData.nome}
                  </div>
                  <div style={styles.resumoItem}>
                    <strong>CPF:</strong> {formData.cpf}
                  </div>
                  <div style={styles.resumoItem}>
                    <strong>Email:</strong> {formData.email}
                  </div>
                  <div style={styles.resumoItem}>
                    <strong>Telefone:</strong> {formData.telefone}
                  </div>
                  <div style={styles.resumoItem}>
                    <strong>Validacao:</strong>  Aprovada ({dadosValidados?.score || 95}%)
                  </div>
                </div>

                <div style={styles.termos}>
                  <label style={styles.checkboxLabel}>
                    <input type="checkbox" required />
                    Aceito os <a href="/termos" style={styles.link}>Termos de Uso</a> e a{" "}
                    <a href="/privacidade" style={styles.link}>Politica de Privacidade</a>
                  </label>
                </div>
              </div>
            )}

            {/* Erro */}
            {erro && <div style={styles.erro}> {erro}</div>}

            {/* Botoes */}
            <div style={styles.buttonGroup}>
              {etapa > 2 && (
                <button
                  type="button"
                  onClick={etapaAnterior}
                  style={styles.buttonSecondary}
                  disabled={loading}
                >
                  &#8592; Voltar
                </button>
              )}

              <button
                type="button"
                onClick={proximaEtapa}
                style={{
                  ...styles.buttonPrimary,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
                disabled={loading}
              >
                {loading ? "Enviando..." : etapa === 3 ? " Finalizar Cadastro" : "Proximo &#8592;’"}
              </button>
            </div>

            {/* Link Login */}
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Ja tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/consultor/login")}
                  style={styles.linkButton}
                >
                  Faca login aqui
                </button>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    maxWidth: "700px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  header: {
    padding: "32px",
    textAlign: "center",
    borderBottom: "2px solid #f0f0f0",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#17a2b8",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "16px",
  },
  validatedBadge: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "20px",
    border: "2px solid #c3e6cb",
  },
  progressBar: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  progressStep: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    transition: "background-color 0.3s",
  },
  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    marginTop: "8px",
    maxWidth: "300px",
    margin: "0 auto",
  },
  label: {
    color: "#999",
  },
  labelActive: {
    color: "#17a2b8",
    fontWeight: "600",
  },
  form: {
    padding: "32px",
  },
  etapa: {
    marginBottom: "24px",
  },
  etapaTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "24px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  autoFilled: {
    display: "block",
    marginTop: "4px",
    fontSize: "0.8rem",
    color: "#28a745",
    fontWeight: "600",
  },
  resumo: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  resumoTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#333",
  },
  resumoItem: {
    padding: "6px 0",
    fontSize: "0.95rem",
    color: "#666",
  },
  termos: {
    marginTop: "20px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    fontSize: "0.9rem",
    color: "#666",
  },
  link: {
    color: "#17a2b8",
    textDecoration: "none",
    fontWeight: "600",
  },
  erro: {
    padding: "12px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    fontSize: "0.9rem",
    marginBottom: "16px",
    border: "1px solid #ef9a9a",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  buttonPrimary: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonSecondary: {
    padding: "14px 24px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  footer: {
    marginTop: "24px",
    padding: "20px",
    borderTop: "1px solid #e0e0e0",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.9rem",
    color: "#666",
    margin: 0,
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#17a2b8",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
  },
};

export default RegisterPage;
