// app-frontend/src/App.jsx
// VERSÃO COMPLETA - Mantendo todos os componentes inline + novas rotas

import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

// --- IMPORTANDO COMPONENTES EXTERNOS ---
import Landingpage from "./pages/Landingpage";
import LoginPage from "./pages/LoginPage";
import TermsPage from "./pages/TermsPage";

// --- CONSULTOR COMPONENTES (se existirem como arquivos separados) ---
// Descomente conforme você for criando os arquivos
// import ConsultorDashboard from "./pages/ConsultorDashboard/pages/ConsultorDashboard";
// import QueuePanel from "./pages/ConsultorDashboard/components/QueuePanel";
// import ChatPanel from "./pages/ConsultorDashboard/components/ChatPanel";
// ... etc

// --- CONSTANTES GLOBAIS ---
const API_URL = "https://plataforma-consultoria-mvp.onrender.com";
const QR_CODE_PLACEHOLDER = "https://placehold.co/128x128/2563eb/ffffff?text=QR+CODE";

// --- DADOS MOCK ---
const MOCK_CONSULTOR_INFO = {
  nome: "Agnes Consultora",
  segmentos: ["Eletrodomésticos", "Tecnologia", "Móveis"],
  lojasAtendidas: 7,
  comissaoAcumulada: 12500.5,
  atendimentosMes: 45,
  ratingMedio: 4.8,
};

// =======================================================================
// === PLACEHOLDERS E UTILITÁRIOS =======================================
// =======================================================================
const PlaceholderPage = ({ title, children }) => (
  <div className="p-8 bg-white rounded-xl shadow-lg m-4">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    {children ?? <p className="text-gray-500 mt-2">Conteúdo em desenvolvimento.</p>}
  </div>
);

const ProtectedRoute = ({ component: Component, redirectTo = "/login" }) => {
  const isAuthenticated = true; // TODO: Implementar verificação real
  return isAuthenticated ? <Component /> : <Navigate to={redirectTo} replace />;
};

// =======================================================================
// === LOGINSPANEL (não LoginsPage!) =====================================
// =======================================================================
const LoginsPanel = () => {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    margin: 0,
    fontFamily: "Inter, sans-serif",
    width: "100%",
    boxSizing: "border-box",
  };

  const contentWrapperStyle = {
    textAlign: "center",
    width: "100%",
    maxWidth: "1000px",
    padding: "50px",
    borderRadius: "15px",
    backgroundColor: "white",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  };

  const cardBaseStyle = {
    padding: "40px 30px",
    backgroundColor: "#f8f9fa",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    cursor: "pointer",
    flex: "1 1 350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    border: "4px solid transparent",
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        <img
          src="/img/logo.png"
          alt="Compra Smart"
          style={{ width: 150, margin: "0 auto 20px" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <h1 style={{ color: "#2c5aa0", fontSize: "2.5rem", margin: 0 }}>
          Compra Smart
        </h1>
        <p style={{ color: "#666", marginTop: 8 }}>Sistema Inteligente de Consultoria</p>

        <div style={{ display: "flex", gap: 30, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
          <div
            style={cardBaseStyle}
            onClick={() => navigate("/consultor/login")}
            role="button"
            tabIndex={0}
          >
            <div style={{ fontSize: 60, marginBottom: 20 }}>👨‍💼</div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: 8, color: "#007bff" }}>Consultor</h2>
            <p style={{ color: "#666" }}>Acesso ao sistema de consultoria de compras</p>
          </div>

          <div
            style={cardBaseStyle}
            onClick={() => navigate("/lojista/escolha")}
            role="button"
            tabIndex={0}
          >
            <div style={{ fontSize: 60, marginBottom: 20 }}>🏪</div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: 8, color: "#28a745" }}>Lojista</h2>
            <p style={{ color: "#666" }}>Área administrativa e de vendas</p>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <a
            onClick={() => navigate("/vendedor/login")}
            style={{ color: "#2c5aa0", textDecoration: "underline", cursor: "pointer", fontSize: "1.05rem" }}
          >
            Acesso Direto Vendedor
          </a>
        </div>
      </div>
    </div>
  );
};

