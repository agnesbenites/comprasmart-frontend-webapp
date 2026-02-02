// src/pages/LojistaDashboard/pages/LojistaUsuarios.jsx
// GESTÃO DE EQUIPE COM VALIDAÇÃO DE PLANO

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const LojistaUsuarios = () => {
  const [activeTab, setActiveTab] = useState('vendedores'); // ✅ Começa em vendedores
  const [loading, setLoading] = useState(false);
  const [lojaId, setLojaId] = useState(null);
  const [planoLoja, setPlanoLoja] = useState('basic'); // ✅ Armazena plano
  
  const [admins, setAdmins] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [consultores, setConsultores] = useState([]);

  // Modals
  const [modalAddAdmin, setModalAddAdmin] = useState(false);
  const [modalAddVendedor, setModalAddVendedor] = useState(false);
  const [modalEditPermissoes, setModalEditPermissoes] = useState(false);
  const [adminSelecionado, setAdminSelecionado] = useState(null);
  
  const [formData, setFormData] = useState({});
  
  // ✅ PERMISSÕES CORRIGIDAS - SEGUINDO O PADRÃO
  const [permissoes, setPermissoes] = useState({
    // Produtos
    pode_criar_produto: false,
    pode_editar_produto: false,
    pode_excluir_produto: false,
    pode_alterar_preco: false,
    pode_gerenciar_estoque: false,
    
    // Promoções (atenção aos nomes!)
    pode_criar_promocoes: false,        // COM "S"
    pode_editar_promocao: false,        // SEM "S"
    pode_excluir_promocao: false,       // SEM "S"
    pode_disparar_promocoes: false,     // COM "S"
    
    // Equipe
    pode_gerenciar_vendedores: false,
    pode_gerenciar_consultores: false,
    pode_adicionar_admins: false,
    pode_gerenciar_admins: false,
    
    // Marketing
    pode_usar_marketing_destaque: false,
    
    // Outros
    pode_gerenciar_treinamentos: false,
    pode_visualizar_relatorios: false,
  });

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // ✅ Buscar loja E plano
      const { data: loja } = await supabase
        .from('lojas_corrigida')
        .select('id, plano')
        .eq('user_id', user.id)
        .single();

      if (!loja) {
        alert('❌ Erro: Você não está vinculado a nenhuma loja!');
        return;
      }
      
      setLojaId(loja.id);
      setPlanoLoja(loja.plano?.toLowerCase() || 'basic');

      if (activeTab === 'admins') {
        const { data } = await supabase
          .from('usuarios')
          .select('*')
          .eq('loja_id', loja.id)
          .in('tipo', ['proprietario', 'gerente_geral', 'gerente_vendas', 'supervisor', 'coordenador']);
        
        setAdmins(data || []);
      }

      if (activeTab === 'vendedores') {
        const { data } = await supabase
          .from('vendedores')
          .select('*')
          .eq('loja_id', loja.id);
        
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
          .eq('id_loja', loja.id)
          .eq('status', 'aprovado');
        
        setConsultores(data || []);
      }

    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ VALIDAR SE PODE ACESSAR ADMINS
  const podeGerenciarAdmins = () => {
    return planoLoja === 'pro' || planoLoja === 'enterprise';
  };

  // ✅ VALIDAR LIMITE DE ADMINS
  const validarLimiteAdmins = () => {
    if (planoLoja === 'basic') return false;
    if (planoLoja === 'pro' && admins.length >= 3) {
      alert('❌ Plano Pro permite até 3 administradores. Faça upgrade para Enterprise!');
      return false;
    }
    return true;
  };

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

  // ============================================
  // GERENCIAR PERMISSÕES
  // ============================================
  const handleAbrirPermissoes = async (admin) => {
    if (!podeGerenciarAdmins()) {
      alert('❌ Sistema de permissões disponível apenas nos planos Pro e Enterprise!');
      return;
    }

    setAdminSelecionado(admin);
    
    const { data: perms } = await supabase
      .from('permissoes_usuario')
      .select('*')
      .eq('usuario_id', admin.id)
      .eq('loja_id', lojaId)
      .single();
    
    if (perms) {
      // ✅ Garantir compatibilidade com os novos nomes de campos
      setPermissoes({
        ...permissoes, // Valores padrão
        ...perms // Sobrescreve com os valores do banco
      });
    } else {
      // Reset para valores padrão
      setPermissoes({
        pode_criar_produto: false,
        pode_editar_produto: false,
        pode_excluir_produto: false,
        pode_alterar_preco: false,
        pode_gerenciar_estoque: false,
        pode_criar_promocoes: false,
        pode_editar_promocao: false,
        pode_excluir_promocao: false,
        pode_disparar_promocoes: false,
        pode_gerenciar_vendedores: false,
        pode_gerenciar_consultores: false,
        pode_adicionar_admins: false,
        pode_gerenciar_admins: false,
        pode_usar_marketing_destaque: false,
        pode_gerenciar_treinamentos: false,
        pode_visualizar_relatorios: false,
      });
    }
    
    setModalEditPermissoes(true);
  };

  const handleSalvarPermissoes = async () => {
    if (!adminSelecionado) return;
    
    try {
      const payload = {
        usuario_id: adminSelecionado.id,
        loja_id: lojaId,
        ...permissoes,
      };
      
      const { data: existing } = await supabase
        .from('permissoes_usuario')
        .select('id')
        .eq('usuario_id', adminSelecionado.id)
        .eq('loja_id', lojaId)
        .single();
      
      if (existing) {
        const { error } = await supabase
          .from('permissoes_usuario')
          .update(payload)
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('permissoes_usuario')
          .insert([payload]);
        
        if (error) throw error;
      }
      
      alert('✅ Permissões atualizadas!');
      setModalEditPermissoes(false);
      setAdminSelecionado(null);
      
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
      alert('❌ Erro ao salvar permissões');
    }
  };

  // ============================================
  // ADMINS - FUNÇÕES
  // ============================================
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!podeGerenciarAdmins()) {
      alert('❌ Gestão de administradores disponível apenas nos planos Pro e Enterprise!');
      return;
    }

    if (!validarLimiteAdmins()) {
      return;
    }
    
    if (!lojaId) {
      alert('❌ ERRO: ID da loja não encontrado!');
      return;
    }
    
    try {
      const uuid = crypto.randomUUID();
      
      const novoAdmin = {
        id: uuid,
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
      
      if (formData.tipo !== 'proprietario' && Object.keys(permissoes).some(k => permissoes[k])) {
        await supabase
          .from('permissoes_usuario')
          .insert([{
            usuario_id: uuid,
            loja_id: lojaId,
            ...permissoes,
          }]);
      }
      
      alert('✅ Administrador adicionado!');
      setModalAddAdmin(false);
      setFormData({});
      // Reset para valores padrão
      setPermissoes({
        pode_criar_produto: false,
        pode_editar_produto: false,
        pode_excluir_produto: false,
        pode_alterar_preco: false,
        pode_gerenciar_estoque: false,
        pode_criar_promocoes: false,
        pode_editar_promocao: false,
        pode_excluir_promocao: false,
        pode_disparar_promocoes: false,
        pode_gerenciar_vendedores: false,
        pode_gerenciar_consultores: false,
        pode_adicionar_admins: false,
        pode_gerenciar_admins: false,
        pode_usar_marketing_destaque: false,
        pode_gerenciar_treinamentos: false,
        pode_visualizar_relatorios: false,
      });
      carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao adicionar: ' + error.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
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
      alert('❌ Erro ao excluir');
    }
  };

  const handleToggleAdminStatus = async (adminId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: !currentStatus })
        .eq('id', adminId);

      if (error) throw error;
      
      alert(`✅ Status alterado!`);
      carregarDados();
    } catch (error) {
      alert('❌ Erro ao alterar status');
    }
  };

  // ============================================
  // VENDEDORES - FUNÇÕES (mantém igual)
  // ============================================
  const handleAddVendedor = async (e) => {
    e.preventDefault();
    
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
      
      alert('✅ Vendedor adicionado!');
      setModalAddVendedor(false);
      setFormData({});
      carregarDados();
    } catch (error) {
      alert('❌ Erro: ' + error.message);
    }
  };

  const handleDeleteVendedor = async (vendedorId) => {
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
      alert('❌ Erro ao excluir');
    }
  };

  const handleToggleVendedorStatus = async (vendedorId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('vendedores')
        .update({ ativo: !currentStatus })
        .eq('id', vendedorId);

      if (error) throw error;
      
      alert(`✅ Vendedor ${!currentStatus ? 'ativado' : 'desativado'}!`);
      carregarDados();
    } catch (error) {
      alert('❌ Erro ao alterar status');
    }
  };

  // ============================================
  // CONSULTORES - FUNÇÕES (mantém igual)
  // ============================================
  const handleRemoverConsultor = async (vinculoId) => {
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
      alert('❌ Erro ao remover');
    }
  };

  // ============================================
  // RENDER CHECKBOXES (ATUALIZADO COM OS NOVOS NOMES)
  // ============================================
  const renderCheckboxesPermissoes = () => (
    <div style={styles.permissoesBox}>
      <h4 style={styles.permissoesTitle}>🔐 Permissões de Acesso</h4>
      
      <div style={styles.permissoesGroup}>
        <strong style={styles.permissoesGroupTitle}>📦 Produtos</strong>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_criar_produto} onChange={(e) => setPermissoes({...permissoes, pode_criar_produto: e.target.checked})} />
          Criar produtos
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_editar_produto} onChange={(e) => setPermissoes({...permissoes, pode_editar_produto: e.target.checked})} />
          Editar produtos
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_excluir_produto} onChange={(e) => setPermissoes({...permissoes, pode_excluir_produto: e.target.checked})} />
          Excluir produtos
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_alterar_preco} onChange={(e) => setPermissoes({...permissoes, pode_alterar_preco: e.target.checked})} />
          Alterar preços
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_gerenciar_estoque} onChange={(e) => setPermissoes({...permissoes, pode_gerenciar_estoque: e.target.checked})} />
          Gerenciar estoque
        </label>
      </div>

      <div style={styles.permissoesGroup}>
        <strong style={styles.permissoesGroupTitle}>🎁 Promoções (corrigidas)</strong>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_criar_promocoes} onChange={(e) => setPermissoes({...permissoes, pode_criar_promocoes: e.target.checked})} />
          Criar promoções
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_editar_promocao} onChange={(e) => setPermissoes({...permissoes, pode_editar_promocao: e.target.checked})} />
          Editar promoções
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_excluir_promocao} onChange={(e) => setPermissoes({...permissoes, pode_excluir_promocao: e.target.checked})} />
          Excluir promoções
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_disparar_promocoes} onChange={(e) => setPermissoes({...permissoes, pode_disparar_promocoes: e.target.checked})} />
          Ativar/desativar promoções
        </label>
      </div>

      <div style={styles.permissoesGroup}>
        <strong style={styles.permissoesGroupTitle}>👥 Equipe</strong>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_gerenciar_vendedores} onChange={(e) => setPermissoes({...permissoes, pode_gerenciar_vendedores: e.target.checked})} />
          Gerenciar vendedores
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_gerenciar_consultores} onChange={(e) => setPermissoes({...permissoes, pode_gerenciar_consultores: e.target.checked})} />
          Gerenciar consultores
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_adicionar_admins} onChange={(e) => setPermissoes({...permissoes, pode_adicionar_admins: e.target.checked})} />
          Adicionar administradores
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_gerenciar_admins} onChange={(e) => setPermissoes({...permissoes, pode_gerenciar_admins: e.target.checked})} />
          Gerenciar administradores
        </label>
      </div>

      <div style={styles.permissoesGroup}>
        <strong style={styles.permissoesGroupTitle}>📈 Marketing</strong>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_usar_marketing_destaque} onChange={(e) => setPermissoes({...permissoes, pode_usar_marketing_destaque: e.target.checked})} />
          Usar marketing de destaque
        </label>
      </div>

      <div style={styles.permissoesGroup}>
        <strong style={styles.permissoesGroupTitle}>📊 Outros</strong>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_gerenciar_treinamentos} onChange={(e) => setPermissoes({...permissoes, pode_gerenciar_treinamentos: e.target.checked})} />
          Gerenciar treinamentos
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={permissoes.pode_visualizar_relatorios} onChange={(e) => setPermissoes({...permissoes, pode_visualizar_relatorios: e.target.checked})} />
          Visualizar relatórios
        </label>
      </div>
    </div>
  );

  // ============================================
  // RENDERS
  // ============================================
  const renderAdmins = () => {
    // ✅ Se plano Basic, mostrar mensagem de upgrade
    if (!podeGerenciarAdmins()) {
      return (
        <div style={styles.upgradeBox}>
          <div style={styles.upgradeIcon}>🔒</div>
          <h3 style={styles.upgradeTitle}>Gestão de Administradores</h3>
          <p style={styles.upgradeText}>
            O sistema de permissões e gestão de administradores está disponível apenas nos planos <strong>Pro</strong> e <strong>Enterprise</strong>.
          </p>
          <ul style={styles.upgradeList}>
            <li>✅ Adicionar múltiplos administradores</li>
            <li>✅ Customizar permissões por usuário</li>
            <li>✅ Criar hierarquia de acesso</li>
            <li>✅ Controle granular de funcionalidades</li>
          </ul>
          <button 
            style={styles.upgradeButton}
            onClick={() => window.location.href = '/lojista/planos'}
          >
            🚀 Fazer Upgrade
          </button>
        </div>
      );
    }

    // ✅ Renderização normal para Pro/Enterprise
    return (
      <div>
        <div style={styles.sectionHeader}>
          <div>
            <h2>👤 Administradores da Loja</h2>
            {planoLoja === 'pro' && (
              <small style={{color: '#64748b'}}>
                Plano Pro: até 3 administradores ({admins.length}/3)
              </small>
            )}
          </div>
          <button style={styles.btnPrimary} onClick={() => {
            if (!validarLimiteAdmins()) return;
            setFormData({});
            // Reset para valores padrão
            setPermissoes({
              pode_criar_produto: false,
              pode_editar_produto: false,
              pode_excluir_produto: false,
              pode_alterar_preco: false,
              pode_gerenciar_estoque: false,
              pode_criar_promocoes: false,
              pode_editar_promocao: false,
              pode_excluir_promocao: false,
              pode_disparar_promocoes: false,
              pode_gerenciar_vendedores: false,
              pode_gerenciar_consultores: false,
              pode_adicionar_admins: false,
              pode_gerenciar_admins: false,
              pode_usar_marketing_destaque: false,
              pode_gerenciar_treinamentos: false,
              pode_visualizar_relatorios: false,
            });
            setModalAddAdmin(true);
          }}>
            + Adicionar Admin
          </button>
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
                  {admin.tipo !== 'proprietario' && (
                    <button 
                      style={{...styles.btnAction, backgroundColor: '#6f42c1', color: 'white'}}
                      onClick={() => handleAbrirPermissoes(admin)}
                      title="Gerenciar permissões"
                    >
                      🔐
                    </button>
                  )}
                  <button 
                    style={styles.btnAction}
                    onClick={() => handleToggleAdminStatus(admin.id, admin.ativo)}
                  >
                    {admin.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button 
                    style={styles.btnDanger}
                    onClick={() => handleDeleteAdmin(admin.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderVendedores = () => (
    <div>
      <div style={styles.sectionHeader}>
        <h2>🛍️ Vendedores Próprios</h2>
        <button style={styles.btnPrimary} onClick={() => {
          setFormData({});
          setModalAddVendedor(true);
        }}>
          + Adicionar Vendedor
        </button>
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
                  <button 
                    style={styles.btnDanger}
                    onClick={() => handleRemoverConsultor(vinculo.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

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
          {!podeGerenciarAdmins() && <span style={{marginLeft: '8px'}}>🔒</span>}
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

      {/* MODALS (mantém iguais, adicionando validação no submit) */}
      {modalAddAdmin && podeGerenciarAdmins() && (
        <div style={styles.modalOverlay} onClick={() => setModalAddAdmin(false)}>
          <div style={{...styles.modal, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
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
                  <option value="proprietario">Proprietário</option>
                  <option value="gerente_geral">Gerente Geral</option>
                  <option value="gerente_vendas">Gerente de Vendas</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="coordenador">Coordenador</option>
                </select>
              </div>

              {formData.tipo && formData.tipo !== 'proprietario' && renderCheckboxesPermissoes()}

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

      {modalEditPermissoes && adminSelecionado && podeGerenciarAdmins() && (
        <div style={styles.modalOverlay} onClick={() => setModalEditPermissoes(false)}>
          <div style={{...styles.modal, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              🔐 Permissões: {adminSelecionado.nome}
            </h2>
            <p style={{color: '#666', marginBottom: '20px'}}>
              {formatarTipo(adminSelecionado.tipo)} • {adminSelecionado.email}
            </p>

            {renderCheckboxesPermissoes()}

            <div style={styles.modalActions}>
              <button 
                type="button" 
                style={styles.btnSecondary} 
                onClick={() => setModalEditPermissoes(false)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                style={styles.btnPrimary}
                onClick={handleSalvarPermissoes}
              >
                💾 Salvar Permissões
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

// (Os estilos permanecem os mesmos)
const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
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
    display: 'flex',
    alignItems: 'center',
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
  // ✅ ESTILOS DO UPGRADE BOX
  upgradeBox: {
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '2px dashed #cbd5e1',
  },
  upgradeIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  upgradeTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '15px',
  },
  upgradeText: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  upgradeList: {
    textAlign: 'left',
    maxWidth: '400px',
    margin: '0 auto 40px auto',
    padding: 0,
    listStyle: 'none',
    fontSize: '1rem',
    color: '#475569',
  },
  upgradeButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
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
    gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr',
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
    gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr',
    gap: '10px',
    padding: '12px 15px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    alignItems: 'center',
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
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
    overflowY: 'auto',
    padding: '20px',
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
  permissoesBox: {
    marginTop: '25px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
  },
  permissoesTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.1rem',
    color: '#1e293b',
    fontWeight: '700',
  },
  permissoesGroup: {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e2e8f0',
  },
  permissoesGroupTitle: {
    display: 'block',
    marginBottom: '12px',
    fontSize: '0.95rem',
    color: '#475569',
    fontWeight: '600',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#1e293b',
  },
};

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