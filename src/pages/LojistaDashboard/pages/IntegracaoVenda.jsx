import React, { useState, useEffect, useRef } from 'react';

const IntegracaoVenda = () => {
  const [codigo, setCodigo] = useState('');
  const [venda, setVenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [integrado, setIntegrado] = useState(false);
  const [erro, setErro] = useState('');
  const [modoCamera, setModoCamera] = useState(false);
  const inputRef = useRef(null);

  // Foca no input ao carregar (para leitores de codigo de barras USB)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Extrair codigo de diferentes formatos
  const extrairCodigo = (input) => {
    if (!input) return null;
    
    // Se for um link, extrair o codigo
    // Formatos aceitos:
    // - comprasmart.co/v/7842
    // - https://comprasmart.co/v/7842
    // - localhost:5173/lojista/dashboard/integracao/CS-7842
    const linkMatch = input.match(/\/v\/([A-Za-z0-9-]+)|\/integracao\/([A-Za-z0-9-]+)/);
    if (linkMatch) {
      return linkMatch[1] || linkMatch[2];
    }
    
    // Se ja for um codigo (CS-XXXX ou apenas numeros)
    return input.trim().toUpperCase();
  };

  // Buscar venda pelo codigo
  const buscarVenda = async (codigoBusca) => {
    const codigoLimpo = extrairCodigo(codigoBusca);
    
    if (!codigoLimpo || codigoLimpo.length < 4) {
      setErro('Digite um codigo valido (ex: CS-7842) ou cole o link da venda');
      return;
    }

    setLoading(true);
    setErro('');
    setVenda(null);
    setIntegrado(false);

    try {
      // Simular busca na API
      // Em producao: const response = await fetch(`/api/vendas/codigo/${codigoBusca}`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Dados simulados para demonstracao
      const vendaSimulada = {
        id: codigoBusca,
        cliente: {
          nome: 'Maria Silva',
          email: 'maria@email.com',
          telefone: '(11) 99999-9999'
        },
        consultor: {
          nome: 'Joao Consultor',
          comissao: 8.5
        },
        vendedor: null, // ou { nome: 'Pedro Vendedor' }
        produtos: [
          { id: 1, nome: 'Smartphone Samsung Galaxy S24', sku: 'SAM-S24-256', quantidade: 1, preco: 4299.00 },
          { id: 2, nome: 'Capa Protetora Premium', sku: 'CAP-S24-PRE', quantidade: 2, preco: 89.90 },
          { id: 3, nome: 'Pelicula de Vidro 3D', sku: 'PEL-S24-3D', quantidade: 1, preco: 49.90 }
        ],
        valorSubtotal: 4528.70,
        desconto: 0,
        valorTotal: 4528.70,
        dataCriacao: new Date().toISOString(),
        status: 'aguardando_pagamento'
      };

      setVenda(vendaSimulada);
    } catch (error) {
      console.error('Erro ao buscar venda:', error);
      setErro('Erro ao buscar venda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para input (detecta leitores de codigo de barras)
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setCodigo(valor);
    
    // Leitores de codigo de barras geralmente enviam Enter no final
    // Detectamos codigos longos digitados rapidamente
    if (valor.length >= 20) {
      buscarVenda(valor);
    }
  };

  // Handler para tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarVenda(codigo);
    }
  };

  // Confirmar integracao da venda
  const confirmarIntegracao = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em producao: enviar para API do sistema de caixa
      // await fetch('/api/caixa/integrar', { method: 'POST', body: JSON.stringify(venda) });
      
      setIntegrado(true);
      
      // Salvar no localStorage para demo
      localStorage.setItem('ultimaVendaIntegrada', JSON.stringify(venda));
    } catch (error) {
      setErro('Erro ao integrar venda');
    } finally {
      setLoading(false);
    }
  };

  // Nova busca
  const novaBusca = () => {
    setCodigo('');
    setVenda(null);
    setIntegrado(false);
    setErro('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Calcular total
  const calcularTotal = () => {
    if (!venda) return 0;
    return venda.produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Integracao de Venda</h1>
        <p style={styles.subtitle}>
          Escaneie o QR Code ou digite o codigo da venda
        </p>
      </div>

      {/* Area de Busca */}
      {!venda && (
        <div style={styles.buscaSection}>
          <div style={styles.buscaCard}>
            <div style={styles.iconBusca}>&#128269;</div>
            
            <h2 style={styles.buscaTitulo}>Buscar Venda</h2>
            
            <div style={styles.inputGroup}>
              <input
                ref={inputRef}
                type="text"
                value={codigo}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ex: CS-7842 ou comprasmart.co/v/7842"
                style={styles.input}
                disabled={loading}
                autoFocus
              />
              <button 
                onClick={() => buscarVenda(codigo)}
                style={styles.btnBuscar}
                disabled={loading || !codigo}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Opcoes de entrada */}
            <div style={styles.opcoesEntrada}>
              <div style={styles.opcaoItem}>
                <span style={styles.opcaoIcon}>&#128241;</span>
                <div style={styles.opcaoTexto}>
                  <strong>QR Code</strong>
                  <span>Escaneie com leitor USB</span>
                </div>
              </div>
              <div style={styles.opcaoDivisor}>ou</div>
              <div style={styles.opcaoItem}>
                <span style={styles.opcaoIcon}>&#9000;</span>
                <div style={styles.opcaoTexto}>
                  <strong>Codigo Curto</strong>
                  <span>Digite: CS-XXXX</span>
                </div>
              </div>
              <div style={styles.opcaoDivisor}>ou</div>
              <div style={styles.opcaoItem}>
                <span style={styles.opcaoIcon}>&#128279;</span>
                <div style={styles.opcaoTexto}>
                  <strong>Link</strong>
                  <span>Cole o link recebido</span>
                </div>
              </div>
            </div>

            {erro && (
              <div style={styles.erroBox}>
                &#9888; {erro}
              </div>
            )}
          </div>

          {/* Instrucoes */}
          <div style={styles.instrucoesCard}>
            <h3 style={styles.instrucoesTitle}>Como funciona:</h3>
            <div style={styles.passos}>
              <div style={styles.passo}>
                <div style={styles.passoNumero}>1</div>
                <div style={styles.passoTexto}>
                  <strong>Cliente recebe QR Code</strong>
                  <span>Enviado por email ou app apos montar carrinho com consultor/vendedor</span>
                </div>
              </div>
              <div style={styles.passo}>
                <div style={styles.passoNumero}>2</div>
                <div style={styles.passoTexto}>
                  <strong>Escaneie no caixa</strong>
                  <span>Use o leitor de codigo de barras ou digite o codigo manualmente</span>
                </div>
              </div>
              <div style={styles.passo}>
                <div style={styles.passoNumero}>3</div>
                <div style={styles.passoTexto}>
                  <strong>Confirme os produtos</strong>
                  <span>Verifique se todos os itens estao corretos</span>
                </div>
              </div>
              <div style={styles.passo}>
                <div style={styles.passoNumero}>4</div>
                <div style={styles.passoTexto}>
                  <strong>Finalize o pagamento</strong>
                  <span>Cliente paga da forma que preferir (dinheiro, cartao, pix)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !venda && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p>Buscando venda...</p>
        </div>
      )}

      {/* Detalhes da Venda */}
      {venda && !integrado && (
        <div style={styles.vendaSection}>
          {/* Info do Cliente/Consultor */}
          <div style={styles.infoRow}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>&#128100;</div>
              <div style={styles.infoContent}>
                <span style={styles.infoLabel}>Cliente</span>
                <strong style={styles.infoNome}>{venda.cliente.nome}</strong>
                <span style={styles.infoDetalhe}>{venda.cliente.telefone}</span>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>&#128188;</div>
              <div style={styles.infoContent}>
                <span style={styles.infoLabel}>
                  {venda.vendedor ? 'Vendedor' : 'Consultor'}
                </span>
                <strong style={styles.infoNome}>
                  {venda.vendedor ? venda.vendedor.nome : venda.consultor.nome}
                </strong>
                <span style={styles.infoDetalhe}>
                  Comissao: {venda.consultor.comissao}%
                </span>
              </div>
            </div>
          </div>

          {/* Lista de Produtos */}
          <div style={styles.produtosCard}>
            <h3 style={styles.produtosTitulo}>
              &#128722; Produtos do Carrinho ({venda.produtos.length} itens)
            </h3>
            
            <div style={styles.produtosLista}>
              {venda.produtos.map((produto, index) => (
                <div key={produto.id} style={styles.produtoItem}>
                  <div style={styles.produtoIndex}>{index + 1}</div>
                  <div style={styles.produtoInfo}>
                    <strong style={styles.produtoNome}>{produto.nome}</strong>
                    <span style={styles.produtoSku}>SKU: {produto.sku}</span>
                  </div>
                  <div style={styles.produtoQtd}>
                    {produto.quantidade}x
                  </div>
                  <div style={styles.produtoPreco}>
                    R$ {produto.preco.toFixed(2)}
                  </div>
                  <div style={styles.produtoTotal}>
                    R$ {(produto.preco * produto.quantidade).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div style={styles.totaisSection}>
              <div style={styles.totalRow}>
                <span>Subtotal:</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
              {venda.desconto > 0 && (
                <div style={styles.totalRow}>
                  <span>Desconto:</span>
                  <span style={{color: '#28a745'}}>- R$ {venda.desconto.toFixed(2)}</span>
                </div>
              )}
              <div style={styles.totalFinal}>
                <span>TOTAL:</span>
                <span>R$ {venda.valorTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botoes de Acao */}
          <div style={styles.acoesRow}>
            <button onClick={novaBusca} style={styles.btnSecundario}>
              &#8592; Nova Busca
            </button>
            <button 
              onClick={confirmarIntegracao} 
              style={styles.btnConfirmar}
              disabled={loading}
            >
              {loading ? 'Processando...' : '&#10003; Confirmar e Ir para Pagamento'}
            </button>
          </div>
        </div>
      )}

      {/* Venda Integrada com Sucesso */}
      {integrado && (
        <div style={styles.sucessoSection}>
          <div style={styles.sucessoCard}>
            <div style={styles.sucessoIcon}>&#10004;</div>
            <h2 style={styles.sucessoTitulo}>Venda Integrada com Sucesso!</h2>
            <p style={styles.sucessoTexto}>
              Os produtos foram adicionados ao sistema. 
              Finalize o pagamento no caixa.
            </p>

            <div style={styles.resumoFinal}>
              <div style={styles.resumoItem}>
                <span>Cliente:</span>
                <strong>{venda.cliente.nome}</strong>
              </div>
              <div style={styles.resumoItem}>
                <span>Itens:</span>
                <strong>{venda.produtos.length} produtos</strong>
              </div>
              <div style={styles.resumoItem}>
                <span>Total:</span>
                <strong style={{color: '#28a745', fontSize: '1.3rem'}}>
                  R$ {venda.valorTotal.toFixed(2)}
                </strong>
              </div>
            </div>

            <div style={styles.sucessoAcoes}>
              <button onClick={() => window.print()} style={styles.btnImprimir}>
                &#128424; Imprimir Comprovante
              </button>
              <button onClick={novaBusca} style={styles.btnNovaVenda}>
                &#43; Nova Venda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS para animacao */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'Inter, -apple-system, sans-serif',
    minHeight: '80vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    color: '#2c5aa0',
    marginBottom: '8px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },

  // Busca
  buscaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  buscaCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  iconBusca: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    padding: '16px 20px',
    fontSize: '1.1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btnBuscar: {
    padding: '16px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  buscaTitulo: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '25px',
  },
  opcoesEntrada: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '30px',
    flexWrap: 'wrap',
  },
  opcaoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  opcaoIcon: {
    fontSize: '1.8rem',
  },
  opcaoTexto: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    fontSize: '0.85rem',
    color: '#666',
  },
  opcaoDivisor: {
    color: '#999',
    fontSize: '0.9rem',
  },
  dica: {
    marginTop: '20px',
    fontSize: '0.9rem',
    color: '#888',
  },
  erroBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    fontWeight: '500',
  },

  // Instrucoes
  instrucoesCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  instrucoesTitle: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '20px',
  },
  passos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  passo: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
  },
  passoNumero: {
    width: '36px',
    height: '36px',
    backgroundColor: '#2c5aa0',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  passoTexto: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  // Loading
  loadingBox: {
    textAlign: 'center',
    padding: '60px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2c5aa0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },

  // Venda
  vendaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: '2.5rem',
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#888',
    textTransform: 'uppercase',
  },
  infoNome: {
    fontSize: '1.2rem',
    color: '#333',
  },
  infoDetalhe: {
    fontSize: '0.9rem',
    color: '#666',
  },

  // Produtos
  produtosCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  produtosTitulo: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  produtosLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  produtoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  produtoIndex: {
    width: '30px',
    height: '30px',
    backgroundColor: '#e0e0e0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#666',
    fontSize: '0.9rem',
  },
  produtoInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  produtoNome: {
    fontSize: '1rem',
    color: '#333',
  },
  produtoSku: {
    fontSize: '0.8rem',
    color: '#999',
  },
  produtoQtd: {
    padding: '5px 12px',
    backgroundColor: '#e3f2fd',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1976d2',
  },
  produtoPreco: {
    fontSize: '0.95rem',
    color: '#666',
    width: '100px',
    textAlign: 'right',
  },
  produtoTotal: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#28a745',
    width: '120px',
    textAlign: 'right',
  },

  // Totais
  totaisSection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '2px dashed #e0e0e0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '1rem',
    color: '#666',
  },
  totalFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#333',
    borderTop: '1px solid #e0e0e0',
    marginTop: '10px',
  },

  // Acoes
  acoesRow: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
  },
  btnSecundario: {
    padding: '15px 25px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    color: '#666',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  btnConfirmar: {
    padding: '15px 35px',
    fontSize: '1.1rem',
    fontWeight: '700',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },

  // Sucesso
  sucessoSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  sucessoCard: {
    backgroundColor: 'white',
    padding: '50px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px',
  },
  sucessoIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#d4edda',
    color: '#28a745',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    margin: '0 auto 25px',
  },
  sucessoTitulo: {
    fontSize: '1.6rem',
    color: '#28a745',
    marginBottom: '10px',
  },
  sucessoTexto: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '30px',
  },
  resumoFinal: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '25px',
  },
  resumoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0',
  },
  sucessoAcoes: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  btnImprimir: {
    padding: '12px 25px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  btnNovaVenda: {
    padding: '12px 25px',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#2c5aa0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default IntegracaoVenda;