// src/pages/Onboarding/MarketingOnboarding.jsx
// VERSÃO FINAL CORRETA - Planos + Addons

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketingOnboarding = () => {
  const [etapa, setEtapa] = useState('slides'); // 'slides', 'planos', 'addons'
  const [slideAtual, setSlideAtual] = useState(0);
  const [faturamentoEstimado, setFaturamentoEstimado] = useState('');
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const navigate = useNavigate();

  const slides = [
    {
      icon: '🚀',
      title: 'Não precisa de migração',
      subtitle: 'Somos o Complemento Perfeito do Seu Negócio',
      description: 'Seu sistema de gestão continua fazendo o que faz de melhor. A gente entra só com vendedores autônomos sob demanda - quando você precisa, sem custo fixo.',
      benefits: [
        '✅ Plug & Play com seu sistema atual',
        '✅ Consultores autônomos especializados quando você precisa',
        '✅ 15 minutos de correção livre após cadastro',
        '✅ Zero compromisso de contratação CLT'
      ],
      color: '#bb25a6',
      badge: 'TODOS OS PLANOS',
    },
    {
      icon: '⏰',
      title: 'Modelo de Economia Colaborativa',
      subtitle: 'Profissionais Sob Demanda',
      description: 'Assim como apps de transporte e entrega revolucionaram seus mercados, aplicamos o mesmo modelo às vendas: profissionais autônomos atendem seus clientes quando seu time está ocupado.',
      benefits: [
        '✅ SLA de 5 minutos para overflow (Plano Pro)',
        '✅ Rede de consultores prontos para atender',
        '✅ Você paga apenas pelas vendas concretizadas',
        '✅ Sem custo fixo de folha de pagamento'
      ],
      color: '#f53342',
      badge: 'PLANO PRO',
    },
    {
      icon: '💰',
      title: 'Transforme Estoque Parado em Dinheiro',
      subtitle: 'BI Identifica, Consultores Vendem',
      description: 'Produtos parados há 60+ dias viram missões de venda com comissão turbinada. Nossa inteligência detecta automaticamente e mobiliza consultores especializados para escoar.',
      benefits: [
        '✅ Dashboard identifica itens sem giro',
        '✅ Comissão extra motiva venda rápida',
        '✅ ROI calculado em tempo real',
        '✅ Seu capital volta a circular'
      ],
      color: '#bb25a6',
      badge: 'PLANO ENTERPRISE',
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
      color: '#2f0d51',
      badge: 'COMISSÃO DINÂMICA',
    },
    {
      icon: '🎯',
      title: 'Simule Seu Retorno',
      subtitle: 'Quanto Você Perde Por Não Ter Overflow?',
      description: 'Estudos mostram que 30% das vendas são perdidas por demora no atendimento ou equipe sobrecarregada. Calcule quanto isso representa no seu faturamento.',
      benefits: [],
      color: '#f53342',
      badge: 'SIMULE SEU GANHO',
      mostrarCalculadora: true,
    }
  ];

  // ✅ PLANOS 
  const planos = [
    {
      id: 'basic',
      nome: 'BÁSICO',
      preco: 99.90,
      descricao: 'Ideal para pequenos negócios',
      features: [
        '📦 Até 100 produtos',
        '👥 10 consultores disponíveis',
        '🏢 1 Filial + Matriz',
        '👤 5 vendedores',
        '⏰ Edição após 24h',
        '💬 Texto, áudio e imagens',
        '📊 Analytics mensal',
        '📍 Marketing: 5km',
        '📁 Atualização CSV'
      ],
      cor: '#1a0a2e',
      stripeUrl: 'https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01',
    },
    {
      id: 'pro',
      nome: 'PRO',
      preco: 199.90,
      descricao: 'Para negócios em crescimento',
      features: [
        '📦 Até 500 produtos',
        '👥 30 consultores disponíveis',
        '🏢 5 Filiais + Matriz',
        '👤 20 vendedores',
        '⏰ Edição após 12h',
        '💬 Texto, áudio, imagens e vídeo (15s)',
        '📞 6 videochamadas/mês',
        '🔄 Integração ERP mensal',
        '📊 Analytics semanal e mensal',
        '📍 Marketing: 10km'
      ],
      cor: '#2f0d51',
      stripeUrl: 'https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02',
    },
    {
      id: 'enterprise',
      nome: 'ENTERPRISE',
      preco: 499.00,
      descricao: 'Solução completa para grandes redes',
      features: [
        '📦 Produtos ILIMITADOS',
        '👥 80 consultores disponíveis',
        '🏢 29 Filiais + Matriz',
        '👤 60 vendedores',
        '⏰ Edição após 4h',
        '💬 Texto, áudio, imagens e vídeo (15s)',
        '📞 Videochamadas ILIMITADAS',
        '🔄 Integração ERP automática',
        '📊 Analytics diário e mensal',
        '📍 Marketing: 20km',
        '🤖 BI de Liquidez de Estoque'
      ],
      cor: '#1a0a2e',
      stripeUrl: 'https://buy.stripe.com/6oU28r5LiemMaBM8SJgQE0a',
    }
  ];

  // ✅ ADDONS CORRETOS
  const addons = [
    {
      id: 'pacote-basic',
      nome: 'Pacote Basic+',
      preco: 49.90,
      descricao: '+1 Filial, +2 Vendedores, +20 Produtos',
      disponivel: ['basic'],
      stripeUrl: 'https://buy.stripe.com/aFa28rehOdiIfW60mdgQE04',
      icon: '📦'
    },
    {
      id: 'produtos-adicionais',
      nome: 'Produtos Adicionais',
      preco: 'Sob consulta',
      descricao: 'Pacotes extras de produtos',
      disponivel: ['basic', 'pro'],
      stripeUrl: 'https://buy.stripe.com/eVqeVd2z66Uk5hs9WNgQE09',
      icon: '📦'
    },
    {
      id: 'filial-adicional',
      nome: 'Filial Adicional',
      preco: 'Sob consulta',
      descricao: 'Expanda para mais localidades',
      disponivel: ['basic', 'pro', 'enterprise'],
      stripeUrl: 'https://buy.stripe.com/7sY28r6PmguUcJUglbgQE06',
      icon: '🏢'
    },
    {
      id: 'vendedor-adicional',
      nome: 'Vendedor Adicional',
      preco: 'Sob consulta',
      descricao: 'Aumente seu time de vendas',
      disponivel: ['basic', 'pro', 'enterprise'],
      stripeUrl: 'https://buy.stripe.com/6oU4gz6Pm1A0cJUed3gQE05',
      icon: '👤'
    },
    {
      id: 'modulo-erp',
      nome: 'Módulo ERP',
      preco: 'Sob consulta',
      descricao: 'Integração automática com seu ERP',
      disponivel: ['basic', 'pro'], // Enterprise já tem
      stripeUrl: 'https://buy.stripe.com/3cI9ATc9G7YodNYfh7gQE08',
      icon: '🔄'
    }
  ];

  const slideAtualData = slides[slideAtual];

  const proximoSlide = () => {
    if (slideAtual < slides.length - 1) {
      setSlideAtual(slideAtual + 1);
    } else {
      setEtapa('planos');
    }
  };

  const slideAnterior = () => {
    if (slideAtual > 0) {
      setSlideAtual(slideAtual - 1);
    }
  };

  const selecionarPlano = (plano) => {
    setPlanoSelecionado(plano);
    setEtapa('addons');
  };

  const finalizarEscolha = () => {
    localStorage.setItem('planoEscolhido', planoSelecionado.id);
    localStorage.setItem('faturamentoEstimado', faturamentoEstimado);
    navigate('/cadastro/lojista');
  };

  const voltarParaSlides = () => {
    setEtapa('slides');
    setSlideAtual(slides.length - 1);
  };

  const voltarParaPlanos = () => {
    setEtapa('planos');
  };

  const voltarParaHome = () => {
    navigate('/');
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

  // ========== RENDERIZAÇÃO DOS SLIDES ==========
  if (etapa === 'slides') {
    return (
      <div style={{
        ...styles.container,
        background: `linear-gradient(135deg, ${slideAtualData.color}15 0%, ${slideAtualData.color}30 100%)`,
      }}>
        {/* Botão Voltar Home */}
        <button onClick={voltarParaHome} style={styles.voltarHome}>
          ← Voltar para Home
        </button>

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
          <div style={{
            ...styles.badge,
            backgroundColor: slideAtualData.color,
          }}>
            {slideAtualData.badge}
          </div>

          <div style={styles.iconContainer}>
            <span style={styles.icon}>{slideAtualData.icon}</span>
          </div>

          <h1 style={styles.title}>{slideAtualData.title}</h1>
          <h2 style={styles.subtitle}>{slideAtualData.subtitle}</h2>
          <p style={styles.description}>{slideAtualData.description}</p>

          {slideAtualData.mostrarCalculadora ? (
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
                <div style={styles.roiPreview}>
                  <p style={styles.roiTexto}>
                    📊 Você pode estar perdendo <strong>{formatarMoeda(roi.receitaRecuperada)}/mês</strong> por falta de overflow!
                  </p>
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
              {slideAtual === slides.length - 1 ? 'Ver Planos →' : 'Próximo →'}
            </button>
          </div>

          <div style={styles.slideCounter}>
            {slideAtual + 1} / {slides.length}
          </div>

          <button onClick={() => setEtapa('planos')} style={styles.skipButton}>
            Pular para escolha de planos →
          </button>

          <div style={styles.tagline}>
            🚚 Profissionais Sob Demanda Para Suas Vendas
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDERIZAÇÃO DO COMPARATIVO DE PLANOS ==========
  if (etapa === 'planos') {
    return (
      <div style={styles.planosContainer}>
        <button onClick={voltarParaHome} style={styles.voltarHome}>
          ← Voltar para Home
        </button>

        <div style={styles.planosHeader}>
          <button onClick={voltarParaSlides} style={styles.backButton}>
            ← Voltar para apresentação
          </button>
          
          <h1 style={styles.planosTitle}>Escolha Seu Plano</h1>
          <p style={styles.planosSubtitle}>
            Planos flexíveis para lojas de todos os tamanhos
          </p>

          {faturamentoEstimado && (
            <div style={styles.roiInfo}>
              <p style={styles.roiInfoTexto}>
                💰 Com faturamento de <strong>{formatarMoeda(parseFloat(faturamentoEstimado))}/mês</strong>,
                você pode recuperar até <strong>{formatarMoeda(roi.receitaRecuperada)}</strong> em vendas perdidas!
              </p>
            </div>
          )}
        </div>

        <div style={styles.planosGrid}>
          {planos.map((plano) => (
            <div
              key={plano.id}
              style={{
                ...styles.planoCard,
                backgroundColor: plano.cor,
                transform: 'scale(1)',
                border: 'none',
              }}
            >
              

              <h3 style={styles.planoNome}>{plano.nome}</h3>
              <div style={styles.planoPreco}>
                <span style={styles.planoPrecoValor}>R$ {plano.preco}</span>
                <span style={styles.planoPrecoPeriodo}>/mês</span>
              </div>
              <p style={styles.planoDescricao}>{plano.descricao}</p>

              {faturamentoEstimado && (
                <div style={styles.planoROI}>
                  <div style={styles.planoROIValor}>
                    ROI: {plano.id === 'basic' ? roi.roiBasic : plano.id === 'pro' ? roi.roiPro : roi.roiEnterprise}x
                  </div>
                  <div style={styles.planoROITexto}>
                    Retorno sobre investimento
                  </div>
                </div>
              )}

              <ul style={styles.planoFeatures}>
                {plano.features.map((feature, idx) => (
                  <li key={idx} style={styles.planoFeature}>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => selecionarPlano(plano)}
                style={{
                  ...styles.planoButton,
                  backgroundColor: '#bb25a6',
                  color: 'white',
                }}
              >
                Escolher {plano.nome}
              </button>
            </div>
          ))}
        </div>

        <div style={styles.planosFooter}>
          <p style={styles.planosFooterTexto}>
            💳 Pagamento processado via Stripe • 🔒 100% seguro
          </p>
        </div>
      </div>
    );
  }

  // ========== RENDERIZAÇÃO DOS ADDONS ==========
  return (
    <div style={styles.addonsContainer}>
      <button onClick={voltarParaHome} style={styles.voltarHome}>
        ← Voltar para Home
      </button>

      <div style={styles.addonsHeader}>
        <button onClick={voltarParaPlanos} style={styles.backButton}>
          ← Voltar para planos
        </button>
        
        <h1 style={styles.addonsTitle}>
          Você escolheu: <span style={{color: '#bb25a6'}}>{planoSelecionado.nome}</span>
        </h1>
        <p style={styles.addonsSubtitle}>
          Personalize seu plano com recursos adicionais
        </p>
      </div>

      <div style={styles.addonsGrid}>
        {addons
          .filter(addon => addon.disponivel.includes(planoSelecionado.id))
          .map((addon) => (
            <div key={addon.id} style={styles.addonCard}>
              <div style={styles.addonIcon}>{addon.icon}</div>
              <h3 style={styles.addonNome}>{addon.nome}</h3>
              <div style={styles.addonPreco}>
                {typeof addon.preco === 'number' 
                  ? `R$ ${addon.preco.toFixed(2).replace('.', ',')}`
                  : addon.preco
                }
              </div>
              <p style={styles.addonDescricao}>{addon.descricao}</p>
              
              <a
                href={addon.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.addonButton}
              >
                Adicionar
              </a>
            </div>
          ))}
      </div>

      <div style={styles.finalizarContainer}>
        <button onClick={finalizarEscolha} style={styles.finalizarButton}>
          Continuar para Cadastro →
        </button>
        
        <p style={styles.finalizarTexto}>
          Você pode adicionar recursos extras a qualquer momento no dashboard
        </p>
      </div>
    </div>
  );
};

// ========== ESTILOS ==========
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
  
  voltarHome: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    zIndex: 1001,
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
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '50px 40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    marginTop: '60px',
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
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#2f0d51',
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
    marginBottom: '20px',
  },
  
  label: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2f0d51',
    marginBottom: '10px',
  },
  
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '1.3rem',
    fontWeight: '700',
    textAlign: 'center',
    border: '3px solid #bb25a6',
    borderRadius: '12px',
    outline: 'none',
  },
  
  roiPreview: {
    backgroundColor: '#fef3c7',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
  },
  
  roiTexto: {
    fontSize: '1.1rem',
    color: '#92400e',
    margin: 0,
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
  
  // PLANOS
  planosContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif",
  },
  
  planosHeader: {
    maxWidth: '1200px',
    margin: '0 auto 50px',
    textAlign: 'center',
  },
  
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '30px',
    textDecoration: 'underline',
  },
  
  planosTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#2f0d51',
    marginBottom: '15px',
  },
  
  planosSubtitle: {
    fontSize: '1.3rem',
    color: '#64748b',
    marginBottom: '30px',
  },
  
  roiInfo: {
    backgroundColor: '#f3eef8',
    border: '2px solid #2f0d51',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto',
  },
  
  roiInfoTexto: {
    fontSize: '1.1rem',
    color: '#2f0d51',
    margin: 0,
  },
  
  planosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto 50px',
  },
  
  planoCard: {
    padding: '40px 30px',
    borderRadius: '20px',
    color: 'white',
    position: 'relative',
    transition: 'all 0.3s',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    display: 'flex', // ✅ FLEX
    flexDirection: 'column', // ✅ COLUNA
    minHeight: '650px', // ✅ ALTURA MÍNIMA
  },
  
  planoTag: {
    position: 'absolute',
    top: '-15px',
    right: '20px',
    backgroundColor: '#bb25a6',
    color: '#2f0d51',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  
  planoNome: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '15px',
  },
  
  planoPreco: {
    marginBottom: '15px',
  },
  
  planoPrecoValor: {
    fontSize: '3rem',
    fontWeight: '800',
  },
  
  planoPrecoPeriodo: {
    fontSize: '1rem',
    opacity: 0.8,
  },
  
  planoDescricao: {
    fontSize: '0.95rem',
    marginBottom: '25px',
    opacity: 0.9,
  },
  
  planoROI: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '25px',
  },
  
  planoROIValor: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '5px',
  },
  
  planoROITexto: {
    fontSize: '0.85rem',
    opacity: 0.9,
  },
  
  planoFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px',
    textAlign: 'left',
    flexGrow: 1, // ✅ CRESCE PARA EMPURRAR BOTÃO
  },
  
  planoFeature: {
    fontSize: '0.9rem',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
  
  planoButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: 'auto', // ✅ FICA NO FINAL
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  
  planosFooter: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  
  planosFooterTexto: {
    fontSize: '0.95rem',
    color: '#64748b',
  },
  
  // ADDONS
  addonsContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif",
  },
  
  addonsHeader: {
    maxWidth: '1200px',
    margin: '0 auto 50px',
    textAlign: 'center',
  },
  
  addonsTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#2f0d51',
    marginBottom: '15px',
  },
  
  addonsSubtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    marginBottom: '30px',
  },
  
  addonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto 50px',
  },
  
  addonCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s',
  },
  
  addonIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  
  addonNome: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#2f0d51',
    marginBottom: '10px',
  },
  
  addonPreco: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#bb25a6',
    marginBottom: '15px',
  },
  
  addonDescricao: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  
  addonButton: {
    display: 'inline-block',
    width: '100%',
    padding: '12px',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },
  
  finalizarContainer: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  finalizarButton: {
    backgroundColor: '#bb25a6',
    color: '#2f0d51',
    border: 'none',
    padding: '18px 50px',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(233,30,99,0.3)',
    marginBottom: '20px',
  },
  
  finalizarTexto: {
    fontSize: '0.95rem',
    color: '#64748b',
  },
};

export default MarketingOnboarding;