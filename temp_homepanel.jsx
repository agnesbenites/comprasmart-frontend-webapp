import React from "react";
import { useNavigate } from "react-router-dom";

// Simulando a importação do RotatingBanner (assumindo que ele está definido separadamente)
const RotatingBanner = () => (
  <div
    style={{
      backgroundColor: "#e9f7fe",
      color: "#0056b3",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "25px",
      border: "1px solid #cceeff",
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    🌟 Banner Rotativo: Novas Metas de Vendas Lançadas! 🌟
  </div>
);

// --- ESTILOS COMPARTILHADOS (Minimalista) ---
const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";
const LIGHT_GREY = "#f8f9fa";

// Dados Mockados da Agenda (Agora com ID do Cliente)
const agenda = [
  {
    id: 1,
    clientId: "CLI-A123",
    time: "10:00",
    type: "Vídeo Chamada",
    status: "Agendado",
  },
  {
    id: 2,
    clientId: "CLI-B456",
    time: "11:30",
    type: "Chat Prioritário",
    status: "Pendente",
  },
  {
    id: 3,
    clientId: "CLI-C789",
    time: "14:00",
    type: "Áudio",
    status: "Concluído",
  },
];

// Dados Mockados dos Alertas de Preço (Mais Detalhados e Flexíveis)
const priceAlerts = [
  {
    id: 1,
    product: "Geladeira Inverter",
    oldPrice: 2800,
    newPrice: 2499,
    segment: "Eletrodomésticos",
    changeType: "priceDrop", // Queda de Preço
    store: "Loja X",
    imageUrl: "https://placehold.co/50x50/007bff/ffffff?text=GI",
  },
  {
    id: 2,
    product: 'Smart TV 55" 4K',
    oldPrice: 3500,
    newPrice: 3500,
    segment: "Tecnologia",
    changeType: "newPromotion", // Nova Promoção
    store: "Magazine Y",
    imageUrl: "https://placehold.co/50x50/28a745/ffffff?text=TV",
  },
  {
    id: 3,
    product: "Notebook Gamer X1",
    oldPrice: null,
    newPrice: 6000,
    segment: "Tecnologia",
    changeType: "newProduct", // Novo Lançamento
    store: "Loja X",
    imageUrl: "https://placehold.co/50x50/ffc107/333333?text=NG",
  },
];

const getStatusStyles = (status) => {
  switch (status) {
    case "Agendado":
      return {
        color: "#ffc107",
        backgroundColor: "#fff3cd",
        borderColor: "#ffc107",
      };
    case "Concluído":
      return {
        color: "#28a745",
        backgroundColor: "#d4edda",
        borderColor: "#28a745",
      };
    case "Pendente":
      return {
        color: SECONDARY_COLOR,
        backgroundColor: "#f0f0f0",
        borderColor: SECONDARY_COLOR,
      };
    default:
      return {};
  }
};

const renderAgenda = () => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>📅 Agenda de Chamadas do Dia</h3>
    {agenda.map((item) => {
      const statusStyle = getStatusStyles(item.status);
      return (
        <div key={item.id} style={styles.agendaItem}>
          <span style={styles.agendaTime}>{item.time}</span>
          <span style={styles.agendaClient}>
            ID Cliente: <strong>{item.clientId}</strong>
          </span>
          <span style={styles.agendaType}>Tipo: {item.type}</span>
          <span style={{ ...styles.agendaStatus, ...statusStyle }}>
            {item.status}
          </span>
        </div>
      );
    })}
    <p style={styles.note}>Total de {agenda.length} compromissos agendados.</p>
  </div>
);

const renderPriceAlerts = () => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>🚨 Alertas de Vendas e Preço</h3>
    {priceAlerts.map((alert) => {
      let icon = "🏷️";
      let priceInfo;
      let priceStyle = {};

      if (alert.changeType === "priceDrop") {
        icon = "📉";
        priceInfo = `R$ ${
          alert.oldPrice?.toFixed(2) || "N/A"
        } ➝ R$ ${alert.newPrice.toFixed(2)}`;
        priceStyle = { color: "#28a745", fontWeight: "bold" }; // Verde para queda de preço
      } else if (alert.changeType === "newPromotion") {
        icon = "✨";
        priceInfo = `Promoção na Loja: R$ ${alert.newPrice.toFixed(2)}`;
        priceStyle = { color: PRIMARY_COLOR, fontWeight: "bold" };
      } else if (alert.changeType === "newProduct") {
        icon = "🚀";
        priceInfo = `Novo Lançamento: R$ ${alert.newPrice.toFixed(2)}`;
        priceStyle = { color: SECONDARY_COLOR, fontWeight: "bold" };
      }

      return (
        <div key={alert.id} style={styles.alertItem}>
          <img
            src={alert.imageUrl}
            alt={alert.product}
            style={styles.alertImage}
          />
          <div style={{ flexGrow: 1 }}>
            <p style={styles.alertProduct}>
              {icon} <strong>{alert.product}</strong> ({alert.segment})
            </p>
            <p style={{ ...styles.alertPrice, ...priceStyle }}>{priceInfo}</p>
            <span style={styles.alertStore}>Loja: {alert.store}</span>
          </div>
          <button
            style={styles.infoButton}
            onClick={() =>
              alert(
                `Detalhes do Alerta: ${alert.product} - Tipo: ${alert.changeType}`
              )
            }
          >
            + Informações
          </button>
        </div>
      );
    })}
    <p style={styles.note}>
      Use esses alertas como argumentos de venda no chat!
    </p>
  </div>
);

