import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// --- Constantes de Estilo Compartilhadas (Minimalista) ---
const PRIMARY_COLOR = "#007bff";
const SECONDARY_COLOR = "#495057";
const LIGHT_GREY = "#f8f9fa";

// --- Componente Placeholder para Mensagem (Resolvendo o erro de importação) ---
const Message = ({ user, content, type, timestamp }) => {
  const isConsultor = type === "outbound";
  // Estilos ajustados para minimalismo: cores suaves
  const align = isConsultor ? "flex-end" : "flex-start";
  const backgroundColor = isConsultor ? "#e9eff6" : "#ffffff"; // Cinza/Azul claro suave
  const color = "#333";

  const style = {
    alignSelf: align,
    maxWidth: "70%",
    padding: "10px 15px",
    margin: "5px 0",
    borderRadius: "12px", // Cantos arredondados suaves
    backgroundColor: backgroundColor,
    color: color,
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)", // Sombra mais discreta
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
  };

  const userStyle = {
    fontSize: "0.7rem",
    color: isConsultor ? PRIMARY_COLOR : SECONDARY_COLOR, // Azul sutil para consultor, cinza escuro para cliente
    marginBottom: "3px",
    fontWeight: "600",
    textAlign: "left",
  };

  const timestampStyle = {
    fontSize: "0.65rem",
    color: "#999",
    marginTop: "5px",
    display: "block",
    textAlign: "right",
    alignSelf: "flex-end",
  };

  return (
    <div style={style}>
      <span style={userStyle}>{user}</span>
      <p style={{ margin: 0, overflowWrap: "break-word" }}>{content}</p>
      <span style={timestampStyle}>{timestamp}</span>
    </div>
  );
};
// FIM do Componente Placeholder

// --- Mock de Dados ---
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

// --- Mock de Chat ---
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
    content:
      "Olá! Com certeza posso ajudar. Qual é o tamanho ideal que você busca?",
    timestamp: "10:01",
    type: "outbound",
  },
];