// =======================================================================
// === LAYOUT DO DASHBOARD (SIDEBAR) =====================================
// =======================================================================
const CONSULTOR_MENU_ITEMS = [
  { title: "🏠 Home", icon: "🏠", rota: "/consultor/dashboard" },
  { title: "📞 Fila de Atendimento", icon: "📞", rota: "/consultor/dashboard/fila" },
  { title: "💬 Atendimento Ativo", icon: "💬", rota: "/consultor/dashboard/chat" },
  { title: "📖 Histórico", icon: "📖", rota: "/consultor/dashboard/historico" },
  { title: "💰 Comissões", icon: "💰", rota: "/consultor/dashboard/analytics" },
  { title: "🏪 Minhas Lojas", icon: "🏪", rota: "/consultor/dashboard/lojas" },
  { title: "⭐ Avaliações", icon: "⭐", rota: "/consultor/dashboard/reviews" },
  { title: "🎓 Treinamentos", icon: "🎓", rota: "/consultor/dashboard/treinamentos" },
  { title: "👤 Perfil", icon: "👤", rota: "/consultor/dashboard/profile" },
];

const DashboardLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const userName = localStorage.getItem("userName") || MOCK_CONSULTOR_INFO.nome;

  const getMenuItemStyle = (rota) => {
    const isActive = currentPath === rota || (rota !== "/consultor/dashboard" && currentPath.startsWith(rota));
    return `flex items-center p-3 my-1 rounded-l-full mr-4 transition-all duration-200 text-sm ${
      isActive ? "bg-blue-100 font-bold text-blue-800 border-l-4 border-blue-800" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
    }`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-xl flex-shrink-0">
        <h2 className="text-2xl font-extrabold text-blue-800 p-6 text-center border-b border-gray-100">Autônomo</h2>
        <nav className="mt-4">
          {CONSULTOR_MENU_ITEMS.map((item) => (
            <Link key={item.rota} to={item.rota} className={getMenuItemStyle(item.rota)}>
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.title.substring(item.title.indexOf(" ") + 1)}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-grow flex flex-col w-[calc(100%-16rem)] overflow-x-hidden">
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-semibold text-blue-800">Painel do Consultor</h1>
            <p className="text-sm text-gray-500">Bem-vindo(a), {userName}</p>
          </div>
          <Link to="/consultor/dashboard/profile" className="flex items-center gap-2 p-2 px-4 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            👤 <span className="text-sm font-medium">Meu Perfil</span>
          </Link>
        </header>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// =======================================================================
// === COMPONENTES DO CONSULTOR (HOME, FILA, CHAT) ========================
// =======================================================================
const MetricCard = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-500" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-500" },
    teal: { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-500" },
  };
  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`p-6 rounded-xl shadow-md flex items-center justify-between ${classes.bg} border-l-4 ${classes.border}`}>
      <div>
        <p className={`text-sm font-semibold uppercase ${classes.text}`}>{title}</p>
        <p className="text-4xl font-extrabold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`text-4xl p-3 rounded-full ${classes.text} opacity-50`}>{icon}</div>
    </div>
  );
};

