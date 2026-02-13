import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { supabase } from '../supabaseClient'; 

const KasBook = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [equipe, setEquipe] = useState([]);
  const [user, setUser] = useState(null);

  const colors = {
    purple: '#2F0D51',
    pink: '#BB25A6',
    red: '#F53342',
    text: isDark ? '#EEE' : '#333',
    bg: isDark ? '#1A1E29' : '#FAFAFA',
    card: isDark ? '#2B2F38' : '#FFF'
  };

  const logoClara = "/img/Logo Clara.png";
  const logoBag = "/img/Logo Bag.png";

  useEffect(() => {
    const checkUser = async () => {
      // Usamos a instância única do supabase importada, evitando o erro de múltiplas instâncias
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        buscarEquipe(session.user.id);
      }
    };
    checkUser();
  }, []);

  const buscarEquipe = async (userId) => {
    const { data } = await supabase.from('vendedores').select('nome').eq('id_lojista', userId);
    if (data) setEquipe(data);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    const dataHoje = new Date().toLocaleDateString('pt-BR');

    doc.setFillColor(47, 13, 81);
    doc.rect(0, 0, 210, 40, 'F');
    // Adicionamos a logo no PDF (fallback caso não carregue)
    try { doc.addImage(logoClara, 'PNG', 15, 10, 35, 15); } catch(e) {}
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dataHoje}`, 160, 20);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.text("Minhas Anotações de Negócio", 20, 60);
    doc.setFontSize(11);
    const splitNotas = doc.splitTextToSize(notes || "Nenhuma nota inserida.", 170);
    doc.text(splitNotas, 20, 75);

    doc.setGState(new doc.GState({ opacity: 0.1 }));
    try { doc.addImage(logoBag, 'PNG', 160, 250, 30, 30); } catch(e) {}
    doc.setGState(new doc.GState({ opacity: 1 }));

    const footerY = 275;
    doc.setDrawColor(187, 37, 166);
    doc.line(20, footerY - 5, 190, footerY - 5);
    doc.setTextColor(187, 37, 166);
    doc.text("Cansado de organizar tudo no papel? Seja parceiro da Kaslee.", 20, footerY + 5);

    doc.save(`KasBook_2026_${dataHoje}.pdf`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg, color: colors.text }}>
      <img src={logoBag} style={{ position: 'fixed', bottom: '20px', right: '20px', width: '100px', opacity: 0.05, pointerEvents: 'none' }} alt="" />

      <aside style={{ width: '260px', backgroundColor: colors.purple, padding: '30px 20px', display: 'flex', flexDirection: 'column', color: '#FFF' }}>
        <img src={logoClara} style={{ width: '120px', margin: '0 auto 40px' }} alt="Kaslee" />
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <MenuItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="🏠 Home" />
          <MenuItem active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} label="📅 Agenda 2026" />
          <MenuItem active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} label="✅ Checklists" />
          <MenuItem active={activeTab === 'financeiro'} onClick={() => setActiveTab('financeiro')} label="💰 Financeiro" />
          <MenuItem active={activeTab === 'relatorios'} onClick={() => setActiveTab('relatorios')} label="🤖 Análise IA" />
        </nav>
        <button onClick={() => setIsDark(!isDark)} style={{ marginTop: 'auto', background: 'none', border: '1px solid #FFF5', color: '#FFF', padding: '8px', borderRadius: '20px', cursor: 'pointer', fontSize: '11px' }}>
          {isDark ? '☀️ MODO CLARO' : '🌙 MODO ESCURO'}
        </button>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative' }}>
        
        {activeTab === 'home' && (
          <section>
            <h2 style={{ marginBottom: '20px' }}>Meu Planejamento</h2>
            <div style={{ backgroundColor: colors.card, padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3>📝 Anotações Livres</h3>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ideias, metas e lembretes..." style={{ width: '100%', height: '200px', padding: '15px', marginTop: '10px', borderRadius: '10px', border: '1px solid #ddd', background: isDark ? '#333' : '#fff', color: 'inherit' }} />
              <button onClick={exportarPDF} style={{ marginTop: '15px', backgroundColor: colors.pink, color: '#FFF', border: 'none', padding: '10px 25px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>📄 Baixar Planejamento em PDF</button>
            </div>
          </section>
        )}

        {activeTab === 'agenda' && (
          <section>
            <h2>Agenda Comercial 2026</h2>
            <div style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <button onClick={() => setCurrentMonth(m => Math.max(0, m-1))}>←</button>
                    <h3 style={{ color: colors.pink }}>{["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][currentMonth]} 2026</h3>
                    <button onClick={() => setCurrentMonth(m => Math.min(11, m+1))}>→</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                    {/* CORREÇÃO DAS KEYS: Usando prefixo unico para evitar erro S e Q */}
                    {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d, idx) => <b key={`header-day-${idx}`}>{d[0]}</b>)}
                    {Array.from({length: 31}).map((_, i) => (
                        <div key={`dia-calendario-${i}`} style={{ padding: '10px', border: '1px solid #eee2', borderRadius: '5px', cursor: 'pointer' }}>{i+1}</div>
                    ))}
                </div>
                <p style={{ marginTop: '20px', fontSize: '13px', color: colors.pink }}>💡 Clique nos dias para anotar compromissos de venda ou feriados.</p>
            </div>
          </section>
        )}

        {/* FINANCEIRO E RELATÓRIOS SEGUEM A MESMA LÓGICA DE CORREÇÃO DE KEYS SE HOUVER MAPS */}
        {activeTab === 'financeiro' && (
           <section>
             <h2>Planejador de Gastos</h2>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
               <div style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '15px' }}>
                 <h3 style={{ color: '#2ecc71' }}>💰 Entradas (Vendas)</h3>
                 <textarea placeholder="Ex: Venda de hoje R$ 500,00" style={{ width: '100%', height: '100px', background: 'transparent', color: 'inherit', border: '1px solid #ddd', padding: '10px', marginTop: '10px' }} />
               </div>
               <div style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '15px' }}>
                 <h3 style={{ color: colors.red }}>💸 Saídas (Gastos)</h3>
                 <textarea placeholder="Ex: Fornecedor R$ 200,00" style={{ width: '100%', height: '100px', background: 'transparent', color: 'inherit', border: '1px solid #ddd', padding: '10px', marginTop: '10px' }} />
               </div>
             </div>
           </section>
        )}

        {activeTab === 'relatorios' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Análise Inteligente de Vendas</h2>
            {user ? (
              <div style={{ padding: '20px', borderRadius: '15px', backgroundColor: colors.card, borderLeft: `4px solid ${colors.pink}` }}>
                <p>✨ Relatório Sincronizado: Sua loja teve um crescimento positivo este mês.</p>
              </div>
            ) : (
              <div style={{ padding: '40px', borderRadius: '15px', backgroundColor: colors.card, textAlign: 'center', border: `2px dashed ${colors.pink}` }}>
                <h3>Bloqueado para visitantes 🔒</h3>
                <p style={{ margin: '15px 0' }}>Para ter relatórios reais da sua loja via IA, seja um parceiro Kaslee.</p>
                <button onClick={() => navigate('/onboarding')} style={{ backgroundColor: colors.pink, color: '#FFF', border: 'none', padding: '12px 25px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 Conhecer Planos</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const MenuItem = ({ active, onClick, label }) => (
  <button onClick={onClick} style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: active ? '#BB25A6' : 'transparent', color: '#FFF', fontWeight: active ? 'bold' : 'normal', fontSize: '15px', transition: '0.2s' }}>
    {label}
  </button>
);

export default KasBook;