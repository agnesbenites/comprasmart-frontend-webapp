import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useEmailBoasVindas } from "../../../services/emailService";

// Inicializar Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LojistaCadastro = () => {
  const [configuracoes, setConfiguracoes] = useState({
    webhookUrl: "",
    apiKey: "sk_live_**********************",
    backupAutomatico: true,
    notificacoesEmail: true,
    periodoPagamentoComissao: "mensal"
  });
  const [loading, setLoading] = useState(false);
  const [lojistaId, setLojistaId] = useState(null);
  const [lojistaInfo, setLojistaInfo] = useState(null); // ✅ NOVO
  
  const { enviar: enviarEmailBoasVindas } = useEmailBoasVindas(); // ✅ NOVO

  // Buscar ID do lojista logado
  useEffect(() => {
    const fetchLojistaId = async () => {
      try {
        // Pegar o usuário logado do Auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // ✅ ATUALIZADO - Buscar mais informações
          const { data, error } = await supabase
            .from('usuarios')
            .select('id, nome, email, periodo_pagamento_comissao')
            .eq('email', user.email)
            .eq('tipo', 'lojista')
            .single();

          if (error) {
            console.warn('Erro ao buscar lojista:', error);
            return;
          }

          setLojistaId(data.id);
          
          // ✅ NOVO - Salvar informações completas
          setLojistaInfo({
            id: data.id,
            nome: data.nome || user.email.split('@')[0],
            email: data.email,
            plano: 'basic', // Pode buscar de lojas_corrigida se necessário
          });
          
          // Carregar período salvo anteriormente
          if (data.periodo_pagamento_comissao) {
            setConfiguracoes(prev => ({
              ...prev,
              periodoPagamentoComissao: data.periodo_pagamento_comissao
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar lojista:', error);
      }
    };

    fetchLojistaId();
  }, []);

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguracoes({
      ...configuracoes,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSalvarPeriodoPagamento = async () => {
    if (!lojistaId) {
      alert('Erro: Lojista não identificado');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          periodo_pagamento_comissao: configuracoes.periodoPagamentoComissao,
          updated_at: new Date().toISOString()
        })
        .eq('id', lojistaId);

      if (error) throw error;

      alert(`✅ Período de pagamento atualizado com sucesso!\n\n${
        configuracoes.periodoPagamentoComissao === 'quinzenal' 
          ? '📅 Quinzenal: Pagamentos nos dias 15 e último dia útil de cada mês' 
          : '📅 Mensal: Pagamento no último dia útil de cada mês'
      }`);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar período de pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NOVA FUNÇÃO - Enviar e-mail de boas-vindas
  const handleEnviarEmailBoasVindas = async () => {
    if (!lojistaInfo) {
      alert('❌ Informações do lojista não carregadas');
      return;
    }

    setLoading(true);

    try {
      const resultado = await enviarEmailBoasVindas({
        nome: lojistaInfo.nome || 'Lojista',
        email: lojistaInfo.email,
        plano: lojistaInfo.plano || 'basic',
        nomeEmpresa: lojistaInfo.nome || 'Sua Empresa',
      });

      if (resultado.success) {
        alert('✅ E-mail de boas-vindas enviado com sucesso!\n\nVerifique sua caixa de entrada.');
      } else {
        alert(`⚠️ E-mail registrado mas ainda não foi enviado.\n\nMotivo: ${resultado.message}\n\nSerá enviado em breve automaticamente.`);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert('❌ Erro ao enviar e-mail: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIntegracaoERP = () => {
    alert("Redirecionando para configuracao de ERP...");
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
      alert("Por favor, insira uma URL de webhook valida");
    }
  };

  const handleExportarBackup = () => {
    alert("Iniciando exportacao de backup...");
    setTimeout(() => {
      alert("Backup exportado com sucesso!");
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Configuracoes Avancadas</h1>
      <p style={styles.subtitle}>Gerencie integracoes e configuracoes tecnicas da sua loja</p>

      {/* ✅ NOVO - Informações do Lojista */}
      {lojistaInfo && (
        <div style={styles.infoBar}>
          <span>👤 <strong>{lojistaInfo.nome}</strong></span>
          <span>📧 {lojistaInfo.email}</span>
          <span style={{
            backgroundColor: '#bb25a6',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            {lojistaInfo.plano?.toUpperCase() || 'BASIC'}
          </span>
        </div>
      )}

      <div style={styles.grid}>
        {/* ========== PERÍODO DE PAGAMENTO ========== */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>💰 Período de Pagamento de Comissões</h3>
            <span style={styles.statusBadge}>Configurável</span>
          </div>
          <p style={styles.cardDescription}>
            Define quando os consultores receberão suas comissões pelas vendas realizadas.
          </p>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Escolha o período:</label>
            <select
              name="periodoPagamentoComissao"
              value={configuracoes.periodoPagamentoComissao}
              onChange={handleConfigChange}
              style={styles.select}
              disabled={loading}
            >
              <option value="quinzenal">Quinzenal (dias 15 e último dia útil)</option>
              <option value="mensal">Mensal (último dia útil do mês)</option>
            </select>
            <small style={styles.helperText}>
              {configuracoes.periodoPagamentoComissao === 'quinzenal' 
                ? '✅ Os consultores receberão nos dias 15 e no último dia útil de cada mês'
                : '✅ Os consultores receberão no último dia útil de cada mês'}
            </small>
          </div>

          <div style={styles.infoBox}>
            <strong>📌 Como funciona:</strong>
            <ul style={styles.infoList}>
              <li><strong>Quinzenal:</strong> Pagamentos em 2 datas (15 e último dia útil)</li>
              <li><strong>Mensal:</strong> Pagamento único no final do mês</li>
              <li>Comissões são calculadas automaticamente pelo sistema</li>
              <li>Transferências processadas via Stripe Connect</li>
            </ul>
          </div>

          <button 
            style={{
              ...styles.primaryButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={handleSalvarPeriodoPagamento}
            disabled={loading}
          >
            {loading ? '⏳ Salvando...' : '💾 Salvar Período de Pagamento'}
          </button>
        </div>

        {/* ✅ NOVO CARD - E-mail de Boas-Vindas */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📧 Manual de Uso</h3>
            <span style={{...styles.statusBadge, backgroundColor: '#fef3c7', color: '#92400e'}}>
              Por E-mail
            </span>
          </div>
          <p style={styles.cardDescription}>
            Receba o guia completo de uso da plataforma personalizado para o seu plano.
          </p>

          <div style={styles.infoBox}>
            <strong>📨 O que você receberá:</strong>
            <ul style={styles.infoList}>
              <li>Manual personalizado para o Plano <strong>{lojistaInfo?.plano?.toUpperCase() || 'BASIC'}</strong></li>
              <li>3 passos essenciais para começar</li>
              <li>Dicas de ROI e liquidez de estoque</li>
              <li>Links diretos para funcionalidades</li>
              <li>Suporte prioritário por e-mail</li>
            </ul>
          </div>

          <button 
            style={{
              ...styles.primaryButton,
              backgroundColor: '#10b981',
              opacity: loading || !lojistaInfo ? 0.6 : 1,
              cursor: loading || !lojistaInfo ? 'not-allowed' : 'pointer'
            }}
            onClick={handleEnviarEmailBoasVindas}
            disabled={loading || !lojistaInfo}
          >
            {loading ? '📤 Enviando...' : '📧 Receber Manual por E-mail'}
          </button>
        </div>

        {/* Integracao com ERP */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🔗 Integracao com ERP</h3>
            <span style={styles.statusBadge}>Disponivel</span>
          </div>
          <p style={styles.cardDescription}>
            Sincronize automaticamente seus produtos, estoque e vendas com seu sistema de gestao.
          </p>
          <div style={styles.erpOptions}>
            <div style={styles.erpOption}>
              <strong>SAP</strong>
              <span style={styles.erpStatus}>✅ Conectado</span>
            </div>
            <div style={styles.erpOption}>
              <strong>TOTVS</strong>
              <span style={styles.erpStatus}>⚠️ Disponivel</span>
            </div>
            <div style={styles.erpOption}>
              <strong>BLING</strong>
              <span style={styles.erpStatus}>➕ Conectar</span>
            </div>
          </div>
          <button 
            style={styles.primaryButton}
            onClick={handleIntegracaoERP}
          >
            🔧 Configurar Integracao
          </button>
        </div>

        {/* API Keys */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🔑 API Keys</h3>
            <span style={styles.statusBadge}>Ativa</span>
          </div>
          <p style={styles.cardDescription}>
            Sua chave de API para integracoes personalizadas e automacoes.
          </p>
          <div style={styles.apiKeySection}>
            <label style={styles.label}>Chave de API:</label>
            <div style={styles.apiKeyDisplay}>
              <code style={styles.apiKeyText}>{configuracoes.apiKey}</code>
              <button 
                style={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(configuracoes.apiKey);
                  alert("API Key copiada!");
                }}
              >
                📋 Copiar
              </button>
            </div>
            <small style={styles.helperText}>
              ⚠️ Mantenha esta chave em segredo.
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
              📊 Ver Logs
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🔔 Webhooks</h3>
            <span style={styles.statusBadge}>Configuravel</span>
          </div>
          <p style={styles.cardDescription}>
            Receba notificacoes em tempo real sobre eventos da sua loja.
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
          </div>
          <button 
            style={styles.primaryButton}
            onClick={handleConfigurarWebhook}
          >
            💾 Salvar
          </button>
        </div>

        {/* Backup */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🗄️ Backup</h3>
            <span style={styles.statusBadge}>Automatico</span>
          </div>
          <p style={styles.cardDescription}>
            Exporte todos os dados da sua loja para backup externo.
          </p>
          <button 
            style={styles.primaryButton}
            onClick={handleExportarBackup}
          >
            📥 Exportar Backup
          </button>
        </div>
      </div>
    </div>
  );
};

// Estilos
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
    marginBottom: "20px",
  },
  infoBar: { // ✅ NOVO
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '15px 25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    fontSize: '0.95rem',
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
  select: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "white",
    cursor: "pointer",
  },
  infoBox: {
    backgroundColor: "#f0f7ff",
    border: "1px solid #b3d9ff",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
  },
  infoList: {
    margin: "10px 0 0 20px",
    padding: 0,
    fontSize: "0.9rem",
    lineHeight: "1.8",
  },
  erpOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  erpOption: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  erpStatus: {
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  apiKeySection: {
    marginBottom: "20px",
  },
  apiKeyDisplay: {
    display: "flex",
    gap: "10px",
    marginBottom: "5px",
  },
  apiKeyText: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: "10px 15px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontFamily: "monospace",
  },
  copyButton: {
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  helperText: {
    color: "#666",
    fontSize: "0.8rem",
    marginTop: "5px",
    display: "block",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
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
    width: "100%",
    transition: 'all 0.2s',
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    cursor: "pointer",
    flex: 1,
  },
};

export default LojistaCadastro;