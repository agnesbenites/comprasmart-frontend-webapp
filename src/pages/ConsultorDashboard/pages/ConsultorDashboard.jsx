import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
// REMOVIDO: As bibliotecas 'react-qr-code' e 'react-icons/fa' foram substituídas por placeholders/emojis
// para garantir a compatibilidade com o ambiente de arquivo único.

// --- DADOS E CONSTANTES GLOBAIS ---
const API_URL = 'https://plataforma-consultoria-mvp.onrender.com';

// Placeholder para o QR Code, pois a biblioteca não está disponível.
const QR_CODE_PLACEHOLDER = "https://placehold.co/128x128/2563eb/ffffff?text=QR+CODE";

// Itens de menu com ícones de emoji
const CONSULTOR_MENU_ITEMS = [
    { title: "🏠 Home", icon: "🏠", rota: "/consultor/dashboard" },
    { title: "📞 Fila de Atendimento", icon: "📞", rota: "/consultor/dashboard/fila" },
    { title: "💬 Atendimento Ativo", icon: "💬", rota: "/consultor/dashboard/chat" },
    { title: "💰 Comissões", icon: "💰", rota: "/consultor/dashboard/analytics" },
    { title: "🏪 Minhas Lojas", icon: "🏪", rota: "/consultor/dashboard/lojas" },
    { title: "👤 Perfil", icon: "👤", rota: "/consultor/dashboard/profile" },
];

// Dados de Cliente de Teste
const MOCK_CLIENTE_DATA = {
  id: "c123456",
  nome: "Cliente Exemplo",
  email: "cliente.exemplo@email.com",
  status: "Ativo",
  descricao: "Em busca de produtos",
};

// Dados de Consultor de Teste
const MOCK_CONSULTOR_INFO = {
    nome: "Agnes Consultora",
    segmentos: ["Eletrodomésticos", "Tecnologia", "Móveis"],
    lojasAtendidas: 7,
    comissaoAcumulada: 12500.50,
    atendimentosMes: 45,
    ratingMedio: 4.8, 
};

// Simulação de busca de produtos
const SIMULATED_PRODUCTS = [
    { id: 'prod1', name: 'Smartwatch X', price: 350.00 },
    { id: 'prod2', name: 'Fone Bluetooth', price: 120.00 },
    { id: 'prod3', name: 'Capa Protetora', price: 45.00 },
];

