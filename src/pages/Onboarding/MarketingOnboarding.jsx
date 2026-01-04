// src/pages/Onboarding/MarketingOnboarding.jsx
// VERSÃO COM BACKGROUNDS E TEXTO REFORMULADO

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketingOnboarding = () => {
  const [slideAtual, setSlideAtual] = useState(0);
  const [faturamentoEstimado, setFaturamentoEstimado] = useState('');
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      icon: '🚀',
      title: 'Não Substituímos Nada',
      subtitle: 'Somos o Complemento Perfeito do Seu Negócio',
      description: 'Seu sistema de gestão continua fazendo o que faz de melhor. A gente entra só com vendedores autônomos sob demanda - quando você precisa, sem custo fixo.',
      benefits: [
        '✅ Plug & Play com seu sistema atual',
        '✅ Consultores autônomos especializados quando você precisa',
        '✅ 15 minutos de correção livre após cadastro',
        '✅ Zero compromisso de contratação CLT'
      ],
      color: '#3b82f6',
      badge: 'TODOS OS PLANOS',
      // ✅ NOVO - Background personalizado
      backgroundImage: '/img/onboarding/slide1-complemento.jpg',
      backgroundOverlay: 'rgba(59, 130, 246, 0.85)' // Azul com transparência
    },
    {
      icon: '⏰',
      title: 'Modelo de Economia Colaborativa',
      subtitle: 'Profissionais Sob Demanda, Como Apps de Entrega',
      description: 'Assim como apps de transporte e entrega revolucionaram seus mercados, aplicamos o mesmo modelo às vendas: profissionais autônomos atendem seus clientes quando seu time está ocupado.',
      benefits: [
        '✅ SLA de 5 minutos para overflow (Plano Pro)',
        '✅ Rede de consultores prontos para atender',
        '✅ Você paga apenas pelas vendas concretizadas',
        '✅ Sem custo fixo de folha de pagamento'
      ],
      color: '#10b981',
      badge: 'PLANO PRO',
      backgroundImage: '/img/onboarding/slide2-overflow.jpg',
      backgroundOverlay: 'rgba(16, 185, 129, 0.85)'
    },
    {
      icon: '💰',
      title: 'Gire Estoque Parado em Dinheiro',
      subtitle: 'BI Identifica, Consultores Vendem',
      description: 'Produtos parados há 60+ dias viram missões de venda com comissão turbinada. Nossa inteligência detecta automaticamente e mobiliza consultores especializados para escoar.',
      benefits: [
        '✅ Dashboard identifica itens sem giro',
        '✅ Comissão extra motiva venda rápida',
        '✅ ROI calculado em tempo real',
        '✅ Seu capital volta a circular'
      ],
      color: '#f59e0b',
      badge: 'PLANO ENTERPRISE',
      backgroundImage: '/img/onboarding/slide3-estoque.jpg',
      backgroundOverlay: 'rgba(245, 158, 11, 0.85)'
    },
    {
      icon: '📊',
      title: 'Comissão Inteligente e Justa',
      subtitle: 'Quanto Maior a Venda, Maior o Incentivo',
      description: 'Sistema escalonado que recompensa vendas mais técnicas e de maior ticket, motivando consultores a se especializarem e fecharem negócios complexos.',
      benefits: [
        '✅ Até R$ 200: 5% (Giro Rápido)',
        '✅ R$ 201 a R$ 800: 10% (Venda Assistida)',
        '✅ R$ 801 a R$ 2.000: 15% (Venda Técnica)',
        '✅ Acima de R$ 2.000: 20% (Venda VIP)'
      ],
      color: '#8b5cf6',
      badge: 'COMISSÃO DINÂMICA',
      backgroundImage: '/img/onboarding/slide4-comissao.jpg',
      backgroundOverlay: 'rgba(139, 92, 246, 0.85)'
    },
    {
      icon: '🎯',
      title: 'Simule Seu Retorno',
      subtitle: 'Quanto Você Perde Por Não Ter Overflow?',
      description: 'Estudos mostram que 30% das vendas são perdidas por demora no atendimento ou equipe sobrecarregada. Calcule quanto isso representa no seu faturamento.',
      benefits: [],
      color: '#ef4444',
      badge: 'SIMULE SEU GANHO',
      backgroundImage: '/img/onboarding/slide5-roi.jpg',
      backgroundOverlay: 'rgba(239, 68, 68, 0.85)'
    }
  ];

  const slideAtualData = slides[slideAtual];

  useEffect(() => {
    if (slideAtual === 4) {
      setMostrarCalculadora(true);
    }
  }, [slideAtual]);

  const proximoSlide = () => {
    if (slideAtual < slides.length - 1) {
      setSlideAtual(slideAtual + 1);
    } else {
      handleComecar();
    }
  };

  const slideAnterior = () => {
    if (slideAtual > 0) {
      setSlideAtual(slideAtual - 1);
    }
  };

  const handleComecar = () => {
    localStorage.setItem('faturamentoEstimado', faturamentoEstimado);
    navigate('/cadastro/lojista');
  };

  const calcularROI = () => {
    const faturamento = parseFloat(faturamentoEstimado.replace(/\D/g, '')) || 0;
    const receitaRecuperada = faturamento * 0.3;

    return {
      receitaRecuperada,
      roiBasic: (receitaRecuperada / 50).toFixed(1),
      roiPro: (receitaRecuperada / 150).toFixed(1),
      roiEnterprise: (receitaRecuperada / 360).toFixed(1),
    };
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const handleInputFaturamento = (e) => {
    const valor = e.target.value.replace(/\D/g, '');
    setFaturamentoEstimado(valor);
  };

  const roi = calcularROI();

  return (
    <div style={{
      ...styles.container,
      // ✅ NOVO - Background com imagem
      backgroundImage: `linear-gradient(${slideAtualData.backgroundOverlay}, ${slideAtualData.backgroundOverlay}), url('${slideAtualData.backgroundImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Barra de progresso */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.progressSegment,
                backgroundColor: index <= slideAtual ? slideAtualData.color : '#e5e7eb',
              }}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div style={styles.content}>
        {/* Badge */}
        <div style={{
          ...styles.badge,
          backgroundColor: slideAtualData.color,
        }}>
          {slideAtualData.badge}
        </div>

        {/* Ícone */}
        <div style={styles.iconContainer}>
          <span style={styles.icon}>{slideAtualData.icon}</span>
        </div>

        {/* Título */}
        <h1 style={styles.title}>{slideAtualData.title}</h1>
        <h2 style={styles.subtitle}>{slideAtualData.subtitle}</h2>

        {/* Descrição */}
        <p style={styles.description}>{slideAtualData.description}</p>

        {/* Benefits ou Calculadora */}
        {slideAtual === 4 && mostrarCalculadora ? (
          <div style={styles.calculadoraContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>💰 Faturamento Mensal Estimado:</label>
              <input
                type="text"
                value={formatarMoeda(parseFloat(faturamentoEstimado) || 0)}
                onChange={handleInputFaturamento}
                placeholder="R$ 0,00"
                style={styles.input}
              />
            </div>

            {faturamentoEstimado && (
              <div style={styles.roiCards}>
                <div style={styles.roiCard}>
                  <div style={styles.roiPlanName}>BASIC</div>
                  <div style={styles.roiValue}>R$ 50/mês</div>
                  <div style={styles.roiMultiplier}>ROI: {roi.roiBasic}x</div>
                  <div style={styles.roiRecuperado}>
                    Recupera: {formatarMoeda(roi.receitaRecuperada)}
                  </div>
                </div>

                <div style={{...styles.roiCard, ...styles.roiCardDestaque}}>
                  <div style={styles.roiBadge}>MAIS POPULAR</div>
                  <div style={styles.roiPlanName}>PRO</div>
                  <div style={styles.roiValue}>R$ 150/mês</div>
                  <div style={styles.roiMultiplier}>ROI: {roi.roiPro}x</div>
                  <div style={styles.roiRecuperado}>
                    Recupera: {formatarMoeda(roi.receitaRecuperada)}
                  </div>
                </div>

                <div style={styles.roiCard}>
                  <div style={styles.roiPlanName}>ENTERPRISE</div>
                  <div style={styles.roiValue}>R$ 360/mês</div>
                  <div style={styles.roiMultiplier}>ROI: {roi.roiEnterprise}x</div>
                  <div style={styles.roiRecuperado}>
                    Recupera: {formatarMoeda(roi.receitaRecuperada)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ul style={styles.benefitsList}>
            {slideAtualData.benefits.map((benefit, index) => (
              <li key={index} style={styles.benefitItem}>
                {benefit}
              </li>
            ))}
          </ul>
        )}

        {/* Navegação */}
        <div style={styles.navigation}>
          {slideAtual > 0 && (
            <button onClick={slideAnterior} style={styles.buttonSecondary}>
              ← Voltar
            </button>
          )}

          <button
            onClick={proximoSlide}
            style={{
              ...styles.buttonPrimary,
              backgroundColor: slideAtualData.color,
            }}
          >
            {slideAtual === slides.length - 1 ? '🚀 Começar Agora' : 'Próximo →'}
          </button>
        </div>

        {/* Contador de slides */}
        <div style={styles.slideCounter}>
          {slideAtual + 1} / {slides.length}
        </div>

        {/* Botão pular */}
        <button onClick={handleComecar} style={styles.skipButton}>
          Pular introdução →
        </button>

        {/* Tagline */}
        <div style={styles.tagline}>
          🚚 O Uber das Vendas: Atendimento Humanizado Sob Demanda
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    transition: 'background 0.6s ease-in-out',
    position: 'relative',
  },
  
  progressContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: '20px',
    zIndex: 10,
  },
  
  progressBar: {
    display: 'flex',
    gap: '8px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  progressSegment: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  
  content: {
    maxWidth: '700px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '50px 40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  
  badge: {
    display: 'inline-block',
    padding: '8px 20px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  
  iconContainer: {
    marginBottom: '20px',
  },
  
  icon: {
    fontSize: '4rem',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '10px',
    lineHeight: '1.2',
  },
  
  subtitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '20px',
  },
  
  description: {
    fontSize: '1.1rem',
    color: '#475569',
    lineHeight: '1.8',
    marginBottom: '30px',
  },
  
  benefitsList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '40px',
    textAlign: 'left',
  },
  
  benefitItem: {
    fontSize: '1.05rem',
    color: '#334155',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0',
    lineHeight: '1.6',
  },
  
  calculadoraContainer: {
    marginBottom: '40px',
  },
  
  inputGroup: {
    marginBottom: '30px',
  },
  
  label: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '10px',
  },
  
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '1.3rem',
    fontWeight: '700',
    textAlign: 'center',
    border: '3px solid #3b82f6',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s',
  },
  
  roiCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  
  roiCard: {
    backgroundColor: '#f8fafc',
    padding: '24px 20px',
    borderRadius: '16px',
    border: '2px solid #e2e8f0',
    position: 'relative',
  },
  
  roiCardDestaque: {
    backgroundColor: '#eff6ff',
    border: '3px solid #3b82f6',
    transform: 'scale(1.05)',
  },
  
  roiBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '700',
  },
  
  roiPlanName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '8px',
  },
  
  roiValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
  },
  
  roiMultiplier: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#3b82f6',
    marginBottom: '8px',
  },
  
  roiRecuperado: {
    fontSize: '0.9rem',
    color: '#10b981',
    fontWeight: '600',
  },
  
  navigation: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  
  buttonPrimary: {
    padding: '16px 40px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  
  buttonSecondary: {
    padding: '16px 40px',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  
  slideCounter: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '15px',
  },
  
  skipButton: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '0.95rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginBottom: '20px',
  },
  
  tagline: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
};

export default MarketingOnboarding;