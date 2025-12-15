import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@contexts/AuthContext";
import {
  buscarLojaPorUsuario,
  buscarProdutos,
  excluirProduto,
  editarProduto,
} from "./produtos.service";

import ProdutosForm from "./ProdutosForm";
import ProdutosTable from "./ProdutosTable";
import ProdutosModal from "./ProdutosModal";
import styles from "./produtos.styles";

const ProdutosPage = () => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loja, setLoja] = useState(null);

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =========================
     BUSCAR LOJA E PRODUTOS
  ========================== */
  const carregarDados = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Buscar a loja do usuário
      const lojaData = await buscarLojaPorUsuario(userId);
      
      if (!lojaData) {
        setError("Você ainda não tem uma loja cadastrada. Complete seu cadastro primeiro.");
        setLoading(false);
        return;
      }

      setLoja(lojaData);

      // 2. Buscar produtos da loja
      const produtosData = await buscarProdutos(lojaData.id);
      setProdutos(produtosData || []);

    } catch (e) {
      console.error("Erro ao carregar dados:", e);
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

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
    return { texto: "OK", cor: "#28a745" };
  };

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

  // Aguarda autenticação carregar
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

  // Erro (sem loja cadastrada ou outro erro)
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
      {loja && (
        <p style={styles.subtitle}>
          📍 {loja.nome} {loja.cnpj && `(CNPJ: ${loja.cnpj})`}
        </p>
      )}

      {/* Formulário para criar novo produto */}
      <ProdutosForm
        lojaId={loja?.id}
        onSuccess={carregarDados}
      />

      {/* Tabela de produtos existentes */}
      <ProdutosTable
        produtos={produtos}
        onEdit={handleAbrirEdicao}
        onDelete={handleExcluirProduto}
        getStatusEstoque={getStatusEstoque}
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
        />
      )}
    </div>
  );
};

export default ProdutosPage;