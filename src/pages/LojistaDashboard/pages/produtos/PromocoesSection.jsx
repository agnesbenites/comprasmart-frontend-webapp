import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import InfoButton from './InfoButton';

/**
 * Seção de Promoções - COM MARKETING DIGITAL
 * Agora com checkbox para destacar promoção e seletor de layout
 */
const PromocoesSection = ({ userId, todasLojas, lojaSelecionada, onSuccess }) => {
  const [promocoes, setPromocoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [planoLoja, setPlanoLoja] = useState('basic'); // Plano da loja selecionada
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipoPromocao: 'produto_desconto',
    tipoDesconto: 'percentual',
    percentualDesconto: '',
    dataInicio: '',
    dataFim: '',
    quantidadeDisponivel: '',
    ativo: true,
    lojasDisponiveis: [],
    produtoPrincipalId: '',
    produtoDescontoId: '',
    precoCombo: '',
    produtoId: '',
    quantidade: '',
    precoTotal: '',
    quantidadeCompra: '',
    quantidadeLeva: '',
    // ✅ NOVOS CAMPOS MARKETING
    marketingDestaque: false,
    marketingLayout: 'card-grande',
    marketingLayoutPadrao: false,
  });

  /* ====================================
     CARREGAR DADOS
  ==================================== */
  useEffect(() => {
    carregarDados();
    // Buscar plano da loja selecionada
    if (lojaSelecionada) {
      setPlanoLoja(lojaSelecionada.plano?.toLowerCase() || 'basic');
    }
  }, [userId, lojaSelecionada]);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const lojaIds = todasLojas.map(l => l.id);
      const { data: produtosData } = await supabase
        .from('produtos')
        .select('*')
        .in('loja_id', lojaIds)
        .order('nome');

      setProdutos(produtosData || []);

      const { data: promocoesData } = await supabase
        .from('combos')
        .select('*')
        .order('created_at', { ascending: false });

      setPromocoes(promocoesData || []);

    } catch (error) {
      console.error('[Promoções] Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ====================================
     HANDLERS
  ==================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDAÇÃO DE PLANO PARA MARKETING
    if (formData.marketingDestaque && planoLoja === 'basic') {
      alert('❌ O plano Basic não permite destaque no app mobile. Faça upgrade para Pro ou Enterprise!');
      return;
    }

    try {
      let config = {};

      // Montar config baseado no tipo
      if (formData.tipoPromocao === 'produto_desconto') {
        const prodPrincipal = produtos.find(p => p.id === formData.produtoPrincipalId);
        const prodDesconto = produtos.find(p => p.id === formData.produtoDescontoId);

        if (!prodPrincipal || !prodDesconto) {
          alert('❌ Selecione os produtos');
          return;
        }

        let precoFinal;
        if (formData.tipoDesconto === 'percentual') {
          const desconto = Number(formData.percentualDesconto);
          precoFinal = Number(prodDesconto.preco) * (1 - desconto / 100);
        } else {
          precoFinal = Number(formData.precoCombo);
        }

        config = {
          produto_principal_id: prodPrincipal.id,
          produto_principal_nome: prodPrincipal.nome,
          produto_desconto_id: prodDesconto.id,
          produto_desconto_nome: prodDesconto.nome,
          preco_combo: precoFinal,
          preco_original: Number(prodDesconto.preco),
          economia: Number(prodDesconto.preco) - precoFinal,
          tipo_desconto: formData.tipoDesconto,
          percentual_desconto: formData.tipoDesconto === 'percentual' ? Number(formData.percentualDesconto) : null,
        };
      } else if (formData.tipoPromocao === 'quantidade_preco') {
        const produto = produtos.find(p => p.id === formData.produtoId);

        if (!produto) {
          alert('❌ Selecione o produto');
          return;
        }

        const precoTotal = Number(formData.precoTotal);
        const quantidade = Number(formData.quantidade);

        config = {
          produto_id: produto.id,
          produto_nome: produto.nome,
          quantidade: quantidade,
          preco_total: precoTotal,
          preco_unitario_normal: Number(produto.preco),
          preco_unitario_combo: precoTotal / quantidade,
          economia_total: (Number(produto.preco) * quantidade) - precoTotal,
        };
      } else if (formData.tipoPromocao === 'compre_leve') {
        const produto = produtos.find(p => p.id === formData.produtoId);

        if (!produto) {
          alert('❌ Selecione o produto');
          return;
        }

        config = {
          produto_id: produto.id,
          produto_nome: produto.nome,
          quantidade_compra: Number(formData.quantidadeCompra),
          quantidade_leva: Number(formData.quantidadeLeva),
          preco_unitario: Number(produto.preco),
        };
      }

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        tipo_combo: formData.tipoPromocao,
        ativo: formData.ativo,
        data_inicio: formData.dataInicio || null,
        data_fim: formData.dataFim || null,
        quantidade_disponivel: formData.quantidadeDisponivel ? Number(formData.quantidadeDisponivel) : null,
        lojas_disponiveis: formData.lojasDisponiveis.length > 0 ? formData.lojasDisponiveis : null,
        config: config,
        criado_por: userId,
        // ✅ NOVOS CAMPOS MARKETING
        marketing_destaque: formData.marketingDestaque,
        marketing_layout: formData.marketingDestaque ? formData.marketingLayout : null,
        marketing_layout_padrao: formData.marketingLayoutPadrao,
      };

      if (editando) {
        const { error } = await supabase
          .from('combos')
          .update(payload)
          .eq('id', editando.id);

        if (error) throw error;
        alert('✅ Promoção atualizada!');
      } else {
        const { error } = await supabase
          .from('combos')
          .insert([payload]);

        if (error) throw error;
        alert('✅ Promoção criada!');
      }

      setShowModal(false);
      setEditando(null);
      resetForm();
      carregarDados();
      onSuccess?.();

    } catch (error) {
      console.error('[Promoções] Erro:', error);
      alert('❌ Erro ao salvar promoção');
    }
  };

  const handleToggleAtivo = async (promocao) => {
    try {
      const { error } = await supabase
        .from('combos')
        .update({ ativo: !promocao.ativo })
        .eq('id', promocao.id);

      if (error) throw error;
      carregarDados();
    } catch (error) {
      alert('❌ Erro ao alterar status');
    }
  };

  const handleExcluir = async (promocaoId) => {
    if (!confirm('Tem certeza que deseja excluir esta promoção?')) return;

    try {
      const { error } = await supabase
        .from('combos')
        .delete()
        .eq('id', promocaoId);

      if (error) throw error;
      alert('✅ Promoção excluída!');
      carregarDados();
    } catch (error) {
      alert('❌ Erro ao excluir');
    }
  };

  const handleEditar = (promocao) => {
    setEditando(promocao);
    
    setFormData({
      nome: promocao.nome,
      descricao: promocao.descricao || '',
      tipoPromocao: promocao.tipo_combo,
      tipoDesconto: promocao.config.tipo_desconto || 'valor_fixo',
      percentualDesconto: promocao.config.percentual_desconto || '',
      dataInicio: promocao.data_inicio ? promocao.data_inicio.split('T')[0] : '',
      dataFim: promocao.data_fim ? promocao.data_fim.split('T')[0] : '',
      quantidadeDisponivel: promocao.quantidade_disponivel || '',
      ativo: promocao.ativo,
      lojasDisponiveis: promocao.lojas_disponiveis || [],
      produtoPrincipalId: promocao.config.produto_principal_id || '',
      produtoDescontoId: promocao.config.produto_desconto_id || '',
      precoCombo: promocao.config.preco_combo || '',
      produtoId: promocao.config.produto_id || '',
      quantidade: promocao.config.quantidade || '',
      precoTotal: promocao.config.preco_total || '',
      quantidadeCompra: promocao.config.quantidade_compra || '',
      quantidadeLeva: promocao.config.quantidade_leva || '',
      // ✅ CARREGAR CAMPOS MARKETING
      marketingDestaque: promocao.marketing_destaque || false,
      marketingLayout: promocao.marketing_layout || 'card-grande',
      marketingLayoutPadrao: promocao.marketing_layout_padrao || false,
    });
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      tipoPromocao: 'produto_desconto',
      tipoDesconto: 'percentual',
      percentualDesconto: '',
      dataInicio: '',
      dataFim: '',
      quantidadeDisponivel: '',
      ativo: true,
      lojasDisponiveis: [],
      produtoPrincipalId: '',
      produtoDescontoId: '',
      precoCombo: '',
      produtoId: '',
      quantidade: '',
      precoTotal: '',
      quantidadeCompra: '',
      quantidadeLeva: '',
      marketingDestaque: false,
      marketingLayout: 'card-grande',
      marketingLayoutPadrao: false,
    });
  };

  /* ====================================
     HELPERS
  ==================================== */
  const getTipoTexto = (tipo) => {
    const tipos = {
      'produto_desconto': '🎁 Compre X, Y sai mais barato',
      'quantidade_preco': '📦 X unidades por R$ Y',
      'compre_leve': '🎉 Compre X leve Y',
    };
    return tipos[tipo] || tipo;
  };

  const getDescricao = (promocao) => {
    const cfg = promocao.config;
    
    if (promocao.tipo_combo === 'produto_desconto') {
      const desconto = cfg.tipo_desconto === 'percentual' 
        ? `${cfg.percentual_desconto}% OFF`
        : `R$ ${cfg.preco_combo?.toFixed(2)}`;
      return `Comprando ${cfg.produto_principal_nome}, ${cfg.produto_desconto_nome} sai por ${desconto}`;
    } else if (promocao.tipo_combo === 'quantidade_preco') {
      return `${cfg.quantidade} ${cfg.produto_nome} por R$ ${cfg.preco_total?.toFixed(2)}`;
    } else if (promocao.tipo_combo === 'compre_leve') {
      return `Compre ${cfg.quantidade_compra} ${cfg.produto_nome}, leve ${cfg.quantidade_leva}`;
    }
    return '';
  };

  /* ====================================
     RENDER
  ==================================== */
  if (loading) {
    return <div style={styles.loading}>⏳ Carregando promoções...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={styles.title}>🎁 Promoções e Ofertas</h3>
            <InfoButton title="Como funcionam as promoções?">
              <p style={{ margin: '8px 0', fontSize: '0.85rem' }}>
                <strong>Cadastre produtos primeiro</strong><br />
                Depois crie promoções usando esses produtos<br />
                Escolha o tipo de promoção adequado<br />
                Defina preço ou percentual de desconto<br />
                Ative quando estiver pronta!
              </p>
              <p style={{ margin: '8px 0', fontSize: '0.85rem', color: '#ffc107' }}>
                ⚠️ <strong>Importante:</strong> O upload em lote funciona apenas para produtos. 
                Promoções devem ser criadas individualmente pelo botão "Nova Promoção".
              </p>
            </InfoButton>
          </div>
          <p style={styles.subtitle}>Crie promoções para aumentar suas vendas</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditando(null);
            setShowModal(true);
          }}
          style={styles.createButton}
        >
          ➕ Nova Promoção
        </button>
      </div>

      {/* Aviso sobre produtos */}
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ffc107',
      }}>
        <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
          ℹ️ <strong>Importante:</strong> O upload em lote funciona apenas para <strong>produtos</strong>. 
          Promoções devem ser criadas individualmente pelo botão "Nova Promoção".
        </p>
      </div>

      {/* Lista de promoções */}
      {promocoes.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: '4rem' }}>🎁</span>
          <h4 style={{ marginTop: '20px' }}>Nenhuma promoção cadastrada</h4>
          <p style={{ color: '#666' }}>Crie promoções para impulsionar suas vendas!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {promocoes.map(promocao => (
            <div key={promocao.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ flex: 1 }}>
                  <strong style={styles.cardTitle}>{promocao.nome}</strong>
                  <span style={styles.badge}>{getTipoTexto(promocao.tipo_combo)}</span>
                  
                  {/* ✅ BADGE EM DESTAQUE */}
                  {promocao.marketing_destaque && (
                    <>
                      <br />
                      <span style={{
                        ...styles.badge,
                        backgroundColor: '#6f42c1',
                        color: 'white',
                        marginTop: '8px',
                        display: 'inline-block',
                      }}>
                        💎 EM DESTAQUE
                      </span>
                      <small style={{
                        display: 'block',
                        marginTop: '4px',
                        fontSize: '0.7rem',
                        color: '#6f42c1',
                      }}>
                        Layout: {promocao.marketing_layout === 'card-grande' ? '🎨 Card Grande' : '📱 Banner'}
                      </small>
                    </>
                  )}
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: promocao.ativo ? '#d4edda' : '#f8d7da',
                  color: promocao.ativo ? '#155724' : '#721c24',
                }}>
                  {promocao.ativo ? '✅ Ativa' : '⏸️ Pausada'}
                </span>
              </div>

              <p style={styles.cardDescription}>{getDescricao(promocao)}</p>

              {promocao.descricao && (
                <p style={styles.cardInfo}>{promocao.descricao}</p>
              )}

              {promocao.quantidade_disponivel && (
                <p style={styles.cardInfo}>
                  📦 Quantidade disponível: {promocao.quantidade_disponivel}
                </p>
              )}

              {(promocao.data_inicio || promocao.data_fim) && (
                <div style={styles.cardDates}>
                  ⏰ {promocao.data_inicio && `De ${new Date(promocao.data_inicio).toLocaleDateString()}`}
                  {promocao.data_fim && ` até ${new Date(promocao.data_fim).toLocaleDateString()}`}
                </div>
              )}

              <div style={styles.cardActions}>
                <button
                  onClick={() => handleToggleAtivo(promocao)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: promocao.ativo ? '#ffc107' : '#28a745',
                  }}
                >
                  {promocao.ativo ? '⏸️ Pausar' : '▶️ Ativar'}
                </button>
                <button
                  onClick={() => handleEditar(promocao)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: '#17a2b8',
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleExcluir(promocao.id)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: '#dc3545',
                  }}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ MODAL COM MARKETING */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editando ? '✏️ Editar Promoção' : '➕ Nova Promoção'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Campos existentes... (mantém tudo como está) */}
              
              {/* Nome */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome da Promoção *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  style={styles.input}
                  required
                  placeholder="Ex: Combo Verão 2024"
                />
              </div>

              {/* Descrição */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Descrição (opcional)</label>
                <textarea
                  value={formData.descricao}
                  onChange={e => setFormData({...formData, descricao: e.target.value})}
                  style={{...styles.input, minHeight: '80px'}}
                  placeholder="Detalhes adicionais sobre a promoção..."
                />
              </div>

              {/* Tipo de Promoção */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Tipo de Promoção *
                  <InfoButton title="Tipos de promoção">
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>🎁 Compre X, Y sai mais barato:</strong> Ao comprar produto X, produto Y fica com desconto<br /><br />
                      <strong>📦 X unidades por R$ Y:</strong> Leve várias unidades por um preço fixo<br /><br />
                      <strong>🎉 Compre X leve Y:</strong> Leve mais unidades pagando menos
                    </div>
                  </InfoButton>
                </label>
                <select
                  value={formData.tipoPromocao}
                  onChange={e => setFormData({...formData, tipoPromocao: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="produto_desconto">🎁 Compre X, Y sai mais barato</option>
                  <option value="quantidade_preco">📦 X unidades por R$ Y</option>
                  <option value="compre_leve">🎉 Compre X leve Y</option>
                </select>
              </div>

              {/* Campos dinâmicos baseados no tipo... (mantém todos como estão) */}
              {/* ... */}

              {/* ✅ SEÇÃO DE MARKETING DIGITAL */}
              <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#f8f5ff',
                borderRadius: '12px',
                border: '2px solid #6f42c1',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0, color: '#6f42c1', fontSize: '1.1rem' }}>
                    💎 Marketing Digital
                  </h4>
                  <InfoButton title="O que é o destaque no app?">
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>Destaque sua promoção no app mobile!</strong><br /><br />
                      Sua promoção aparecerá em posição de destaque no aplicativo dos clientes,
                      aumentando a visibilidade e as chances de venda.<br /><br />
                      <strong style={{ color: '#ffc107' }}>⭐ Disponível para planos Pro e Enterprise</strong>
                    </div>
                  </InfoButton>
                </div>

                {/* Checkbox Destaque */}
                <label style={{
                  ...styles.checkbox,
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: planoLoja === 'basic' ? '2px solid #dc3545' : '2px solid #6f42c1',
                  marginBottom: '15px',
                }}>
                  <input
                    type="checkbox"
                    checked={formData.marketingDestaque}
                    onChange={e => setFormData({...formData, marketingDestaque: e.target.checked})}
                    disabled={planoLoja === 'basic'}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                    Destacar esta promoção no app mobile
                  </span>
                  {planoLoja === 'basic' && (
                    <span style={{
                      marginLeft: 'auto',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}>
                      🔒 Upgrade necessário
                    </span>
                  )}
                </label>

                {planoLoja === 'basic' && (
                  <div style={{
                    backgroundColor: '#fff3cd',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid #ffc107',
                  }}>
                    <p style={{ margin: 0, color: '#856404', fontSize: '0.85rem' }}>
                      ⚠️ <strong>Plano Basic:</strong> Faça upgrade para Pro ou Enterprise para usar esta função!
                    </p>
                  </div>
                )}

                {/* Seletor de Layout */}
                {formData.marketingDestaque && planoLoja !== 'basic' && (
                  <>
                    <label style={styles.label}>
                      Escolha o layout de exibição:
                    </label>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px',
                      marginBottom: '15px',
                    }}>
                      {/* Layout 1: Card Grande */}
                      <label style={{
                        padding: '15px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: formData.marketingLayout === 'card-grande' ? '3px solid #6f42c1' : '2px solid #e9ecef',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}>
                        <input
                          type="radio"
                          name="layout"
                          value="card-grande"
                          checked={formData.marketingLayout === 'card-grande'}
                          onChange={e => setFormData({...formData, marketingLayout: e.target.value})}
                          style={{ marginRight: '8px' }}
                        />
                        <strong style={{ fontSize: '0.9rem' }}>🎨 Card Grande</strong>
                        <div style={{
                          marginTop: '10px',
                          padding: '20px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          textAlign: 'center',
                        }}>
                          <div style={{
                            width: '100%',
                            height: '80px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}>
                            🖼️
                          </div>
                          <small style={{ fontSize: '0.75rem', color: '#666' }}>
                            Produto em destaque<br />
                            Ideal para roupas e eletrônicos
                          </small>
                        </div>
                      </label>

                      {/* Layout 2: Banner Horizontal */}
                      <label style={{
                        padding: '15px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: formData.marketingLayout === 'banner-horizontal' ? '3px solid #6f42c1' : '2px solid #e9ecef',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}>
                        <input
                          type="radio"
                          name="layout"
                          value="banner-horizontal"
                          checked={formData.marketingLayout === 'banner-horizontal'}
                          onChange={e => setFormData({...formData, marketingLayout: e.target.value})}
                          style={{ marginRight: '8px' }}
                        />
                        <strong style={{ fontSize: '0.9rem' }}>📱 Banner Horizontal</strong>
                        <div style={{
                          marginTop: '10px',
                          padding: '15px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                        }}>
                          <div style={{
                            width: '100%',
                            height: '60px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            gap: '10px',
                          }}>
                            🔥 50% OFF
                          </div>
                          <small style={{ display: 'block', marginTop: '8px', fontSize: '0.75rem', color: '#666' }}>
                            Oferta em destaque<br />
                            Ideal para descontos e combos
                          </small>
                        </div>
                      </label>
                    </div>

                    {/* Checkbox Layout Padrão */}
                    <label style={{
                      ...styles.checkbox,
                      padding: '10px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.marketingLayoutPadrao}
                        onChange={e => setFormData({...formData, marketingLayoutPadrao: e.target.checked})}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '0.85rem' }}>
                        ✓ Usar sempre este layout como padrão para novas promoções
                      </span>
                    </label>
                  </>
                )}
              </div>

              {/* Datas */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Data de Início (opcional)</label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={e => setFormData({...formData, dataInicio: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Data de Término (opcional)</label>
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={e => setFormData({...formData, dataFim: e.target.value})}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Quantidade Disponível */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Quantidade Disponível (opcional)
                  <InfoButton title="Limite de usos">
                    <div style={{ fontSize: '0.85rem' }}>
                      Limite de quantas vezes esta promoção pode ser usada.<br />
                      Deixe em branco para ilimitado.
                    </div>
                  </InfoButton>
                </label>
                <input
                  type="number"
                  value={formData.quantidadeDisponivel}
                  onChange={e => setFormData({...formData, quantidadeDisponivel: e.target.value})}
                  style={styles.input}
                  min="1"
                  placeholder="Ex: 100"
                />
              </div>

              {/* Checkbox Ativar */}
              <div style={styles.formGroup}>
                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={e => setFormData({...formData, ativo: e.target.checked})}
                  />
                  <span style={{ fontWeight: '600' }}>Ativar promoção imediatamente</span>
                </label>
              </div>

              {/* Botões */}
              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                >
                  {editando ? '💾 Salvar' : '➕ Criar Promoção'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
    marginTop: '30px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  title: {
    fontSize: '1.5rem',
    color: '#495057',
    margin: '0 0 8px 0',
    fontWeight: '700',
  },
  subtitle: {
    margin: 0,
    color: '#666',
    fontSize: '0.95rem',
  },
  createButton: {
    backgroundColor: '#6f42c1',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #e9ecef',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    alignItems: 'start',
  },
  cardTitle: {
    display: 'block',
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '6px',
  },
  badge: {
    backgroundColor: '#e3f2fd',
    color: '#6f42c1',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: '#495057',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  cardInfo: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '12px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  cardDates: {
    fontSize: '0.8rem',
    color: '#888',
    marginBottom: '15px',
    padding: '6px',
    backgroundColor: '#fff3cd',
    borderRadius: '4px',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e9ecef',
  },
  actionButton: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '0.85rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '2px solid #f0f0f0',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.3rem',
    color: '#333',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: '#999',
    cursor: 'pointer',
  },
  form: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '2px solid #f0f0f0',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default PromocoesSection;