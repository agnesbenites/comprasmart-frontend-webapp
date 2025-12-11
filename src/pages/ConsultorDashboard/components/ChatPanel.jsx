import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { 
  FaUserCircle, 
  FaShoppingCart, 
  FaWhatsapp, 
  FaTimes, 
  FaSearch,
  FaMicrophone,
  FaVideo,
  FaImage,
  FaPaperPlane,
  FaPhone,
  FaStopCircle,
  FaCamera,
  FaStop,
  FaPlus,
  FaTrash,
  FaQrcode
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

const clienteData = {
  id: "c123456",
  nome: "Cliente Exemplo",
  nomeVisivel: false,
  email: "cliente.exemplo@email.com",
  status: "Ativo",
  descricao: "Em busca de produtos",
};

const consultorId = "cons7890";

const ChatPanel = () => {
  const navigate = useNavigate();
  
  // Estados principais
  const [cart, setCart] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [vendaId, setVendaId] = useState(null);
  const [saleStatus, setSaleStatus] = useState('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'consultor', text: 'Olá! Em que posso ajudar?', time: '10:00' },
    { id: 2, sender: 'cliente', text: 'Gostaria do Smartwatch X e de um fone Bluetooth.', time: '10:01' },
  ]);
  
  // Estados multimídia
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOnCall, setIsOnCall] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatMessagesRef = useRef(null);
  
  // Produtos disponíveis
  const produtosDisponiveis = [
    { 
      id: 'prod1', 
      name: 'Smartwatch X', 
      price: 350.00, 
      sku: 'SWX-2024', 
      categoria: 'eletrônicos', 
      cor: 'Preto',
      estoque: 10
    },
    { 
      id: 'prod2', 
      name: 'Fone Bluetooth', 
      price: 120.00, 
      sku: 'FB-2024', 
      categoria: 'eletrônicos', 
      cor: 'Branco',
      estoque: 15
    },
    { 
      id: 'prod3', 
      name: 'Capa Protetora', 
      price: 45.00, 
      sku: 'CAP-001', 
      categoria: 'acessórios', 
      cor: 'Transparente',
      estoque: 20
    },
  ];
  
  // Filtrar produtos
  const produtosFiltrados = searchTerm 
    ? produtosDisponiveis.filter(produto =>
        produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.cor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : produtosDisponiveis;
  
  // Funções do chat
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'consultor',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audioMessage = {
          id: messages.length + 1,
          sender: 'consultor',
          type: 'audio',
          audioUrl: audioUrl,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([...messages, audioMessage]);
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setAudioChunks(chunks);
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('NÀo foi possível acessar o microfone.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Vídeo
  const toggleVideo = async () => {
    if (isVideoActive) {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
      setIsVideoActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        });
        setVideoStream(stream);
        setIsVideoActive(true);
        
        const videoMessage = {
          id: messages.length + 1,
          sender: 'system',
          text: 'Chamada de vídeo iniciada',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, videoMessage]);
        
      } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        alert('NÀo foi possível acessar a câmera.');
      }
    }
  };
  
  // Imagem
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        
        const imageMessage = {
          id: messages.length + 1,
          sender: 'consultor',
          type: 'image',
          imageUrl: imageUrl,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([...messages, imageMessage]);
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerImageInput = () => {
    fileInputRef.current.click();
  };
  
  // Chamada
  const toggleCall = () => {
    setIsOnCall(!isOnCall);
    
    const callMessage = {
      id: messages.length + 1,
      sender: 'system',
      text: isOnCall ? 'Chamada encerrada' : 'Chamada iniciada',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, callMessage]);
  };
  
  // Carrinho
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
  
  // Venda
  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert("Carrinho vazio! Adicione produtos para finalizar a venda.");
      return;
    }
    
    setSaleStatus('processando');
    
    try {
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
        if (response.status === 409) {
          setSaleStatus('estoque_erro');
        } else {
          setSaleStatus('erro');
        }
        return;
      }
      
      if (responseBody.success) {
        setVendaId(responseBody.vendaId);
        setShowQRCode(true);
        setSaleStatus('sucesso');
      }
      
    } catch (error) {
      console.error("Erro:", error);
      setSaleStatus('erro');
    }
  };
  
  // Histórico
  const salvarNoHistorico = async (comVenda = true) => {
    try {
      const historicoPayload = {
        consultorId,
        clienteId: clienteData.id,
        clienteNome: clienteData.nome,
        vendaId: comVenda ? vendaId : null,
        produtos: comVenda ? cart : [],
        valorTotal: comVenda ? calculateTotal() : 0,
        status: comVenda ? 'venda_concluida' : 'sem_venda',
        dataAtendimento: new Date().toISOString(),
        mensagens: messages
      };
      
      await fetch(`${API_URL}/api/atendimentos/historico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historicoPayload),
      });
      
      navigate('/consultor/dashboard/historico');
      
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      navigate('/consultor/dashboard/historico');
    }
  };
  
  const handleEncerrarSemVenda = () => {
    if (window.confirm('Encerrar atendimento sem venda?')) {
      salvarNoHistorico(false);
    }
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (videoStream) videoStream.getTracks().forEach(track => track.stop());
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);
  
  // Scroll para baixo no chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Funções auxiliares
  const getClienteDisplay = () => {
    return clienteData.nomeVisivel ? clienteData.nome : `Cliente #${clienteData.id.substring(1, 7)}`;
  };
  
  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.pageTitle}>Atendimento Ativo</h1>
          <div style={styles.clienteInfo}>
            <FaUserCircle style={styles.avatar} />
            <div>
              <h2 style={styles.clienteNome}>{getClienteDisplay()} ({clienteData.status})</h2>
              <p style={styles.clienteDescricao}>{clienteData.descricao}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo Principal */}
      <div style={styles.mainLayout}>
        
        {/* Chat */}
        <div style={styles.chatContainer}>
          
          {/* Header do Chat */}
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>SimulaçÀo de Chat</h3>
            <div style={styles.chatControls}>
              <button
                style={isOnCall ? styles.controlButtonActive : styles.controlButton}
                onClick={toggleCall}
                title="Chamada"
              >
                <FaPhone size={14} />
              </button>
              <button
                style={isVideoActive ? styles.controlButtonActive : styles.controlButton}
                onClick={toggleVideo}
                title="Vídeo"
              >
                <FaVideo size={14} />
              </button>
            </div>
          </div>
          
          {/* Vídeo Ativo */}
          {isVideoActive && videoStream && (
            <div style={styles.videoPreview}>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={styles.videoElement}
              />
              <div style={styles.videoOverlay}>
                <button onClick={toggleVideo} style={styles.stopVideoBtn}>
                  <FaStopCircle /> Parar
                </button>
              </div>
            </div>
          )}
          
          {/* Mensagens */}
          <div style={styles.messagesContainer} ref={chatMessagesRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={
                  msg.sender === 'consultor' ? styles.msgConsultor :
                  msg.sender === 'cliente' ? styles.msgCliente :
                  styles.msgSystem
                }
              >
                {msg.type === 'audio' ? (
                  <div style={styles.audioContainer}>
                    <FaMicrophone size={12} />
                    <audio controls style={styles.audioPlayer}>
                      <source src={msg.audioUrl} type="audio/webm" />
                    </audio>
                    <span style={styles.msgTime}>{msg.time}</span>
                  </div>
                ) : msg.type === 'image' ? (
                  <div style={styles.imageContainer}>
                    <img src={msg.imageUrl} alt="Enviada" style={styles.chatImage} />
                    <span style={styles.msgTime}>{msg.time}</span>
                  </div>
                ) : (
                  <>
                    <div>{msg.text}</div>
                    <span style={styles.msgTime}>{msg.time}</span>
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Input de Mensagem */}
          <div style={styles.inputContainer}>
            <div style={styles.mediaButtons}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                style={isRecording ? styles.mediaButtonRecording : styles.mediaButton}
                title="Áudio"
              >
                <FaMicrophone size={14} />
                {isRecording && <span style={styles.recordingDot} />}
              </button>
              
              <button
                onClick={triggerImageInput}
                style={styles.mediaButton}
                title="Imagem"
              >
                <FaImage size={14} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              <button
                onClick={toggleVideo}
                style={isVideoActive ? styles.mediaButtonActive : styles.mediaButton}
                title="Câmera"
              >
                <FaCamera size={14} />
              </button>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              style={styles.messageInput}
              rows={2}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              style={styles.sendButton}
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
        
        {/* Sidebar de Vendas */}
        <div style={styles.sidebar}>
          
          {/* Busca */}
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por SKU, nome, cor, categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          {/* Carrinho */}
          <div style={styles.cartSection}>
            <h3 style={styles.sectionTitle}>
              <FaShoppingCart /> Carrinho de Vendas
            </h3>
            
            {cart.length === 0 ? (
              <p style={styles.emptyCart}>Carrinho vazio</p>
            ) : (
              <div style={styles.cartItems}>
                {cart.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <div style={styles.cartItemInfo}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemDetails}>
                        {item.quantity}x - R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={styles.removeItemBtn}
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div style={styles.cartTotal}>
              <span>Total:</span>
              <span style={styles.totalValue}>R$ {calculateTotal()}</span>
            </div>
          </div>
          
          {/* Produtos */}
          <div style={styles.productsSection}>
            <h4 style={styles.productsTitle}>Produtos Disponíveis</h4>
            <div style={styles.productsList}>
              {produtosFiltrados.map(produto => (
                <div key={produto.id} style={styles.productCard}>
                  <div style={styles.productInfo}>
                    <strong style={styles.productName}>{produto.name}</strong>
                    <div style={styles.productDetails}>
                      <small>SKU: {produto.sku}</small>
                      <small>Categoria: {produto.categoria}</small>
                      <small>Cor: {produto.cor}</small>
                    </div>
                    <div style={styles.productPrice}>R$ {produto.price.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => addToCart(produto)}
                    style={styles.addProductBtn}
                  >
                    <FaPlus size={12} /> Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Divisor */}
          <div style={styles.divider} />
          
          {/* Ações de Venda */}
          <div style={styles.actionsSection}>
            
            {saleStatus === 'idle' || saleStatus === 'processando' ? (
              <button
                onClick={handleFinalizeSale}
                disabled={cart.length === 0 || saleStatus === 'processando'}
                style={styles.finalizeButton}
              >
                {saleStatus === 'processando' ? (
                  'Processando...'
                ) : (
                  <>
                    <FaQrcode /> Finalizar Venda e Gerar QR Code
                  </>
                )}
              </button>
            ) : saleStatus === 'sucesso' ? (
              <div style={styles.successBox}>
                <p style={styles.successText}>✓ Venda criada com sucesso!</p>
                {showQRCode && vendaId && (
                  <div style={styles.qrBox}>
                    <QRCode value={vendaId} size={100} />
                    <small style={styles.qrId}>ID: {vendaId.substring(0, 8)}...</small>
                  </div>
                )}
                <button
                  onClick={() => salvarNoHistorico(true)}
                  style={styles.continueButton}
                >
                  Salvar e Continuar
                </button>
              </div>
            ) : saleStatus === 'estoque_erro' ? (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>✗ Estoque esgotado</p>
                <button
                  onClick={() => setSaleStatus('idle')}
                  style={styles.retryButton}
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>✗ Erro na venda</p>
                <button
                  onClick={() => setSaleStatus('idle')}
                  style={styles.retryButton}
                >
                  Tentar Novamente
                </button>
              </div>
            )}
            
            <div style={styles.secondaryActions}>
              <button style={styles.whatsappButton}>
                <FaWhatsapp /> Enviar no WhatsApp
              </button>
              
              <button
                onClick={handleEncerrarSemVenda}
                style={styles.cancelButton}
              >
                Encerrar Atendimento (Sem Venda)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos completos
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  
  // Header
  header: {
    backgroundColor: '#ffffff',
    padding: '20px 30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  pageTitle: {
    color: '#2c5aa0',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  clienteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    fontSize: '40px',
    color: '#2c5aa0',
  },
  clienteNome: {
    color: '#333333',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 5px 0',
  },
  clienteDescricao: {
    color: '#666666',
    fontSize: '14px',
    margin: 0,
  },
  
  // Layout Principal
  mainLayout: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 30px 30px',
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '20px',
  },
  
  // Chat Container
  chatContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 200px)',
  },
  chatHeader: {
    padding: '20px',
    borderBottom: '1px solid #e8e8e8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitle: {
    color: '#333333',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  chatControls: {
    display: 'flex',
    gap: '10px',
  },
  controlButton: {
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    color: '#666666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#2c5aa0',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Video Preview
  videoPreview: {
    backgroundColor: '#000000',
    position: 'relative',
    height: '180px',
  },
  videoElement: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: '10px',
    left: '0',
    right: '0',
    textAlign: 'center',
  },
  stopVideoBtn: {
    backgroundColor: 'rgba(220, 53, 69, 0.8)',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  
  // Messages
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  msgConsultor: {
    backgroundColor: '#eaf2ff',
    padding: '10px 15px',
    borderRadius: '12px 12px 12px 4px',
    maxWidth: '70%',
    alignSelf: 'flex-start',
    position: 'relative',
  },
  msgCliente: {
    backgroundColor: '#e8f5e9',
    padding: '10px 15px',
    borderRadius: '12px 12px 4px 12px',
    maxWidth: '70%',
    alignSelf: 'flex-end',
    position: 'relative',
  },
  msgSystem: {
    backgroundColor: '#f0f0f0',
    padding: '8px 12px',
    borderRadius: '8px',
    maxWidth: '80%',
    alignSelf: 'center',
    fontSize: '12px',
    color: '#666666',
    fontStyle: 'italic',
  },
  msgTime: {
    fontSize: '10px',
    color: '#999999',
    marginTop: '4px',
    display: 'block',
    textAlign: 'right',
  },
  
  // Audio e Imagem no Chat
  audioContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  audioPlayer: {
    flex: 1,
    height: '30px',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  chatImage: {
    maxWidth: '200px',
    borderRadius: '8px',
    border: '1px solid #dddddd',
  },
  
  // Input de Mensagem
  inputContainer: {
    padding: '15px 20px',
    borderTop: '1px solid #e8e8e8',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
  },
  mediaButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mediaButton: {
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    color: '#666666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaButtonActive: {
    backgroundColor: '#2c5aa0',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaButtonRecording: {
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  recordingDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    animation: 'blink 1s infinite',
  },
  '@keyframes blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.3 },
  },
  messageInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #dddddd',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'none',
    fontFamily: 'inherit',
    minHeight: '60px',
    maxHeight: '120px',
  },
  sendButton: {
    backgroundColor: '#2c5aa0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Sidebar
  sidebar: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: 'fit-content',
  },
  
  // Busca
  searchBox: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999999',
    fontSize: '14px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 36px',
    border: '1px solid #dddddd',
    borderRadius: '8px',
    fontSize: '14px',
  },
  
  // Carrinho
  cartSection: {
    borderBottom: '1px solid #e8e8e8',
    paddingBottom: '15px',
  },
  sectionTitle: {
    color: '#333333',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 15px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  emptyCart: {
    textAlign: 'center',
    color: '#999999',
    fontSize: '14px',
    padding: '20px 0',
  },
  cartItems: {
    maxHeight: '150px',
    overflowY: 'auto',
    marginBottom: '10px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    marginBottom: '6px',
  },
  cartItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemName: {
    fontSize: '13px',
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: '12px',
    color: '#666666',
  },
  removeItemBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    padding: '4px',
  },
  cartTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #e8e8e8',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#28a745',
  },
  
  // Produtos
  productsSection: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  productsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666666',
    margin: '0 0 10px 0',
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productCard: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #e8e8e8',
  },
  productInfo: {
    marginBottom: '8px',
  },
  productName: {
    fontSize: '13px',
    display: 'block',
    marginBottom: '4px',
  },
  productDetails: {
    fontSize: '11px',
    color: '#666666',
    marginBottom: '4px',
  },
  productPrice: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2c5aa0',
  },
  addProductBtn: {
    backgroundColor: '#2c5aa0',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    width: '100%',
    justifyContent: 'center',
  },
  
  // Divisor
  divider: {
    height: '1px',
    backgroundColor: '#e8e8e8',
    margin: '5px 0',
  },
  
  // Ações
  actionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  finalizeButton: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  successText: {
    color: '#28a745',
    fontWeight: '600',
    marginBottom: '10px',
  },
  qrBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px',
  },
  qrId: {
    color: '#666666',
    fontSize: '11px',
  },
  continueButton: {
    backgroundColor: '#2c5aa0',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  errorText: {
    color: '#dc3545',
    fontWeight: '600',
    marginBottom: '10px',
  },
  retryButton: {
    backgroundColor: '#ffc107',
    color: '#333333',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
  },
  
  // Ações Secundárias
  secondaryActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default ChatPanel;