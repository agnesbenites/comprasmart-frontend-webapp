// src/pages/LojistaHomePanel.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LojistaHomePanel = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "app-only",
      name: "PLANO APENAS APP",
      price: "R$ 97-197/mês",
      trial: "7 dias grátis",
      description: "Ideal para quem já tem sistema próprio",
      features: [
        "App para consultores",
        "Chat integrado",
        "Métricas básicas",
        "Suporte por email",
        "1 loja incluída",
      ],
      popular: false,
      color: "#007bff",
    },
    {
      id: "complete-online",
      name: "PLANO COMPLETO ONLINE",
      price: "R$ 297-497/mês",
      trial: "15 dias grátis",
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
      popular: true,
      color: "#28a745",
    },
    {
      id: "offline",
      name: "PLANO OFFLINE",
      price: "R$ 1.500-3.000 + mensalidade",
      trial: "30 dias grátis",
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
      popular: false,
      color: "#6f42c1",
    },
  ];

  const handleStartTrial = (planId) => {
    alert(
      `Iniciando teste de ${
        plans.find((p) => p.id === planId).trial
      } para ${planId}`
    );
    navigate("/cadastro-lojista", { state: { plan: planId } });
  };

  return (
    <div style={styles.container}>
            {/* Header Hero */}     {" "}
      <div style={styles.hero}>
               {" "}
        <h1 style={styles.heroTitle}>
                    Transforme sua Loja com Nossa Solução Completa        {" "}
        </h1>
               {" "}
        <p style={styles.heroSubtitle}>
                    Teste grátis nossa plataforma e veja os resultados em tempo
          real        {" "}
        </p>
             {" "}
      </div>
            {/* Cards de Planos */}     {" "}
      <div style={styles.plansGrid}>
               {" "}
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              ...styles.planCard,
              borderColor: plan.popular ? plan.color : "#ddd",
              transform: plan.popular ? "scale(1.05)" : "scale(1)",
              zIndex: plan.popular ? 10 : 1, // Destaque para o card popular
            }}
          >
                       {" "}
            {plan.popular && (
              <div
                style={{ ...styles.popularBadge, backgroundColor: plan.color }}
              >
                                🏆 MAIS POPULAR              {" "}
              </div>
            )}
                       {" "}
            <h3 style={{ ...styles.planName, color: plan.color }}>
                            {plan.name}           {" "}
            </h3>
                        <div style={styles.planPrice}>{plan.price}</div>       
                <div style={styles.trialBadge}>🎁 {plan.trial}</div>           {" "}
            <p style={styles.planDescription}>{plan.description}</p>           {" "}
            <ul style={styles.featuresList}>
                           {" "}
              {plan.features.map((feature, index) => (
                <li key={index} style={styles.featureItem}>
                                    ✓ {feature}               {" "}
                </li>
              ))}
                         {" "}
            </ul>
                       {" "}
            <button
              onClick={() => handleStartTrial(plan.id)}
              style={{
                ...styles.trialButton,
                backgroundColor: plan.color,
              }}
            >
                            Testar {plan.trial.split(" ")[0]} Dias Grátis      
                   {" "}
            </button>
                     {" "}
          </div>
        ))}
             {" "}
      </div>
            {/* Comparação de Planos */}     {" "}
      <div style={styles.comparison}>
                <h2 style={styles.comparisonTitle}>Compare os Planos</h2>       {" "}
        <div style={styles.comparisonTable}>
                   {" "}
          <table style={styles.table}>
                       {" "}
            <thead>
                           {" "}
              <tr>
                                <th style={styles.tableHeader}>Recurso</th>     
                          <th style={styles.tableHeader}>Apenas App</th>       
                        <th style={styles.tableHeader}>Completo Online</th>     
                          <th style={styles.tableHeader}>Offline</th>           
                 {" "}
              </tr>
                         {" "}
            </thead>
                       {" "}
            <tbody>
                           {" "}
              <tr>
                                <td style={styles.tableCell}>Dias de Teste</td> 
                              <td style={styles.tableCell}>7 dias</td>         
                      <td style={styles.tableCell}>15 dias</td>               {" "}
                <td style={styles.tableCell}>30 dias</td>             {" "}
              </tr>
                           {" "}
              <tr>
                               {" "}
                <td style={styles.tableCell}>App Consultores</td>               {" "}
                <td style={styles.tableCell}>✅</td>               {" "}
                <td style={styles.tableCell}>✅</td>               {" "}
                <td style={styles.tableCell}>✅</td>             {" "}
              </tr>
                           {" "}
              <tr>
                                <td style={styles.tableCell}>ERP Completo</td> 
                              <td style={styles.tableCell}>❌</td>             
                  <td style={styles.tableCell}>✅</td>               {" "}
                <td style={styles.tableCell}>✅</td>             {" "}
              </tr>
                           {" "}
              <tr>
                               {" "}
                <td style={styles.tableCell}>Funciona Offline</td>             
                  <td style={styles.tableCell}>❌</td>               {" "}
                <td style={styles.tableCell}>❌</td>               {" "}
                <td style={styles.tableCell}>✅</td>             {" "}
              </tr>
                           {" "}
              <tr>
                                <td style={styles.tableCell}>Suporte</td>       
                        <td style={styles.tableCell}>Email</td>               {" "}
                <td style={styles.tableCell}>Prioritário</td>               {" "}
                <td style={styles.tableCell}>Dedicado</td>             {" "}
              </tr>
                         {" "}
            </tbody>
                     {" "}
          </table>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

