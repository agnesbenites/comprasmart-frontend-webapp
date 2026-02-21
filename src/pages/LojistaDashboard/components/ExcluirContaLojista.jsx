// app-frontend/src/pages/LojistaDashboard/components/ExcluirContaLojista.jsx

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ExcluirContaLojista = ({ lojistaId }) => {
  const [etapa, setEtapa] = useState('inicial'); // inicial, confirmacao, agendado
  const [motivo, setMotivo] = useState('');
  const [concordo, setConcordo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exclusaoAgendada, setExclusaoAgendada] = useState(null);

  useEffect(() => {
    verificarExclusaoAgendada();
  }, [lojistaId]);

  const verificarExclusaoAgendada = async () => {
    try {
      const { data, error } = await supabase
        .from('exclusoes_agendadas')
        .select('*')
        .eq('usuario_id', lojistaId)
        .eq('status', 'aguardando')
        .single();

      if (!error && data) {
        setExclusaoAgendada(data);
        setEtapa('agendado');
      }
    } catch (err) {
      console.error('Erro ao verificar exclusão:', err);
    }
  };

  const solicitarExclusao = async () => {
    if (!concordo) {
      alert('Você precisa confirmar que leu e compreendeu as consequências');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/delete-account/lojista/solicitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lojista_id: lojistaId,
          motivo: motivo || 'Não informado'
        })
      });

      const result = await response.json();

      if (result.success) {
        setExclusaoAgendada({
          data_exclusao_prevista: result.data_exclusao,
          agendamento_id: result.agendamento_id
        });
        setEtapa('agendado');
        alert(' Exclusão agendada com sucesso! Você receberá um email de confirmação.');
      } else {
        alert(' Erro ao agendar exclusão: ' + result.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const cancelarExclusao = async () => {
    if (!confirm('Tem certeza que deseja CANCELAR a exclusão da sua conta?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/delete-account/lojista/cancelar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lojista_id: lojistaId
        })
      });

      const result = await response.json();

      if (result.success) {
        setExclusaoAgendada(null);
        setEtapa('inicial');
        alert(' Exclusão cancelada! Sua conta foi reativada.');
        window.location.reload();
      } else {
        alert(' Erro ao cancelar exclusão: ' + result.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(' Erro ao processar cancelamento');
    } finally {
      setLoading(false);
    }
  };

  // ========== ETAPA: INICIAL ==========
  if (etapa === 'inicial') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>🗑️ Excluir Conta</h2>
          <p style={styles.subtitle}>Remova permanentemente sua conta e todos os dados associados</p>
        </div>

        <div style={styles.warningBox}>
          <h3 style={styles.warningTitle}>⚠️ Atenção: Esta ação é irreversível!</h3>
          <p style={styles.warningText}>
            Ao excluir sua conta, você perderá acesso a:
          </p>
          <ul style={styles.warningList}>
            <li>Todos os seus produtos cadastrados</li>
            <li>Histórico de vendas e comissões</li>
            <li>Dados de clientes e consultores</li>
            <li>Configurações e integrações</li>
            <li>Relatórios e estatísticas</li>
          </ul>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📅 Período de Retenção: 30 dias</h3>
          <p style={styles.infoText}>
            Você terá <strong>30 dias</strong> para:
          </p>
          <ul style={styles.infoList}>
            <li> Fazer backup dos seus dados</li>
            <li> Cancelar a exclusão se mudar de ideia</li>
            <li> Exportar relatórios importantes</li>
          </ul>
          <p style={styles.infoText}>
            Após 30 dias, <strong>todos os dados serão permanentemente excluídos</strong>.
          </p>
        </div>

        <button 
          style={styles.dangerButton}
          onClick={() => setEtapa('confirmacao')}
        >
          Continuar com a Exclusão
        </button>
      </div>
    );
  }

  // ========== ETAPA: CONFIRMAÇÃO ==========
  if (etapa === 'confirmacao') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>✋ Confirme a Exclusão</h2>
          <p style={styles.subtitle}>Precisamos da sua confirmação final</p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Por que você está excluindo sua conta? (Opcional)</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Seu feedback nos ajuda a melhorar..."
            style={styles.textarea}
            rows={4}
          />
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="concordo"
            checked={concordo}
            onChange={(e) => setConcordo(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="concordo" style={styles.checkboxLabel}>
            Eu li e compreendo que:
            <ul style={styles.checkboxList}>
              <li>Minha conta será <strong>bloqueada imediatamente</strong></li>
              <li>Terei <strong>30 dias</strong> para fazer backup dos dados</li>
              <li>Após 30 dias, <strong>todos os dados serão permanentemente excluídos</strong></li>
              <li>Esta ação é <strong>irreversível</strong> após o período de 30 dias</li>
            </ul>
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            style={styles.cancelButton}
            onClick={() => setEtapa('inicial')}
          >
            ← Voltar
          </button>
          <button 
            style={{
              ...styles.dangerButton,
              opacity: concordo && !loading ? 1 : 0.5,
              cursor: concordo && !loading ? 'pointer' : 'not-allowed'
            }}
            onClick={solicitarExclusao}
            disabled={!concordo || loading}
          >
            {loading ? 'Processando...' : '🗑️ Confirmar Exclusão'}
          </button>
        </div>
      </div>
    );
  }

  // ========== ETAPA: AGENDADO ==========
  if (etapa === 'agendado' && exclusaoAgendada) {
    const diasRestantes = Math.ceil(
      (new Date(exclusaoAgendada.data_exclusao_prevista) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>⏰ Exclusão Agendada</h2>
          <p style={styles.subtitle}>Sua conta será excluída em breve</p>
        </div>

        <div style={styles.scheduledBox}>
          <div style={styles.scheduledIcon}>🗑️</div>
          <h3 style={styles.scheduledTitle}>Exclusão Programada</h3>
          <p style={styles.scheduledDate}>
            <strong>Data prevista:</strong> {new Date(exclusaoAgendada.data_exclusao_prevista).toLocaleDateString('pt-BR')}
          </p>
          <p style={styles.scheduledDays}>
            Faltam <strong>{diasRestantes} dia(s)</strong>
          </p>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📌 O que você pode fazer agora:</h3>
          <ul style={styles.infoList}>
            <li> Fazer backup dos seus dados</li>
            <li> Exportar relatórios importantes</li>
            <li> Salvar informações de clientes (se necessário)</li>
          </ul>
        </div>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            ⚠️ Seu acesso está <strong>bloqueado</strong>. Você não pode fazer login até cancelar a exclusão.
          </p>
        </div>

        <button 
          style={styles.primaryButton}
          onClick={cancelarExclusao}
          disabled={loading}
        >
          {loading ? 'Processando...' : ' Cancelar Exclusão e Reativar Conta'}
        </button>
      </div>
    );
  }

  return null;
};