const HomePanel = () => {
  const navigate = useNavigate();
  // Usando localStorage para simular o nome do usuário logado
  const userName = localStorage.getItem("userName") || "Consultor(a)";

  return (
    <div style={styles.appContainer}>
      {/* Menu Lateral Compacto (IDÊNTICO AO ANALYTICS) */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          {/* Botão Home (Ativo) */}
          <div style={{ ...styles.sidebarButton, backgroundColor: "#0056b3" }}>
            <span style={styles.sidebarIcon}>🏠</span>
            <span style={styles.sidebarText}>Home</span>
          </div>
          {/* Botão Chat */}
          <button
            onClick={() => navigate("/chat")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>💬</span>
            <span style={styles.sidebarText}>Chat</span>
          </button>
          {/* Botão Analytics */}
          <button
            onClick={() => navigate("/analytics")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>📊</span>
            <span style={styles.sidebarText}>Analítico</span>
          </button>
          {/* Botão Perfil */}
          <button
            onClick={() => navigate("/profile")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>👤</span>
            <span style={styles.sidebarText}>Perfil</span>
          </button>
        </div>
      </nav>

      <main style={styles.mainContent}>
        {/* Header Superior com Perfil (IDÊNTICO AO ANALYTICS) */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Bem-vindo(a), {userName}!</h1>
          <button
            onClick={() => navigate("/profile")}
            style={styles.profileLink}
          >
            <span style={styles.profileName}>{userName}</span>
            <img
              src="https://placehold.co/40x40/007bff/ffffff?text=C"
              alt="Foto do Consultor"
              style={styles.profilePic}
            />
          </button>
        </header>

        <div style={styles.container}>
          <RotatingBanner />

          <div style={styles.contentGrid}>
            {renderAgenda()}
            {renderPriceAlerts()}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  // LAYOUT ESTRUTURAL
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: LIGHT_GREY,
    fontFamily: "Inter, sans-serif",
  },
  sidebar: {
    width: "80px",
    backgroundColor: SECONDARY_COLOR,
    padding: "20px 0",
    flexShrink: 0,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  sidebarContent: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  sidebarButton: {
    background: "none",
    border: "none",
    color: "white",
    padding: "12px 0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
  sidebarIcon: { fontSize: "20px" },
  sidebarText: { fontSize: "11px" },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  // HEADER
  header: {
    backgroundColor: "white",
    padding: "15px 30px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: "1.5rem",
    color: SECONDARY_COLOR,
    margin: 0,
  },
  profileLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: SECONDARY_COLOR,
    gap: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: `2px solid ${PRIMARY_COLOR}`,
  },
  // CONTEÚDO PRINCIPAL
  container: {
    padding: "30px",
    fontFamily: "Inter, sans-serif",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: SECONDARY_COLOR,
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "15px",
    fontWeight: "600",
  },
  note: {
    fontSize: "14px",
    color: "#6c757d",
    marginTop: "15px",
    fontStyle: "italic",
  },

  // AGENDA
  agendaItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px dotted #ddd",
    alignItems: "center",
  },
  agendaTime: { fontWeight: "bold", color: SECONDARY_COLOR, width: "15%" },
  agendaClient: { width: "40%", fontSize: "0.95rem" },
  agendaType: { width: "20%", fontSize: "14px", color: "#6c757d" },
  agendaStatus: {
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    textAlign: "center",
    border: "1px solid",
    fontWeight: "bold",
  },

  // ALERTAS
  alertItem: {
    display: "flex",
    gap: "15px",
    padding: "15px 0",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  alertImage: {
    width: "50px",
    height: "50px",
    borderRadius: "6px",
    objectFit: "cover",
  },
  alertProduct: {
    margin: "0 0 5px 0",
    fontWeight: "500",
    color: SECONDARY_COLOR,
    fontSize: "1rem",
  },
  alertPrice: { margin: "0", fontSize: "15px" },
  alertStore: { fontSize: "12px", color: "#6c757d" },
  infoButton: {
    padding: "8px 15px",
    backgroundColor: "white",
    color: PRIMARY_COLOR,
    border: `1px solid ${PRIMARY_COLOR}`,
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background-color 0.2s, color 0.2s",
  },
};

export default HomePanel;
