// app-frontend/src/pages/Landingpage.jsx
// Landing Page KASLEE — Logos separadas, Logo Bag.png + Logo Clara.png

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaStore, FaUserTie, FaShoppingCart, FaChartLine,
  FaUsers, FaBox, FaBullhorn, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaDollarSign, FaRocket,
  FaMobileAlt, FaRegCheckCircle,
  FaBullseye, FaWarehouse, FaSlidersH, FaTachometerAlt,
  FaGraduationCap, FaLayerGroup,
  FaHandHoldingUsd, FaLaptopCode
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
        background: hovered ? '#7B3FA0' : 'transparent',
        color: hovered ? '#fff' : '#7B3FA0',
        border: '2px solid #7B3FA0',
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
        background: hovered ? '#E91E63' : 'transparent',
        color: hovered ? '#fff' : '#E91E63',
        border: '2px solid #E91E63',
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
        background: hovered ? '#7B3FA0' : 'transparent',
        color: hovered ? '#fff' : '#7B3FA0',
        border: '2px solid #7B3FA0',
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
const PlanCard = ({ name, price, period, description, features, color, highlighted, onBuy }) => (
  <div style={{
    background: color, borderRadius: 24, padding: '44px 34px 38px', width: 340,
    textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 650,
    border: highlighted ? '3px solid #E91E63' : '1px solid rgba(255,255,255,0.08)',
    transform: highlighted ? 'scale(1.04)' : 'scale(1)',
    boxShadow: highlighted ? '0 16px 48px rgba(233,30,99,0.25)' : '0 8px 28px rgba(0,0,0,0.12)',
    transition: 'transform .3s, box-shadow .3s',
  }}>
    {highlighted && (
      <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg,#E91E63,#AD1457)', color: '#fff',
        padding: '8px 22px', borderRadius: 30, fontSize: 12, fontWeight: 700, letterSpacing: 1,
        boxShadow: '0 4px 14px rgba(233,30,99,0.35)',
      }}>MAIS POPULAR</div>
    )}
    <h4 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 14, marginTop: 8, fontFamily: 'Poppins,sans-serif' }}>{name}</h4>
    <h3 style={{ fontSize: 46, fontWeight: 900, color: '#E91E63', marginBottom: 4, fontFamily: 'Poppins,sans-serif' }}>{price}</h3>
    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>{period}</p>
    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 30, lineHeight: 1.5 }}>{description}</p>
    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', flexGrow: 1 }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 13, fontSize: 14, color: 'rgba(255,255,255,0.88)' }}>
          <FaRegCheckCircle color="#E91E63" size={14} style={{ marginRight: 8, flexShrink: 0 }} /> {f}
        </li>
      ))}
    </ul>
    <button onClick={onBuy} style={{
      marginTop: 'auto', width: '100%', padding: '16px 0', fontSize: 16, fontWeight: 700,
      fontFamily: 'Poppins,sans-serif', border: 'none', borderRadius: 50, cursor: 'pointer',
      background: highlighted ? 'linear-gradient(135deg,#E91E63,#AD1457)' : 'rgba(255,255,255,0.12)',
      color: '#fff', boxShadow: highlighted ? '0 4px 20px rgba(233,30,99,0.35)' : 'none',
      transition: 'all .3s',
    }}>ASSINAR AGORA</button>
  </div>
);

/* ═════════════════════════════════════════════
   LANDING PAGE
   ═════════════════════════════════════════════ */