const ConsultorHomePanel = () => {
  const navigate = useNavigate();
  const consultorInfo = MOCK_CONSULTOR_INFO;

  const atalhos = [
    { titulo: "📞 Próximo da Fila", descricao: "Iniciar um novo atendimento da fila prioritária", cor: "bg-blue-500 hover:bg-blue-600", rota: "/consultor/dashboard/fila" },
    { titulo: "🏪 Lojas Atendidas", descricao: "Gerenciar minhas lojas e configurar categorias", cor: "bg-green-500 hover:bg-green-600", rota: "/consultor/dashboard/lojas" },
    { titulo: "💰 Sacar Comissão", descricao: "Ver detalhes de comissão e solicitar saque", cor: "bg-yellow-500 hover:bg-yellow-600", rota: "/consultor/dashboard/analytics" },
    { titulo: "💬 Chat Ativo", descricao: "Acessar atendimentos em andamento", cor: "bg-teal-500 hover:bg-teal-600", rota: "/consultor/dashboard/chat" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-blue-800 mb-1">🎯 Olá, {consultorInfo.nome}!</h1>
          <p className="text-gray-600 mb-4">Segmentos de Atuação: {consultorInfo.segmentos.join(", ")}</p>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-700 mr-4">
              <span className="inline mr-2 text-teal-600">🏪</span> Atendendo {consultorInfo.lojasAtendidas} Lojas
            </h3>
            <button onClick={() => navigate("/consultor/dashboard/lojas")} className="bg-teal-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors hover:bg-teal-700">
              Ver Detalhes das Lojas
            </button>
          </div>
        </div>

        <div className="text-center bg-green-50 p-4 rounded-xl border-2 border-green-300 min-w-[200px] shadow-inner">
          <div className="text-xs text-green-700 font-medium mb-1">Comissão Acumulada</div>
          <div className="text-3xl font-extrabold text-green-600 mb-3">
            R$ {consultorInfo.comissaoAcumulada.toFixed(2).replace(".", ",")}
          </div>
          <button onClick={() => navigate("/consultor/dashboard/analytics")} className="w-full bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors hover:bg-green-700 shadow-md">
            <span className="inline mr-2">💰</span> Sacar Agora
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-blue-800 mb-4">🚀 Ações de Atendimento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {atalhos.map((atalho, index) => (
          <div key={index} onClick={() => navigate(atalho.rota)} className={`bg-white p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border-l-4 ${atalho.cor.includes("blue") ? "border-blue-500" : atalho.cor.includes("green") ? "border-green-500" : atalho.cor.includes("yellow") ? "border-yellow-500" : "border-teal-500"}`}>
            <h3 className={`text-xl font-bold ${atalho.cor.includes("blue") ? "text-blue-700" : atalho.cor.includes("green") ? "text-green-700" : atalho.cor.includes("yellow") ? "text-yellow-700" : "text-teal-700"}`}>
              {atalho.titulo}
            </h3>
            <p className="text-gray-500 mt-2 text-sm">{atalho.descricao}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-blue-800 mb-4">📈 Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Atendimentos (Mês)" value={consultorInfo.atendimentosMes} icon="📞" color="blue" />
        <MetricCard title="Rating Médio" value={`${consultorInfo.ratingMedio} / 5.0`} icon="⭐" color="yellow" />
        <MetricCard title="Lojas Ativas" value={consultorInfo.lojasAtendidas} icon="🏪" color="teal" />
      </div>
    </div>
  );
};

const FilaPanel = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("disponivel");
  const [filaAtendimento, setFilaAtendimento] = useState([]);
  const [atendimentosAtivos, setAtendimentosAtivos] = useState([]);

  useEffect(() => {
    const mockCalls = [
      { id: 1, clienteNome: "Maria Silva", nomeVisivel: true, tipo: "mensagem", loja: "Loja Eletrônicos", setor: "Smartphones", tempoEspera: "2 min", prioridade: "normal" },
      { id: 2, clienteNome: "João Santos", nomeVisivel: false, tipo: "mensagem", loja: "Tech Store", setor: "Notebooks", tempoEspera: "5 min", prioridade: "urgente" },
      { id: 3, clienteNome: "Cliente Vídeo", nomeVisivel: true, tipo: "video", loja: "Mega Móveis", setor: "Sofás", tempoEspera: "1 min", prioridade: "normal" },
    ];

    if (status === "disponivel" && atendimentosAtivos.length < 3) {
      const availableCalls = mockCalls.filter((c) => !atendimentosAtivos.find((a) => a.id === c.id));
      setFilaAtendimento(availableCalls);
    } else {
      setFilaAtendimento([]);
    }
  }, [status, atendimentosAtivos]);

  const aceitarChamada = (chamada) => {
    const isVideoCall = chamada.tipo === "video" || chamada.tipo === "voz";
    const activeVideoCount = atendimentosAtivos.filter((a) => a.tipo === "video" || a.tipo === "voz").length;
    const activeMessageCount = atendimentosAtivos.filter((a) => a.tipo === "mensagem").length;

    if (isVideoCall && activeVideoCount >= 1) {
      alert("Limite atingido! Você só pode atender 1 chamada de vídeo/voz por vez.");
      return;
    }
    if (!isVideoCall && activeMessageCount >= 3) {
      alert("Limite atingido! Você só pode atender 3 clientes por mensagem por vez.");
      return;
    }

    setAtendimentosAtivos((prev) => [...prev, chamada]);
    setFilaAtendimento((prev) => prev.filter((c) => c.id !== chamada.id));
    navigate(`/consultor/dashboard/chat?atendimentoId=${chamada.id}`);

    if (isVideoCall || activeMessageCount + 1 >= 3) {
      setStatus("ocupado");
    }
  };

  const recusarChamada = (chamadaId) => {
    setFilaAtendimento((prev) => prev.filter((c) => c.id !== chamadaId));
  };

  const toggleDisponibilidade = () => {
    if (atendimentosAtivos.length > 0) {
      alert("Finalize os atendimentos ativos antes de mudar o status.");
      return;
    }
    setStatus((prev) => (prev === "disponivel" ? "offline" : "disponivel"));
  };

  const atendimentosMensagem = atendimentosAtivos.filter((a) => a.tipo === "mensagem").length;
  const atendimentosVideoVoz = atendimentosAtivos.filter((a) => a.tipo === "video" || a.tipo === "voz").length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 md:mb-0">📞 Fila de Atendimento</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={toggleDisponibilidade} className={`text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors ${status === "disponivel" ? "bg-green-600 hover:bg-green-700" : status === "ocupado" ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-gray-500 hover:bg-gray-600"}`} disabled={atendimentosAtivos.length > 0}>
            {status === "disponivel" ? "✅ Disponível" : status === "ocupado" ? "⏳ Em Atendimento" : "📴 Offline"}
          </button>

          {atendimentosAtivos.length > 0 && (
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full text-xs">💬 Msg: {atendimentosMensagem}/3</span>
              <span className="bg-purple-100 text-purple-800 font-semibold px-4 py-2 rounded-full text-xs">📹 Vídeo/Voz: {atendimentosVideoVoz}/1</span>
            </div>
          )}

          <div className="bg-blue-50 text-blue-800 font-semibold px-4 py-2 rounded-full text-sm">👥 {filaAtendimento.length} na fila</div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg mb-6 shadow-sm">
        <p className="font-semibold text-sm mb-1">Aviso Importante:</p>
        <p className="text-xs">Todas as interações podem ser gravadas para fins de qualidade e segurança.</p>
      </div>

      {atendimentosAtivos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-3">💬 Atendimentos em Andamento:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atendimentosAtivos.map((atendimento) => (
              <div key={atendimento.id} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-md flex justify-between items-center">
                <div>
                  <p className="text-md font-bold text-blue-800">
                    {atendimento.tipo === "video" ? "📹" : atendimento.tipo === "voz" ? "📞" : "💬"} {atendimento.nomeVisivel ? atendimento.clienteNome : "Cliente Anônimo"}
                  </p>
                  <p className="text-sm text-gray-600">{atendimento.loja} - {atendimento.setor}</p>
                </div>
                <Link to={`/consultor/dashboard/chat?atendimentoId=${atendimento.id}`} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">Abrir Chat</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-700 mb-3">Fila de Espera:</h3>
      {status === "disponivel" && filaAtendimento.length > 0 ? (
        <div className="space-y-4">
          {filaAtendimento.map((chamada) => (
            <div key={chamada.id} className={`rounded-xl border-l-5 p-4 shadow-md transition-shadow ${chamada.prioridade === "urgente" ? "bg-red-50 border-red-500" : "bg-gray-50 border-blue-500"}`}>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-800">
                      {chamada.tipo === "video" ? "📹" : chamada.tipo === "voz" ? "📞" : "💬"} {chamada.nomeVisivel ? chamada.clienteNome : "Cliente Anônimo"}
                    </span>
                    {chamada.prioridade === "urgente" && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">🔥 URGENTE</span>}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📍 {chamada.loja}</p>
                    <p>🏷️ Setor: {chamada.setor}</p>
                    <p>⏱️ Aguardando há {chamada.tempoEspera}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => aceitarChamada(chamada)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors">✅ Aceitar</button>
                  <button onClick={() => recusarChamada(chamada.id)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors">❌ Recusar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : status === "offline" ? (
        <PlaceholderPage title="📴 Você está offline" />
      ) : (
        <PlaceholderPage title="📞 Aguardando chamadas..." />
      )}
    </div>
  );
};

const ChatPanel = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [saleStatus, setSaleStatus] = useState("idle");

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => setCart((prev) => prev.filter((p) => p.id !== productId));

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert("Carrinho vazio.");
      return;
    }
    setSaleStatus("processing");
    setTimeout(() => {
      setSaleStatus("done");
      setCart([]);
      alert("Venda finalizada com sucesso (simulada).");
      navigate("/consultor/dashboard");
    }, 900);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">💬 Chat / Vendas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl">
          <p className="text-gray-600">Área de chat (simulada).</p>
          <div className="mt-4">
            <button onClick={() => addToCart({ id: "prod1", name: "Smartwatch X", price: 350 })} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Adicionar Smartwatch</button>
            <button onClick={() => addToCart({ id: "prod2", name: "Fone Bluetooth", price: 120 })} className="bg-green-600 text-white px-4 py-2 rounded">Adicionar Fone</button>
          </div>
        </div>

        <aside className="bg-white p-4 rounded-xl shadow-inner">
          <h3 className="font-semibold text-gray-700 mb-2">Carrinho</h3>
          {cart.length === 0 ? (
            <p className="text-gray-500">Carrinho vazio</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">Qtd: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div>R$ {(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 mt-1">Remover</button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>R$ {calculateTotal()}</span>
                </div>
                <button onClick={handleFinalizeSale} className="w-full mt-3 bg-indigo-600 text-white py-2 rounded">{saleStatus === "processing" ? "Processando..." : "Finalizar Venda"}</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

// =======================================================================
// === APP ROOT E ROTAS ==================================================
// =======================================================================
function App() {
  return (
    <Routes>
      {/* Rota pública principal */}
      <Route path="/" element={<Landingpage />} />

      {/* Login / seleção */}
      <Route path="/entrar" element={<LoginsPanel />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/termos" element={<TermsPage />} />

      {/* Consultor area (protegida) */}
      <Route path="/consultor" element={<ProtectedRoute component={ConsultorRoutes} />} />

      {/* Lojista / Vendedor / Admin placeholders */}
      <Route path="/lojista/*" element={<PlaceholderPage title="Lojista - Em desenvolvimento" />} />
      <Route path="/vendedor/*" element={<PlaceholderPage title="Vendedor - Em desenvolvimento" />} />
      <Route path="/admin/*" element={<PlaceholderPage title="Admin - Em desenvolvimento" />} />

      {/* Fallback */}
      <Route path="*" element={<PlaceholderPage title="404 - Página não encontrada" />} />
    </Routes>
  );
}

// --- Rotas compostas ---
const ConsultorRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route index element={<ConsultorHomePanel />} />
      <Route path="dashboard" element={<Outlet />}>
        <Route index element={<ConsultorHomePanel />} />
        <Route path="fila" element={<FilaPanel />} />
        <Route path="chat" element={<ChatPanel />} />
        <Route path="lojas" element={<PlaceholderPage title="Minhas Lojas" />} />
        <Route path="analytics" element={<PlaceholderPage title="Comissões e Analytics" />} />
        <Route path="historico" element={<PlaceholderPage title="Histórico de Atendimentos" />} />
        <Route path="profile" element={<PlaceholderPage title="Perfil do Consultor" />} />
        <Route path="reviews" element={<PlaceholderPage title="Avaliações" />} />
        <Route path="treinamentos" element={<PlaceholderPage title="Treinamentos" />} />
      </Route>
    </Routes>
  </DashboardLayout>
);

export default App;