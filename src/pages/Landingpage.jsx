// app-frontend/src/pages/Landingpage.jsx
// Landing Page da Compra Smart - Versão Moderna e Interativa

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStore, FaUserTie, FaShoppingCart, FaChartLine, 
  FaUsers, FaBox, FaBullhorn, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaDollarSign, FaRocket,
  FaMobileAlt, FaDesktop, FaStripe
} from 'react-icons/fa';

const Landingpage = () => {
  const navigate = useNavigate();

  const scrollToPlanos = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
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
            <button 
              onClick={() => navigate('/lojista/login')}
              style={{...styles.navButton, ...styles.lojistaButton}}
            >
              LOJISTA
            </button>
            <button 
              onClick={() => navigate('/consultor/login')}
              style={{...styles.navButton, ...styles.consultorButton}}
            >
              CONSULTOR
            </button>
            <button 
              onClick={() => navigate('/cliente/app')}
              style={{...styles.navButton, ...styles.clienteButton}}
            >
              CLIENTE
            </button>
            <button 
              onClick={() => navigate('/entrar')}
              style={{...styles.navButton, ...styles.loginButton}}
            >
              LOGIN
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <img 
          src="/img/hero-banner.png" 
          alt="Compra Smart - Uma forma fácil de unir vendas locais" 
          style={styles.heroBannerImage}
        />
      </section>

      {/* BENEFÍCIOS - IMAGEM COMPLETA */}
      <section style={styles.beneficiosImageSection}>
        <img 
          src="/img/beneficios-lojistas-consultores.png" 
          alt="Benefícios para Lojistas e Consultores" 
          style={styles.beneficiosImage}
        />
      </section>

      {/* QUEM SOMOS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>QUEM SOMOS E O QUE FAZEMOS?</h2>
        
        <div style={styles.features}>
          <FeatureCard 
            text="A Compra Smart é um web app para lojistas, consultores e clientes"
            highlight
          />
          <FeatureCard 
            text="Nem todo empreendedor é vendedor e nem todo vendedor é empreendedor."
          />
          <FeatureCard 
            text="Conectamos lojistas com consultores que entendem de diversos produtos, além de incentivar a venda na loja física."
          />
          <FeatureCard 
            text="Fazemos com que a sua loja física seja descoberta por clientes que realmente se interessam pelo seu produto."
          />
        </div>
      </section>

      {/* POR QUE FAZEMOS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>POR QUE FAZEMOS O QUE FAZEMOS?</h2>
        
        <div style={styles.reasons}>
          <ReasonCard 
            text="Para empreendedores, lojistas e profissionais se destacarem em sua região."
            color="#5DADE2"
          />
          <ReasonCard 
            text="Queremos que os donos de negócios possam competir com o mercado online."
            color="#48C9B0"
          />
          <ReasonCard 
            text="Sabemos que nem sempre o dono da padaria é padeiro, então conectamos pessoas especializadas nos produtos para atender a sua loja."
            color="#85C1E9"
          />
          <ReasonCard 
            text="Queremos facilitar as vendas entre o mundo virtual e as lojas físicas através do web app Compra Smart."
            color="#76D7C4"
          />
        </div>
      </section>

      {/* O QUE OFERECEMOS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>O QUE OFERECEMOS?</h2>
        
        <div style={styles.offerings}>
          {/* LOJISTAS */}
          <OfferingCard
            title="Lojistas"
            icon={<FaStore size={40} color="#2C3E50" />}
            features={[
              "Painel com métricas",
              "Gestão de equipes, estoque, integrações com ERP",
              "Campanhas de marketing",
              "Valores acessíveis",
              "Conexão entre Cliente Certo com Consultor Especializado"
            ]}
            color="#F7DC6F"
          />

          {/* CLIENTES */}
          <OfferingCard
            title="Clientes"
            icon={<FaShoppingCart size={40} color="#2C3E50" />}
            features={[
              "Ache consultores que te ajudam a fazer a escolha certa",
              "Conheça lojas próximas de você",
              "Deixe seu carrinho pronto para pagar na loja e retire o produto",
              "Compre com a certeza de que sabe tudo sobre o produto"
            ]}
            color="#F7DC6F"
          />

          {/* CONSULTORES */}
          <OfferingCard
            title="Consultores"
            icon={<FaUserTie size={40} color="#2C3E50" />}
            features={[
              "Trabalhe em segmentos que você realmente conhece",
              "Atenda quantos clientes quiser, de onde quiser",
              "Não precisa ser empreendedor ou lojista",
              "Plataforma fácil e intuitiva para todos"
            ]}
            color="#F7DC6F"
          />
        </div>
      </section>

      {/* PARA LOJISTAS */}
      <section style={{...styles.section, backgroundColor: '#ECF0F1'}}>
        <h2 style={styles.sectionTitle}>PARA LOJISTAS:</h2>
        <p style={styles.sectionSubtitle}>
          MULTIPLIQUE SEU ALCANCE E SUAS VENDAS
        </p>

        <div style={styles.benefitsGrid}>
          <BenefitCard
            title="Público Alvo na Mão"
            icon="👥"
            description="Alcance clientes que não sabiam que sua loja tinha o produto. Os consultores levam seu estoque exatamente para o público que está buscando."
            color="#F7DC6F"
          />
          <BenefitCard
            title="Zero Estoque Parado"
            icon="📦"
            description="Faça a gestão inteligente e venda rapidamente itens que estão ocupando espaço, transformando produto parado em capital de giro."
            color="#F7DC6F"
          />
          <BenefitCard
            title="Comissão Flexível"
            icon="💰"
            description="Defina e ajuste a comissão que você paga aos consultores por venda, garantindo que o custo de aquisição do cliente esteja sempre sob seu controle."
            color="#F7DC6F"
          />
          <BenefitCard
            title="Gestão Centralizada"
            icon="📊"
            description="Acompanhe todas as suas vendas e o desempenho dos consultores em um único dashboard de gestão, com recebimento automatizado via Stripe."
            color="#F7DC6F"
          />
          <BenefitCard
            title="Vendas Especializada"
            icon="🛒"
            description="Autorize consultores que entendem profundamente de seus produtos a vendê-los, garantindo que o cliente receba a orientação técnica correta."
            color="#F7DC6F"
          />
          <BenefitCard
            title="Campanhas de Sucesso"
            icon="📢"
            description="Crie promoções e campanhas exclusivas dentro da plataforma, potencializando a saída de produtos específicos."
            color="#F7DC6F"
          />
        </div>
      </section>

      {/* PARA CONSULTORES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>PARA CONSULTOR:</h2>
        <p style={styles.sectionSubtitle}>
          TRANSFORME SEU CONHECIMENTO EM LUCRO. SEJA UM ESPECIALISTA DE VENDAS E TRABALHE DE FORMA FLEXÍVEL.
        </p>

        <div style={styles.consultorBenefits}>
          <ConsultorBenefit
            icon={<FaClock size={50} color="#F7DC6F" />}
            title="Flexibilidade Total"
            description="Trabalhe de onde quiser, defina seus horários e a quantidade de tempo que deseja dedicar."
          />
          <ConsultorBenefit
            icon={<FaCheckCircle size={50} color="#F7DC6F" />}
            title="Escolha o Seu Segmento"
            description="Selecione as lojas e os segmentos de produtos que você realmente domina e tem paixão em vender."
          />
          <ConsultorBenefit
            icon={<FaDollarSign size={50} color="#F7DC6F" />}
            title="Comissão Direta"
            description="Receba sua comissão de forma transparente e segura, diretamente na sua conta, através do Stripe."
          />
          <ConsultorBenefit
            icon={<FaRocket size={50} color="#F7DC6F" />}
            title="Seja um consultor digital do varejo físico"
            description="Una experiência em vendas ao potencial do e-commerce, sem abrir uma loja. Represente marcas, atenda clientes online e receba comissões pelo que vender."
          />
        </div>
      </section>

      {/* NOSSOS PLANOS */}
      <section id="planos" style={{...styles.section, backgroundColor: '#ECF0F1'}}>
        <h2 style={styles.sectionTitle}>NOSSOS PLANOS</h2>

        {/* Clientes */}
        <div style={styles.planContainer}>
          <h3 style={styles.planCategory}>CLIENTES</h3>
          <div style={styles.clientePlan}>
            <h4 style={styles.planPrice}>R$ 0</h4>
            <p style={styles.planCTA}>BAIXE O APP</p>
            <FaMobileAlt style={styles.planIcon} />
            <p style={styles.planDescription}>
              Encontre as lojas com os produtos que você precisa na sua região
            </p>
            <p style={styles.planNote}>DISPONÍVEL SOMENTE PARA MOBILE</p>
            <button 
              onClick={() => window.open('https://play.google.com/store', '_blank')}
              style={styles.downloadButton}
            >
              📱 BAIXAR NA PLAY STORE
            </button>
          </div>
        </div>

        {/* Consultores */}
        <div style={styles.planContainer}>
          <h3 style={styles.planCategory}>CONSULTORES</h3>
          <div style={styles.consultorPlan}>
            <h4 style={styles.planPrice}>R$ 0</h4>
            <p style={styles.planCTA}>ACESSE O SITE E CADASTRE-SE</p>
            <p style={styles.planDescription}>
              Necessário cadastrar-se também no Stripe para receber comissões
            </p>
            <p style={styles.planNote}>DISPONÍVEL SOMENTE WEB APP</p>
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
          <h3 style={styles.planCategory}>LOJISTAS</h3>
          <div style={styles.lojistasPlans}>
            
            {/* BÁSICO */}
            <PlanCard
              name="BÁSICO"
              price="R$ 99,90"
              period="POR MÊS"
              description="Ideal para pequenos negócios ou que tenham produtos personalizados"
              features={[
                "Chat para mensagens ilimitado entre seus clientes e consultores",
                "Analytics e métricas simples",
                "Cadastre até 100 produtos",
                "Cadastre até 2 filiais"
              ]}
              color="#2C3E50"
              onBuy={() => {
                // TODO: Integrar com Stripe Checkout
                alert('Redirecionando para checkout... (Em breve: Stripe Payment)');
                // window.location.href = 'https://buy.stripe.com/test_xxx'; // URL real do Stripe
              }}
            />

            {/* PRO */}
            <PlanCard
              name="PRO"
              price="R$ 199,90"
              period="POR MÊS"
              description="Para negócios em expansão, mais consolidados e que precisam de mais dados"
              features={[
                "Chat para mensagens ilimitado entre seus clientes e consultores + 6 vídeo chamadas por mês",
                "Analytics e métricas detalhadas",
                "Cadastre até 500 produtos",
                "Cadastre até 5 filiais"
              ]}
              color="#2C3E50"
              highlighted
              onBuy={() => {
                // TODO: Integrar com Stripe Checkout
                alert('Redirecionando para checkout... (Em breve: Stripe Payment)');
                // window.location.href = 'https://buy.stripe.com/test_yyy'; // URL real do Stripe
              }}
            />

            {/* ENTERPRISE */}
            <PlanCard
              name="ENTERPRISE"
              price="R$ 499,00"
              period="POR MÊS"
              description="Negócios que já estão consolidados e com equipe grande."
              features={[
                "Todos os tipos de mensagem ilimitados",
                "Analytics e métricas detalhadas",
                "Cadastre até 1000 produtos",
                "Cadastre até 30 filiais",
                "Integração com ERP"
              ]}
              color="#2C3E50"
              onBuy={() => {
                // TODO: Integrar com Stripe Checkout
                alert('Redirecionando para checkout... (Em breve: Stripe Payment)');
                // window.location.href = 'https://buy.stripe.com/test_zzz'; // URL real do Stripe
              }}
            />
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
            <a href="/termos" style={styles.footerLink}>Termos de Uso</a>
            <a href="/privacidade" style={styles.footerLink}>Política de Privacidade</a>
            <a href="/contato" style={styles.footerLink}>Contato</a>
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
          <p>© 2024 Compra Smart. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

// Componentes Auxiliares
const FeatureCard = ({ text, highlight }) => (
  <div style={{
    ...styles.featureCard,
    backgroundColor: highlight ? '#F7DC6F' : '#F7DC6F',
  }}>
    <p style={styles.featureText}>{text}</p>
  </div>
);

const ReasonCard = ({ text, color }) => (
  <div style={{...styles.reasonCard, backgroundColor: color}}>
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
          ➤ {feature}
        </li>
      ))}
    </ul>
  </div>
);