const Landingpage = () => {
  const navigate = useNavigate();
  const scrollToPlanos = () => { document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' }); };

  const STRIPE_URLS = {
    BASICO: 'https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01',
    PRO: 'https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02',
    ENTERPRISE: 'https://buy.stripe.com/6oU28r5LiemMaBM8SJgQE0a',
  };
  const handleStripe = (url) => { window.location.href = url; };

  return (
    <div style={S.page}>

      {/* ══════ NAVBAR — só Logo Clara (nome) ══════ */}
      <header style={S.navbar}>
        <div style={S.navInner}>
          {/* Logo + Sobre a Kaslee juntos à esquerda */}
          <div style={S.logoArea}>
            <a href="#" style={S.logoLink}>
              <img
                src="/img/Logo Clara.png"
                alt="Kaslee"
                style={S.navLogoName}
                onError={e => {
                  e.target.onerror = null; e.target.style.display = 'none';
                  e.target.parentElement.insertAdjacentHTML('beforeend',
                    '<span style="font-size:30px;font-weight:800;color:#4A1D6A;font-family:Poppins,sans-serif;letter-spacing:-0.5px">Kaslee</span>'
                  );
                }}
              />
            </a>
            <button onClick={() => navigate('/institucional')} style={S.navBtnSobre}>
              Sobre a Kaslee
            </button>
          </div>

          <nav style={S.navLinks}>
            <a href="#como-funciona" style={S.navA}>Como Funciona</a>
            <a href="#beneficios" style={S.navA}>Benefícios</a>
            <a href="#planos" style={S.navA}>Planos</a>
            <NavButton onClick={() => navigate('/quiz')}>🎯 Descubra Seu Plano</NavButton>
            <NavButton onClick={() => navigate('/login')}>Entrar</NavButton>
            <NavButton onClick={() => navigate('/onboarding')}>Começar Agora</NavButton>
          </nav>
        </div>
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
                  <div key={i} style={S.badge}><FaCheckCircle color="#27AE60" size={18} /><span>{t}</span></div>
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

      {/* ══════ COMO FUNCIONA — Logo Bag antes do título ══════ */}
      <section id="como-funciona" style={S.section}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <img
              src="/img/Logo Bag.png"
              alt=""
              style={{ height: 52, width: 'auto', marginBottom: 12 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
          <h2 style={S.secTitle}>Como Funciona</h2>
          <p style={S.secSub}>Simples, rápido e sem complicação</p>
        </Reveal>
        <div style={S.stepsGrid}>
          {[
            { icon: <FaStore size={36} color="#E91E63" />, n: '1', t: 'Você Cadastra Produtos', d: 'Adicione os produtos da sua loja na plataforma com fotos, preços e descrições' },
            { icon: <FaUserTie size={36} color="#E91E63" />, n: '2', t: 'Consultores se candidatam', d: 'Profissionais autônomos promovem seus produtos para clientes qualificados' },
            { icon: <FaShoppingCart size={36} color="#E91E63" />, n: '3', t: 'Cliente Compra', d: 'Venda finalizada com segurança. Cliente pode retirar na loja ou receber em casa' },
            { icon: <FaMoneyBillWave size={36} color="#E91E63" />, n: '4', t: 'Você Recebe', d: 'Pagamento processado automaticamente. Consultor recebe comissão, você recebe o lucro' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div style={S.stepCard}>
                <div style={S.stepNum}>{s.n}</div>
                {s.icon}
                <h3 style={S.stepT}>{s.t}</h3>
                <p style={S.stepD}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════ PARA LOJISTAS — Logo Bag no header ══════ */}
      <section id="beneficios" style={{ ...S.fullSection, background: 'linear-gradient(180deg,#FFF9C4 0%,#FFF8E1 100%)' }}>
        <div style={S.inner}>
          <Reveal>
            <div style={S.secHeader}>
              <img src="/img/Logo Bag.png" alt="" style={{ height: 48, width: 'auto' }} onError={e => { e.target.style.display = 'none'; }} />
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
              { icon: <FaBullseye size={30} color="#E91E63" />, t: 'Público Alvo na Mão', d: 'Alcance clientes que não sabiam que sua loja tinha o produto. Os consultores levam seu estoque exatamente para o público que está buscando.', bg: '#FCE4EC' },
              { icon: <FaWarehouse size={30} color="#7B3FA0" />, t: 'Zero Estoque Parado', d: 'Faça a gestão inteligente e venda rapidamente itens que estão ocupando espaço, transformando produto parado em capital de giro.', bg: '#EDE7F6' },
              { icon: <FaSlidersH size={30} color="#E91E63" />, t: 'Comissão Flexível', d: 'Defina e ajuste a comissão que você paga aos consultores por venda, garantindo que o custo de aquisição do cliente esteja sempre sob seu controle.', bg: '#FCE4EC' },
              { icon: <FaTachometerAlt size={30} color="#7B3FA0" />, t: 'Gestão Centralizada', d: 'Acompanhe todas as suas vendas e o desempenho dos consultores em um único dashboard de gestão, com recebimento automatizado via Stripe.', bg: '#EDE7F6' },
              { icon: <FaGraduationCap size={30} color="#E91E63" />, t: 'Vendas Especializada', d: 'Autorize consultores que entendem profundamente de seus produtos a vendê-los, garantindo que o cliente receba a orientação técnica correta.', bg: '#FCE4EC' },
              { icon: <FaBullhorn size={30} color="#7B3FA0" />, t: 'Campanhas de Sucesso', d: 'Crie promoções e campanhas exclusivas dentro da plataforma, potencializando a saída de produtos específicos.', bg: '#EDE7F6' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ ...S.bCard, background: c.bg }}>
                  <div style={S.bIconWrap}>{c.icon}</div>
                  <h3 style={S.bTitle}>{c.t}</h3>
                  <p style={S.bDesc}>{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PARA CONSULTORES — Logo Clara no header ══════ */}
      <section style={{ ...S.fullSection, background: 'linear-gradient(180deg,#E3F2FD 0%,#E8EAF6 100%)' }}>
        <div style={S.inner}>
          <Reveal>
            <div style={S.secHeader}>
              <img src="/img/Logo Clara.png" alt="" style={{ height: 60, width: 'auto' }} onError={e => { e.target.style.display = 'none'; }} />
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
              { icon: <FaClock size={30} color="#E91E63" />, t: 'Flexibilidade Total', d: 'Trabalhe de onde quiser, defina seus horários e a quantidade de tempo que deseja dedicar.', bg: '#FCE4EC' },
              { icon: <FaLayerGroup size={30} color="#7B3FA0" />, t: 'Escolha o Seu Segmento', d: 'Selecione as lojas e os segmentos de produtos que você realmente domina e tem paixão em vender.', bg: '#EDE7F6' },
              { icon: <FaHandHoldingUsd size={30} color="#E91E63" />, t: 'Comissão Direta', d: 'Receba sua comissão de forma transparente e segura, diretamente na sua conta, através do Stripe.', bg: '#F1F8E9' },
              { icon: <FaLaptopCode size={30} color="#7B3FA0" />, t: 'Consultor Digital do Varejo Físico', d: 'Junte sua experiência em vendas ao potencial do e-commerce, sem abrir uma loja. Represente marcas, atenda clientes online e receba comissões pelo que vender.', bg: '#FFF9C4' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ ...S.consultCard, background: c.bg }}>
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

      {/* ══════ POR QUE ESCOLHER — Logo Bag antes do título ══════ */}
      <section style={{ ...S.fullSection, background: '#FAFAFA' }}>
        <div style={S.inner}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <img src="/img/Logo Bag.png" alt="" style={{ height: 60, width: 'auto' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <h2 style={S.secTitle}>Por Que Escolher a Kaslee?</h2>
          </Reveal>
          <div style={S.grid3col}>
            {[
              { icon: <FaDollarSign size={42} color="#27AE60" />, t: 'Sem Custos Fixos', d: 'Pague apenas comissões sobre vendas realizadas. Zero folha de pagamento.', bg: '#E8F5E9' },
              { icon: <FaClock size={42} color="#7B3FA0" />, t: 'Venda 24/7', d: 'Consultores trabalham em horários diversos, sua loja vende o tempo todo.', bg: '#EDE7F6' },
              { icon: <FaChartLine size={42} color="#E91E63" />, t: 'Alcance Expandido', d: 'Chegue a novos clientes que seus consultores já conhecem e confiam.', bg: '#FCE4EC' },
              { icon: <FaMobileAlt size={42} color="#FF6F00" />, t: '100% Digital', d: 'Plataforma web e mobile. Gerencie tudo pelo celular ou computador.', bg: '#FFF3E0' },
              { icon: <FaBox size={42} color="#7B3FA0" />, t: 'Controle Total', d: 'Defina preços, comissões, e gerencie seu estoque em tempo real.', bg: '#EDE7F6' },
              { icon: <FaUsers size={42} color="#E91E63" />, t: 'Rede de Consultores', d: 'Acesso a profissionais qualificados prontos para vender seus produtos.', bg: '#FCE4EC' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ ...S.whyCard, background: c.bg }}>
                  {c.icon}
                  <h3 style={{ ...S.bTitle, marginTop: 16 }}>{c.t}</h3>
                  <p style={S.bDesc}>{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PLANOS ══════ */}
      <section id="planos" style={{ padding: '80px 40px', background: '#fff' }}>
        <Reveal>
          <h2 style={S.secTitle}>Escolha Seu Plano</h2>
          <p style={S.secSub}>Comece agora e evolua conforme sua loja cresce</p>
        </Reveal>
        <div style={S.plansRow}>
          <Reveal delay={0.05}>
            <PlanCard name="Básico" price="R$ 99,90" period="por mês" description="Ideal para começar" color="#2E2040"
              features={['Até 100 produtos','Até 5 consultores','Dashboard básico','Chat com clientes','Suporte por email','Comissões configuráveis']}
              onBuy={() => handleStripe(STRIPE_URLS.BASICO)} />
          </Reveal>
          <Reveal delay={0.15}>
            <PlanCard name="Pro" price="R$ 199,90" period="por mês" description="Para lojas em crescimento" color="#1A1230" highlighted
              features={['Produtos ilimitados','Consultores ilimitados','Dashboard avançado','Chat + videochamada','Campanhas de marketing','Múltiplas filiais','Relatórios detalhados','Suporte prioritário','API de integração']}
              onBuy={() => handleStripe(STRIPE_URLS.PRO)} />
          </Reveal>
          <Reveal delay={0.25}>
            <PlanCard name="Enterprise" price="R$ 499,00" period="por mês" description="Para grandes operações" color="#271A3A"
              features={['Tudo do Pro, mais:','Dashboard BI Avançado','Análise de ROI por consultor','Previsão de vendas (IA)','Análise de tendências','Relatórios customizados','Suporte premium 24/7','Gerente de conta dedicado','Treinamento personalizado','SLA garantido']}
              onBuy={() => handleStripe(STRIPE_URLS.ENTERPRISE)} />
          </Reveal>
        </div>
        <Reveal delay={0.3}>
          <p style={{ textAlign: 'center', color: '#757575', fontSize: 15, marginTop: 36 }}>
            🎁 <strong>Teste por 30 dias</strong> em todos os planos &nbsp;
          </p>
        </Reveal>
      </section>

      {/* ══════ CTA FINAL — só Logo Clara (nome) em branco ══════ */}
      <section style={S.ctaFinal}>
        <Reveal>
          <img src="/img/Logo Clara.png" alt="Kaslee" style={{ height: 56, marginBottom: 24, filter: 'brightness(10)' }} onError={e => { e.target.style.display = 'none'; }} />
          <h2 style={S.ctaTitle}>Pronto para Aumentar Suas Vendas?</h2>
          <p style={S.ctaSub}>Comece agora hoje e veja sua loja crescer</p>
          <div style={S.ctaBtns}>
            <button onClick={() => navigate('/onboarding')} style={S.ctaBtnPrimary}>
              <FaRocket style={{ marginRight: 8 }} /> Começar Agora
            </button>
          </div>
        </Reveal>
      </section>

      {/* ══════ FOOTER — só Logo Bag ══════ */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.footerCol}>
            <img src="/img/Logo Bag.png" alt="Kaslee" style={{ height: 40, width: 'auto', marginBottom: 16, filter: 'brightness(10)' }} onError={e => { e.target.style.display = 'none'; }} />
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
    padding: '14px 48px',
  },
  navInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logoLink: { display: 'flex', alignItems: 'center', textDecoration: 'none' },
  logoArea: { display: 'flex', alignItems: 'center', gap: 16 },
  navLogoName: { height: 100, width: 'auto', objectFit: 'contain' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  navA: { textDecoration: 'none', color: '#555', fontSize: 14, fontWeight: 500 },
  navBtn: {
    background: 'transparent',
    color: '#7B3FA0',
    border: '2px solid #7B3FA0',
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 50,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  navBtnSobre: {
    background: '#000000',
    color: '#2ED47A',
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
    background: 'linear-gradient(160deg,#FAFAFA 0%,#F3E5F5 40%,#FCE4EC 100%)',
    padding: '80px 48px 100px',
  },
  heroInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 },
  heroLeft: { flex: 1, maxWidth: 580 },
  heroTitle: {
    fontFamily: "'Poppins',sans-serif", fontSize: 50, fontWeight: 800,
    lineHeight: 1.12, color: '#4A1D6A', letterSpacing: -1.5, marginBottom: 20,
  },
  heroSub: { fontSize: 18, lineHeight: 1.7, color: '#555', marginBottom: 36, maxWidth: 480 },
  heroBtns: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 },
  btnPrimary: {
    background: '#E91E63', color: '#fff', border: 'none',
    padding: '15px 32px', borderRadius: 50,
    fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 700,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    boxShadow: '0 4px 20px rgba(233,30,99,0.3)', transition: 'all .3s',
  },
  btnSecondary: {
    background: '#fff', color: '#7B3FA0',
    border: '2px solid #A855F7', padding: '13px 30px', borderRadius: 50,
    fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700,
    cursor: 'pointer', transition: 'all .3s',
  },
  badges: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  badge: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555' },

  heroRight: { flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  heroSacola: {
    height: 600, width: 'auto', objectFit: 'contain',
    filter: 'drop-shadow(0 16px 40px rgba(123,63,160,0.25))',
  },

  numbersBar: {
    display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
    maxWidth: 1200, margin: '-50px auto 60px', padding: '0 40px',
    position: 'relative', zIndex: 10,
  },
  numCard: {
    background: '#fff', borderRadius: 20, padding: '30px 36px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.07)', textAlign: 'center',
    flex: '1 1 220px', minWidth: 200,
  },
  numVal: { fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 600, color: '#E91E63', marginBottom: 6 },
  numLabel: { fontSize: 14, color: '#888' },

  section: { padding: '80px 40px', maxWidth: 1200, margin: '0 auto' },
  fullSection: { padding: '80px 40px', maxWidth: '100%' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  secTitle: { fontFamily: "'Poppins',sans-serif", fontSize: 40, fontWeight: 800, textAlign: 'center', color: '#4A1D6A', marginBottom: 16 },
  secSub: { fontSize: 18, textAlign: 'center', color: '#777', marginBottom: 52 },
  secHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 },
  secTitleLeft: { fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 800, color: '#4A1D6A', margin: 0 },
  secTagline: { fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 600, color: '#7B3FA0', marginTop: 2 },
  secDescLeft: { fontSize: 16, color: '#555', lineHeight: 1.7, maxWidth: 700, marginBottom: 40 },

  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 },
  stepCard: {
    textAlign: 'center', padding: 32, borderRadius: 20,
    background: '#fff', boxShadow: '0 4px 18px rgba(0,0,0,0.05)', position: 'relative',
  },
  stepNum: {
    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
    background: '#E91E63', color: '#fff', width: 36, height: 36,
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700,
  },
  stepT: { fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, margin: '18px 0 10px', color: '#4A1D6A' },
  stepD: { fontSize: 14, color: '#777', lineHeight: 1.65 },

  grid2col: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22 },
  grid3col: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 },
  bCard: { borderRadius: 20, padding: '30px 28px' },
  bIconWrap: { marginBottom: 14 },
  bTitle: { fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, color: '#4A1D6A', marginBottom: 8, lineHeight: 1.3 },
  bDesc: { fontSize: 14, color: '#555', lineHeight: 1.65 },
  consultCard: { borderRadius: 20, padding: '28px 30px', display: 'flex', alignItems: 'flex-start', gap: 20 },
  whyCard: { borderRadius: 20, padding: 36, textAlign: 'center' },

  plansRow: { display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', marginTop: 40 },

  ctaFinal: {
    background: 'linear-gradient(135deg,#4A1D6A,#7B3FA0)',
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
    background: '#E91E63',
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

  footer: { background: '#2E1A47', padding: '52px 48px 24px', color: '#fff' },
  footerInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 40, marginBottom: 36,
  },
  footerCol: { display: 'flex', flexDirection: 'column' },
  footerH: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#E91E63' },
  footerTxt: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 },
  fLink: { textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 10 },
  footerBot: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center' },
};

export default Landingpage;