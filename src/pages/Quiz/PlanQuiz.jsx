// src/pages/Quiz/PlanQuiz.jsx
// Questionário: "Descubra Seu Plano Ideal"

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanQuiz = () => {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [planoRecomendado, setPlanoRecomendado] = useState(null);
  const navigate = useNavigate();

  const perguntas = [
    {
      id: 'produtos',
      pergunta: 'Quantos produtos você deseja cadastrar no total?',
      opcoes: [
        { valor: 'basic', texto: 'Até 100 produtos', desc: 'Catálogo pequeno e focado' },
        { valor: 'pro', texto: '101 a 500 produtos', desc: 'Variedade média' },
        { valor: 'enterprise', texto: 'Mais de 500 produtos', desc: 'Catálogo extenso' }
      ]
    },
    {
      id: 'vendedores',
      pergunta: 'Quantos vendedores você tem hoje?',
      opcoes: [
        { valor: 'basic', texto: 'Até 5 vendedores', desc: 'Equipe pequena' },
        { valor: 'pro', texto: '6 a 20 vendedores', desc: 'Equipe média' },
        { valor: 'enterprise', texto: 'Mais de 20 vendedores', desc: 'Equipe grande' }
      ]
    },
    {
      id: 'lojas',
      pergunta: 'Quantas lojas você possui?',
      opcoes: [
        { valor: 'basic', texto: '1 loja (matriz)', desc: 'Operação única' },
        { valor: 'pro', texto: '2 a 6 lojas', desc: 'Expansão regional' },
        { valor: 'enterprise', texto: 'Mais de 6 lojas', desc: 'Rede estabelecida' }
      ]
    },
    {
      id: 'erp',
      pergunta: 'Você tem ERP?',
      opcoes: [
        { valor: 'basic', texto: 'Não tenho ERP', desc: 'Gestão manual ou planilhas' },
        { valor: 'pro', texto: 'Tenho ERP básico', desc: 'Sistema simples de gestão' },
        { valor: 'enterprise', texto: 'Tenho ERP completo', desc: 'Sistema robusto integrado' }
      ]
    },
    {
      id: 'expansao',
      pergunta: 'Seu negócio está em expansão?',
      opcoes: [
        { valor: 'basic', texto: 'Não, estou estável', desc: 'Mantendo operação atual' },
        { valor: 'pro', texto: 'Sim, crescimento moderado', desc: 'Expandindo aos poucos' },
        { valor: 'enterprise', texto: 'Sim, crescimento acelerado', desc: 'Expansão rápida' }
      ]
    },
    {
      id: 'canais',
      pergunta: 'Você usa algum outro meio de venda além da loja física?',
      opcoes: [
        { valor: 'basic', texto: 'Apenas loja física', desc: 'Venda presencial' },
        { valor: 'pro', texto: 'Loja física + redes sociais', desc: 'Vendas híbridas' },
        { valor: 'enterprise', texto: 'Multicanal (físico, online, marketplace)', desc: 'Presença omnichannel' }
      ]
    },
    {
      id: 'metricas',
      pergunta: 'Você precisa de métricas mais robustas?',
      opcoes: [
        { valor: 'basic', texto: 'Não, relatórios mensais são suficientes', desc: 'Análise básica' },
        { valor: 'pro', texto: 'Sim, preciso de relatórios semanais', desc: 'Acompanhamento frequente' },
        { valor: 'enterprise', texto: 'Sim, preciso de BI diário e detalhado', desc: 'Análise profunda' }
      ]
    }
  ];

  const planos = {
    basic: {
      nome: 'BÁSICO',
      preco: 99.90,
      stripeUrl: 'https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01',
      features: [
        ' Até 100 produtos',
        ' 10 consultores',
        '🏢 1 Filial + Matriz',
        ' 5 vendedores',
        '⏰ Edição após 24h',
        ' Texto, áudio e imagens',
        ' Analytics mensal',
        ' Marketing: 5km',
        '📁 Atualização CSV',
        ' Pacote R$ 49,90'
      ],
      cor: '#1A2332'
    },
    pro: {
      nome: 'PRO',
      preco: 199.90,
      stripeUrl: 'https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02',
      features: [
        ' Até 500 produtos',
        ' 30 consultores',
        '🏢 5 Filiais + Matriz',
        ' 20 vendedores',
        '⏰ Edição após 12h',
        ' Vídeo (15s) + 6 chamadas/mês',
        ' ERP mensal',
        ' Analytics semanal',
        ' Marketing: 10km'
      ],
      cor: '#2f0d51'
    },
    enterprise: {
      nome: 'ENTERPRISE',
      preco: 499.00,
      stripeUrl: 'https://buy.stripe.com/6oU28r5LiemMaBM8SJgQE0a',
      features: [
        ' ILIMITADOS',
        ' 80 consultores',
        '🏢 29 Filiais + Matriz',
        ' 60 vendedores',
        '⏰ Edição: 4h',
        ' Chamadas ILIMITADAS',
        ' ERP automático',
        ' BI diário',
        ' Marketing: 20km'
      ],
      cor: '#2f0d51'
    }
  };

  const calcularPlano = () => {
    const pontos = {
      basic: 0,
      pro: 0,
      enterprise: 0
    };

    Object.values(respostas).forEach(resposta => {
      pontos[resposta]++;
    });

    // Plano com mais pontos
    let planoFinal = 'basic';
    let maxPontos = pontos.basic;

    if (pontos.pro > maxPontos) {
      planoFinal = 'pro';
      maxPontos = pontos.pro;
    }

    if (pontos.enterprise > maxPontos) {
      planoFinal = 'enterprise';
    }

    setPlanoRecomendado(planoFinal);
  };

  const responder = (valor) => {
    const novasRespostas = {
      ...respostas,
      [perguntas[etapa].id]: valor
    };
    setRespostas(novasRespostas);

    if (etapa < perguntas.length - 1) {
      setEtapa(etapa + 1);
    } else {
      // Última pergunta - calcular resultado
      const pontos = {
        basic: 0,
        pro: 0,
        enterprise: 0
      };

      Object.values(novasRespostas).forEach(resposta => {
        pontos[resposta]++;
      });

      let planoFinal = 'basic';
      let maxPontos = pontos.basic;

      if (pontos.pro > maxPontos) {
        planoFinal = 'pro';
        maxPontos = pontos.pro;
      }

      if (pontos.enterprise > maxPontos) {
        planoFinal = 'enterprise';
      }

      setPlanoRecomendado(planoFinal);
    }
  };

  const voltar = () => {
    if (etapa > 0) {
      setEtapa(etapa - 1);
    } else {
      navigate('/');
    }
  };

  const refazerQuiz = () => {
    setEtapa(0);
    setRespostas({});
    setPlanoRecomendado(null);
  };

  const irParaCadastro = () => {
    localStorage.setItem('planoEscolhido', planoRecomendado);
    navigate('/cadastro/lojista');
  };

  const verTodosPlanos = () => {
    navigate('/onboarding');
  };

  // RESULTADO
  if (planoRecomendado) {
    const plano = planos[planoRecomendado];

    return (
      <div style={styles.container}>
        <div style={styles.resultadoCard}>
          <div style={styles.confetti}></div>
          
          <h1 style={styles.resultadoTitle}>
            Seu Plano Ideal é:
          </h1>
          
          <div style={{
            ...styles.planoDestaque,
            backgroundColor: plano.cor
          }}>
            <h2 style={styles.planoNome}>{plano.nome}</h2>
            <div style={styles.planoPreco}>
              <span style={styles.planoPrecoValor}>
                R$ {plano.preco.toFixed(2).replace('.', ',')}
              </span>
              <span style={styles.planoPrecoPeriodo}>/mês</span>
            </div>
          </div>

          <div style={styles.resultadoTexto}>
            <p style={styles.resultadoDesc}>
              {planoRecomendado === 'basic' && 'Perfeito para quem está começando e quer testar a plataforma com investimento acessível.'}
              {planoRecomendado === 'pro' && 'Ideal para negócios em crescimento que precisam de recursos avançados e escalabilidade.'}
              {planoRecomendado === 'enterprise' && 'Solução completa para grandes redes que precisam do máximo em recursos e integração.'}
            </p>
          </div>

          <div style={styles.featuresBox}>
            <h3 style={styles.featuresTitle}>O que está incluído:</h3>
            <ul style={styles.featuresList}>
              {plano.features.map((feature, idx) => (
                <li key={idx} style={styles.featureItem}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.botoesResultado}>
            <button onClick={irParaCadastro} style={styles.btnPrimary}>
              🚀 Começar com {plano.nome}
            </button>
            
            <button onClick={verTodosPlanos} style={styles.btnSecondary}>
              Ver Todos os Planos
            </button>
            
            <button onClick={refazerQuiz} style={styles.btnTertiary}>
              ↻ Refazer Quiz
            </button>
          </div>

          <div style={styles.garantia}>
             Pagamento 100% seguro via Stripe •  Sem compromisso
          </div>
        </div>
      </div>
    );
  }

  // QUIZ
  const perguntaAtual = perguntas[etapa];
  const progresso = ((etapa + 1) / perguntas.length) * 100;

  return (
    <div style={styles.container}>
      <button onClick={voltar} style={styles.voltarBtn}>
        ← Voltar
      </button>

      <div style={styles.quizCard}>
        {/* Barra de progresso */}
        <div style={styles.progressoContainer}>
          <div style={styles.progressoBar}>
            <div style={{
              ...styles.progressoPreenchido,
              width: `${progresso}%`
            }} />
          </div>
          <div style={styles.progressoTexto}>
            Pergunta {etapa + 1} de {perguntas.length}
          </div>
        </div>

        {/* Pergunta */}
        <h2 style={styles.pergunta}>{perguntaAtual.pergunta}</h2>

        {/* Opções */}
        <div style={styles.opcoesContainer}>
          {perguntaAtual.opcoes.map((opcao, idx) => (
            <button
              key={idx}
              onClick={() => responder(opcao.valor)}
              style={styles.opcaoBtn}
            >
              <div style={styles.opcaoTexto}>{opcao.texto}</div>
              <div style={styles.opcaoDesc}>{opcao.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
  },
  
  voltarBtn: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  
  quizCard: {
    maxWidth: '700px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '50px 40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  
  progressoContainer: {
    marginBottom: '40px',
  },
  
  progressoBar: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  
  progressoPreenchido: {
    height: '100%',
    backgroundColor: '#bb25a6',
    transition: 'width 0.3s',
  },
  
  progressoTexto: {
    fontSize: '0.9rem',
    color: '#64748b',
    textAlign: 'center',
  },
  
  pergunta: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '40px',
    textAlign: 'center',
    lineHeight: '1.3',
  },
  
  opcoesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  
  opcaoBtn: {
    backgroundColor: 'white',
    border: '3px solid #e2e8f0',
    borderRadius: '12px',
    padding: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'left',
  },
  
  opcaoTexto: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  },
  
  opcaoDesc: {
    fontSize: '0.95rem',
    color: '#64748b',
  },
  
  // RESULTADO
  resultadoCard: {
    maxWidth: '800px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  
  confetti: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  
  resultadoTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '30px',
  },
  
  planoDestaque: {
    padding: '40px',
    borderRadius: '16px',
    color: 'white',
    marginBottom: '30px',
  },
  
  planoNome: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '15px',
  },
  
  planoPreco: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '5px',
  },
  
  planoPrecoValor: {
    fontSize: '4rem',
    fontWeight: '800',
  },
  
  planoPrecoPeriodo: {
    fontSize: '1.5rem',
    opacity: 0.9,
  },
  
  resultadoTexto: {
    marginBottom: '30px',
  },
  
  resultadoDesc: {
    fontSize: '1.1rem',
    color: '#475569',
    lineHeight: '1.7',
  },
  
  featuresBox: {
    backgroundColor: '#f8fafc',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '40px',
    textAlign: 'left',
  },
  
  featuresTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '20px',
  },
  
  featuresList: {
    listStyle: 'none',
    padding: 0,
  },
  
  featureItem: {
    fontSize: '1rem',
    color: '#334155',
    padding: '10px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  
  botoesResultado: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px',
  },
  
  btnPrimary: {
    backgroundColor: '#bb25a6',
    color: '#1A2332',
    border: 'none',
    padding: '18px 40px',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(244, 208, 63, 0.3)',
  },
  
  btnSecondary: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  btnTertiary: {
    backgroundColor: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  garantia: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
};

export default PlanQuiz;
