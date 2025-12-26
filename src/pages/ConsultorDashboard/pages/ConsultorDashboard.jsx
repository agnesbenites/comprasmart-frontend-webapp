// src/pages/ConsultorDashboard/pages/ConsultorDashboard.jsx
// VERSAO CORRIGIDA - Importa os componentes REAIS da pasta components/

import React from "react";
import { Routes, Route, Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// =============================================================
// === IMPORTACOES DOS COMPONENTES REAIS ===
// =============================================================
import AnalyticsPanel from "../components/AnalyticsPanel";
import AttendanceSummaryPanel from "../components/AttendanceSummaryPanel";
import ChatPanel from "../components/ChatPanel";
import HistoryPanel from "../components/HistoryPanel";
import ProfilePanel from "../components/ProfilePanel";
import QueuePanel from "../components/QueuePanel";
import ReferralPanel from "../components/ReferralPanel";
import ReportPanel from "../components/ReportPanel";
import ReviewsPanel from "../components/ReviewsPanel";
import SalesTable from "../components/SalesTable";
import StoresPanel from "../components/StoresPanel";
import TrainingPanel from "../components/TrainingPanel";
import ExcluirContaConsultor from '../components/ExcluirContaConsultor';


// --- DADOS E CONSTANTES GLOBAIS ---
const MOCK_CONSULTOR_INFO = {
    nome: "Agnes Consultora",
    segmentos: ["Eletrodomesticos", "Tecnologia", "Moveis"],
    lojasAtendidas: 7,
    comissaoAcumulada: 12500.50,
    atendimentosMes: 45,
    ratingMedio: 4.8,
};

// Itens de menu com icones de emoji
const CONSULTOR_MENU_ITEMS = [
    { title: "  Home", icon: " ", rota: "/consultor/dashboard" },
    { title: " Fila de Atendimento", icon: "", rota: "/consultor/dashboard/fila" },
    { title: " Atendimento Ativo", icon: "", rota: "/consultor/dashboard/chat" },
    { title: " Histórico", icon: "", rota: "/consultor/dashboard/historico" },
    { title: " Comissoes", icon: "", rota: "/consultor/dashboard/analytics" },
    { title: " Minhas Lojas", icon: "", rota: "/consultor/dashboard/lojas" },
    { title: "i Avaliações", icon: "i", rota: "/consultor/dashboard/reviews" },
    { title: " Treinamentos", icon: "", rota: "/consultor/dashboard/treinamentos" },
    { title: " Indicações", icon: "", rota: "/consultor/dashboard/indicacoes" },
    { title: " Minhas Vendas", icon: "", rota: "/consultor/dashboard/vendas" },
    { title: "  Report", icon: " ", rota: "/consultor/dashboard/report" },
    { title: " Perfil", icon: "", rota: "/consultor/dashboard/profile" },
];

// --- COMPONENTE DE LAYOUT (SIDEBAR) ---
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
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl flex-shrink-0">
                <h2 className="text-2xl font-extrabold text-blue-800 p-6 text-center border-b border-gray-100">
                    Aut´nomo
                </h2>
                <nav className="mt-4">
                    {CONSULTOR_MENU_ITEMS.map((item) => (
                        <Link
                            key={item.rota}
                            to={item.rota}
                            className={getMenuItemStyle(item.rota)}
                        >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            {item.title.substring(item.title.indexOf(' ') + 1)}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Conteudo Principal */}
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
    const navigate = useNavigate();
    const consultorInfo = MOCK_CONSULTOR_INFO;

    const atalhos = [
        { titulo: " Próximo da Fila", descricao: "Iniciar um novo atendimento da fila prioritária", cor: "bg-blue-500 hover:bg-blue-600", rota: "/consultor/dashboard/fila" },
        { titulo: " Lojas Atendidas", descricao: "Gerenciar minhas lojas e configurar categorias", cor: "bg-green-500 hover:bg-green-600", rota: "/consultor/dashboard/lojas" },
        { titulo: " Sacar Comissão", descricao: "Ver detalhes de comissao e solicitar saque", cor: "bg-yellow-500 hover:bg-yellow-600", rota: "/consultor/dashboard/analytics" },
        { titulo: " Chat Ativo", descricao: "Acessar atendimentos em andamento", cor: "bg-teal-500 hover:bg-teal-600", rota: "/consultor/dashboard/chat" }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Cabecalho Pessoal e Comissão */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold text-blue-800 mb-1">
                         Ola, {consultorInfo.nome}!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Segmentos de Atuação: {consultorInfo.segmentos.join(', ')}
                    </p>
                    <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-700 mr-4">
                            <span className="inline mr-2 text-teal-600"></span> Atendendo {consultorInfo.lojasAtendidas} Lojas
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
                        <span className="inline mr-2"></span> Sacar Agora
                    </button>
                </div>
            </div>

            {/* Atalhos Rapidos */}
            <h2 className="text-2xl font-semibold text-blue-800 mb-4"> Ações de Atendimento</h2>
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

            {/* Metricas Chave */}
            <h2 className="text-2xl font-semibold text-blue-800 mb-4"> Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Atendimentos (Mês)" value={consultorInfo.atendimentosMes} icon="" color="blue" />
                <MetricCard title="Rating Médio" value={`${consultorInfo.ratingMedio} / 5.0`} icon="i" color="yellow" />
                <MetricCard title="Lojas Ativas" value={consultorInfo.lojasAtendidas} icon="" color="teal" />
            </div>
        </div>
    );
};

// Componente auxiliar para Metricas
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

// =============================================================
// === COMPONENTE PRINCIPAL COM ROTAS ===
// =============================================================
export default function ConsultorDashboard() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                {/* Rota index */}
                <Route index element={<ConsultorHomePanel />} />
                
                {/* Rota /consultor/dashboard */}
                <Route path="dashboard" element={<ConsultorHomePanel />} />
                
                {/* Sub-rotas - USANDO OS COMPONENTES IMPORTADOS */}
                <Route path="dashboard/fila" element={<QueuePanel />} />
                <Route path="dashboard/chat" element={<ChatPanel />} />
                <Route path="dashboard/resumo-venda/:vendaId" element={<AttendanceSummaryPanel />} />
                <Route path="dashboard/analytics" element={<AnalyticsPanel />} />
                <Route path="dashboard/lojas" element={<StoresPanel />} />
                <Route path="dashboard/profile" element={<ProfilePanel />} />
                <Route path="dashboard/historico" element={<HistoryPanel />} />
                <Route path="dashboard/reviews" element={<ReviewsPanel />} />
                <Route path="dashboard/treinamentos" element={<TrainingPanel />} />
                <Route path="dashboard/indicacoes" element={<ReferralPanel />} />
                <Route path="dashboard/vendas" element={<SalesTable />} />
                <Route path="dashboard/report" element={<ReportPanel />} />
            </Route>
        </Routes>
    );
}