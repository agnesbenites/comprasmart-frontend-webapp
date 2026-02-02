// src/pages/LojistaDashboard/pages/LojistaUsuarios.jsx
// PÁGINA UNIFICADA COM TODAS AS FUNCIONALIDADES + PERMISSÕES INTEGRADAS

import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@contexts/AuthContext';
import { usePermissoes } from '@/hooks/usePermissoes';

const LojistaUsuarios = () => {
  const { user } = useAuth();
  const { temPermissao, loading: loadingPerms, lojaId: lojaIdFromPerms } = usePermissoes();
  
  const [activeTab, setActiveTab] = useState('admins');
  const [loading, setLoading] = useState(false);
  const [lojaId, setLojaId] = useState(null);
  
  const [admins, setAdmins] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [consultores, setConsultores] = useState([]);

  // Modals
  const [modalAddAdmin, setModalAddAdmin] = useState(false);
  const [modalAddVendedor, setModalAddVendedor] = useState(false);
  const [modalPermissoes, setModalPermissoes] = useState(false);
  const [formData, setFormData] = useState({});
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [permissoesModal, setPermissoesModal] = useState({});

  // Permissões base
  const permissoesBase = {
    pode_criar_produto: false,
    pode_editar_produto: false,
    pode_excluir_produto: false,
    pode_alterar_preco: false,
    pode_gerenciar_estoque: false,
    pode_criar_promocao: false,
    pode_editar_promocao: false,
    pode_excluir_promocao: false,
    pode_disparar_promocoes: false,
    pode_gerenciar_vendedores: false,
    pode_gerenciar_consultores: false,
    pode_gerenciar_admins: false,
    pode_gerenciar_treinamentos: false,
    pode_visualizar_relatorios: false,
  };

  const mapPermissoes = (data = {}) => ({
    ...permissoesBase,
    ...Object.keys(permissoesBase).reduce((acc, key) => {
      acc[key] = !!data[key];
      return acc;
    }, {}),
  });

  useEffect(() => {
    if (lojaIdFromPerms) {
      setLojaId(lojaIdFromPerms);
    } else {
      carregarLojaId();
    }
  }, [lojaIdFromPerms]);

  useEffect(() => {
    if (lojaId) {
      carregarDados();
    }
  }, [activeTab, lojaId]);

  const carregarLojaId = async () => {
    try {
      const { data: loja, error } = await supabase
        .from('lojas_corrigida')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (loja) {
        setLojaId(loja.id);
      }
    } catch (error) {
      console.error('Erro ao carregar loja:', error);
    }
  };

  const carregarDados = async () => {
    if (!lojaId) return;
    
    setLoading(true);
    try {
      if (activeTab === 'admins') {
        const { data } = await supabase
          .from('usuarios')
          .select('*')
          .eq('loja_id', lojaId)
          .in('tipo', ['proprietario', 'gerente_geral', 'gerente_vendas', 'supervisor', 'coordenador'])
          .order('nome');
        
        setAdmins(data || []);
      }

      if (activeTab === 'vendedores') {
        const { data } = await supabase
          .from('vendedores')
          .select('*')
          .eq('loja_id', lojaId)
          .order('nome');
        
        setVendedores(data || []);
      }

      if (activeTab === 'consultores') {
        const { data } = await supabase
          .from('loja_consultor')
          .select(`
            *,
            consultor:id_consultor (
              id,
              nome,
              email
            )
          `)
          .eq('id_loja', lojaId)
          .eq('status', 'aprovado');
        
        setConsultores(data || []);
      }

    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNÇÕES DE PERMISSÕES
  // ============================================
  const abrirPermissoes = async (usuario) => {
    if (!temPermissao('pode_gerenciar_admins')) {
      alert('❌ Você não tem permissão para gerenciar permissões de usuários');
      return;
    }

    if (usuario.tipo === 'proprietario') {
      alert('❌ As permissões do proprietário não podem ser alteradas');
      return;
    }

    setUsuarioSelecionado(usuario);
    setPermissoesModal(permissoesBase);

    const { data } = await supabase
      .from('permissoes_usuario')
      .select('*')
      .eq('usuario_id', usuario.id)
      .eq('loja_id', usuario.loja_id)
      .single();

    if (data) {
      setPermissoesModal(mapPermissoes(data));
    }

    setModalPermissoes(true);
  };

  const salvarPermissoes = async () => {
    if (!usuarioSelecionado) return;

    const payload = {
      usuario_id: usuarioSelecionado.id,
      loja_id: usuarioSelecionado.loja_id,
      ...mapPermissoes(permissoesModal),
    };

    const { data: existente } = await supabase
      .from('permissoes_usuario')
      .select('id')
      .eq('usuario_id', payload.usuario_id)
      .eq('loja_id', payload.loja_id)
      .single();

    if (existente) {
      await supabase
        .from('permissoes_usuario')
        .update(payload)
        .eq('id', existente.id);
    } else {
      await supabase
        .from('permissoes_usuario')
        .insert(payload);
    }

    alert('✅ Permissões atualizadas com sucesso!');
    setModalPermissoes(false);
    setUsuarioSelecionado(null);
    setPermissoesModal({});
  };

  // ============================================
  // ADMINS - FUNÇÕES
  // ============================================
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!temPermissao('pode_gerenciar_admins')) {
      alert('❌ Você não tem permissão para adicionar administradores');
      return;
    }
    
    if (!lojaId) {
      alert('❌ ERRO: ID da loja não encontrado!');
      return;
    }
    
    try {
      const novoAdmin = {
        id: crypto.randomUUID(),
        nome: formData.nome,
        email: formData.email,
        tipo: formData.tipo || 'gerente_geral',
        loja_id: lojaId,
        ativo: true,
      };
      
      const { error } = await supabase
        .from('usuarios')
        .insert([novoAdmin]);

      if (error) throw error;
      
      alert('✅ Administrador adicionado com sucesso!');
      setModalAddAdmin(false);
      setFormData({});
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao adicionar administrador: ' + error.message);
    }
  };

  const handleDeleteAdmin = async (adminId, adminTipo) => {
    if (!temPermissao('pode_gerenciar_admins')) {
      alert('❌ Você não tem permissão para excluir administradores');
      return;
    }

    if (adminTipo === 'proprietario') {
      alert('❌ Não é possível excluir o proprietário da loja');
      return;
    }

    if (!confirm('Deseja realmente excluir este administrador?')) return;

    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', adminId);

      if (error) throw error;
      
      alert('✅ Administrador excluído!');
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao excluir');
    }
  };

  const handleToggleAdminStatus = async (adminId, currentStatus, adminTipo) => {
    if (!temPermissao('pode_gerenciar_admins')) {
      alert('❌ Você não tem permissão para alterar status de administradores');
      return;
    }

    if (adminTipo === 'proprietario') {
      alert('❌ Não é possível desativar o proprietário da loja');
      return;
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: !currentStatus })
        .eq('id', adminId);

      if (error) throw error;
      
      alert(`✅ Status alterado para ${!currentStatus ? 'Ativo' : 'Inativo'}!`);
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao alterar status');
    }
  };

  // ============================================
  // VENDEDORES - FUNÇÕES
  // ============================================
  const handleAddVendedor = async (e) => {
    e.preventDefault();
    
    if (!temPermissao('pode_gerenciar_vendedores')) {
      alert('❌ Você não tem permissão para adicionar vendedores');
      return;
    }
    
    if (!lojaId) {
      alert('❌ ERRO: ID da loja não encontrado!');
      return;
    }
    
    try {
      const novoVendedor = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || null,
        loja_id: lojaId,
        ativo: true,
      };
      
      const { error } = await supabase
        .from('vendedores')
        .insert([novoVendedor]);

      if (error) throw error;
      
      alert('✅ Vendedor adicionado com sucesso!');
      setModalAddVendedor(false);
      setFormData({});
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao adicionar vendedor: ' + error.message);
    }
  };

  const handleDeleteVendedor = async (vendedorId) => {
    if (!temPermissao('pode_gerenciar_vendedores')) {
      alert('❌ Você não tem permissão para excluir vendedores');
      return;
    }

    if (!confirm('Deseja realmente excluir este vendedor?')) return;

    try {
      const { error } = await supabase
        .from('vendedores')
        .delete()
        .eq('id', vendedorId);

      if (error) throw error;
      
      alert('✅ Vendedor excluído!');
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao excluir');
    }
  };

  const handleToggleVendedorStatus = async (vendedorId, currentStatus) => {
    if (!temPermissao('pode_gerenciar_vendedores')) {
      alert('❌ Você não tem permissão para alterar status de vendedores');
      return;
    }

    try {
      const { error } = await supabase
        .from('vendedores')
        .update({ ativo: !currentStatus })
        .eq('id', vendedorId);

      if (error) throw error;
      
      alert(`✅ Vendedor ${!currentStatus ? 'ativado' : 'desativado'}!`);
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao alterar status');
    }
  };

  // ============================================
  // CONSULTORES - FUNÇÕES
  // ============================================
  const handleRemoverConsultor = async (vinculoId) => {
    if (!temPermissao('pode_gerenciar_consultores')) {
      alert('❌ Você não tem permissão para remover consultores');
      return;
    }

    if (!confirm('Deseja realmente remover este consultor?')) return;

    try {
      const { error } = await supabase
        .from('loja_consultor')
        .update({ status: 'removido' })
        .eq('id', vinculoId);

      if (error) throw error;
      
      alert('✅ Consultor removido!');
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao remover consultor');
    }
  };

  // ============================================
  // RENDERS
  // ============================================
  const formatarTipo = (tipo) => {
    const tipos = {
      'proprietario': 'Proprietário',
      'gerente_geral': 'Gerente Geral',
      'gerente_vendas': 'Gerente de Vendas',
      'supervisor': 'Supervisor',
      'coordenador': 'Coordenador',
    };
    return tipos[tipo] || tipo;
  };

  const renderAdmins = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2>👤 Administradores da Loja</h2>
        {temPermissao('pode_gerenciar_admins') && (
          <button style={styles.btnPrimary} onClick={() => {
            setFormData({});
            setModalAddAdmin(true);
          }}>
            + Adicionar Admin
          </button>
        )}
      </div>

      {admins.length === 0 ? (
        <div style={styles.empty}>
          <p>Nenhum administrador cadastrado</p>
        </div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div>Nome</div>
            <div>Email</div>
            <div>Perfil</div>
            <div>Status</div>
            <div>Ações</div>
          </div>
          {admins.map((admin) => (
            <div key={admin.id} style={styles.tableRow}>
              <div>{admin.nome}</div>
              <div>{admin.email}</div>
              <div><span style={styles.badge}>{formatarTipo(admin.tipo)}</span></div>
              <div>
                <span style={{...styles.badge, backgroundColor: admin.ativo ? '#10b981' : '#ef4444'}}>
                  {admin.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div style={styles.actionsCell}>
                {temPermissao('pode_gerenciar_admins') && admin.tipo !== 'proprietario' && (
                  <>
                    <button 
                      style={styles.btnAction}
                      onClick={() => abrirPermissoes(admin)}
                    >
                      🔐 Permissões
                    </button>
                    <button 
                      style={styles.btnAction}
                      onClick={() => handleToggleAdminStatus(admin.id, admin.ativo, admin.tipo)}
                    >
                      {admin.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button 
                      style={styles.btnDanger}
                      onClick={() => handleDeleteAdmin(admin.id, admin.tipo)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVendedores = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2>🛍️ Vendedores Próprios</h2>
        {temPermissao('pode_gerenciar_vendedores') && (
          <button style={styles.btnPrimary} onClick={() => {
            setFormData({});
            setModalAddVendedor(true);
          }}>
            + Adicionar Vendedor
          </button>
        )}
      </div>

      {vendedores.length === 0 ? (
        <div style={styles.empty}>
          <p>Nenhum vendedor cadastrado</p>
        </div>
      ) : (
        <div style={styles.cardsGrid}>
          {vendedores.map((vendedor) => (
            <div key={vendedor.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>{vendedor.nome?.[0]}</div>
                <div>
                  <div style={styles.cardName}>{vendedor.nome}</div>
                  <div style={styles.cardEmail}>{vendedor.email}</div>
                  <div style={styles.cardPhone}>{vendedor.telefone}</div>
                </div>
              </div>
              <div style={styles.cardActions}>
                {temPermissao('pode_gerenciar_vendedores') && (
                  <>
                    <button 
                      style={styles.btnAction}
                      onClick={() => handleToggleVendedorStatus(vendedor.id, vendedor.ativo)}
                    >
                      {vendedor.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button 
                      style={styles.btnDanger}
                      onClick={() => handleDeleteVendedor(vendedor.id)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderConsultores = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2>🤝 Consultores Externos</h2>
        <p style={styles.sectionSubtitle}>Consultores aprovados para vender em sua loja</p>
      </div>

      {consultores.length === 0 ? (
        <div style={styles.empty}>
          <p>Nenhum consultor vinculado</p>
        </div>
      ) : (
        <div style={styles.cardsGrid}>
          {consultores.map((vinculo) => {
            const consultor = vinculo.consultor;
            if (!consultor) return null;
            
            return (
              <div key={vinculo.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.avatarGreen}>{consultor.nome?.[0] || 'C'}</div>
                  <div>
                    <div style={styles.cardName}>{consultor.nome || 'Consultor'}</div>
                    <div style={styles.cardEmail}>{consultor.email || 'N/A'}</div>
                  </div>
                </div>
                <div style={styles.cardActions}>
                  {temPermissao('pode_gerenciar_consultores') && (
                    <button 
                      style={styles.btnDanger}
                      onClick={() => handleRemoverConsultor(vinculo.id)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (loadingPerms) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando permissões...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Gestão de Equipe</h1>
        <p style={styles.subtitle}>Gerencie administradores, vendedores e consultores</p>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('admins')}
          style={{...styles.tab, ...(activeTab === 'admins' ? styles.tabActive : {})}}
        >
          👤 Administradores
        </button>
        <button
          onClick={() => setActiveTab('vendedores')}
          style={{...styles.tab, ...(activeTab === 'vendedores' ? styles.tabActive : {})}}
        >
          🛍️ Vendedores
        </button>
        <button
          onClick={() => setActiveTab('consultores')}
          style={{...styles.tab, ...(activeTab === 'consultores' ? styles.tabActive : {})}}
        >
          🤝 Consultores
        </button>
      </div>

      {/* CONTEÚDO */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            {activeTab === 'admins' && renderAdmins()}
            {activeTab === 'vendedores' && renderVendedores()}
            {activeTab === 'consultores' && renderConsultores()}
          </>
        )}
      </div>

      {/* MODAL ADD ADMIN */}
      {modalAddAdmin && (
        <div style={styles.modalOverlay} onClick={() => setModalAddAdmin(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Adicionar Administrador</h2>
            <form onSubmit={handleAddAdmin}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome Completo *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  style={styles.input}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Perfil *</label>
                <select
                  style={styles.input}
                  value={formData.tipo || 'gerente_geral'}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option value="gerente_geral">Gerente Geral</option>
                  <option value="gerente_vendas">Gerente de Vendas</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="coordenador">Coordenador</option>
                </select>
                <small style={{color: '#64748b', fontSize: '0.85rem'}}>
                  * O tipo "Proprietário" é reservado apenas para o criador da loja
                </small>
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setModalAddAdmin(false)}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD VENDEDOR */}
      {modalAddVendedor && (
        <div style={styles.modalOverlay} onClick={() => setModalAddVendedor(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Adicionar Vendedor</h2>
            <form onSubmit={handleAddVendedor}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome Completo *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  style={styles.input}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Telefone</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={formData.telefone || ''}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setModalAddVendedor(false)}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERMISSÕES */}
      {modalPermissoes && usuarioSelecionado && (
        <div style={styles.modalOverlay} onClick={() => setModalPermissoes(false)}>
          <div style={{...styles.modal, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              🔐 Permissões de {usuarioSelecionado.nome}
              <div style={{fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal', marginTop: '5px'}}>
                {formatarTipo(usuarioSelecionado.tipo)}
              </div>
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '15px',
              marginBottom: '25px'
            }}>
              {Object.keys(permissoesModal).map((key) => (
                <label key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={permissoesModal[key]}
                    onChange={(e) =>
                      setPermissoesModal({
                        ...permissoesModal,
                        [key]: e.target.checked,
                      })
                    }
                    style={{marginRight: '10px'}}
                  />
                  <div>
                    <div style={{fontWeight: '600'}}>
                      {key.replace(/_/g, ' ').replace('pode ', '').replace(/^\w/, c => c.toUpperCase())}
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#64748b'}}>
                      {getDescricaoPermissao(key)}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div style={styles.modalActions}>
              <button 
                type="button" 
                style={styles.btnSecondary} 
                onClick={() => setModalPermissoes(false)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                style={styles.btnPrimary}
                onClick={salvarPermissoes}
              >
                Salvar Permissões
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getDescricaoPermissao = (key) => {
  const descricoes = {
    pode_criar_produto: 'Criar novos produtos no catálogo',
    pode_editar_produto: 'Editar informações de produtos existentes',
    pode_excluir_produto: 'Remover produtos do catálogo',
    pode_alterar_preco: 'Alterar preços de produtos',
    pode_gerenciar_estoque: 'Atualizar estoque e inventário',
    pode_criar_promocao: 'Criar novas promoções e descontos',
    pode_editar_promocao: 'Editar promoções existentes',
    pode_excluir_promocao: 'Remover promoções',
    pode_disparar_promocoes: 'Ativar/desativar promoções',
    pode_gerenciar_vendedores: 'Adicionar/remover vendedores próprios',
    pode_gerenciar_consultores: 'Gerenciar consultores externos',
    pode_gerenciar_admins: 'Gerenciar outros administradores',
    pode_gerenciar_treinamentos: 'Gerenciar materiais de treinamento',
    pode_visualizar_relatorios: 'Acessar relatórios e análises',
  };
  return descricoes[key] || '';
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid #e2e8f0',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: '#64748b',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tabActive: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  sectionSubtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '5px',
  },
  btnPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnAction: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  btnDanger: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 20px',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr 1fr 2fr',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px 8px 0 0',
    fontWeight: '600',
    color: '#64748b',
    fontSize: '0.9rem',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr 1fr 2fr',
    gap: '10px',
    padding: '12px 15px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    alignItems: 'center',
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  avatarGreen: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  cardName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  cardEmail: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  cardPhone: {
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '30px',
  },
};

// Animação
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('[data-usuarios-spinner]')) {
  styleSheet.setAttribute('data-usuarios-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export default LojistaUsuarios;