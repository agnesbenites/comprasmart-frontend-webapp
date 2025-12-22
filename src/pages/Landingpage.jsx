// app-frontend/src/pages/Landingpage.jsx
// Landing Page da Compra Smart - VERSAO COM IMAGENS SEPARADAS

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
            <h1 style={styles.logoText}>
              COMPRA <span style={styles.logoSmart}>SMART</span>
            </h1>
          </div>
          
          <nav style={styles.nav}>
            <a href="#funcionalidades" style={styles.navLink}>Funcionalidades</a>
            <a href="#planos" onClick={scrollToPlanos} style={styles.navLink}>Planos</a>
            <a href="/contato" style={styles.navLink}>Contato</a>
          </nav>

          <button 
            onClick={() => navigate('/entrar')}
            style={styles.loginButton}
          >
            LOGIN
          </button>
        </div>
      </header>

      {/* HERO SECTION - TELA CHEIA */}
      <section style={styles.hero}>
        <img 
          src="/img/hero-banner.png" 
          alt="Compra Smart - Uma forma facil de unir vendas locais" 
          style={styles.heroBannerImage}
        />
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
          {/* LOJISTAS */}
          <OfferingCard
            title="Lojistas"
            icon={<FaStore size={40} color="#5DADE2" />}
            features={[
              "Painel com metricas",
              "Gestao de equipes, estoque, integracoes com ERP",
              "Campanhas de marketing",
              "Valores acessiveis",
              "Conexao entre Cliente Certo com Consultor Especializado"
            ]}
            color="#5DADE2"
          />

          {/* CLIENTES */}
          <OfferingCard
            title="Clientes"
            icon={<FaShoppingCart size={40} color="#48C9B0" />}
            features={[
              "Ache consultores que te ajudam a fazer a escolha certa",
              "Conheca lojas proximas de voce",
              "Deixe seu carrinho pronto para pagar na loja e retire o produto",
              "Compre com a certeza de que sabe tudo sobre o produto"
            ]}
            color="#48C9B0"
          />

          {/* CONSULTORES */}
          <OfferingCard
            title="Consultores"
            icon={<FaUserTie size={40} color="#F7DC6F" />}
            features={[
              "Trabalhe em segmentos que voce realmente conhece",
              "Atenda quantos clientes quiser, de onde quiser",
              "Nao precisa ser empreendedor ou lojista",
              "Plataforma facil e intuitiva para todos"
            ]}
            color="#F7DC6F"
          />
        </div>
      </section>

      {/* NOSSOS PLANOS */}
      <section id="planos" style={{...styles.section, backgroundColor: '#ECF0F1', maxWidth: '100%', padding: '80px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={styles.sectionTitle}>Nossos Planos</h2>

          {/* Clientes */}
          <div style={styles.planContainer}>
            <h3 style={styles.planCategory}>Clientes</h3>
            <div style={{...styles.freePlanCard, backgroundColor: '#5DADE2'}}>
              <h4 style={styles.planPrice}>R$ 0</h4>
              <p style={styles.planCTA}>BAIXE O APP</p>
              <FaMobileAlt style={styles.planIcon} />
              <p style={styles.planDescription}>
                Encontre as lojas com os produtos que voce precisa na sua regiao
              </p>
              <p style={styles.planNote}>DISPONIVEL SOMENTE PARA MOBILE</p>
              <button 
                onClick={() => window.open('https://play.google.com/store', '_blank')}
                style={styles.downloadButton}
              >
                BAIXAR NA PLAY STORE
              </button>
            </div>
          </div>

          {/* Consultores */}
          <div style={styles.planContainer}>
            <h3 style={styles.planCategory}>Consultores</h3>
            <div style={{...styles.freePlanCard, backgroundColor: '#5B5B5B'}}>
              <h4 style={styles.planPrice}>R$ 0</h4>
              <p style={styles.planCTA}>ACESSE O SITE E CADASTRE-SE</p>
              <p style={styles.planDescription}>
                Necessario cadastrar-se tambem no Stripe para receber comissoes
              </p>
              <p style={styles.planNote}>DISPONIVEL SOMENTE WEB APP</p>
              <button 
                onClick={() => navigate('/entrar')}
                style={styles.signupButton}
              >
                <FaDesktop /> ACESSAR AGORA
              </button>
            </div>
          </div>

          {/* Lojistas - 3 Planos */}
          <div style={styles.planContainer}>
            <h3 style={styles.planCategory}>Lojistas</h3>
            <div style={styles.lojistasPlans}>
              
              {/* BASICO */}
              <PlanCard
                name="BASICO"
                price="R$ 99,90"
                period="POR MES"
                description="Ideal para pequenos negocios ou que tenham produtos personalizados"
                features={[
                  "Chat para mensagens ilimitado",
                  "Analytics e metricas simples",
                  "Cadastre ate 100 produtos",
                  "Cadastre ate 2 filiais"
                ]}
                color="#2C3E50"
                onBuy={() => handleStripeCheckout(STRIPE_URLS.BASICO)}
              />

              {/* PRO */}
              <PlanCard
                name="PRO"
                price="R$ 199,90"
                period="POR MES"
                description="Para negocios em expansao que precisam de mais recursos"
                features={[
                  "Chat ilimitado + 6 video chamadas/mes",
                  "Analytics e metricas detalhadas",
                  "Cadastre ate 500 produtos",
                  "Cadastre ate 5 filiais"
                ]}
                color="#2C3E50"
                highlighted
                onBuy={() => handleStripeCheckout(STRIPE_URLS.PRO)}
              />

              {/* ENTERPRISE */}
              <PlanCard
                name="ENTERPRISE"
                price="R$ 499,00"
                period="POR MES"
                description="Para negocios consolidados com equipe grande"
                features={[
                  "Todos os tipos de mensagem ilimitados",
                  "Analytics e metricas avancadas",
                  "Cadastre ate 1000 produtos",
                  "Ate 30 filiais + Integracao ERP"
                ]}
                color="#2C3E50"
                onBuy={() => handleStripeCheckout(STRIPE_URLS.ENTERPRISE)}
              />
            </div>
          </div>

          {/* PACOTES ADICIONAIS */}
          <div style={styles.adicionaisSection}>
            <div style={styles.adicionaisCard}>
              <div style={styles.adicionaisIcon}>
                <FaPlus size={30} color="#F4D03F" />
              </div>
              <div style={styles.adicionaisContent}>
                <h3 style={styles.adicionaisTitulo}>Quer mais recursos?</h3>
                <p style={styles.adicionaisTexto}>
                  Alem dos planos, oferecemos <strong>pacotes adicionais</strong> para potencializar ainda mais seu negocio:
                </p>
                <div style={styles.adicionaisLista}>
                  <div style={styles.adicionalItem}>
                    <FaBullhorn color="#5DADE2" size={20} />
                    <span><strong>Campanhas de Marketing</strong> - Destaque seus produtos para mais clientes</span>
                  </div>
                  <div style={styles.adicionalItem}>
                    <FaUsers color="#48C9B0" size={20} />
                    <span><strong>Consultores Extras</strong> - Aumente sua equipe de vendas</span>
                  </div>
                  <div style={styles.adicionalItem}>
                    <FaChartLine color="#F7DC6F" size={20} />
                    <span><strong>Relatorios Avancados</strong> - Insights detalhados do seu negocio</span>
                  </div>
                  <div style={styles.adicionalItem}>
                    <FaBox color="#E74C3C" size={20} />
                    <span><strong>Produtos Extras</strong> - Cadastre mais itens no catalogo</span>
                  </div>
                </div>
                <p style={styles.adicionaisNota}>
                  &#128161; Acesse a <strong>pagina de Pagamentos</strong> dentro da sua Dashboard para ver todos os pacotes disponiveis e contratar!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>COMPRA SMART</h4>
            <p style={styles.footerText}>
              Conectando lojas locais, consultores especializados e clientes inteligentes.
            </p>
          </div>
          
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>LINKS RÁPIDOS</h4>
            <a 
              href="https://merciful-keyboard-70e.notion.site/2cfcb8e9243180a08bbbf914d582e8bf" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.footerLink}
            >
              📋 Termo de Adesão
            </a>
            <a 
              href="https://merciful-keyboard-70e.notion.site/2d0cb8e9243180938a66c6b53a4aed5b" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.footerLink}
            >
              📜 Termos e Condições de Uso
            </a>
            <a 
              href="https://merciful-keyboard-70e.notion.site/2d1cb8e924318015a8b0dea48170d820" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.footerLink}
            >
              🔒 Política de Privacidade
            </a>
            <a href="/contato" style={styles.footerLink}>
              📧 Contato
            </a>
          </div>
          
          <div style={styles.footerColumn}>
            <h4 style={styles.footerTitle}>ACESSO</h4>
            <button onClick={() => navigate('/entrar')} style={styles.footerLink}>
              Login Lojista
            </button>
            <button onClick={() => navigate('/entrar')} style={styles.footerLink}>
              Login Consultor
            </button>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p>&#169; {new Date().getFullYear()} Compra Smart. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