// --- 1. COMPONENTE DE LAYOUT (SIDEBAR ÚNICA) ---
const DashboardLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const userName = localStorage.getItem("userName") || MOCK_CONSULTOR_INFO.nome;

    const getMenuItemStyle = (rota) => {
        const isActive = currentPath === rota || (rota !== "/consultor/dashboard" && currentPath.startsWith(rota));
        return `flex items-center p-3 my-1 rounded-l-full mr-4 transition-all duration-200 text-sm ${
            isActive 
            ? 'bg-blue-100 font-bold text-blue-800 border-l-4 border-blue-800' 
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
        }`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (Menu ÚNICO - Remove a duplicação) */}
            <div className="w-64 bg-white shadow-xl flex-shrink-0">
                <h2 className="text-2xl font-extrabold text-blue-800 p-6 text-center border-b border-gray-100">
                    Autônomo
                </h2>
                <nav className="mt-4">
                    {CONSULTOR_MENU_ITEMS.map((item) => (
                        <Link
                            key={item.rota}
                            to={item.rota}
                            className={getMenuItemStyle(item.rota)}
                        >
                            <span className="mr-3 text-lg">{item.icon}</span> {/* Usando emoji */}
                            {item.title.substring(item.title.indexOf(' ') + 1)}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Conteúdo Principal */}
            <main className="flex-grow flex flex-col w-[calc(100%-16rem)] overflow-x-hidden">
                <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-semibold text-blue-800">Painel do Consultor</h1>
                        <p className="text-sm text-gray-500">Bem-vindo(a), {userName}</p>
                    </div>
                    <Link
                        to="/consultor/dashboard/profile"
                        className="flex items-center gap-2 p-2 px-4 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                        👤
                        <span className="text-sm font-medium">Meu Perfil</span>
                    </Link>
                </header>

                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// --- 2. CONSULTOR HOME PANEL ---
export const ConsultorHomePanel = () => {
    const navigate = useNavigate();
    const consultorInfo = MOCK_CONSULTOR_INFO;

    const atalhos = [
        { titulo: "📞 Próximo da Fila", descricao: "Iniciar um novo atendimento da fila prioritária", cor: "bg-blue-500 hover:bg-blue-600", rota: "/consultor/dashboard/fila" },
        { titulo: "🏪 Lojas Atendidas", descricao: "Gerenciar minhas lojas e configurar categorias", cor: "bg-green-500 hover:bg-green-600", rota: "/consultor/dashboard/lojas" },
        { titulo: "💰 Sacar Comissão", descricao: "Ver detalhes de comissão e solicitar saque", cor: "bg-yellow-500 hover:bg-yellow-600", rota: "/consultor/dashboard/analytics" },
        { titulo: "💬 Chat Ativo", descricao: "Acessar atendimentos em andamento", cor: "bg-teal-500 hover:bg-teal-600", rota: "/consultor/dashboard/chat" }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Cabeçalho Pessoal e Comissão */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold text-blue-800 mb-1">
                        🎯 Olá, {consultorInfo.nome}!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Segmentos de Atuação: {consultorInfo.segmentos.join(', ')}
                    </p>
                    <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-700 mr-4">
                            <span className="inline mr-2 text-teal-600">🏪</span> Atendendo {consultorInfo.lojasAtendidas} Lojas
                        </h3>
                        <button onClick={() => navigate("/consultor/dashboard/lojas")} className="bg-teal-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors hover:bg-teal-700">
                            Ver Detalhes das Lojas
                        </button>
                    </div>
                </div>
                
                {/* Comissionamento */}
                <div className="text-center bg-green-50 p-4 rounded-xl border-2 border-green-300 min-w-[200px] shadow-inner">
                    <div className="text-xs text-green-700 font-medium mb-1">Comissão Acumulada</div>
                    <div className="text-3xl font-extrabold text-green-600 mb-3">
                        R$ {consultorInfo.comissaoAcumulada.toFixed(2).replace('.', ',')}
                    </div>
                    <button onClick={() => navigate("/consultor/dashboard/analytics")} className="w-full bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors hover:bg-green-700 shadow-md">
                        <span className="inline mr-2">💰</span> Sacar Agora
                    </button>
                </div>
            </div>

            {/* Atalhos Rápidos */}
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">🚀 Ações de Atendimento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {atalhos.map((atalho, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(atalho.rota)}
                        className={`bg-white p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border-l-4 ${atalho.cor === 'bg-blue-500 hover:bg-blue-600' ? 'border-blue-500' : atalho.cor === 'bg-green-500 hover:bg-green-600' ? 'border-green-500' : atalho.cor === 'bg-yellow-500 hover:bg-yellow-600' ? 'border-yellow-500' : 'border-teal-500'}`}
                    >
                        <h3 className={`text-xl font-bold ${atalho.cor.includes('blue') ? 'text-blue-700' : atalho.cor.includes('green') ? 'text-green-700' : atalho.cor.includes('yellow') ? 'text-yellow-700' : 'text-teal-700'}`}>
                            {atalho.titulo}
                        </h3>
                        <p className="text-gray-500 mt-2 text-sm">{atalho.descricao}</p>
                    </div>
                ))}
            </div>

            {/* Métricas Chave */}
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">📈 Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Métrica 1: Atendimentos */}
                <MetricCard 
                    title="Atendimentos (Mês)" 
                    value={consultorInfo.atendimentosMes} 
                    icon="📞"
                    color="blue"
                />
                {/* Métrica 2: Rating */}
                <MetricCard 
                    title="Rating Médio" 
                    value={`${consultorInfo.ratingMedio} / 5.0`} 
                    icon="⭐"
                    color="yellow"
                />
                {/* Métrica 3: Lojas Ativas */}
                <MetricCard 
                    title="Lojas Ativas" 
                    value={consultorInfo.lojasAtendidas} 
                    icon="🏪"
                    color="teal"
                />
            </div>
        </div>
    );
};

// Componente auxiliar para Métricas (usando strings para ícones)
const MetricCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
        teal: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-500' },
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