// Estilos OTIMIZADOS PARA DESKTOP
const styles = {
  container: {
    padding: "60px 40px", // Aumento do padding para telas maiores
    maxWidth: "1400px", // Aumento da largura máxima
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  hero: {
    textAlign: "center",
    marginBottom: "80px", // Mais espaço
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  },
  heroTitle: {
    fontSize: "3rem", // Fonte maior para destaque
    color: "#1b3670", // Cor mais forte
    marginBottom: "25px",
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: "1.4rem", // Fonte maior
    color: "#666",
    maxWidth: "800px",
    margin: "0 auto",
  },
  plansGrid: {
    display: "grid", // Grid ajustado para garantir 3 colunas em telas grandes
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "35px", // Mais espaçamento entre os cards
    marginBottom: "80px",
  },
  planCard: {
    backgroundColor: "white",
    padding: "40px 30px", // Mais padding interno
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)", // Sombra mais intensa
    border: "3px solid #ddd", // Borda mais grossa
    position: "relative",
    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Adicionado hover para UX de desktop
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-5px) scale(1.02)",
      boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
    },
  },
  popularBadge: {
    position: "absolute",
    top: "-15px", // Ajuste de posição
    left: "50%",
    transform: "translateX(-50%)",
    padding: "8px 20px",
    borderRadius: "25px",
    color: "white",
    fontSize: "14px", // Badge maior
    fontWeight: "bold",
    boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
  },
  planName: {
    fontSize: "1.6rem", // Título maior
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
    textTransform: "uppercase",
  },
  planPrice: {
    fontSize: "2.5rem", // Preço principal em destaque
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: "10px",
  },
  trialBadge: {
    textAlign: "center",
    fontSize: "1.2rem", // Texto de trial maior
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: "25px",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
  },
  planDescription: {
    textAlign: "center",
    color: "#555",
    marginBottom: "30px",
    fontSize: "1.1rem",
    fontStyle: "italic",
  },
  featuresList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "40px", // Mais espaço antes do botão
  },
  featureItem: {
    padding: "10px 0",
    borderBottom: "1px solid #e9ecef",
    fontSize: "1rem",
    color: "#333",
  },
  trialButton: {
    width: "100%",
    padding: "18px", // Botão grande e chamativo
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "auto", // Garante que o botão fique na base do card
  },
  comparison: {
    marginTop: "60px",
    padding: "30px 0",
    borderTop: "1px solid #ddd",
  },
  comparisonTitle: {
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "2rem",
    color: "#1b3670",
  },
  table: {
    width: "100%",
    borderCollapse: "separate", // Usar separate para borderRadius
    borderSpacing: 0,
    backgroundColor: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  tableHeader: {
    padding: "20px", // Mais padding
    backgroundColor: "#e9ecef", // Fundo cinza claro
    fontWeight: "bold",
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
    fontSize: "1.1rem",
    color: "#333",
    ":first-child": { borderTopLeftRadius: "15px" },
    ":last-child": { borderTopRightRadius: "15px" },
  },
  tableCell: {
    padding: "15px 20px", // Mais padding
    borderBottom: "1px solid #dee2e6",
    fontSize: "1rem",
    color: "#555",
  },
};

export default LojistaHomePanel;
