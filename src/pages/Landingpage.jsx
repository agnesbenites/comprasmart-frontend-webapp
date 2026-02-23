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

const PlanCard = ({ name, price, period, description, features, color, highlighted, onBuy }) => (
  <div style={{
    background: color, borderRadius: 24, padding: '36px 24px 32px', width: 'min(340px, 100%)',
    textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 650,
    border: highlighted ? '3px solid #bb25a6' : '1px solid rgba(255,255,255,0.08)',
    transform: highlighted ? 'scale(1.04)' : 'scale(1)',
    boxShadow: highlighted ? '0 16px 48px rgba(187,37,166,0.3)' : '0 8px 28px rgba(0,0,0,0.12)',
    transition: 'transform .3s, box-shadow .3s',
  }}>
    {highlighted && (
      <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
        background: '#bb25a6', color: '#fff',
        padding: '8px 22px', borderRadius: 30, fontSize: 12, fontWeight: 700, letterSpacing: 1,
        boxShadow: '0 4px 14px rgba(187,37,166,0.35)',
      }}>MAIS POPULAR</div>
    )}
    <h4 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 14, marginTop: 8, fontFamily: 'Poppins,sans-serif' }}>{name}</h4>
    <h3 style={{ fontSize: 46, fontWeight: 900, color: '#bb25a6', marginBottom: 4, fontFamily: 'Poppins,sans-serif' }}>{price}</h3>
    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>{period}</p>
    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 30, lineHeight: 1.5 }}>{description}</p>
    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', flexGrow: 1 }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 13, fontSize: 14, color: 'rgba(255,255,255,0.88)' }}>
          <FaRegCheckCircle color="#bb25a6" size={14} style={{ marginRight: 8, flexShrink: 0 }} /> {f}
        </li>
      ))}
    </ul>
    <button onClick={onBuy} style={{
      marginTop: 'auto', width: '100%', padding: '16px 0', fontSize: 16, fontWeight: 700,
      fontFamily: 'Poppins,sans-serif', border: 'none', borderRadius: 50, cursor: 'pointer',
      background: highlighted ? '#bb25a6' : 'rgba(255,255,255,0.12)',
      color: '#fff', boxShadow: highlighted ? '0 4px 20px rgba(187,37,166,0.35)' : 'none',
      transition: 'all .3s',
    }}>ASSINAR AGORA</button>
  </div>
);

