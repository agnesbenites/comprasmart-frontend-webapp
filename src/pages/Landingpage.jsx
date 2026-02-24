// app-frontend/src/pages/Landingpage.jsx
// Landing Page KASLEE — Logos separadas, Logo Bag.png + Logo Clara.png

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaStore, FaUserTie, FaShoppingCart, FaChartLine,
  FaUsers, FaBox, FaBullhorn, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaDollarSign, FaRocket,
  FaMobileAlt, FaRegCheckCircle,
  FaBullseye, FaWarehouse, FaSlidersH, FaTachometerAlt,
  FaGraduationCap, FaLayerGroup,
  FaHandHoldingUsd, FaLaptopCode, FaTrophy, FaTimes
} from 'react-icons/fa';

/* ─── SCROLL REVEAL ─── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const Reveal = ({ children, delay = 0, style = {} }) => {
  const ref = useReveal();
  return (
    <div ref={ref} style={{ opacity: 0, transform: 'translateY(28px)', transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
};

/* ─── NAV BUTTON COM HOVER ─── */
const NavButton = ({ children, onClick, style = {} }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#bb25a6' : 'transparent',
        color: hovered ? '#fff' : '#bb25a6',
        border: '2px solid #bb25a6',
        padding: '8px 20px',
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 50,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

/* ─── HERO BUTTONS COM HOVER ─── */
const HeroBtnPink = ({ children, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#f53342' : 'transparent',
        color: hovered ? '#fff' : '#f53342',
        border: '2px solid #f53342',
        padding: '15px 32px',
        borderRadius: 50,
        fontFamily: "'Poppins',sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 4px 20px rgba(233,30,99,0.3)' : 'none',
      }}
    >
      {children}
    </button>
  );
};

const HeroBtnPurple = ({ children, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#bb25a6' : 'transparent',
        color: hovered ? '#fff' : '#bb25a6',
        border: '2px solid #bb25a6',
        padding: '15px 32px',
        borderRadius: 50,
        fontFamily: "'Poppins',sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? '0 4px 20px rgba(123,63,160,0.3)' : 'none',
      }}
    >
      {children}
    </button>
  );
};
/* ─── HOVER IMAGE CARD ─── */
const HoverImageCard = ({ src, label, sublabel }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, overflow: 'hidden', position: 'relative',
        height: 320, cursor: 'default',
      }}
    >
      <img
        src={src} alt={label}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.target.parentElement.style.background = '#f3eef8'; e.target.style.display = 'none'; }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered ? 'rgba(47,13,81,0.75)' : 'rgba(47,13,81,0.15)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.4s ease', padding: 20,
      }}>
        <p style={{
          fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700,
          color: '#fff', textAlign: 'center', margin: 0,
          opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.4s ease 0.05s',
        }}>{label}</p>
        {sublabel && (
          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 4,
            opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.4s ease 0.12s',
          }}>{sublabel}</p>
        )}
      </div>
    </div>
  );
};

/* ─── PLANOS DETALHADOS ─── */
const PLANOS_DETALHES = {
  basico: {
    sections: [
      { title: '📦 Produtos', items: ['Até 100 produtos cadastrados', 'Alteração de produto somente após 24h da inserção', 'Alteração de comissão por produto: 1x por semana', 'Alteração de comissão global: 1x por mês', 'Estoque atualizado via CSV (sem ERP)', 'ERP disponível como assinatura adicional'] },
      { title: '👥 Equipe', items: ['Até 10 consultores', 'Até 5 vendedores', '1 Filial + Matriz = 2 unidades', 'Pacote adicional disponível: R$ 49,90 (+1 filial, +2 vendedores, +20 produtos)'] },
      { title: '💬 Comunicação', items: ['Mensagem de texto ✅', 'Mensagem de áudio ✅', 'Imagens ✅', 'Vídeos ❌ (não incluso)', 'Chamada de vídeo ❌ (não incluso)'] },
      { title: '📊 Analytics', items: ['Relatório mensal completo', 'Em dezembro: analytics do ano personalizado'] },
      { title: '📣 Marketing', items: ['Campanhas de marketing com alcance de até 5km da localidade do cliente'] },
    ]
  },
  pro: {
    sections: [
      { title: '📦 Produtos', items: ['Até 500 produtos cadastrados', 'Alteração de produto após 12h da inserção', 'Alteração de comissão por produto: 1x por semana', 'Alteração de comissão global: 1x a cada 15 dias', 'Integração ERP 1x por mês (demais atualizações via CSV)', 'ERP disponível como assinatura adicional'] },
      { title: '👥 Equipe', items: ['Até 30 consultores', 'Até 20 vendedores', '5 Filiais + Matriz = 6 unidades', 'Adicionais cobrados à parte (vendedores, filiais, produtos)'] },
      { title: '💬 Comunicação', items: ['Mensagem de texto ✅', 'Mensagem de áudio ✅', 'Imagens ✅', 'Vídeos de até 15 segundos ✅', '6 chamadas de vídeo por mês'] },
      { title: '📊 Analytics', items: ['Relatório semanal', 'Relatório mensal', 'Em dezembro: analytics do ano personalizado'] },
      { title: '📣 Marketing', items: ['Campanhas de marketing com alcance de até 10km da localidade do cliente'] },
    ]
  },
  enterprise: {
    sections: [
      { title: '📦 Produtos', items: ['Até 1.000 produtos cadastrados', 'Alteração de produto após 4h da inserção', 'Alteração de comissão por produto após 8h', 'Alteração de comissão global: 1x por semana', 'Integração ERP automática e contínua (sem necessidade de CSV)'] },
      { title: '👥 Equipe', items: ['Até 80 consultores', 'Até 60 vendedores', '29 Filiais + Matriz = 30 unidades', 'Adicionais cobrados à parte (vendedores, filiais, produtos)'] },
      { title: '💬 Comunicação', items: ['Mensagem de texto ✅', 'Mensagem de áudio ✅', 'Imagens ✅', 'Vídeos de até 15 segundos ✅', 'Chamadas de vídeo ilimitadas ✅'] },
      { title: '📊 Analytics', items: ['Relatório diário', 'Relatório mensal', 'Em dezembro: analytics do ano personalizado'] },
      { title: '📣 Marketing', items: ['Campanhas de marketing com alcance de até 20km da localidade do cliente'] },
    ]
  },
};