// ====================================================================
// ESTILOS
// ====================================================================
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    color: '#2C3E50',
    overflowX: 'hidden',
  },
  
  // Header/Navbar
  header: {
    backgroundColor: '#1A2332',
    padding: '15px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {},
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
  },
  logoSmart: {
    color: '#F4D03F',
    fontStyle: 'italic',
  },
  nav: {
    display: 'flex',
    gap: '25px',
    alignItems: 'center',
  },
  navLink: {
    color: '#E0E0E0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  loginButton: {
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  
  // Hero - TELA CHEIA
  hero: {
    width: '100%',
    margin: '0',
    backgroundColor: '#A8E6CF', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
  },
  heroBannerImage: {
    width: '100%', 
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  },
  
  // Secao de Beneficios - LOJISTAS (fundo claro)
  beneficiosSection: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: '60px 20px',
    margin: '0',
  },
  
  // Secao de Beneficios - CONSULTORES (fundo branco)
  beneficiosSectionAlt: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '60px 20px',
    margin: '0',
  },
  
  beneficiosWrapper: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
  },
  
  beneficiosImage: {
    width: '100%',
    maxWidth: '900px',
    height: 'auto',
    display: 'block',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    transition: 'transform 0.3s ease',
  },

  // Secao Padrao
  section: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1A2332',
    marginBottom: '15px',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '50px',
  },

  // Features (QUEM SOMOS)
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginTop: '40px',
  },
  featureCard: {
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  featureText: {
    fontSize: '1.1rem',
    color: '#2C3E50',
    margin: 0,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Reasons (POR QUE FAZEMOS)
  reasons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '40px',
  },
  reasonCard: {
    padding: '25px 40px',
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  },
  reasonText: {
    fontSize: '1.05rem',
    margin: 0,
  },
  
  // Offerings (O QUE OFERECEMOS)
  offerings: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    marginTop: '50px',
  },
  offeringCard: {
    padding: '30px',
    borderRadius: '15px',
    border: '4px solid',
    backgroundColor: 'white',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  offeringIcon: {
    marginBottom: '20px',
  },
  offeringTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2C5AA0',
    marginBottom: '20px',
  },
  offeringList: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'left',
  },
  offeringItem: {
    fontSize: '1rem',
    marginBottom: '12px',
    color: '#2C3E50',
    display: 'flex',
    alignItems: 'center',
  },
  
  // Plans (NOSSOS PLANOS)
  planContainer: {
    marginBottom: '60px',
  },
  planCategory: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C5AA0',
    marginBottom: '30px',
  },
  
  // Planos R$ 0,00 (CLIENTE & CONSULTOR)
  freePlanCard: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
  planPrice: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  },
  planCTA: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  planIcon: {
    fontSize: '5rem',
    margin: '20px 0',
  },
  planDescription: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  planNote: {
    fontSize: '0.85rem',
    color: '#F7DC6F',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  downloadButton: {
    padding: '15px 30px',
    backgroundColor: '#F7DC6F',
    color: '#2C3E50',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  signupButton: {
    padding: '15px 30px',
    backgroundColor: '#F7DC6F',
    color: '#2C3E50',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
  },

  // Plan Cards (Lojistas)
  lojistasPlans: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    alignItems: 'stretch',
  },
  planCard: {
    padding: '35px 25px',
    borderRadius: '20px',
    color: 'white',
    backgroundColor: '#2C3E50',
    transition: 'all 0.3s',
    border: '3px solid transparent',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  tag: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    padding: '5px 15px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    borderRadius: '0 17px 0 17px',
  },
  planName: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#F4D03F',
  },
  planPriceValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0',
    color: 'white',
  },
  planPeriod: {
    fontSize: '0.9rem',
    marginBottom: '20px',
    color: '#BDC3C7',
  },
  planDesc: {
    fontSize: '0.95rem',
    marginBottom: '25px',
    lineHeight: 1.5,
    color: '#ECF0F1',
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px',
    flexGrow: 1,
  },
  planFeature: {
    fontSize: '0.9rem',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    color: '#ECF0F1',
  },
  planButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '20px',
  },

  // PACOTES ADICIONAIS
  adicionaisSection: {
    marginTop: '60px',
  },
  adicionaisCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    border: '3px solid #F4D03F',
  },
  adicionaisIcon: {
    width: '70px',
    height: '70px',
    backgroundColor: '#1A2332',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  adicionaisContent: {
    flex: 1,
    textAlign: 'left',
  },
  adicionaisTitulo: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#1A2332',
    marginBottom: '15px',
    marginTop: 0,
  },
  adicionaisTexto: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '20px',
    lineHeight: 1.6,
  },
  adicionaisLista: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '25px',
  },
  adicionalItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    fontSize: '0.95rem',
  },
  adicionaisNota: {
    fontSize: '0.95rem',
    color: '#2C5AA0',
    backgroundColor: '#e3f2fd',
    padding: '15px 20px',
    borderRadius: '10px',
    marginTop: '10px',
    marginBottom: 0,
  },
  
  // Footer
  footer: {
    backgroundColor: '#1A2332',
    color: 'white',
    padding: '60px 20px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px',
    marginBottom: '40px',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#F4D03F',
  },
  footerText: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#BDC3C7',
  },
  footerLink: {
    color: '#BDC3C7',
    textDecoration: 'none',
    marginBottom: '10px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
    textAlign: 'left',
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #34495E',
    color: '#95A5A6',
    fontSize: '0.9rem',
  },
};

export default Landingpage;