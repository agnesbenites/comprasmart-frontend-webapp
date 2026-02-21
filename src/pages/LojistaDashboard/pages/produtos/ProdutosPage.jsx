import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import {
  buscarProdutos,
  excluirProduto,
  editarProduto,
} from "./produtos.service";

import ProdutosForm from "./ProdutosForm";
import ProdutosTable from "./ProdutosTable";
import ProdutosModal from "./ProdutosModal";
import UploadEmLote from "./UploadEmLote";
import PromocoesSection from "./PromocoesSection";
import styles from "./produtos.styles";

const ProdutosPage = () => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [todasLojas, setTodasLojas] = useState([]);
  const [lojaMatriz, setLojaMatriz] = useState(null);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =========================
     BUSCAR LOJAS E PRODUTOS
  ========================== */
  const carregarDados = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Buscar TODAS as lojas do usuário
      const { data: lojasData, error: lojasError } = await supabase
        .from('lojas_corrigida')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (lojasError) throw lojasError;
      
      if (!lojasData || lojasData.length === 0) {
        setError("Você ainda não tem uma loja cadastrada. Complete seu cadastro primeiro.");
        setLoading(false);
        return;
      }

      setTodasLojas(lojasData);

      // 2. Identificar loja matriz
      const matriz = lojasData.find(l => l.is_matriz === true) || lojasData[0];
      setLojaMatriz(matriz);

      // 3. Se não tem loja selecionada, usar a matriz
      if (!lojaSelecionada) {
        setLojaSelecionada(matriz);
      }

      // 4. Buscar produtos de TODAS as lojas
      const lojaIds = lojasData.map(l => l.id);
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .in('loja_id', lojaIds)
        .order('created_at', { ascending: false });

      if (produtosError) throw produtosError;

      setProdutos(produtosData || []);

    } catch (e) {
      console.error("Erro ao carregar dados:", e);
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [userId, lojaSelecionada]);

  /* =========================
     HANDLERS
  ========================== */
  const handleExcluirProduto = async (produtoId) => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );
    if (!confirmacao) return;

    try {
      await excluirProduto(produtoId);
      await carregarDados();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir produto.");
    }
  };

  const handleAbrirEdicao = (produto) => {
    setProdutoEditando(produto);
    setIsModalOpen(true);
  };

  const handleSalvarEdicao = async (produtoAtualizado) => {
    try {
      await editarProduto(produtoAtualizado.id, produtoAtualizado);
      setIsModalOpen(false);
      setProdutoEditando(null);
      await carregarDados();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar alterações do produto.");
    }
  };

  const handleSelecionarLoja = (lojaId) => {
    const loja = todasLojas.find(l => l.id === lojaId);
    setLojaSelecionada(loja);
  };

  /* =========================
     Helper para status do estoque
  ========================== */
  const getStatusEstoque = (estoque, estoqueMinimo = 5) => {
    if (estoque <= 0) {
      return { texto: "Sem estoque", cor: "#dc3545" };
    }
    if (estoque <= estoqueMinimo) {
      return { texto: "Estoque baixo", cor: "#ffc107" };
    }
    return { texto: "OK", cor: "#bb25a6" };
  };

  // Filtrar produtos da loja selecionada
  const produtosDaLoja = produtos.filter(p => p.loja_id === lojaSelecionada?.id);

  // Buscar configuração de comissão
  const comissaoGlobal = lojaSelecionada?.comissao_global || 0;
  const comissaoGlobalAtiva = lojaSelecionada?.usa_comissao_global || false;

  /* =========================
     EFFECT
  ========================== */
  useEffect(() => {
    if (!authLoading && userId) {
      carregarDados();
    } else if (!authLoading && !userId) {
      setLoading(false);
      setError("Usuário não autenticado.");
    }
  }, [userId, authLoading, carregarDados]);

  /* =========================
     RENDER
  ========================== */

  // Aguarda autenticação
  if (authLoading) {
    return (
      <div style={styles.loading} data-cy="auth-loading">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Usuário não autenticado
  if (!userId) {
    return (
      <div style={styles.container} data-cy="not-authenticated">
        <h1 style={styles.title}>Produtos</h1>
        <p style={styles.error}>Usuário não autenticado.</p>
      </div>
    );
  }

  // Carregando dados
  if (loading) {
    return (
      <div style={styles.loading} data-cy="produtos-loading">
        <p>Carregando produtos...</p>
      </div>
    );
  }

  // Erro
  if (error) {
    return (
      <div style={styles.container} data-cy="produtos-error">
        <h1 style={styles.title}>Produtos</h1>
        <div style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px"
        }}>
          <p style={{ margin: 0, color: "#856404" }}>⚠️ {error}</p>
        </div>
        <button style={styles.primaryButton} onClick={carregarDados}>
          Tentar novamente
        </button>
      </div>
    );
  }

  // Tela principal
  return (
    <div style={styles.container} data-cy="produtos-container">
      <h1 style={styles.title}>Produtos e Estoque</h1>
      
      {/* Info da loja */}
      {lojaSelecionada && (
        <p style={styles.subtitle}>
           {lojaSelecionada.nome} 
          {lojaSelecionada.id === lojaMatriz?.id && ' (Matriz)'} 
          {lojaSelecionada.cnpj && ` - CNPJ: ${lojaSelecionada.cnpj}`}
        </p>
      )}

      {/* ====================================
           SELETOR DE FILIAL
      ==================================== */}
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '25px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '2px solid #2196f3',
      }}>
        <label style={{
          display: 'block',
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#1565c0',
          marginBottom: '15px',
        }}>
           Selecione a Filial para Gerenciar:
        </label>
        
        {todasLojas.length === 1 ? (
          // Se só tem 1 loja, mostra info
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #2196f3',
          }}>
            <p style={{ margin: 0, color: '#1565c0', fontSize: '1rem' }}>
              <strong>{lojaSelecionada?.nome}</strong>
              {lojaSelecionada?.id === lojaMatriz?.id && ' (Matriz)'}
              <br />
              <small>Todos os produtos e promoções serão cadastrados nesta loja.</small>
            </p>
          </div>
        ) : (
          // Se tem múltiplas, mostra dropdown
          <>
            <select
              value={lojaSelecionada?.id || ''}
              onChange={(e) => handleSelecionarLoja(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1rem',
                border: '2px solid #2196f3',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              {todasLojas.map(loja => (
                <option key={loja.id} value={loja.id}>
                  {loja.nome} {loja.id === lojaMatriz?.id && '(Matriz)'}
                </option>
              ))}
            </select>
            <small style={{
              display: 'block',
              marginTop: '10px',
              color: '#1565c0',
              fontSize: '0.9rem',
            }}>
               Produtos e promoções serão cadastrados na filial selecionada. 
              {lojaSelecionada?.id === lojaMatriz?.id && ' Matriz selecionada por padrão.'}
            </small>
          </>
        )}
      </div>

      {/* Upload em Lote */}
      <UploadEmLote 
        lojaId={lojaSelecionada?.id} 
        onSuccess={carregarDados} 
      />

      {/* Formulário para criar novo produto */}
      <ProdutosForm
        lojaId={lojaSelecionada?.id}
        todasLojas={todasLojas}
        lojaMatriz={lojaMatriz}
        onSuccess={carregarDados}
      />

      {/* Tabela de produtos da loja selecionada */}
      <ProdutosTable
        produtos={produtosDaLoja}
        onEdit={handleAbrirEdicao}
        onDelete={handleExcluirProduto}
        getStatusEstoque={getStatusEstoque}
      />

      {/* Seção de Promoções */}
      <PromocoesSection
        userId={userId}
        todasLojas={todasLojas}
        lojaSelecionada={lojaSelecionada}
        onSuccess={carregarDados}
      />

      {/* Modal de edição de produto */}
      {isModalOpen && produtoEditando && (
        <ProdutosModal
          produto={produtoEditando}
          onClose={() => {
            setIsModalOpen(false);
            setProdutoEditando(null);
          }}
          onSave={handleSalvarEdicao}
          comissaoGlobalAtiva={comissaoGlobalAtiva}
          comissaoGlobal={comissaoGlobal}
        />
      )}
    </div>
  );
};

export default ProdutosPage;