const PlanCard = ({ name, price, period, description, features, color, highlighted, onBuy, planKey }) => {
  const [showModal, setShowModal] = React.useState(false);
  const detalhes = PLANOS_DETALHES[planKey];
  return (
    <>
      <div style={{
        background: color, borderRadius: 24, padding: '36px 24px 32px',
        width: 320, flexShrink: 0,
        textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column',
        height: 680,
        border: highlighted ? '3px solid #bb25a6' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: highlighted ? '0 16px 48px rgba(187,37,166,0.3)' : '0 8px 28px rgba(0,0,0,0.12)',
      }}>
        {highlighted && (
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
            background: '#bb25a6', color: '#fff', padding: '8px 22px', borderRadius: 30,
            fontSize: 12, fontWeight: 700, letterSpacing: 1, boxShadow: '0 4px 14px rgba(187,37,166,0.35)',
          }}>MAIS POPULAR</div>
        )}
        <h4 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 14, marginTop: 8, fontFamily: 'Poppins,sans-serif' }}>{name}</h4>
        <h3 style={{ fontSize: 46, fontWeight: 900, color: '#bb25a6', marginBottom: 4, fontFamily: 'Poppins,sans-serif' }}>{price}</h3>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>{period}</p>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.5 }}>{description}</p>
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', flexGrow: 1, overflow: 'hidden' }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 11, fontSize: 13, color: 'rgba(255,255,255,0.88)' }}>
              <FaRegCheckCircle color="#bb25a6" size={13} style={{ marginRight: 8, flexShrink: 0, marginTop: 2 }} /> {f}
            </li>
          ))}
        </ul>
        <button onClick={() => setShowModal(true)} style={{
          background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
          color: 'rgba(255,255,255,0.7)', borderRadius: 50, padding: '8px 0',
          fontSize: 13, cursor: 'pointer', marginBottom: 10, width: '100%',
          fontFamily: 'Poppins,sans-serif', transition: 'all 0.2s',
        }}>
          Ver detalhes completos ↓
        </button>
        <button onClick={onBuy} style={{
          width: '100%', padding: '15px 0', fontSize: 15, fontWeight: 700,
          fontFamily: 'Poppins,sans-serif', border: 'none', borderRadius: 50, cursor: 'pointer',
          background: highlighted ? '#bb25a6' : 'rgba(255,255,255,0.12)',
          color: '#fff', boxShadow: highlighted ? '0 4px 20px rgba(187,37,166,0.35)' : 'none',
        }}>ASSINAR AGORA</button>
      </div>

      {/* MODAL DETALHES */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 24, padding: '40px 36px',
            maxWidth: 600, width: '100%', maxHeight: '85vh', overflowY: 'auto',
            position: 'relative',
          }}>
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: 16, right: 16, background: 'none',
              border: 'none', fontSize: 22, cursor: 'pointer', color: '#666',
            }}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{ background: color, borderRadius: 12, padding: '8px 20px' }}>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 18, color: '#bb25a6' }}>Plano {name}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 900, fontSize: 28, color: '#2f0d51' }}>{price}</span>
                <span style={{ fontSize: 13, color: '#999', marginLeft: 4 }}>{period}</span>
              </div>
            </div>
            {detalhes?.sections.map((sec, si) => (
              <div key={si} style={{ marginBottom: 24 }}>
                <h4 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 15, fontWeight: 700, color: '#2f0d51', marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>{sec.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {sec.items.map((item, ii) => (
                    <li key={ii} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7, fontSize: 14, color: '#555', lineHeight: 1.5 }}>
                      <span style={{ color: '#bb25a6', flexShrink: 0, marginTop: 2 }}>•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={onBuy} style={{
              width: '100%', padding: '15px 0', fontSize: 15, fontWeight: 700,
              fontFamily: 'Poppins,sans-serif', border: 'none', borderRadius: 50, cursor: 'pointer',
              background: '#bb25a6', color: '#fff', marginTop: 8,
              boxShadow: '0 4px 20px rgba(187,37,166,0.3)',
            }}>ASSINAR AGORA</button>
          </div>
        </div>
      )}
    </>
  );
};

/* ═════════════════════════════════════════════
   LANDING PAGE
   ═════════════════════════════════════════════ */

/* ─── BETA SECTION COM TABS ─── */
const BETA_PERFIS = {
  consultor: {
    emoji: '🎯',
    titulo: 'Para Consultores',
    subtitulo: 'Autonomia, comissão e crescimento sem depender de empregador',
    desc: 'Conecte-se a lojistas parceiros, atenda clientes qualificados e receba comissão desde o primeiro atendimento. Você define seus horários e segmentos.',
    beneficios: [
      'Comissão por venda, sem teto de ganhos',
      'Escolha os segmentos que domina',
      'Treinamentos e Arena de Vendas inclusos',
      'Badge de Beta Consultor exclusivo',
      'Comunidade fechada de consultores',
      'Suporte direto com a fundadora',
    ],
    cta: 'Quero ser Beta Consultor',
    link: 'https://forms.office.com/r/7KuKzZkZvp',
    cor: '#bb25a6',
    btnBg: '#bb25a6',
    btnColor: '#fff',
    bg: 'linear-gradient(135deg, rgba(187,37,166,0.18), rgba(187,37,166,0.05))',
    border: 'rgba(187,37,166,0.35)',
  },
  lojista: {
    emoji: '🏪',
    titulo: 'Para Lojistas',
    subtitulo: 'Expanda suas vendas sem contratar mais funcionários',
    desc: 'Conecte sua loja a consultores especializados no seu segmento. Você controla preços, comissões e recebe automaticamente. Zero custo fixo.',
    beneficios: [
      'Acesso completo grátis durante o beta',
      'Sem taxa de setup nem mensalidade inicial',
      'Consultores pré-selecionados por segmento',
      'Dashboard de controle completo',
      'Relatórios de vendas em tempo real',
      'Suporte prioritário com a fundadora',
    ],
    cta: 'Quero ser Beta Lojista',
    link: 'https://forms.office.com/r/cb1fKfHX25',
    cor: '#2f0d51',
    btnBg: '#fff',
    btnColor: '#2f0d51',
    bg: 'linear-gradient(135deg, rgba(47,13,81,0.2), rgba(47,13,81,0.06))',
    border: 'rgba(255,255,255,0.2)',
  },

};

const BetaSection = () => {
  const [aba, setAba] = React.useState('consultor');
  const perfil = BETA_PERFIS[aba];
  return (
    <section id="beta" style={{ background: 'linear-gradient(135deg,#2f0d51 0%,#1a0730 50%,#2f0d51 100%)', padding: '72px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(187,37,166,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(187,37,166,0.07)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ background: '#bb25a6', color: 'white', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>🚀 Beta Aberto — Vagas Limitadas</span>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#fff', margin: '18px 0 10px', lineHeight: 1.2 }}>Faça parte da primeira turma Kaslee</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>Teste gratuitamente, dê feedback direto com a fundadora e ajude a moldar o futuro do varejo conectado.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {Object.entries(BETA_PERFIS).map(([key, p]) => (
            <button key={key} onClick={() => setAba(key)} style={{ padding: '10px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.25s', background: aba === key ? p.cor : 'rgba(255,255,255,0.1)', color: aba === key ? '#fff' : 'rgba(255,255,255,0.65)', boxShadow: aba === key ? `0 4px 16px \${p.cor}55` : 'none' }}>
              {p.emoji} {p.titulo.replace('Para ', '')}
            </button>
          ))}
        </div>
        <div style={{ background: perfil.bg, border: `1px solid \${perfil.border}`, borderRadius: 24, padding: '40px 36px', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 32, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{perfil.emoji}</div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>{perfil.titulo}</h3>
              <p style={{ fontSize: 14, color: '#bb25a6', fontWeight: 600, marginBottom: 14 }}>{perfil.subtitulo}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 28 }}>{perfil.desc}</p>
              <a href={perfil.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: perfil.btnBg, color: perfil.btnColor, borderRadius: 50, padding: '14px 28px', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: `0 4px 20px \${perfil.cor}44` }}>
                {perfil.cta} →
              </a>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>O que você ganha:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {perfil.beneficios.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.88)', marginBottom: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 10 }}>
                    <span style={{ color: '#0accbd', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>⚡ Vagas limitadas. Garanta a sua agora.</p>
      </div>
    </section>
  );
};


/* ─── FEATURE CARD — texto normal, hover mostra imagem ao lado ─── */
const FeatureCard = ({ title, description, image }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 220, maxWidth: 300, height: 200,
        borderRadius: 18, border: '1px solid rgba(47,13,81,0.08)',
        background: '#fff', padding: 22, cursor: 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.35s ease',
        boxShadow: hovered ? '0 8px 30px rgba(47,13,81,0.12)' : '0 2px 8px rgba(47,13,81,0.05)',
      }}
    >
      <div style={{ flex: 1, paddingRight: hovered ? 10 : 0, transition: 'all 0.3s ease' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2f0d51', marginBottom: 8, fontFamily: 'Poppins,sans-serif', lineHeight: 1.3 }}>{title}</h3>
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.55, margin: 0 }}>{description}</p>
      </div>
      {hovered && (
        <img src={image} alt="" style={{ width: 90, height: 90, objectFit: 'contain', marginLeft: 12, flexShrink: 0 }}
          onError={e => e.target.style.display = 'none'} />
      )}
    </div>
  );
};

