// src/pages/LojistaDashboard/components/ReportPanelLojista.jsx
// Componente de Report especifico para Lojista

import React, { useState, useRef } from 'react';
import { FaExclamationTriangle, FaUser, FaShoppingCart, FaBox, FaBug, FaCheckCircle, FaUpload, FaTimes, FaImage, FaHeadset, FaCreditCard } from 'react-icons/fa';

const LOJISTA_PRIMARY = "#2f0d51";
const LOJISTA_LIGHT_BG = "#eaf2ff";

const ReportPanelLojista = ({ lojistaId }) => {
  const [tipoProblema, setTipoProblema] = useState('');
  const [opcaoEspecifica, setOpcaoEspecifica] = useState('');
  const [descricao, setDescricao] = useState('');
  const [vendaId, setVendaId] = useState('');
  const [atendimentoId, setAtendimentoId] = useState('');
  const [consultorId, setConsultorId] = useState('');
  const [vendedorId, setVendedorId] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [arquivos, setArquivos] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024;

      if (!isValidType) {
        alert(` Arquivo ${file.name} nao e uma imagem ou PDF valido`);
        return false;
      }
      if (!isValidSize) {
        alert(` Arquivo ${file.name} excede o tamanho maximo de 10MB`);
        return false;
      }
      return true;
    });

    if (arquivos.length + validFiles.length > 5) {
      alert(' Voca pode enviar no maximo 5 arquivos');
      return;
    }

    setArquivos([...arquivos, ...validFiles]);
  };

  const removeFile = (index) => {
    setArquivos(arquivos.filter((_, i) => i !== index));
  };

  // Tipos de problema especificos para o LOJISTA
  const tiposProblema = [
    {
      id: 'integracao',
      label: 'Problema na Integracao de Vendas',
      icon: <FaShoppingCart />,
      descricao: 'Erros ao integrar vendas, QR Code nao funciona, dados nao sincronizam',
      color: '#dc3545',
      opcoes: [
        'Erro ao gerar QR Code de venda',
        'Venda nao aparece no sistema',
        'Dados da venda incorretos',
        'Falha na sincronizacao de estoque',
        'Problema com confirmacao de pagamento',
        'Integracao travada ou lenta',
        'Dados duplicados no sistema',
        'Outros'
      ]
    },
    {
      id: 'atendimento',
      label: 'Problema com Atendimento',
      icon: <FaHeadset />,
      descricao: 'Problemas com atendimentos realizados por consultores ou vendedores na plataforma',
      color: '#fd7e14',
      opcoes: [
        'Atendimento nao finalizado corretamente',
        'Cliente reclamou do consultor/vendedor',
        'Informacoes erradas passadas ao cliente',
        'Tempo de espera muito longo',
        'Atendimento abandonado',
        'Comportamento inadequado do atendente',
        'Venda nao registrada apos atendimento',
        'Outros'
      ]
    },
    {
      id: 'consultor',
      label: 'Problema com Consultor',
      icon: <FaUser />,
      descricao: 'Questoes relacionadas a consultores vinculados   sua loja',
      color: '#6f42c1',
      opcoes: [
        'Consultor nao responde',
        'Consultor passou informacoes incorretas',
        'Consultor com comportamento inadequado',
        'Consultor nao segue politicas da loja',
        'Consultor com baixo desempenho',
        'Problema com comissao de consultor',
        'Consultor nao comparece',
        'Outros'
      ]
    },
    {
      id: 'vendedor',
      label: 'Problema com Vendedor',
      icon: <FaUser />,
      descricao: 'Questoes relacionadas a vendedores da sua equipe',
      color: '#bb25a6',
      opcoes: [
        'Vendedor nao consegue acessar o sistema',
        'Vendedor com dificuldades tecnicas',
        'Problema no cadastro do vendedor',
        'Vendedor com comportamento inadequado',
        'Problema com metas ou comissoes',
        'Vendedor nao visualiza produtos',
        'Outros'
      ]
    },
    {
      id: 'pagamento',
      label: 'Problema com Pagamentos',
      icon: <FaCreditCard />,
      descricao: 'Questoes sobre pagamentos, faturas ou cobrancas da plataforma',
      color: '#bb25a6',
      opcoes: [
        'Cobranca indevida',
        'Fatura com valor incorreto',
        'Pagamento nao processado',
        'Problema com forma de pagamento',
        'Duvida sobre taxas',
        'Reembolso nao realizado',
        'Problema com repasse de comissoes',
        'Outros'
      ]
    },
    {
      id: 'tecnico',
      label: 'Problema Tecnico',
      icon: <FaBug />,
      descricao: 'Erro no sistema, falha de conexao ou bug na plataforma',
      color: '#6c757d',
      opcoes: [
        'Sistema nao carrega ou trava',
        'Erro ao cadastrar produtos',
        'Relatorios nao carregam',
        'Problemas de conexao',
        'Dashboard nao atualiza',
        'Dados nao sao salvos',
        'Interface com erro visual',
        'Problema ao exportar dados',
        'Outros'
      ]
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoProblema || !opcaoEspecifica || !descricao.trim()) {
      alert('  Preencha todos os campos obrigatorios');
      return;
    }

    setEnviando(true);
    setSucesso(false);

    try {
      const formData = new FormData();

      const reportData = {
        lojistaId,
        tipoUsuario: 'lojista',
        tipoProblema,
        opcaoEspecifica,
        descricao,
        vendaId,
        atendimentoId,
        consultorId,
        vendedorId,
        prioridade,
        dataHora: new Date().toISOString(),
        emailDestino: 'comprasmartconsult@gmail.com'
      };

      formData.append('reportData', JSON.stringify(reportData));

      arquivos.forEach((file, index) => {
        formData.append(`evidencia_${index}`, file);
      });

      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Relatorio do Lojista enviado para comprasmartconsult@gmail.com:', reportData);
      console.log('Arquivos anexados:', arquivos.map(f => f.name));

      setSucesso(true);

      setTimeout(() => {
        handleReset();
      }, 5000);

    } catch (error) {
      console.error('Erro ao enviar relatorio:', error);
      alert(' Erro ao enviar relatorio. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleReset = () => {
    setTipoProblema('');
    setOpcaoEspecifica('');
    setDescricao('');
    setVendaId('');
    setAtendimentoId('');
    setConsultorId('');
    setVendedorId('');
    setPrioridade('media');
    setArquivos([]);
    setSucesso(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>  Reportar Problema</h2>
          <p style={styles.subtitle}>
            Canal direto com os administradores da plataforma. Relate problemas para que possamos ajuda-lo.
          </p>
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {sucesso && (
        <div style={styles.successCard}>
          <FaCheckCircle size={50} color="#bb25a6" />
          <div style={styles.successContent}>
            <h3 style={styles.successTitle}> Notificacao enviada com sucesso!</h3>
            <p style={styles.successText}>
              Seu relatorio foi enviado para <strong>comprasmartconsult@gmail.com</strong>
            </p>
            <p style={styles.successDeadline}>
              ° Em ate <strong>30 dias</strong>, voca tera retorno sobre o tema.
            </p>
            <p style={styles.successNote}>
              Voca recebera uma notificacao por email quando houver uma resposta.
            </p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Selecao do Tipo de Problema */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Tipo de Problema</h3>
          <div style={styles.tiposGrid}>
            {tiposProblema.map(tipo => (
              <div
                key={tipo.id}
                onClick={() => {
                  setTipoProblema(tipo.id);
                  setOpcaoEspecifica('');
                }}
                style={{
                  ...styles.tipoCard,
                  borderColor: tipoProblema === tipo.id ? tipo.color : '#e9ecef',
                  backgroundColor: tipoProblema === tipo.id ? tipo.color + '15' : 'white',
                }}
              >
                <div style={{ ...styles.tipoIcon, color: tipo.color }}>
                  {tipo.icon}
                </div>
                <div style={styles.tipoInfo}>
                  <p style={styles.tipoLabel}>{tipo.label}</p>
                  <p style={styles.tipoDescricao}>{tipo.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opcao Especifica do Problema */}
        {tipoProblema && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              2. Qual e o problema especifico? *
            </h3>
            <select
              value={opcaoEspecifica}
              onChange={(e) => setOpcaoEspecifica(e.target.value)}
              style={styles.selectLarge}
              required
            >
              <option value="">Selecione uma opcao...</option>
              {tiposProblema.find(t => t.id === tipoProblema)?.opcoes.map(opcao => (
                <option key={opcao} value={opcao}>{opcao}</option>
              ))}
            </select>
          </div>
        )}

        {/* Informacoes Contextuais - Especificas por tipo */}
        {opcaoEspecifica && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>3. Informacoes Contextuais (Opcional)</h3>
            <div style={styles.inputsGrid}>
              
              {/* Para problemas de integracao */}
              {(tipoProblema === 'integracao' || tipoProblema === 'atendimento') && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ID da Venda</label>
                  <input
                    type="text"
                    value={vendaId}
                    onChange={(e) => setVendaId(e.target.value)}
                    placeholder="Ex: VENDA-12345"
                    style={styles.input}
                  />
                  <span style={styles.hint}>Se o problema esta relacionado a uma venda especifica</span>
                </div>
              )}

              {/* Para problemas de atendimento */}
              {tipoProblema === 'atendimento' && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ID do Atendimento</label>
                  <input
                    type="text"
                    value={atendimentoId}
                    onChange={(e) => setAtendimentoId(e.target.value)}
                    placeholder="Ex: ATD-789"
                    style={styles.input}
                  />
                  <span style={styles.hint}>Codigo do atendimento realizado</span>
                </div>
              )}

              {/* Para problemas com consultor */}
              {(tipoProblema === 'consultor' || tipoProblema === 'atendimento') && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ID ou Nome do Consultor</label>
                  <input
                    type="text"
                    value={consultorId}
                    onChange={(e) => setConsultorId(e.target.value)}
                    placeholder="Ex: Joao Silva ou CONS-456"
                    style={styles.input}
                  />
                  <span style={styles.hint}>Identifique o consultor envolvido</span>
                </div>
              )}

              {/* Para problemas com vendedor */}
              {tipoProblema === 'vendedor' && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ID ou Nome do Vendedor</label>
                  <input
                    type="text"
                    value={vendedorId}
                    onChange={(e) => setVendedorId(e.target.value)}
                    placeholder="Ex: Maria Santos ou VEND-123"
                    style={styles.input}
                  />
                  <span style={styles.hint}>Identifique o vendedor envolvido</span>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Descricao Detalhada */}
        {opcaoEspecifica && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>4. Descricao Detalhada *</h3>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o problema em detalhes: o que aconteceu, quando, e qualquer informacao adicional relevante para resolvermos seu problema..."
              style={styles.textarea}
              rows={6}
              required
            />
            <span style={styles.hint}>
              Seja o mais especifico possivel para facilitar a resolucao
            </span>
          </div>
        )}

        {/* Upload de Evidancias */}
        {opcaoEspecifica && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>5. Evidancias (Opcional)</h3>
            <p style={styles.evidenciaDesc}>
              Anexe prints de tela, relatorios ou documentos que ajudem a ilustrar o problema
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileSelect}
              style={styles.fileInput}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              style={styles.uploadButton}
              disabled={arquivos.length >= 5}
            >
              <FaUpload /> Adicionar Arquivo
            </button>

            <span style={styles.hint}>
              Formatos aceitos: JPG, PNG, GIF, PDF (max. 10MB por arquivo, ate 5 arquivos)
            </span>

            {arquivos.length > 0 && (
              <div style={styles.filesList}>
                {arquivos.map((file, index) => (
                  <div key={index} style={styles.fileItem}>
                    <FaImage color={LOJISTA_PRIMARY} />
                    <span style={styles.fileName}>{file.name}</span>
                    <span style={styles.fileSize}>
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={styles.removeFileButton}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prioridade */}
        {opcaoEspecifica && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>6. Prioridade</h3>
            <div style={styles.prioridadeContainer}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="baixa"
                  checked={prioridade === 'baixa'}
                  onChange={(e) => setPrioridade(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.prioridadeBadge}> Baixa</span>
                <span style={styles.prioridadeDesc}>Nao urgente, pode aguardar</span>
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="media"
                  checked={prioridade === 'media'}
                  onChange={(e) => setPrioridade(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.prioridadeBadge}> Media</span>
                <span style={styles.prioridadeDesc}>Atencao necessaria em breve</span>
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="alta"
                  checked={prioridade === 'alta'}
                  onChange={(e) => setPrioridade(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.prioridadeBadge}> Alta</span>
                <span style={styles.prioridadeDesc}>Esta impactando minhas vendas/operacao</span>
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  value="urgente"
                  checked={prioridade === 'urgente'}
                  onChange={(e) => setPrioridade(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.prioridadeBadge}> Urgente</span>
                <span style={styles.prioridadeDesc}>Sistema parado, nao consigo operar</span>
              </label>
            </div>
          </div>
        )}

        {/* Botoes de Acao */}
        {opcaoEspecifica && (
          <div style={styles.actionsContainer}>
            <button
              type="button"
              onClick={handleReset}
              disabled={enviando}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || !descricao.trim()}
              style={{
                ...styles.submitButton,
                opacity: (enviando || !descricao.trim()) ? 0.6 : 1,
              }}
            >
              {enviando ? 'Enviando...' : 'Enviar Relatorio'}
            </button>
          </div>
        )}
      </form>

      {/* Informacoes de Contato de Emergancia */}
      <div style={styles.emergencyCard}>
        <FaExclamationTriangle size={24} color="#dc3545" />
        <div>
          <h4 style={styles.emergencyTitle}>  Sistema totalmente parado?</h4>
          <p style={styles.emergencyText}>
            Se sua loja esta impossibilitada de operar por problemas tecnicos criticos,
            entre em contato pelo WhatsApp de suporte prioritario: <strong>(11) 9999-9999</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '25px',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  successCard: {
    backgroundColor: '#e8f5e9',
    border: '2px solid #bb25a6',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '25px',
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#bb25a6',
    margin: '0 0 12px 0',
  },
  successText: {
    fontSize: '15px',
    color: '#666',
    margin: '0 0 10px 0',
    lineHeight: '1.5',
  },
  successDeadline: {
    fontSize: '16px',
    color: '#333',
    margin: '0 0 10px 0',
    fontWeight: '600',
  },
  successNote: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    fontStyle: 'italic',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  tiposGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '15px',
  },
  tipoCard: {
    border: '2px solid',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tipoIcon: {
    fontSize: '30px',
    flexShrink: 0,
  },
  tipoInfo: {
    flex: 1,
  },
  tipoLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  tipoDescricao: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
    lineHeight: '1.4',
  },
  inputsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic',
  },
  selectLarge: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  evidenciaDesc: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  filesList: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fileItem: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  fileName: {
    flex: 1,
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: '12px',
    color: '#999',
  },
  removeFileButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
  },
  prioridadeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  radio: {
    cursor: 'pointer',
  },
  prioridadeBadge: {
    fontSize: '15px',
    fontWeight: '600',
    minWidth: '100px',
  },
  prioridadeDesc: {
    fontSize: '14px',
    color: '#666',
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    padding: '20px',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: LOJISTA_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emergencyCard: {
    backgroundColor: '#fff5f5',
    border: '2px solid #dc3545',
    borderRadius: '12px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '25px',
  },
  emergencyTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#dc3545',
    margin: '0 0 8px 0',
  },
  emergencyText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    lineHeight: '1.5',
  },
};

export default ReportPanelLojista;
