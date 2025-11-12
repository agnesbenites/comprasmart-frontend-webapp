import React, { useState, useEffect, useMemo } from 'react';
// Usaremos carregamento via CDN para evitar problemas de dependência no ambiente de execução.

// ** CHAVE PÚBLICA DO STRIPE (pk_test_...) **
// Esta chave é segura para o frontend
const STRIPE_PUBLIC_KEY = 'pk_test_51SSn4VC0uDNlEzVIDhiWJ4cvdVqqmCDhuLLJZtw1hCHTpZEKFrlqIZ7HSUWrmc0pyPwOKvB9iSM9OpQ8kLBG8V65006ujiuHoM'; 

// ** IDs DE PREÇO (PRICE IDs) DO STRIPE CORRETOS **
const PLAN_PRICE_IDS = {
  basico: 'price_1SSnHlC0uDNlEzVIS6g6lhwb',      // R$ 99,90/mês
  premium: 'price_1SSnKCC0uDNlEzVIx0BXe0h9',     // R$ 299,90/mês
  empresarial: 'price_1SSnKdC0uDNlEzVIqMhLxUXv',  // R$ 599,90/mês
};

// Função para carregar o Stripe.js dinamicamente do CDN
const loadStripeFromCDN = (publicKey) => {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(window.Stripe(publicKey));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;

    script.onload = () => {
      if (window.Stripe) {
        resolve(window.Stripe(publicKey));
      } else {
        reject(new Error("Stripe.js loaded but Stripe object not found."));
      }
    };
    
    script.onerror = () => {
        reject(new Error("Falha ao carregar o script do Stripe.js."));
    };

    document.head.appendChild(script);
  });
};