/* ─── BENEFÍCIOS COM TABS ─── */
const BENEFICIOS_DATA = {
  consultor: {
    label: '🎯 Consultor',
    cor: '#bb25a6',
    titulo: 'Para Consultores',
    subtitulo: 'Liberdade, Renda e Crescimento Profissional',
    desc: 'Transforme seu conhecimento em lucro. Trabalhe de forma flexível, escolha os segmentos que domina e receba comissão desde o primeiro atendimento.',
    items: [
      { icon: '⏰', t: 'Flexibilidade Total', d: 'Trabalhe de onde quiser, defina seus horários e a quantidade de tempo que deseja dedicar.' },
      { icon: '🎯', t: 'Escolha o Seu Segmento', d: 'Selecione as lojas e os segmentos que você domina e tem paixão em vender.' },
      { icon: '💰', t: 'Comissão Direta', d: 'Receba sua comissão diretamente na conta via Stripe. Sem intermediários, sem atrasos.' },
      { icon: '💻', t: 'Consultor Digital do Varejo', d: 'Represente marcas e atenda clientes online sem abrir uma loja.' },
      { icon: '🏆', t: 'Arena de Vendas e Rankings', d: 'Treine com simulações reais, suba no ranking e desbloqueie novas habilidades.' },
      { icon: '👥', t: 'Carteira de Clientes Própria', d: 'Construa sua base de clientes fiéis ao longo do tempo.' },
      { icon: '📊', t: 'Relatórios de Performance', d: 'Acompanhe suas vendas, comissões e evolução com dashboards completos.' },
      { icon: '🎓', t: 'Treinamentos Inclusos', d: 'Acesse trilhas de conhecimento e simulações com IA para evoluir como consultor.' },
    ],
  },
  lojista: {
    label: '🏪 Lojista',
    cor: '#2f0d51',
    titulo: 'Para Lojistas',
    subtitulo: 'Multiplique Seu Alcance e Suas Vendas',
    desc: 'Conecte sua loja a consultores especializados, controle tudo em tempo real e venda mais sem aumentar custo fixo.',
    items: [
      { icon: '🎯', t: 'Público Alvo na Mão', d: 'Os consultores levam seu estoque exatamente para o público que está buscando.' },
      { icon: '📦', t: 'Zero Estoque Parado', d: 'Venda rapidamente itens parados, transformando produto em capital de giro.' },
      { icon: '⚙️', t: 'Comissão Flexível', d: 'Defina e ajuste a comissão dos consultores. Custo de aquisição sob seu controle.' },
      { icon: '📊', t: 'Gestão Centralizada', d: 'Acompanhe vendas e desempenho dos consultores em um único dashboard.' },
      { icon: '🎓', t: 'Vendedores Especializados', d: 'Autorize consultores que entendem seus produtos. Orientação técnica correta.' },
      { icon: '📣', t: 'Campanhas de Sucesso', d: 'Crie promoções exclusivas dentro da plataforma por produto.' },
      { icon: '🤝', t: 'Rede de Consultores Prontos', d: 'Acesse profissionais qualificados por segmento, prontos para vender.' },
      { icon: '💳', t: 'Recebimento Automático', d: 'A comissão do consultor é descontada na hora. Você recebe o líquido via Stripe.' },
    ],
  },
};

const BeneficiosSection = () => {
  const renderPerfil = (key) => {
    const perfil = BENEFICIOS_DATA[key];
    const ctaBtn = (
      <a href="/onboarding" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: perfil.cor, color: '#fff',
        padding: '13px 28px', borderRadius: 50,
        fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
        textDecoration: 'none', boxShadow: `0 4px 20px ${perfil.cor}44`,
        whiteSpace: 'nowrap',
      }}>
        🚀 Começar Agora
      </a>
    );
    return (
      <section id={key} key={key} style={{ background: key === 'consultor' ? '#f7f3fc' : '#faf6f0', padding: '72px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(22px,5vw,36px)', fontWeight: 800, color: '#2f0d51', marginBottom: 6 }}>{perfil.titulo}</h2>
                <p style={{ fontSize: 15, color: perfil.cor, fontWeight: 600, marginBottom: 0 }}>{perfil.subtitulo}</p>
              </div>
              {ctaBtn}
            </div>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, maxWidth: 640, marginBottom: 40, marginTop: 16 }}>{perfil.desc}</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {perfil.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 18px', borderRadius: 14, background: '#fff', border: '1px solid rgba(47,13,81,0.07)', boxShadow: '0 2px 8px rgba(47,13,81,0.05)' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <h4 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700, color: '#2f0d51', margin: '0 0 4px' }}>{item.t}</h4>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.55, margin: 0 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            {ctaBtn}
          </div>
        </div>
      </section>
    );
  };
  return <>{renderPerfil('consultor')}{renderPerfil('lojista')}</>;
};

