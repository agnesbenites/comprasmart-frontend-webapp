// app-frontend/src/pages/ConsultorDashboard/components/ChatPanel.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Message from '../../../shared/components/Message';
import ProductCatalog from '../../../shared/components/ProductCatalog';
import Cart from '../../../shared/components/Cart';
import QRCodeGenerator from '../../../shared/components/QRCodeGenerator';
import { formatarMoeda, formatarDataHora } from '../../../shared/utils/formatters';
import { API_CONFIG, apiPost } from '../../../shared/utils/api';

const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";
const LIGHT_GREY = "#f8f9fa";
const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

// Mock de dados iniciais
const MOCK_PRODUCTS = [
  {
    id: "SKU001",
    name: "Geladeira Inverter 400L",
    price: 3499.0,
    available: 5,
    specs: "Tecnologia No Frost, Inverter, A+++",
    category: "Eletrodomésticos",
  },
  {
    id: "SKU002",
    name: 'Smart TV 55" OLED 4K',
    price: 4899.0,
    available: 2,
    specs: "Painel OLED, 120Hz, HDMI 2.1",
    category: "Tecnologia",
  },
  {
    id: "SKU003",
    name: "Notebook Gamer Pro",
    price: 8200.0,
    available: 10,
    specs: "i7, 16GB RAM, RTX 4060",
    category: "Tecnologia",
  },
  {
    id: "SKU004",
    name: "Máquina de Lavar 12Kg",
    price: 1950.0,
    available: 8,
    specs: "Ciclo rápido, 12 programas, Cesto Inox",
    category: "Eletrodomésticos",
  },
  {
    id: "SKU005",
    name: "Fritadeira AirFryer 5L",
    price: 450.0,
    available: 20,
    specs: "Display digital, 8 predefinições",
    category: "Eletrodomésticos",
  },
];

const initialMessages = [
  {
    id: 1,
    user: "CLI-001",
    content: "Olá, preciso de ajuda para escolher uma TV para minha sala.",
    timestamp: "10:00",
    type: "inbound",
  },
  {
    id: 2,
    user: "Consultor",
    content: "Olá! Com certeza posso ajudar. Qual é o tamanho ideal que você busca?",
    timestamp: "10:01",
    type: "outbound",
  },
];

