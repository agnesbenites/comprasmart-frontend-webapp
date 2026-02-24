// app-frontend/src/pages/Landingpage.jsx
// Landing Page Compra Smart - Design Kaslee com conteúdo completo

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStore, FaUserTie, FaShoppingCart, FaChartLine, 
  FaUsers, FaBox, FaBullhorn, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaDollarSign, FaRocket,
  FaMobileAlt, FaDesktop, FaRegCheckCircle,
  FaBullseye, FaWarehouse, FaSlidersH, FaTachometerAlt,
  FaGraduationCap, FaCogs, FaCalendarAlt, FaLayerGroup,
  FaHandHoldingUsd, FaLaptopCode
} from 'react-icons/fa';

/* ───────────────────── SCROLL ANIMATION HOOK ───────────────────── */
const useScrollReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const RevealSection = ({ children, delay = 0, style = {} }) => {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ───────────────────── PLAN CARD ───────────────────── */
const PlanCard = ({ name, price, period, description, features, color, highlighted, onBuy }) => (
  <div style={{
    background: color,
    borderRadius: 24,
    padding: '44px 34px 38px',
    width: 340,
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 650,
    border: highlighted ? '3px solid #E91E63' : '1px solid rgba(255,255,255,0.08)',
    transform: highlighted ? 'scale(1.04)' : 'scale(1)',
    boxShadow: highlighted
      ? '0 16px 48px rgba(233,30,99,0.25)'
      : '0 8px 28px rgba(0,0,0,0.12)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  }}>
    {highlighted && (
      <div style={{
        position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #E91E63, #AD1457)',
        color: '#fff', padding: '8px 22px', borderRadius: 30,
        fontSize: 12, fontWeight: 700, letterSpacing: 1,
        boxShadow: '0 4px 14px rgba(233,30,99,0.35)',
      }}>
        MAIS POPULAR
      </div>
    )}
    <h4 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 14, marginTop: 8, fontFamily: 'Poppins, sans-serif' }}>{name}</h4>
    <h3 style={{ fontSize: 46, fontWeight: 900, color: '#E91E63', marginBottom: 4, fontFamily: 'Poppins, sans-serif' }}>{price}</h3>
    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>{period}</p>
    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 30, lineHeight: 1.5 }}>{description}</p>
    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', flexGrow: 1 }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 13, fontSize: 14, color: 'rgba(255,255,255,0.88)' }}>
          <FaRegCheckCircle color="#E91E63" size={14} style={{ marginRight: 8, flexShrink: 0 }} /> {f}
        </li>
      ))}
    </ul>
    <button
      onClick={onBuy}
      style={{
        marginTop: 'auto',
        width: '100%',
        padding: '16px 0',
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'Poppins, sans-serif',
        border: 'none',
        borderRadius: 50,
        cursor: 'pointer',
        transition: 'all 0.3s',
        background: highlighted ? 'linear-gradient(135deg, #E91E63, #AD1457)' : 'rgba(255,255,255,0.12)',
        color: highlighted ? '#fff' : '#fff',
        boxShadow: highlighted ? '0 4px 20px rgba(233,30,99,0.35)' : 'none',
      }}
    >
      ASSINAR AGORA
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   LANDING PAGE PRINCIPAL
   ═══════════════════════════════════════════════════════════════════ */
