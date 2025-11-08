import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simulação dos componentes de gráficos Recharts
const Recharts = window.Recharts;
const {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} = Recharts || {};

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";
const LIGHT_GREY = "#f8f9fa";

// --- DADOS MOCKADOS ---
const mockAnalytics = {
  avgTime: "12 min",
  dailyCount: 15,
  commissionValue: "R$ 350,00",
  closedSales: 8,
  qrCodesSent: 25,
  indicatedConsultants: 3,
  rating: 4.8,
  associatedStores: ["Magazine X", "Loja Y"],
  associatedSegments: ["Eletrônicos", "Decoração"],
};

const historyData = [
  {
    pedidoId: "001A-123",
    valor: 1550.0,
    loja: "Magazine X",
    data: "2025-10-28",
    status: "Finalizado",
  },
  {
    pedidoId: "002B-456",
    valor: 4899.0,
    loja: "Loja Y",
    data: "2025-10-29",
    status: "Finalizado",
  },
  {
    pedidoId: "003C-789",
    valor: 349.9,
    loja: "Magazine X",
    data: "2025-10-30",
    status: "Finalizado",
  },
  {
    pedidoId: "004D-012",
    valor: 8200.0,
    loja: "Loja Y",
    data: "2025-11-01",
    status: "Finalizado",
  },
];

const salesData = [
  { name: "Sem 1", Vendas: 12, Atendimentos: 50 },
  { name: "Sem 2", Vendas: 15, Atendimentos: 60 },
  { name: "Sem 3", Vendas: 22, Atendimentos: 85 },
  { name: "Sem 4", Vendas: 25, Atendimentos: 100 },
];

const performanceData = [
  { name: "Avaliação (5.0)", Valor: 4.8, Cor: PRIMARY_COLOR },
  { name: "Tempo Médio (min)", Valor: 12, Cor: SECONDARY_COLOR },
  { name: "Fechamento (%)", Valor: 53.3, Cor: "#28a745" },
];

// --- SUB-COMPONENTES E FUNÇÕES DE RENDERIZAÇÃO ---

const MetricCard = ({ title, value, detail, color = SECONDARY_COLOR }) => (
  <div style={analyticsStyles.card}>
    <h4 style={analyticsStyles.cardTitle}>{title}</h4>
    <p style={{ ...analyticsStyles.cardValue, color: color }}>{value}</p>
    {detail && <small style={analyticsStyles.cardDetail}>{detail}</small>}
  </div>
);

const renderHistoryTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={analyticsStyles.table}>
      <thead>
        <tr style={analyticsStyles.tableHeaderRow}>
          <th style={analyticsStyles.tableHeader}>ID do Pedido</th>
          <th style={analyticsStyles.tableHeader}>Valor</th>
          <th style={analyticsStyles.tableHeader}>Loja</th>
          <th style={analyticsStyles.tableHeader}>Data</th>
          <th style={analyticsStyles.tableHeader}>Status</th>
        </tr>
      </thead>
      <tbody>
        {historyData.map((item, index) => (
          <tr key={index} style={analyticsStyles.tableRow}>
            <td style={analyticsStyles.tableCell}>{item.pedidoId}</td>
            <td
              style={{
                ...analyticsStyles.tableCell,
                fontWeight: "bold",
                color: "#28a745",
              }}
            >
              R$ {item.valor.toFixed(2).replace(".", ",")}
            </td>
            <td style={analyticsStyles.tableCell}>{item.loja}</td>
            <td style={analyticsStyles.tableCell}>{item.data}</td>
            <td style={analyticsStyles.tableCell}>
              <span style={analyticsStyles.statusBadge}>{item.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const AnalyticsPanel = () => {
  const navigate = useNavigate();
  const [toolMessage, setToolMessage] = useState(null);
  const userName = localStorage.getItem("userName") || "Consultor(a)";

  // 1. Função de Exportação para Excel
  const handleExportExcel = () => {
    setToolMessage(
      "⬇️ Exportação de Dados para Excel (CSV) iniciada. Verifique seus downloads."
    );
  };

  // 2. Campo de Indicação (Simulação)
  const handleNominate = () => {
    setToolMessage(
      "📝 O formulário de Indicação de Novo Consultor será aberto em uma nova janela."
    );
  };

  return (
    <div style={analyticsStyles.appContainer}>
      {/* Menu Lateral Compacto (PADRÃO) - CORRIGIDO */}
      <nav style={analyticsStyles.sidebar}>
        <div style={analyticsStyles.sidebarContent}>
          {/* Botão Home */}
          <button
            onClick={() => navigate("/dashboard")}
            style={analyticsStyles.sidebarButton}
          >
            <span style={analyticsStyles.sidebarIcon}>🏠</span>
            <span style={analyticsStyles.sidebarText}>Home</span>
          </button>
          {/* Botão Chat */}
          <button
            onClick={() => navigate("/chat")}
            style={analyticsStyles.sidebarButton}
          >
            <span style={analyticsStyles.sidebarIcon}>💬</span>
            <span style={analyticsStyles.sidebarText}>Chat</span>
          </button>
          {/* Botão Analytics (Ativo) */}
          <div
            style={{
              ...analyticsStyles.sidebarButton,
              backgroundColor: "#0056b3",
            }}
          >
            <span style={analyticsStyles.sidebarIcon}>📊</span>
            <span style={analyticsStyles.sidebarText}>Analítico</span>
          </div>
          {/* Botão Perfil */}
          <button
            onClick={() => navigate("/profile")}
            style={analyticsStyles.sidebarButton}
          >
            <span style={analyticsStyles.sidebarIcon}>👤</span>
            <span style={analyticsStyles.sidebarText}>Perfil</span>
          </button>
        </div>
      </nav>

      <main style={analyticsStyles.mainContent}>
        {/* Header Superior com Perfil (PADRÃO) - CORRIGIDO */}
        <header style={analyticsStyles.header}>
          <h1 style={analyticsStyles.headerTitle}>Painel de Análises</h1>
          <button
            onClick={() => navigate("/profile")}
            style={analyticsStyles.profileLink}
          >
            <span style={analyticsStyles.profileName}>{userName}</span>
            <img
              src="https://placehold.co/40x40/007bff/ffffff?text=C"
              alt="Foto do Consultor"
              style={analyticsStyles.profilePic}
            />
          </button>
        </header>

        <div style={analyticsStyles.container}>
          {/* Mensagem de Feedback Global */}
          {toolMessage && (
            <div style={analyticsStyles.feedbackBox}>
              <p style={{ margin: 0 }}>{toolMessage}</p>
            </div>
          )}

          {/* Botão de Exportação */}
          <div style={analyticsStyles.exportButtonContainer}>
            <button
              onClick={handleExportExcel}
              style={analyticsStyles.exportButton}
            >
              Exportar Dados (Excel) 📥
            </button>
          </div>

          {/* MÉTRICAS DE DESEMPENHO */}
          <div style={analyticsStyles.section}>
            <h3 style={analyticsStyles.sectionTitle}>Resultados Chave</h3>
            <div style={analyticsStyles.metricsGrid}>
              <MetricCard
                title="Vendas Fechadas"
                value={mockAnalytics.closedSales}
                color={PRIMARY_COLOR}
              />
              <MetricCard
                title="Comissão (Mês)"
                value={mockAnalytics.commissionValue}
                color="#28a745"
              />
              <MetricCard
                title="Atendimento Diário"
                value={mockAnalytics.dailyCount}
              />
              <MetricCard
                title="Avaliação Média"
                value={mockAnalytics.rating}
                detail="Clientes satisfeitos"
                color="#ffc107"
              />
              <MetricCard
                title="QR Codes Enviados"
                value={mockAnalytics.qrCodesSent}
              />
            </div>
          </div>

          {/* GRÁFICOS ANALÍTICOS */}
          <div style={analyticsStyles.section}>
            <h3 style={analyticsStyles.sectionTitle}>
              Gráficos de Desempenho (Mensal)
            </h3>

            <div style={analyticsStyles.chartsGrid}>
              {/* Gráfico 1: Vendas e Atendimentos por Semana */}
              <div style={analyticsStyles.chartBox}>
                <h4 style={analyticsStyles.chartTitle}>
                  Vendas e Atendimentos Semanais
                </h4>
                {Recharts ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke={SECONDARY_COLOR} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Vendas"
                        stroke={PRIMARY_COLOR}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="Atendimentos"
                        stroke={SECONDARY_COLOR}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: "center", padding: "50px" }}>
                    Carregando Gráfico...
                  </p>
                )}
              </div>

              {/* Gráfico 2: Métrica de Performance Individual */}
              <div style={analyticsStyles.chartBox}>
                <h4 style={analyticsStyles.chartTitle}>Métricas Chave</h4>
                {Recharts ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke={SECONDARY_COLOR} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Valor" fill={PRIMARY_COLOR} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: "center", padding: "50px" }}>
                    Carregando Gráfico...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* INFORMAÇÕES PESSOAIS E INDICAÇÃO */}
          <div style={analyticsStyles.section}>
            <h3 style={analyticsStyles.sectionTitle}>Minha Afiliação</h3>

            <div style={analyticsStyles.infoGrid}>
              <div style={analyticsStyles.infoCard}>
                <h4>Lojas Associadas</h4>
                <p>{mockAnalytics.associatedStores.join(", ")}</p>
              </div>
              <div style={analyticsStyles.infoCard}>
                <h4>Segmentos de Foco</h4>
                <p>{mockAnalytics.associatedSegments.join(", ")}</p>
              </div>
              <div style={analyticsStyles.infoCard}>
                <h4>Indicações Ativas</h4>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: PRIMARY_COLOR,
                  }}
                >
                  {mockAnalytics.indicatedConsultants}
                </p>
                {/* Campo para Indicar Pessoas */}
                <button
                  onClick={handleNominate}
                  style={analyticsStyles.nominateButton}
                >
                  + Indicar Novo Consultor
                </button>
              </div>
            </div>
          </div>

          {/* HISTÓRICO DE COMPRAS (Tabela) */}
          <div style={analyticsStyles.section}>
            <h3 style={analyticsStyles.sectionTitle}>
              Histórico de Compras Fechadas (Mês)
            </h3>
            {renderHistoryTable()}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- ESTILOS DO COMPONENTE ---
const analyticsStyles = {
  // LAYOUT ESTRUTURAL PADRÃO
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
    gap: "15px",
    width: "100%",
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
    textDecoration: "none",
    transition: "background-color 0.2s",
    width: "100%",
  },
  sidebarIcon: { fontSize: "20px" },
  sidebarText: { fontSize: "11px" },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  // HEADER (PADRÃO)
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
  // CONTEÚDO ESPECÍFICO DO PAINEL
  container: {
    padding: "30px",
  },
  mainTitle: {
    fontSize: "1.8rem",
    color: SECONDARY_COLOR,
    borderBottom: "2px solid #eee",
    paddingBottom: "15px",
    marginBottom: "30px",
    fontWeight: "700",
  },
  exportButtonContainer: {
    textAlign: "right",
    marginBottom: "20px",
  },
  exportButton: {
    padding: "10px 15px",
    backgroundColor: SECONDARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "background-color 0.2s",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: SECONDARY_COLOR,
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "20px",
    fontWeight: "600",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #eee",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#6c757d",
    margin: "0 0 5px 0",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
  },
  cardDetail: {
    fontSize: "10px",
    color: "#888",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
  },
  chartBox: {
    padding: "15px",
    border: "1px solid #eee",
    borderRadius: "8px",
  },
  chartTitle: {
    fontSize: "1rem",
    color: SECONDARY_COLOR,
    marginBottom: "10px",
    fontWeight: "600",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  infoCard: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: LIGHT_GREY,
    textAlign: "center",
  },
  nominateButton: {
    padding: "10px 15px",
    backgroundColor: "#ffc107",
    color: SECONDARY_COLOR,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  feedbackBox: {
    backgroundColor: "#e6f7ff",
    color: "#0056b3",
    padding: "12px 20px",
    borderRadius: "5px",
    marginBottom: "20px",
    borderLeft: "4px solid #007bff",
    fontSize: "15px",
  },
  // Estilos da Tabela
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "0.9rem",
  },
  tableHeader: {
    padding: "12px 15px",
    backgroundColor: LIGHT_GREY,
    color: SECONDARY_COLOR,
    fontWeight: "600",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
  },
  tableCell: {
    padding: "10px 15px",
    color: "#6c757d",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    backgroundColor: "#d4edda",
    color: "#155724",
    fontWeight: "600",
    fontSize: "0.8rem",
  },
};

export default AnalyticsPanel;
