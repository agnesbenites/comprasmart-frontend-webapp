// src/pages/VendedorDashboard/pages/VendedorAtendimentoPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import Layout from '@/components/Layout';

const VENDOR_PRIMARY = "#4a6fa5";
const VENDOR_LIGHT_BG = "#eaf2ff";
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const VendedorAtendimentoPage = () => {
  const [vendedorId, setVendedorId] = useState(null);
  const [lojaId, setLojaId] = useState(null);
  const [filaClientes, setFilaClientes] = useState([]);
  const [atendimentoAtual, setAtendimentoAtual] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [mensagensChat, setMensagensChat] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalPagamento, setModalPagamento] = useState(false);

  // ==================== INICIALIZAÇÃO ====================
  
  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    try {
      setLoading(true);
      
      // 1. Buscar dados do vendedor logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: vendedor, error: vendedorError } = await supabase
        .from('vendedores')
        .select('id, loja_id, nome')
        .eq('user_id', user.id)
        .maybeSingle();

      if (vendedorError) throw vendedorError;
      if (!vendedor) throw new Error('Vendedor não encontrado');

      setVendedorId(vendedor.id);
      setLojaId(vendedor.loja_id);

      console.log('[Vendedor] Inicializado:', vendedor);

      // 2. Carregar produtos da loja
      await carregarProdutos(vendedor.loja_id);

      // 3. Carregar fila de atendimento
      await carregarFila(vendedor.loja_id);

    } catch (error) {
      console.error('[Vendedor] Erro ao inicializar:', error);
      alert('Erro ao carregar dados do vendedor');
    } finally {
      setLoading(false);
    }
  };

  // ==================== PRODUTOS ====================

  const carregarProdutos = async (lojaIdParam) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('loja_id', lojaIdParam)
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setProdutos(data || []);
      console.log('[Vendedor] Produtos carregados:', data?.length);
    } catch (error) {
      console.error('[Vendedor] Erro ao carregar produtos:', error);
    }
  };

  // ==================== FILA DE ATENDIMENTO ====================

  const carregarFila = async (lojaIdParam) => {
    try {
      const { data, error } = await supabase
        .from('fila_atendimento')
        .select(`
          *,
          clientes:cliente_id (
            id,
            nome,
            telefone
          )
        `)
        .eq('loja_id', lojaIdParam || lojaId)
        .eq('status', 'aguardando')
        .order('data_entrada', { ascending: true });

      if (error) throw error;
      setFilaClientes(data || []);
      console.log('[Vendedor] Fila atualizada:', data?.length, 'clientes');
    } catch (error) {
      console.error('[Vendedor] Erro ao carregar fila:', error);
    }
  };

  const iniciarAtendimento = async (clienteFila) => {
    try {
      // 1. Atualizar status na fila
      const { error: filaError } = await supabase
        .from('fila_atendimento')
        .update({ 
          status: 'em_atendimento',
          vendedor_id: vendedorId,
          data_inicio_atendimento: new Date().toISOString()
        })
        .eq('id', clienteFila.id);

      if (filaError) throw filaError;

      // 2. Criar registro de atendimento
      const { data: atendimento, error: atendimentoError } = await supabase
        .from('atendimentos')
        .insert({
          cliente_id: clienteFila.cliente_id,
          vendedor_id: vendedorId,
          loja_id: lojaId,
          data_inicio: new Date().toISOString(),
          status: 'em_andamento'
        })
        .select()
        .single();

      if (atendimentoError) throw atendimentoError;

      setAtendimentoAtual({
        ...atendimento,
        cliente: clienteFila.clientes
      });

      // 3. Carregar histórico de mensagens (se existir)
      carregarMensagens(atendimento.id);

      // 4. Atualizar fila
      await carregarFila();

      console.log('[Vendedor] Atendimento iniciado:', atendimento.id);
    } catch (error) {
      console.error('[Vendedor] Erro ao iniciar atendimento:', error);
      alert('Erro ao iniciar atendimento');
    }
  };

  // ==================== CHAT ====================

  const carregarMensagens = async (atendimentoId) => {
    try {
      const { data, error } = await supabase
        .from('mensagens_chat')
        .select('*')
        .eq('atendimento_id', atendimentoId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMensagensChat(data || []);
    } catch (error) {
      console.error('[Vendedor] Erro ao carregar mensagens:', error);
    }
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !atendimentoAtual) return;

    try {
      const { error } = await supabase
        .from('mensagens_chat')
        .insert({
          atendimento_id: atendimentoAtual.id,
          remetente_tipo: 'vendedor',
          remetente_id: vendedorId,
          mensagem: novaMensagem.trim(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setNovaMensagem('');
      await carregarMensagens(atendimentoAtual.id);
    } catch (error) {
      console.error('[Vendedor] Erro ao enviar mensagem:', error);
    }
  };

  // ==================== CARRINHO ====================

  const adicionarAoCarrinho = (produto) => {
    const itemExiste = carrinho.find(item => item.id === produto.id);
    
    if (itemExiste) {
      setCarrinho(carrinho.map(item => 
        item.id === produto.id 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.id !== produtoId));
  };

  const alterarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade < 1) {
      removerDoCarrinho(produtoId);
      return;
    }

    setCarrinho(carrinho.map(item =>
      item.id === produtoId
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => 
      total + (item.preco * item.quantidade), 0
    );
  };

  // ==================== FINALIZAR VENDA ====================

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert('Adicione produtos ao carrinho!');
      return;
    }

    if (!atendimentoAtual) {
      alert('Nenhum atendimento em andamento!');
      return;
    }

    try {
      // 1. Criar pedido
      const valorTotal = calcularTotal();
      
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: atendimentoAtual.cliente_id,
          loja_id: lojaId,
          vendedor_id: vendedorId,
          consultor_id: null, // ← Vendedor, NÃO consultor
          valor_total: valorTotal,
          valor_comissao: 0, // ← SEM comissão para vendedor
          status_pagamento: 'aguardando',
          status_separacao: 'aguardando',
          data_pedido: new Date().toISOString(),
          itens: carrinho.map(item => ({
            produto_id: item.id,
            nome: item.nome,
            quantidade: item.quantidade,
            preco_unitario: item.preco,
            subtotal: item.preco * item.quantidade
          }))
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      console.log('[Vendedor] Pedido criado:', pedido.id);

      // 2. Gerar link de pagamento (sem comissão!)
      const response = await fetch(`${API_URL}/stripe/create-payment-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId: pedido.id,
          vendedorId: vendedorId, // ← Indica que é vendedor
          consultorId: null // ← Sem consultor
        })
      });

      if (!response.ok) throw new Error('Erro ao gerar link de pagamento');

      const { paymentLink } = await response.json();

      // 3. Atualizar pedido com link
      await supabase
        .from('pedidos')
        .update({ stripe_payment_link: paymentLink })
        .eq('id', pedido.id);

      // 4. Mostrar modal com link
      setModalPagamento({
        pedidoId: pedido.id,
        link: paymentLink,
        valor: valorTotal
      });

      // 5. Limpar carrinho
      setCarrinho([]);

      console.log('[Vendedor] Link gerado SEM comissão:', paymentLink);

    } catch (error) {
      console.error('[Vendedor] Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda: ' + error.message);
    }
  };

  const encerrarAtendimento = async () => {
    if (!atendimentoAtual) return;

    if (!window.confirm('Deseja encerrar este atendimento?')) return;

    try {
      // 1. Atualizar atendimento
      await supabase
        .from('atendimentos')
        .update({
          status: 'concluido',
          data_fim: new Date().toISOString()
        })
        .eq('id', atendimentoAtual.id);

      // 2. Remover da fila
      await supabase
        .from('fila_atendimento')
        .delete()
        .eq('cliente_id', atendimentoAtual.cliente_id)
        .eq('loja_id', lojaId);

      // 3. Limpar estado
      setAtendimentoAtual(null);
      setCarrinho([]);
      setMensagensChat([]);

      // 4. Recarregar fila
      await carregarFila();

      console.log('[Vendedor] Atendimento encerrado');
    } catch (error) {
      console.error('[Vendedor] Erro ao encerrar atendimento:', error);
    }
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <Layout title="Atendimento" showHeader={true}>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h3>⏳ Carregando...</h3>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Atendimento ao Cliente" showHeader={true}>
      <div style={styles.container}>
        
        {/* FILA DE CLIENTES */}
        {!atendimentoAtual && (
          <div style={styles.filaSection}>
            <h2 style={styles.sectionTitle}>👥 Fila de Atendimento</h2>
            
            {filaClientes.length === 0 ? (
              <div style={styles.emptyState}>
                <p>😴 Nenhum cliente na fila no momento</p>
              </div>
            ) : (
              <div style={styles.filaGrid}>
                {filaClientes.map(cliente => (
                  <div key={cliente.id} style={styles.clienteCard}>
                    <div style={styles.clienteInfo}>
                      <h3 style={styles.clienteNome}>
                        {cliente.clientes?.nome || 'Cliente'}
                      </h3>
                      <p style={styles.clienteTempo}>
                        ⏱️ Aguardando: {calcularTempoEspera(cliente.data_entrada)}
                      </p>
                    </div>
                    <button
                      onClick={() => iniciarAtendimento(cliente)}
                      style={styles.btnAtender}
                    >
                      📞 Atender
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ATENDIMENTO ATIVO */}
        {atendimentoAtual && (
          <>
            {/* Header do Atendimento */}
            <div style={styles.atendimentoHeader}>
              <div>
                <h2 style={styles.clienteAtendimentoNome}>
                  👤 {atendimentoAtual.cliente?.nome || 'Cliente'}
                </h2>
                <p style={styles.clienteAtendimentoInfo}>
                  📞 {atendimentoAtual.cliente?.telefone || 'Sem telefone'}
                </p>
              </div>
              <button onClick={encerrarAtendimento} style={styles.btnEncerrar}>
                ✅ Encerrar Atendimento
              </button>
            </div>

            <div style={styles.atendimentoContent}>
              
              {/* CHAT */}
              <div style={styles.chatSection}>
                <h3 style={styles.chatTitle}>💬 Chat</h3>
                
                <div style={styles.chatMessages}>
                  {mensagensChat.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.chatMessage,
                        alignSelf: msg.remetente_tipo === 'vendedor' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.remetente_tipo === 'vendedor' ? VENDOR_LIGHT_BG : '#f0f0f0'
                      }}
                    >
                      <p style={styles.chatMessageText}>{msg.mensagem}</p>
                      <span style={styles.chatMessageTime}>
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={styles.chatInput}>
                  <input
                    type="text"
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    placeholder="Digite sua mensagem..."
                    style={styles.chatInputField}
                  />
                  <button onClick={enviarMensagem} style={styles.chatSendBtn}>
                    📤
                  </button>
                </div>
              </div>

              {/* PRODUTOS E CARRINHO */}
              <div style={styles.produtosSection}>
                
                {/* Carrinho */}
                <div style={styles.carrinhoCard}>
                  <h3 style={styles.carrinhoTitle}>🛒 Carrinho</h3>
                  
                  {carrinho.length === 0 ? (
                    <p style={styles.carrinhoEmpty}>Carrinho vazio</p>
                  ) : (
                    <>
                      {carrinho.map(item => (
                        <div key={item.id} style={styles.carrinhoItem}>
                          <div>
                            <p style={styles.carrinhoItemNome}>{item.nome}</p>
                            <p style={styles.carrinhoItemPreco}>
                              R$ {item.preco.toFixed(2)} x {item.quantidade}
                            </p>
                          </div>
                          <div style={styles.carrinhoItemActions}>
                            <button
                              onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                              style={styles.btnQtd}
                            >
                              -
                            </button>
                            <span style={styles.qtdDisplay}>{item.quantidade}</span>
                            <button
                              onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                              style={styles.btnQtd}
                            >
                              +
                            </button>
                            <button
                              onClick={() => removerDoCarrinho(item.id)}
                              style={styles.btnRemover}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}

                      <div style={styles.carrinhoTotal}>
                        <strong>Total:</strong>
                        <strong>R$ {calcularTotal().toFixed(2)}</strong>
                      </div>

                      <button onClick={finalizarVenda} style={styles.btnFinalizar}>
                        💳 Finalizar Venda
                      </button>
                    </>
                  )}
                </div>

                {/* Lista de Produtos */}
                <div style={styles.produtosLista}>
                  <h3 style={styles.produtosTitle}>📦 Produtos Disponíveis</h3>
                  
                  {produtos.length === 0 ? (
                    <p>Nenhum produto disponível</p>
                  ) : (
                    <div style={styles.produtosGrid}>
                      {produtos.map(produto => (
                        <div key={produto.id} style={styles.produtoCard}>
                          <h4 style={styles.produtoNome}>{produto.nome}</h4>
                          <p style={styles.produtoPreco}>R$ {produto.preco?.toFixed(2)}</p>
                          <button
                            onClick={() => adicionarAoCarrinho(produto)}
                            style={styles.btnAdicionar}
                          >
                            ➕ Adicionar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* MODAL DE PAGAMENTO */}
        {modalPagamento && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h2 style={styles.modalTitle}>✅ Venda Finalizada!</h2>
              
              <div style={styles.modalInfo}>
                <p><strong>Pedido:</strong> #{modalPagamento.pedidoId}</p>
                <p><strong>Valor:</strong> R$ {modalPagamento.valor.toFixed(2)}</p>
                <p><strong>Comissão:</strong> R$ 0,00 (Vendedor)</p>
              </div>

              <p style={styles.modalInstrucao}>
                📱 Copie o link e envie para o cliente:
              </p>

              <div style={styles.linkBox}>
                <input
                  type="text"
                  value={modalPagamento.link}
                  readOnly
                  style={styles.linkInput}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(modalPagamento.link);
                    alert('Link copiado!');
                  }}
                  style={styles.btnCopiar}
                >
                  📋 Copiar
                </button>
              </div>

              <button
                onClick={() => setModalPagamento(null)}
                style={styles.btnFecharModal}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// ==================== FUNÇÕES AUXILIARES ====================

const calcularTempoEspera = (dataEntrada) => {
  const agora = new Date();
  const entrada = new Date(dataEntrada);
  const diffMs = agora - entrada;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins} min`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}min`;
};

// ==================== ESTILOS ====================

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  filaSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    color: VENDOR_PRIMARY,
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    color: '#666',
  },
  filaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  clienteCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    margin: '0 0 5px 0',
    color: '#333',
    fontSize: '1.1rem',
  },
  clienteTempo: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem',
  },
  btnAtender: {
    backgroundColor: VENDOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  atendimentoHeader: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteAtendimentoNome: {
    margin: '0 0 5px 0',
    color: VENDOR_PRIMARY,
    fontSize: '1.3rem',
  },
  clienteAtendimentoInfo: {
    margin: 0,
    color: '#666',
  },
  btnEncerrar: {
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  atendimentoContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  chatSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
  },
  chatTitle: {
    margin: '0 0 15px 0',
    color: VENDOR_PRIMARY,
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px',
  },
  chatMessage: {
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: '12px',
    wordWrap: 'break-word',
  },
  chatMessageText: {
    margin: '0 0 5px 0',
    fontSize: '0.95rem',
  },
  chatMessageTime: {
    fontSize: '0.75rem',
    color: '#666',
  },
  chatInput: {
    display: 'flex',
    gap: '10px',
  },
  chatInputField: {
    flex: 1,
    padding: '10px 15px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  chatSendBtn: {
    backgroundColor: VENDOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  produtosSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  carrinhoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  carrinhoTitle: {
    margin: '0 0 15px 0',
    color: VENDOR_PRIMARY,
  },
  carrinhoEmpty: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
  },
  carrinhoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  carrinhoItemNome: {
    margin: '0 0 5px 0',
    fontWeight: '600',
  },
  carrinhoItemPreco: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem',
  },
  carrinhoItemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnQtd: {
    backgroundColor: VENDOR_LIGHT_BG,
    color: VENDOR_PRIMARY,
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  qtdDisplay: {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: '600',
  },
  btnRemover: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  carrinhoTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    marginTop: '10px',
    borderTop: '2px solid #eee',
    fontSize: '1.2rem',
  },
  btnFinalizar: {
    width: '100%',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    marginTop: '10px',
  },
  produtosLista: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  produtosTitle: {
    margin: '0 0 15px 0',
    color: VENDOR_PRIMARY,
  },
  produtosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
  },
  produtoCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
  },
  produtoNome: {
    margin: '0 0 10px 0',
    fontSize: '0.95rem',
    color: '#333',
  },
  produtoPreco: {
    margin: '0 0 10px 0',
    color: VENDOR_PRIMARY,
    fontWeight: '600',
  },
  btnAdicionar: {
    width: '100%',
    backgroundColor: VENDOR_LIGHT_BG,
    color: VENDOR_PRIMARY,
    border: '1px solid ' + VENDOR_PRIMARY,
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%',
  },
  modalTitle: {
    margin: '0 0 20px 0',
    color: VENDOR_PRIMARY,
    textAlign: 'center',
  },
  modalInfo: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  modalInstrucao: {
    marginBottom: '10px',
    fontWeight: '600',
  },
  linkBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  linkInput: {
    flex: 1,
    padding: '10px',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  btnCopiar: {
    backgroundColor: VENDOR_PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  btnFecharModal: {
    width: '100%',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default VendedorAtendimentoPage;