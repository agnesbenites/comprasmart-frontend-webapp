import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { FaUserCircle, FaShoppingCart, FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// URL da API
const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

// Dados de Cliente de Teste
const clienteData = {
  id: "c123456",
  nome: "Cliente Exemplo",
  nomeVisivel: false, // Cliente optou por não mostrar nome
  email: "cliente.exemplo@email.com",
  status: "Ativo",
  descricao: "Em busca de produtos",
};

// Dados de Consultor de Teste
const consultorId = "cons7890";

const ChatPanel = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [vendaId, setVendaId] = useState(null);
  const [saleStatus, setSaleStatus] = useState('idle');

  const getClienteDisplay = () => {
    if (clienteData.nomeVisivel) {
      return clienteData.nome;
    }
    return `Cliente #${clienteData.id.substring(1, 7)}`;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  
  const simulatedProducts = [
    { id: 'prod1', name: 'Smartwatch X', price: 350.00 },
    { id: 'prod2', name: 'Fone Bluetooth', price: 120.00 },
    { id: 'prod3', name: 'Capa Protetora', price: 45.00 },
  ];

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert("Carrinho vazio! Adicione produtos para finalizar a venda.");
      return;
    }

    setSaleStatus('idle');
    
    try {
      console.log('📄 Tentando finalizar venda...');
      
      const salePayload = {
        consultorId: consultorId,
        lojistaId: localStorage.getItem('lojistaAtual') || "858f50c0-f472-4d1d-9e6e-21952f40c7e5",
        clienteId: clienteData.id,
        clienteEmail: clienteData.email,
        clienteNome: clienteData.nome,
        produtos: cart.map(item => ({
          produtoId: item.id,
          nome: item.name,
          quantidade: item.quantity,
          preco: item.price,
          total: item.price * item.quantity,
        })),
        valorTotal: calculateTotal(),
      };

      const response = await fetch(`${API_URL}/api/vendas/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salePayload),
      });

      const responseBody = await response.json().catch(() => ({})); 

      if (!response.ok) {
        const errorMessage = responseBody.error || response.statusText || 'Erro desconhecido';
        
        if (errorMessage.includes("Estoque insuficiente") || response.status === 409) {
          setSaleStatus('stock_error');
          console.error('❌ Erro de Estoque Concorrente:', errorMessage);
        } else {
          setSaleStatus('generic_error');
          console.error(`❌ Erro HTTP ${response.status}:`, errorMessage);
        }
        return;
      }
      
      if (responseBody.success) {
        console.log('✅ Venda criada:', responseBody.vendaId);
        setVendaId(responseBody.vendaId);
        setShowQRCode(true);
        setSaleStatus('success');
      } else {
        setSaleStatus('generic_error');
        console.error('❌ Erro na lógica do servidor:', responseBody.error);
      }
      
    } catch (error) {
      console.error("❌ Erro de Conexão/Rede:", error);
      setSaleStatus('generic_error');
    }
  };

  const navigateToSummary = () => {
    navigate(`/consultor/resumo-venda/${vendaId || 'novo'}`, { state: { saleStatus, cart, clienteData } });
  };

  return (
    <div style={styles.container}>
      {/* Header do Atendimento */}
      <div style={styles.headerAtendimento}>
        <h1 style={styles.pageTitle}>Atendimento Ativo</h1>
        <div style={styles.clienteInfo}>
          <FaUserCircle size={32} color="#2c5aa0" />
          <div style={styles.clienteDetails}>
            <h2 style={styles.clienteNome}>{getClienteDisplay()} ({clienteData.status})</h2>
            <p style={styles.clienteDescricao}>{clienteData.descricao}</p>
          </div>
        </div>
      </div>

      {/* Layout Principal (Chat + Carrinho) */}
      <div style={styles.mainContent}>
        
        {/* Área do Chat */}
        <div style={styles.chatArea}>
          <h3 style={styles.sectionTitle}>💬 Simulação de Chat</h3>
          <div style={styles.chatMessages}>
            <div style={styles.consultorMessage}>Olá! Em que posso ajudar?</div>
            <div style={styles.clientMessage}>Gostaria do Smartwatch X e de um fone Bluetooth.</div>
          </div>
          <input 
            type="text" 
            placeholder="Digite sua mensagem..." 
            style={styles.chatInput}
          />
        </div>

        {/* Sidebar de Vendas */}
        <div style={styles.salesSidebar}>
          
          {/* Carrinho */}
          <div style={styles.cartSection}>
            <h3 style={styles.cartTitle}><FaShoppingCart /> Carrinho de Vendas</h3>
            <ul style={styles.cartList}>
              {cart.map((item) => (
                <li key={item.id} style={styles.cartItem}>
                  <span style={styles.cartItemInfo}>
                    {item.name} ({item.quantity}x) - R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={styles.removeButton}
                  >
                    <FaTimes size={12} />
                  </button>
                </li>
              ))}
            </ul>
            {cart.length === 0 && (
              <p style={styles.emptyCart}>Carrinho vazio</p>
            )}
            <p style={styles.cartTotal}>Total: R$ {calculateTotal()}</p>
          </div>
          
          {/* Simulação de Adição */}
          <div style={styles.productTest}>
            <h4 style={styles.testTitle}>Adicionar (Teste)</h4>
            <div style={styles.testButtons}>
              {simulatedProducts.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => addToCart(p)}
                  style={styles.addButton}
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Seção de Finalização */}
          <div style={styles.finalizeSection}>
            
            {saleStatus === 'idle' && (
              <button 
                style={styles.finalizeButton} 
                onClick={handleFinalizeSale}
              >
                Finalizar Venda e Gerar QR Code
              </button>
            )}

            {saleStatus === 'success' && (
              <div style={styles.successFeedback}>
                <p style={styles.successTitle}>✅ Venda Criada com Sucesso!</p>
                <p style={styles.successText}>O QR Code foi gerado e enviado ao cliente.</p>
                <div style={styles.qrContainer}>
                  <QRCode value={vendaId || 'erro'} size={128} level="H" />
                  <p style={styles.vendaIdLabel}>ID da Venda: {vendaId}</p>
                </div>
                <button 
                  onClick={navigateToSummary} 
                  style={styles.summaryButton}
                >
                  Ver Resumo e Encerrar Atendimento
                </button>
              </div>
            )}

            {saleStatus === 'stock_error' && (
              <div style={styles.errorFeedback}>
                <p style={styles.errorTitle}>⚠️ Estoque Esgotado!</p>
                <p style={styles.errorText}>
                  Outro consultor finalizou a venda do produto antes. Venda não concluída.
                </p>
                <button 
                  onClick={() => setSaleStatus('idle')} 
                  style={styles.retryButton}
                >
                  Ajustar Carrinho e Tentar Novamente
                </button>
              </div>
            )}

            {saleStatus === 'generic_error' && (
              <div style={styles.errorFeedback}>
                <p style={styles.errorTitle}>❌ Falha na Venda!</p>
                <p style={styles.errorText}>
                  Ocorreu um erro ao conectar ou processar. Tente novamente.
                </p>
                <button 
                  onClick={() => setSaleStatus('idle')} 
                  style={styles.retryButton}
                >
                  Tentar Novamente
                </button>
              </div>
            )}
          </div>
          
          {/* Ações Adicionais */}
          <div style={styles.actions}>
            <button style={styles.whatsappButton}>
              <FaWhatsapp /> Enviar no WhatsApp
            </button>
            <button 
              style={styles.endButton} 
              onClick={() => navigateToSummary()}
            >
              Encerrar Atendimento (Sem Venda)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '20px',
  },
  headerAtendimento: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  pageTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2c5aa0',
    margin: '0 0 20px 0',
  },
  clienteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  clienteDetails: {
    flex: 1,
  },
  clienteNome: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  clienteDescricao: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0,
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '20px',
  },
  chatArea: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 250px)',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  consultorMessage: {
    backgroundColor: '#eaf2ff',
    padding: '10px 15px',
    borderRadius: '12px',
    alignSelf: 'flex-start',
    maxWidth: '70%',
  },
  clientMessage: {
    backgroundColor: '#e8f5e9',
    padding: '10px 15px',
    borderRadius: '12px',
    alignSelf: 'flex-end',
    maxWidth: '70%',
  },
  chatInput: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  salesSidebar: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: 'fit-content',
  },
  cartSection: {
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '15px',
  },
  cartTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cartList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '14px',
  },
  cartItemInfo: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  emptyCart: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    padding: '20px 0',
  },
  cartTotal: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: '10px',
    textAlign: 'right',
  },
  productTest: {
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '15px',
  },
  testTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#666',
    marginBottom: '10px',
  },
  testButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  addButton: {
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e9ecef',
  },
  finalizeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  finalizeButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  successFeedback: {
    backgroundColor: '#e8f5e9',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  successTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '8px',
  },
  successText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  vendaIdLabel: {
    fontSize: '12px',
    color: '#666',
  },
  summaryButton: {
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  errorFeedback: {
    backgroundColor: '#fff5f5',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: '8px',
  },
  errorText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
  },
  retryButton: {
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  endButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ChatPanel;