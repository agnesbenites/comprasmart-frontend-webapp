import React, { useState, useEffect } from 'react';
import { House, CheckCircle, XCircle, Clock, Tag, HourglassHigh, Lifebuoy, Storefront, ChatCircle } from '@phosphor-icons/react';
// IMPORTANTE: Assumimos que 'Buffer' esta disponivel globalmente (via polyfill ou Webpack)
// Se nao estiver, esta linha deve ser ajustada.

const AplicativoConfirmacao = () => {
  const [qrCodeScanned, setQrCodeScanned] = useState('');
  const [vendaProcessando, setVendaProcessando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [message, setMessage] = useState(null); // Estado para mensagens de erro/sucesso (substitui alert)

  // Bloco de Correcao: Garante que o keyframes 'spin' seja injetado AP“S a montagem do componente.
  useEffect(() => {
    // Verifica se estamos no navegador e se existe pelo menos uma folha de estilo
    if (typeof document !== 'undefined' && document.styleSheets.length > 0) {
      const styleSheet = document.styleSheets[0];
      
      // Verifica se a regra de animacao 'spin' ja existe para evitar duplicatas
      const spinRuleExists = Array.from(styleSheet.cssRules || []).some(
        (rule) => rule.name === 'spin'
      );

      if (!spinRuleExists) {
        try {
          // Injeta a regra CSS para a animacao do spinner
          styleSheet.insertRule(`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `, styleSheet.cssRules.length);
        } catch (e) {
          console.warn("Aviso: Falha ao inserir keyframes 'spin' dinamicamente. O fallback inline sera usado.");
        }
      }
    }
  }, []); // Executa apenas uma vez

  // Simular escaneamento de QR Code
  const simularEscaneamento = () => {
    setMessage(null); // Limpa mensagem anterior
    // Em producao, isso viria de uma c¢mera/leitor
    const qrCodeMock = Buffer.from(JSON.stringify({
      paymentIntentId: 'pi_123456789',
      vendaId: 'venda_123',
      valorTotal: 2500.00,
      lojistaId: 'lojista_001',
      consultorId: 'cons_001',
      produtos: [
        {
          id: 'prod_001',
          nome: 'Smartphone Galaxy S23',
          preco: 2500.00,
          quantidade: 1,
          percentualComissao: 5,
          valorComissao: 125.00
        }
      ]
    })).toString('base64');

    setQrCodeScanned(qrCodeMock);
    processarQRCode(qrCodeMock);
  };

  const processarQRCode = async (qrCodeData) => {
    setLoading(true);
    setResultado(null);
    setMessage(null);
    
    try {
      // Decodificar QR Code
      const qrData = JSON.parse(Buffer.from(qrCodeData, 'base64').toString());
      setVendaProcessando(qrData);

      // Confirmar pagamento no backend
      const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';
    const response = await fetch(`${API_URL}/api/vendas/confirmar-pagamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: qrData.paymentIntentId,
          qrCodeData: qrData,
          metodoPagamento: 'presencial_caixa'
        })
      });

      const result = await response.json();
      setResultado(result);
      
      if (result.success) {
        setMessage({ type: 'success', text: `Venda ${result.vendaId} confirmada! Valor: R$ ${result.valor}` });
      } else {
        setMessage({ type: 'error', text: `Erro de Pagamento: ${result.error}` });
      }

    } catch (error) {
      console.error('Erro processar QR Code:', error);
      setMessage({ type: 'error', text: 'Erro ao processar pagamento. Verifique a conexao.' });
      setResultado({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const novaVenda = () => {
    setQrCodeScanned('');
    setVendaProcessando(null);
    setResultado(null);
    setMessage(null);
  };

  const Notification = ({ type, text }) => (
    <div style={{ ...styles.notification, ...(type === 'success' ? styles.notificationSuccess : styles.notificationError) }}>
      {type === 'success' ? '' : ''} {text}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}> App do Caixa</h1>
        <p style={styles.subtitle}>Escanear QR Code para confirmar pagamento</p>
      </div>

      <div style={styles.content}>
        {message && <Notification type={message.type} text={message.text} />}

        {/* rea de Escaneamento */}
        {!vendaProcessando && !resultado && (
          <div style={styles.scanSection}>
            <div style={styles.scanArea}>
              <div style={styles.scanPlaceholder}>
                 rea de Escaneamento
                <div style={styles.scanInstructions}>
                  Posicione o QR Code do cliente nesta area
                </div>
              </div>
            </div>
            
            <button 
              onClick={simularEscaneamento}
              style={styles.scanButton}
            >
               Simular Escaneamento (Demo)
            </button>

            <div style={styles.manualEntry}>
              <h3>Ou digite manualmente:</h3>
              <input 
                type="text"
                placeholder="Codigo do QR Code"
                value={qrCodeScanned}
                onChange={(e) => setQrCodeScanned(e.target.value)}
                style={styles.manualInput}
              />
              <button 
                onClick={() => processarQRCode(qrCodeScanned)}
                disabled={!qrCodeScanned}
                style={styles.processButton}
              >
                Processar
              </button>
            </div>
          </div>
        )}

        {/* Processando Venda */}
        {vendaProcessando && loading && (
          <div style={styles.processingSection}>
            <div style={styles.loadingSpinner}></div>
            <h2> Processando Pagamento...</h2>
            <div style={styles.vendaInfo}>
              <p><strong>Venda:</strong> {vendaProcessando.vendaId}</p>
              <p><strong>Valor:</strong> R$ {vendaProcessando.valorTotal?.toFixed(2)}</p>
              <p><strong>Itens:</strong> {vendaProcessando.produtos?.length}</p>
            </div>
            {/* Fallback CSS para a animacao do spinner */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}} />
          </div>
        )}

        {/* Resultado */}
        {resultado && !loading && (
          <div style={styles.resultSection}>
            {resultado.success ? (
              <div style={styles.successResult}>
                <div style={styles.successIcon}><CheckCircle size={80} weight="duotone" color="#bb25a6" /></div>
                <h2 style={styles.successTitle}>Pagamento Confirmado!</h2>
                
                <div style={styles.successDetails}>
                  <div style={styles.detailItem}>
                    <strong>Venda:</strong> {resultado.vendaId || vendaProcessando?.vendaId}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Valor:</strong> R$ {resultado.valor || vendaProcessando?.valorTotal?.toFixed(2)}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Status:</strong> <span style={styles.statusSuccess}>Comissoes processadas</span>
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Data/Hora:</strong> {new Date().toLocaleString('pt-BR')}
                  </div>
                </div>

                <div style={styles.nextActions}>
                  <button onClick={novaVenda} style={styles.newSaleButton}>
                     Nova Venda
                  </button>
                  <button onClick={() => window.print()} style={styles.printButton}>
                     Imprimir Comprovante
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.errorResult}>
                <div style={styles.errorIcon}></div>
                <h2 style={styles.errorTitle}>Erro no Pagamento</h2>
                <p style={styles.errorMessage}>{resultado.error}</p>
                <button onClick={novaVenda} style={styles.retryButton}>
                   Iniciar Nova Transacao
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '8px',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0
  },
  content: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    minHeight: '400px'
  },
  scanSection: {
    textAlign: 'center'
  },
  scanArea: {
    margin: '0 auto 30px',
    maxWidth: '400px'
  },
  scanPlaceholder: {
    width: '100%',
    height: '300px',
    backgroundColor: '#f8f9fa',
    border: '3px dashed #bb25a6',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: '#666',
    fontWeight: '600'
  },
  scanInstructions: {
    fontSize: '1rem',
    marginTop: '15px',
    color: '#999'
  },
  scanButton: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '30px'
  },
  manualEntry: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  manualInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '10px'
  },
  processButton: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  processingSection: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  loadingSpinner: {
    width: '60px',
    height: '60px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #bb25a6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  vendaInfo: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'left',
    maxWidth: '300px',
    margin: '20px auto'
  },
  resultSection: {
    textAlign: 'center'
  },
  successResult: {
    padding: '30px'
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  successTitle: {
    fontSize: '1.8rem',
    color: '#bb25a6',
    marginBottom: '20px'
  },
  successDetails: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    textAlign: 'left',
    maxWidth: '400px',
    margin: '0 auto'
  },
  detailItem: {
    marginBottom: '10px',
    padding: '8px 0',
    borderBottom: '1px solid #dee2e6'
  },
  statusSuccess: {
    color: '#bb25a6',
    fontWeight: '600'
  },
  nextActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  newSaleButton: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  printButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  errorResult: {
    padding: '30px'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  errorTitle: {
    fontSize: '1.8rem',
    color: '#dc3545',
    marginBottom: '15px'
  },
  errorMessage: {
    color: '#666',
    marginBottom: '25px',
    fontSize: '1.1rem'
  },
  retryButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  // Estilos para a Notificacao (substituindo alert)
  notification: {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: '600',
    textAlign: 'center'
  },
  notificationSuccess: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    color: '#155724'
  },
  notificationError: {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24'
  }
};

export default AplicativoConfirmacao;
