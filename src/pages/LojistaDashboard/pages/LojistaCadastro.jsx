import React, { useState } from "react";

const LojistaCadastro = () => {
  const [configuracoes, setConfiguracoes] = useState({
    webhookUrl: "",
    apiKey: "sk_live_••••••••••••••••••••••",
    backupAutomatico: true,
    notificacoesEmail: true
  });

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguracoes({
      ...configuracoes,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleIntegracaoERP = () => {
    alert("Redirecionando para configuração de ERP...");
  };

  const handleGerarAPIKey = () => {
    const novaApiKey = `sk_live_${Math.random().toString(36).substr(2, 24)}`;
    setConfiguracoes({
      ...configuracoes,
      apiKey: novaApiKey
    });
    alert("Nova API Key gerada com sucesso!");
  };

  const handleConfigurarWebhook = () => {
    if (configuracoes.webhookUrl) {
      alert(`Webhook configurado para: ${configuracoes.webhookUrl}`);
    } else {
      alert("Por favor, insira uma URL de webhook válida");
    }
  };

  const handleExportarBackup = () => {
    alert("Iniciando exportação de backup...");
    // Simulação de download
    setTimeout(() => {
      alert("Backup exportado com sucesso!");
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Configurações Avançadas</h1>
      <p style={styles.subtitle}>Gerencie integrações e configurações técnicas da sua loja</p>

      <div style={styles.grid}>
        {/* Integração com ERP */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🔄 Integração com ERP</h3>
            <span style={styles.statusBadge}>Disponível</span>
          </div>
          <p style={styles.cardDescription}>
            Sincronize automaticamente seus produtos, estoque e vendas com seu sistema de gestão.
          </p>
          <div style={styles.erpOptions}>
            <div style={styles.erpOption}>
              <strong>SAP</strong>
              <span style={styles.erpStatus}>✅ Conectado</span>
            </div>
            <div style={styles.erpOption}>
              <strong>TOTVS</strong>
              <span style={styles.erpStatus}>⚡ Disponível</span>
            </div>
            <div style={styles.erpOption}>
              <strong>BLING</strong>
              <span style={styles.erpStatus}>🔗 Conectar</span>
            </div>
          </div>
          <button 
            style={styles.primaryButton}
            onClick={handleIntegracaoERP}
          >
            🔧 Configurar Integração
          </button>
        </div>

        {/* API Keys */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🔑 API Keys</h3>
            <span style={styles.statusBadge}>Ativa</span>
          </div>
          <p style={styles.cardDescription}>
            Sua chave de API para integrações personalizadas e automações.
          </p>
          <div style={styles.apiKeySection}>
            <label style={styles.label}>Chave de API:</label>
            <div style={styles.apiKeyDisplay}>
              <code style={styles.apiKeyText}>{configuracoes.apiKey}</code>
              <button 
                style={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(configuracoes.apiKey);
                  alert("API Key copiada para a área de transferência!");
                }}
              >
                📋 Copiar
              </button>
            </div>
            <small style={styles.helperText}>
              Mantenha esta chave em segredo. Ela fornece acesso completo à sua conta.
            </small>
          </div>
          <div style={styles.buttonGroup}>
            <button 
              style={styles.secondaryButton}
              onClick={handleGerarAPIKey}
            >
              🔄 Gerar Nova Key
            </button>
            <button style={styles.secondaryButton}>
              📊 Ver Logs de Uso
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🌐 Webhooks</h3>
            <span style={styles.statusBadge}>Configurável</span>
          </div>
          <p style={styles.cardDescription}>
            Receba notificações em tempo real sobre eventos da sua loja.
          </p>
          <div style={styles.formGroup}>
            <label style={styles.label}>URL do Webhook:</label>
            <input
              type="url"
              name="webhookUrl"
              value={configuracoes.webhookUrl}
              onChange={handleConfigChange}
              placeholder="https://sua-api.com/webhook"
              style={styles.input}
            />
            <small style={styles.helperText}>
              URL que receberá as notificações de eventos
            </small>
          </div>
          <div style={styles.webhookEvents}>
            <h4 style={styles.sectionSubtitle}>Eventos Disponíveis:</h4>
            <div style={styles.eventList}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked />
                🛒 Novas vendas
              </label>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked />
                📦 Alterações no estoque
              </label>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" />
                👥 Clientes novos
              </label>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" />
                💳 Pagamentos processados
              </label>
            </div>
          </div>
          <button 
            style={styles.primaryButton}
            onClick={handleConfigurarWebhook}
          >
            💾 Salvar Configurações
          </button>
        </div>

        {/* Backup de Dados */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>💾 Backup de Dados</h3>
            <span style={styles.statusBadge}>Automático</span>
          </div>
          <p style={styles.cardDescription}>
            Proteja seus dados com backups regulares e exportações.
          </p>
          <div style={styles.backupInfo}>
            <div style={styles.backupItem}>
              <strong>Último Backup:</strong>
              <span>Hoje, 08:30</span>
            </div>
            <div style={styles.backupItem}>
              <strong>Próximo Backup:</strong>
              <span>Amanhã, 08:30</span>
            </div>
            <div style={styles.backupItem}>
              <strong>Tamanho:</strong>
              <span>45.2 MB</span>
            </div>
          </div>
          <div style={styles.backupOptions}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="backupAutomatico"
                checked={configuracoes.backupAutomatico}
                onChange={handleConfigChange}
              />
              Backup automático diário
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="notificacoesEmail"
                checked={configuracoes.notificacoesEmail}
                onChange={handleConfigChange}
              />
              Notificar por e-mail
            </label>
          </div>
          <div style={styles.buttonGroup}>
            <button 
              style={styles.primaryButton}
              onClick={handleExportarBackup}
            >
              📥 Exportar Backup Agora
            </button>
            <button style={styles.secondaryButton}>
              ⏰ Agendar Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  },
  title: {
    color: "#2c5aa0",
    fontSize: "2rem",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    fontSize: "1.1rem",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "1.3rem",
    color: "#495057",
    margin: 0,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  cardDescription: {
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  // ERP Section
  erpOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  erpOption: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
  },
  erpStatus: {
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  // API Key Section
  apiKeySection: {
    marginBottom: "20px",
  },
  apiKeyDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "5px",
  },
  apiKeyText: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: "10px 15px",
    borderRadius: "6px",
    border: "1px solid #e9ecef",
    fontSize: "0.9rem",
    fontFamily: "monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  copyButton: {
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  // Webhooks Section
  webhookEvents: {
    marginBottom: "20px",
  },
  sectionSubtitle: {
    fontSize: "1rem",
    color: "#495057",
    marginBottom: "10px",
  },
  eventList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  // Backup Section
  backupInfo: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  backupItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
    fontSize: "0.9rem",
  },
  backupOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  // Common Styles
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
  },
  helperText: {
    color: "#666",
    fontSize: "0.8rem",
    marginTop: "5px",
    display: "block",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#2c5aa0",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    flex: 1,
  },
};

// Hover effects
Object.assign(styles, {
  input: {
    ...styles.input,
    ":focus": {
      outline: "none",
      borderColor: "#2c5aa0",
    },
  },
  primaryButton: {
    ...styles.primaryButton,
    ":hover": {
      backgroundColor: "#1e3d6f",
    },
  },
  secondaryButton: {
    ...styles.secondaryButton,
    ":hover": {
      backgroundColor: "#545b62",
    },
  },
  copyButton: {
    ...styles.copyButton,
    ":hover": {
      backgroundColor: "#138496",
    },
  },
});

export default LojistaCadastro;