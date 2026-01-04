// app-frontend/src/pages/Landingpage.jsx
// Landing Page da Compra Smart - COM ONBOARDING

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStore, FaUserTie, FaShoppingCart, FaChartLine, 
  FaUsers, FaBox, FaBullhorn, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaDollarSign, FaRocket,
  FaMobileAlt, FaDesktop, FaRegCheckCircle, FaPlus
} from 'react-icons/fa';

// --- COMPONENTES AUXILIARES ---

const FeatureCard = ({ text, highlight }) => (
    <div style={{
      ...styles.featureCard,
      backgroundColor: highlight ? '#F7DC6F' : '#F7DC6F',
    }}>
      <p style={styles.featureText}>{text}</p>
    </div>
);

const ReasonCard = ({ text, color }) => (
    <div style={{...styles.reasonCard, backgroundColor: color, borderRadius: '15px'}}>
      <p style={styles.reasonText}>{text}</p>
    </div>
);

const OfferingCard = ({ title, icon, features, color }) => (
    <div style={{...styles.offeringCard, borderColor: color}}>
      <div style={styles.offeringIcon}>{icon}</div>
      <h3 style={styles.offeringTitle}>{title}</h3>
      <ul style={styles.offeringList}>
        {features.map((feature, idx) => (
          <li key={idx} style={styles.offeringItem}>
            <FaRegCheckCircle color={color} size={14} style={{marginRight: 8}} /> {feature}
          </li>
        ))}
      </ul>
    </div>
);

const PlanCard = ({ name, price, period, description, features, color, highlighted, onBuy }) => (
  <div style={{
    ...styles.planCard,
    backgroundColor: color,
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    boxShadow: highlighted ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
    border: highlighted ? '3px solid #F4D03F' : 'none'
  }}>
    {highlighted && <div style={styles.tag}>POPULAR</div>}
    <h4 style={styles.planName}>{name}</h4>
    <h3 style={styles.planPriceValue}>{price}</h3>
    <p style={styles.planPeriod}>{period}</p>
    <p style={styles.planDesc}>{description}</p>
    
    <ul style={styles.planFeatures}>
      {features.map((feature, idx) => (
        <li key={idx} style={styles.planFeature}>
          <FaRegCheckCircle color="#F4D03F" size={14} style={{marginRight: 5}}/> {feature}
        </li>
      ))}
    </ul>
    
    <button onClick={onBuy} style={{...styles.planButton, backgroundColor: highlighted ? '#F4D03F' : '#5DADE2', color: highlighted ? '#1A2332' : 'white'}}>
      ASSINAR AGORA
    </button>
  </div>
);