const ChatPanel = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const userName = localStorage.getItem("userName") || "Consultor(a)";
  const consultorId = localStorage.getItem("consultorId");
  
  // Estados
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [vendaId, setVendaId] = useState(null);
  
  // Dados do cliente (vem do perfil ou do atendimento)
  const [clienteData, setClienteData] = useState({
    id: "CLI-001",
    nome: "Cliente Exemplo",
    email: "cliente@example.com", // ← Virá do cadastro do app mobile
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filtro de produtos
  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enviar mensagem
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      user: "Consultor",
      content: input,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "outbound",
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  // Adicionar ao carrinho
  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Atualizar quantidade
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remover do carrinho
  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Calcular total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Finalizar venda
  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    try {
      console.log('🔄 Criando venda...');
      
      const response = await fetch(`${API_URL}/api/vendas/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultorId: consultorId,
          lojistaId: localStorage.getItem('lojistaAtual') || "858f50c0-f472-4d1d-9e6e-21952f40c7e5", // ID do lojista de teste
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
        }),
      });

      const data = await response.json();
      console.log('📊 Resposta da API:', data);

      if (data.success) {
        console.log('✅ Venda criada:', data.vendaId);
        setVendaId(data.vendaId);
        setShowQRCode(true);
      } else {
        console.error('❌ Erro:', data.error);
        alert("Erro ao criar venda: " + data.error);
      }
    } catch (error) {
      console.error("❌ Erro ao finalizar venda:", error);
      alert("Erro ao conectar com o servidor. Verifique sua conexão.");
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Modal de QR Code */}
      {showQRCode && (
        <QRCodeGenerator
          vendaId={vendaId}
          totalValue={calculateTotal()}
          items={cart}
          clienteEmail={clienteData.email}
          clienteNome={clienteData.nome}
          onClose={() => setShowQRCode(false)}
          onSuccess={() => {
            setCart([]);
            setShowQRCode(false);
            alert("✅ Venda finalizada com sucesso!");
          }}
        />
      )}

      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <button onClick={() => navigate("/consultor/dashboard")} style={styles.sidebarButton}>
            <span style={styles.sidebarIcon}>🏠</span>
            <span style={styles.sidebarText}>Home</span>
          </button>
          <div style={{ ...styles.sidebarButton, backgroundColor: "#0056b3" }}>
            <span style={styles.sidebarIcon}>💬</span>
            <span style={styles.sidebarText}>Chat</span>
          </div>
          <button onClick={() => navigate("/consultor/dashboard/analytics")} style={styles.sidebarButton}>
            <span style={styles.sidebarIcon}>📊</span>
            <span style={styles.sidebarText}>Analítico</span>
          </button>
          <button onClick={() => navigate("/consultor/dashboard/profile")} style={styles.sidebarButton}>
            <span style={styles.sidebarIcon}>👤</span>
            <span style={styles.sidebarText}>Perfil</span>
          </button>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Atendimento ao Cliente</h1>
          <button onClick={() => navigate("/consultor/dashboard/profile")} style={styles.profileLink}>
            <span style={styles.profileName}>{userName}</span>
            <img
              src="https://placehold.co/40x40/007bff/ffffff?text=C"
              alt="Foto"
              style={styles.profilePic}
            />
          </button>
        </header>

        <div style={styles.chatLayout}>
          {/* Coluna 1: Lista de Clientes */}
          <div style={styles.clientsColumn}>
            <h3 style={styles.clientsTitle}>Clientes</h3>
            <div style={{ ...styles.clientCard, borderLeft: `4px solid ${PRIMARY_COLOR}` }}>
              <strong style={{ fontSize: "0.9rem" }}>{clienteData.nome} (Ativo)</strong>
              <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                Em busca de produtos
              </span>
            </div>
          </div>

          {/* Coluna 2: Chat */}
          <div style={styles.chatColumn}>
            <div style={styles.chatHeader}>
              <h2 style={{ fontSize: "1.2rem", color: SECONDARY_COLOR }}>
                Atendimento: {clienteData.nome}
              </h2>
              <div style={styles.callActions}>
                <button style={styles.callButton}>📞 Áudio</button>
                <button style={styles.callButton}>📹 Vídeo</button>
                <button style={{ ...styles.callButton, color: "#dc3545", border: "1px solid #dc3545" }}>
                  ❌ Encerrar
                </button>
              </div>
            </div>

            <div style={styles.messagesArea}>
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  content={msg.content}
                  user={msg.user}
                  type={msg.type}
                  timestamp={msg.timestamp}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={styles.messageForm}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                style={styles.messageInput}
              />
              <button type="submit" style={styles.sendButton}>
                Enviar 💬
              </button>
            </form>
          </div>

          {/* Coluna 3: Produtos e Carrinho */}
          <div style={styles.productsColumn}>
            <h3 style={styles.productsTitle}>Produtos</h3>
            
            {/* Busca */}
            <div style={styles.searchBox}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produto..."
                style={styles.searchInput}
              />
            </div>

            {/* Lista de Produtos */}
            <div style={styles.productList}>
              {filteredProducts.map((p) => (
                <div key={p.id} style={styles.productCard}>
                  <div style={styles.productInfo}>
                    <strong style={{ fontSize: "0.9rem" }}>{p.name}</strong>
                    <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                      SKU: {p.id}
                    </span>
                    <span style={{ fontWeight: "bold", color: PRIMARY_COLOR, marginTop: "5px" }}>
                      R$ {p.price.toFixed(2)}
                    </span>
                  </div>
                  <button onClick={() => handleAddToCart(p)} style={styles.addButton}>
                    + Adicionar
                  </button>
                </div>
              ))}
            </div>

            {/* Carrinho */}
            <div style={{ marginTop: "20px" }}>
              <Cart
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onFinalize={handleFinalizeSale}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Estilos
const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: LIGHT_GREY,
    fontFamily: "Inter, sans-serif",
  },
  sidebar: {
    width: "80px",
    backgroundColor: SECONDARY_COLOR,
    padding: "20px 0",
    flexShrink: 0,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  sidebarContent: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  sidebarButton: {
    background: "none",
    border: "none",
    color: "white",
    padding: "12px 0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    borderRadius: "8px",
  },
  sidebarIcon: { fontSize: "20px" },
  sidebarText: { fontSize: "11px" },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "white",
    padding: "15px 30px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: "1.5rem",
    color: SECONDARY_COLOR,
    margin: 0,
  },
  profileLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: `2px solid ${PRIMARY_COLOR}`,
  },
  chatLayout: {
    display: "grid",
    gridTemplateColumns: "180px 1fr 350px",
    height: "calc(100vh - 70px)",
    overflow: "hidden",
  },
  clientsColumn: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRight: "1px solid #f0f0f0",
    overflowY: "auto",
  },
  clientsTitle: {
    fontSize: "1rem",
    color: SECONDARY_COLOR,
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "10px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  clientCard: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    border: "1px solid #eee",
  },
  chatColumn: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRight: "1px solid #f0f0f0",
  },
  chatHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: LIGHT_GREY,
  },
  callActions: {
    display: "flex",
    gap: "10px",
  },
  callButton: {
    padding: "6px 10px",
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "20px",
    color: SECONDARY_COLOR,
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  messagesArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#fcfcfc",
    display: "flex",
    flexDirection: "column",
  },
  messageForm: {
    padding: "10px 20px",
    borderTop: "1px solid #eee",
    display: "flex",
    gap: "10px",
    backgroundColor: "white",
  },
  messageInput: {
    flex: 1,
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "20px",
    fontSize: "0.9rem",
    outline: "none",
  },
  sendButton: {
    padding: "10px 15px",
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  productsColumn: {
    backgroundColor: "#fff",
    padding: "20px 15px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  productsTitle: {
    fontSize: "1.2rem",
    color: SECONDARY_COLOR,
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "15px",
  },
  searchBox: {
    marginBottom: "15px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "15px",
  },
  productCard: {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #eee",
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  addButton: {
    padding: "8px 12px",
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
};

export default ChatPanel;