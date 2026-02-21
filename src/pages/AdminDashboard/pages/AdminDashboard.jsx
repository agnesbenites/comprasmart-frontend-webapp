// src/pages/AdminDashboard/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { FaStore, FaUsers, FaShoppingCart, FaDollarSign, FaExclamationTriangle, FaCheckCircle, FaBan, FaBell } from 'react-icons/fa';

const ADMIN_PRIMARY = "#dc3545";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    lojasAtivas: 0,
    lojasPendentes: 0,
    consultoresAtivos: 0,
    consultoresPendentes: 0,
    pedidosHoje: 0,
    receitaMes: 0,
    usuariosOnline: 0,
  });

  const [alertas, setAlertas] = useState([]);
  const [ultimasPendencias, setUltimasPendencias] = useState([]);
  const [usuariosOnline, setUsuariosOnline] = useState([]);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    try {
      await Promise.all([
        carregarMetricas(),
        carregarAlertas(),
        carregarPendencias(),
        carregarUsuariosOnline(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarMetricas = async () => {
    try {
      // Lojas
      const { data: lojas } = await supabase
        .from('lojas_corrigida')
        .select('status');
      
      const lojasAtivas = lojas?.filter(l => l.status === 'ativo').length || 0;
      const lojasPendentes = lojas?.filter(l => l.status === 'pendente').length || 0;

      // Consultores
      const { data: consultores } = await supabase
        .from('consultor_perfil')
        .select('status');
      
      const consultoresAtivos = consultores?.filter(c => c.status === 'ativo').length || 0;
      const consultoresPendentes = consultores?.filter(c => c.status === 'pendente').length || 0;

      // Pedidos hoje
      const hoje = new Date().toISOString().split('T')[0];
      const { data: pedidos } = await supabase
        .from('pedidos')
        .select('id')
        .gte('created_at', `${hoje}T00:00:00`);
      
      const pedidosHoje = pedidos?.length || 0;

      // Receita do mês
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: vendas } = await supabase
        .from('vendas')
        .select('valor_total')
        .eq('status', 'concluida')
        .gte('created_at', inicioMes);
      
      const receitaMes = vendas?.reduce((acc, v) => acc + (parseFloat(v.valor_total) || 0), 0) || 0;

      setMetricas({
        lojasAtivas,
        lojasPendentes,
        consultoresAtivos,
        consultoresPendentes,
        pedidosHoje,
        receitaMes,
        usuariosOnline: Math.floor(Math.random() * 15) + 5, // Mock - implementar real depois
      });

    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
  };

  const carregarAlertas = async () => {
    try {
      const alertasArray = [];

      // Pagamentos atrasados (mock - implementar com Stripe)
      alertasArray.push({
        id: 1,
        tipo: 'pagamento',
        gravidade: 'alta',
        titulo: 'Pagamentos Atrasados',
        descricao: '3 lojas com pagamento vencido',
        acao: () => navigate('/admin/financeiro'),
      });

      // Cadastros pendentes
      if (metricas.lojasPendentes > 0) {
        alertasArray.push({
          id: 2,
          tipo: 'aprovacao',
          gravidade: 'media',
          titulo: 'Cadastros Pendentes',
          descricao: `${metricas.lojasPendentes} lojas aguardando aprovação`,
          acao: () => navigate('/admin/lojistas'),
        });
      }

      if (metricas.consultoresPendentes > 0) {
        alertasArray.push({
          id: 3,
          tipo: 'aprovacao',
          gravidade: 'media',
          titulo: 'Consultores Pendentes',
          descricao: `${metricas.consultoresPendentes} consultores aguardando aprovação`,
          acao: () => navigate('/admin/consultores'),
        });
      }

      setAlertas(alertasArray);

    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  };

  const carregarPendencias = async () => {
    try {
      // Buscar lojas e consultores pendentes
      const { data: lojas } = await supabase
        .from('lojas_corrigida')
        .select('id, nome_fantasia, created_at')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: consultores } = await supabase
        .from('consultor_perfil')
        .select('id, nome_completo, created_at')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false })
        .limit(5);

      const pendencias = [
        ...(lojas || []).map(l => ({ ...l, tipo: 'loja' })),
        ...(consultores || []).map(c => ({ ...c, tipo: 'consultor', nome_fantasia: c.nome_completo })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

      setUltimasPendencias(pendencias);

    } catch (error) {
      console.error('Erro ao carregar pendências:', error);
    }
  };

  const carregarUsuariosOnline = async () => {
    try {
      // Mock - implementar com tracking real depois
      setUsuariosOnline([
        { id: 1, nome: 'Loja Eletrônicos SP', tipo: 'lojista', ultimaAtividade: new Date() },
        { id: 2, nome: 'João Consultor', tipo: 'consultor', ultimaAtividade: new Date() },
        { id: 3, nome: 'Magazine Tech', tipo: 'lojista', ultimaAtividade: new Date() },
      ]);
    } catch (error) {
      console.error('Erro ao carregar usuários online:', error);
    }
  };

  const handleAprovar = async (id, tipo) => {
    if (!confirm(`Aprovar ${tipo}?`)) return;

    try {
      const tabela = tipo === 'loja' ? 'lojas_corrigida' : 'consultor_perfil';
      
      const { error } = await supabase
        .from(tabela)
        .update({ status: 'ativo' })
        .eq('id', id);

      if (error) throw error;

      alert(' Aprovado com sucesso!');
      carregarDados();

    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert(' Erro ao aprovar');
    }
  };

  const handleReprovar = async (id, tipo) => {
    const motivo = prompt('Motivo da reprovação:');
    if (!motivo) return;

    try {
      const tabela = tipo === 'loja' ? 'lojas_corrigida' : 'consultor_perfil';
      
      const { error } = await supabase
        .from(tabela)
        .update({ status: 'reprovado', motivo_reprovacao: motivo })
        .eq('id', id);

      if (error) throw error;

      alert(' Reprovado!');
      carregarDados();

    } catch (error) {
      console.error('Erro ao reprovar:', error);
      alert(' Erro ao reprovar');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔧 Painel Administrativo</h1>
          <p style={styles.subtitle}>Visão geral da plataforma Kaslee</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => navigate('/admin/manutencao')} style={styles.manutencaoButton}>
            🛠️ Manutenção
          </button>
          <button onClick={carregarDados} style={styles.refreshButton}>
             Atualizar
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div style={styles.metricsGrid}>
        <MetricCard
          icon={<FaStore />}
          label="Lojas Ativas"
          value={metricas.lojasAtivas}
          subtitle={`${metricas.lojasPendentes} pendentes`}
          color="#bb25a6"
          onClick={() => navigate('/admin/lojistas')}
        />
        <MetricCard
          icon={<FaUsers />}
          label="Consultores Ativos"
          value={metricas.consultoresAtivos}
          subtitle={`${metricas.consultoresPendentes} pendentes`}
          color="#2f0d51"
          onClick={() => navigate('/admin/consultores')}
        />
        <MetricCard
          icon={<FaShoppingCart />}
          label="Pedidos Hoje"
          value={metricas.pedidosHoje}
          subtitle="↑ 12% vs ontem"
          color="#bb25a6"
        />
        <MetricCard
          icon={<FaDollarSign />}
          label="Receita do Mês"
          value={`R$ ${metricas.receitaMes.toLocaleString('pt-BR')}`}
          subtitle="↑ 23% vs mês anterior"
          color="#ffc107"
        />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>⚠️ Alertas e Problemas</h3>
          <div style={styles.alertsGrid}>
            {alertas.map(alerta => (
              <AlertCard key={alerta.id} alerta={alerta} />
            ))}
          </div>
        </div>
      )}

      {/* Grid de Conteúdo */}
      <div style={styles.contentGrid}>
        {/* Usuários Online */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> Usuários Online ({usuariosOnline.length})</h3>
          <div style={styles.onlineList}>
            {usuariosOnline.map(usuario => (
              <div key={usuario.id} style={styles.onlineItem}>
                <div style={styles.onlineDot}></div>
                <div style={styles.onlineInfo}>
                  <p style={styles.onlineNome}>{usuario.nome}</p>
                  <p style={styles.onlineTipo}>{usuario.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Pendências */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> Aprovações Pendentes</h3>
          <div style={styles.pendenciasList}>
            {ultimasPendencias.length === 0 ? (
              <p style={styles.emptyText}> Nenhuma pendência!</p>
            ) : (
              ultimasPendencias.map(item => (
                <div key={`${item.tipo}-${item.id}`} style={styles.pendenciaItem}>
                  <div style={styles.pendenciaInfo}>
                    <p style={styles.pendenciaNome}>{item.nome_fantasia}</p>
                    <p style={styles.pendenciaTipo}>
                      {item.tipo === 'loja' ? ' Loja' : ' Consultor'}
                    </p>
                  </div>
                  <div style={styles.pendenciaActions}>
                    <button
                      onClick={() => handleAprovar(item.id, item.tipo)}
                      style={styles.aprovarButton}
                      title="Aprovar"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleReprovar(item.id, item.tipo)}
                      style={styles.reprovarButton}
                      title="Reprovar"
                    >
                      <FaBan />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚡ Ações Rápidas</h3>
        <div style={styles.actionsGrid}>
          <ActionButton
            icon=""
            label="Aprovar Cadastros"
            onClick={() => navigate('/admin/aprovacoes')}
          />
          <ActionButton
            icon="📧"
            label="Enviar Notificação"
            onClick={() => navigate('/admin/notificacoes')}
          />
          <ActionButton
            icon=""
            label="Relatórios"
            onClick={() => navigate('/admin/relatorios')}
          />
          <ActionButton
            icon="⚙️"
            label="Configurações"
            onClick={() => navigate('/admin/configuracoes')}
          />
        </div>
      </div>

      {/* CSS Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

// Componentes Auxiliares
const MetricCard = ({ icon, label, value, subtitle, color, onClick }) => (
  <div
    style={{
      ...styles.metricCard,
      borderLeft: `4px solid ${color}`,
      cursor: onClick ? 'pointer' : 'default',
    }}
    onClick={onClick}
  >
    <div style={{ ...styles.metricIcon, color }}>{icon}</div>
    <div style={styles.metricContent}>
      <p style={styles.metricLabel}>{label}</p>
      <p style={styles.metricValue}>{value}</p>
      {subtitle && <p style={styles.metricSubtitle}>{subtitle}</p>}
    </div>
  </div>
);

const AlertCard = ({ alerta }) => {
  const gravidadeColors = {
    alta: '#dc3545',
    media: '#ffc107',
    baixa: '#bb25a6',
  };

  return (
    <div
      style={{
        ...styles.alertCard,
        borderLeft: `4px solid ${gravidadeColors[alerta.gravidade]}`,
      }}
      onClick={alerta.acao}
    >
      <FaExclamationTriangle color={gravidadeColors[alerta.gravidade]} size={24} />
      <div style={styles.alertContent}>
        <p style={styles.alertTitulo}>{alerta.titulo}</p>
        <p style={styles.alertDescricao}>{alerta.descricao}</p>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} style={styles.actionButton}>
    <span style={styles.actionIcon}>{icon}</span>
    <span style={styles.actionLabel}>{label}</span>
  </button>
);

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: `4px solid ${ADMIN_PRIMARY}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  manutencaoButton: {
    padding: '10px 20px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: ADMIN_PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.2s',
  },
  metricIcon: {
    fontSize: '2.5rem',
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 5px 0',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 3px 0',
  },
  metricSubtitle: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '15px',
  },
  alertCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  alertContent: {
    flex: 1,
  },
  alertTitulo: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  alertDescricao: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  onlineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  onlineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  onlineDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#bb25a6',
    borderRadius: '50%',
  },
  onlineInfo: {
    flex: 1,
  },
  onlineNome: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 3px 0',
  },
  onlineTipo: {
    fontSize: '0.8rem',
    color: '#666',
    margin: 0,
  },
  pendenciasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pendenciaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  pendenciaInfo: {
    flex: 1,
  },
  pendenciaNome: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 3px 0',
  },
  pendenciaTipo: {
    fontSize: '0.8rem',
    color: '#666',
    margin: 0,
  },
  pendenciaActions: {
    display: 'flex',
    gap: '8px',
  },
  aprovarButton: {
    padding: '8px 12px',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  reprovarButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: '20px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  actionButton: {
    padding: '20px',
    backgroundColor: 'white',
    border: '2px solid #e9ecef',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  actionIcon: {
    fontSize: '2rem',
  },
  actionLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
  },
};

export default AdminDashboard;