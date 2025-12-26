import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { 
  FaUserCircle, 
  FaShoppingCart, 
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
  FaQrcode,
  FaBars,
  FaChevronLeft
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';

const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

const ChatPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para controlar menu lateral
  const [menuVisivel, setMenuVisivel] = useState(false);
  
  // Dados do cliente - vem da navegação ou do estado
  const [clienteData, setClienteData] = useState({
    id: location.state?.clienteId || "c123456",
    nome: location.state?.clienteNome || "Cliente",
    nomeVisivel: location.state?.nomeVisivel || false,
    email: location.state?.clienteEmail || "",
    status: "Ativo",
    descricao: "Em atendimento",
  });
  
  // ID do consultor logado
  const [consultorId, setConsultorId] = useState(null);
  
  // Estados principais
  const [cart, setCart] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [vendaId, setVendaId] = useState(null);
  const [saleStatus, setSaleStatus] = useState('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'consultor', text: 'Olá! Em que posso ajudar?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  
  // Estados multimídia
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOnCall, setIsOnCall] = useState(false);
  
  // Estados de produtos (carregados da API)
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatMessagesRef = useRef(null);
  
  // Carregar dados do consultor logado
  useEffect(() => {
    const carregarConsultor = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setConsultorId(user.id);
        }
      } catch (error) {
        console.error('Erro ao carregar consultor:', error);
      }
    };
    
    carregarConsultor();
  }, []);
  
  // Carregar produtos da loja atual
  useEffect(() => {
    const carregarProdutos = async () => {
      setLoadingProdutos(true);
      try {
        const lojistaId = localStorage.getItem('lojistaAtual');
        
        if (lojistaId) {
          // Buscar produtos da loja específica
          const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('loja_id', lojistaId)
            .eq('ativo', true)
            .gt('estoque', 0);
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            setProdutosDisponiveis(data.map(p => ({
              id: p.id,
              name: p.nome,
              price: parseFloat(p.preco),
              sku: p.sku || `SKU-${p.id.substring(0, 6)}`,
              categoria: p.categoria || 'Geral',
              cor: p.cor || 'N/A',
              estoque: p.estoque || 0,
              imagem: p.imagem_url
            })));
          } else {
            // Produtos de demonstração se não houver produtos cadastrados
            setProdutosDisponiveis([
              { id: 'demo1', name: 'Produto Demonstração 1', price: 99.90, sku: 'DEMO-001', categoria: 'Demo', cor: 'N/A', estoque: 10 },
              { id: 'demo2', name: 'Produto Demonstração 2', price: 149.90, sku: 'DEMO-002', categoria: 'Demo', cor: 'N/A', estoque: 5 },
            ]);
          }
        } else {
          // Sem loja selecionada - produtos de demonstração
          setProdutosDisponiveis([
            { id: 'demo1', name: 'Smartwatch X', price: 350.00, sku: 'SWX-2024', categoria: 'Eletrônicos', cor: 'Preto', estoque: 10 },
            { id: 'demo2', name: 'Fone Bluetooth', price: 120.00, sku: 'FB-2024', categoria: 'Eletrônicos', cor: 'Branco', estoque: 15 },
            { id: 'demo3', name: 'Capa Protetora', price: 45.00, sku: 'CAP-001', categoria: 'Acessórios', cor: 'Transparente', estoque: 20 },
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Fallback para produtos de demonstração
        setProdutosDisponiveis([
          { id: 'demo1', name: 'Smartwatch X', price: 350.00, sku: 'SWX-2024', categoria: 'Eletrônicos', cor: 'Preto', estoque: 10 },
          { id: 'demo2', name: 'Fone Bluetooth', price: 120.00, sku: 'FB-2024', categoria: 'Eletrônicos', cor: 'Branco', estoque: 15 },
        ]);
      } finally {
        setLoadingProdutos(false);
      }
    };
    
    carregarProdutos();
  }, []);
  
  // Filtrar produtos
  const produtosFiltrados = searchTerm 
    ? produtosDisponiveis.filter(produto =>
        produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (produto.cor && produto.cor.toLowerCase().includes(searchTerm.toLowerCase()))
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
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // TODO: Enviar mensagem via WebSocket para o cliente
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
        
        setMessages(prev => [...prev, audioMessage]);
        setIsRecording(false);
        
        // Limpar stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setAudioChunks(chunks);
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  // Vídeo - CORRIGIDO
  const toggleVideo = async () => {
    if (isVideoActive) {
      // Parar vídeo
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsVideoActive(false);
      
      const videoMessage = {
        id: messages.length + 1,
        sender: 'system',
        text: 'Chamada de vídeo encerrada',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, videoMessage]);
      
    } else {
      // Iniciar vídeo
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: true 
        });
        
        setVideoStream(stream);
        setIsVideoActive(true);
        
        // Conectar stream ao elemento de vídeo
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        const videoMessage = {
          id: messages.length + 1,
          sender: 'system',
          text: 'Chamada de vídeo iniciada',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, videoMessage]);
        
      } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
      }
    }
  };
  
  // Efeito para conectar stream ao vídeo quando ativado
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, isVideoActive]);
  
  // Imagem
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande. Máximo 5MB.');
        return;
      }
      
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
        
        setMessages(prev => [...prev, imageMessage]);
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerImageInput = () => {
    fileInputRef.current.click();
  };
  
  // Chamada de voz
  const toggleCall = () => {
    setIsOnCall(!isOnCall);
    
    const callMessage = {
      id: messages.length + 1,
      sender: 'system',
      text: isOnCall ? 'Chamada encerrada' : 'Chamada de voz iniciada',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, callMessage]);
  };
  
  // Carrinho
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };
  
  const addToCart = (product) => {
    // Verificar estoque antes de adicionar
    const itemNoCarrinho = cart.find(item => item.id === product.id);
    const quantidadeAtual = itemNoCarrinho ? itemNoCarrinho.quantity : 0;
    
    if (quantidadeAtual >= product.estoque) {
      alert(`Estoque insuficiente! Disponível: ${product.estoque} unidades.`);
      return;
    }
    
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
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const product = produtosDisponiveis.find(p => p.id === productId);
    if (product && newQuantity > product.estoque) {
      alert(`Estoque insuficiente! Disponível: ${product.estoque} unidades.`);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  // Venda
  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert("Carrinho vazio! Adicione produtos para finalizar a venda.");
      return;
    }
    
    if (!consultorId) {
      alert("Erro: Consultor não identificado. Faça login novamente.");
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
        valorTotal: parseFloat(calculateTotal()),
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
          alert("Alguns produtos estão sem estoque. Atualize o carrinho.");
        } else {
          setSaleStatus('erro');
          alert("Erro ao processar venda. Tente novamente.");
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
      alert("Erro de conexão. Verifique sua internet e tente novamente.");
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
        valorTotal: comVenda ? parseFloat(calculateTotal()) : 0,
        status: comVenda ? 'venda_concluida' : 'sem_venda',
        dataAtendimento: new Date().toISOString(),
        mensagens: messages.filter(m => m.type !== 'audio')
      };
      
      await fetch(`${API_URL}/api/atendimentos/historico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historicoPayload),
      });
      
      // Limpar estados
      setCart([]);
      setSaleStatus('idle');
      setShowQRCode(false);
      setVendaId(null);
      
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
  
  // Cleanup - MELHORADO
  useEffect(() => {
    return () => {
      // Limpar stream de vídeo
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      // Limpar gravação de áudio
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
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
    return clienteData.nomeVisivel ? clienteData.nome : `Cliente #${clienteData.id.substring(0, 6)}`;
  };
  
  // Voltar para dashboard
  const voltarParaDashboard = () => {
    if (window.confirm('Tem certeza que deseja encerrar este atendimento?')) {
      navigate('/consultor/dashboard');
    }
  };
  
  return (
    <div style={styles.container}>
      
      {/* Botão flutuante para mostrar/ocultar menu */}
      <button 
        onClick={() => setMenuVisivel(!menuVisivel)}
        style={styles.menuToggleButton}
        title={menuVisivel ? "Ocultar menu" : "Mostrar menu"}
      >
        {menuVisivel ? <FaChevronLeft /> : <FaBars />}
      </button>
      
      {/* Menu lateral - condicional */}
      {menuVisivel && (
        <div style={styles.menuLateral}>
          <h3 style={styles.menuTitle}>📋 Menu</h3>
          <button 
            onClick={() => navigate('/consultor/dashboard')}
            style={styles.menuButton}
          >
            🏠 Voltar ao Dashboard
          </button>
          <button 
            onClick={() => navigate('/consultor/dashboard/fila')}
            style={styles.menuButton}
          >
            👥 Próximo da Fila
          </button>
          <button 
            onClick={() => navigate('/consultor/dashboard/historico')}
            style={styles.menuButton}
          >
            📜 Histórico
          </button>
          <div style={styles.menuDivider} />
          <button 
            onClick={voltarParaDashboard}
            style={styles.menuDangerButton}
          >
            ❌ Encerrar Atendimento
          </button>
        </div>
      )}
      
      {/* Header simplificado */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <h1 style={styles.pageTitle}>Atendimento Ativo</h1>
            <div style={styles.headerActions}>
              <button 
                onClick={() => navigate('/consultor/dashboard')}
                style={styles.backButton}
                title="Voltar ao dashboard"
              >
                <FaChevronLeft /> Voltar
              </button>
            </div>
          </div>
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
      <div style={{
        ...styles.mainLayout,
        marginLeft: menuVisivel ? '250px' : '30px',
        transition: 'margin-left 0.3s ease'
      }}>
        
        {/* Chat */}
        <div style={styles.chatContainer}>
          
          {/* Header do Chat */}
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>💬 Chat de Atendimento</h3>
            <div style={styles.chatControls}>
              <button
                style={isOnCall ? styles.controlButtonActive : styles.controlButton}
                onClick={toggleCall}
                title="Chamada de voz"
              >
                <FaPhone size={14} />
              </button>
              <button
                style={isVideoActive ? styles.controlButtonActive : styles.controlButton}
                onClick={toggleVideo}
                title="Chamada de vídeo"
              >
                <FaVideo size={14} />
              </button>
            </div>
          </div>
          
          {/* Vídeo Ativo */}
          {isVideoActive && (
            <div style={styles.videoPreview}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={styles.videoElement}
              />
              <div style={styles.videoOverlay}>
                <button onClick={toggleVideo} style={styles.stopVideoBtn}>
                  <FaStopCircle /> Encerrar Vídeo
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
                      Seu navegador não suporta áudio.
                    </audio>
                    <span style={styles.msgTime}>{msg.time}</span>
                  </div>
                ) : msg.type === 'image' ? (
                  <div style={styles.imageContainer}>
                    <img src={msg.imageUrl} alt="Imagem enviada" style={styles.chatImage} />
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
                title={isRecording ? "Parar gravação" : "Gravar áudio"}
              >
                {isRecording ? <FaStop size={14} /> : <FaMicrophone size={14} />}
                {isRecording && <span style={styles.recordingDot} />}
              </button>
              
              <button
                onClick={triggerImageInput}
                style={styles.mediaButton}
                title="Enviar imagem"
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
                title={isVideoActive ? "Encerrar câmera" : "Iniciar câmera"}
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
              style={{
                ...styles.sendButton,
                opacity: message.trim() ? 1 : 0.5,
                cursor: message.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
        
        {/* Sidebar de Vendas */}
        <div style={styles.sidebar}>
          
          {/* Busca melhorada */}
          <div style={styles.searchContainer}>
            <div style={styles.searchBox}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar produtos (nome, SKU, categoria)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <small style={styles.searchHelp}>
              {searchTerm ? `${produtosFiltrados.length} produto(s) encontrado(s)` : 'Digite para buscar produtos'}
            </small>
          </div>
          
          {/* Carrinho */}
          <div style={styles.cartSection}>
            <h3 style={styles.sectionTitle}>
              🛒 Carrinho de Vendas ({cart.length})
            </h3>
            
            {cart.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>Carrinho vazio</p>
                <p style={styles.emptySubtext}>Adicione produtos da lista abaixo</p>
              </div>
            ) : (
              <div style={styles.cartItems}>
                {cart.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <div style={styles.cartItemInfo}>
                      <span style={styles.itemName}>{item.name}</span>
                      <div style={styles.itemActions}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={styles.quantityButton}
                        >
                          -
                        </button>
                        <span style={styles.itemQuantity}>{item.quantity}x</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={styles.quantityButton}
                          disabled={item.quantity >= (item.estoque || 99)}
                        >
                          +
                        </button>
                        <span style={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={styles.removeItemBtn}
                      title="Remover item"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {cart.length > 0 && (
              <div style={styles.cartTotal}>
                <span>Total:</span>
                <span style={styles.totalValue}>R$ {calculateTotal()}</span>
              </div>
            )}
          </div>
          
          {/* Produtos */}
          <div style={styles.productsSection}>
            <div style={styles.sectionHeader}>
              <h4 style={styles.productsTitle}>
                📦 Produtos Disponíveis 
                {loadingProdutos && ' (Carregando...)'}
              </h4>
              {!loadingProdutos && (
                <small style={styles.stockInfo}>
                  {produtosDisponiveis.length} produtos em estoque
                </small>
              )}
            </div>
            <div style={styles.productsList}>
              {produtosFiltrados.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>Nenhum produto encontrado</p>
                  <p style={styles.emptySubtext}>Tente outra busca ou limpe o filtro</p>
                </div>
              ) : (
                produtosFiltrados.map(produto => (
                  <div key={produto.id} style={styles.productCard}>
                    <div style={styles.productHeader}>
                      <strong style={styles.productName}>{produto.name}</strong>
                      <div style={styles.productBadges}>
                        {produto.estoque < 5 && (
                          <span style={styles.lowStockBadge}>⚠️ Baixo estoque</span>
                        )}
                      </div>
                    </div>
                    <div style={styles.productDetails}>
                      <small>SKU: {produto.sku}</small>
                      <small>Categoria: {produto.categoria}</small>
                      {produto.cor !== 'N/A' && <small>Cor: {produto.cor}</small>}
                      <small style={{ 
                        color: produto.estoque < 1 ? '#dc3545' : 
                               produto.estoque < 5 ? '#ffc107' : '#28a745'
                      }}>
                        Estoque: {produto.estoque}
                      </small>
                    </div>
                    <div style={styles.productFooter}>
                      <div style={styles.productPrice}>R$ {produto.price.toFixed(2)}</div>
                      <button
                        onClick={() => addToCart(produto)}
                        style={{
                          ...styles.addProductBtn,
                          opacity: produto.estoque > 0 ? 1 : 0.5,
                          cursor: produto.estoque > 0 ? 'pointer' : 'not-allowed'
                        }}
                        disabled={produto.estoque === 0}
                        title={produto.estoque === 0 ? 'Produto indisponível' : 'Adicionar ao carrinho'}
                      >
                        <FaPlus size={12} /> {produto.estoque > 0 ? 'Adicionar' : 'Esgotado'}
                      </button>
                    </div>
                  </div>
                ))
              )}
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
                style={{
                  ...styles.finalizeButton,
                  opacity: (cart.length === 0 || saleStatus === 'processando') ? 0.6 : 1,
                  cursor: (cart.length === 0 || saleStatus === 'processando') ? 'not-allowed' : 'pointer'
                }}
              >
                {saleStatus === 'processando' ? (
                  '🔄 Processando...'
                ) : (
                  <>
                    <FaQrcode /> Finalizar Venda e Gerar QR Code
                  </>
                )}
              </button>
            ) : saleStatus === 'sucesso' ? (
              <div style={styles.successBox}>
                <p style={styles.successText}>✅ Venda criada com sucesso!</p>
                {showQRCode && vendaId && (
                  <div style={styles.qrBox}>
                    <QRCode 
                      value={`https://suacomprasmart.com.br/pagamento/${vendaId}`} 
                      size={120} 
                    />
                    <small style={styles.qrId}>Código: {vendaId.substring(0, 8)}...</small>
                    <p style={styles.qrInstructions}>
                      Cliente pode pagar escaneando este QR Code
                    </p>
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
                <p style={styles.errorText}>⚠️ Estoque insuficiente</p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Alguns produtos não estão mais disponíveis.
                </p>
                <button
                  onClick={() => setSaleStatus('idle')}
                  style={styles.retryButton}
                >
                  Revisar Carrinho
                </button>
              </div>
            ) : (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>❌ Erro na venda</p>
                <button
                  onClick={() => setSaleStatus('idle')}
                  style={styles.retryButton}
                >
                  Tentar Novamente
                </button>
              </div>
            )}
            
            <div style={styles.secondaryActions}>
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

// Estilos
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  
  // Botão flutuante para menu
  menuToggleButton: {
    position: 'fixed',
    left: '15px',
    top: '15px',
    zIndex: 1000,
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  
  // Menu lateral
  menuLateral: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '240px',
    height: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    zIndex: 999,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  menuTitle: {
    color: '#2c5aa0',
    fontSize: '18px',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  menuButton: {
    backgroundColor: '#f8f9fa',
    color: '#333',
    border: '1px solid #ddd',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  menuDangerButton: {
    backgroundColor: '#fff5f5',
    color: '#dc3545',
    border: '1px solid #f5c6cb',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'all 0.2s',
    marginTop: '10px',
  },
  menuDivider: {
    height: '1px',
    backgroundColor: '#eee',
    margin: '10px 0',
  },
  
  // Header
  header: {
    backgroundColor: '#ffffff',
    padding: '20px 30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    transition: 'margin-left 0.3s ease',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  pageTitle: {
    color: '#2c5aa0',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  backButton: {
    backgroundColor: '#f8f9fa',
    color: '#666',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
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
    transition: 'margin-left 0.3s ease',
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
    gap: '8px',
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
    transition: 'all 0.2s',
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
  
  // Vídeo
  videoPreview: {
    position: 'relative',
    backgroundColor: '#000000',
    borderBottom: '1px solid #e8e8e8',
    height: '300px',
  },
  videoElement: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  stopVideoBtn: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  
  // Mensagens
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  msgConsultor: {
    alignSelf: 'flex-end',
    backgroundColor: '#2c5aa0',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '16px 16px 4px 16px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  msgCliente: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    color: '#333333',
    padding: '12px 16px',
    borderRadius: '16px 16px 16px 4px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  msgSystem: {
    alignSelf: 'center',
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '8px 16px',
    borderRadius: '16px',
    fontSize: '12px',
  },
  msgTime: {
    display: 'block',
    fontSize: '10px',
    opacity: 0.7,
    marginTop: '4px',
    textAlign: 'right',
  },
  audioContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  audioPlayer: {
    height: '32px',
    maxWidth: '200px',
  },
  imageContainer: {
    maxWidth: '100%',
  },
  chatImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    display: 'block',
  },
  
  // Input de Mensagem
  inputContainer: {
    padding: '15px 20px',
    borderTop: '1px solid #e8e8e8',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
  },
  mediaButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mediaButton: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    color: '#666666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
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
    animation: 'pulse 1s infinite',
  },
  recordingDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
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
    transition: 'opacity 0.2s',
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
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
  
  // Busca melhorada
  searchContainer: {
    marginBottom: '10px',
  },
  searchBox: {
    position: 'relative',
    marginBottom: '8px',
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
    padding: '12px 12px 12px 40px',
    border: '1px solid #dddddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  searchHelp: {
    color: '#666',
    fontSize: '11px',
    paddingLeft: '5px',
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
  emptyState: {
    textAlign: 'center',
    padding: '20px 0',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  emptyText: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 5px 0',
  },
  emptySubtext: {
    color: '#999',
    fontSize: '12px',
    margin: 0,
  },
  cartItems: {
    maxHeight: '200px',
    overflowY: 'auto',
    marginBottom: '10px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #eee',
  },
  cartItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  itemName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#333',
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  quantityButton: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemQuantity: {
    fontSize: '12px',
    color: '#666',
    minWidth: '20px',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#28a745',
    marginLeft: '8px',
  },
  removeItemBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  cartTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #e8e8e8',
    marginTop: '10px',
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
  sectionHeader: {
    marginBottom: '10px',
  },
  productsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666666',
    margin: '0 0 5px 0',
  },
  stockInfo: {
    color: '#999',
    fontSize: '11px',
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  productCard: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e8e8e8',
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px',
  },
  productName: {
    fontSize: '13px',
    display: 'block',
    flex: 1,
  },
  productBadges: {
    marginLeft: '8px',
  },
  lowStockBadge: {
    fontSize: '9px',
    color: '#ffc107',
    backgroundColor: '#fff3cd',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  productDetails: {
    fontSize: '11px',
    color: '#666666',
    marginBottom: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    transition: 'opacity 0.2s',
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
    transition: 'opacity 0.2s',
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
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
  },
  qrId: {
    color: '#666666',
    fontSize: '11px',
  },
  qrInstructions: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
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

// Adicionar animação para o ponto de gravação
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`, styleSheet.cssRules.length);

export default ChatPanel;