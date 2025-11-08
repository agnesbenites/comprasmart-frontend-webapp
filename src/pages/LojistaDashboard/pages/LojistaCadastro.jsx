// src/pages/LojistaCadastro.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LojistaCadastro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    tipoPessoa: "pf",
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    cnpj: "",
    razaoSocial: "",

    // Documentos
    documento: null,

    // Endereço
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",

    // Plano
    planoSelecionado: location.state?.plan || "app-only",

    // Termos
    aceitaTermos: false,
  });

  const plans = [
    {
      id: "app-only",
      name: "PLANO APENAS APP",
      price: "R$ 97-197/mês",
      trial: "7 dias grátis",
      fidelidade: "6 meses",
      description: "Ideal para quem já tem sistema próprio",
      features: [
        "App para consultores",
        "Chat integrado",
        "Métricas básicas",
        "Suporte por email",
        "1 loja incluída",
      ],
      color: "#007bff",
    },
    {
      id: "complete-online",
      name: "PLANO COMPLETO ONLINE",
      price: "R$ 297-497/mês",
      trial: "15 dias grátis",
      fidelidade: "12 meses",
      description: "Solução completa em nuvem",
      features: [
        "Tudo do Plano App +",
        "ERP Odoo Online",
        "Gestão de estoque",
        "Vendas e financeiro",
        "Até 3 lojas",
        "Suporte prioritário",
        "Backup automático",
      ],
      color: "#28a745",
    },
    {
      id: "offline",
      name: "PLANO OFFLINE",
      price: "R$ 1.500-3.000 + mensalidade",
      trial: "30 dias grátis",
      fidelidade: "24 meses",
      description: "Máximo controle e flexibilidade",
      features: [
        "Tudo do Plano Completo +",
        "Instalação local",
        "Funciona sem internet",
        "Sincronização cloud",
        "Lojas ilimitadas",
        "Suporte dedicado",
        "Treinamento inclusivo",
      ],
      color: "#6f42c1",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cadastro enviado com sucesso! Em breve entraremos em contato.");
    navigate("/");
  };

  const selectedPlan = plans.find((p) => p.id === formData.planoSelecionado);

  // Renderização dos steps
  const renderStep1 = () => (
    <div style={styles.stepContainer}>
      <h2 style={styles.stepTitle}>📋 Dados da Empresa</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tipo de Pessoa *</label>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="tipoPessoa"
              value="pf"
              checked={formData.tipoPessoa === "pf"}
              onChange={handleInputChange}
              style={styles.radioInput}
            />
            Pessoa Física
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="tipoPessoa"
              value="pj"
              checked={formData.tipoPessoa === "pj"}
              onChange={handleInputChange}
              style={styles.radioInput}
            />
            Pessoa Jurídica
          </label>
        </div>
      </div>

      {formData.tipoPessoa === "pj" ? (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Razão Social *</label>
            <input
              type="text"
              name="razaoSocial"
              value={formData.razaoSocial}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNPJ *</label>
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="00.000.000/0000-00"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Cartão CNPJ ou Contrato Social *
              <span style={styles.fileInfo}>
                {" "}
                (PDF, JPG ou PNG - máximo 5MB)
              </span>
            </label>
            <input
              type="file"
              name="documento"
              onChange={handleInputChange}
              style={styles.fileInput}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>
        </>
      ) : (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF *</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="000.000.000-00"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Documento de Identificação *
              <span style={styles.fileInfo}>
                {" "}
                (RG, CNH ou Passaporte - PDF, JPG ou PNG)
              </span>
            </label>
            <input
              type="file"
              name="documento"
              onChange={handleInputChange}
              style={styles.fileInput}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>
        </>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Telefone *</label>
        <input
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="(11) 99999-9999"
          required
        />
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        style={styles.primaryButton}
      >
        Continuar para Endereço
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div style={styles.stepContainer}>
      <h2 style={styles.stepTitle}>🏠 Endereço da Empresa</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>CEP *</label>
        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="00000-000"
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Endereço *</label>
        <input
          type="text"
          name="endereco"
          value={formData.endereco}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formRow}>
        <div style={{ ...styles.formGroup, flex: 1 }}>
          <label style={styles.label}>Número *</label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>
        <div style={{ ...styles.formGroup, flex: 2 }}>
          <label style={styles.label}>Complemento</label>
          <input
            type="text"
            name="complemento"
            value={formData.complemento}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={{ ...styles.formGroup, flex: 2 }}>
          <label style={styles.label}>Cidade *</label>
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>
        <div style={{ ...styles.formGroup, flex: 1 }}>
          <label style={styles.label}>Estado *</label>
          <input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="SP"
            required
          />
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevStep}
          style={styles.secondaryButton}
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          style={styles.primaryButton}
        >
          Escolher Plano
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={styles.stepContainer}>
      <h2 style={styles.stepTitle}>💎 Escolha seu Plano</h2>

      <div style={styles.plansGrid}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              ...styles.planCard,
              borderColor:
                formData.planoSelecionado === plan.id ? plan.color : "#ddd",
              backgroundColor:
                formData.planoSelecionado === plan.id
                  ? `${plan.color}10`
                  : "white",
            }}
            onClick={() =>
              setFormData((prev) => ({ ...prev, planoSelecionado: plan.id }))
            }
          >
            <h3 style={{ ...styles.planName, color: plan.color }}>
              {plan.name}
            </h3>
            <div style={styles.planPrice}>{plan.price}</div>
            <div style={styles.trialBadge}>🎁 {plan.trial}</div>
            <div style={styles.fidelidadeBadge}>
              ⏱️ Fidelidade: {plan.fidelidade}
            </div>
            <p style={styles.planDescription}>{plan.description}</p>

            <ul style={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <li key={index} style={styles.featureItem}>
                  ✓ {feature}
                </li>
              ))}
            </ul>

            <div style={styles.radioContainer}>
              <input
                type="radio"
                name="planoSelecionado"
                value={plan.id}
                checked={formData.planoSelecionado === plan.id}
                onChange={handleInputChange}
                style={styles.radioInput}
              />
              <span style={styles.radioText}>Selecionar este plano</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevStep}
          style={styles.secondaryButton}
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          style={styles.primaryButton}
        >
          Finalizar Cadastro
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={styles.stepContainer}>
      <h2 style={styles.stepTitle}>✅ Confirmação Final</h2>

      <div style={styles.summaryCard}>
        <h3 style={styles.summaryTitle}>Resumo do Cadastro</h3>

        <div style={styles.summarySection}>
          <h4 style={styles.summarySubtitle}>Dados da Empresa</h4>
          <p>
            <strong>Nome:</strong>{" "}
            {formData.tipoPessoa === "pj"
              ? formData.razaoSocial
              : formData.nome}
          </p>
          <p>
            <strong>Documento:</strong>{" "}
            {formData.tipoPessoa === "pj" ? formData.cnpj : formData.cpf}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Telefone:</strong> {formData.telefone}
          </p>
        </div>

        <div style={styles.summarySection}>
          <h4 style={styles.summarySubtitle}>Endereço</h4>
          <p>
            {formData.endereco}, {formData.numero}{" "}
            {formData.complemento && `- ${formData.complemento}`}
          </p>
          <p>
            {formData.cidade} - {formData.estado}
          </p>
          <p>CEP: {formData.cep}</p>
        </div>

        <div style={styles.summarySection}>
          <h4 style={styles.summarySubtitle}>Plano Escolhido</h4>
          <div
            style={{ ...styles.selectedPlan, borderColor: selectedPlan.color }}
          >
            <strong style={{ color: selectedPlan.color }}>
              {selectedPlan.name}
            </strong>
            <p>
              {selectedPlan.price} • {selectedPlan.trial}
            </p>
            <p>
              <strong>Fidelidade:</strong> {selectedPlan.fidelidade}
            </p>
          </div>
        </div>

        <div style={styles.termsSection}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="aceitaTermos"
              checked={formData.aceitaTermos}
              onChange={handleInputChange}
              style={styles.checkboxInput}
              required
            />
            <span style={styles.checkboxText}>
              Concordo com os{" "}
              <a href="/terms" style={styles.link}>
                Termos de Uso
              </a>{" "}
              e confirmo que as informações fornecidas são verdadeiras. *
            </span>
          </label>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevStep}
          style={styles.secondaryButton}
        >
          Voltar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          style={{
            ...styles.primaryButton,
            opacity: formData.aceitaTermos ? 1 : 0.6,
            cursor: formData.aceitaTermos ? "pointer" : "not-allowed",
          }}
          disabled={!formData.aceitaTermos}
        >
          Finalizar Cadastro
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Cadastro de Lojista</h1>
        <div style={styles.progressBar}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              style={{
                ...styles.progressStep,
                backgroundColor:
                  currentStep >= step ? selectedPlan.color : "#e0e0e0",
              }}
            >
              {step}
            </div>
          ))}
        </div>
        <p style={styles.progressText}>
          Passo {currentStep} de 4 -{" "}
          {currentStep === 1
            ? "Dados da Empresa"
            : currentStep === 2
            ? "Endereço"
            : currentStep === 3
            ? "Plano"
            : "Confirmação"}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </form>
    </div>
  );
};