const Landingpage = () => {
  const navigate = useNavigate();

  const scrollToPlanos = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const STRIPE_URLS = {
    BASICO: 'https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01',
    PRO: 'https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02',
    ENTERPRISE: 'https://buy.stripe.com/6oU28r5LiemMaBM8SJgQE0a',
  };

  const handleStripeCheckout = (url) => { window.location.href = url; };

  return (
    <div style={S.page}>

      {/* ══════════ NAVBAR ══════════ */}
      <header style={S.navbar}>
        <div style={S.navInner}>
          <a href="#" style={S.logoLink}>
            {/* Logo Sacola pequena + Logo Clara (nome) */}
            <img src="/img/Logo Sacola.png" alt="Compra Smart" style={{ height: 38, width: 'auto' }} onError={e => { e.target.style.display = 'none'; }} />
            <img src="/img/Logo Clara.png" alt="Compra Smart" style={{ height: 34, width: 'auto' }} onError={e => { e.target.onerror = null; e.target.parentElement.insertAdjacentHTML('beforeend', '<span style="font-size:22px;font-weight:800;color:#4A1D6A;font-family:Poppins,sans-serif">Compra Smart</span>'); e.target.style.display = 'none'; }} />
          </a>
          <nav style={S.navLinks}>
            <a href="#como-funciona" style={S.navA}>Como Funciona</a>
            <a href="#beneficios" style={S.navA}>Benefícios</a>
            <a href="#planos" style={S.navA}>Planos</a>
            <button onClick={() => navigate('/quiz')} style={S.navQuiz}>🎯 Descubra Seu Plano</button>
            <button onClick={() => navigate('/login')} style={S.navLogin}>Entrar</button>
            <button onClick={() => navigate('/cadastro')} style={S.navCTA}>Começar Agora</button>
          </nav>
        </div>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroText}>
            <RevealSection>
              <h1 style={S.heroTitle}>Venda Mais com Consultores Autônomos Online</h1>
            </RevealSection>
            <RevealSection delay={0.15}>
              <p style={S.heroSub}>
                A plataforma que conecta sua loja a consultores especializados, aumentando vendas sem aumentar custos fixos
              </p>
            </RevealSection>
            <RevealSection delay={0.3}>
              <div style={S.heroBtns}>
                <button onClick={() => navigate('/cadastro')} style={S.btnPrimary}>
                  <FaRocket style={{ marginRight: 8 }} /> Começar Agora
                </button>
                <button onClick={scrollToPlanos} style={S.btnSecondary}>Ver Planos e Preços</button>
              </div>
            </RevealSection>
            <RevealSection delay={0.4}>
              <div style={S.badges}>
                {['Sem taxa de setup', 'Cancele quando quiser', 'Suporte dedicado'].map((t, i) => (
                  <div key={i} style={S.badge}><FaCheckCircle color="#27AE60" size={18} /><span>{t}</span></div>
                ))}
              </div>
            </RevealSection>
          </div>

          {/* Logo grande no hero */}
          <div style={S.heroVisual}>
            <RevealSection delay={0.35}>
              <div style={S.heroBrandBox}>
                <img src="/img/Logo Sacola.png" alt="" style={{ height: 80, width: 'auto', filter: 'drop-shadow(0 8px 24px rgba(123,63,160,0.25))' }} onError={e => { e.target.style.display = 'none'; }} />
                <img src="/img/Logo Clara.png" alt="Compra Smart" style={{ height: 60, width: 'auto' }} onError={e => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span style="font-size:52px;font-weight:800;color:#4A1D6A;font-family:Poppins,sans-serif">Compra Smart</span>'; }} />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ══════════ NÚMEROS ══════════ */}
      <section style={S.numbersBar}>
        {[
          { val: '+30%', label: 'Aumento médio em vendas' },
          { val: 'Zero', label: 'Custos com folha de pagamento' },
          { val: '24/7', label: 'Vendedores ativos online' },
          { val: '10min', label: 'Para começar a vender' },
        ].map((n, i) => (
          <RevealSection key={i} delay={i * 0.1} style={S.numCard}>
            <h2 style={S.numVal}>{n.val}</h2>
            <p style={S.numLabel}>{n.label}</p>
          </RevealSection>
        ))}
      </section>

      {/* ══════════ COMO FUNCIONA ══════════ */}
      <section id="como-funciona" style={S.section}>
        <RevealSection>
          <h2 style={S.secTitle}>Como Funciona</h2>
          <p style={S.secSub}>Simples, rápido e sem complicação</p>
        </RevealSection>

        <div style={S.stepsGrid}>
          {[
            { icon: <FaStore size={36} color="#E91E63" />, n: '1', t: 'Você Cadastra Produtos', d: 'Adicione os produtos da sua loja na plataforma com fotos, preços e descrições' },
            { icon: <FaUserTie size={36} color="#E91E63" />, n: '2', t: 'Consultores Divulgam', d: 'Profissionais autônomos promovem seus produtos para clientes qualificados' },
            { icon: <FaShoppingCart size={36} color="#E91E63" />, n: '3', t: 'Cliente Compra', d: 'Venda finalizada com segurança. Cliente pode retirar na loja ou receber em casa' },
            { icon: <FaMoneyBillWave size={36} color="#E91E63" />, n: '4', t: 'Você Recebe', d: 'Pagamento processado automaticamente. Consultor recebe comissão, você recebe o lucro' },
          ].map((s, i) => (
            <RevealSection key={i} delay={i * 0.12}>
              <div style={S.stepCard}>
                <div style={S.stepNum}>{s.n}</div>
                {s.icon}
                <h3 style={S.stepTitle}>{s.t}</h3>
                <p style={S.stepDesc}>{s.d}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ══════════ BENEFÍCIOS LOJISTAS ══════════ */}
      <section id="beneficios" style={{ ...S.section, background: 'linear-gradient(180deg, #FFF9C4 0%, #FFF8E1 100%)', maxWidth: '100%', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <img src="/img/Logo Sacola.png" alt="" style={{ height: 36 }} onError={e => { e.target.style.display = 'none'; }} />
              <h2 style={{ ...S.secTitle, textAlign: 'left', marginBottom: 0 }}>Para Lojistas</h2>
            </div>
            <p style={{ ...S.secSub, textAlign: 'left', fontSize: 16, maxWidth: 700 }}>
              Se você é lojista, a Compra Smart é a expansão de vendas que você precisava, para alcançar o público certo e conectar pessoas especialistas a seus clientes.
            </p>
          </RevealSection>

          <div style={S.benefitGrid2col}>
            {[
              { icon: <FaBullseye size={32} color="#E91E63" />, t: 'Público Alvo na Mão', d: 'Alcance clientes que não sabiam que sua loja tinha o produto. Os consultores levam seu estoque exatamente para o público que está buscando.', bg: '#FCE4EC' },
              { icon: <FaWarehouse size={32} color="#7B3FA0" />, t: 'Zero Estoque Parado', d: 'Faça a gestão inteligente e venda rapidamente itens que estão ocupando espaço, transformando produto parado em capital de giro.', bg: '#EDE7F6' },
              { icon: <FaSlidersH size={32} color="#E91E63" />, t: 'Comissão Flexível', d: 'Defina e ajuste a comissão que você paga aos consultores por venda, garantindo que o custo de aquisição do cliente esteja sempre sob seu controle.', bg: '#FCE4EC' },
              { icon: <FaTachometerAlt size={32} color="#7B3FA0" />, t: 'Gestão Centralizada', d: 'Acompanhe todas as suas vendas e o desempenho dos consultores em um único dashboard de gestão, com recebimento automatizado via Stripe.', bg: '#EDE7F6' },
              { icon: <FaGraduationCap size={32} color="#E91E63" />, t: 'Vendas Especializada', d: 'Autorize consultores que entendem profundamente de seus produtos a vendê-los, garantindo que o cliente receba a orientação técnica correta.', bg: '#FCE4EC' },
              { icon: <FaBullhorn size={32} color="#7B3FA0" />, t: 'Campanhas de Sucesso', d: 'Crie promoções e campanhas exclusivas dentro da plataforma, potencializando a saída de produtos específicos.', bg: '#EDE7F6' },
            ].map((c, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <div style={{ ...S.bCard, background: c.bg }}>
                  <div style={S.bIcon}>{c.icon}</div>
                  <h3 style={S.bTitle}>{c.t}</h3>
                  <p style={S.bDesc}>{c.d}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BENEFÍCIOS CONSULTORES ══════════ */}
      <section style={{ ...S.section, background: 'linear-gradient(180deg, #E3F2FD 0%, #E8EAF6 100%)', maxWidth: '100%', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <RevealSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <img src="/img/Logo Sacola.png" alt="" style={{ height: 36 }} onError={e => { e.target.style.display = 'none'; }} />
              <h2 style={{ ...S.secTitle, textAlign: 'left', marginBottom: 0 }}>Para Consultor</h2>
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#4A1D6A', fontFamily: 'Poppins, sans-serif', marginBottom: 4 }}>
              Liberdade e Renda Extra
            </p>
            <p style={{ ...S.secSub, textAlign: 'left', fontSize: 16, maxWidth: 700 }}>
              Transforme seu conhecimento em lucro. Seja um especialista de vendas e trabalhe de forma flexível.
            </p>
          </RevealSection>

          <div style={S.consultorGrid}>
            {[
              { icon: <FaClock size={32} color="#E91E63" />, t: 'Flexibilidade Total', d: 'Trabalhe de onde quiser, defina seus horários e a quantidade de tempo que deseja dedicar.', bg: '#FCE4EC' },
              { icon: <FaLayerGroup size={32} color="#7B3FA0" />, t: 'Escolha o Seu Segmento', d: 'Selecione as lojas e os segmentos de produtos que você realmente domina e tem paixão em vender.', bg: '#EDE7F6' },
              { icon: <FaHandHoldingUsd size={32} color="#E91E63" />, t: 'Comissão Direta', d: 'Receba sua comissão de forma transparente e segura, diretamente na sua conta, através do Stripe.', bg: '#F1F8E9' },
              { icon: <FaLaptopCode size={32} color="#7B3FA0" />, t: 'Consultor Digital do Varejo Físico', d: 'Una experiência em vendas ao potencial do e-commerce, sem abrir uma loja. Represente marcas, atenda clientes online e receba comissões pelo que vender.', bg: '#FFF9C4' },
            ].map((c, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div style={{ ...S.consultorCard, background: c.bg }}>
                  <div style={S.bIcon}>{c.icon}</div>
                  <div>
                    <h3 style={S.bTitle}>{c.t}</h3>
                    <p style={S.bDesc}>{c.d}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ POR QUE ESCOLHER ══════════ */}
      <section style={{ ...S.section, background: '#FAFAFA', maxWidth: '100%', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <RevealSection>
            <h2 style={S.secTitle}>Por Que Escolher a Compra Smart?</h2>
          </RevealSection>

          <div style={S.whyGrid}>
            {[
              { icon: <FaDollarSign size={44} color="#27AE60" />, t: 'Sem Custos Fixos', d: 'Pague apenas comissões sobre vendas realizadas. Zero folha de pagamento.', bg: '#E8F5E9' },
              { icon: <FaClock size={44} color="#7B3FA0" />, t: 'Venda 24/7', d: 'Consultores trabalham em horários diversos, sua loja vende o tempo todo.', bg: '#EDE7F6' },
              { icon: <FaChartLine size={44} color="#E91E63" />, t: 'Alcance Expandido', d: 'Chegue a novos clientes que seus consultores já conhecem e confiam.', bg: '#FCE4EC' },
              { icon: <FaMobileAlt size={44} color="#FF6F00" />, t: '100% Digital', d: 'Plataforma web e mobile. Gerencie tudo pelo celular ou computador.', bg: '#FFF3E0' },
              { icon: <FaBox size={44} color="#7B3FA0" />, t: 'Controle Total', d: 'Defina preços, comissões, e gerencie seu estoque em tempo real.', bg: '#EDE7F6' },
              { icon: <FaUsers size={44} color="#E91E63" />, t: 'Rede de Consultores', d: 'Acesso a profissionais qualificados prontos para vender seus produtos.', bg: '#FCE4EC' },
            ].map((c, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <div style={{ ...S.whyCard, background: c.bg }}>
                  {c.icon}
                  <h3 style={{ ...S.bTitle, marginTop: 16 }}>{c.t}</h3>
                  <p style={S.bDesc}>{c.d}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PLANOS ══════════ */}
      <section id="planos" style={{ padding: '80px 40px', background: '#fff' }}>
        <RevealSection>
          <h2 style={S.secTitle}>Escolha Seu Plano</h2>
          <p style={S.secSub}>Comece agora e evolua conforme sua loja cresce</p>
        </RevealSection>

        <div style={S.plansRow}>
          <RevealSection delay={0.05}>
            <PlanCard
              name="Básico" price="R$ 99,90" period="por mês"
              description="Ideal para começar" color="#2E2040"
              features={['Até 100 produtos', 'Até 5 consultores', 'Dashboard básico', 'Chat com clientes', 'Suporte por email', 'Comissões configuráveis']}
              onBuy={() => handleStripeCheckout(STRIPE_URLS.BASICO)}
            />
          </RevealSection>
          <RevealSection delay={0.15}>
            <PlanCard
              name="Pro" price="R$ 199,90" period="por mês"
              description="Para lojas em crescimento" color="#1A1230" highlighted
              features={['Produtos ilimitados', 'Consultores ilimitados', 'Dashboard avançado', 'Chat + videochamada', 'Campanhas de marketing', 'Múltiplas filiais', 'Relatórios detalhados', 'Suporte prioritário', 'API de integração']}
              onBuy={() => handleStripeCheckout(STRIPE_URLS.PRO)}
            />
          </RevealSection>
          <RevealSection delay={0.25}>
            <PlanCard
              name="Enterprise" price="R$ 499,00" period="por mês"
              description="Para grandes operações" color="#271A3A"
              features={['Tudo do Pro, mais:', 'Dashboard BI Avançado', 'Análise de ROI por consultor', 'Previsão de vendas (IA)', 'Análise de tendências', 'Relatórios customizados', 'Suporte premium 24/7', 'Gerente de conta dedicado', 'Treinamento personalizado', 'SLA garantido']}
              onBuy={() => handleStripeCheckout(STRIPE_URLS.ENTERPRISE)}
            />
          </RevealSection>
        </div>

        <RevealSection delay={0.3}>
          <p style={{ textAlign: 'center', color: '#757575', fontSize: 15, marginTop: 36 }}>
            🎁 <strong>Teste por 30 dias</strong> em todos os planos &nbsp;•&nbsp; 💳 Sem compromisso &nbsp;•&nbsp; 🚫 Cancele quando quiser
          </p>
        </RevealSection>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section style={S.ctaFinal}>
        <RevealSection>
          <img src="/img/Logo Sacola.png" alt="" style={{ height: 56, marginBottom: 20, filter: 'brightness(10)' }} onError={e => { e.target.style.display = 'none'; }} />
          <h2 style={S.ctaTitle}>Pronto para Aumentar Suas Vendas?</h2>
          <p style={S.ctaSub}>Comece agora hoje e veja sua loja crescer</p>
          <div style={S.ctaBtns}>
            <button onClick={() => navigate('/cadastro')} style={S.btnPrimary}>
              <FaRocket style={{ marginRight: 8 }} /> Começar Agora
            </button>
            <button onClick={scrollToPlanos} style={{ ...S.btnSecondary, borderColor: '#fff', color: '#fff' }}>
              Ver Planos
            </button>
          </div>
        </RevealSection>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.footerCol}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/img/Logo Sacola.png" alt="" style={{ height: 30, filter: 'brightness(10)' }} onError={e => { e.target.style.display = 'none'; }} />
              <img src="/img/Logo Clara.png" alt="" style={{ height: 26, filter: 'brightness(10)' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <p style={S.footerTxt}>A plataforma que conecta lojas, consultores e clientes.</p>
          </div>
          <div style={S.footerCol}>
            <h4 style={S.footerH}>Links Rápidos</h4>
            <a href="#como-funciona" style={S.footerLink}>Como Funciona</a>
            <a href="#beneficios" style={S.footerLink}>Benefícios</a>
            <a href="#planos" style={S.footerLink}>Planos</a>
          </div>
          <div style={S.footerCol}>
            <h4 style={S.footerH}>Suporte</h4>
            <a href="/termos" style={S.footerLink}>Termos de Uso</a>
            <a href="/privacidade" style={S.footerLink}>Privacidade</a>
            <a href="mailto:contato@comprasmart.com.br" style={S.footerLink}>Contato</a>
          </div>
        </div>
        <div style={S.footerBot}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>© 2026 Compra Smart. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════ */
const S = {
  page: {
    fontFamily: "'DM Sans', 'Inter', 'Segoe UI', sans-serif",
    color: '#333',
    background: '#FAFAFA',
    minHeight: '100vh',
    overflowX: 'hidden',
  },

  /* ── NAVBAR ── */
  navbar: {
    position: 'sticky', top: 0, zIndex: 100,
    background: '#fff',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    padding: '14px 48px',
  },
  navInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logoLink: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' },
  navA: { textDecoration: 'none', color: '#555', fontSize: 14, fontWeight: 500, transition: 'color .3s' },
  navQuiz: {
    background: 'linear-gradient(135deg, #7B3FA0, #A855F7)',
    color: '#fff', border: 'none', padding: '9px 18px', fontSize: 13,
    fontWeight: 600, borderRadius: 50, cursor: 'pointer',
    boxShadow: '0 3px 12px rgba(123,63,160,0.25)',
  },
  navLogin: {
    background: 'transparent', color: '#7B3FA0',
    border: '2px solid #7B3FA0', padding: '8px 18px', fontSize: 13,
    fontWeight: 600, borderRadius: 50, cursor: 'pointer',
  },
  navCTA: {
    background: '#E91E63', color: '#fff', border: 'none',
    padding: '10px 22px', fontSize: 14, fontWeight: 700,
    borderRadius: 50, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(233,30,99,0.3)',
  },

  /* ── HERO ── */
  hero: { background: 'linear-gradient(160deg, #FAFAFA 0%, #F3E5F5 40%, #FCE4EC 100%)', padding: '80px 48px 100px' },
  heroInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 },
  heroText: { flex: 1, maxWidth: 580 },
  heroTitle: {
    fontFamily: "'Poppins', sans-serif", fontSize: 50, fontWeight: 800,
    lineHeight: 1.12, color: '#4A1D6A', letterSpacing: -1.5, marginBottom: 20,
  },
  heroSub: { fontSize: 18, lineHeight: 1.7, color: '#555', marginBottom: 36, maxWidth: 480 },
  heroBtns: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 },
  btnPrimary: {
    background: '#E91E63', color: '#fff', border: 'none',
    padding: '15px 32px', borderRadius: 50,
    fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    boxShadow: '0 4px 20px rgba(233,30,99,0.3)',
    transition: 'all .3s',
  },
  btnSecondary: {
    background: '#fff', color: '#7B3FA0',
    border: '2px solid #A855F7', padding: '13px 30px', borderRadius: 50,
    fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700,
    cursor: 'pointer', transition: 'all .3s',
  },
  badges: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  badge: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555' },
  heroVisual: { flexShrink: 0 },
  heroBrandBox: { display: 'flex', alignItems: 'center', gap: 18 },

  /* ── NUMBERS ── */
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
  numVal: { fontFamily: "'Poppins', sans-serif", fontSize: 44, fontWeight: 900, color: '#E91E63', marginBottom: 6 },
  numLabel: { fontSize: 14, color: '#888' },

  /* ── SECTIONS ── */
  section: { padding: '80px 40px', maxWidth: 1200, margin: '0 auto' },
  secTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 40, fontWeight: 800, textAlign: 'center', color: '#4A1D6A', marginBottom: 16 },
  secSub: { fontSize: 18, textAlign: 'center', color: '#777', marginBottom: 52 },

  /* ── STEPS ── */
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 },
  stepCard: {
    textAlign: 'center', padding: 32, borderRadius: 20,
    background: '#fff', boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
    position: 'relative', transition: 'transform .3s, box-shadow .3s',
  },
  stepNum: {
    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
    background: '#E91E63', color: '#fff', width: 36, height: 36,
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700,
  },
  stepTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, margin: '18px 0 10px', color: '#4A1D6A' },
  stepDesc: { fontSize: 14, color: '#777', lineHeight: 1.65 },

  /* ── BENEFIT CARDS (lojistas 2-col) ── */
  benefitGrid2col: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22 },
  bCard: { borderRadius: 20, padding: '30px 28px', transition: 'transform .35s, box-shadow .35s' },
  bIcon: { marginBottom: 14 },
  bTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: '#4A1D6A', marginBottom: 8, lineHeight: 1.3 },
  bDesc: { fontSize: 14, color: '#555', lineHeight: 1.65 },

  /* ── CONSULTOR CARDS ── */
  consultorGrid: { display: 'flex', flexDirection: 'column', gap: 20 },
  consultorCard: {
    borderRadius: 20, padding: '28px 30px',
    display: 'flex', alignItems: 'flex-start', gap: 20,
    transition: 'transform .35s, box-shadow .35s',
  },

  /* ── WHY CHOOSE ── */
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 },
  whyCard: {
    borderRadius: 20, padding: 36, textAlign: 'center',
    transition: 'transform .35s, box-shadow .35s',
  },

  /* ── PLANS ── */
  plansRow: { display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', marginTop: 40 },

  /* ── CTA FINAL ── */
  ctaFinal: {
    background: 'linear-gradient(135deg, #4A1D6A, #7B3FA0)',
    padding: '80px 40px', textAlign: 'center', color: '#fff',
  },
  ctaTitle: { fontFamily: "'Poppins', sans-serif", fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 16 },
  ctaSub: { fontSize: 20, color: 'rgba(255,255,255,0.8)', marginBottom: 36 },
  ctaBtns: { display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' },

  /* ── FOOTER ── */
  footer: { background: '#2E1A47', padding: '52px 48px 24px', color: '#fff' },
  footerInner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 40, marginBottom: 36,
  },
  footerCol: { display: 'flex', flexDirection: 'column' },
  footerH: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#E91E63' },
  footerTxt: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 },
  footerLink: { textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 10, transition: 'color .3s' },
  footerBot: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center' },
};

export default Landingpage;