const Landingpage = () => {
  const navigate = useNavigate();

  const scrollToPlanos = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  // LINKS REAIS DO STRIPE
  const STRIPE_URLS = {
    BASICO: 'https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01',
    PRO: 'https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02',
    ENTERPRISE: 'https://buy.stripe.com/3cI3cv2z6fqQaBM8SJgQE03',
  };

  const handleStripeCheckout = (stripeLink) => {
    window.location.href = stripeLink; 
  };

  return (
    <div style={styles.container}>
      {/* HEADER/NAVBAR */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            {/* ✅ LOGO ADICIONADO */}
            <img 
              src="/img/logo.png" 
              alt="Compra Smart Logo" 
              style={styles.logoImage}
            />
            <h1 style={styles.logoText}>
              COMPRA <span style={styles.logoSmart}>SMART</span>
            </h1>
          </div>
          
          <nav style={styles.nav}>
            <a href="#funcionalidades" style={styles.navLink}>Funcionalidades</a>
            <a href="#planos" onClick={scrollToPlanos} style={styles.navLink}>Planos</a>
            <a href="/contato" style={styles.navLink}>Contato</a>
          </nav>

          {/* ✅ BOTÕES ATUALIZADOS */}
          <div style={styles.headerButtons}>
            <button 
              onClick={() => navigate('/onboarding')}
              style={styles.onboardingButton}
            >
              🚀 COMEÇAR AGORA
            </button>
            <button 
              onClick={() => navigate('/entrar')}
              style={styles.loginButton}
            >
              LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION - TELA CHEIA COM CTA */}
      <section style={styles.hero}>
        <img 
          src="/img/hero-banner.png" 
          alt="Compra Smart - Uma forma facil de unir vendas locais" 
          style={styles.heroBannerImage}
        />
        
        {/* ✅ CTA OVERLAY NO HERO */}
        <div style={styles.heroOverlay}>
          <h2 style={styles.heroTitle}>
            Transforme Vendas em Receita
          </h2>
          <p style={styles.heroSubtitle}>
            O Uber das Vendas: Atendimento Humanizado + Liquidez de Estoque
          </p>
          <button 
            onClick={() => navigate('/onboarding')}
            style={styles.heroCTA}
          >
            🎯 Ver Como Funciona
          </button>
        </div>
      </section>

      {/* BENEFICIOS PARA LOJISTAS */}
      <section style={styles.beneficiosSection}>
        <div style={styles.beneficiosWrapper}>
          <img 
            src="/img/Para-Lojistas.png" 
            alt="Beneficios para Lojistas - Multiplique seu alcance e suas vendas" 
            style={styles.beneficiosImage}
          />
        </div>
      </section>

      {/* BENEFICIOS PARA CONSULTORES */}
      <section style={styles.beneficiosSectionAlt}>
        <div style={styles.beneficiosWrapper}>
          <img 
            src="/img/Para-Consultores.png" 
            alt="Beneficios para Consultores - Liberdade e renda extra" 
            style={styles.beneficiosImage}
          />
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section style={styles.section} id="funcionalidades">
        <h2 style={styles.sectionTitle}>Quem Somos e o Que Fazemos?</h2>
        
        <div style={styles.features}>
          <FeatureCard 
            text="A Compra Smart e um web app para lojistas, consultores e clientes"
            highlight
          />
          <FeatureCard 
            text="Nem todo empreendedor e vendedor e nem todo vendedor e empreendedor."
          />
          <FeatureCard 
            text="Conectamos lojistas com consultores que entendem de diversos produtos, alem de incentivar a venda na loja fisica."
          />
          <FeatureCard 
            text="Fazemos com que a sua loja fisica seja descoberta por clientes que realmente se interessam pelo seu produto."
          />
        </div>
      </section>

      {/* POR QUE FAZEMOS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Por Que Fazemos o Que Fazemos?</h2>
        
        <div style={styles.reasons}>
          <ReasonCard 
            text="Para empreendedores, lojistas e profissionais se destacarem em sua regiao."
            color="#5DADE2"
          />
          <ReasonCard 
            text="Queremos que os donos de negocios possam competir com o mercado online."
            color="#48C9B0"
          />
          <ReasonCard 
            text="Sabemos que nem sempre o dono da padaria e padeiro, entao conectamos pessoas especializadas nos produtos para atender a sua loja."
            color="#85C1E9"
          />
          <ReasonCard 
            text="Queremos facilitar as vendas entre o mundo virtual e as lojas fisicas atraves do web app Compra Smart."
            color="#76D7C4"
          />
        </div>
      </section>

      {/* O QUE OFERECEMOS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>O Que Oferecemos?</h2>
        
        <div style={styles.offerings}>
          <OfferingCard
            title="Lojistas"
            icon={<FaStore size={40} color="#5DADE2" />}
            color="#5DADE2"
            features={[
              "Multiplique seu alcance com consultores especializados",
              "Dashboards completos de vendas e performance",
              "Gestao simplificada de produtos e estoque",
              "Marketing e campanhas inteligentes"
            ]}
          />
          
          <OfferingCard
            title="Consultores"
            icon={<FaUserTie size={40} color="#48C9B0" />}
            color="#48C9B0"
            features={[
              "Trabalhe quando e onde quiser",
              "Comissoes justas por cada venda",
              "Suporte completo em tempo real",
              "Treinamentos e certificacoes gratuitas"
            ]}
          />
          
          <OfferingCard
            title="Clientes"
            icon={<FaShoppingCart size={40} color="#F4D03F" />}
            color="#F4D03F"
            features={[
              "Atendimento personalizado e humanizado",
              "Descubra lojas proximas de voce",
              "Ofertas exclusivas e descontos",
              "Experiencia de compra superior"
            ]}
          />
        </div>
      </section>

      {/* PLANOS */}
      <section style={styles.section} id="planos">
        <h2 style={styles.sectionTitle}>Escolha Seu Plano</h2>
        <p style={styles.sectionSubtitle}>
          Planos flexiveis para lojas de todos os tamanhos
        </p>
        
        <div style={styles.plansGrid}>
          <PlanCard
            name="BASICO"
            price="R$ 50"
            period="por mes"
            description="Ideal para pequenos negocios"
            color="#1A2332"
            features={[
              "Ate 100 produtos",
              "10 consultores disponiveis",
              "Dashboard basico",
              "Suporte por email"
            ]}
            onBuy={() => handleStripeCheckout(STRIPE_URLS.BASICO)}
          />
          
          <PlanCard
            name="PRO"
            price="R$ 150"
            period="por mes"
            description="Para negocios em crescimento"
            color="#2C3E50"
            highlighted
            features={[
              "Ate 1000 produtos",
              "30 consultores disponiveis",
              "Dashboard avancado",
              "Suporte prioritario",
              "Integracao com ERPs"
            ]}
            onBuy={() => handleStripeCheckout(STRIPE_URLS.PRO)}
          />
          
          <PlanCard
            name="ENTERPRISE"
            price="R$ 360"
            period="por mes"
            description="Solucao completa para grandes redes"
            color="#34495E"
            features={[
              "Produtos ilimitados",
              "Consultores ilimitados",
              "BI e Analytics avancado",
              "Suporte VIP 24/7",
              "API personalizada",
              "Multi-filiais"
            ]}
            onBuy={() => handleStripeCheckout(STRIPE_URLS.ENTERPRISE)}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>COMPRA SMART</h4>
            <p style={styles.footerText}>
              Conectando lojistas, consultores e clientes de forma inteligente.
            </p>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Links Rapidos</h4>
            <a href="#funcionalidades" style={styles.footerLink}>Funcionalidades</a>
            <a href="#planos" style={styles.footerLink}>Planos</a>
            <a href="/termos" style={styles.footerLink}>Termos de Uso</a>
            <a href="/privacidade" style={styles.footerLink}>Privacidade</a>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Comece Agora</h4>
            <button 
              onClick={() => navigate('/onboarding')}
              style={styles.footerButton}
            >
              🚀 Criar Conta Grátis
            </button>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p style={styles.footerCopy}>
            © 2024 Compra Smart. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- ESTILOS ---

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#f8f9fa',
  },
  
  // HEADER
  header: {
    backgroundColor: '#1A2332',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logoImage: { // ✅ NOVO
    height: '40px',
    width: 'auto',
  },
  logoText: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
  },
  logoSmart: {
    color: '#F4D03F',
  },
  nav: {
    display: 'flex',
    gap: '30px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
  headerButtons: { // ✅ NOVO
    display: 'flex',
    gap: '15px',
  },
  onboardingButton: { // ✅ NOVO
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(244, 208, 63, 0.3)',
  },
  loginButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '10px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  
  // HERO
  hero: {
    position: 'relative',
    width: '100%',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroBannerImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  },
  heroOverlay: { // ✅ NOVO
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(26, 35, 50, 0.85)',
    padding: '50px 60px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    margin: '0 0 15px 0',
    color: '#F4D03F',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    margin: '0 0 30px 0',
    color: 'white',
  },
  heroCTA: { // ✅ NOVO
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    border: 'none',
    padding: '16px 40px',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(244, 208, 63, 0.4)',
    transition: 'all 0.3s',
  },
  
  // BENEFICIOS
  beneficiosSection: {
    backgroundColor: '#fff',
    padding: '60px 20px',
  },
  beneficiosSectionAlt: {
    backgroundColor: '#f8f9fa',
    padding: '60px 20px',
  },
  beneficiosWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  beneficiosImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '15px',
  },
  
  // SECTIONS
  section: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    textAlign: 'center',
    color: '#1A2332',
    marginBottom: '20px',
  },
  sectionSubtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: '#666',
    marginBottom: '50px',
  },
  
  // FEATURES
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  featureCard: {
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  featureText: {
    fontSize: '1rem',
    color: '#1A2332',
    lineHeight: '1.6',
  },
  
  // REASONS
  reasons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  reasonCard: {
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  reasonText: {
    fontSize: '1rem',
    color: 'white',
    lineHeight: '1.6',
  },
  
  // OFFERINGS
  offerings: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  offeringCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    border: '3px solid',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
  },
  offeringIcon: {
    marginBottom: '15px',
  },
  offeringTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#1A2332',
  },
  offeringList: {
    listStyle: 'none',
    padding: 0,
  },
  offeringItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '0.95rem',
    color: '#666',
  },
  
  // PLANS
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  planCard: {
    padding: '40px 30px',
    borderRadius: '20px',
    color: 'white',
    position: 'relative',
    transition: 'all 0.3s',
  },
  tag: {
    position: 'absolute',
    top: '-15px',
    right: '20px',
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  planName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '15px',
  },
  planPriceValue: {
    fontSize: '3rem',
    fontWeight: '800',
    margin: '10px 0',
  },
  planPeriod: {
    fontSize: '1rem',
    opacity: 0.8,
    marginBottom: '15px',
  },
  planDesc: {
    fontSize: '0.95rem',
    marginBottom: '25px',
    opacity: 0.9,
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px',
  },
  planFeature: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '0.95rem',
  },
  planButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  
  // FOOTER
  footer: {
    backgroundColor: '#1A2332',
    color: 'white',
    padding: '60px 20px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  footerTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#F4D03F',
    marginBottom: '10px',
  },
  footerText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    opacity: 0.8,
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.95rem',
    opacity: 0.8,
    transition: 'opacity 0.3s',
  },
  footerButton: {
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    width: 'fit-content',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px',
    textAlign: 'center',
  },
  footerCopy: {
    fontSize: '0.9rem',
    opacity: 0.6,
  },
};

export default Landingpage;