const ChatPanel = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const userName = localStorage.getItem("userName") || "Consultor(a)";

  // Estados
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showDetails, setShowDetails] = useState(null); // Produto selecionado para detalhes
  const [modalVisible, setModalVisible] = useState(false); // Modal de QR Code/Finalização

  // Lógica de Busca de Produtos
  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Funções de Chat ---
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

  // --- Funções de Vendas ---
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

  const updateCartQuantity = (id, change) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    ); // Remove se a quantidade for 0
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      console.error("O carrinho está vazio.");
      return;
    }
    // Lógica para simular a geração de QR Code e envio de e-mail
    setModalVisible(true);
  };

  // --- Renderização de Componentes Internos ---
  const renderProductDetails = () => {
    if (!showDetails) return null;
    return (
      <div style={styles.detailsModal}>
        <h5 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
          {showDetails.name}
        </h5>
        <p style={styles.specItem}>**SKU:** {showDetails.id}</p>
        <p style={styles.specItem}>
          **Preço:** R$ {showDetails.price.toFixed(2)}
        </p>
        <p style={styles.specItem}>
          **Estoque:** {showDetails.available} unidades
        </p>
        <p style={styles.specItem}>**Especificações:** {showDetails.specs}</p>
        <button
          onClick={() => {
            handleAddToCart(showDetails);
            setShowDetails(null);
          }}
          style={{
            ...styles.actionButton,
            backgroundColor: PRIMARY_COLOR,
            marginTop: "10px",
          }}
        >
          Adicionar ao Carrinho ({showDetails.id})
        </button>
        <button
          onClick={() => setShowDetails(null)}
          style={{
            ...styles.secondaryButton,
            marginTop: "10px",
            marginLeft: "10px",
          }}
        >
          Fechar
        </button>
      </div>
    );
  };

  const renderCart = () => (
    <div style={styles.cartContainer}>
      <h4 style={styles.cartTitle}>🛒 Carrinho ({cart.length})</h4>
      {cart.length === 0 ? (
        <p style={{ fontSize: "0.9rem", color: "#6c757d" }}>
          Nenhum produto adicionado.
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <span style={{ flex: 1, fontSize: "0.9rem" }}>{item.name}</span>
              <div style={styles.cartQuantityControl}>
                <button
                  onClick={() => updateCartQuantity(item.id, -1)}
                  style={styles.quantityButton}
                >
                  -
                </button>
                <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, 1)}
                  style={styles.quantityButton}
                >
                  +
                </button>
              </div>
              <span
                style={{
                  width: "90px",
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#dc3545",
                }}
              >
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={styles.cartTotal}>
            <span>TOTAL:</span>
            <span>R$ {calculateTotal()}</span>
          </div>
          <button
            onClick={handleFinalizeSale}
            style={{
              ...styles.actionButton,
              backgroundColor: PRIMARY_COLOR,
              width: "100%",
              marginTop: "15px",
            }}
          >
            Finalizar Venda & Gerar QR Code
          </button>
        </>
      )}
    </div>
  );

  const renderProductSearch = () => (
    <>
      <div style={styles.searchBox}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDetails(null); // Fecha detalhes ao buscar
          }}
          placeholder="Buscar produto (Nome, SKU, QR Code)"
          style={styles.searchInput}
        />
        <button style={styles.searchButton}>🔍</button>
      </div>

      {renderProductDetails()}

      <div style={styles.productList}>
        {filteredProducts.map((p) => (
          <div key={p.id} style={styles.productCard}>
            <div style={styles.productInfo}>
              <strong style={{ fontSize: "0.95rem" }}>{p.name}</strong>
              <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                SKU: {p.id}
              </span>
            </div>
            <div style={styles.productActions}>
              <span style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>
                R$ {p.price.toFixed(2)}
              </span>
              <button
                onClick={() => setShowDetails(p)}
                style={styles.detailsButton}
              >
                + Info
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div style={styles.appContainer}>
      {/* 1. Modal de Finalização (Simulado) */}
      {modalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Venda Finalizada com Sucesso!</h3>
            <p>O total da compra é de **R$ {calculateTotal()}**.</p>
            <div style={styles.qrCodeContainer}>
              {/* QR Code Simulado */}
              <span style={{ fontSize: "3rem" }}>🔗</span>
              <p>QR Code gerado para leitura no caixa.</p>
            </div>
            <p style={{ marginTop: "15px", color: "#dc3545" }}>
              A lista de produtos também foi enviada por e-mail para o cliente.
            </p>
            <button
              onClick={() => {
                setModalVisible(false);
                setCart([]);
              }}
              style={{
                ...styles.actionButton,
                backgroundColor: SECONDARY_COLOR,
                width: "100%",
                marginTop: "20px",
              }}
            >
              Fechar e Limpar Carrinho
            </button>
          </div>
        </div>
      )}

      {/* 2. Menu Lateral (Compacto) - CORRIGIDO */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          {/* Botão Home */}
          <button
            onClick={() => navigate("/dashboard")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>🏠</span>
            <span style={styles.sidebarText}>Home</span>
          </button>
          {/* Botão Chat (Ativo) */}
          <div style={{ ...styles.sidebarButton, backgroundColor: "#0056b3" }}>
            <span style={styles.sidebarIcon}>💬</span>
            <span style={styles.sidebarText}>Chat</span>
          </div>
          {/* Botão Analytics */}
          <button
            onClick={() => navigate("/analytics")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>📊</span>
            <span style={styles.sidebarText}>Analítico</span>
          </button>
          {/* Botão Perfil */}
          <button
            onClick={() => navigate("/profile")}
            style={styles.sidebarButton}
          >
            <span style={styles.sidebarIcon}>👤</span>
            <span style={styles.sidebarText}>Perfil</span>
          </button>
        </div>
      </nav>

      {/* 3. Conteúdo Principal (3 Colunas: Clientes | Chat | Vendas) */}
      <main style={styles.mainContent}>
        {/* Header Superior com Perfil (PADRÃO) - CORRIGIDO */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Atendimento ao Cliente</h1>
          <button
            onClick={() => navigate("/profile")}
            style={styles.profileLink}
          >
            <span style={styles.profileName}>{userName}</span>
            <img
              src="https://placehold.co/40x40/007bff/ffffff?text=C"
              alt="Foto do Consultor"
              style={styles.profilePic}
            />
          </button>
        </header>

        <div style={styles.chatLayout}>
          {/* Coluna 1: Lista de Clientes (Compacta) */}
          <div style={styles.clientsColumn}>
            <h3 style={styles.clientsTitle}>Clientes</h3>
            <div
              style={{
                ...styles.clientCard,
                borderLeft: "4px solid " + PRIMARY_COLOR,
              }}
            >
              <strong style={{ fontSize: "0.9rem" }}>CLI-001 (Ativo)</strong>
              <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                Em busca de TV
              </span>
            </div>
            <div style={{ ...styles.clientCard, borderLeft: "4px solid #ddd" }}>
              <strong style={{ fontSize: "0.9rem" }}>CLI-002</strong>
              <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                Pendente
              </span>
            </div>
          </div>

          {/* Coluna 2: Área de Chat e Ações */}
          <div style={styles.chatColumn}>
            <div style={styles.chatHeader}>
              <h2 style={{ fontSize: "1.2rem", color: SECONDARY_COLOR }}>
                Atendimento: CLI-001
              </h2>
              <div style={styles.callActions}>
                {/* Botões de Ação de Chamada em estilo outline/sutil */}
                <button style={styles.callButton}>📞 Áudio</button>
                <button style={styles.callButton}>📹 Vídeo</button>
                <button
                  style={{
                    ...styles.callButton,
                    color: "#dc3545",
                    border: "1px solid #dc3545",
                  }}
                >
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
              <div ref={messagesEndRef} /> {/* Ponto de rolagem */}
            </div>

            <form onSubmit={handleSendMessage} style={styles.messageForm}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem ou envie um produto..."
                style={styles.messageInput}
              />
              <button type="submit" style={styles.sendButton}>
                Enviar 💬
              </button>
            </form>
          </div>

          {/* Coluna 3: Painel de Produtos e Vendas */}
          <div style={styles.productsColumn}>
            <h3 style={styles.productsTitle}>Assistente de Vendas</h3>
            <div style={styles.productSalesArea}>{renderProductSearch()}</div>
            {renderCart()}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Estilos Minimalistas ---
const styles = {
  // LAYOUT ESTRUTURAL
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: LIGHT_GREY,
    fontFamily: "Inter, sans-serif",
  },
  // 2. Menu Lateral (Compacto)
  sidebar: {
    width: "80px", // Aumentado para 80px para padronização
    backgroundColor: SECONDARY_COLOR,
    padding: "20px 0",
    flexShrink: 0,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    transition: "background-color 0.2s",
  },
  sidebarIcon: { fontSize: "20px" },
  sidebarText: { fontSize: "11px" },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  // HEADER (Padronizado com HomePanel/AnalyticsPanel)
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
    textDecoration: "none",
    color: SECONDARY_COLOR,
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
  // CHAT LAYOUT
  chatLayout: {
    display: "grid",
    gridTemplateColumns: "180px 1fr 350px", // Ajustado para corresponder ao padrão
    height: "calc(100vh - 70px)", // Subtrai a altura do cabeçalho
    overflow: "hidden",
  },
  // Coluna 1: Clientes
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
    cursor: "pointer",
    marginBottom: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    border: "1px solid #eee",
    transition: "border-color 0.2s",
  },
  // Coluna 2: Chat
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
    transition: "background-color 0.2s, border-color 0.2s",
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
    transition: "border-color 0.2s",
  },
  sendButton: {
    padding: "10px 15px",
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  // Coluna 3: Produtos
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
  productSalesArea: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: "15px",
  },
  searchBox: {
    display: "flex",
    gap: "5px",
    marginBottom: "15px",
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
  },
  searchButton: {
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    border: "none",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  productCard: {
    backgroundColor: "#fff",
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
    alignItems: "flex-start",
  },
  productActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  detailsButton: {
    backgroundColor: LIGHT_GREY,
    color: SECONDARY_COLOR,
    border: "1px solid #ddd",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.8rem",
  },
  // Carrinho
  cartContainer: {
    padding: "15px",
    borderTop: "1px solid #eee",
    backgroundColor: LIGHT_GREY,
    borderRadius: "8px",
    marginTop: "15px",
  },
  cartTitle: {
    color: SECONDARY_COLOR,
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px dotted #ddd",
  },
  cartQuantityControl: {
    display: "flex",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "2px 8px",
    cursor: "pointer",
    fontSize: "0.8rem",
    color: SECONDARY_COLOR,
  },
  cartTotal: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: SECONDARY_COLOR,
  },
  actionButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    padding: "10px 15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    color: SECONDARY_COLOR,
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  // Modal de Detalhes
  detailsModal: {
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    textAlign: "left",
    position: "relative",
    zIndex: 10,
  },
  specItem: {
    fontSize: "0.9rem",
    margin: "3px 0",
    color: "#6c757d",
  },
  // Modal de Finalização (QR Code)
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fundo mais claro
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    width: "450px",
    textAlign: "center",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
  },
  qrCodeContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: LIGHT_GREY,
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
};

export default ChatPanel;
