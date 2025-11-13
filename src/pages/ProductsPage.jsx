import React, { useState, useEffect } from "react";

const ProductsPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);

  // Dados mockados - depois você conecta com sua API
  const produtosMock = [
    {
      id: 1,
      sku: "SM-001",
      nome: "Smartphone Galaxy Pro",
      descricao: "Smartphone Android com 128GB, tela 6.7'', câmera tripla 108MP",
      preco: 899.99,
      precoPromocional: 799.99,
      categoria: "Eletrônicos",
      departamento: "Tecnologia",
      estoque: 45,
      imagem: "📱",
      status: "ativo",
      tags: ["smartphone", "android", "128gb", "camera108mp"]
    },
    {
      id: 2,
      sku: "NB-002",
      nome: "Notebook Ultra Slim",
      descricao: "Notebook Intel i7, 16GB RAM, SSD 512GB, tela 15.6'' Full HD",
      preco: 2499.99,
      precoPromocional: 2199.99,
      categoria: "Informática",
      departamento: "Tecnologia",
      estoque: 12,
      imagem: "💻",
      status: "ativo",
      tags: ["notebook", "intel i7", "16gb ram", "ssd512gb"]
    },
    {
      id: 3,
      sku: "TB-003",
      nome: "Tablet Pro 10''",
      descricao: "Tablet 10 polegadas, 64GB, caneta stylus inclusa, ideal para trabalhos criativos",
      preco: 599.99,
      precoPromocional: null,
      categoria: "Eletrônicos",
      departamento: "Tecnologia",
      estoque: 28,
      imagem: "📟",
      status: "ativo",
      tags: ["tablet", "10pol", "stylus", "64gb"]
    },
    {
      id: 4,
      sku: "HF-004",
      nome: "Fone Bluetooth Pro",
      descricao: "Fone de ouvido sem fio, cancelamento de ruído ativo, bateria 30h",
      preco: 199.99,
      precoPromocional: 159.99,
      categoria: "Áudio",
      departamento: "Tecnologia",
      estoque: 67,
      imagem: "🎧",
      status: "ativo",
      tags: ["fone", "bluetooth", "cancelamento-ruido", "30h-bateria"]
    },
    {
      id: 5,
      sku: "WM-005",
      nome: "Smartwatch Fitness",
      descricao: "Relógio inteligente com monitor cardíaco, GPS, resistente à água",
      preco: 299.99,
      precoPromocional: 249.99,
      categoria: "Wearables",
      departamento: "Tecnologia",
      estoque: 23,
      imagem: "⌚",
      status: "ativo",
      tags: ["smartwatch", "fitness", "gps", "cardiaco"]
    },
    {
      id: 6,
      sku: "SP-006",
      nome: "Caixa de Som JBL",
      descricao: "Caixa de som Bluetooth à prova d'água, som surround 360°",
      preco: 149.99,
      precoPromocional: 129.99,
      categoria: "Áudio",
      departamento: "Tecnologia",
      estoque: 34,
      imagem: "🔊",
      status: "ativo",
      tags: ["caixa-som", "bluetooth", "agua", "jbl"]
    }
  ];

  // Simular carregamento
  useEffect(() => {
    setTimeout(() => {
      setProdutos(produtosMock);
      setCarregando(false);
    }, 1000);
  }, []);

  // Filtros
  const produtosFiltrados = produtos.filter(produto => {
    const termoPesquisa = pesquisa.toLowerCase();
    const matchPesquisa = 
      produto.sku.toLowerCase().includes(termoPesquisa) ||
      produto.nome.toLowerCase().includes(termoPesquisa) ||
      produto.descricao.toLowerCase().includes(termoPesquisa) ||
      produto.tags.some(tag => tag.toLowerCase().includes(termoPesquisa));
    
    const matchCategoria = categoriaFiltro === "todos" || produto.categoria === categoriaFiltro;
    
    return matchPesquisa && matchCategoria;
  });

  const categorias = ["todos", ...new Set(produtos.map(p => p.categoria))];

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1400px",
      margin: "0 auto",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    },
    header: {
      marginBottom: "30px"
    },
    title: {
      color: "#2c5aa0",
      marginBottom: "10px",
      fontSize: "2.2rem"
    },
    subtitle: {
      color: "#666",
      marginBottom: "25px"
    },
    filtrosContainer: {
      display: "flex",
      gap: "20px",
      marginBottom: "25px",
      flexWrap: "wrap",
      alignItems: "center"
    },
    searchInput: {
      flex: "1",
      minWidth: "300px",
      padding: "12px 20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    select: {
      padding: "12px 20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      backgroundColor: "white",
      minWidth: "200px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "25px",
      marginBottom: "40px"
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      border: "1px solid #e9ecef"
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
    },
    cardImage: {
      fontSize: "3rem",
      textAlign: "center",
      marginBottom: "15px"
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "8px"
    },
    cardSku: {
      fontSize: "0.9rem",
      color: "#666",
      fontFamily: "monospace",
      marginBottom: "10px"
    },
    cardDescription: {
      fontSize: "0.9rem",
      color: "#777",
      marginBottom: "15px",
      lineHeight: "1.4"
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px"
    },
    price: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "#2c5aa0"
    },
    oldPrice: {
      fontSize: "1rem",
      color: "#999",
      textDecoration: "line-through"
    },
    promoBadge: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.8rem",
      fontWeight: "bold"
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.9rem",
      color: "#666",
      marginBottom: "5px"
    },
    stockGood: {
      color: "#28a745",
      fontWeight: "bold"
    },
    stockLow: {
      color: "#ffc107",
      fontWeight: "bold"
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    },
    modal: {
      backgroundColor: "white",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
    },
    modalHeader: {
      padding: "25px 25px 0 25px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    },
    modalTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#333",
      margin: 0
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#666",
      padding: "5px"
    },
    modalContent: {
      padding: "25px"
    },
    modalImage: {
      fontSize: "4rem",
      textAlign: "center",
      marginBottom: "20px"
    },
    modalSku: {
      fontFamily: "monospace",
      color: "#666",
      marginBottom: "15px"
    },
    modalDescription: {
      color: "#555",
      lineHeight: "1.6",
      marginBottom: "20px"
    },
    modalPrice: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#2c5aa0",
      marginBottom: "20px"
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "20px"
    },
    tag: {
      backgroundColor: "#e9ecef",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "0.8rem",
      color: "#495057"
    },
    loading: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#666",
      fontSize: "1.1rem"
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#666"
    },
    emptyIcon: {
      fontSize: "4rem",
      marginBottom: "20px",
      opacity: 0.5
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Catálogo de Produtos</h1>
        <p style={styles.subtitle}>
          Explore todos os produtos disponíveis para venda
        </p>
        
        {/* Filtros e Busca */}
        <div style={styles.filtrosContainer}>
          <input
            type="text"
            placeholder="🔍 Buscar por SKU, nome, descrição ou tags..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            style={styles.searchInput}
          />
          
          <select 
            value={categoriaFiltro} 
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            style={styles.select}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat === "todos" ? "📋 Todas categorias" : `📁 ${cat}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Produtos */}
      {carregando ? (
        <div style={styles.loading}>
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
          Carregando produtos...
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar os termos da pesquisa ou filtros</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {produtosFiltrados.map(produto => (
            <div
              key={produto.id}
              style={styles.card}
              onClick={() => setProdutoSelecionado(produto)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div style={styles.cardImage}>{produto.imagem}</div>
              
              <h3 style={styles.cardTitle}>{produto.nome}</h3>
              <div style={styles.cardSku}>SKU: {produto.sku}</div>
              
              <p style={styles.cardDescription}>
                {produto.descricao.length > 100 
                  ? `${produto.descricao.substring(0, 100)}...` 
                  : produto.descricao
                }
              </p>

              <div style={styles.priceContainer}>
                {produto.precoPromocional ? (
                  <>
                    <span style={styles.price}>
                      R$ {produto.precoPromocional.toFixed(2)}
                    </span>
                    <span style={styles.oldPrice}>
                      R$ {produto.preco.toFixed(2)}
                    </span>
                    <span style={styles.promoBadge}>
                      -{Math.round((1 - produto.precoPromocional/produto.preco) * 100)}%
                    </span>
                  </>
                ) : (
                  <span style={styles.price}>
                    R$ {produto.preco.toFixed(2)}
                  </span>
                )}
              </div>

              <div style={styles.infoRow}>
                <span>Categoria:</span>
                <span>{produto.categoria}</span>
              </div>
              
              <div style={styles.infoRow}>
                <span>Estoque:</span>
                <span style={produto.estoque > 10 ? styles.stockGood : styles.stockLow}>
                  {produto.estoque} unidades
                </span>
              </div>

              <div style={styles.infoRow}>
                <span>Status:</span>
                <span style={{ 
                  color: produto.status === 'ativo' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {produto.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      {produtoSelecionado && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setProdutoSelecionado(null)}
        >
          <div 
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{produtoSelecionado.nome}</h2>
              <button 
                style={styles.closeButton}
                onClick={() => setProdutoSelecionado(null)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={styles.modalImage}>
                {produtoSelecionado.imagem}
              </div>
              
              <div style={styles.modalSku}>
                SKU: {produtoSelecionado.sku}
              </div>
              
              <p style={styles.modalDescription}>
                {produtoSelecionado.descricao}
              </p>

              <div style={styles.modalPrice}>
                {produtoSelecionado.precoPromocional ? (
                  <>
                    <span>R$ {produtoSelecionado.precoPromocional.toFixed(2)}</span>
                    <span style={{ 
                      fontSize: "1rem", 
                      color: "#999", 
                      textDecoration: "line-through",
                      marginLeft: "10px"
                    }}>
                      R$ {produtoSelecionado.preco.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>R$ {produtoSelecionado.preco.toFixed(2)}</span>
                )}
              </div>

              <div style={styles.tagsContainer}>
                {produtoSelecionado.tags.map((tag, index) => (
                  <span key={index} style={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "15px",
                marginTop: "20px"
              }}>
                <div>
                  <strong>Categoria:</strong><br />
                  {produtoSelecionado.categoria}
                </div>
                <div>
                  <strong>Departamento:</strong><br />
                  {produtoSelecionado.departamento}
                </div>
                <div>
                  <strong>Estoque:</strong><br />
                  <span style={produtoSelecionado.estoque > 10 ? styles.stockGood : styles.stockLow}>
                    {produtoSelecionado.estoque} unidades
                  </span>
                </div>
                <div>
                  <strong>Status:</strong><br />
                  <span style={{ 
                    color: produtoSelecionado.status === 'ativo' ? '#28a745' : '#dc3545'
                  }}>
                    {produtoSelecionado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;