// src/pages/LojistaDashboard/pages/IntegracaoERP.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlano } from '../../../contexts/PlanoContext';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../supabaseClient';

const IntegracaoERP = () => {
  const navigate = useNavigate();
  const { plano } = usePlano();
  const { userProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [temModuloERP, setTemModuloERP] = useState(false);
  const [integracoes, setIntegracoes] = useState({
    sap: { conectado: false, config: null },
    totvs: { conectado: false, config: null },
    bling: { conectado: false, config: null },
    omie: { conectado: false, config: null },
  });

  useEffect(() => {
    verificarAcessoERP();
  }, []);

  const verificarAcessoERP = async () => {
    try {
      setLoading(true);

      // Se for Básico, verificar se tem o módulo ERP contratado
      if (plano === 'Básico' || plano === 'basic') {
        const { data } = await supabase
          .from('assinaturas_adicionais')
          .select('*')
          .eq('loja_id', userProfile?.id)
          .eq('tipo', 'erp')
          .eq('status', 'ativa')
          .single();

        setTemModuloERP(!!data);
      } else {
        // Pro e Enterprise sempre têm acesso
        setTemModuloERP(true);
      }

      // Buscar integrações existentes
      // TODO: Implementar busca real das integrações
      
    } catch (error) {
      console.error('Erro ao verificar acesso ERP:', error);
    } finally {
      setLoading(false);
    }
  };

  const conectarERP = (tipo) => {
    // TODO: Implementar lógica de conexão
    alert(`Conectar ${tipo.toUpperCase()}`);
  };

  const desconectarERP = (tipo) => {
    // TODO: Implementar lógica de desconexão
    alert(`Desconectar ${tipo.toUpperCase()}`);
  };

  const configurarERP = (tipo) => {
    // TODO: Abrir modal de configuração
    alert(`Configurar ${tipo.toUpperCase()}`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // 🔴 BLOQUEIO PARA BÁSICO SEM MÓDULO ERP
  const planoBasicoSemERP = (plano === 'Básico' || plano === 'basic') && !temModuloERP;

  if (planoBasicoSemERP) {
    return (
      <div style={styles.container}>
        <div style={styles.bloqueioCard}>
          <div style={styles.lockIcon}>🔒</div>
          <h2 style={styles.bloqueioTitle}>Integração ERP</h2>
          <p style={styles.bloqueioDescription}>
            A integração com sistemas ERP não está disponível no <strong>Plano Básico</strong>.
          </p>
          
          <div style={styles.beneficiosBox}>
            <h3 style={styles.beneficiosTitle}>Contrate o Módulo ERP e tenha acesso a:</h3>
            <ul style={styles.beneficiosList}>
              <li>✅ Sincronização automática de produtos</li>
              <li>✅ Atualização de estoque em tempo real</li>
              <li>✅ Integração com SAP, TOTVS, BLING e OMIE</li>
              <li>✅ Gestão completa de pedidos e vendas</li>
              <li>✅ Relatórios integrados</li>
            </ul>
          </div>

          <div style={styles.precoBox}>
            <span style={styles.precoLabel}>Apenas</span>
            <span style={styles.precoValor}>R$ 59,90</span>
            <span style={styles.precoLabel}>/mês</span>
          </div>

          <button 
            onClick={() => navigate('/lojista/dashboard/pagamentos')}
            style={styles.contratarButton}
          >
            💼 Contratar Módulo ERP
          </button>

          <p style={styles.ouText}>
            Ou faça upgrade para <strong>Plano Pro</strong> ou <strong>Enterprise</strong>
          </p>
          <button 
            onClick={() => navigate('/lojista/dashboard/pagamentos')}
            style={styles.upgradeButton}
          >
            🚀 Ver Planos
          </button>
        </div>
      </div>
    );
  }

  // ✅ MOSTRAR INTEGRAÇÕES
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔗 Integração ERP</h1>
        <p style={styles.subtitle}>
          Sincronize automaticamente seus produtos, estoque e vendas com seu sistema de gestão.
        </p>
      </div>

      <div style={styles.erpsGrid}>
        {/* SAP */}
        <ERPCard
          nome="SAP"
          icon="🔷"
          conectado={integracoes.sap.conectado}
          onConectar={() => conectarERP('sap')}
          onDesconectar={() => desconectarERP('sap')}
          onConfigurar={() => configurarERP('sap')}
        />

        {/* TOTVS */}
        <ERPCard
          nome="TOTVS"
          icon="🟢"
          conectado={integracoes.totvs.conectado}
          onConectar={() => conectarERP('totvs')}
          onDesconectar={() => desconectarERP('totvs')}
          onConfigurar={() => configurarERP('totvs')}
        />

        {/* BLING */}
        <ERPCard
          nome="BLING"
          icon="🟡"
          conectado={integracoes.bling.conectado}
          onConectar={() => conectarERP('bling')}
          onDesconectar={() => desconectarERP('bling')}
          onConfigurar={() => configurarERP('bling')}
        />

        {/* OMIE */}
        <ERPCard
          nome="OMIE"
          icon="🔵"
          conectado={integracoes.omie.conectado}
          onConectar={() => conectarERP('omie')}
          onDesconectar={() => desconectarERP('omie')}
          onConfigurar={() => configurarERP('omie')}
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

const ERPCard = ({ nome, icon, conectado, onConectar, onDesconectar, onConfigurar }) => (
  <div style={styles.erpCard}>
    <div style={styles.erpIcon}>{icon}</div>
    <h3 style={styles.erpNome}>{nome}</h3>
    
    {conectado ? (
      <>
        <div style={styles.statusConectado}>
          ✅ Conectado
        </div>
        <div style={styles.erpActions}>
          <button onClick={onConfigurar} style={styles.configurarButton}>
            ⚙️ Configurar
          </button>
          <button onClick={onDesconectar} style={styles.desconectarButton}>
            🔌 Desconectar
          </button>
        </div>
      </>
    ) : (
      <>
        <div style={styles.statusDisponivel}>
          ⚠️ Disponível
        </div>
        <button onClick={onConectar} style={styles.conectarButton}>
          ➕ Conectar
        </button>
      </>
    )}
  </div>
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
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  bloqueioCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '50px 40px',
    maxWidth: '700px',
    margin: '0 auto',
    textAlign: 'center',
  },
  lockIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  bloqueioTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  bloqueioDescription: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  beneficiosBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '30px',
    textAlign: 'left',
  },
  beneficiosTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: '15px',
  },
  beneficiosList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  precoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '25px',
  },
  precoLabel: {
    fontSize: '1.2rem',
    color: '#666',
  },
  precoValor: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#28a745',
  },
  contratarButton: {
    width: '100%',
    padding: '18px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  ouText: {
    fontSize: '0.95rem',
    color: '#999',
    marginBottom: '15px',
  },
  upgradeButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  erpsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
  },
  erpCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    padding: '30px',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  erpIcon: {
    fontSize: '4rem',
    marginBottom: '15px',
  },
  erpNome: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  statusConectado: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '20px',
  },
  statusDisponivel: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '20px',
  },
  erpActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  configurarButton: {
    padding: '12px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  desconectarButton: {
    padding: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  conectarButton: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default IntegracaoERP;