// Estilos profissionais e clean
const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  mainTitle: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "700",
  },
  progressBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginBottom: "10px",
  },
  progressStep: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
  },
  progressText: {
    color: "#666",
    fontSize: "1rem",
  },
  form: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  stepContainer: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  stepTitle: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "30px",
    textAlign: "center",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: "25px",
  },
  formRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  fileInput: {
    width: "100%",
    padding: "12px 16px",
    border: "2px dashed #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#fafafa",
    cursor: "pointer",
  },
  fileInfo: {
    fontSize: "0.85rem",
    color: "#666",
    fontWeight: "normal",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
    marginTop: "8px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  radioInput: {
    margin: 0,
    cursor: "pointer",
  },
  primaryButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
    marginTop: "10px",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    flex: 1,
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  planCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    border: "2px solid #ddd",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
  },
  planName: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  planPrice: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: "5px",
  },
  trialBadge: {
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: "5px",
  },
  fidelidadeBadge: {
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#ffc107",
    marginBottom: "15px",
  },
  planDescription: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
    fontSize: "0.9rem",
  },
  featuresList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "20px",
  },
  featureItem: {
    padding: "6px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "0.9rem",
  },
  radioContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
  },
  radioText: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  summaryTitle: {
    fontSize: "1.4rem",
    color: "#333",
    marginBottom: "25px",
    textAlign: "center",
  },
  summarySection: {
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  summarySubtitle: {
    fontSize: "1.1rem",
    color: "#333",
    marginBottom: "15px",
    fontWeight: "600",
  },
  selectedPlan: {
    padding: "15px",
    borderRadius: "8px",
    border: "2px solid",
    backgroundColor: "white",
    textAlign: "center",
  },
  termsSection: {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#fff3cd",
    borderRadius: "8px",
    border: "1px solid #ffeaa7",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "pointer",
  },
  checkboxInput: {
    marginTop: "3px",
  },
  checkboxText: {
    fontSize: "0.9rem",
    color: "#333",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default LojistaCadastro;