// --- 3. CHAT PANEL (Corrigido com Feedback de Status) ---
const ChatPanel = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [showQRCode, setShowQRCode] = useState(false);
    const [vendaId, setVendaId] = useState(null);
    
    // NOVO ESTADO: Gerencia o status da finalização da venda
    // Valores: 'idle', 'success', 'stock_error', 'generic_error'
    const [saleStatus, setSaleStatus] = useState('idle'); 

    // Cálculo do Total
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Adicionar Produto
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

    // Remover Produto
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };
    
    // Função Central: Finalizar Venda (Corrigida e Reforçada)
    const handleFinalizeSale = async () => {
        if (cart.length === 0) {
            alert("Carrinho vazio! Adicione produtos para finalizar a venda.");
            return;
        }

        setSaleStatus('idle'); // Resetar status antes da tentativa
        
        try {
            console.log('🔄 Tentando finalizar venda...');
            
            const salePayload = {
                consultorId: MOCK_CONSULTOR_INFO.nome, // Usando nome como ID mock, idealmente seria um UUID
                lojistaId: localStorage.getItem('lojistaAtual') || "858f50c0-f472-4d1d-9e6e-21952f40c7e5", 
                clienteId: MOCK_CLIENTE_DATA.id,
                clienteEmail: MOCK_CLIENTE_DATA.email,
                clienteNome: MOCK_CLIENTE_DATA.nome,
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
                
                // NOVO: Checagem específica para erro de estoque (simulada)
                // Se a API retornar um status 409 (Conflict) ou uma mensagem específica de estoque
                if (response.status === 409 || errorMessage.toLowerCase().includes("estoque")) {
                    setSaleStatus('stock_error');
                    console.error('❌ Erro de Estoque Concorrente:', errorMessage);
                } else {
                    setSaleStatus('generic_error');
                    console.error(`❌ Erro HTTP ${response.status}:`, errorMessage);
                }
                return;
            }
            
            // SUCESSO
            if (responseBody.success) {
                console.log('✅ Venda criada:', responseBody.vendaId);
                // Usando um ID de venda fictício para simulação, já que a API mock pode não funcionar
                const mockVendaId = `VENDA-${Math.floor(Math.random() * 9000) + 1000}`;
                setVendaId(responseBody.vendaId || mockVendaId);
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

    // Função para navegar para a nova página de Resumo
    const navigateToSummary = (isSuccess) => {
        // Passa o ID da venda e/ou do cliente para a nova tela de resumo
        const finalVendaId = isSuccess ? vendaId : 'novo';
        navigate(`/consultor/dashboard/resumo-venda/${finalVendaId}`, { 
            state: { 
                saleStatus, 
                cart, 
                clienteData: MOCK_CLIENTE_DATA 
            } 
        });
    };


    // --- Estrutura de Renderização JSX ---
    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[70vh]">
            
            {/* COLUNA 1: CHAT & HEADER */}
            <div className="flex-grow flex flex-col bg-white rounded-xl shadow-lg border border-gray-200">
                
                {/* CABEÇALHO DO ATENDIMENTO */}
                <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <h1 className="text-2xl font-bold text-blue-800 mb-2">Atendimento Ativo</h1>
                    <div className="flex items-center">
                        <span className="text-3xl text-gray-400 mr-3">👤</span>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{MOCK_CLIENTE_DATA.nome}</h2>
                            <p className="text-sm text-gray-500">{MOCK_CLIENTE_DATA.descricao}</p>
                        </div>
                    </div>
                </div>

                {/* ÁREA DE CHAT (Simulação) */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3">
                    <div className="flex justify-start">
                        <div className="bg-blue-100 text-blue-900 p-3 rounded-xl max-w-xs shadow-sm">
                            <p>Olá! Em que posso ajudar?</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-green-100 text-green-900 p-3 rounded-xl max-w-xs shadow-sm">
                            <p>Gostaria do Smartwatch X e de um fone Bluetooth.</p>
                        </div>
                    </div>
                    {/* Placeholder para mensagens dinâmicas */}
                </div>

                {/* INPUT DO CHAT */}
                <div className="p-4 border-t border-gray-100">
                    <input 
                        type="text" 
                        placeholder="Digite sua mensagem..." 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
            </div>

            {/* COLUNA 2: CARRINHO E FINALIZAÇÃO DE VENDA */}
            <div className="lg:w-96 flex-shrink-0 flex flex-col gap-6">
                
                {/* CARRINHO */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center"><span className="mr-2 text-blue-600">🛒</span> Carrinho de Vendas</h3>
                    <ul className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                        {cart.length === 0 ? (
                            <li className="text-gray-500 text-sm italic text-center py-2">Nenhum produto no carrinho.</li>
                        ) : (
                            cart.map((item) => (
                                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                    <span className="text-gray-800 text-sm truncate">{item.name} ({item.quantity}x)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-green-700">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full bg-white transition-colors"
                                        >
                                            ✖️
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                    <p className="text-lg font-extrabold text-right border-t pt-3 mt-3 text-gray-900">Total: R$ {calculateTotal()}</p>
                </div>

                {/* BOTÕES DE FINALIZAÇÃO (Tratamento de Status) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Ações de Venda</h3>

                    {/* 1. ESTADO PADRÃO: BOTÃO DE FINALIZAR */}
                    {saleStatus === 'idle' && (
                        <>
                            <button 
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors hover:bg-blue-700 shadow-lg mb-3" 
                                onClick={handleFinalizeSale}
                            >
                                Finalizar Venda e Gerar QR Code
                            </button>
                            <button 
                                className="w-full bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors hover:bg-gray-300"
                                onClick={() => navigateToSummary(false)} // Passa false para indicar sem sucesso de venda
                            >
                                Encerrar Atendimento (Sem Venda)
                            </button>
                        </>
                    )}

                    {/* 2. ESTADO DE SUCESSO */}
                    {saleStatus === 'success' && (
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-300">
                            <p className="text-xl font-bold text-green-700 mb-3">✅ Venda Criada!</p>
                            <p className="text-sm text-green-600 mb-4">QR Code gerado para Venda ID: {vendaId}</p>
                            <div className="flex justify-center mb-4">
                                {/* Substituído QRCode component por placeholder */}
                                <img src={QR_CODE_PLACEHOLDER} alt="QR Code da Venda" className="p-2 bg-white rounded shadow-md" />
                            </div>
                            <button 
                                onClick={() => navigateToSummary(true)} 
                                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg transition-colors hover:bg-green-700 shadow-md"
                            >
                                Ver Resumo e Encerrar Atendimento
                            </button>
                        </div>
                    )}

                    {/* 3. ESTADO DE ERRO POR ESTOQUE (Concorrência) */}
                    {['stock_error', 'generic_error'].includes(saleStatus) && (
                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-300">
                            <p className="text-xl font-bold text-red-700 mb-2">
                                {saleStatus === 'stock_error' ? '⚠️ Estoque Esgotado!' : '❌ Falha na Venda!'}
                            </p>
                            <p className="text-sm text-red-600 mb-4">
                                {saleStatus === 'stock_error' 
                                    ? 'Outro consultor finalizou a venda antes. Venda não concluída.' 
                                    : 'Ocorreu um erro de servidor ou rede. Tente novamente.'
                                }
                            </p>
                            <button 
                                onClick={() => setSaleStatus('idle')} 
                                className="w-full bg-red-600 text-white font-bold py-3 rounded-lg transition-colors hover:bg-red-700 shadow-md mb-2"
                            >
                                {saleStatus === 'stock_error' ? 'Ajustar Carrinho e Tentar Novamente' : 'Tentar Novamente'}
                            </button>
                            <button 
                                className="w-full bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors hover:bg-gray-300"
                                onClick={() => navigateToSummary(false)}
                            >
                                Encerrar Atendimento (Venda Falhou)
                            </button>
                        </div>
                    )}
                </div>

                {/* SIMULAÇÃO DE ADIÇÃO (Botões para teste) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Adicionar Produtos (Simulação)</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {SIMULATED_PRODUCTS.map(p => (
                            <button key={p.id} onClick={() => addToCart(p)} className="text-xs bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors shadow-sm">
                                + {p.name}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- 4. NOVO COMPONENTE: ATTENDANCE SUMMARY PANEL ---
const AttendanceSummaryPanel = () => {
    const { vendaId } = useParams(); 
    const location = useLocation(); 
    const navigate = useNavigate();

    // Extrai dados passados do ChatPanel via state
    const { saleStatus, cart, clienteData } = location.state || {};

    // Determina o estado final
    const isSaleSuccessful = saleStatus === 'success' && vendaId && vendaId !== 'novo';

    const getStatusDetails = () => {
        if (isSaleSuccessful) {
            return {
                title: "Venda Concluída com Sucesso",
                color: "bg-green-100 border-green-500 text-green-800",
                icon: '✅',
                message: `Venda ID ${vendaId} registrada. O cliente pode pagar via QR Code.`,
            };
        }
        if (saleStatus === 'stock_error') {
            return {
                title: "Venda Falhou: Estoque Esgotado",
                color: "bg-yellow-100 border-yellow-500 text-yellow-800",
                icon: '⚠️',
                message: 'A transação foi cancelada por concorrência de estoque. Atendimento a ser revisado.',
            };
        }
        return {
            title: "Atendimento Encerrado",
            color: "bg-gray-100 border-gray-500 text-gray-800",
            icon: '💬',
            message: 'O atendimento foi encerrado sem a conclusão de uma venda.',
        };
    };

    const status = getStatusDetails();

    const handleFinalizeAttendance = () => {
        // Lógica de encerramento real (API call)
        console.log(`Atendimento de ${clienteData?.nome || 'Cliente'} encerrado.`);
        navigate('/consultor/dashboard'); 
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border-t-4 border-blue-600">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-6 flex items-center hover:underline">
                <span className="mr-2">⬅️</span> Voltar ao Chat
            </button>
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Resumo e Encerramento do Atendimento</h1>
            
            {/* Status Box */}
            <div className={`p-5 rounded-lg border-l-4 shadow-inner mb-8 ${status.color}`}>
                <h2 className="text-2xl font-bold mb-2">{status.icon} {status.title}</h2>
                <p>{status.message}</p>
            </div>

            {/* Detalhes do Cliente */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Detalhes do Cliente</h3>
                <p><strong>Nome:</strong> {clienteData?.nome || 'N/A'}</p>
                <p><strong>Email:</strong> {clienteData?.email || 'N/A'}</p>
            </div>

            {/* Carrinho (Produtos Envolvidos) */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Produtos Envolvidos ({cart?.length || 0})</h3>
            <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Un.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cart?.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {item.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">R$ {(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        )) || <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Nenhum produto listado.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Total e Ação Final */}
            <div className="flex justify-between items-center border-t pt-4">
                <h3 className="text-2xl font-bold text-gray-800">Valor Total:</h3>
                <span className="text-3xl font-extrabold text-blue-700">
                    R$ {(cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0).toFixed(2)}
                </span>
            </div>

            <button 
                onClick={handleFinalizeAttendance} 
                className="mt-8 w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg transition-colors hover:bg-blue-700 shadow-xl"
            >
                Confirmar Encerramento do Atendimento
            </button>
        </div>
    );
};


// --- COMPONENTE RAIZ DA APLICAÇÃO ---
const ProfilePanel = () => (
    <div className="p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">👤 Meu Perfil</h1>
        <p className="text-gray-600">Configurações de conta e informações pessoais para {MOCK_CONSULTOR_INFO.nome}.</p>
    </div>
);
const AnalyticsPanel = () => (
    <div className="p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">💰 Comissões e Analytics</h1>
        <p className="text-gray-600">Detalhes de performance e comissões acumuladas.</p>
    </div>
);
const StoresPanel = () => (
    <div className="p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">🏪 Minhas Lojas</h1>
        <p className="text-gray-600">Gerenciamento de lojas e segmentos atendidos.</p>
    </div>
);
const FilaPanel = () => (
    <div className="p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">📞 Fila de Atendimento</h1>
        <p className="text-gray-600">Lista de clientes aguardando atendimento. (Aqui você implementaria o botão 'Aceitar Atendimento' com navegação automática para /chat)</p>
    </div>
);


// MOCK DE APP PARA RODAR NO CANVAS
export default function App() {
    // Carrega o Tailwind CSS
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(script);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/consultor" element={<DashboardLayout />}>
                    <Route index element={<ConsultorHomePanel />} />
                    <Route path="dashboard" element={<ConsultorHomePanel />} />
                    <Route path="dashboard/fila" element={<FilaPanel />} />
                    <Route path="dashboard/chat" element={<ChatPanel />} />
                    {/* NOVA ROTA para o Resumo */}
                    <Route path="dashboard/resumo-venda/:vendaId" element={<AttendanceSummaryPanel />} />
                    <Route path="dashboard/analytics" element={<AnalyticsPanel />} />
                    <Route path="dashboard/lojas" element={<StoresPanel />} />
                    <Route path="dashboard/profile" element={<ProfilePanel />} />
                </Route>
            </Routes>
        </Router>
    );
}