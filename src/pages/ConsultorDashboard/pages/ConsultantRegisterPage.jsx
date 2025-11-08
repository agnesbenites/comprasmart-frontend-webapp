// web-consultor/src/pages/ConsultantRegisterPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// === FUNÇÃO DE VALIDAÇÃO DE CPF (MANTIDA) ===
const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

const ConsultantRegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  // Estados de verificação de contato e CEP
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estado para preview da foto de perfil
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  // --- LÓGICA DE BUSCA DE CEP (INALTERADA) ---
  const fetchAddressByCep = async (cep) => {
    const cleanedCep = cep.replace(/\D/g, "");
    if (cleanedCep.length !== 8) return;
    setCepLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );
      const data = await response.json();
      setCepLoading(false);
      if (data.erro) {
        setError("CEP não encontrado. Digite o endereço manualmente.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        address: data.logradouro || "",
        city: data.localidade || "",
        state: data.uf || "",
        neighborhood: data.bairro || "",
      }));
    } catch (err) {
      setCepLoading(false);
      setError(
        "Erro ao buscar CEP. Verifique a conexão ou digite o endereço completo."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (name === "cep") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value.replace(/\D/g, "").length === 8) {
        fetchAddressByCep(value);
      }
    } else if (type === "checkbox") {
      setTermsAccepted(checked);
    } else if (type === "file") {
      if (name === "profilePhoto" && files && files[0]) {
        // Criar preview da foto de perfil
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfilePhotoPreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
        setFormData({ ...formData, [name]: files[0] });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  // --- LÓGICA DE VERIFICAÇÃO DE SMS/Email (Simulada - INALTERADA) ---
  const handleSendCode = (type) => {
    if (type === "phone" && formData.phone) {
      alert(
        `Código de SMS (123456) enviado para: ${formData.phone}. Insira o código abaixo.`
      );
    } else if (type === "email" && formData.email) {
      alert(
        `Código de verificação (123456) enviado para: ${formData.email}. Insira o código abaixo.`
      );
    } else {
      setError(
        `Preencha o campo de ${
          type === "phone" ? "telefone" : "e-mail"
        } para enviar o código.`
      );
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode === "123456") {
      if (!isPhoneVerified) {
        setIsPhoneVerified(true);
        alert("Celular verificado com sucesso!");
      } else if (!isEmailVerified) {
        setIsEmailVerified(true);
        alert("E-mail verificado com sucesso!");
      }
      setVerificationCode("");
      setError("");
    } else {
      setError("Código de verificação incorreto. Tente novamente.");
    }
  };

  // --- LÓGICA DE AVANÇO DE PASSO ---
  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!termsAccepted) {
        setError(
          "Você deve aceitar os Termos e Condições de Uso para prosseguir."
        );
        return;
      }
    }

    if (step === 2) {
      // VALIDAÇÃO ATUALIZADA PARA INCLUIR FOTO DE PERFIL
      if (
        !formData.name ||
        !formData.cpf ||
        !formData.rg ||
        !formData.password ||
        !formData.profilePhoto ||
        !formData.selfie || // Foto de perfil agora é obrigatória
        !formData.cep ||
        !formData.address ||
        !formData.number ||
        !formData.city ||
        !formData.state
      ) {
        setError("Por favor, preencha todos os campos obrigatórios (*).");
        return;
      }
      if (!validateCPF(formData.cpf)) {
        setError(
          "O CPF inserido não é válido. Verifique o número e tente novamente."
        );
        return;
      }
      if (!isPhoneVerified || !isEmailVerified) {
        setError(
          "Por favor, verifique seu celular e e-mail antes de continuar."
        );
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    alert(
      "Cadastro enviado para análise de Identidade/IA Curricular. Você será notificado por e-mail."
    );
    navigate("/");
  };

  // --- RENDERIZAÇÃO DOS PASSOS ---

  // PASSO 1: ACEITE DE TERMOS (INALTERADO)
  const renderStep1 = () => (
    <form onSubmit={handleNext} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 1: Termos e Condições de Uso</h3>

      <p style={styles.note}>
        Para iniciar seu cadastro, você deve ler e aceitar nossos Termos e
        Condições, que incluem regras de confidencialidade, LGPD e o vínculo de
        segurança da plataforma.
      </p>

      <div style={styles.termsGroupLarge}>
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={termsAccepted}
          onChange={handleChange}
          style={styles.checkbox}
        />
        <label htmlFor="terms">
          Eu li e aceito os{" "}
          <button
            type="button"
            onClick={() => navigate("/terms")}
            style={styles.termsButton}
          >
            Termos e Condições de Uso
          </button>
          .*
        </label>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button
        type="submit"
        style={{ ...styles.button, backgroundColor: styles.themeColor }}
      >
        Próximo (Dados Pessoais)
      </button>
    </form>
  );

  // PASSO 2: DADOS PESSOAIS E SEGURANÇA (ATUALIZADO COM FOTO DE PERFIL)
  const renderStep2 = () => (
    <form onSubmit={handleNext} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 2: Dados Pessoais e Segurança</h3>

      {/* NOVO: CAMPO DE FOTO DE PERFIL OBRIGATÓRIA */}
      <div style={styles.photoSection}>
        <label style={styles.photoLabel}>
          Foto de Perfil*:
          <div style={styles.photoContainer}>
            <div style={styles.photoPreview}>
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Preview da foto de perfil"
                  style={styles.profilePhoto}
                />
              ) : (
                <div style={styles.photoPlaceholder}>
                  <span>+</span>
                  <p>Adicionar Foto</p>
                </div>
              )}
            </div>
            <input
              name="profilePhoto"
              type="file"
              required
              onChange={handleChange}
              style={styles.photoInput}
              accept="image/*"
            />
          </div>
        </label>
        <p style={styles.photoNote}>
          *Esta foto aparecerá no seu perfil para os clientes. Use uma foto
          profissional e de boa qualidade.
        </p>
      </div>

      {/* Campos de Dados Pessoais */}
      <input
        name="name"
        type="text"
        placeholder="Nome Completo*"
        required
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="cpf"
        type="text"
        placeholder="CPF*"
        required
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="rg"
        type="text"
        placeholder="RG*"
        required
        onChange={handleChange}
        style={styles.input}
      />

      {/* Campos de Verificação de Contato */}
      <div style={styles.verificationGroup}>
        <input
          name="phone"
          type="tel"
          placeholder="Telefone (WhatsApp)*"
          required
          onChange={handleChange}
          style={{ ...styles.input, flexGrow: 1, margin: "8px 5px 8px 0" }}
          disabled={isPhoneVerified}
        />
        <button
          type="button"
          onClick={() => handleSendCode("phone")}
          style={{
            ...styles.verifyButtonAction,
            backgroundColor: isPhoneVerified ? "#28a745" : styles.themeColor,
          }}
          disabled={isPhoneVerified}
        >
          {isPhoneVerified ? "Verificado" : "Enviar SMS"}
        </button>
      </div>

      <div style={styles.verificationGroup}>
        <input
          name="email"
          type="email"
          placeholder="Email*"
          required
          onChange={handleChange}
          style={{ ...styles.input, flexGrow: 1, margin: "8px 5px 8px 0" }}
          disabled={isEmailVerified}
        />
        <button
          type="button"
          onClick={() => handleSendCode("email")}
          style={{
            ...styles.verifyButtonAction,
            backgroundColor: isEmailVerified ? "#28a745" : styles.themeColor,
          }}
          disabled={isEmailVerified}
        >
          {isEmailVerified ? "Verificado" : "Enviar Código"}
        </button>
      </div>

      <input
        name="password"
        type="password"
        placeholder="Senha*"
        required
        onChange={handleChange}
        style={styles.input}
      />

      {/* CAMPOS DE ENDEREÇO */}
      <div style={styles.cepGroup}>
        <input
          name="cep"
          type="text"
          placeholder="CEP*"
          required
          onChange={handleChange}
          style={styles.inputCep}
          value={formData.cep || ""}
          maxLength={9}
        />
        {cepLoading && <span style={styles.loadingText}>Buscando...</span>}
      </div>

      <div style={styles.addressGroup}>
        <input
          name="address"
          type="text"
          placeholder="Rua*"
          required
          onChange={handleChange}
          style={{ ...styles.input, flexGrow: 3, marginRight: "10px" }}
          value={formData.address || ""}
          disabled={formData.cep}
        />
        <input
          name="number"
          type="text"
          placeholder="Número*"
          required
          onChange={handleChange}
          style={{ ...styles.input, flexGrow: 1 }}
          value={formData.number || ""}
        />
      </div>

      <input
        name="complement"
        type="text"
        placeholder="Complemento (Opcional)"
        onChange={handleChange}
        style={styles.input}
        value={formData.complement || ""}
      />
      <input
        name="neighborhood"
        type="text"
        placeholder="Bairro (opcional)"
        onChange={handleChange}
        style={styles.input}
        value={formData.neighborhood || ""}
      />

      <div style={styles.cityStateGroup}>
        <input
          name="city"
          type="text"
          placeholder="Cidade*"
          required
          onChange={handleChange}
          style={{ ...styles.input, flexGrow: 1, marginRight: "10px" }}
          value={formData.city || ""}
        />
        <input
          name="state"
          type="text"
          placeholder="Estado (UF)*"
          required
          onChange={handleChange}
          style={styles.inputState}
          value={formData.state || ""}
          maxLength={2}
        />
      </div>

      {/* Campo de Código de Verificação */}
      {(!isPhoneVerified || !isEmailVerified) && (
        <div style={styles.verificationGroup}>
          <input
            type="text"
            placeholder="Código de 6 dígitos (SMS ou Email)"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ ...styles.input, flexGrow: 1, margin: "8px 5px 8px 0" }}
            maxLength={6}
          />
          <button
            type="button"
            onClick={handleVerifyCode}
            style={styles.actionButton}
          >
            Verificar
          </button>
        </div>
      )}

      {/* Campo de Selfie */}
      <label style={styles.fileLabel}>
        Selfie com Documento (IA Scan)*:
        <input
          name="selfie"
          type="file"
          required
          onChange={handleChange}
          style={styles.fileInput}
        />
        <p style={styles.note}>
          *A imagem é obrigatória para verificação de identidade (Selfie
          segurando o RG/CNH).
        </p>
      </label>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.buttonGroup}>
        <button type="button" onClick={handleBack} style={styles.backButton}>
          Voltar
        </button>
        <button
          type="submit"
          style={{ ...styles.button, backgroundColor: styles.themeColor }}
        >
          Próximo (Currículo)
        </button>
      </div>
    </form>
  );

  // PASSO 3: CURRÍCULO (INALTERADO)
  const renderStep3 = () => (
    <form onSubmit={handleNext} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 3: Currículo</h3>

      <textarea
        name="curriculum"
        placeholder="Cole seu Currículo Detalhado aqui. (A IA irá extrair sua área de atuação)"
        rows="8"
        required
        onChange={handleChange}
        style={styles.textarea}
      />

      <p style={styles.note}>
        *A IA fará a análise para identificar suas **áreas de
        atuação/segmentos** e definir as lojas mais compatíveis para você.
      </p>

      <div style={styles.buttonGroup}>
        <button type="button" onClick={handleBack} style={styles.backButton}>
          Voltar
        </button>
        <button
          type="submit"
          style={{ ...styles.button, backgroundColor: styles.themeColor }}
        >
          Próximo (Dados Bancários)
        </button>
      </div>
    </form>
  );

  // PASSO 4: DADOS BANCÁRIOS (INALTERADO)
  const renderStep4 = () => (
    <form onSubmit={handleFinalSubmit} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 4: Dados Bancários</h3>

      <input
        name="bank_name"
        type="text"
        placeholder="Nome do Banco"
        required
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="bank_agency"
        type="text"
        placeholder="Agência"
        required
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="bank_account"
        type="text"
        placeholder="Número da Conta e Dígito"
        required
        onChange={handleChange}
        style={styles.input}
      />

      <p style={styles.note}>
        *Você poderá alterar esses dados a qualquer momento no seu Perfil,
        mediante inserção da sua senha.
      </p>

      <div style={styles.buttonGroup}>
        <button type="button" onClick={handleBack} style={styles.backButton}>
          Voltar
        </button>
        <button type="submit" style={styles.finalButton}>
          Finalizar Cadastro e Enviar para Análise
        </button>
      </div>
    </form>
  );

  const renderContent = () => {
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    if (step === 3) return renderStep3();
    if (step === 4) return renderStep4();
    return <div>Cadastro concluído!</div>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.headerTitle}>Cadastro de Novo Consultor</h2>
        <div style={styles.stepIndicator}>
          <span style={step === 1 ? styles.activeStep : styles.inactiveStep}>
            1. Termos
          </span>
          <span style={step === 2 ? styles.activeStep : styles.inactiveStep}>
            2. Dados Pessoais
          </span>
          <span style={step === 3 ? styles.activeStep : styles.inactiveStep}>
            3. Currículo
          </span>
          <span style={step === 4 ? styles.activeStep : styles.inactiveStep}>
            4. Bancário
          </span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