const LojistaPagamentos = () => {
  const [planoSelecionado, setPlanoSelecionado] = useState("premium");
  const [mostrarModalCheckout, setMostrarModalCheckout] = useState(false);
  const [stripeInstance, setStripeInstance] = useState(null);
  const [loadingStripe, setLoadingStripe] = useState(true);
  const [message, setMessage] = useState(null);


  // 1. Carregar Stripe.js assincronamente ao montar o componente
  useEffect(() => {
    const loadStripeClient = async () => {
      try {
        const stripe = await loadStripeFromCDN(STRIPE_PUBLIC_KEY);
        setStripeInstance(stripe);
        setLoadingStripe(false);
      } catch (error) {
        console.error("Erro ao carregar Stripe.js:", error);
        setMessage("Não foi possível carregar o serviço de pagamento. Tente novamente.");
        setLoadingStripe(false);
      }
    };
    loadStripeClient();
  }, []);

  const planos = useMemo(() => ([
    {
      id: "basico",
      nome: "Plano Básico",
      valor: 99.90,
      ciclo: "mensal",
      beneficios: [
        "Até 3 consultores",
        "Relatórios básicos",
        "5 campanhas/mês",
        "Suporte por email"
      ]
    },
    {
      id: "premium",
      nome: "Plano Premium",
      valor: 299.90,
      ciclo: "mensal",
      beneficios: [
        "Até 10 consultores",
        "Relatórios avançados",
        "Campanhas ilimitadas",
        "Suporte prioritário",
        "API de integração"
      ]
    },
    {
      id: "empresarial",
      nome: "Plano Empresarial",
      valor: 599.90,
      ciclo: "mensal",
      beneficios: [
        "Consultores ilimitados",
        "Dashboard personalizado",
        "Analytics em tempo real",
        "Suporte dedicado",
        "Integração completa"
      ]
    }
  ]), []);

  const faturas = useMemo(() => ([
    // IDs de fatura simulados (ID real do Stripe Invoice)
    { id: 'in_1A0B1C', mes: "Novembro 2024", valor: 299.90, status: "paga", data: "15/11/2024", downloadUrl: "#" },
    { id: 'in_2B1C2D', mes: "Outubro 2024", valor: 299.90, status: "paga", data: "15/10/2024", downloadUrl: "#" },
    { id: 'in_3C2D3E', mes: "Setembro 2024", valor: 299.90, status: "paga", data: "15/09/2024", downloadUrl: "#" },
    { id: 'in_4D3E4F', mes: "Dezembro 2024", valor: 299.90, status: "pendente", data: "15/12/2024", downloadUrl: "#" }
  ]), []);

  // Simulação de forma de pagamento atual (dados parciais seguros)
  const cartaoAtual = {
    final: '1234',
    validade: '12/25',
    tipo: 'Visa'
  };


  const handleDownloadFatura = async (fatura) => {
    if (fatura.status !== 'paga') {
        setMessage("A fatura não está paga e o download não está disponível.");
        return;
    }

    try {
      setMessage("Preparando download da fatura...");
      
      // Chama o API backend (no Render) que usará a Chave Secreta para buscar o PDF no Stripe.
      const response = await fetch('/api/gerar-fatura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faturaId: fatura.id }) 
      });

      if (response.ok) {
        // Se o backend retorna sucesso (e faz um redirecionamento 303), o navegador lida com o download.
        setMessage("Iniciando download. Verifique sua pasta de downloads.");
      } else {
        const errorData = await response.json();
        setMessage(`Erro ao baixar: ${errorData.message || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro de rede. Tente novamente.");
    }
  };
  
  const initiateStripeCheckout = async () => {
    if (!stripeInstance) {
        setMessage("Serviço de pagamento não carregado.");
        return;
    }
    
    setMostrarModalCheckout(false);
    setMessage("Redirecionando para o checkout seguro...");

    const priceId = PLAN_PRICE_IDS[planoSelecionado];

    try {
        // Redireciona o usuário para a página de checkout do Stripe usando o Price ID
        const { error } = await stripeInstance.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}/lojista/pagamento/sucesso`,
            cancelUrl: `${window.location.origin}/lojista/pagamentos`,
        });

        if (error) {
            console.error('Erro ao redirecionar para o checkout:', error.message);
            setMessage(`Falha no checkout: ${error.message}`);
        }
    } catch (e) {
        console.error('Erro de Stripe:', e);
        setMessage("Ocorreu um erro inesperado ao processar o pagamento.");
    }
  };

  const statusColor = (status) => {
    switch (status) {
        case 'paga': return 'bg-green-100 text-green-700';
        case 'pendente': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-[#2c5aa0] border-b pb-2">
          💳 Gestão de Pagamentos
        </h1>
        
        {message && (
             <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 shadow-sm font-medium">
                {message}
             </div>
        )}

        {/* 1. Seleção de Plano */}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-[#2c5aa0] mb-6">📋 Escolha seu Plano</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {planos.map(plano => (
              <div
                key={plano.id}
                onClick={() => setPlanoSelecionado(plano.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  planoSelecionado === plano.id 
                    ? 'border-[#2c5aa0] bg-[#f0f7ff] shadow-xl scale-[1.02]' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="text-lg font-bold text-[#2c5aa0] mb-2">{plano.nome}</h3>
                <p className="text-3xl font-extrabold text-[#2c5aa0] mb-4">
                  R$ {plano.valor.toFixed(2)}
                  <span className="text-base text-gray-500 font-normal">/mês</span>
                </p>
                
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  {plano.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {beneficio}
                    </li>
                  ))}
                </ul>
                
                {planoSelecionado === plano.id && (
                  <button
                    onClick={() => setMostrarModalCheckout(true)}
                    disabled={loadingStripe}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-colors shadow-md 
                      ${loadingStripe 
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                          : 'bg-[#2c5aa0] text-white hover:bg-[#1a407a]'
                      }`}
                  >
                    {loadingStripe ? 'Carregando Serviço...' : '🚀 Assinar Agora / Alterar'}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-700">
            <strong>💡 Dica de Segurança:</strong> Recomendamos o uso de cartões virtuais para assinaturas recorrentes.
            É mais seguro e você pode controlar melhor seus gastos!
          </div>
        </section>

        {/* 2. Informações de Pagamento Atual */}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-[#2c5aa0] mb-6">🔒 Método de Pagamento Atual</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 flex justify-between items-center">
            <div>
              <div className="text-lg font-bold text-gray-800">
                {cartaoAtual.tipo} **** **** **** {cartaoAtual.final}
              </div>
              <div className="text-sm text-gray-500">
                Válido até: {cartaoAtual.validade}
              </div>
            </div>
            
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
              ATIVO
            </span>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700 mb-4">
            <strong>🔐 Segurança:</strong> Seus dados de cartão são processados de forma segura pelo Stripe.
            Nós não temos acesso aos números completos do seu cartão.
          </div>

          <button
            className="px-4 py-2 text-sm font-medium rounded-lg text-[#2c5aa0] border border-[#2c5aa0] hover:bg-blue-50 transition-colors"
            onClick={() => setMostrarModalCheckout(true)}
          >
            ✏️ Alterar Método de Pagamento
          </button>
        </section>

        {/* 3. Histórico de Faturas */}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-[#2c5aa0] mb-6">📄 Histórico de Faturas</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês/Ano</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faturas.map(fatura => (
                  <tr key={fatura.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fatura.mes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                      R$ {fatura.valor.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(fatura.status)}`}>
                        {fatura.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {fatura.data}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleDownloadFatura(fatura)}
                        disabled={fatura.status !== 'paga'}
                        className={`inline-flex items-center px-3 py-1 border border-[#2c5aa0] text-xs font-medium rounded-lg text-white transition-colors
                          ${fatura.status === 'paga' 
                            ? 'bg-[#2c5aa0] hover:bg-[#1a407a] shadow-sm' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                          }`}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-gray-50 text-sm text-gray-600 border border-gray-200">
            <strong>📧 Envio Automático:</strong> Faturas e notas fiscais são enviadas para seu e-mail cadastrado em cada cobrança.
          </div>
        </section>

      </div>
      
      {/* Checkout Modal (Confirmação de Redirecionamento) */}
      {mostrarModalCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold text-[#2c5aa0]">🔒 Checkout Seguro (Stripe)</h3>
            <p className="text-gray-700">
              Você será redirecionado para o ambiente seguro do Stripe para finalizar a assinatura do **{planoSelecionado ? planos.find(p => p.id === planoSelecionado)?.nome : 'Plano'}**.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarModalCheckout(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={initiateStripeCheckout}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Continuar para Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LojistaPagamentos;