const BenefitCard = ({ title, icon, description, color }) => (
  <div style={styles.benefitCard}>
    <div style={styles.benefitIcon}>{icon}</div>
    <h4 style={styles.benefitTitle}>{title}</h4>
    <p style={styles.benefitDescription}>{description}</p>
  </div>
);

const ConsultorBenefit = ({ icon, title, description }) => (
  <div style={styles.consultorBenefit}>
    <div style={styles.consultorBenefitIcon}>{icon}</div>
    <h4 style={styles.consultorBenefitTitle}>{title}</h4>
    <p style={styles.consultorBenefitDescription}>{description}</p>
  </div>
);

const PlanCard = ({ name, price, period, description, features, color, highlighted, onBuy }) => (
  <div style={{
    ...styles.planCard,
    backgroundColor: color,
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    boxShadow: highlighted ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
  }}>
    <h4 style={styles.planName}>{name}</h4>
    <h3 style={styles.planPriceValue}>{price}</h3>
    <p style={styles.planPeriod}>{period}</p>
    <p style={styles.planDesc}>{description}</p>
    
    <ul style={styles.planFeatures}>
      {features.map((feature, idx) => (
        <li key={idx} style={styles.planFeature}>
          ● {feature}
        </li>
      ))}
    </ul>
    
    <button onClick={onBuy} style={styles.planButton}>
      COMPRAR AGORA
    </button>
  </div>
);

