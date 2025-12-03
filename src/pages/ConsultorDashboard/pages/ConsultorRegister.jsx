// app-frontend/src/pages/ConsultorDashboard/pages/ConsultorRegister.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// VALIDAÇÃO DE CPF
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

const ConsultorRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  // STRIPE
  const [stripeAccountCreated, setStripeAccountCreated] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [consultorId, setConsultorId] = useState(null);
  const [onboardingUrl, setOnboardingUrl] = useState(null);

  // BUSCA CEP
  const fetchAddressByCep = async (cep) => {
    const cleanedCep = cep.replace(/\D/g, "");
    if (cleanedCep.length !== 8) return;
    setCepLoading(true);
    setError("");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
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
      setError("Erro ao buscar CEP.");
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

  const handleSendCode = (type) => {
    if (type === "phone" && formData.phone) {
      alert(`Código (123456) enviado para: ${formData.phone}`);
    } else if (type === "email" && formData.email) {
      alert(`Código (123456) enviado para: ${formData.email}`);
    } else {
      setError(`Preencha o ${type === "phone" ? "telefone" : "e-mail"} primeiro.`);
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode === "123456") {
      if (!isPhoneVerified) {
        setIsPhoneVerified(true);
        alert("Celular verificado!");
      } else if (!isEmailVerified) {
        setIsEmailVerified(true);
        alert("E-mail verificado!");
      }
      setVerificationCode("");
      setError("");
    } else {
      setError("Código incorreto.");
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!termsAccepted) {
        setError("Aceite os Termos e Condições para continuar.");
        return;
      }
    }

    if (step === 2) {
      if (
        !formData.name ||
        !formData.cpf ||
        !formData.rg ||
        !formData.password ||
        !formData.profilePhoto ||
        !formData.selfie ||
        !formData.cep ||
        !formData.address ||
        !formData.number ||
        !formData.city ||
        !formData.state
      ) {
        setError("Preencha todos os campos obrigatórios (*).");
        return;
      }
      if (!validateCPF(formData.cpf)) {
        setError("CPF inválido.");
        return;
      }
      if (!isPhoneVerified || !isEmailVerified) {
        setError("Verifique celular e e-mail antes de continuar.");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  // CRIAR CONTA STRIPE
  const createStripeAccount = async () => {
    setLoadingStripe(true);
    setError("");

    try {
      const consultorData = {
        name: formData.name,
        cpf: formData.cpf,
        email: formData.email,
        phone: formData.phone,
        rg: formData.rg,
        cep: formData.cep,
        address: formData.address,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        curriculum: formData.curriculum,
        bank_name: formData.bank_name,
        bank_agency: formData.bank_agency,
        bank_account: formData.bank_account,
      };

      const saveResponse = await fetch('http://localhost:5000/api/consultores/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultorData),
      });

      const saveData = await saveResponse.json();

      if (!saveData.success) {
        throw new Error(saveData.error || 'Erro ao salvar consultor');
      }

      const newConsultorId = saveData.consultorId;
      setConsultorId(newConsultorId);

      const stripeResponse = await fetch('http://localhost:5000/api/stripe-connect/approve-consultor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultorId: newConsultorId }),
      });

      const stripeData = await stripeResponse.json();

      if (stripeData.success) {
        setStripeAccountCreated(true);
        setOnboardingUrl(stripeData.onboardingUrl);
        window.open(stripeData.onboardingUrl, '_blank');
        alert('Conta Stripe criada! Complete o cadastro na nova aba.');
      } else {
        setError(stripeData.error || 'Erro ao criar conta Stripe');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao criar conta Stripe: ' + error.message);
    } finally {
      setLoadingStripe(false);
    }
  };

  const skipStripe = async () => {
    alert('Você pode configurar o Stripe depois no seu perfil.');
    await handleFinalSubmit();
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    alert("Cadastro enviado para análise! Você será notificado por e-mail.");
    navigate("/");
  };

  // PASSO 1: TERMOS
  const renderStep1 = () => (
    <form onSubmit={handleNext} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 1: Termos e Condições</h3>
      <p style={styles.note}>Leia e aceite os Termos e Condições para continuar.</p>
      <div style={styles.termsGroupLarge}>
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={handleChange}
          style={styles.checkbox}
        />
        <label htmlFor="terms">
          Eu li e aceito os{" "}
          <button type="button" onClick={() => navigate("/terms")} style={styles.termsButton}>
            Termos e Condições
          </button>
          .*
        </label>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <button type="submit" style={styles.button}>Próximo (Dados Pessoais)</button>
    </form>
  );

  // PASSO 2: DADOS PESSOAIS
  const renderStep2 = () => (
    <form onSubmit={handleNext} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 2: Dados Pessoais</h3>

      <div style={styles.photoSection}>
        <label style={styles.photoLabel}>
          Foto de Perfil*:
          <div style={styles.photoContainer}>
            <label htmlFor="profilePhotoInput" style={styles.photoPreview}>
              {profilePhotoPreview ? (
                <img src={profilePhotoPreview} alt="Preview" style={styles.profilePhoto} />
              ) : (
                <div style={styles.photoPlaceholder}>
                  <span>+</span>
                  <p>Adicionar Foto</p>
                </div>
              )}
            </label>
            <input
              id="profilePhotoInput"
              name="profilePhoto"
              type="file"
              required
              onChange={handleChange}
              style={styles.photoInput}
              accept="image/*"
            />
          </div>
        </label>
        <p style={styles.photoNote}>Esta foto aparecerá no seu perfil. Use uma foto profissional.</p>
      </div>

      <input name="name" type="text" placeholder="Nome Completo*" required onChange={handleChange} style={styles.input} />
      <input name="cpf" type="text" placeholder="CPF*" required onChange={handleChange} style={styles.input} />
      <input name="rg" type="text" placeholder="RG*" required onChange={handleChange} style={styles.input} />

      <div style={styles.verificationGroup}>
        <input
          name="phone"
          type="tel"
          placeholder="Telefone*"
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

      <input name="password" type="password" placeholder="Senha*" required onChange={handleChange} style={styles.input} />

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

      <input name="complement" type="text" placeholder="Complemento" onChange={handleChange} style={styles.input} value={formData.complement || ""} />
      <input name="neighborhood" type="text" placeholder="Bairro" onChange={handleChange} style={styles.input} value={formData.neighborhood || ""} />

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
          placeholder="UF*"
          required
          onChange={handleChange}
          style={styles.inputState}
          value={formData.state || ""}
          maxLength={2}
        />
      </div>

      {(!isPhoneVerified || !isEmailVerified) && (
        <div style={styles.verificationGroup}>
          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ ...styles.input, flexGrow: 1, margin: "8px 5px 8px 0" }}
            maxLength={6}
          />
          <button type="button" onClick={handleVerifyCode} style={styles.actionButton}>
            Verificar
          </button>
        </div>
      )}

      <label style={styles.fileLabel}>
        Selfie com Documento*:
        <input name="selfie" type="file" required onChange={handleChange} style={styles.fileInput} />
        <p style={styles.note}>Foto segurando RG/CNH para verificação.</p>
      </label>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.buttonGroup}>
        <button type="button" onClick={handleBack} style={styles.backButton}>Voltar</button>
        <button type="submit" style={styles.button}>Próximo (Currículo)</button>
      </div>
    </form>
  );

  // PASSO 3: CURRÍCULO
  const renderStep3 = () => (
    <form onSubmit={handleNext} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 3: Currículo</h3>
      <textarea
        name="curriculum"
        placeholder="Cole seu currículo aqui..."
        rows="8"
        required
        onChange={handleChange}
        style={styles.textarea}
      />
      <p style={styles.note}>A IA analisará suas áreas de atuação.</p>
      <div style={styles.buttonGroup}>
        <button type="button" onClick={handleBack} style={styles.backButton}>Voltar</button>
        <button type="submit" style={styles.button}>Próximo (Dados Bancários)</button>
      </div>
    </form>
  );

  // PASSO 4: DADOS BANCÁRIOS
  const renderStep4 = () => (
    <form onSubmit={handleNext} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 4: Dados Bancários</h3>
      <input name="bank_name" type="text" placeholder="Nome do Banco" required onChange={handleChange} style={styles.input} />
      <input name="bank_agency" type="text" placeholder="Agência" required onChange={handleChange} style={styles.input} />
      <input name="bank_account" type="text" placeholder="Conta e Dígito" required onChange={handleChange} style={styles.input} />
      <p style={styles.note}>Você pode alterar esses dados depois no perfil.</p>
      <div style={styles.buttonGroup}>
        <button type="button" onClick={handleBack} style={styles.backButton}>Voltar</button>
        <button type="submit" style={styles.button}>Próximo (Configuração Stripe)</button>
      </div>
    </form>
  );

  // PASSO 5: STRIPE
  const renderStep5 = () => (
    <form onSubmit={handleFinalSubmit} style={styles.form}>
      <h3 style={styles.stepTitle}>Passo 5: Configuração de Recebimentos</h3>

      <div style={styles.stripeSection}>
        <div style={styles.stripeIcon}>💳</div>
        <h4 style={styles.stripeTitle}>Conta para Receber Comissões</h4>
        <p style={styles.note}>
          Para receber suas comissões automaticamente, crie uma conta no Stripe. É rápido, seguro e gratuito!
        </p>

        <div style={styles.stripeFeatures}>
          <div style={styles.feature}><span>✅</span> Recebimento automático de comissões</div>
          <div style={styles.feature}><span>✅</span> Transferências em 2-3 dias úteis</div>
          <div style={styles.feature}><span>✅</span> Acompanhamento em tempo real</div>
          <div style={styles.feature}><span>✅</span> Totalmente seguro e criptografado</div>
        </div>

        {!stripeAccountCreated ? (
          <>
            <button type="button" onClick={createStripeAccount} style={styles.stripeButton} disabled={loadingStripe}>
              {loadingStripe ? "Criando conta..." : "🔐 Criar Conta Stripe"}
            </button>
            <p style={styles.skipNote}>Você pode pular e configurar depois no perfil.</p>
          </>
        ) : (
          <div style={styles.stripeSuccess}>
            <span style={styles.successIcon}>✅</span>
            <h4>Conta Stripe criada com sucesso!</h4>
            <p style={styles.note}>Complete o cadastro na aba que foi aberta.</p>
            {onboardingUrl && (
              <button type="button" onClick={() => window.open(onboardingUrl, '_blank')} style={styles.reopenButton}>
                Reabrir Link de Cadastro
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.buttonGroup}>
        <button type="button" onClick={handleBack} style={styles.backButton}>Voltar</button>
        {stripeAccountCreated && (
          <button type="submit" style={styles.finalButton}>Finalizar Cadastro</button>
        )}
        <button type="button" onClick={skipStripe} style={styles.skipButton}>Pular (Configurar Depois)</button>
      </div>
    </form>
  );

  const renderContent = () => {
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    if (step === 3) return renderStep3();
    if (step === 4) return renderStep4();
    if (step === 5) return renderStep5();
    return <div>Cadastro concluído!</div>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.headerTitle}>Cadastro de Novo Consultor</h2>
        <div style={styles.stepIndicator}>
          <span style={step === 1 ? styles.activeStep : styles.inactiveStep}>1. Termos</span>
          <span style={step === 2 ? styles.activeStep : styles.inactiveStep}>2. Dados</span>
          <span style={step === 3 ? styles.activeStep : styles.inactiveStep}>3. Currículo</span>
          <span style={step === 4 ? styles.activeStep : styles.inactiveStep}>4. Bancário</span>
          <span style={step === 5 ? styles.activeStep : styles.inactiveStep}>5. Stripe</span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

const styles = {
  themeColor: "#1b3670",
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
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
  fileLabel: { display: "block", marginTop: "10px", marginBottom: "15px", color: "#555" },
  fileInput: { display: "block", marginTop: "5px" },
  photoSection: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
  },
  photoLabel: { display: "block", color: "#555", fontWeight: "bold", marginBottom: "10px" },
  photoContainer: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  photoPreview: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #364fab",
    cursor: "pointer",
    display: "block",
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
  },
  photoInput: { display: "none" },
  photoNote: { fontSize: "12px", color: "#6c757d", textAlign: "center", marginTop: "5px" },
  button: {
    padding: "12px",
    backgroundColor: "#1b3670",
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
  skipButton: {
    padding: "12px",
    backgroundColor: "#ffc107",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
  buttonGroup: { display: "flex", justifyContent: "flex-end" },
  verificationGroup: { display: "flex", alignItems: "center", marginBottom: "5px" },
  verifyButtonAction: {
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
    height: "45px",
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
  stepTitle: { color: "#343a40", borderBottom: "1px solid #ccc", paddingBottom: "10px" },
  activeStep: { color: "#364fab", fontWeight: "bold" },
  inactiveStep: { color: "#aaa" },
  note: { fontSize: "14px", color: "#555", marginTop: "15px" },
  error: { color: "#dc3545", fontWeight: "bold", marginTop: "10px" },
  stripeSection: {
    padding: "25px",
    border: "2px solid #e9ecef",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
  },
  stripeIcon: { fontSize: "60px", marginBottom: "15px" },
  stripeTitle: { color: "#364fab", marginBottom: "10px" },
  stripeFeatures: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    margin: "20px 0",
    textAlign: "left",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "8px",
    fontSize: "14px",
  },
  stripeButton: {
    padding: "15px 30px",
    backgroundColor: "#6772e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
    width: "100%",
  },
  skipNote: { fontSize: "12px", color: "#666", marginTop: "10px", fontStyle: "italic" },
  stripeSuccess: {
    padding: "20px",
    backgroundColor: "#d4edda",
    borderRadius: "8px",
    border: "1px solid #c3e6cb",
  },
  successIcon: { fontSize: "50px", display: "block", marginBottom: "10px" },
  reopenButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
    fontSize: "14px",
  },
};

export default ConsultorRegister;