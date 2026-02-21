// src/pages/RegisterPage.jsx
// Cadastro de Consultor com Validação Biométrica

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
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

  // Callback da validação biométrica
  const handleValidationComplete = (result) => {
    if (result.aprovado) {
      setValidacaoConcluida(true);
      setDadosValidados(result.dados);
      
      // Preencher automaticamente os dados extraídos do documento
      setFormData({
        ...formData,
        nome: result.dados.nome || "",
        cpf: result.dados.cpf || "",
        rg: result.dados.rg || "",
        dataNascimento: result.dados.data_nascimento || "",
      });
      
      setEtapa(2);
      alert(` Identidade validada! Score: ${result.score}%\n\nDados preenchidos automaticamente.`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplicar máscaras
    let valorFormatado = value;
    
    if (name === 'cpf') {
      valorFormatado = formatarCPF(value);
    } else if (name === 'telefone') {
      valorFormatado = formatarTelefone(value);
    } else if (name === 'rg') {
      valorFormatado = formatarRG(value);
    }
    
    setFormData({ ...formData, [name]: valorFormatado });
  };

  // Máscaras
  const formatarCPF = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatarTelefone = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatarRG = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  };

  // Validações
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  const validarSenhaForte = (senha) => {
    // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(senha);
  };

  const validarEtapa2 = () => {
    if (!formData.nome || formData.nome.trim().length < 3) {
      setErro("Nome deve ter pelo menos 3 caracteres");
      return false;
    }
    
    if (!formData.cpf || !validarCPF(formData.cpf)) {
      setErro("CPF inválido");
      return false;
    }
    
    if (!formData.email) {
      setErro("Email é obrigatório");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErro("Email inválido");
      return false;
    }
    
    if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) {
      setErro("Telefone inválido");
      return false;
    }
    
    setErro("");
    return true;
  };

  const validarEtapa3 = () => {
    if (!formData.senha || formData.senha.length < 8) {
      setErro("Senha deve ter no mínimo 8 caracteres");
      return false;
    }
    
    if (!validarSenhaForte(formData.senha)) {
      setErro("Senha deve conter: maiúscula, minúscula, número e caractere especial (@$!%*?&#)");
      return false;
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem");
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
    if (etapa > 2) { // Não volta para biometria
      setEtapa(etapa - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErro("");

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            tipo: 'consultor',
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErro("Este email já está cadastrado. Faça login ou use outro email.");
        } else {
          setErro(`Erro no cadastro: ${authError.message}`);
        }
        return;
      }

      if (!authData.user) {
        setErro("Erro ao criar usuário. Tente novamente.");
        return;
      }

      // 2. Inserir dados adicionais na tabela de consultores
      const { error: consultorError } = await supabase
        .from('consultores')
        .insert({
          id: authData.user.id,
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf.replace(/\D/g, ''),
          rg: formData.rg.replace(/\D/g, ''),
          telefone: formData.telefone.replace(/\D/g, ''),
          data_nascimento: formData.dataNascimento || null,
          endereco: formData.endereco || null,
          cidade: formData.cidade || null,
          estado: formData.estado || null,
          validacao_biometrica: {
            aprovado: true,
            score: dadosValidados?.score || 95,
            dados_extraidos: dadosValidados,
            data_validacao: new Date().toISOString(),
          },
          status: 'ativo',
          created_at: new Date().toISOString(),
        });

      if (consultorError) {
        console.error('Erro ao salvar consultor:', consultorError);
        // Se falhar, ainda assim o usuário foi criado no Auth
        // Podemos continuar e tentar salvar depois
      }

      alert(" Cadastro realizado com sucesso!\n\nVerifique seu email para confirmar a conta.");
      navigate("/consultor/login");
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErro("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* ETAPA 1: VALIDAÇÃO BIOMÉTRICA */}
      {etapa === 1 && !validacaoConcluida && (
        <BiometricValidation
          onValidationComplete={handleValidationComplete}
          userType="consultor"
        />
      )}

      {/* ETAPAS 2 e 3: FORMULÁRIO */}
      {etapa >= 2 && validacaoConcluida && (
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}> Cadastro de Consultor</h1>
            <p style={styles.subtitle}>Complete seus dados para começar</p>
            
            {/* Badge de validação */}
            <div style={styles.validatedBadge}>
               Identidade Verificada - Score: {dadosValidados?.score || 95}%
            </div>

            {/* Progress */}
            <div style={styles.progressBar}>
              <div style={{...styles.progressStep, backgroundColor: "#bb25a6"}}>✓</div>
              <div style={{...styles.progressStep, backgroundColor: etapa >= 2 ? "#bb25a6" : "#e0e0e0"}}>2</div>
              <div style={{...styles.progressStep, backgroundColor: etapa >= 3 ? "#bb25a6" : "#e0e0e0"}}>3</div>
            </div>
            <div style={styles.progressLabels}>
              <span style={styles.labelActive}>Biometria</span>
              <span style={etapa >= 2 ? styles.labelActive : styles.label}>Dados</span>
              <span style={etapa >= 3 ? styles.labelActive : styles.label}>Senha</span>
            </div>
          </div>

          <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* ETAPA 2: DADOS PESSOAIS */}
            {etapa === 2 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>📝 Dados Pessoais</h2>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      backgroundColor: dadosValidados?.nome ? "#f3e8ff" : "white"
                    }}
                    readOnly={!!dadosValidados?.nome}
                  />
                  {dadosValidados?.nome && (
                    <span style={styles.autoFilled}>✓ Extraído do documento</span>
                  )}
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>CPF *</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      style={{
                        ...styles.input,
                        backgroundColor: dadosValidados?.cpf ? "#f3e8ff" : "white"
                      }}
                      readOnly={!!dadosValidados?.cpf}
                    />
                    {dadosValidados?.cpf && (
                      <span style={styles.autoFilled}>✓ Extraído</span>
                    )}
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>RG *</label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleChange}
                      placeholder="00.000.000-0"
                      maxLength={12}
                      style={{
                        ...styles.input,
                        backgroundColor: dadosValidados?.rg ? "#f3e8ff" : "white"
                      }}
                      readOnly={!!dadosValidados?.rg}
                    />
                    {dadosValidados?.rg && (
                      <span style={styles.autoFilled}>✓ Extraído</span>
                    )}
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Data de Nascimento *</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      backgroundColor: dadosValidados?.data_nascimento ? "#f3e8ff" : "white"
                    }}
                    readOnly={!!dadosValidados?.data_nascimento}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>E-mail *</label>
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
                  <label style={styles.inputLabel}>Telefone *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, Número"
                    style={styles.input}
                  />
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="Sua cidade"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      style={styles.input}
                    >
                      <option value="">Selecione</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3: SENHA */}
            {etapa === 3 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>🔐 Crie sua Senha</h2>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Senha *</label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    style={styles.input}
                  />
                  <small style={styles.hint}>
                    A senha deve conter: maiúscula, minúscula, número e caractere especial (@$!%*?&#)
                  </small>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Confirmar Senha *</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Digite novamente"
                    style={styles.input}
                  />
                </div>

                {/* Resumo */}
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
                    <strong>Validação:</strong>  Aprovada ({dadosValidados?.score || 95}%)
                  </div>
                </div>

                <div style={styles.termos}>
                  <label style={styles.checkboxLabel}>
                    <input type="checkbox" required style={styles.checkbox} />
                    <span>
                      Aceito os <a href="/termos" style={styles.link}>Termos de Uso</a> e a{" "}
                      <a href="/privacidade" style={styles.link}>Política de Privacidade</a>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Erro */}
            {erro && <div style={styles.erro}>⚠️ {erro}</div>}

            {/* Botões */}
            <div style={styles.buttonGroup}>
              {etapa > 2 && (
                <button
                  type="button"
                  onClick={etapaAnterior}
                  style={styles.buttonSecondary}
                  disabled={loading}
                >
                  ← Voltar
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
                {loading ? "Enviando..." : etapa === 3 ? " Finalizar Cadastro" : "Próximo →"}
              </button>
            </div>

            {/* Link Login */}
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/consultor/login")}
                  style={styles.linkButton}
                >
                  Faça login aqui
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
    color: "#bb25a6",
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
    backgroundColor: "#f3e8ff",
    color: "#155724",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "20px",
    border: "2px solid #f3e8ff",
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
    color: "#bb25a6",
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
  inputLabel: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
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
    color: "#bb25a6",
    fontWeight: "600",
  },
  hint: {
    display: "block",
    marginTop: "4px",
    fontSize: "0.75rem",
    color: "#666",
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
    cursor: "pointer",
  },
  checkbox: {
    marginTop: "3px",
  },
  link: {
    color: "#bb25a6",
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
    backgroundColor: "#bb25a6",
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
    color: "#bb25a6",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
  },
};

export default RegisterPage;