/* ─── HOVER NAV LINK ─── */
const HoverNavLink = ({ href, children }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        color: hovered ? '#2f0d51' : '#555',
        fontSize: 13,
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: 50,
        border: hovered ? '1.5px solid #2f0d51' : '1.5px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </a>
  );
};

/* ─── FAQ — POR QUE NÃO SOMOS UM MARKETPLACE ─── */
const FAQ_ITEMS = [
  {
    pergunta: 'Por que não somos um marketplace?',
    resposta: 'Porque nosso foco é no atendimento, não na vitrine. No marketplace, você compete com centenas de outras lojas do mesmo segmento na mesma tela — e quem paga mais por anúncio aparece primeiro. Na Kaslee, um consultor especializado apresenta o seu produto para o cliente certo, com atenção e contexto. É uma experiência completamente diferente de compra.',
  },
  {
    pergunta: 'Por que não existe algoritmo que esconde meu produto?',
    resposta: 'No marketplace tradicional, a visibilidade é vendida. Se você não investir em anúncio patrocinado, seu produto fica enterrado. Na Kaslee não existe esse leilão — o consultor escolhe os produtos que acredita e os apresenta ativamente. Seu produto não some porque você não pagou a mais por isso.',
  },
  {
    pergunta: 'Por que incluir consultores na minha loja em vez de contratar vendedores?',
    resposta: 'Contratar um vendedor fixo tem custo garantido todo mês: salário, INSS, benefícios, encargos — independente de vender ou não. Com consultores autônomos via Kaslee, você só paga comissão quando a venda acontece. Zero risco, zero folha aumentada, e ainda conta com profissionais especializados no seu segmento.',
  },
  {
    pergunta: 'O cliente fica desassistido como nos outros marketplaces?',
    resposta: 'Não. Esse é exatamente o nosso diferencial. O cliente não fica sozinho rolando uma página infinita tentando decidir entre dezenas de produtos similares. Ele é atendido por um consultor que entende do assunto, tira dúvidas em tempo real, explica as diferenças e acompanha a compra do início ao fim. Segurança e confiança em cada etapa.',
  },
  {
    pergunta: 'Minha loja vai competir com outras lojas dentro da Kaslee?',
    resposta: 'Não da forma que acontece nos marketplaces. Os consultores que você autoriza trabalham com os seus produtos, dentro da sua comissão, focados nos seus clientes. Não existe uma prateleira onde o cliente compara sua loja com a do concorrente lado a lado — o consultor apresenta o que é seu.',
  },
];

const FaqItem = ({ pergunta, resposta, aberto, onToggle }) => (
  <div style={{
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
  }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 0', textAlign: 'left', gap: 16,
      }}
    >
      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
        {pergunta}
      </span>
      <span style={{
        flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
        background: aberto ? '#bb25a6' : 'rgba(187,37,166,0.15)',
        border: '1px solid rgba(187,37,166,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, color: '#bb25a6', fontWeight: 700,
        transition: 'all 0.3s',
        transform: aberto ? 'rotate(45deg)' : 'rotate(0deg)',
        color: aberto ? '#fff' : '#bb25a6',
      }}>+</span>
    </button>
    <div style={{
      maxHeight: aberto ? 300 : 0,
      overflow: 'hidden',
      transition: 'max-height 0.4s ease',
    }}>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: '0 0 24px', paddingRight: 48 }}>
        {resposta}
      </p>
    </div>
  </div>
);