// --- ESTILOS ATUALIZADOS ---
const styles = {
  themeColor: "#1b3670",

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
  },
  headerTitle: { textAlign: "center", marginBottom: "20px", color: "#364fab" },
  form: { display: "flex", flexDirection: "column" },
  input: {
    padding: "12px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
  },
  fileLabel: {
    display: "block",
    marginTop: "10px",
    marginBottom: "15px",
    color: "#555",
  },
  fileInput: { display: "block", marginTop: "5px" },

  // NOVOS ESTILOS PARA FOTO DE PERFIL
  photoSection: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
  },
  photoLabel: {
    display: "block",
    color: "#555",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  photoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  photoPreview: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #364fab",
    cursor: "pointer",
  },
  profilePhoto: { width: "100%", height: "100%", objectFit: "cover" },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    fontSize: "14px",
    textAlign: "center",
  },
  photoInput: { display: "none" },
  photoNote: {
    fontSize: "12px",
    color: "#6c757d",
    textAlign: "center",
    marginTop: "5px",
  },

  // BOTÕES PRINCIPAIS
  button: {
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  finalButton: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  backButton: {
    padding: "12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    marginRight: "10px",
  },
  buttonGroup: { display: "flex", justifyContent: "flex-end" },

  // ESTILOS DE VERIFICAÇÃO E ENDEREÇO
  verificationGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  verifyButtonAction: {
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
    height: "45px",
    backgroundColor: "#1b3670",
    transition: "background-color 0.2s",
  },
  actionButton: {
    padding: "10px 15px",
    backgroundColor: "#ffc107",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
    height: "45px",
    fontWeight: "bold",
  },
  cepGroup: { display: "flex", alignItems: "center", margin: "8px 0" },
  inputCep: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "150px",
    marginRight: "10px",
  },
  loadingText: { color: "#ffc107", fontWeight: "bold" },
  addressGroup: { display: "flex" },
  cityStateGroup: { display: "flex", marginBottom: "8px" },
  inputState: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "80px",
    textAlign: "center",
  },

  // ESTILOS DE TERMOS
  termsGroupLarge: {
    display: "flex",
    alignItems: "center",
    marginTop: "25px",
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  checkbox: { marginRight: "10px", width: "20px", height: "20px" },
  termsButton: {
    background: "none",
    border: "none",
    color: "#364fab",
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
    fontSize: "16px",
    marginLeft: "5px",
    fontWeight: "bold",
  },

  stepIndicator: {
    display: "flex",
    justifyContent: "space-around",
    margin: "10px 0 30px 0",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  stepTitle: {
    color: "#343a40",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
  },
  activeStep: { color: "#364fab", fontWeight: "bold" },
  inactiveStep: { color: "#aaa" },
  note: { fontSize: "14px", color: "#555", marginTop: "15px" },
  error: { color: "#dc3545", fontWeight: "bold", marginTop: "10px" },
};

export default ConsultantRegisterPage;
