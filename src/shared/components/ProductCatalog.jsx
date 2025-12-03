// shared/components/ProductCatalog.jsx

import React, { useState, useEffect } from 'react';

const ProductCatalog = ({ lojistaId, onAddToCart }) => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [loading, setLoading] = useState(true);

  // Produtos mockados (substituir por API real depois)
  const produtosMock = [
    {
      id: 'prod_001',
      nome: 'Smartphone Galaxy S23',
      descricao: 'Tela 6.1", 128GB, 8GB RAM, Câmera 50MP',
      preco: 2500.00,
      categoria: 'Eletrônicos',
      estoque: 15,
      imagem: '📱',
    },
    {
      id: 'prod_002',
      nome: 'Notebook Dell Inspiron',
      descricao: 'Intel i5, 8GB RAM, SSD 256GB, Tela 15.6"',
      preco: 3200.00,
      categoria: 'Informática',
      estoque: 8,
      imagem: '💻',
    },
    {
      id: 'prod_003',
      nome: 'Smart TV Samsung 55"',
      descricao: '4K UHD, HDR, Smart Tizen, 3 HDMI',
      preco: 2800.00,
      categoria: 'TV e Áudio',
      estoque: 12,
      imagem: '📺',
    },
    {
      id: 'prod_004',
      nome: 'Geladeira Brastemp Frost Free',
      descricao: 'Duplex, 375L, Inox, Classe A',
      preco: 2900.00,
      categoria: 'Eletrodomésticos',
      estoque: 5,
      imagem: '🧊',
    },
    {
      id: 'prod_005',
      nome: 'Fogão Consul 5 Bocas',
      descricao: 'Mesa de vidro, Acendimento automático',
      preco: 890.00,
      categoria: 'Eletrodomésticos',
      estoque: 10,
      imagem: '🔥',
    },
    {
      id: 'prod_006',
      nome: 'Micro-ondas Electrolux 30L',
      descricao: 'Função tostex, 10 receitas pré-programadas',
      preco: 550.00,
      categoria: 'Eletrodomésticos',
      estoque: 20,
      imagem: '📦',
    },
    {
      id: 'prod_007',
      nome: 'Fone Bluetooth JBL',
      descricao: 'Cancelamento de ruído, 20h bateria',
      preco: 299.00,
      categoria: 'Eletrônicos',
      estoque: 35,
      imagem: '🎧',
    },
    {
      id: 'prod_008',
      nome: 'Smartwatch Apple Watch SE',
      descricao: 'GPS, Monitor cardíaco, À prova d\'água',
      preco: 2400.00,
      categoria: 'Wearables',
      estoque: 7,
      imagem: '⌚',
    },
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setProdutos(produtosMock);
      setLoading(false);
    }, 800);
  }, [lojistaId]);

  const produtosFiltrados = produtos.filter((produto) => {
    const matchFiltro =
      filtro === '' ||
      produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(filtro.toLowerCase());

    const matchCategoria =
      categoria === 'todos' || produto.categoria === categoria;

    return matchFiltro && matchCategoria;
  });

  const categorias = ['todos', ...new Set(produtos.map((p) => p.categoria))];

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef',
    },
    header: {
      marginBottom: '20px',
    },
    title: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#2c5aa0',
      marginBottom: '15px',
    },
    filters: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    searchInput: {
      flex: '1',
      minWidth: '200px',
      padding: '10px 15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '0.95rem',
    },
    select: {
      padding: '10px 15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '0.95rem',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    productsList: {
      maxHeight: '500px',
      overflowY: 'auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '15px',
    },
    productCard: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid #e9ecef',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    },
    productImage: {
      fontSize: '3rem',
      textAlign: 'center',
      marginBottom: '10px',
    },
    productName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px',
    },
    productDescription: {
      fontSize: '0.85rem',
      color: '#666',
      marginBottom: '10px',
      lineHeight: '1.3',
      height: '40px',
      overflow: 'hidden',
    },
    productPrice: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#2c5aa0',
      marginBottom: '10px',
    },
    productStock: {
      fontSize: '0.8rem',
      color: '#666',
      marginBottom: '10px',
    },
    addButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#999',
    },
  };

  const handleAddToCart = (produto) => {
    if (onAddToCart) {
      onAddToCart({
        id: produto.id,
        name: produto.nome,
        price: produto.preco,
        quantity: 1,
        percentualComissao: 8, // 8% padrão
        valorComissao: produto.preco * 0.08,
      });
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          Carregando produtos...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📦 Catálogo de Produtos</h3>

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="🔍 Buscar produto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={styles.searchInput}
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={styles.select}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'todos' ? '📋 Todas Categorias' : `📁 ${cat}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
          <p>Nenhum produto encontrado</p>
        </div>
      ) : (
        <div style={styles.productsList}>
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              style={styles.productCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={styles.productImage}>{produto.imagem}</div>
              <div style={styles.productName}>{produto.nome}</div>
              <div style={styles.productDescription}>
                {produto.descricao}
              </div>
              <div style={styles.productPrice}>
                R$ {produto.preco.toFixed(2)}
              </div>
              <div style={styles.productStock}>
                {produto.estoque > 0 ? (
                  <span style={{ color: '#28a745' }}>
                    ✅ {produto.estoque} em estoque
                  </span>
                ) : (
                  <span style={{ color: '#dc3545' }}>❌ Sem estoque</span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(produto)}
                style={styles.addButton}
                disabled={produto.estoque === 0}
                onMouseEnter={(e) => {
                  if (produto.estoque > 0) {
                    e.currentTarget.style.backgroundColor = '#218838';
                  }
                }}
                onMouseLeave={(e) => {
                  if (produto.estoque > 0) {
                    e.currentTarget.style.backgroundColor = '#28a745';
                  }
                }}
              >
                {produto.estoque > 0 ? '➕ Adicionar' : 'Indisponível'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;