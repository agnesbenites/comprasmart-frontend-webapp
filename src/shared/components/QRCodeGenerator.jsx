// app-frontend/src/pages/ConsultorDashboard/components/QRCodeGenerator.jsx

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";
const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

const QRCodeGenerator = ({ 
  vendaId, 
  totalValue, 
  items,
  clienteEmail,
  clienteNome,
  onClose,
  onSuccess 
}) => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Gerando QR Code para venda:', vendaId);
      
      // Criar Payment Intent no Stripe
      const response = await fetch(`${API_URL}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendaId: vendaId,
          lojistaId: localStorage.getItem('lojistaAtual') || 'LOJA_PADRAO',
          consultorId: localStorage.getItem('consultorId'),
          amount: Math.round(totalValue * 100), // Converter para centavos
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Payment Intent criado:', data.paymentIntentId);
        
        setQrCodeData({
          paymentUrl: `${API_URL}/pay/${data.paymentIntentId}`,
          paymentIntentId: data.paymentIntentId,
          clientSecret: data.clientSecret,
        });
      } else {
        throw new Error(data.error || 'Erro ao criar pagamento');
      }
    } catch (error) {
      console.error('❌ Erro ao gerar QR Code:', error);
      alert('Erro ao gerar QR Code: ' + error.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const sendByEmail = async () => {
    if (!clienteEmail) {
      alert('Email do cliente não informado');
      return;
    }

    try {
      setSending(true);
      
      console.log('📧 Enviando QR Code para:', clienteEmail);
      
      const response = await fetch(`${API_URL}/api/vendas/enviar-qrcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendaId: vendaId,
          email: clienteEmail,
          clienteNome: clienteNome,
          qrCodeData: qrCodeData,
          items: items,
          totalValue: totalValue,
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Email enviado com sucesso');
        setSent(true);
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 2000);
      } else {
        alert('Erro ao enviar email: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      alert('Erro ao enviar email. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = () => {
    if (qrCodeData?.paymentUrl) {
      navigator.clipboard.writeText(qrCodeData.paymentUrl);
      alert('✅ Link copiado para a área de transferência!');
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-canvas');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qrcode-venda-${vendaId}.png`;
        link.href = url;
        link.click();
        console.log('✅ QR Code baixado');
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {sent ? '✅ Venda Finalizada!' : '🎉 Venda Concluída!'}
          </h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Gerando QR Code...</p>
            </div>
          ) : sent ? (
            <div style={styles.successContainer}>
              <span style={styles.successIcon}>📧</span>
              <h3 style={styles.successTitle}>Email Enviado!</h3>
              <p style={styles.successText}>
                O QR Code foi enviado para <strong>{clienteEmail}</strong>
              </p>
              <p style={styles.successSubtext}>
                O cliente pode pagar escaneando o código ou clicando no link.
              </p>
            </div>
          ) : (
            <>
              {/* Resumo da Venda */}
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>ID da Venda:</span>
                  <span style={styles.summaryValue}>#{vendaId}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Cliente:</span>
                  <span style={styles.summaryValue}>{clienteNome || clienteEmail}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Total:</span>
                  <span style={styles.summaryValueBold}>
                    R$ {totalValue.toFixed(2)}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Itens:</span>
                  <span style={styles.summaryValue}>{items.length}</span>
                </div>
              </div>

              {/* QR Code */}
              <div style={styles.qrCodeContainer}>
                <QRCodeSVG
                  id="qr-code-canvas"
                  value={qrCodeData?.paymentUrl || ''}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Link de Pagamento */}
              <div style={styles.linkContainer}>
                <input
                  type="text"
                  value={qrCodeData?.paymentUrl || ''}
                  readOnly
                  style={styles.linkInput}
                />
                <button onClick={copyToClipboard} style={styles.copyButton}>
                  📋 Copiar
                </button>
              </div>

              {/* Lista de Produtos */}
              <div style={styles.itemsList}>
                <h4 style={styles.itemsTitle}>Produtos:</h4>
                {items.map((item, index) => (
                  <div key={index} style={styles.item}>
                    <span style={styles.itemName}>
                      {item.quantity}x {item.name}
                    </span>
                    <span style={styles.itemPrice}>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botões de Ação */}
              <div style={styles.actions}>
                <button
                  onClick={sendByEmail}
                  disabled={sending}
                  style={styles.primaryButton}
                >
                  {sending ? '📧 Enviando...' : '📧 Enviar por Email'}
                </button>
                
                <button
                  onClick={downloadQRCode}
                  style={styles.secondaryButton}
                >
                  💾 Baixar QR Code
                </button>
              </div>

              {/* Informação do Email */}
              {clienteEmail && (
                <p style={styles.emailInfo}>
                  Será enviado para: <strong>{clienteEmail}</strong>
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer com aviso */}
        {!loading && !sent && (
          <div style={styles.footer}>
            <p style={styles.footerText}>
              ℹ️ O cliente tem 24 horas para realizar o pagamento
            </p>
          </div>
        )}
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

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid #e9ecef',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: SECONDARY_COLOR,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6c757d',
    padding: '0',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '25px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid ' + PRIMARY_COLOR,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    color: '#6c757d',
    fontSize: '1rem',
  },
  successContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  successIcon: {
    fontSize: '5rem',
    display: 'block',
    marginBottom: '20px',
  },
  successTitle: {
    margin: '0 0 10px 0',
    color: '#28a745',
    fontSize: '1.5rem',
  },
  successText: {
    fontSize: '1rem',
    color: SECONDARY_COLOR,
    marginBottom: '10px',
  },
  successSubtext: {
    fontSize: '0.9rem',
    color: '#6c757d',
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: '0.9rem',
    color: SECONDARY_COLOR,
    fontWeight: '500',
  },
  summaryValueBold: {
    fontSize: '1.2rem',
    color: '#28a745',
    fontWeight: '700',
  },
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: 'white',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  linkContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  linkInput: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
  },
  copyButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  itemsList: {
    marginBottom: '20px',
  },
  itemsTitle: {
    margin: '0 0 10px 0',
    fontSize: '0.95rem',
    color: SECONDARY_COLOR,
    fontWeight: '600',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px dotted #dee2e6',
  },
  itemName: {
    fontSize: '0.9rem',
    color: SECONDARY_COLOR,
  },
  itemPrice: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: SECONDARY_COLOR,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  primaryButton: {
    padding: '12px 20px',
    backgroundColor: PRIMARY_COLOR,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    padding: '12px 20px',
    backgroundColor: 'white',
    color: PRIMARY_COLOR,
    border: '1px solid ' + PRIMARY_COLOR,
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emailInfo: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#6c757d',
    marginTop: '15px',
  },
  footer: {
    padding: '15px 25px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  footerText: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#6c757d',
    textAlign: 'center',
  },
};

export default QRCodeGenerator;