// ========== ESTILOS ==========
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
  },
  warningTitle: {
    color: '#856404',
    fontSize: '1.3rem',
    marginBottom: '15px',
  },
  warningText: {
    color: '#856404',
    fontSize: '1rem',
    marginBottom: '10px',
  },
  warningList: {
    color: '#856404',
    fontSize: '1rem',
    marginLeft: '20px',
    lineHeight: '1.8',
  },
  infoBox: {
    backgroundColor: '#d1ecf1',
    border: '2px solid #bb25a6',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
  },
  infoTitle: {
    color: '#0c5460',
    fontSize: '1.2rem',
    marginBottom: '15px',
  },
  infoText: {
    color: '#0c5460',
    fontSize: '1rem',
    marginBottom: '10px',
  },
  infoList: {
    color: '#0c5460',
    fontSize: '1rem',
    marginLeft: '20px',
    lineHeight: '1.8',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginTop: '3px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '0.95rem',
    color: '#333',
    lineHeight: '1.6',
  },
  checkboxList: {
    marginTop: '10px',
    marginLeft: '20px',
    lineHeight: '1.8',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'space-between',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  primaryButton: {
    backgroundColor: '#2f0d51',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
  },
  scheduledBox: {
    backgroundColor: '#fff',
    border: '3px solid #dc3545',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    marginBottom: '25px',
  },
  scheduledIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  scheduledTitle: {
    fontSize: '1.5rem',
    color: '#dc3545',
    marginBottom: '15px',
  },
  scheduledDate: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '10px',
  },
  scheduledDays: {
    fontSize: '1.5rem',
    color: '#dc3545',
    fontWeight: '700',
  },
};

export default ExcluirContaLojista;