const NaoSomosMarketplace = () => {
  const [aberto, setAberto] = React.useState(0);
  return (
    <section style={{ background: '#2f0d51', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(187,37,166,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(187,37,166,0.05)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#bb25a6', textTransform: 'uppercase', marginBottom: 12 }}>Nossa diferença</p>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
            Por que não somos<br />um marketplace?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 52 }}>
            Marketplace te coloca numa prateleira. A Kaslee coloca um especialista do seu lado.
          </p>
        </Reveal>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={i}
              pergunta={item.pergunta}
              resposta={item.resposta}
              aberto={aberto === i}
              onToggle={() => setAberto(aberto === i ? null : i)}
            />
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ marginTop: 52, padding: '28px 36px', background: 'rgba(187,37,166,0.1)', border: '1px solid rgba(187,37,166,0.25)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Poppins',sans-serif" }}>
              Marketplace te usa.<br />
              <span style={{ color: '#bb25a6' }}>A Kaslee te representa.</span>
            </p>
            <a href="/onboarding" style={{ textDecoration: 'none', background: '#bb25a6', color: '#fff', padding: '14px 32px', borderRadius: 50, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(187,37,166,0.4)' }}>
              Começar Agora →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Landingpage = () => {
  const navigate = useNavigate();
  const [showArenaModal, setShowArenaModal] = useState(false);
  const [showSaibaMais, setShowSaibaMais] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToPlanos = () => { document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' }); };

  const STRIPE_URLS = {
    BASICO: 'https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01',
    PRO: 'https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02',
    ENTERPRISE: 'https://buy.stripe.com/6oU28r5LiemMaBM8SJgQE0a',
  };
  const handleStripe = (url) => { window.location.href = url; };

  return (
    <div style={S.page}>

      {/* ══════ NAVBAR RESPONSIVA ══════ */}
      <header style={S.navbar}>
        <div style={S.navInner}>
          <div style={S.logoArea}>
            <a href="#" style={S.logoLink}>
              <img
                src="/img/Logo Clara.png"
                alt="Kaslee"
                style={S.navLogoName}
                onError={e => {
                  e.target.onerror = null; e.target.style.display = 'none';
                  e.target.parentElement.insertAdjacentHTML('beforeend',
                    '<span style="font-size:24px;font-weight:800;color:#2f0d51;font-family:Poppins,sans-serif;">Kaslee</span>'
                  );
                }}
              />
            </a>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }} className="desktop-nav">
            <HoverNavLink href="#como-funciona">Como Funciona</HoverNavLink>
            <HoverNavLink href="#consultor">Para Consultores</HoverNavLink>
            <HoverNavLink href="#lojista">Para Lojistas</HoverNavLink>
            <HoverNavLink href="#planos">Planos</HoverNavLink>
            <HoverNavLink href="#beta">Beta</HoverNavLink>
            <NavButton onClick={() => navigate('/quiz')} style={{ fontSize: 13, padding: '7px 16px', whiteSpace: 'nowrap' }}>Descubra Seu Plano</NavButton>
            <NavButton onClick={() => navigate('/login')} style={{ fontSize: 13, padding: '7px 16px' }}>Entrar</NavButton>
            <NavButton onClick={() => navigate('/onboarding')} style={{ fontSize: 13, padding: '7px 16px', whiteSpace: 'nowrap' }}>Começar Agora</NavButton>
          </nav>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger"
            style={{
              display: 'none', background: 'none', border: 'none',
              cursor: 'pointer', flexDirection: 'column', gap: '5px', padding: '4px',
            }}
          >
            <span style={{ width: 24, height: 2, backgroundColor: '#2f0d51', display: 'block', transition: 'all 0.3s',
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
            <span style={{ width: 24, height: 2, backgroundColor: '#2f0d51', display: 'block',
              opacity: mobileMenuOpen ? 0 : 1, transition: 'all 0.3s' }}></span>
            <span style={{ width: 24, height: 2, backgroundColor: '#2f0d51', display: 'block', transition: 'all 0.3s',
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu" style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            padding: '16px 24px 20px', borderTop: '1px solid #eee',
            backgroundColor: '#fff',
          }}>
            <a href="#como-funciona" style={{...S.navA, padding: '10px 0', borderBottom: '1px solid #f0f0f0'}} onClick={() => setMobileMenuOpen(false)}>Como Funciona</a>
            <a href="#beneficios" style={{...S.navA, padding: '10px 0', borderBottom: '1px solid #f0f0f0'}} onClick={() => setMobileMenuOpen(false)}>Benefícios</a>
            <a href="#planos" style={{...S.navA, padding: '10px 0', borderBottom: '1px solid #f0f0f0'}} onClick={() => setMobileMenuOpen(false)}>Planos</a>
            <button onClick={() => navigate('/institucional')} style={{...S.navBtnSobre, marginTop: 4, width: '100%'}}>Sobre a Kaslee</button>
            <NavButton onClick={() => { navigate('/quiz'); setMobileMenuOpen(false); }} style={{width: '100%', marginTop: 4}}>Descubra Seu Plano</NavButton>
            <NavButton onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} style={{width: '100%', marginTop: 4}}>Entrar</NavButton>
            <NavButton onClick={() => { navigate('/onboarding'); setMobileMenuOpen(false); }} style={{width: '100%', marginTop: 4, background: '#bb25a6', color: '#fff'}}>Começar Agora</NavButton>
          </div>
        )}
      </header>

      {/* ══════ HERO — Logo GRANDE no lado direito ══════ */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroLeft}>
            <Reveal>
              <h1 style={S.heroTitle}>Uma nova forma de vender no varejo</h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={S.heroSub}>
                A Kaslee conecta lojas a consultores independentes que divulgam, explicam e vendem seus produtos online, enquanto você controla preços, comissões e recebe tudo automaticamente.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div style={S.heroBtns}>
                <HeroBtnPink onClick={() => document.getElementById('consultor')?.scrollIntoView({ behavior: 'smooth' })}>
                  🎯 Para Consultores
                </HeroBtnPink>
                <HeroBtnPurple onClick={() => document.getElementById('lojista')?.scrollIntoView({ behavior: 'smooth' })}>
                  🏪 Para Lojistas
                </HeroBtnPurple>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div style={S.badges}>
                {['Sem taxa de setup', 'Relatórios de vendas', 'Treinamentos para vendedores e consultores'].map((t, i) => (
                  <div key={i} style={S.badge}><FaCheckCircle color="#0accbd" size={18} /><span>{t}</span></div>
                ))}
              </div>
            </Reveal>
          </div>

          <div style={S.heroRight}>
            <Reveal delay={0.3}>
              <img
                src="/img/Logo Clara.png"
                alt="Kaslee"
                style={S.heroSacola}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════ NÚMEROS ══════ */}
      <section style={S.numbersBar}>
        {[
          { val: 'Comissão', label: 'Você paga só quando vende' },
          { val: 'Zero', label: 'Custos com folha de pagamento' },
          { val: '24/7', label: 'Vendedores ativos online' },
          { val: '10min', label: 'Para começar a vender' },
        ].map((n, i) => (
          <Reveal key={i} delay={i * 0.1} style={S.numCard}>
            <h2 style={S.numVal}>{n.val}</h2>
            <p style={S.numLabel}>{n.label}</p>
          </Reveal>
        ))}
      </section>

      {/* ══════ COMO FUNCIONA — 4 cards em linha com hover imagem ══════ */}
      <section id="como-funciona" style={{ padding: '60px 40px', background: '#FAFAFA' }}>
        <Reveal>
          <h2 style={S.secTitle}>Como Funciona?</h2>
          <p style={S.secSub}>Simples, rápido e sem complicação</p>
        </Reveal>
        <div style={{ display: 'flex', gap: 20, marginTop: 40, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1200, margin: '40px auto 0' }}>
          <FeatureCard title="Você Cadastra Produtos" description="Adicione os produtos da sua loja na plataforma com fotos, preços e descrições" image="/img/carrinhoprodutos.png" />
          <FeatureCard title="Consultores se candidatam" description="Profissionais autônomos promovem seus produtos para clientes qualificados" image="/img/atendimentoimagem.png" />
          <FeatureCard title="Cliente Compra" description="Venda finalizada com segurança. Cliente pode retirar na loja ou receber em casa" image="/img/qrcodecliente.png" />
          <FeatureCard title="Você Recebe" description="Pagamento processado automaticamente. Consultor recebe comissão, você recebe o lucro" image="/img/carrinhosacola.png" />
        </div>

        {/* ARENA DE VENDAS + SAIBA MAIS */}
        <Reveal delay={0.3}>
          <div style={{ marginTop: 40, padding: '36px 40px', borderRadius: 20, background: '#fff', border: '2px solid #2f0d51', boxShadow: '0 4px 20px rgba(47,13,81,0.08)', maxWidth: 1200, margin: '40px auto 0' }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 700, color: '#2f0d51', marginBottom: 8 }}>🎮 Arena de Vendas</h3>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.65, marginBottom: 16 }}>
              Sistema de gamificação para treinamento de equipes de vendas. Consultores praticam com personas reais, ganham pontos, desbloqueiam novas habilidades e sobem no ranking.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
              <button onClick={() => setShowArenaModal(true)} style={{ background: '#2f0d51', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
                Conhecer a Arena de Vendas →
              </button>
              <button onClick={() => setShowSaibaMais(true)} style={{ background: 'transparent', color: '#bb25a6', border: '2px solid #bb25a6', padding: '8px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" }}>
                Saiba Mais sobre a Kaslee →
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════ FAQ — POR QUE NÃO SOMOS UM MARKETPLACE ══════ */}
      <NaoSomosMarketplace />

      {/* ══════ BENEFÍCIOS COM TABS ══════ */}
      <BeneficiosSection />

      {/* ══════ PLANOS ══════ */}

      <section id="planos" style={{ padding: '80px 40px', background: '#FAFAFA' }}>
        <Reveal>
          <h2 style={S.secTitle}>Escolha Seu Plano</h2>
          <p style={S.secSub}>Comece agora e evolua conforme sua loja cresce</p>
        </Reveal>
        <div style={S.plansRow}>
          <Reveal delay={0.05}>
            <PlanCard name="Básico" price="R$ 99,90" period="por mês" description="Ideal para começar" color="#1a0a2e"
              features={['Até 100 produtos','Até 5 consultores','Dashboard básico','Chat: texto, áudio e imagens','Comissões configuráveis','Relatório mensal']}
              planKey="basico" onBuy={() => handleStripe(STRIPE_URLS.BASICO)} />
          </Reveal>
          <Reveal delay={0.15}>
            <PlanCard name="Pro" price="R$ 199,90" period="por mês" description="Para lojas em crescimento" color="#2f0d51" highlighted
              features={['Até 500 produtos','Até 30 consultores','Dashboard avançado','Chat + vídeo (6x/mês)','Campanhas até 10km','6 filiais','Relatórios semanais','Suporte prioritário']}
              planKey="pro" onBuy={() => handleStripe(STRIPE_URLS.PRO)} />
          </Reveal>
          <Reveal delay={0.25}>
            <PlanCard name="Enterprise" price="R$ 499,00" period="por mês" description="Para grandes operações" color="#1a0a2e"
              features={['Até 1.000 produtos','Até 80 consultores','Videochamadas ilimitadas','ERP automático (sem CSV)','Campanhas até 20km','30 filiais','Analytics diário','Suporte premium 24/7']}
              planKey="enterprise" onBuy={() => handleStripe(STRIPE_URLS.ENTERPRISE)} />
          </Reveal>
        </div>
        <Reveal delay={0.3}>
          <p style={{ textAlign: 'center', color: '#757575', fontSize: 15, marginTop: 36 }}>
             <strong>Teste por 30 dias</strong> em todos os planos &nbsp;
          </p>
        </Reveal>
      </section>

      {/* ══════ CTA FINAL — só Logo Clara (nome) em branco ══════ */}
      <section style={S.ctaFinal}>
        <Reveal>
          <h2 style={S.ctaTitle}>Pronto para Aumentar Suas Vendas?</h2>
          <p style={S.ctaSub}>Comece agora hoje e veja sua loja crescer</p>
          <div style={S.ctaBtns}>
            <button onClick={() => navigate('/onboarding')} style={S.ctaBtnPrimary}>
              <FaRocket style={{ marginRight: 8 }} /> Começar Agora
            </button>
          </div>
        </Reveal>
      </section>

      {/* ══════ MODAL SAIBA MAIS ══════ */}
      {showSaibaMais && (
        <div style={S.modalOverlay} onClick={() => setShowSaibaMais(false)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSaibaMais(false)} style={S.modalClose}>
              <FaTimes size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span style={{ fontSize: 48 }}>🧠</span>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 800, color: '#2f0d51', marginTop: 12 }}>
                Como a Kaslee Funciona Por Dentro
              </h2>
              <p style={{ fontSize: 15, color: '#777', marginTop: 8 }}>
                Tecnologia, dados e inteligência artificial a serviço das suas vendas
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { emoji: '', title: 'IA Integrada', desc: 'Otimizamos vendas, sugerimos produtos, analisamos desempenho e fornecemos feedback personalizado com inteligência artificial em toda a plataforma.' },
                { emoji: '', title: 'Algoritmo de Matching', desc: 'Conectamos consultores aos produtos certos com base em histórico de vendas, especialização e localização geográfica.' },
                { emoji: '', title: 'Uso Inteligente de Dados', desc: 'Relatórios detalhados sobre quais produtos vendem mais, em quais horários e por quais consultores. Tudo em conformidade com a LGPD.' },
                { emoji: '', title: 'Segurança e LGPD', desc: 'Dados criptografados, pagamentos pela Stripe e total conformidade com a Lei Geral de Proteção de Dados.' },
                { emoji: '🔗', title: 'Integrações e API', desc: 'Conecte seu ERP, gestão de estoque e ferramentas de marketing. Nossa API automatiza processos e integra sua operação.' },
                { emoji: '', title: 'BI e Previsão de Vendas', desc: 'Business Intelligence avançado com previsão baseada em dados históricos, tendências e identificação de produtos com baixo giro.' },
                { emoji: '🎮', title: 'Arena de Vendas', desc: 'Gamificação com simulações de personas reais, ranking, badges e feedback da IA para treinar equipes de forma prática.' },
                { emoji: '🎛️', title: 'Controle Total', desc: 'O lojista define preços, comissões, regras e acompanha em tempo real cada etapa: carrinho, pagamento, separação e entrega.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 12px', background: i % 2 === 0 ? '#f9f7fb' : '#fff', borderRadius: 12 }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{item.emoji}</span>
                  <div>
                    <h4 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, color: '#2f0d51', margin: '0 0 4px' }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid #eee' }}>
              <button onClick={() => { setShowSaibaMais(false); scrollToPlanos(); }} style={S.arenaModalBtn}>
                Ver Planos e Começar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ MODAL ARENA DE VENDAS ══════ */}
      {showArenaModal && (
        <div style={S.modalOverlay} onClick={() => setShowArenaModal(false)}>
          <div style={{ ...S.modalContent, maxWidth: 780 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowArenaModal(false)} style={S.modalClose}>
              <FaTimes size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span style={{ fontSize: 48 }}></span>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, color: '#2f0d51', marginTop: 12 }}>
                Kaslee Arena de Vendas
              </h2>
              <p style={{ fontSize: 14, color: '#777', marginTop: 6 }}>
                Treine, evolua e desbloqueie novas oportunidades de venda como em um jogo
              </p>
            </div>

            {/* COMO FUNCIONA */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700, color: '#2f0d51', marginBottom: 10, borderBottom: '2px solid #f3eef8', paddingBottom: 6 }}>
                Como Funciona?
              </h3>
              {[
                { step: '1', text: 'Escolha: aprimorar conhecimento atual ou explorar novo segmento (ex: Moda Plus Size, Eletrônicos)' },
                { step: '2', text: 'IA cria trilha personalizada: Conhecimento → Simulação com Personas → Avaliação' },
                { step: '3', text: 'Sessões curtas de até 15 min. Timer pausa quando você precisa atender um cliente real' },
                { step: '4', text: 'IA ajusta dificuldade: acertou muito? Fica mais difícil. Errou? Reforça o básico' },
                { step: '5', text: 'Trilha completa = Nova habilidade desbloqueada! Badge no perfil + acesso a lojas do segmento' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', background: i % 2 === 0 ? '#f9f7fb' : '#fff', borderRadius: 10, marginBottom: 4 }}>
                  <span style={{ background: '#bb25a6', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.step}</span>
                  <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5, margin: 0 }}>{s.text}</p>
                </div>
              ))}
            </div>

            {/* FUNCIONALIDADES */}
            <div style={S.arenaGrid}>
              {[
                { emoji: '', title: 'Simulação com Personas', desc: 'Personas com objeções realistas. Dificuldade crescente conforme seu desempenho.' },
                { emoji: '', title: 'Pontos e Ranking', desc: 'De 10 a 200 pts por ação. Ranking geral, por segmento e semanal.' },
                { emoji: '', title: '5 Níveis', desc: 'Iniciante → Aprendiz → Vendedor → Especialista → Mestre de Vendas.' },
                { emoji: '🔓', title: 'Desbloqueio de Habilidades', desc: 'Complete trilhas e desbloqueie novos segmentos. Candidatura automática a lojas.' },
                { emoji: '⏱️', title: 'Timer Inteligente', desc: 'Pausa quando atende cliente real. Restaura de onde parou.' },
                { emoji: '', title: 'IA Adaptativa', desc: 'Feedback detalhado, dicas de estudo e relatórios de evolução pessoal.' },
              ].map((item, i) => (
                <div key={i} style={S.arenaGridItem}>
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <h4 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: '#2f0d51', margin: '6px 0 4px' }}>{item.title}</h4>
                  <p style={{ fontSize: 12, color: '#666', lineHeight: 1.45 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: 13, color: '#555', marginBottom: 14 }}>
                A Arena está disponível como addon em todos os planos Kaslee, a partir de R$ 15/mês.
              </p>
              <button onClick={() => { setShowArenaModal(false); scrollToPlanos(); }} style={S.arenaModalBtn}>
                Ver Planos e Começar
              </button>
            </div>
          </div>
        </div>
      )}

      <BetaSection />

      {/* ══════ FOOTER — só Logo Bag ══════ */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.footerCol}>
            <p style={S.footerTxt}>A plataforma que conecta lojas, consultores e clientes.</p>
          </div>
          <div style={S.footerCol}>
            <h4 style={S.footerH}>Links Rápidos</h4>
            <a href="#como-funciona" style={S.fLink}>Como Funciona</a>
            <a href="#beneficios" style={S.fLink}>Benefícios</a>
            <a href="#planos" style={S.fLink}>Planos</a>
          </div>
          <div style={S.footerCol}>
            <h4 style={S.footerH}>Suporte</h4>
            <a href="/termos" style={S.fLink}>Termos de Uso</a>
            <a href="/privacidade" style={S.fLink}>Privacidade</a>
            <a href="mailto:contato@kaslee.com" style={S.fLink}>Contato</a>
          </div>
          <div style={S.footerCol}>
            <h4 style={S.footerH}>Empresa</h4>
            <a href="/institucional" style={S.fLink}>Sobre a Kaslee</a>
            <a href="/institucional" style={S.fLink}>Nossa história</a>
            <a href="mailto:contato@kaslee.com" style={S.fLink}>Trabalhe conosco</a>
          </div>
        </div>
        <div style={S.footerBot}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>© 2026 Kaslee. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

