// app-frontend/src/pages/Landingpage.jsx
// Landing Page Compra Smart - SEM ODOO

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaStore, FaUserTie, FaShoppingCart, FaChartLine, 
  FaUsers, FaBox, FaBullhorn, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaDollarSign, FaRocket,
  FaMobileAlt, FaDesktop, FaRegCheckCircle
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
    display: 'flex',
    flexDirection: 'column',
    minHeight: '600px'
  }}>
    <h4 style={styles.planName}>{name}</h4>
    <h3 style={styles.planPriceValue}>{price}</h3>
    <p style={styles.planPeriod}>{period}</p>
    <p style={styles.planDesc}>{description}</p>
    
    <ul style={{...styles.planFeatures, flexGrow: 1}}>
      {features.map((feature, idx) => (
        <li key={idx} style={styles.planFeature}>
          <FaRegCheckCircle color="#F4D03F" size={14} style={{marginRight: 5}}/> {feature}
        </li>
      ))}
    </ul>
    
    <button onClick={onBuy} style={{
      ...styles.planButton, 
      backgroundColor: highlighted ? '#F4D03F' : '#5DADE2', 
      color: highlighted ? '#1A2332' : 'white',
      marginTop: 'auto'
    }}>
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
            <img 
              src="/img/logo.png" 
              alt="Compra Smart Logo" 
              style={styles.logoImage}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div style="font-size: 24px; font-weight: bold; color: #F4D03F;">COMPRA SMART</div>';
              }}
            />
          </div>
          <nav style={styles.nav}>
            <a href="#como-funciona" style={styles.navLink}>Como Funciona</a>
            <a href="#beneficios" style={styles.navLink}>Benefícios</a>
            <a href="#planos" style={styles.navLink}>Planos</a>
            <button 
              onClick={() => navigate('/quiz')} 
              style={{
                ...styles.navButton,
                backgroundColor: '#3b82f6',
                marginRight: '10px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              🎯 Descubra Seu Plano
            </button>
            <button onClick={() => navigate('/cadastro')} style={styles.navButton}>
              Começar Grátis
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Venda Mais com Consultores Autônomos Online
            </h1>
            <p style={styles.heroSubtitle}>
              A plataforma que conecta sua loja a consultores especializados, aumentando vendas sem aumentar custos fixos
            </p>
            <div style={styles.heroCTAs}>
              <button 
                onClick={() => navigate('/cadastro')} 
                style={styles.heroCTAPrimary}
              >
                <FaRocket style={{marginRight: 8}} />
                Começar Agora Grátis
              </button>
              <button 
                onClick={scrollToPlanos} 
                style={styles.heroCTASecondary}
              >
                Ver Planos e Preços
              </button>
            </div>
            
            {/* TRUST BADGES */}
            <div style={styles.trustBadges}>
              <div style={styles.badge}>
                <FaCheckCircle color="#27AE60" size={20} />
                <span>Sem taxa de setup</span>
              </div>
              <div style={styles.badge}>
                <FaCheckCircle color="#27AE60" size={20} />
                <span>Cancele quando quiser</span>
              </div>
              <div style={styles.badge}>
                <FaCheckCircle color="#27AE60" size={20} />
                <span>Suporte dedicado</span>
              </div>
            </div>
          </div>
          
          <div style={styles.heroImage}>
            <img 
              src="/img/hero-consultora.png" 
              alt="Consultora Vendendo" 
              style={styles.heroImgElement}
              onError={(e) => {
                e.target.src = '/img/hero-fallback.png';
                e.target.onerror = null;
              }}
            />
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section style={styles.numbers}>
        <div style={styles.numberCard}>
          <h2 style={styles.numberValue}>+30%</h2>
          <p style={styles.numberLabel}>Aumento médio em vendas</p>
        </div>
        <div style={styles.numberCard}>
          <h2 style={styles.numberValue}>Zero</h2>
          <p style={styles.numberLabel}>Custos com folha de pagamento</p>
        </div>
        <div style={styles.numberCard}>
          <h2 style={styles.numberValue}>24/7</h2>
          <p style={styles.numberLabel}>Vendedores ativos online</p>
        </div>
        <div style={styles.numberCard}>
          <h2 style={styles.numberValue}>10min</h2>
          <p style={styles.numberLabel}>Para começar a vender</p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={styles.section}>
        <h2 style={styles.sectionTitle}>Como Funciona</h2>
        <p style={styles.sectionSubtitle}>
          Simples, rápido e sem complicação
        </p>
        
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <FaStore size={40} color="#F4D03F" />
            <h3 style={styles.stepTitle}>Você Cadastra Produtos</h3>
            <p style={styles.stepDesc}>
              Adicione os produtos da sua loja na plataforma com fotos, preços e descrições
            </p>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <FaUserTie size={40} color="#F4D03F" />
            <h3 style={styles.stepTitle}>Consultores Divulgam</h3>
            <p style={styles.stepDesc}>
              Profissionais autônomos promovem seus produtos para clientes qualificados
            </p>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <FaShoppingCart size={40} color="#F4D03F" />
            <h3 style={styles.stepTitle}>Cliente Compra</h3>
            <p style={styles.stepDesc}>
              Venda finalizada com segurança. Cliente pode retirar na loja ou receber em casa
            </p>
          </div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>4</div>
            <FaMoneyBillWave size={40} color="#F4D03F" />
            <h3 style={styles.stepTitle}>Você Recebe</h3>
            <p style={styles.stepDesc}>
              Pagamento processado automaticamente. Consultor recebe comissão, você recebe o lucro
            </p>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section style={styles.forWhoSection}>
        <h2 style={styles.sectionTitle}>Para Quem é a Compra Smart?</h2>
        
        <div style={styles.offeringsGrid}>
          <OfferingCard 
            title="Lojistas"
            icon={<FaStore size={40} color="#1A2332" />}
            color="#F4D03F"
            features={[
              'Aumente vendas sem contratar',
              'Gerencie estoque e pedidos',
              'Acompanhe consultores e comissões',
              'Relatórios de desempenho'
            ]}
          />
          
          <OfferingCard 
            title="Consultores"
            icon={<FaUserTie size={40} color="#1A2332" />}
            color="#5DADE2"
            features={[
              'Trabalhe de onde quiser',
              'Escolha seus horários',
              'Ganhe comissões generosas',
              'Acesso a produtos de qualidade'
            ]}
          />
          
          <OfferingCard 
            title="Clientes"
            icon={<FaShoppingCart size={40} color="#1A2332" />}
            color="#27AE60"
            features={[
              'Atendimento personalizado',
              'Consultoria especializada',
              'Compre de casa ou na loja',
              'Produtos selecionados'
            ]}
          />
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" style={styles.section}>
        <h2 style={styles.sectionTitle}>Por Que Escolher a Compra Smart?</h2>
        
        <div style={styles.benefitsGrid}>
          <div style={styles.benefitCard}>
            <FaDollarSign size={50} color="#27AE60" />
            <h3 style={styles.benefitTitle}>Sem Custos Fixos</h3>
            <p style={styles.benefitDesc}>
              Pague apenas comissões sobre vendas realizadas. Zero folha de pagamento.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <FaClock size={50} color="#5DADE2" />
            <h3 style={styles.benefitTitle}>Venda 24/7</h3>
            <p style={styles.benefitDesc}>
              Consultores trabalham em horários diversos, sua loja vende o tempo todo.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <FaChartLine size={50} color="#F4D03F" />
            <h3 style={styles.benefitTitle}>Alcance Expandido</h3>
            <p style={styles.benefitDesc}>
              Chegue a novos clientes que seus consultores já conhecem e confiam.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <FaMobileAlt size={50} color="#E74C3C" />
            <h3 style={styles.benefitTitle}>100% Digital</h3>
            <p style={styles.benefitDesc}>
              Plataforma web e mobile. Gerencie tudo pelo celular ou computador.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <FaBox size={50} color="#8E44AD" />
            <h3 style={styles.benefitTitle}>Controle Total</h3>
            <p style={styles.benefitDesc}>
              Defina preços, comissões, e gerencie seu estoque em tempo real.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <FaUsers size={50} color="#E67E22" />
            <h3 style={styles.benefitTitle}>Rede de Consultores</h3>
            <p style={styles.benefitDesc}>
              Acesso a profissionais qualificados prontos para vender seus produtos.
            </p>
          </div>
        </div>
      </section>

      {/* PLANOS E PREÇOS */}
      <section id="planos" style={styles.plansSection}>
        <h2 style={styles.sectionTitle}>Escolha Seu Plano</h2>
        <p style={styles.sectionSubtitle}>
          Comece grátis e evolua conforme sua loja cresce
        </p>
        
        <div style={styles.plansGrid}>
          <PlanCard 
            name="Básico"
            price="R$ 99,90"
            period="por mês"
            description="Ideal para começar"
            color="#34495E"
            features={[
              'Até 100 produtos',
              'Até 5 consultores',
              'Dashboard básico',
              'Chat com clientes',
              'Suporte por email',
              'Comissões configuráveis'
            ]}
            onBuy={() => handleStripeCheckout(STRIPE_URLS.BASICO)}
          />

          <PlanCard 
            name="Pro"
            price="R$ 199,90"
            period="por mês"
            description="Para lojas em crescimento"
            color="#1A2332"
            highlighted={true}
            features={[
              'Produtos ilimitados',
              'Consultores ilimitados',
              'Dashboard avançado',
              'Chat + videochamada',
              'Campanhas de marketing',
              'Múltiplas filiais',
              'Relatórios detalhados',
              'Suporte prioritário',
              'API de integração'
            ]}
            onBuy={() => handleStripeCheckout(STRIPE_URLS.PRO)}
          />
        </div>

        <div style={styles.plansFooter}>
          <p style={styles.plansFooterText}>
            🎁 <strong>30 dias grátis</strong> em todos os planos • 
            💳 Sem compromisso • 
            🚫 Cancele quando quiser
          </p>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>O Que Dizem Nossos Clientes</h2>
        
        <div style={styles.testimonialsGrid}>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>
              "Aumentamos nossas vendas em 40% no primeiro mês! Os consultores são incríveis e trouxeram clientes que nunca chegariam até nossa loja física."
            </p>
            <div style={styles.testimonialAuthor}>
              <strong>Maria Silva</strong> - Boutique Elegância
            </div>
          </div>

          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>
              "Como consultor, consigo trabalhar de casa e ganhar muito mais do que ganhava em loja. A plataforma é super fácil de usar!"
            </p>
            <div style={styles.testimonialAuthor}>
              <strong>João Santos</strong> - Consultor Premium
            </div>
          </div>

          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>
              "Adorei poder comprar com atendimento personalizado sem sair de casa. A consultora me ajudou a escolher o produto perfeito!"
            </p>
            <div style={styles.testimonialAuthor}>
              <strong>Ana Paula</strong> - Cliente Satisfeita
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={styles.finalCTA}>
        <h2 style={styles.finalCTATitle}>
          Pronto para Aumentar Suas Vendas?
        </h2>
        <p style={styles.finalCTASubtitle}>
          Comece grátis hoje e veja sua loja crescer
        </p>
        <div style={styles.finalCTAButtons}>
          <button 
            onClick={() => navigate('/cadastro')} 
            style={styles.finalCTAButton}
          >
            <FaRocket style={{marginRight: 8}} />
            Começar Agora Grátis
          </button>
          <button 
            onClick={scrollToPlanos} 
            style={styles.finalCTAButtonSecondary}
          >
            Ver Planos
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Compra Smart</h4>
            <p style={styles.footerText}>
              A plataforma que conecta lojas, consultores e clientes.
            </p>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Links Rápidos</h4>
            <a href="#como-funciona" style={styles.footerLink}>Como Funciona</a>
            <a href="#beneficios" style={styles.footerLink}>Benefícios</a>
            <a href="#planos" style={styles.footerLink}>Planos</a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Suporte</h4>
            <a href="/termos" style={styles.footerLink}>Termos de Uso</a>
            <a href="/privacidade" style={styles.footerLink}>Privacidade</a>
            <a href="mailto:contato@comprasmart.com.br" style={styles.footerLink}>
              Contato
            </a>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerBottomText}>
            © 2026 Compra Smart. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- ESTILOS ---

const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: '#1A2332',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
  },

  // HEADER
  header: {
    backgroundColor: '#1A2332',
    padding: '20px 40px',
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
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#F4D03F',
  },
  logoImage: {
    height: '50px',
    width: 'auto',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  navLink: {
    color: '#ECF0F1',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s',
    cursor: 'pointer',
  },
  navButton: {
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 10px rgba(244, 208, 63, 0.3)',
  },

  // HERO
  hero: {
    background: 'linear-gradient(135deg, #1A2332 0%, #34495E 100%)',
    padding: '80px 40px',
    color: 'white',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '900',
    lineHeight: '1.2',
    marginBottom: '20px',
    color: '#F4D03F',
  },
  heroSubtitle: {
    fontSize: '20px',
    lineHeight: '1.6',
    marginBottom: '40px',
    color: '#ECF0F1',
  },
  heroCTAs: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
  },
  heroCTAPrimary: {
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    border: 'none',
    padding: '18px 36px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 6px 20px rgba(244, 208, 63, 0.4)',
    transition: 'all 0.3s',
  },
  heroCTASecondary: {
    backgroundColor: 'transparent',
    color: '#F4D03F',
    border: '2px solid #F4D03F',
    padding: '18px 36px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  heroImage: {
    flex: 1,
  },
  heroImgElement: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  trustBadges: {
    display: 'flex',
    gap: '30px',
    marginTop: '30px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ECF0F1',
    fontSize: '14px',
  },

  // NÚMEROS
  numbers: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '-40px auto 80px',
    padding: '0 40px',
    gap: '20px',
    position: 'relative',
    zIndex: 10,
  },
  numberCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    flex: 1,
  },
  numberValue: {
    fontSize: '48px',
    fontWeight: '900',
    color: '#F4D03F',
    marginBottom: '10px',
  },
  numberLabel: {
    fontSize: '16px',
    color: '#7F8C8D',
  },

  // SECTIONS GERAIS
  section: {
    padding: '80px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '42px',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#1A2332',
  },
  sectionSubtitle: {
    fontSize: '18px',
    textAlign: 'center',
    color: '#7F8C8D',
    marginBottom: '60px',
  },

  // COMO FUNCIONA
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  },
  step: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#F8F9FA',
    borderRadius: '15px',
    position: 'relative',
  },
  stepNumber: {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '20px 0 10px',
    color: '#1A2332',
  },
  stepDesc: {
    fontSize: '16px',
    color: '#7F8C8D',
    lineHeight: '1.6',
  },

  // PARA QUEM É
  forWhoSection: {
    backgroundColor: '#F8F9FA',
    padding: '80px 40px',
  },
  offeringsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  offeringCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    border: '3px solid',
    textAlign: 'center',
  },
  offeringIcon: {
    marginBottom: '20px',
  },
  offeringTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1A2332',
  },
  offeringList: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'left',
  },
  offeringItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '16px',
    color: '#34495E',
  },

  // BENEFÍCIOS
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
  },
  benefitCard: {
    backgroundColor: '#F8F9FA',
    padding: '40px',
    borderRadius: '15px',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  benefitTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '20px 0 15px',
    color: '#1A2332',
  },
  benefitDesc: {
    fontSize: '16px',
    color: '#7F8C8D',
    lineHeight: '1.6',
  },

  // PLANOS
  plansSection: {
    backgroundColor: '#F8F9FA',
    padding: '80px 40px',
  },
  plansGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    maxWidth: '1000px',
    margin: '0 auto 40px',
    flexWrap: 'wrap',
  },
  planCard: {
    backgroundColor: '#1A2332',
    color: 'white',
    padding: '40px',
    borderRadius: '20px',
    width: '350px',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  planName: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  planPriceValue: {
    fontSize: '48px',
    fontWeight: '900',
    color: '#F4D03F',
    marginBottom: '5px',
  },
  planPeriod: {
    fontSize: '16px',
    color: '#BDC3C7',
    marginBottom: '20px',
  },
  planDesc: {
    fontSize: '16px',
    color: '#ECF0F1',
    marginBottom: '30px',
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px',
    textAlign: 'left',
  },
  planFeature: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '15px',
  },
  planButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  plansFooter: {
    textAlign: 'center',
    marginTop: '40px',
  },
  plansFooterText: {
    fontSize: '16px',
    color: '#7F8C8D',
  },

  // DEPOIMENTOS
  testimonialsSection: {
    padding: '80px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
  },
  testimonialCard: {
    backgroundColor: '#F8F9FA',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  testimonialText: {
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#34495E',
    lineHeight: '1.8',
    marginBottom: '20px',
  },
  testimonialAuthor: {
    fontSize: '14px',
    color: '#7F8C8D',
  },

  // CTA FINAL
  finalCTA: {
    background: 'linear-gradient(135deg, #1A2332 0%, #34495E 100%)',
    padding: '80px 40px',
    textAlign: 'center',
    color: 'white',
  },
  finalCTATitle: {
    fontSize: '42px',
    fontWeight: '800',
    marginBottom: '20px',
    color: '#F4D03F',
  },
  finalCTASubtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    color: '#ECF0F1',
  },
  finalCTAButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  finalCTAButton: {
    backgroundColor: '#F4D03F',
    color: '#1A2332',
    border: 'none',
    padding: '18px 36px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 6px 20px rgba(244, 208, 63, 0.4)',
  },
  finalCTAButtonSecondary: {
    backgroundColor: 'transparent',
    color: '#F4D03F',
    border: '2px solid #F4D03F',
    padding: '18px 36px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
  },

  // FOOTER
  footer: {
    backgroundColor: '#1A2332',
    color: '#ECF0F1',
    padding: '60px 40px 20px',
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
  },
  footerTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#F4D03F',
  },
  footerText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#BDC3C7',
  },
  footerLink: {
    color: '#BDC3C7',
    textDecoration: 'none',
    marginBottom: '10px',
    fontSize: '14px',
    transition: 'color 0.3s',
  },
  footerBottom: {
    borderTop: '1px solid #34495E',
    paddingTop: '20px',
    textAlign: 'center',
  },
  footerBottomText: {
    fontSize: '14px',
    color: '#95A5A6',
  },

  // UTILITY
  featureCard: {
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  featureText: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#1A2332',
  },
  reasonCard: {
    padding: '20px',
    color: 'white',
    marginBottom: '20px',
  },
  reasonText: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
  },
};

export default Landingpage;