// Estilos
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    color: '#2C3E50',
  },
  
  // Header
  header: {
    backgroundColor: '#1A2332',
    padding: '20px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {},
  logoText: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  logoSmart: {
    color: '#F7DC6F',
    fontStyle: 'italic',
  },
  nav: {
    display: 'flex',
    gap: '15px',
  },
  navButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  lojistaButton: {
    backgroundColor: '#5DADE2',
    color: 'white',
  },
  consultorButton: {
    backgroundColor: '#F7DC6F',
    color: '#2C3E50',
  },
  clienteButton: {
    backgroundColor: 'white',
    color: '#2C3E50',
  },
  loginButton: {
    backgroundColor: '#34495E',
    color: 'white',
  },
  
  // Hero
  hero: {
    width: '100%',
    padding: '0',
    margin: '0',
    backgroundColor: '#A8E6CF',
  },
  heroBannerImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    maxWidth: '100%',
  },
  
  // Seção de Benefícios (Imagem Completa)
  beneficiosImageSection: {
    width: '100%',
    backgroundColor: 'white',
    padding: '40px 0',
    margin: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beneficiosImage: {
    width: '90%',
    maxWidth: '1400px',
    height: 'auto',
    display: 'block',
  },
  
  // Sections
  section: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#1A2332',
  },
  sectionSubtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '50px',
    color: '#34495E',
  },
  
  // Features
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
  
  // Reasons
  reasons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '40px',
  },
  reasonCard: {
    padding: '25px 40px',
    borderRadius: '50px',
    color: 'white',
  },
  reasonText: {
    fontSize: '1.05rem',
    margin: 0,
  },
  
  // Offerings
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
  },
  
  // Benefits
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '25px',
    marginTop: '50px',
  },
  benefitCard: {
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  benefitIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  benefitTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1A2332',
    marginBottom: '15px',
  },
  benefitDescription: {
    fontSize: '1rem',
    color: '#34495E',
    lineHeight: 1.6,
  },
  
  // Consultor Benefits
  consultorBenefits: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '40px',
    marginTop: '50px',
  },
  consultorBenefit: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#2C5AA0',
    borderRadius: '15px',
    color: 'white',
  },
  consultorBenefitIcon: {
    marginBottom: '20px',
  },
  consultorBenefitTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  consultorBenefitDescription: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  
  // Plans
  planContainer: {
    marginBottom: '60px',
  },
  planCategory: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C5AA0',
    marginBottom: '30px',
  },
  clientePlan: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#5DADE2',
    borderRadius: '20px',
    textAlign: 'center',
    color: 'white',
  },
  consultorPlan: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#5B5B5B',
    borderRadius: '20px',
    textAlign: 'center',
    color: 'white',
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
  },
  planCard: {
    padding: '35px 25px',
    borderRadius: '20px',
    color: 'white',
    transition: 'all 0.3s',
  },
  planName: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#5DADE2',
  },
  planPriceValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0',
  },
  planPeriod: {
    fontSize: '0.9rem',
    marginBottom: '20px',
    color: '#F7DC6F',
  },
  planDesc: {
    fontSize: '0.95rem',
    marginBottom: '25px',
    lineHeight: 1.5,
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px',
  },
  planFeature: {
    fontSize: '0.9rem',
    marginBottom: '12px',
    paddingLeft: '10px',
  },
  planButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#5DADE2',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
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
    color: '#F7DC6F',
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