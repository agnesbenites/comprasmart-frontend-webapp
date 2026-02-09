import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Institucional = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funções para calcular estilos responsivos
  const getHeroStyles = () => {
    const base = S.hero;
    if (windowWidth >= 768) {
      return { ...base, gridTemplateColumns: '1fr 1fr' };
    }
    if (windowWidth <= 480) {
      return { ...base, padding: '20px 24px', gap: '32px' };
    }
    return base;
  };

  const getTextContainerStyles = () => {
    const base = S.textContainer;
    if (windowWidth >= 768) {
      return { ...base, margin: '0', textAlign: 'left' };
    }
    return base;
  };

  const getTitleStyles = () => {
    const base = S.title;
    if (windowWidth >= 1024) {
      return { ...base, fontSize: '52px' };
    }
    if (windowWidth >= 768) {
      return { ...base, fontSize: '48px' };
    }
    if (windowWidth <= 480) {
      return { ...base, fontSize: '32px' };
    }
    return base;
  };

  const getNavbarStyles = () => {
    const base = S.navbar;
    if (windowWidth <= 480) {
      return { ...base, padding: '20px 24px' };
    }
    return base;
  };

  const getParagraphStyles = () => {
    const base = S.paragraph;
    if (windowWidth <= 480) {
      return { ...base, fontSize: '16px' };
    }
    return base;
  };

  return (
    <div style={S.page}>
      {/* NAVBAR ESCURA */}
      <nav style={getNavbarStyles()}>
        <span style={S.logo}>
          Kaslee
        </span>

        <div style={S.navButtons}>
          <Link
            to="/"
            style={S.navHome}
            className="institucional-navHome"
          >
            Home
          </Link>

          <Link
            to="/login"
            style={S.navLogin}
            className="institucional-navLogin"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO INVERTIDO */}
      <section style={getHeroStyles()} className="institucional-hero">
        {/* LOGO GIGANTE */}
        <div style={S.logoContainer}>
          <img
            src="/img/Logo Institucional escura.png"
            alt="Kaslee"
            style={S.bigLogo}
            onError={e => { 
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.innerHTML = '<span style="color: #0accbd; font-size: 42px; font-weight: 800; font-family: Poppins, sans-serif;">Kaslee</span>';
              e.target.parentElement.appendChild(fallback);
            }}
          />
        </div>

        {/* TEXTO HERO */}
        <div style={getTextContainerStyles()} className="institucional-text">
          <h1 style={getTitleStyles()} className="institucional-title">
            Sobre a Kaslee
          </h1>

          <p style={getParagraphStyles()} className="institucional-paragraph">
            Conectamos lojas, consultores e clientes através de uma nova forma de vender no varejo.
          </p>

          <p style={getParagraphStyles()} className="institucional-paragraph">
            Nosso foco é escalar negócios com inteligência, simplicidade
            e uma experiência que realmente gera conversão.
          </p>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section style={S.content}>

        {/* O PROBLEMA */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Um problema real do varejo moderno</h2>
          <p style={S.text}>
            O varejo enfrenta desafios atuais: produtos parados em estoque e dificuldade em escalar vendas sem aumentar custos fixos. Ao mesmo tempo, existem profissionais capacitados em vendas, relacionamento e produtos que não encontram uma forma estruturada e segura de monetizar esse conhecimento.
          </p>
          <p style={S.text}>
            Grandes redes estão reduzindo lojas físicas, pois muito da receita vem de e-commerces — mas as taxas são altas, e o atendimento online não supre as necessidades do consumidor que busca algo mais específico, como um perfume, por exemplo.
          </p>
          <p style={S.text}>
            A busca por trabalhos com jornada flexível e sem vínculo cresceu nos últimos anos, mas fez com que o varejo sentisse dificuldades reais de contratação.
          </p>
          <p style={S.text}>
            Esses são os problemas que foram visualizados pela Kaslee. A plataforma busca, de maneira prática e fácil, solucionar e impulsionar as vendas do varejo, tanto das lojas físicas quanto do virtual.
          </p>
        </div>

        {/* A SOLUÇÃO */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Como a Kaslee funciona</h2>
          <p style={S.text}>
            A Kaslee é uma plataforma digital que conecta lojas a consultores independentes.
          </p>
          <p style={S.text}>
            <strong style={{ color: '#0accbd' }}>O que são os Consultores Independentes?</strong> São profissionais da área de vendas, que possuem perícia e experiência vendendo os segmentos que escolhem, como eletrodomésticos, moda, papelaria, eletrônicos, brinquedos, entre outros.
          </p>
          <p style={S.text}>
            <strong style={{ color: '#0accbd' }}>Como funciona?</strong> As lojas cadastram seus produtos, definem preços, comissões e regras de venda. Em contrapartida, os consultores escolhem os produtos que dominam, divulgam e atendem clientes online.
          </p>
          <p style={S.text}>
            Toda a jornada — do contato ao pagamento — acontece dentro da plataforma, com controle total para o lojista e pagamento automático para todas as partes envolvidas.
          </p>
        </div>

        {/* MISSÃO, VISÃO E VALORES — 3 COLUNAS */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Missão, Visão e Valores</h2>
          <div style={S.mvvGrid}>
            <div style={S.mvvCard}>
              <h3 style={S.mvvLabel}>Missão</h3>
              <p style={S.mvvText}>
                Expandir as vendas do varejo conectando pessoas, conhecimento e tecnologia, sem aumentar custos fixos.
              </p>
            </div>
            <div style={S.mvvCard}>
              <h3 style={S.mvvLabel}>Visão</h3>
              <p style={S.mvvText}>
                Ser a principal plataforma de vendas assistidas do varejo, criando um novo modelo de trabalho e crescimento sustentável.
              </p>
            </div>
            <div style={S.mvvCard}>
              <h3 style={S.mvvLabel}>Valores</h3>
              <p style={S.mvvText}>
                Transparência em todas as transações. Respeito às pessoas e ao conhecimento. Crescimento sustentável. Tecnologia a serviço do relacionamento humano. Garantir que empreendedores e lojistas foquem em seus negócios.
              </p>
            </div>
          </div>
        </div>

        {/* SEGURANÇA */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Segurança, transparência e controle</h2>
          <p style={S.text}>
            Todas as transações financeiras da Kaslee são processadas pela Stripe, empresa já consolidada no mercado nacional e internacional, garantindo segurança e rastreabilidade.
          </p>
          <p style={S.text}>
            Lojistas mantêm total controle sobre preços, comissões e produtos, enquanto consultores recebem suas comissões de forma automática e transparente.
          </p>
          <p style={S.text}>
            Todos os envolvidos no processo de venda conseguem acompanhar em tempo real: finalização do carrinho, pagamento realizado pelo cliente, separação dos produtos, e se foi retirado ou entregue.
          </p>
        </div>

        {/* POR QUE USAR A KASLEE */}
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Por que usar a Kaslee?</h2>
          <p style={S.text}>
            Não somos um ERP, nem mesmo um e-commerce. Nosso foco é atendimento e conexão entre clientes que realmente têm interesse nos produtos, que precisam de mais informações, que precisam de um atendimento especializado e humano.
          </p>
          <p style={S.text}>
            Contamos com muita tecnologia, suporte de IA por toda a plataforma, além de garantir a segurança dos dados de todos os envolvidos nas operações.
          </p>
          <p style={S.text}>
            A Kaslee veio para revolucionar o mercado. Fazemos integração com outros softwares, queremos que o varejo venda mais, que os consumidores se sintam seguros na aquisição dos produtos, além de fomentar o mercado de trabalho com pessoas capacitadas e profissionais da área de vendas.
          </p>
          <p style={S.text}>
            Nosso compromisso é com o desenvolvimento e a tecnologia tem muito a acrescentar. Contamos com uma área de treinamentos que podem ser realizados por todos os usuários, além da gamificação para deixar os vendedores ainda mais craques com a nossa <strong style={{ color: '#0accbd' }}>"Arena de Vendas"</strong>.
          </p>
        </div>

        {/* CTA DISCRETO */}
        <div style={S.ctaSection}>
          <p style={S.ctaText}>
            Quer entender como a Kaslee pode funcionar para o seu negócio?
          </p>
          <button style={S.ctaButton} onClick={() => navigate('/onboarding')} className="institucional-ctaButton">
            Conhecer a plataforma
          </button>
        </div>

      </section>

      {/* FOOTER DISCRETO */}
      <footer style={S.footer}>
        <div style={S.footerContent}>
          <p style={S.footerText}>© 2026 Kaslee. Todos os direitos reservados.</p>
          <div style={S.footerLinks}>
            <a href="/termos" style={S.footerLink} className="institucional-footerLink">Termos</a>
            <span style={S.separator}>•</span>
            <a href="/privacidade" style={S.footerLink} className="institucional-footerLink">Privacidade</a>
            <span style={S.separator}>•</span>
            <a href="mailto:contato@kaslee.com" style={S.footerLink} className="institucional-footerLink">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const S = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  navbar: {
    width: '100%',
    padding: '24px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(201, 247, 166, 0.1)',
  },

  logo: {
    color: '#0accbd',
    fontWeight: '700',
    fontSize: '24px',
    letterSpacing: '-0.5px',
  },

  navButtons: {
    display: 'flex',
    gap: '16px',
  },

  navHome: {
    padding: '10px 20px',
    border: '2px solid #0accbd',
    color: '#0accbd',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },

  navLogin: {
    padding: '10px 20px',
    backgroundColor: '#bb25a6',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },

  hero: {
    minHeight: 'calc(100vh - 80px)',
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    padding: '40px',
    gap: '48px',
    borderBottom: '1px solid rgba(201, 247, 166, 0.1)',
  },

  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigLogo: {
    width: '100%',
    maxWidth: '520px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 40px rgba(201, 247, 166, 0.3))',
  },

  textContainer: {
    maxWidth: '640px',
    margin: '0 auto',
    textAlign: 'center',
  },

  title: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#0accbd',
    marginBottom: '24px',
    lineHeight: '1.2',
    letterSpacing: '-1px',
  },

  paragraph: {
    fontSize: '18px',
    color: '#d1d5db',
    lineHeight: '1.7',
    marginBottom: '20px',
  },

  // CONTEÚDO
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '80px 24px',
  },

  section: {
    marginBottom: '80px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0accbd',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '20px',
  },

  // MISSÃO VISÃO VALORES — 3 COLUNAS
  mvvGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginTop: '24px',
  },
  mvvCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(201, 247, 166, 0.15)',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
  },
  mvvLabel: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0accbd',
    marginBottom: '14px',
    letterSpacing: '-0.3px',
  },
  mvvText: {
    fontSize: '15px',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.75)',
  },

  // CTA
  ctaSection: {
    marginTop: '80px',
    paddingTop: '40px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center',
  },
  ctaText: {
    fontSize: '18px',
    color: '#fff',
    marginBottom: '24px',
  },
  ctaButton: {
    background: '#0accbd',
    color: '#000',
    border: 'none',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 600,
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease',
  },

  // FOOTER - discreto
  footer: {
    background: '#000',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '48px 24px',
  },
  footerContent: {
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '12px',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },
  footerLink: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  separator: {
    color: 'rgba(255,255,255,0.3)',
  },
};

// Estilos CSS adicionais para hover e responsividade
const styles = `
  .institucional-navHome:hover {
    background-color: #0accbd;
    color: #000;
  }

  .institucional-navLogin:hover {
    opacity: 0.9;
  }

  .institucional-ctaButton:hover {
    opacity: 0.9;
  }

  .institucional-footerLink:hover {
    color: #0accbd;
  }

  @media (min-width: 768px) {
    .institucional-hero {
      grid-template-columns: 1fr 1fr !important;
    }
    
    .institucional-text {
      text-align: left !important;
      margin: 0 !important;
    }
    
    .institucional-title {
      font-size: 48px !important;
    }
  }

  @media (min-width: 1024px) {
    .institucional-title {
      font-size: 52px !important;
    }
  }

  @media (max-width: 480px) {
    .institucional-navbar {
      padding: 20px 24px !important;
    }
    
    .institucional-hero {
      padding: 20px 24px !important;
      gap: 32px !important;
    }
    
    .institucional-title {
      font-size: 32px !important;
    }
    
    .institucional-paragraph {
      font-size: 16px !important;
    }
  }
`;

// Adicionando estilos ao documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Institucional;