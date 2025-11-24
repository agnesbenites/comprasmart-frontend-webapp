import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const IntegracaoVenda = () => {
  const { vendaId } = useParams();
  const navigate = useNavigate();
  const [venda, setVenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [integrado, setIntegrado] = useState(false);

  // NOVO: Bloco para injetar a animação CSS APÓS a montagem do componente
  useEffect(() => {
    // Verifica se estamos no navegador e se existe pelo menos uma folha de estilo
    if (typeof document !== 'undefined' && document.styleSheets.length > 0) {
      const styleSheet = document.styleSheets[0];
      // Verifica se a regra de animação 'spin' já existe para evitar duplicatas
      const spinRuleExists = Array.from(styleSheet.cssRules).some(
        (rule) => rule.name === 'spin'
      );

      if (!spinRuleExists) {
        // Injeta a regra CSS para a animação do spinner
        styleSheet.insertRule(`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `, styleSheet.cssRules.length);
      }
    }
  }, []); // Executa apenas uma vez após a montagem do componente

  useEffect(() => {
    carregarVenda();
  }, [vendaId]);

  const carregarVenda = async () => {
    try {
      const response = await fetch(`/api/vendas/${vendaId}`);
      if (response.ok) {
        const vendaData = await response.json();
        setVenda(vendaData);
        
        // Simular integração automática com sistema do lojista
        integrarComSistemaLojista(vendaData);
      }
    } catch (error) {
      console.error('Erro carregar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  const integrarComSistemaLojista = (vendaData) => {
    // Aqui você integraria com o sistema real do lojista
    // Por enquanto, simulamos a integração
    
    setTimeout(() => {
      console.log('🔄 Integrando produtos no sistema do lojista:', vendaData.produtos);
      setIntegrado(true);
      
      // Simular adição ao carrinho
      localStorage.setItem('carrinhoLojista', JSON.stringify(vendaData.produtos));
    }, 2000);
  };

  const abrirSistemaLojista = () => {
    // Redireciona para o sistema de vendas do lojista com os dados
    const dadosIntegracao = {
      vendaId: vendaId,
      produtos: venda.produtos,
      origem: 'suacomprasmart'
    };
    
    // Em produção, isso abriria o sistema real do lojista
    window.open(`/lojista/checkout?integracao=${encodeURIComponent(JSON.stringify(dadosIntegracao))}`, '_blank');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <h2>Carregando venda...</h2>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }
  // ... o restante do seu componente de erro e renderização principal permanece o mesmo
  if (!venda) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>❌ Venda não encontrada</h2>
          <p>A venda {vendaId} não foi encontrada ou já expirou.</p>
          <button onClick={() => navigate('/')} style={styles.button}>
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛒 Integração de Venda</h1>
        <p style={styles.subtitle}>Venda #{vendaId} - SuaCompraSmart</p>
      </div>

      <div style={styles.content}>
        {/* Status da Integração */}
        <div style={integrado ? styles.successCard : styles.processingCard}>
          {integrado ? (
            <>
              <div style={styles.successIcon}>✅</div>
              <h3>Integração Concluída!</h3>
              <p>Produtos adicionados ao carrinho do sistema</p>
            </>
          ) : (
            <>
              <div style={styles.spinner}></div>
              <h3>Integrando com sistema...</h3>
              <p>Adicionando produtos ao carrinho</p>
            </>
          )}
        </div>

        {/* Detalhes da Venda */}
        <div style={styles.detalhesSection}>
          <h3>📋 Detalhes da Venda</h3>
          <div style={styles.detalhesGrid}>
            <div style={styles.detalheItem}>
              <strong>Consultor:</strong> {venda.consultorNome}
            </div>
            <div style={styles.detalheItem}>
              <strong>Valor Total:</strong> R$ {venda.valorTotal.toFixed(2)}
            </div>
            <div style={styles.detalheItem}>
              <strong>Itens:</strong> {venda.produtos.length} produtos
            </div>
            <div style={styles.detalheItem}>
              <strong>Status:</strong> {integrado ? 'Integrado' : 'Processando'}
            </div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div style={styles.produtosSection}>
          <h3>📦 Produtos Incluídos</h3>
          <div style={styles.produtosLista}>
            {venda.produtos.map((produto, index) => (
              <div key={index} style={styles.produtoItem}>
                <div style={styles.produtoInfo}>
                  <strong>{produto.nome}</strong>
                  <div style={styles.produtoDetalhes}>
                    {produto.quantidade}x • R$ {produto.preco.toFixed(2)} cada
                  </div>
                  <div style={styles.produtoSku}>SKU: {produto.sku}</div>
                </div>
                <div style={styles.produtoTotal}>
                  R$ {(produto.preco * produto.quantidade).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        {integrado && (
          <div style={styles.acoesSection}>
            <h3>🎯 Próximos Passos</h3>
            <div style={styles.acoesGrid}>
              <button onClick={abrirSistemaLojista} style={styles.acaoButton}>
                💰 Ir para Pagamento
              </button>
              <button onClick={() => window.print()} style={styles.acaoButtonSecondary}>
                🖨️ Imprimir
              </button>
              <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={styles.acaoButtonSecondary}>
                📋 Copiar Link
              </button>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div style={styles.instrucoes}>
          <h4>📝 Como Funciona:</h4>
          <ol style={styles.instrucoesLista}>
            <li>Consultor cria venda no SuaCompraSmart</li>
            <li>Cliente recebe QR Code/Link (você está aqui)</li>
            <li>Sistema integra automaticamente com carrinho</li>
            <li>Cliente paga presencialmente no caixa</li>
            <li>Comissão é enviada automaticamente para consultor</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    // A animação 'spin' é injetada via useEffect ou inline no bloco 'loading'
    animation: 'spin 1s linear infinite', 
    margin: '0 auto 20px'
  },
  error: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '8px',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  successCard: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  processingCard: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  successIcon: {
    fontSize: '3rem',
    marginBottom: '15px'
  },
  detalhesSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  detalhesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginTop: '15px'
  },
  detalheItem: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  produtosSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  produtosLista: {
    marginTop: '15px'
  },
  produtoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  produtoInfo: {
    flex: 1
  },
  produtoDetalhes: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '5px'
  },
  produtoSku: {
    fontSize: '0.8rem',
    color: '#999',
    marginTop: '2px'
  },
  produtoTotal: {
    fontWeight: 'bold',
    color: '#28a745',
    fontSize: '1.1rem'
  },
  acoesSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  acoesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  acaoButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  acaoButtonSecondary: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  instrucoes: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  instrucoesLista: {
    margin: '15px 0',
    paddingLeft: '20px'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '15px'
  }
};


export default IntegracaoVenda;