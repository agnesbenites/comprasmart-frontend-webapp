// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../../contexts/NotificationContext";
import NotificationBell from "../../../components/NotificationBell";
import NotificationSender from "../../../components/NotificationSender";


// Componentes do Dashboard
const StatCard = ({ title, value, icon, color, trend }) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <div style={styles.statContent}>
      <div style={styles.statInfo}>
        <h3 style={styles.statTitle}>{title}</h3>
        <p style={styles.statValue}>{value}</p>
        {trend && <span style={styles.trend}>{trend}</span>}
      </div>
      <div style={{ ...styles.statIcon, backgroundColor: color }}>{icon}</div>
    </div>
  </div>
);

const ClientTable = ({ clients, onViewDetails }) => (
  <div style={styles.tableContainer}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Cliente</th>
          <th style={styles.th}>Plano</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Expira em</th>
          <th style={styles.th}>Acoes</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client, index) => (
          <tr key={index} style={styles.tr}>
            <td style={styles.td}>
              <div style={styles.clientInfo}>
                <div style={styles.avatar}>{client.name.charAt(0)}</div>
                <div>
                  <strong>{client.name}</strong>
                  <br />
                  <small>{client.email}</small>
                </div>
              </div>
            </td>
            <td style={styles.td}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor:
                    client.plan === "Premium"
                      ? "#28a745"
                      : client.plan === "Pro"
                      ? "#007bff"
                      : "#6c757d",
                }}
              >
                {client.plan}
              </span>
            </td>
            <td style={styles.td}>
              <span
                style={{
                  ...styles.status,
                  color:
                    client.status === "Ativo"
                      ? "#28a745"
                      : client.status === "Trial"
                      ? "#ffc107"
                      : "#dc3545",
                }}
              >
                — {client.status}
              </span>
            </td>
            <td style={styles.td}>
              {client.daysLeft > 0 ? (
                <span style={styles.daysLeft}>{client.daysLeft} dias</span>
              ) : (
                <span style={styles.expired}>Expirado</span>
              )}
            </td>
            <td style={styles.td}>
              <button
                onClick={() => onViewDetails(client)}
                style={styles.actionButton}
              >
                 Detalhes
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("overview");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Dados mockados
  const mockData = {
    stats: {
      totalClients: 45,
      activeTrials: 12,
      expiringSoon: 5,
      revenue: "R$ 8.240,00",
    },
    clients: [
      {
        id: 1,
        name: "Joao Silva",
        email: "joao@empresa.com",
        plan: "Trial",
        status: "Trial",
        daysLeft: 7,
        signupDate: "2024-01-15",
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@loja.com",
        plan: "Premium",
        status: "Ativo",
        daysLeft: 30,
        signupDate: "2024-01-10",
      },
      {
        id: 3,
        name: "Pedro Oliveira",
        email: "pedro@commerce.com",
        plan: "Trial",
        status: "Trial",
        daysLeft: 2,
        signupDate: "2024-01-20",
      },
      {
        id: 4,
        name: "Ana Costa",
        email: "ana@empresa.com",
        plan: "Pro",
        status: "Ativo",
        daysLeft: 45,
        signupDate: "2024-01-05",
      },
    ],
  };

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClients(mockData.clients);
      setLoading(false);
      
      // Adicionar notificacao de boas-vindas
      addNotification({
        titulo: 'Bem-vindo ao Dashboard! ',
        mensagem: 'Sistema administrativo carregado com sucesso.',
        tipo: 'success'
      });
    }, 1000);
  }, [addNotification]);

  const handleViewDetails = (client) => {
    console.log("Ver detalhes:", client);
    // navigate(`/admin/clientes/${client.id}`);
  };

  const handleAddClient = () => {
    navigate("/admin/cadastro-cliente");
  };

  const handleSendBroadcastNotification = (notificationData) => {
    // Notificar o admin que a mensagem foi enviada
    addNotification({
      titulo: ' Comunicado Enviado',
      mensagem: `Sua mensagem foi enviada para ${notificationData.destinatarios.join(', ')}`,
      tipo: 'success'
    });

    // Aqui voca pode integrar com sua API para enviar para outros usuarios
    console.log('Enviando notificacao para:', notificationData);
  };

  const handleExpiringTrialAlert = () => {
    addNotification({
      titulo: '° Trial Expirando',
      mensagem: 'Pedro Oliveira tem 2 dias restantes no trial',
      tipo: 'warning',
      destinatario: 'admin'
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>o</div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Atualizado com Notificacoes */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTitle}>
            <h1> Dashboard Administrativo</h1>
            <p>Gestao completa de clientes e trials</p>
          </div>
          <div style={styles.headerActions}>
            {/* Bell de Notificacoes */}
            <NotificationBell />
            
            {/* Botao para enviar notificacoes */}
            <button 
              onClick={() => setShowNotificationModal(true)}
              style={styles.notificationButton}
            >
               Enviar Comunicado
            </button>
            
            <button style={styles.primaryButton} onClick={handleAddClient}>
              O Novo Cliente
            </button>
            <button style={styles.secondaryButton}> Configuracoes</button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "overview" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("overview")}
        >
           Visao Geral
        </button>
        <button
          style={activeTab === "clients" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("clients")}
        >
           Clientes
        </button>
        <button
          style={activeTab === "trials" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("trials")}
        >
          ° Trials
        </button>
        <button
          style={activeTab === "reports" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("reports")}
        >
           Relatorios
        </button>
        <button
          style={activeTab === "notifications" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("notifications")}
        >
           Notificacoes
        </button>
      </div>

      {/* Conteudo Principal */}
      <div style={styles.mainContent}>
        {activeTab === "overview" && (
          <>
            {/* Cards de Estatisticas */}
            <div style={styles.statsGrid}>
              <StatCard
                title="Total de Clientes"
                value={mockData.stats.totalClients}
                icon=""
                color="#007bff"
                trend="+12%"
              />
              <StatCard
                title="Trials Ativos"
                value={mockData.stats.activeTrials}
                icon="°"
                color="#ffc107"
                trend="+5"
              />
              <StatCard
                title="Expirando em 7 dias"
                value={mockData.stats.expiringSoon}
                icon=" "
                color="#dc3545"
                trend="Atencao"
              />
              <StatCard
                title="Receita Mensal"
                value={mockData.stats.revenue}
                icon=""
                color="#28a745"
                trend="+8%"
              />
            </div>

            {/* Graficos e Tabela Rapida */}
            <div style={styles.overviewGrid}>
              <div style={styles.chartSection}>
                <h3> Visao Geral - ltimos 30 dias</h3>
                <div style={styles.chartPlaceholder}>
                  <p>Grafico de crescimento de clientes</p>
                  <div style={styles.barChart}>
                    {[65, 80, 75, 90, 85, 95].map((height, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.bar,
                          height: `${height}%`,
                          backgroundColor: index === 5 ? "#007bff" : "#e9ecef",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.recentActivity}>
                <h3> Atividade Recente</h3>
                <div style={styles.activityList}>
                  <div style={styles.activityItem}>
                    <span style={styles.activityIcon}></span>
                    <div>
                      <strong>Novo trial iniciado</strong>
                      <p>Loja Central - 2 horas atras</p>
                    </div>
                  </div>
                  <div style={styles.activityItem}>
                    <span style={styles.activityIcon}></span>
                    <div>
                      <strong>Upgrade para Premium</strong>
                      <p>Maria Santos - 1 dia atras</p>
                    </div>
                  </div>
                  <div style={styles.activityItem}>
                    <span style={styles.activityIcon}> </span>
                    <div>
                      <strong>Trial expirando</strong>
                      <p>Pedro Oliveira - 2 dias atras</p>
                      <button 
                        onClick={handleExpiringTrialAlert}
                        style={styles.smallButton}
                      >
                        Notificar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "clients" && (
          <div style={styles.tabContent}>
            <div style={styles.tabHeader}>
              <h2> Gestao de Clientes</h2>
              <div style={styles.filters}>
                <select style={styles.filterSelect}>
                  <option>Todos os Planos</option>
                  <option>Trial</option>
                  <option>Premium</option>
                  <option>Pro</option>
                </select>
                <select style={styles.filterSelect}>
                  <option>Todos os Status</option>
                  <option>Ativo</option>
                  <option>Trial</option>
                  <option>Expirado</option>
                </select>
                <input
                  type="text"
                  placeholder=" Buscar cliente..."
                  style={styles.searchInput}
                />
              </div>
            </div>
            <ClientTable clients={clients} onViewDetails={handleViewDetails} />
          </div>
        )}

        {activeTab === "trials" && (
          <div style={styles.tabContent}>
            <h2>° Gestao de Trials</h2>
            <p>Controle de periodos de teste e expiracoes</p>
            <div style={styles.trialStats}>
              <div style={styles.trialCard}>
                <h4>Trials Ativos</h4>
                <p style={styles.trialNumber}>12</p>
              </div>
              <div style={styles.trialCard}>
                <h4>Expirando esta semana</h4>
                <p style={styles.trialNumberWarning}>3</p>
              </div>
              <div style={styles.trialCard}>
                <h4>Conversoes</h4>
                <p style={styles.trialNumberSuccess}>8</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div style={styles.tabContent}>
            <h2> Relatorios e Analytics</h2>
            <p>Relatorios detalhados de performance</p>
            <div style={styles.reportsGrid}>
              <div style={styles.reportCard}>
                <h4> Relatorio de Conversao</h4>
                <p>Taxa de conversao de trials: 45%</p>
              </div>
              <div style={styles.reportCard}>
                <h4> Receita Mensal</h4>
                <p>R$ 8.240,00</p>
              </div>
              <div style={styles.reportCard}>
                <h4> Retencao de Clientes</h4>
                <p>Taxa de 92%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div style={styles.tabContent}>
            <h2> Centro de Notificacoes</h2>
            <p>Gerencie e envie notificacoes para seus usuarios</p>
            
            <div style={styles.notificationControls}>
              <button 
                onClick={() => setShowNotificationModal(true)}
                style={styles.primaryButton}
              >
                 Enviar Novo Comunicado
              </button>
              
              <div style={styles.quickActions}>
                <h4>Acoes Rapidas:</h4>
                <button 
                  onClick={() => {
                    addNotification({
                      titulo: ' Nova Atualizacao',
                      mensagem: 'Sistema atualizado com novas funcionalidades',
                      tipo: 'info'
                    });
                  }}
                  style={styles.quickButton}
                >
                  Anunciar Atualizacao
                </button>
                <button 
                  onClick={() => {
                    addNotification({
                      titulo: ' Manutencao Programada',
                      mensagem: 'Sistema ficara offline domingo  s 02:00',
                      tipo: 'warning'
                    });
                  }}
                  style={styles.quickButton}
                >
                  Aviso de Manutencao
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Envio de Notificacoes */}
      <NotificationSender 
        show={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onSend={handleSendBroadcastNotification}
      />
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontSize: "18px",
    color: "#666",
  },
  loadingSpinner: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  header: {
    backgroundColor: "white",
    borderBottom: "1px solid #dee2e6",
    padding: "20px 0",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  headerTitle: {
    h1: {
      margin: "0 0 5px 0",
      color: "#333",
      fontSize: "28px",
    },
    p: {
      margin: 0,
      color: "#666",
      fontSize: "16px",
    },
  },
  headerActions: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  notificationButton: {
    padding: "12px 20px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  primaryButton: {
    padding: "12px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: "12px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  tabs: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    gap: "10px",
    borderBottom: "1px solid #dee2e6",
  },
  tab: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "14px",
  },
  activeTab: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  statContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statInfo: {
    h3: {
      margin: "0 0 8px 0",
      fontSize: "14px",
      color: "#666",
      fontWeight: "normal",
    },
  },
  statTitle: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    color: "#666",
    fontWeight: "normal",
  },
  statValue: {
    margin: "0 0 5px 0",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  trend: {
    fontSize: "12px",
    color: "#28a745",
    fontWeight: "bold",
  },
  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "white",
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
    marginBottom: "30px",
  },
  chartSection: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    h3: {
      margin: "0 0 20px 0",
      color: "#333",
    },
  },
  chartPlaceholder: {
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    color: "#666",
  },
  barChart: {
    display: "flex",
    alignItems: "end",
    height: "120px",
    gap: "10px",
    marginTop: "20px",
  },
  bar: {
    width: "30px",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.3s ease",
  },
  recentActivity: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    h3: {
      margin: "0 0 20px 0",
      color: "#333",
    },
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
  },
  activityIcon: {
    fontSize: "20px",
  },
  smallButton: {
    padding: "4px 8px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    marginTop: "5px",
  },
  tabContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  tabHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  filters: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  filterSelect: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  searchInput: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "200px",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "15px",
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
    fontWeight: "bold",
    color: "#333",
  },
  tr: {
    borderBottom: "1px solid #dee2e6",
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  },
  td: {
    padding: "15px",
  },
  clientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
  status: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  daysLeft: {
    color: "#28a745",
    fontWeight: "bold",
  },
  expired: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  actionButton: {
    padding: "6px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  trialStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  trialCard: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
  },
  trialNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#007bff",
    margin: "10px 0 0 0",
  },
  trialNumberWarning: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#ffc107",
    margin: "10px 0 0 0",
  },
  trialNumberSuccess: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#28a745",
    margin: "10px 0 0 0",
  },
  reportsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  reportCard: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    borderLeft: "4px solid #007bff",
  },
  notificationControls: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "20px",
  },
  quickActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  quickButton: {
    padding: "10px 15px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "200px",
    textAlign: "left",
  },
};

export default AdminDashboard;
