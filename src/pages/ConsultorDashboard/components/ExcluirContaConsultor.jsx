// app-frontend/src/pages/ConsultorDashboard/components/ExcluirContaConsultor.jsx

import React, { useState } from 'react';

const ExcluirContaConsultor = ({ consultorId }) => {
  const [etapa, setEtapa] = useState('inicial'); // inicial, confirmacao, senha, concluido
  const [motivo, setMotivo] = useState('');
  const [senha, setSenha] = useState('');
  const [concordo, setConcordo] = useState(false);
  const [loading, setLoading] = useState(false);

  const solicitarExclusao = async () => {
    if (!senha) {
      alert('Por favor, digite sua senha para confirmar');
      return;
    }

    if (!concordo) {
      alert('Você precisa confirmar que leu e compreendeu as consequências');
      return;
    }

    if (!confirm('⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nSua conta será EXCLUÍDA IMEDIATAMENTE e:\n- Você NÃO poderá recuperá-la\n- Seu CPF será BLOQUEADO\n- Você NÃO poderá criar nova conta\n\nTem certeza absoluta?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/delete-account/consultor/excluir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultor_id: consultorId,
          senha: senha,
          motivo: motivo || 'Não informado'
        })
      });

      const result = await response.json();

      if (result.success) {
        setEtapa('concluido');
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
      } else {
        alert('❌ Erro ao excluir conta: ' + result.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao processar exclusão');
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

        <div style={styles.dangerBox}>
          <h3 style={styles.dangerTitle}>🚨 ATENÇÃO: EXCLUSÃO IMEDIATA E IRREVERSÍVEL!</h3>
          <p style={styles.dangerText}>
            Diferente dos lojistas, consultores <strong>NÃO têm período de retenção</strong>.
          </p>
          <p style={styles.dangerTextBold}>
            ⚡ Sua conta será <strong>EXCLUÍDA IMEDIATAMENTE</strong> e <strong>NÃO PODERÁ SER RECUPERADA</strong>!
          </p>
        </div>

        <div style={styles.warningBox}>
          <h3 style={styles.warningTitle}>⚠️ O que será perdido:</h3>
          <ul style={styles.warningList}>
            <li>❌ Histórico de atendimentos e vendas</li>
            <li>❌ Avaliações recebidas de clientes</li>
            <li>❌ Comissões pendentes (se houver)</li>
            <li>❌ Estatísticas e relatórios</li>
            <li>❌ Configurações de perfil</li>
            <li>❌ Acesso à plataforma</li>
          </ul>
        </div>

        <div style={styles.cpfWarningBox}>
          <h3 style={styles.cpfWarningTitle}>🚫 SEU CPF SERÁ BLOQUEADO!</h3>
          <p style={styles.cpfWarningText}>
            Após a exclusão, <strong>seu CPF ficará bloqueado</strong> e você <strong>NÃO poderá criar uma nova conta</strong> na plataforma no futuro.
          </p>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>💡 Alternativas:</h3>
          <p style={styles.infoText}>
            Antes de excluir, considere:
          </p>
          <ul style={styles.infoList}>
            <li>✅ Pausar temporariamente sua conta</li>
            <li>✅ Ajustar suas configurações de disponibilidade</li>
            <li>✅ Entrar em contato com o suporte</li>
          </ul>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            style={styles.cancelButton}
            onClick={() => window.history.back()}
          >
            ← Voltar ao Perfil
          </button>
          <button 
            style={styles.dangerButton}
            onClick={() => setEtapa('confirmacao')}
          >
            Continuar com a Exclusão
          </button>
        </div>
      </div>
    );
  }

  // ========== ETAPA: CONFIRMAÇÃO ==========
  if (etapa === 'confirmacao') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>✋ Última Chance de Reconsiderar</h2>
          <p style={styles.subtitle}>Precisamos da sua confirmação final</p>
        </div>

        <div style={styles.dangerBox}>
          <p style={styles.dangerTextBold}>
            ⚡ Esta ação é PERMANENTE e IRREVERSÍVEL!
          </p>
          <p style={styles.dangerText}>
            Após clicar em "Confirmar", sua conta será <strong>imediatamente excluída</strong> e você será desconectado.
          </p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Por que você está excluindo sua conta? (Opcional)</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Seu feedback nos ajuda a melhorar a plataforma..."
            style={styles.textarea}
            rows={4}
          />
          <small style={styles.helperText}>
            Agradecemos sua honestidade. Esta informação é confidencial.
          </small>
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
            <strong>Eu compreendo e aceito que:</strong>
            <ul style={styles.checkboxList}>
              <li>Minha conta será <strong>excluída IMEDIATAMENTE</strong></li>
              <li><strong>NÃO há período de retenção</strong> de 30 dias para consultores</li>
              <li><strong>NÃO poderei recuperar</strong> minha conta após a exclusão</li>
              <li><strong>Meu CPF será BLOQUEADO</strong> permanentemente</li>
              <li><strong>NÃO poderei criar nova conta</strong> no futuro</li>
              <li>Todos os meus dados serão <strong>permanentemente removidos</strong></li>
              <li>Esta ação é <strong>IRREVERSÍVEL</strong></li>
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
              opacity: concordo ? 1 : 0.5,
              cursor: concordo ? 'pointer' : 'not-allowed'
            }}
            onClick={() => setEtapa('senha')}
            disabled={!concordo}
          >
            Prosseguir →
          </button>
        </div>
      </div>
    );
  }

  // ========== ETAPA: SENHA ==========
  if (etapa === 'senha') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔒 Confirmação de Identidade</h2>
          <p style={styles.subtitle}>Digite sua senha para confirmar a exclusão</p>
        </div>

        <div style={styles.dangerBox}>
          <p style={styles.dangerTextBold}>
            ⚠️ ÚLTIMA ETAPA ANTES DA EXCLUSÃO PERMANENTE
          </p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Senha da Conta</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            style={styles.input}
            autoFocus
          />
          <small style={styles.helperText}>
            Por segurança, precisamos confirmar que é realmente você.
          </small>
        </div>

        <div style={styles.finalWarning}>
          <h3 style={styles.finalWarningTitle}>🚨 CONFIRMAÇÃO FINAL</h3>
          <p style={styles.finalWarningText}>
            Ao clicar em "EXCLUIR MINHA CONTA AGORA", sua conta será <strong>IMEDIATAMENTE E PERMANENTEMENTE EXCLUÍDA</strong>.
          </p>
          <p style={styles.finalWarningText}>
            Seu CPF será <strong>BLOQUEADO</strong> e você <strong>NÃO poderá criar nova conta</strong>.
          </p>
          <p style={styles.finalWarningTextBold}>
            Você <strong>NÃO</strong> poderá desfazer esta ação.
          </p>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            style={styles.cancelButton}
            onClick={() => setEtapa('confirmacao')}
            disabled={loading}
          >
            ← Voltar
          </button>
          <button 
            style={{
              ...styles.deleteNowButton,
              opacity: senha && !loading ? 1 : 0.5,
              cursor: senha && !loading ? 'pointer' : 'not-allowed'
            }}
            onClick={solicitarExclusao}
            disabled={!senha || loading}
          >
            {loading ? '⏳ EXCLUINDO...' : '🗑️ EXCLUIR MINHA CONTA AGORA'}
          </button>
        </div>
      </div>
    );
  }

  // ========== ETAPA: CONCLUÍDO ==========
  if (etapa === 'concluido') {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Conta Excluída com Sucesso</h2>
          <p style={styles.successText}>
            Sua conta foi permanentemente excluída da plataforma.
          </p>
          <p style={styles.successText}>
            Você receberá um email de confirmação em instantes.
          </p>
          <div style={styles.redirectBox}>
            <p style={styles.redirectText}>
              Você será redirecionado para a página inicial em <strong>5 segundos</strong>...
            </p>
          </div>
          <p style={styles.farewellText}>
            Obrigado por ter feito parte da Kaslee! 💙
          </p>
        </div>
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
  dangerBox: {
    backgroundColor: '#f8d7da',
    border: '3px solid #dc3545',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
  },
  dangerTitle: {
    color: '#721c24',
    fontSize: '1.4rem',
    marginBottom: '15px',
    fontWeight: '700',
  },
  dangerText: {
    color: '#721c24',
    fontSize: '1rem',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
  dangerTextBold: {
    color: '#721c24',
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '10px',
    lineHeight: '1.6',
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
  warningList: {
    color: '#856404',
    fontSize: '1rem',
    marginLeft: '20px',
    lineHeight: '1.8',
  },
  cpfWarningBox: {
    backgroundColor: '#343a40',
    border: '3px solid #dc3545',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
  },
  cpfWarningTitle: {
    color: '#fff',
    fontSize: '1.3rem',
    marginBottom: '15px',
    fontWeight: '700',
  },
  cpfWarningText: {
    color: '#fff',
    fontSize: '1rem',
    lineHeight: '1.6',
    margin: 0,
  },
  infoBox: {
    backgroundColor: '#d1ecf1',
    border: '2px solid #17a2b8',
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
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  helperText: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '5px',
    display: 'block',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid #dc3545',
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
    lineHeight: '2',
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
  deleteNowButton: {
    backgroundColor: '#000',
    color: 'white',
    border: '3px solid #dc3545',
    padding: '15px 30px',
    fontSize: '1rem',
    fontWeight: '700',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1,
    textTransform: 'uppercase',
  },
  finalWarning: {
    backgroundColor: '#000',
    color: '#fff',
    border: '3px solid #dc3545',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    textAlign: 'center',
  },
  finalWarningTitle: {
    color: '#dc3545',
    fontSize: '1.5rem',
    marginBottom: '15px',
    fontWeight: '700',
  },
  finalWarningText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    marginBottom: '10px',
  },
  finalWarningTextBold: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#dc3545',
    marginTop: '15px',
  },
  successBox: {
    backgroundColor: '#d4edda',
    border: '3px solid #bb25a6',
    borderRadius: '12px',
    padding: '50px',
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '5rem',
    marginBottom: '20px',
  },
  successTitle: {
    color: '#155724',
    fontSize: '2rem',
    marginBottom: '20px',
    fontWeight: '700',
  },
  successText: {
    color: '#155724',
    fontSize: '1.2rem',
    marginBottom: '15px',
  },
  redirectBox: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    margin: '30px 0',
  },
  redirectText: {
    color: '#333',
    fontSize: '1rem',
    margin: 0,
  },
  farewellText: {
    color: '#155724',
    fontSize: '1.3rem',
    fontWeight: '600',
    marginTop: '20px',
  },
};

export default ExcluirContaConsultor;