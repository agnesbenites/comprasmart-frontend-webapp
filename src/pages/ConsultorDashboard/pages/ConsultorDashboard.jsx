// src/pages/ConsultorDashboard/pages/ConsultorDashboard.jsx

import React from "react";
import { Routes, Route, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient"; //  ADICIONAR IMPORT

// === ÍCONES KASLEE ===
const BASE = "/img/kaslee_icon";
const Icon = ({ name, className = "w-5 h-5" }) => (
    <img src={`${BASE}/${name}.svg`} alt={name} className={className} />
);

// =============================================================
// === IMPORTAÇÕES DOS COMPONENTES REAIS ===
// =============================================================
import AnalyticsPanel from "../components/AnalyticsPanel";
import AttendanceSummaryPanel from "../components/AttendanceSummaryPanel";
import ChatPanel from "../components/ChatPanel";
import HistoryPanel from "../components/HistoryPanel";
import ProfilePanel from "../components/ProfilePanel";
import QueuePanel from "../components/QueuePanel";
import ReportPanel from "../components/ReportPanel";
import ReviewsPanel from "../components/ReviewsPanel";
import SalesTable from "../components/SalesTable";
import StoresPanel from "../components/StoresPanel";
import TrainingPanel from "../components/TrainingPanel";
import StatusVendaConsultor from "../components/StatusVendaConsultor";
import MeusClientes from "./MeusClientes"; //  NOVO

// --- DADOS E CONSTANTES GLOBAIS ---
const MOCK_CONSULTOR_INFO = {
    nome: "Agnes Consultora",
    segmentos: ["Eletrodomésticos", "Tecnologia", "Móveis"],
    lojasAtendidas: 7,
    comissaoAcumulada: 12500.50,
    atendimentosMes: 45,
    ratingMedio: 4.8,
};

//  MENU COM ÍCONES KASLEE
const CONSULTOR_MENU_ITEMS = [
    { title: "Home", icon: "home", rota: "/consultor/dashboard" },
    { title: "Fila de Atendimento", icon: "wating", rota: "/consultor/dashboard/fila" },
    { title: "Atendimento Ativo", icon: "aceitar-chamada", rota: "/consultor/dashboard/chat" },
    { title: "Histórico", icon: "finalizado", rota: "/consultor/dashboard/historico" },
    { title: "Status da Venda", icon: "ticket-sales", rota: "/consultor/dashboard/status-venda" },
    { title: "Comissões", icon: "comissão", rota: "/consultor/dashboard/analytics" },
    { title: "Minhas Lojas", icon: "favorite-shop", rota: "/consultor/dashboard/lojas" },
    { title: "Meus Clientes", icon: "consultores", rota: "/consultor/dashboard/clientes" },
    { title: "Avaliações", icon: "avaliações", rota: "/consultor/dashboard/reviews" },
    { title: "Treinamentos", icon: "conquistas-consultores-vendedores", rota: "/consultor/dashboard/treinamentos" },
    { title: "Minhas Vendas", icon: "grafico-análise", rota: "/consultor/dashboard/vendas" },
    { title: "Report", icon: "dashboard", rota: "/consultor/dashboard/report" },
    { title: "Perfil", icon: "perfil", rota: "/consultor/dashboard/profile" },
];

// --- COMPONENTE DE LAYOUT (SIDEBAR) ---
const DashboardLayout = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;

    const getMenuItemStyle = (rota) => {
        const isActive = currentPath === rota || (rota !== "/consultor/dashboard" && currentPath.startsWith(rota));
        return `flex items-center p-3 my-1 rounded-l-full mr-4 transition-all duration-200 text-sm ${
            isActive
            ? 'bg-purple-100 font-bold text-[#2f0d51] border-l-4 border-[#2f0d51]'
            : 'text-gray-600 hover:bg-purple-50 hover:text-[#9e1e8e]'
        }`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl flex-shrink-0 flex flex-col">
                <h2 className="text-2xl font-extrabold text-[#2f0d51] p-6 text-center border-b border-gray-100">
                    Autônomo
                </h2>
                <nav className="mt-4 flex-1">
                    {CONSULTOR_MENU_ITEMS.map((item) => (
                        <Link
                            key={item.rota}
                            to={item.rota}
                            className={getMenuItemStyle(item.rota)}
                        >
                            <Icon name={item.icon} className="w-5 h-5 mr-3 flex-shrink-0" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <button 
                    onClick={signOut}
                    className="m-6 p-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                >
                     Sair
                </button>
            </div>

            {/* Conteúdo Principal */}
            <main className="flex-grow flex flex-col w-[calc(100%-16rem)] overflow-x-hidden">
                <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-semibold text-[#2f0d51]">Painel do Consultor</h1>
                        <p className="text-sm text-gray-500">Bem-vindo(a), {user?.nome || 'Agnes Consultora'}</p>
                    </div>
                    <Link
                        to="/consultor/dashboard/profile"
                        className="flex items-center gap-2 p-2 px-4 rounded-full bg-purple-50 text-[#9e1e8e] hover:bg-purple-100 transition-colors"
                    >
                        <Icon name="perfil" className="w-5 h-5" />
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

// --- CONSULTOR HOME PANEL ---
export const ConsultorHomePanel = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [consultorInfo, setConsultorInfo] = React.useState(MOCK_CONSULTOR_INFO);
    const [loadingStats, setLoadingStats] = React.useState(true);

    //  BUSCAR DADOS REAIS DO CONSULTOR
    React.useEffect(() => {
        const buscarDadosReais = async () => {
            if (!user?.id) return;
            
            setLoadingStats(true);
            try {
                // 1. Buscar lojas onde o consultor tem pedidos
                const { data: pedidos } = await supabase
                    .from('pedidos')
                    .select('lojista_id')
                    .eq('consultor_id', user.id)
                    .not('status_separacao', 'eq', 'Cancelado');

                const lojasUnicas = new Set(pedidos?.map(p => p.lojista_id) || []);
                const totalLojas = lojasUnicas.size;

                // 2. Buscar comissão do mês
                const mesAtual = new Date();
                const inicioMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
                
                const { data: pedidosFinalizados } = await supabase
                    .from('pedidos')
                    .select('valor_total, valor_comissao, percentual_comissao')
                    .eq('consultor_id', user.id)
                    .eq('status_separacao', 'Retirado pelo Cliente')
                    .gte('data_pedido', inicioMes.toISOString());

                const comissaoTotal = pedidosFinalizados?.reduce((sum, p) => {
                    const comissao = p.valor_comissao || ((p.valor_total || 0) * (p.percentual_comissao || 10) / 100);
                    return sum + comissao;
                }, 0) || 0;

                const atendimentosMes = pedidosFinalizados?.length || 0;

                // 3. Buscar avaliações
                const { data: avaliacoes } = await supabase
                    .from('avaliacoes')
                    .select('estrelas')
                    .eq('consultor_id', user.id);

                const ratingMedio = avaliacoes?.length > 0 
                    ? (avaliacoes.reduce((sum, a) => sum + (a.estrelas || 0), 0) / avaliacoes.length).toFixed(1)
                    : 0;

                setConsultorInfo({
                    ...MOCK_CONSULTOR_INFO,
                    lojasAtendidas: totalLojas,
                    comissaoAcumulada: comissaoTotal,
                    atendimentosMes,
                    ratingMedio: parseFloat(ratingMedio)
                });

            } catch (error) {
                console.error('[Home] Erro ao buscar dados:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        buscarDadosReais();
    }, [user]);

    if (loading || loadingStats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                <div className="animate-spin w-10 h-10 mb-4"><Icon name="atualizar" className="w-10 h-10" /></div>
                    <p className="text-gray-600 font-medium">Carregando dados do consultor...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                    <div className="text-red-600 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-800 mb-3">Usuário não carregado</h2>
                    <p className="text-gray-700 mb-4">O sistema não conseguiu identificar suas credenciais.</p>
                    
                    <div className="bg-white p-4 rounded-lg mb-4 text-left">
                        <p className="text-sm font-mono text-gray-600">
                            <strong>Debug Info:</strong><br/>
                            Loading: {loading ? 'true' : 'false'}<br/>
                            User: {user ? 'exists' : 'null'}<br/>
                            Token exists: {localStorage.getItem('sb-vluxffbornrlxcepqmzr-auth-token') ? 'yes' : 'no'}
                        </p>
                    </div>

                    <button 
                        onClick={() => window.location.href = '/entrar'}
                        className="bg-[#9e1e8e] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#7d1870]"
                    >
                        Fazer Login Novamente
                    </button>
                </div>
            </div>
        );
    }

    const atalhos = [
        { titulo: "Próximo da Fila", descricao: "Iniciar um novo atendimento", cor: "bg-purple-500", icon: "wating", rota: "/consultor/dashboard/fila" },
        { titulo: "Status Venda", descricao: "Acompanhar carrinho do cliente", cor: "bg-purple-500", icon: "ticket-sales", rota: "/consultor/dashboard/status-venda" },
        { titulo: "Sacar Comissão", descricao: "Ver saldo e solicitar saque", cor: "bg-yellow-500", icon: "comissão", rota: "/consultor/dashboard/analytics" },
        { titulo: "Chat Ativo", descricao: "Falar com clientes", cor: "bg-teal-500", icon: "aceitar-chamada", rota: "/consultor/dashboard/chat" }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold text-[#2f0d51] mb-1">
                        👋 Olá, {user?.nome || user?.email || 'Agnes Consultora'}!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Segmentos de Atuação: {consultorInfo.segmentos.join(', ')}
                    </p>
                    <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-700 mr-4">
                            <span className="inline mr-2 text-teal-600"></span> Atendendo {consultorInfo.lojasAtendidas} Lojas
                        </h3>
                        <button 
                            onClick={() => navigate("/consultor/dashboard/lojas")}
                            className="text-sm bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-[#9e1e8e]"
                        >
                            Ver Detalhes das Lojas
                        </button>
                    </div>
                </div>

                <div className="text-center bg-green-50 p-4 rounded-xl border-2 border-green-300 min-w-[200px] shadow-inner">
                    <div className="text-xs text-green-700 font-medium mb-1"> Comissão (Mês)</div>
                    <div className="text-3xl font-extrabold text-green-600 mb-3">
                        R$ {consultorInfo.comissaoAcumulada.toFixed(2).replace('.', ',')}
                    </div>
                    <button onClick={() => navigate("/consultor/dashboard/analytics")} className="w-full bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                        Sacar Agora
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {atalhos.map((atalho, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(atalho.rota)}
                        className={`bg-white p-6 rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02] border-l-4 ${atalho.cor.replace('bg-', 'border-')}`}
                    >
                        <Icon name={atalho.icon} className="w-8 h-8 mb-3" />
                        <h3 className="text-xl font-bold text-gray-800">{atalho.titulo}</h3>
                        <p className="text-gray-500 mt-2 text-sm">{atalho.descricao}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Icon name="grafico-análise" className="w-5 h-5" /> Performance</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">ATENDIMENTOS (MÊS)</p>
                                <p className="text-3xl font-bold text-[#bb25a6]">{consultorInfo.atendimentosMes}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">AVALIAÇÃO MÉDIA</p>
                                <p className="text-3xl font-bold text-yellow-600">{consultorInfo.ratingMedio} </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Icon name="dashboard" className="w-5 h-5" /> Status do App</h3>
                    <StatusVendaConsultor consultorId={user?.id} />
                </div>
            </div>
        </div>
    );
};

// =============================================================
// === COMPONENTE PRINCIPAL COM ROTAS ===
// =============================================================
export default function ConsultorDashboard() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<ConsultorHomePanel />} />
                <Route path="dashboard" element={<ConsultorHomePanel />} />
                
                {/* Sub-rotas */}
                <Route path="fila" element={<QueuePanel />} />
                <Route path="chat" element={<ChatPanel />} />
                <Route path="resumo-venda/:vendaId" element={<AttendanceSummaryPanel />} />
                <Route path="analytics" element={<AnalyticsPanel />} />
                <Route path="lojas" element={<StoresPanel />} />
                <Route path="clientes" element={<MeusClientes />} /> {/*  ROTA NOVA */}
                <Route path="profile" element={<ProfilePanel />} />
                <Route path="historico" element={<HistoryPanel />} />
                <Route path="reviews" element={<ReviewsPanel />} />
                <Route path="treinamentos" element={<TrainingPanel />} />
                <Route path="vendas" element={<SalesTable />} />
                <Route path="report" element={<ReportPanel />} />
                <Route path="status-venda" element={<StatusVendaConsultor />} />
            </Route>
        </Routes>
    );
}