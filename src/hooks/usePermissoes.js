// src/hooks/usePermissoes.js
// Hook para verificar permissões do usuário logado

import { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { supabase } from '@/supabaseClient';

// 🎯 FUNÇÃO MAPPER OBRIGATÓRIA
const mapPermissoes = (data = {}) => ({
  pode_criar_produto: !!data.pode_criar_produto,
  pode_editar_produto: !!data.pode_editar_produto,
  pode_excluir_produto: !!data.pode_excluir_produto,
  pode_alterar_preco: !!data.pode_alterar_preco,
  pode_gerenciar_estoque: !!data.pode_gerenciar_estoque,
  pode_criar_promocao: !!data.pode_criar_promocao,
  pode_editar_promocao: !!data.pode_editar_promocao,
  pode_excluir_promocao: !!data.pode_excluir_promocao,
  pode_disparar_promocoes: !!data.pode_disparar_promocoes,
  pode_gerenciar_vendedores: !!data.pode_gerenciar_vendedores,
  pode_gerenciar_consultores: !!data.pode_gerenciar_consultores,
  pode_gerenciar_admins: !!data.pode_gerenciar_admins,
  pode_gerenciar_treinamentos: !!data.pode_gerenciar_treinamentos,
  pode_visualizar_relatorios: !!data.pode_visualizar_relatorios,
});

/**
 * Hook para gerenciar permissões granulares
 */
export const usePermissoes = () => {
  const { user } = useAuth();
  const [permissoes, setPermissoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [lojaId, setLojaId] = useState(null);

  useEffect(() => {
    if (user) {
      carregarPermissoes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const carregarPermissoes = async () => {
    try {
      setLoading(true);

      // 1. Buscar dados do usuário na tabela usuarios
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id, tipo, loja_id')
        .eq('id', user.id)
        .single();

      if (usuarioError) {
        console.error('[usePermissoes] Erro ao buscar usuário:', usuarioError);
        setLoading(false);
        return;
      }

      if (!usuario) {
        console.log('[usePermissoes] Usuário não encontrado na tabela usuarios');
        setLoading(false);
        return;
      }

      setRole(usuario.tipo);
      setLojaId(usuario.loja_id);

      // 2. Se for proprietário, tem todas as permissões
      if (usuario.tipo === 'proprietario') {
        setPermissoes(mapPermissoes({
          pode_criar_produto: true,
          pode_editar_produto: true,
          pode_excluir_produto: true,
          pode_alterar_preco: true,
          pode_gerenciar_estoque: true,
          pode_criar_promocao: true,
          pode_editar_promocao: true,
          pode_excluir_promocao: true,
          pode_disparar_promocoes: true,
          pode_gerenciar_vendedores: true,
          pode_gerenciar_consultores: true,
          pode_gerenciar_admins: true,
          pode_gerenciar_treinamentos: true,
          pode_visualizar_relatorios: true,
        }));
        setLoading(false);
        return;
      }

      // 3. Para outros tipos, buscar permissões específicas
      const { data: perms, error: permsError } = await supabase
        .from('permissoes_usuario')
        .select('*')
        .eq('usuario_id', usuario.id)
        .eq('loja_id', usuario.loja_id)
        .single();

      // 4. Se não tem permissões cadastradas, usar padrões do tipo
      if (!perms || permsError?.code === 'PGRST116') {
        const permissoesPadrao = getPermissoesPadraoPorTipo(usuario.tipo);
        setPermissoes(mapPermissoes(permissoesPadrao));
      } else {
        // 🔴 CORREÇÃO CRÍTICA AQUI
        setPermissoes(mapPermissoes(perms));
      }

    } catch (error) {
      console.error('[usePermissoes] Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const temPermissao = (permissao) => {
    if (!permissoes) return false;
    if (role === 'proprietario') return true;
    return permissoes[permissao] === true;
  };

  /**
   * Verifica se pode fazer alguma ação (OR lógico)
   */
  const podeAlgumaDestas = (permissoesArray) => {
    return permissoesArray.some(p => temPermissao(p));
  };

  /**
   * Verifica se pode fazer todas as ações (AND lógico)
   */
  const podeTodasEstas = (permissoesArray) => {
    return permissoesArray.every(p => temPermissao(p));
  };

  return {
    permissoes,
    loading,
    role,
    lojaId,
    temPermissao,
    podeAlgumaDestas,
    podeTodasEstas,
  };
};

/**
 * Permissões padrão por tipo de usuário
 */
const getPermissoesPadraoPorTipo = (tipo) => {
  const permissoesPadrao = {
    gerente_geral: {
      pode_criar_produto: true,
      pode_editar_produto: true,
      pode_excluir_produto: true,
      pode_alterar_preco: true,
      pode_gerenciar_estoque: true,
      pode_criar_promocao: true,
      pode_editar_promocao: true,
      pode_excluir_promocao: true,
      pode_disparar_promocoes: true,
      pode_gerenciar_vendedores: true,
      pode_gerenciar_consultores: true,
      pode_gerenciar_admins: false,
      pode_gerenciar_treinamentos: true,
      pode_visualizar_relatorios: true,
    },
    
    gerente_vendas: {
      pode_criar_produto: false,
      pode_editar_produto: true,
      pode_excluir_produto: false,
      pode_alterar_preco: true,
      pode_gerenciar_estoque: true,
      pode_criar_promocao: true,
      pode_editar_promocao: true,
      pode_excluir_promocao: false,
      pode_disparar_promocoes: true,
      pode_gerenciar_vendedores: true,
      pode_gerenciar_consultores: true,
      pode_gerenciar_admins: false,
      pode_gerenciar_treinamentos: true,
      pode_visualizar_relatorios: true,
    },
    
    supervisor: {
      pode_criar_produto: false,
      pode_editar_produto: true,
      pode_excluir_produto: false,
      pode_alterar_preco: false,
      pode_gerenciar_estoque: true,
      pode_criar_promocao: false,
      pode_editar_promocao: true,
      pode_excluir_promocao: false,
      pode_disparar_promocoes: true,
      pode_gerenciar_vendedores: true,
      pode_gerenciar_consultores: false,
      pode_gerenciar_admins: false,
      pode_gerenciar_treinamentos: false,
      pode_visualizar_relatorios: true,
    },
    
    coordenador: {
      pode_criar_produto: false,
      pode_editar_produto: false,
      pode_excluir_produto: false,
      pode_alterar_preco: false,
      pode_gerenciar_estoque: true,
      pode_criar_promocao: false,
      pode_editar_promocao: false,
      pode_excluir_promocao: false,
      pode_disparar_promocoes: false,
      pode_gerenciar_vendedores: false,
      pode_gerenciar_consultores: false,
      pode_gerenciar_admins: false,
      pode_gerenciar_treinamentos: false,
      pode_visualizar_relatorios: true,
    },
  };

  return permissoesPadrao[tipo] || {};
};

export default usePermissoes;