/* ═════════════════════════════════════════════
   LANDING PAGE
   ═════════════════════════════════════════════ */
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
            <button onClick={() => navigate('/institucional')} style={{...S.navBtnSobre, display: mobileMenuOpen ? 'none' : undefined}} className="hide-on-mobile">
              Sobre a Kaslee
            </button>
          </div>

          {/* Desktop nav */}
          <nav style={S.navLinks} className="desktop-nav">
            <a href="#como-funciona" style={S.navA}>Como Funciona</a>
            <a href="#beneficios" style={S.navA}>Benefícios</a>
            <a href="#planos" style={S.navA}>Planos</a>
            <a href="#beta" style={S.navA}>Beta</a>
            <NavButton onClick={() => navigate('/quiz')}>Descubra Seu Plano</NavButton>
            <NavButton onClick={() => navigate('/login')}>Entrar</NavButton>
            <NavButton onClick={() => navigate('/onboarding')}>Começar Agora</NavButton>
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
                <HeroBtnPink onClick={() => navigate('/onboarding')}>
                  <FaRocket style={{ marginRight: 8 }} /> Começar Agora
                </HeroBtnPink>
                <HeroBtnPurple onClick={scrollToPlanos}>Ver Planos e Preços</HeroBtnPurple>
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

      {/* ══════ COMO FUNCIONA — Grid Bento com imagens ══════ */}
      <section id="como-funciona" style={S.section}>
        <Reveal>
          <h2 style={S.secTitle}>Como Funciona?</h2>
          <p style={S.secSub}>Simples, rápido e sem complicação</p>
        </Reveal>

        <div style={S.bentoGrid}>
          {/* Linha 1: Step 1 + Imagem */}
          <Reveal delay={0.05}>
            <div style={S.bentoCard}>
              <div style={S.bentoStep}>1</div>
              <FaStore size={28} color="#bb25a6" />
              <h3 style={S.bentoTitle}>Você Cadastra Produtos</h3>
              <p style={S.bentoDesc}>Adicione os produtos da sua loja na plataforma com fotos, preços e descrições</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <HoverImageCard src="/img/carrinhoprodutos.png" label="Tudo pelo celular" sublabel="Gerencie sua loja de qualquer lugar" />
          </Reveal>

          {/* Linha 2: Imagem + Step 2 */}
          <Reveal delay={0.15}>
            <HoverImageCard src="/img/atendimentoimagem.png" label="Atendimento exclusivo" sublabel="Consultores especializados nos seus segmentos" />
          </Reveal>
          <Reveal delay={0.2}>
            <div style={S.bentoCard}>
              <div style={S.bentoStep}>2</div>
              <FaUserTie size={28} color="#bb25a6" />
              <h3 style={S.bentoTitle}>Consultores se candidatam</h3>
              <p style={S.bentoDesc}>Profissionais autônomos promovem seus produtos para clientes qualificados</p>
            </div>
          </Reveal>

          {/* Linha 3: Step 3 + Imagem */}
          <Reveal delay={0.25}>
            <div style={S.bentoCard}>
              <div style={S.bentoStep}>3</div>
              <FaShoppingCart size={28} color="#bb25a6" />
              <h3 style={S.bentoTitle}>Cliente Compra</h3>
              <p style={S.bentoDesc}>Venda finalizada com segurança. Cliente pode retirar na loja ou receber em casa</p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <HoverImageCard src="/img/qrcodecliente.png" label="Compra rápida e segura" sublabel="QR Code, Pix, cartão — tudo integrado" />
          </Reveal>

          {/* Linha 4: Imagem + Step 4 */}
          <Reveal delay={0.35}>
            <HoverImageCard src="/img/carrinhosacola.png" label="Venda mais sem marketplace" sublabel="Sem taxas abusivas, com controle total" />
          </Reveal>
          <Reveal delay={0.4}>
            <div style={S.bentoCard}>
              <div style={S.bentoStep}>4</div>
              <FaMoneyBillWave size={28} color="#bb25a6" />
              <h3 style={S.bentoTitle}>Você Recebe</h3>
              <p style={S.bentoDesc}>Pagamento processado automaticamente. Consultor recebe comissão, você recebe o lucro</p>
            </div>
          </Reveal>
        </div>

        {/* ARENA DE VENDAS + SAIBA MAIS */}
        <Reveal delay={0.3}>
          <div style={{
            marginTop: 40, padding: '36px 40px', borderRadius: 20,
            background: '#fff', border: '2px solid #2f0d51',
            boxShadow: '0 4px 20px rgba(47,13,81,0.08)',
          }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 700, color: '#2f0d51', marginBottom: 8 }}>
               Arena de Vendas
            </h3>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.65, marginBottom: 16 }}>
              Sistema de gamificação para treinamento de equipes de vendas. Consultores praticam com personas reais, ganham pontos, desbloqueiam novas habilidades e sobem no ranking.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
              <button onClick={() => setShowArenaModal(true)} style={{
                background: '#2f0d51', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Poppins',sans-serif",
              }}>
                Conhecer a Arena de Vendas →
              </button>
              <button onClick={() => setShowSaibaMais(true)} style={{
                background: 'transparent', color: '#bb25a6', border: '2px solid #bb25a6',
                padding: '8px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Poppins',sans-serif",
              }}>
                Saiba Mais sobre a Kaslee →
              </button>
            </div>
            <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
              Saiba mais sobre todas as funcionalidades da Kaslee, como usamos os dados, algoritmos e a IA para te ajudar.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══════ PARA LOJISTAS — Logo Bag no header ══════ */}
      <section id="beneficios" style={{ ...S.fullSection, background: 'linear-gradient(180deg,#faf6f0 0%,#f7f2eb 100%)' }}>
        <div style={S.inner}>
          <Reveal>
            <div style={S.secHeader}>
              <img src="/img/Logo Bag.png" alt="" style={{ height: 72, width: 'auto' }} onError={e => { e.target.style.display = 'none'; }} />
              <div>
                <h2 style={S.secTitleLeft}>Para Lojistas</h2>
                <p style={S.secTagline}>Multiplique Seu Alcance e Suas Vendas</p>
              </div>
            </div>
            <p style={S.secDescLeft}>
              Se você é lojista, a Kaslee é a expansão de vendas que você precisava, para alcançar o público certo e conectar pessoas especialistas a seus clientes.
            </p>
          </Reveal>

          <div style={S.grid2col}>
            {[
              { icon: <FaBullseye size={24} color="#bb25a6" />, t: 'Público Alvo na Mão', d: 'Alcance clientes que não sabiam que sua loja tinha o produto. Os consultores levam seu estoque exatamente para o público que está buscando.' },
              { icon: <FaWarehouse size={24} color="#bb25a6" />, t: 'Zero Estoque Parado', d: 'Faça a gestão inteligente e venda rapidamente itens que estão ocupando espaço, transformando produto parado em capital de giro.' },
              { icon: <FaSlidersH size={24} color="#bb25a6" />, t: 'Comissão Flexível', d: 'Defina e ajuste a comissão que você paga aos consultores por venda, garantindo que o custo de aquisição do cliente esteja sempre sob seu controle.' },
              { icon: <FaTachometerAlt size={24} color="#bb25a6" />, t: 'Gestão Centralizada', d: 'Acompanhe todas as suas vendas e o desempenho dos consultores em um único dashboard de gestão, com recebimento automatizado via Stripe.' },
              { icon: <FaGraduationCap size={24} color="#bb25a6" />, t: 'Vendas Especializada', d: 'Autorize consultores que entendem profundamente de seus produtos a vendê-los, garantindo que o cliente receba a orientação técnica correta.' },
              { icon: <FaBullhorn size={24} color="#bb25a6" />, t: 'Campanhas de Sucesso', d: 'Crie promoções e campanhas exclusivas dentro da plataforma, potencializando a saída de produtos específicos.' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ ...S.bCard, background: '#fff', boxShadow: '0 2px 12px rgba(47,13,81,0.06)', border: '1px solid rgba(47,13,81,0.06)' }}>
                  <div style={S.bInlineHeader}>
                    {c.icon}
                    <h3 style={S.bTitleInline}>{c.t}</h3>
                  </div>
                  <p style={S.bDesc}>{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PARA CONSULTORES — Logo Bag no header ══════ */}
      <section style={{ ...S.fullSection, background: '#f5f3f7' }}>
        <div style={S.inner}>
          <Reveal>
            <div style={S.secHeader}>
              <img src="/img/Logo Bag.png" alt="" style={{ height: 72, width: 'auto' }} onError={e => { e.target.style.display = 'none'; }} />
              <div>
                <h2 style={S.secTitleLeft}>Para Consultor</h2>
                <p style={S.secTagline}>Liberdade e Renda Extra</p>
              </div>
            </div>
            <p style={S.secDescLeft}>
              Transforme seu conhecimento em lucro. Seja um especialista de vendas e trabalhe de forma flexível.
            </p>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: <FaClock size={30} color="#bb25a6" />, t: 'Flexibilidade Total', d: 'Trabalhe de onde quiser, defina seus horários e a quantidade de tempo que deseja dedicar.' },
              { icon: <FaLayerGroup size={30} color="#bb25a6" />, t: 'Escolha o Seu Segmento', d: 'Selecione as lojas e os segmentos de produtos que você realmente domina e tem paixão em vender.' },
              { icon: <FaHandHoldingUsd size={30} color="#bb25a6" />, t: 'Comissão Direta', d: 'Receba sua comissão de forma transparente e segura, diretamente na sua conta, através do Stripe.' },
              { icon: <FaLaptopCode size={30} color="#bb25a6" />, t: 'Consultor Digital do Varejo Físico', d: 'Junte sua experiência em vendas ao potencial do e-commerce, sem abrir uma loja. Represente marcas, atenda clientes online e receba comissões pelo que vender.' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ ...S.consultCard, background: '#fff', boxShadow: '0 2px 12px rgba(47,13,81,0.06)', border: '1px solid rgba(47,13,81,0.08)' }}>
                  <div style={S.bIconWrap}>{c.icon}</div>
                  <div>
                    <h3 style={S.bTitle}>{c.t}</h3>
                    <p style={S.bDesc}>{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ POR QUE ESCOLHER — Cards limpos, ícones centrados ══════ */}
      <section style={{ ...S.fullSection, background: '#fff' }}>
        <div style={S.inner}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <img src="/img/Logo Bag.png" alt="" style={{ height: 60, width: 'auto' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <h2 style={S.secTitle}>Por Que Escolher a Kaslee?</h2>
          </Reveal>
          <div style={S.grid3col}>
            {[
              { icon: <FaDollarSign size={38} color="#bb25a6" />, t: 'Mensalidade + Comissão', d: 'Modelo de custos transparente: mensalidade fixa pelo plano e comissão por venda realizada. Sem surpresas.' },
              { icon: <FaClock size={38} color="#bb25a6" />, t: 'Venda 24/7', d: 'Consultores trabalham em horários diversos, sua loja vende o tempo todo.' },
              { icon: <FaChartLine size={38} color="#bb25a6" />, t: 'Alcance Local', d: 'Venda para clientes próximos a você. Consultores conectam seus produtos a quem está por perto.' },
              { icon: <FaMobileAlt size={38} color="#bb25a6" />, t: '100% Web', d: 'Plataforma web para lojistas e consultores. App exclusivo para o cliente final.' },
              { icon: <FaBox size={38} color="#bb25a6" />, t: 'Controle Total', d: 'Defina preços, comissões, e gerencie seu estoque em tempo real.' },
              { icon: <FaUsers size={38} color="#bb25a6" />, t: 'Rede de Consultores', d: 'Acesso a profissionais qualificados prontos para vender seus produtos.' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={S.whyCardClean}>
                  <div style={S.whyIconWrap}>{c.icon}</div>
                  <h3 style={{ ...S.bTitle, marginTop: 16 }}>{c.t}</h3>
                  <p style={S.bDesc}>{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PLANOS ══════ */}
      <section id="planos" style={{ padding: '80px 40px', background: '#FAFAFA' }}>
        <Reveal>
          <h2 style={S.secTitle}>Escolha Seu Plano</h2>
          <p style={S.secSub}>Comece agora e evolua conforme sua loja cresce</p>
        </Reveal>
        <div style={S.plansRow}>
          <Reveal delay={0.05}>
            <PlanCard name="Básico" price="R$ 99,90" period="por mês" description="Ideal para começar" color="#1a0a2e"
              features={['Até 100 produtos','Até 5 consultores','Dashboard básico','Chat com clientes','Suporte por email','Comissões configuráveis']}
              onBuy={() => handleStripe(STRIPE_URLS.BASICO)} />
          </Reveal>
          <Reveal delay={0.15}>
            <PlanCard name="Pro" price="R$ 199,90" period="por mês" description="Para lojas em crescimento" color="#2f0d51" highlighted
              features={['Produtos ilimitados','Consultores ilimitados','Dashboard avançado','Chat + videochamada','Campanhas de marketing','Múltiplas filiais','Relatórios detalhados','Suporte prioritário','API de integração']}
              onBuy={() => handleStripe(STRIPE_URLS.PRO)} />
          </Reveal>
          <Reveal delay={0.25}>
            <PlanCard name="Enterprise" price="R$ 499,00" period="por mês" description="Para grandes operações" color="#1a0a2e"
              features={['Tudo do Pro, mais:','Dashboard BI Avançado','Análise de ROI por consultor','Previsão de vendas (IA)','Análise de tendências','Relatórios customizados','Suporte premium 24/7','Gerente de conta dedicado','Treinamento personalizado','SLA garantido']}
              onBuy={() => handleStripe(STRIPE_URLS.ENTERPRISE)} />
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


      {/* ══════ BETA — Faixa CTA Impactante ══════ */}
      <section id="beta" style={{
        background: 'linear-gradient(135deg, #2f0d51 0%, #1a0730 50%, #2f0d51 100%)',
        padding: '72px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Círculos decorativos */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(187,37,166,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(187,37,166,0.08)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{ background: '#bb25a6', color: 'white', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                🚀 Beta Aberto — Vagas Limitadas
              </span>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: '#fff', margin: '20px 0 12px', lineHeight: 1.2 }}>
                Faça parte da<br />primeira turma Kaslee
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                Teste a plataforma gratuitamente, dê feedback direto com a fundadora e ajude a moldar o futuro do varejo conectado.
              </p>
            </div>
          </Reveal>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 24, marginBottom: 48 }}>
            {/* Lojista */}
            <Reveal delay={0.1}>
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '36px 32px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🏪</div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>Sou Lojista</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24 }}>
                  Cadastre sua loja, conecte consultores e venda mais — sem pagar nada durante o beta.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                  {['Acesso completo grátis', 'Sem taxa de setup', 'Suporte prioritário', 'Feedback direto com a fundadora'].map((b, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#0accbd', fontWeight: 700 }}>✓</span> {b}
                    </li>
                  ))}
                </ul>
                <a href="https://forms.office.com/r/cb1fKfHX25" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: '#fff', color: '#2f0d51', borderRadius: 50, padding: '14px 24px',
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', transition: 'all 0.25s',
                }}>
                  Quero ser Beta Tester →
                </a>
              </div>
            </Reveal>

            {/* Consultor */}
            <Reveal delay={0.2}>
              <div style={{ background: 'linear-gradient(135deg, rgba(187,37,166,0.25), rgba(187,37,166,0.08))', border: '1px solid rgba(187,37,166,0.4)', borderRadius: 24, padding: '36px 32px' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>Sou Consultor</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24 }}>
                  Construa sua carteira de clientes, ganhe comissão desde o primeiro atendimento.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                  {['Primeiras comissões garantidas', 'Treinamentos exclusivos', 'Badge de Beta Consultor', 'Comunidade fechada'].map((b, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#bb25a6', fontWeight: 700 }}>✓</span> {b}
                    </li>
                  ))}
                </ul>
                <a href="https://forms.office.com/r/7KuKzZkZvp" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: '#bb25a6', color: '#fff', borderRadius: 50, padding: '14px 24px',
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', boxShadow: '0 4px 20px rgba(187,37,166,0.4)',
                }}>
                  Quero ser Beta Consultor →
                </a>
              </div>
            </Reveal>
          </div>

          {/* Frase de urgência */}
          <Reveal delay={0.3}>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
              ⚡ Vagas limitadas para lojistas e consultores. Garanta a sua agora.
            </p>
          </Reveal>
        </div>
      </section>

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
  navLogoName: { height: 48, width: 'auto', objectFit: 'contain', maxWidth: 140 },
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
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16,
    maxWidth: 680, margin: '0 auto',
  },
  bentoCard: {
    background: '#fff', borderRadius: 20, padding: '28px 22px',
    boxShadow: '0 2px 12px rgba(47,13,81,0.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', position: 'relative', height: 320,
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