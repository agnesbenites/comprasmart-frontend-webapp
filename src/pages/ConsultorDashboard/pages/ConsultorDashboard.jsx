// src/pages/ConsultorDashboard/pages/ConsultorDashboard.jsx
import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import {
  House, Queue, Chat, ClockCounterClockwise, Tag, ChartBar,
  Storefront, Users, Star, GraduationCap, Receipt,
  ClipboardText, User, SignOut, List, X
} from '@phosphor-icons/react';

// Componentes
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
import MeusClientes from "./MeusClientes";

const PRIMARY = '#2f0d51';
const ACCENT = '#bb25a6';

const MENU_ITEMS = [
  { title: "Home",               icon: House,              rota: "/consultor/dashboard" },
  { title: "Fila de Atendimento",icon: Queue,              rota: "/consultor/dashboard/fila" },
  { title: "Atendimento Ativo",  icon: Chat,               rota: "/consultor/dashboard/chat" },
  { title: "Histórico",          icon: ClockCounterClockwise, rota: "/consultor/dashboard/historico" },
  { title: "Status da Venda",    icon: Tag,                rota: "/consultor/dashboard/status-venda" },
  { title: "Comissões",          icon: ChartBar,           rota: "/consultor/dashboard/analytics" },
  { title: "Minhas Lojas",       icon: Storefront,         rota: "/consultor/dashboard/lojas" },
  { title: "Meus Clientes",      icon: Users,              rota: "/consultor/dashboard/clientes" },
  { title: "Avaliações",         icon: Star,               rota: "/consultor/dashboard/reviews" },
  { title: "Treinamentos",       icon: GraduationCap,      rota: "/consultor/dashboard/treinamentos" },
  { title: "Minhas Vendas",      icon: Receipt,            rota: "/consultor/dashboard/vendas" },
  { title: "Report",             icon: ClipboardText,      rota: "/consultor/dashboard/report" },
  { title: "Perfil",             icon: User,               rota: "/consultor/dashboard/profile" },
];