/* ═════════════════════════════════════════════
   STYLES
   ═════════════════════════════════════════════ */
const S = {
  page: {
    fontFamily: "'DM Sans','Inter','Segoe UI',sans-serif",
    color: '#333', background: '#FAFAFA', minHeight: '100vh', overflowX: 'hidden',
  },

  navbar: {
    position: 'sticky', top: 0, zIndex: 100,
    background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)',
    padding: '12px 20px',
  },
  navInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logoLink: { display: 'flex', alignItems: 'center', textDecoration: 'none' },
  logoArea: { display: 'flex', alignItems: 'center', gap: 16 },
  navLogoName: { height: 64, width: 'auto', objectFit: 'contain', maxWidth: 180 },
  navLinks: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  navA: { textDecoration: 'none', color: '#555', fontSize: 14, fontWeight: 500 },
  navBtn: {
    background: 'transparent',
    color: '#bb25a6',
    border: '2px solid #bb25a6',
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 50,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  navBtnSobre: {
    background: '#000000',
    color: '#0accbd',
    border: 'none',
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 50,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
  },

  hero: {
    background: 'linear-gradient(160deg,#f3eef8 0%,#e8d9f0 30%,#d9c4e8 60%,#e0cde9 100%)',
    padding: '60px 24px 80px',
  },
  heroInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  heroLeft: { flex: 1, maxWidth: 580 },
  heroTitle: {
    fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(28px, 6vw, 50px)', fontWeight: 800,
    lineHeight: 1.12, color: '#2f0d51', letterSpacing: -1, marginBottom: 20,
  },
  heroSub: { fontSize: 18, lineHeight: 1.7, color: '#555', marginBottom: 36, maxWidth: 480 },
  heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 },
  btnPrimary: {
    background: '#f53342', color: '#fff', border: 'none',
    padding: '14px 28px', borderRadius: 50,
    fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 700,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    boxShadow: '0 4px 20px rgba(233,30,99,0.3)', transition: 'all .3s',
    whiteSpace: 'nowrap',
  },
  btnSecondary: {
    background: '#fff', color: '#bb25a6',
    border: '2px solid #bb25a6', padding: '13px 30px', borderRadius: 50,
    fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700,
    cursor: 'pointer', transition: 'all .3s',
  },
  badges: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  badge: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555' },

  heroRight: { flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  heroSacola: {
    height: 'clamp(200px, 40vw, 500px)', width: 'auto', objectFit: 'contain',
    filter: 'drop-shadow(0 16px 40px rgba(123,63,160,0.25))',
    maxWidth: '100%',
  },

  numbersBar: {
    display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
    maxWidth: 1200, margin: '-50px auto 20px', padding: '0 40px',
    position: 'relative', zIndex: 10,
  },
  numCard: {
    background: '#fff', borderRadius: 20, padding: '30px 36px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.07)', textAlign: 'center',
    flex: '1 1 220px', minWidth: 200,
  },
  numVal: { fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 600, color: '#2f0d51', marginBottom: 6 },
  numLabel: { fontSize: 14, color: '#888' },

  section: { padding: '40px 20px', maxWidth: 1200, margin: '0 auto' },
  fullSection: { padding: '40px 20px', maxWidth: '100%' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  secTitle: { fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 800, textAlign: 'center', color: '#2f0d51', marginBottom: 16 },
  secSub: { fontSize: 18, textAlign: 'center', color: '#777', marginBottom: 52 },
  secHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 },
  secTitleLeft: { fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 800, color: '#2f0d51', margin: 0 },
  secTagline: { fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 600, color: '#bb25a6', marginTop: 2 },
  secDescLeft: { fontSize: 16, color: '#555', lineHeight: 1.7, maxWidth: 700, marginBottom: 40 },

  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 },

  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    width: '100%',
  },
  bentoCard: {
    background: '#fff', borderRadius: 20, padding: '28px 22px',
    boxShadow: '0 2px 12px rgba(47,13,81,0.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', position: 'relative', minHeight: 320,
    justifyContent: 'center',
  },
  bentoStep: {
    position: 'absolute', top: 12, left: 12,
    background: '#bb25a6', color: '#fff', width: 28, height: 28,
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  bentoTitle: {
    fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700,
    color: '#2f0d51', margin: '10px 0 6px',
  },
  bentoDesc: { fontSize: 13, color: '#777', lineHeight: 1.55 },

  stepCard: {
    textAlign: 'center', padding: 32, borderRadius: 20,
    background: '#fff', boxShadow: '0 4px 18px rgba(0,0,0,0.05)', position: 'relative',
  },
  stepNum: {
    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
    background: '#bb25a6', color: '#fff', width: 36, height: 36,
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700,
  },
  stepT: { fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, margin: '18px 0 10px', color: '#2f0d51' },
  stepInlineHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 18 },
  stepTInline: { fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700, color: '#2f0d51', margin: 0 },
  stepD: { fontSize: 14, color: '#777', lineHeight: 1.65, marginTop: 10 },

  grid2col: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22 },
  grid3col: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 },
  bCard: { borderRadius: 20, padding: '30px 28px' },
  bIconWrap: { marginBottom: 14 },
  bInlineHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  bTitle: { fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, color: '#2f0d51', marginBottom: 8, lineHeight: 1.3 },
  bTitleInline: { fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700, color: '#2f0d51', margin: 0, lineHeight: 1.3 },
  bDesc: { fontSize: 14, color: '#555', lineHeight: 1.65 },

  arenaCard: {
    marginTop: 40, padding: '32px 36px', borderRadius: 20,
    background: 'linear-gradient(135deg,#2f0d51,#3d1a6e)', border: 'none',
    boxShadow: '0 8px 32px rgba(47,13,81,0.15)',
    color: '#fff',
  },
  arenaBtn: {
    marginTop: 16, background: '#bb25a6', color: '#fff', border: 'none',
    padding: '12px 28px', borderRadius: 50, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Poppins',sans-serif",
    boxShadow: '0 4px 16px rgba(187,37,166,0.3)', transition: 'all .3s',
  },
  saibaMaisBox: { marginTop: 32, textAlign: 'center' },
  saibaMaisBtn: {
    background: 'transparent', color: '#bb25a6', border: '2px solid #bb25a6',
    padding: '10px 28px', borderRadius: 50, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Poppins',sans-serif", transition: 'all .3s',
  },

  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  modalContent: {
    background: '#fff', borderRadius: 24, padding: '40px 36px',
    maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto',
    position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
  },
  modalClose: {
    position: 'absolute', top: 16, right: 16, background: 'none',
    border: 'none', color: '#999', cursor: 'pointer', padding: 8,
  },
  arenaGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
  },
  arenaGridItem: {
    background: '#f9f7fb', borderRadius: 16, padding: '20px 16px',
    textAlign: 'center',
  },
  arenaModalBtn: {
    background: '#bb25a6', color: '#fff', border: 'none',
    padding: '14px 36px', borderRadius: 50, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Poppins',sans-serif",
    boxShadow: '0 4px 16px rgba(187,37,166,0.3)',
  },

  consultCard: { borderRadius: 20, padding: '28px 30px', display: 'flex', alignItems: 'flex-start', gap: 20 },
  whyCard: { borderRadius: 20, padding: 36, textAlign: 'center' },
  whyCardClean: {
    borderRadius: 20, padding: '36px 28px', textAlign: 'center',
    background: '#FAFAFA', border: '1px solid rgba(47,13,81,0.06)',
    boxShadow: '0 2px 12px rgba(47,13,81,0.05)',
  },
  whyIconWrap: {
    width: 64, height: 64, borderRadius: '50%',
    background: 'rgba(187,37,166,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto',
  },

  plansRow: { display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 40, padding: '0 8px' },

  ctaFinal: {
    background: 'linear-gradient(135deg,#2f0d51,#bb25a6)',
    padding: '56px 32px', textAlign: 'center', color: '#fff',
  },
  ctaTitle: { 
    fontFamily: "'Poppins',sans-serif", 
    fontSize: 26,     // Alterado de 30 para 26
    fontWeight: 600, 
    color: '#fff', 
    marginBottom: 12, 
  },
  ctaSub: { 
    fontSize: 15,     // Alterado de 16 para 15
    color: 'rgba(255,255,255,0.85)', 
    marginBottom: 28, // Alterado de 36 para 28
  },
  ctaBtns: { display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' },
  ctaBtnPrimary: {
    background: '#f53342',
    color: '#fff',
    border: 'none',
    padding: '14px 34px',  // Alterado de 12px 28px para 14px 34px
    borderRadius: 50,
    fontFamily: "'Poppins',sans-serif",
    fontSize: 16,      // menor que o hero
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 6px 24px rgba(233,30,99,0.45)',
    transition: 'all .3s',
  },

  footer: { background: '#2f0d51', padding: '40px 20px 24px', color: '#fff' },
  footerInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 40, marginBottom: 36,
  },
  footerCol: { display: 'flex', flexDirection: 'column' },
  footerH: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#bb25a6' },
  footerTxt: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 },
  fLink: { textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 10 },
  footerBot: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center' },
};

export default Landingpage;