const MOBILE_PRIORITY = [
  "/consultor/dashboard/fila",
  "/consultor/dashboard/chat",
  "/consultor/dashboard/status-venda",
  "/consultor/dashboard/profile",
  "/consultor/dashboard",
];

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuAberto, setMenuAberto] = useState(false);

  const isMobilePriority = MOBILE_PRIORITY.some(r =>
    currentPath === r || currentPath.startsWith(r + "/")
  );

  const isActive = (rota) =>
    rota === "/consultor/dashboard"
      ? currentPath === rota
      : currentPath === rota || currentPath.startsWith(rota + "/");

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.href = '/consultor/login';
    }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', backgroundColor:'#f8f9fa' }}>

      {/* Overlay mobile */}
      {menuAberto && (
        <div onClick={() => setMenuAberto(false)}
          style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:20 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240, backgroundColor:'white', boxShadow:'2px 0 8px rgba(0,0,0,0.07)',
        display:'flex', flexDirection:'column', flexShrink:0,
        position: menuAberto ? 'fixed' : 'relative',
        top:0, left:0, height: menuAberto ? '100vh' : undefined,
        zIndex:30, overflowY:'auto',
        transform: 'translateX(0)',
      }} className={`consultor-sidebar${menuAberto ? ' sidebar-open' : ''}`}>

        {/* Logo */}
        <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <img src="/img/Logo Clara.png" alt="Kaslee" style={{ height:44, width:'auto', objectFit:'contain' }}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
          <span style={{ display:'none', fontSize:20, fontWeight:800, color:PRIMARY, fontFamily:'Poppins,sans-serif' }}>Kaslee</span>
          <button onClick={() => setMenuAberto(false)} className="sidebar-close-btn"
            style={{ background:'none', border:'none', cursor:'pointer', color:'#999', display:'none' }}>
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav style={{ flex:1, padding:'12px 8px' }}>
          {MENU_ITEMS.map(({ title, icon: Icon, rota }) => {
            const active = isActive(rota);
            return (
              <Link key={rota} to={rota} onClick={() => setMenuAberto(false)} style={{
                display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                borderRadius:8, marginBottom:2, textDecoration:'none', fontSize:14, fontWeight: active ? 700 : 400,
                backgroundColor: active ? ACCENT : 'transparent',
                color: active ? 'white' : '#475569',
                transition:'all 0.2s',
              }}>
                <Icon size={18} weight="duotone" color={active ? 'white' : PRIMARY} />
                {title}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid #f0f0f0' }}>
          <button onClick={handleLogout} style={{
            width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
            borderRadius:8, border:'none', cursor:'pointer', fontSize:14, fontWeight:600,
            backgroundColor:'#fff0f0', color:'#dc3545',
          }}>
            <SignOut size={18} weight="duotone" color="#dc3545" /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <header style={{ backgroundColor:'white', padding:'14px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Hamburger */}
            <button onClick={() => setMenuAberto(true)} className="hamburger-btn"
              style={{ background:'none', border:'none', cursor:'pointer', flexDirection:'column', gap:4, padding:4, display:'none' }}>
              <span style={{ width:20, height:2, backgroundColor:PRIMARY, display:'block' }} />
              <span style={{ width:20, height:2, backgroundColor:PRIMARY, display:'block' }} />
              <span style={{ width:20, height:2, backgroundColor:PRIMARY, display:'block' }} />
            </button>
            <div>
              <h1 style={{ fontSize:'1.1rem', fontWeight:700, color:PRIMARY, margin:0 }}>Dashboard Consultor</h1>
              <p style={{ fontSize:'0.8rem', color:'#888', margin:0 }} className="hidden sm:block">
                Bem-vindo, {user?.user_metadata?.nome || 'Consultor'}
              </p>
            </div>
          </div>
          <Link to="/consultor/dashboard/profile"
            style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', color:PRIMARY, fontSize:14, fontWeight:600,
              padding:'8px 14px', borderRadius:8, border:`2px solid #f3e8ff`, backgroundColor:'white' }}>
            <User size={18} weight="duotone" color={ACCENT} />
            <span className="hidden sm:inline">Meu Perfil</span>
          </Link>
        </header>

        {!isMobilePriority && (
          <div className="mobile-banner" style={{ display:'none', backgroundColor:'#fffbeb', borderBottom:'1px solid #fcd34d', padding:'8px 16px', fontSize:'0.8rem', color:'#92400e' }}>
            💻 Esta tela é melhor no computador. No celular, use: Fila, Chat e Status da Venda.
          </div>
        )}

        <div style={{ flex:1, padding:'24px 20px', overflowY:'auto' }}>
          <Routes>
            <Route index element={<ConsultorHome />} />
            <Route path="fila" element={<QueuePanel />} />
            <Route path="chat" element={<ChatPanel />} />
            <Route path="historico" element={<HistoryPanel />} />
            <Route path="status-venda" element={<StatusVendaConsultor />} />
            <Route path="analytics" element={<AnalyticsPanel />} />
            <Route path="lojas" element={<StoresPanel />} />
            <Route path="clientes" element={<MeusClientes />} />
            <Route path="reviews" element={<ReviewsPanel />} />
            <Route path="treinamentos" element={<TrainingPanel />} />
            <Route path="vendas" element={<SalesTable />} />
            <Route path="report" element={<ReportPanel />} />
            <Route path="profile" element={<ProfilePanel />} />
            <Route path="summary" element={<AttendanceSummaryPanel />} />
            <Route path="*" element={<Navigate to="/consultor/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const ConsultorHome = () => {
  const navigate = useNavigate();
  const atalhos = [
    { titulo:'Fila de Atendimento', icon: Queue,    cor:ACCENT,     rota:'/consultor/dashboard/fila' },
    { titulo:'Atendimento Ativo',   icon: Chat,     cor:'#059669',  rota:'/consultor/dashboard/chat' },
    { titulo:'Status da Venda',     icon: Tag,      cor:'#f59e0b',  rota:'/consultor/dashboard/status-venda' },
    { titulo:'Comissões',           icon: ChartBar, cor:PRIMARY,    rota:'/consultor/dashboard/analytics' },
    { titulo:'Meus Clientes',       icon: Users,    cor:'#6366f1',  rota:'/consultor/dashboard/clientes' },
    { titulo:'Avaliações',          icon: Star,     cor:'#f59e0b',  rota:'/consultor/dashboard/reviews' },
  ];
  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <h2 style={{ fontSize:'1.4rem', fontWeight:700, color:PRIMARY, marginBottom:20 }}>Acesso Rápido</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
        {atalhos.map(({ titulo, icon: Icon, cor, rota }) => (
          <div key={rota} onClick={() => navigate(rota)}
            style={{ background:'white', borderRadius:12, padding:24, boxShadow:'0 2px 10px rgba(0,0,0,0.07)',
              cursor:'pointer', textAlign:'center', transition:'all 0.2s', border:`2px solid transparent` }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor=cor; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='transparent'; }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:cor+'18', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
              <Icon size={26} weight="duotone" color={cor} />
            </div>
            <p style={{ margin:0, fontWeight:600, color:'#333', fontSize:14 }}>{titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ConsultorDashboard() {
  return <DashboardLayout />;
}