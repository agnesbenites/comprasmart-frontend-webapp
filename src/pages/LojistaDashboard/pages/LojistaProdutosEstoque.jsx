import React, { useState, useEffect } from "react";
// Importações do Firebase removidas.
import { createClient } from '@supabase/supabase-js'; 
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos de produtos

// --- Configuração Supabase (Usando variáveis injetadas ou placeholders) ---
// ⚠️ ATENÇÃO: Use suas chaves FRONTEND (ANON KEY) aqui.
const supabaseUrl = "https://vluxffbornrlxcepqmzr.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdXhmZmJvcm5ybHhjZXBxbXpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk2MzA2NiwiZXhwIjoyMDc3MzIzMDY2fQ.rBovfjyawq27VtBrOCxo5eGHhmTegUWaqQOFVskk8A0"; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const API_URL = "https://plataforma-consultoria-mvp.onrender.com";

// --- Variáveis Globais (Configuração do Canvas) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const LojistaProdutosEstoque = () => {
    // === ESTADOS DE CONEXÃO E DADOS ===
    // 🛑 Hardcode o UUID de teste para o MVP (substituir pela autenticação real)
    const [userId, setUserId] = useState("858f50c0-f472-4d1d-9e6e-21952f40c7e5"); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [produtos, setProdutos] = useState([]);
    
    // === ESTADOS PARA CADASTRO ===
    const [novoProduto, setNovoProduto] = useState({
        nome: "",
        categoria: "",
        preco: "",
        estoque: "",
        estoqueMinimo: "",
        comissao: "", // comissao -> commission_rate no DB
        sku: ""
    });
    const [modoImportacao, setModoImportacao] = useState(false);
    const [categoriasSugeridas, setCategoriasSugeridas] = useState([]);

    // === ESTADOS PARA EDIÇÃO ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [novoPreco, setNovoPreco] = useState('');
    const [novaComissao, setNovaComissao] = useState('');


    // --- 1. Inicialização do UserID (Simplificada) ---
    useEffect(() => {
        // A lógica de autenticação foi removida, assumimos o userId.
        setLoading(false);
    }, []);
    
    // --- FUNÇÃO DE BUSCA DE DADOS ---
    const buscarProdutos = async () => {
        if (!userId) return;

        try {
            // 🛑 SUPABASE SELECT: Busca produtos do lojista
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .eq('lojista_id', userId); // Assumindo que a tabela 'produtos' tem uma FK 'lojista_id'

            if (error) {
                setError("Erro ao carregar produtos do Supabase.");
                console.error("Supabase Error:", error);
                return;
            }

            const produtosTratados = data.map(p => ({
                id: p.id,
                nome: p.nome,
                categoria: p.categoria,
                preco: parseFloat(p.preco) || 0,
                estoque: parseInt(p.estoque) || 0,
                estoqueMinimo: parseInt(p.estoque_minimo || p.estoqueMinimo) || 0, 
                comissao: parseFloat(p.commission_rate || p.comissao) || 0, 
                sku: p.sku
            }));

            setProdutos(produtosTratados);
        } catch (e) {
            setError('Erro ao buscar produtos. Verifique a conexão do Supabase.');
            console.error("Fetch Error:", e);
        }
    };

    // --- 2. Busca de Dados (useEffect) ---
    useEffect(() => {
        if (!userId) return;
        buscarProdutos();
    }, [userId]);


    // --- FUNÇÕES DE CADASTRO ---
    
    const categorizarProduto = (nomeProduto) => {
        // [Lógica de IA mantida]
        const palavras = nomeProduto.toLowerCase();

        const categoriasIA = [
            { nome: "📱 Eletroeletrônicos", palavras: ["smartphone", "tv", "celular", "tablet", "fone", "audio", "som", "televisão"] },
            { nome: "💻 Informática", palavras: ["notebook", "computador", "mouse", "teclado", "monitor", "impressora", "tablet"] },
            { nome: "🛋️ Móveis", palavras: ["guarda-roupa", "cama", "mesa", "cadeira", "sofá", "estante", "armário", "móvel"] },
            { nome: "🏠 Eletrodomésticos", palavras: ["geladeira", "fogão", "microondas", "lavadora", "ar condicionado", "ventilador"] },
            { nome: "🎯 Esportes", palavras: ["bola", "tenis", "chuteira", "academia", "suplemento", "bicicleta"] },
            { nome: "👕 Vestuário", palavras: ["camisa", "calça", "bermuda", "vestido", "blusa", "jaqueta", "roupa"] },
            { nome: "📝 Material Escritório", palavras: ["caneta", "lápis", "caderno", "borracha", "papel", "pincel"] },
            { nome: "🛁 Cama Mesa Banho", palavras: ["toalha", "lençol", "edredom", "travesseiro", "cobre-leito"] },
            { nome: "🍳 Cozinha", palavras: ["panela", "faca", "prato", "copos", "talheres", "utensílios"] },
            { nome: "🚗 Automotivo", palavras: ["pneu", "bateria", "óleo", "acessório", "carro", "moto"] }
        ];

        const sugestoes = categoriasIA
            .map(categoria => {
                const matches = categoria.palavras.filter(palavra =>
                    palavras.includes(palavra)
                ).length;
                return { ...categoria, score: matches };
            })
            .filter(cat => cat.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        return sugestoes;
    };


    const handleNomeProdutoChange = (e) => {
        // [Lógica de IA mantida]
        const nome = e.target.value;
        setNovoProduto({
          ...novoProduto,
          nome: nome
        });

        if (nome.length > 3) {
          const sugestoes = categorizarProduto(nome);
          setCategoriasSugeridas(sugestoes);

          if (sugestoes.length > 0 && sugestoes[0].score >= 2) {
            setNovoProduto(prev => ({
              ...prev,
              categoria: sugestoes[0].nome
            }));
          }
        } else {
          setCategoriasSugeridas([]);
        }
    };

    const handleAddProduto = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('Usuário não autenticado.');
            return;
        }
        
        try {
            const produtoData = {
                id: uuidv4(), // Gera um UUID para o ID
                lojista_id: userId,
                nome: novoProduto.nome,
                categoria: novoProduto.categoria,
                preco: parseFloat(novoProduto.preco),
                estoque: parseInt(novoProduto.estoque),
                estoque_minimo: parseInt(novoProduto.estoqueMinimo), 
                commission_rate: parseFloat(novoProduto.comissao), 
                sku: novoProduto.sku,
                status: "ativo"
            };
            
            // 🛑 SUPABASE INSERT
            const { error } = await supabase
                .from('produtos')
                .insert([produtoData]); 

            if (error) throw error;

            setNovoProduto({
                nome: "", categoria: "", preco: "", estoque: "", estoqueMinimo: "", comissao: "", sku: ""
            });
            setCategoriasSugeridas([]);
            buscarProdutos(); // Recarrega os dados
            alert(`Produto ${produtoData.nome} cadastrado com sucesso!`);
            
        } catch (e) {
            setError("Erro ao adicionar produto no Supabase.");
            console.error("Add Produto Error:", e);
        }
    };

    const handleChange = (e) => {
        setNovoProduto({
            ...novoProduto,
            [e.target.name]: e.target.value
        });
    };

    const getStatusEstoque = (estoque, estoqueMinimo) => {
        if (estoque === 0) return { texto: "Esgotado", cor: "#dc3545" };
        if (estoque <= estoqueMinimo) return { texto: "Estoque Baixo", cor: "#ffc107" };
        return { texto: "Em Estoque", cor: "#28a745" };
    };

    // --- FUNÇÕES DE AÇÃO NA TABELA (Supabase) ---

    // 1. Ação: Excluir Produto
    const handleDelete = async (produtoId) => {
        const confirmDelete = window.confirm("Tem certeza que deseja EXCLUIR este produto?");
        if (!confirmDelete || !userId) return;

        try {
            // 🛑 SUPABASE DELETE
            const { error } = await supabase
                .from('produtos')
                .delete()
                .eq('id', produtoId)
                .eq('lojista_id', userId); 

            if (error) throw error;
            
            buscarProdutos(); 
            alert("Produto excluído com sucesso!");
        } catch (e) {
            setError("Erro ao excluir produto no Supabase.");
            console.error("Delete Error:", e);
        }
    };

    // 2. Ação: Abrir Modal de Edição
    const handleEdit = (produto) => {
        setProdutoEditando(produto);
        setNovoPreco(produto.preco.toFixed(2));
        setNovaComissao(produto.comissao.toFixed(1));
        setIsModalOpen(true);
    };

    // 3. Ação: Salvar Edição
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!userId || !produtoEditando) return;

        const precoFinal = parseFloat(novoPreco);
        const comissaoFinal = parseFloat(novaComissao);
        
        if (isNaN(precoFinal) || isNaN(comissaoFinal)) {
             alert("Preço ou comissão inválidos.");
             return;
        }
        
        try {
            // 🛑 SUPABASE UPDATE
            const { error } = await supabase
                .from('produtos')
                .update({
                    preco: precoFinal,
                    commission_rate: comissaoFinal // 🛑 Nome da coluna de backend
                })
                .eq('id', produtoEditando.id)
                .eq('lojista_id', userId); 

            if (error) throw error;

            alert(`Produto ${produtoEditando.nome} atualizado!`);
            
            buscarProdutos(); 
            setIsModalOpen(false);
            setProdutoEditando(null);
            
        } catch (e) {
            setError("Erro ao salvar edição no Supabase.");
            console.error("Save Edit Error:", e);
        }
    };


    // --- RENDERIZAÇÃO ---
    if (loading) {
        return <div style={styles.loading}>Conectando ao banco de dados... ⏳</div>;
    }
    
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📦 Produtos e Estoque</h1>
            <p style={styles.subtitle}>Gerencie seu catálogo de produtos e controle de estoque (ID Lojista: {userId})</p>
            
            {/* ... Renderização do restante da página (abas, formulário, tabela) ... */}
            
            {/* ABAS */}
            <div style={styles.abas}>
                <button
                    style={modoImportacao ? styles.aba : { ...styles.aba, ...styles.abaAtiva }}
                    onClick={() => setModoImportacao(false)}
                >
                    ➕ Cadastrar Produto
                </button>
                <button
                    style={modoImportacao ? { ...styles.aba, ...styles.abaAtiva } : styles.aba}
                    onClick={() => setModoImportacao(true)}
                >
                    📤 Importar do ERP/CSV
                </button>
            </div>

            {/* CONTEÚDO */}
            {!modoImportacao ? (
                // MODO CADASTRO MANUAL
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>
                        Cadastrar Novo Produto
                        <span style={styles.iaBadge}>🤖 IA</span>
                    </h3>
                    <form onSubmit={handleAddProduto}>
                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Nome do Produto *
                                    <span style={styles.iaHint}> (A IA vai sugerir a categoria)</span>
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={novoProduto.nome}
                                    onChange={handleNomeProdutoChange}
                                    required
                                    style={styles.input}
                                    placeholder="Ex: Smartphone Galaxy S23"
                                />

                                {/* Sugestões de Categoria da IA */}
                                {categoriasSugeridas.length > 0 && (
                                    <div style={styles.sugestoesIA}>
                                        <p style={styles.sugestoesTitulo}>🤖 Categorias Sugeridas:</p>
                                        <div style={styles.sugestoesLista}>
                                            {categoriasSugeridas.map((categoria, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    style={{
                                                        ...styles.sugestaoButton,
                                                        backgroundColor: novoProduto.categoria === categoria.nome ? '#2c5aa0' : '#e9ecef',
                                                        color: novoProduto.categoria === categoria.nome ? 'white' : '#333'
                                                    }}
                                                    onClick={() => setNovoProduto(prev => ({
                                                        ...prev,
                                                        categoria: categoria.nome
                                                    }))}
                                                >
                                                    {categoria.nome}
                                                    <span style={styles.confianca}>
                                                        {categoria.score >= 2 ? '🎯' : categoria.score === 1 ? '💡' : '🤔'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Categoria *</label>
                                <select
                                    name="categoria"
                                    value={novoProduto.categoria}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                >
                                    <option value="">{categoriasSugeridas.length > 0 ? "Ou selecione manualmente..." : "Selecione a categoria..."}</option>
                                    <option value="📱 Eletroeletrônicos">📱 Eletroeletrônicos</option>
                                    <option value="💻 Informática">💻 Informática</option>
                                    <option value="🛋️ Móveis">🛋️ Móveis</option>
                                    <option value="🏠 Eletrodomésticos">🏠 Eletrodomésticos</option>
                                    <option value="🎯 Esportes">🎯 Esportes</option>
                                    <option value="👕 Vestuário">👕 Vestuário</option>
                                    <option value="📝 Material Escritório">📝 Material Escritório</option>
                                    <option value="🛁 Cama Mesa Banho">🛁 Cama Mesa Banho</option>
                                    <option value="🍳 Cozinha">🍳 Cozinha</option>
                                    <option value="🚗 Automotivo">🚗 Automotivo</option>
                                    <option value="🎁 Outros">🎁 Outros</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Preço (R$) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="preco"
                                    value={novoProduto.preco}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="0.00"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Comissão (%) *</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="comissao"
                                    value={novoProduto.comissao}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="0.0"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Estoque Atual *</label>
                                <input
                                    type="number"
                                    name="estoque"
                                    value={novoProduto.estoque}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="0"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Estoque Mínimo *</label>
                                <input
                                    type="number"
                                    name="estoqueMinimo"
                                    value={novoProduto.estoqueMinimo}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                    placeholder="0"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>SKU/Código</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={novoProduto.sku}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Código interno"
                                />
                            </div>
                        </div>

                        <button type="submit" style={styles.primaryButton}>
                            💾 Cadastrar Produto
                        </button>
                    </form>
                </div>
            ) : (
                // MODO IMPORTAÇÃO (MANTIDO)
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Importar Produtos</h3>
                    <div style={styles.importacao}>
                        <div style={styles.importacaoItem}>
                            <h4>📤 Upload de Arquivo CSV</h4>
                            <p>Faça upload de um arquivo CSV com os dados dos produtos</p>
                            <input type="file" accept=".csv" style={styles.fileInput} />
                            <button style={styles.secondaryButton}>Processar CSV</button>
                        </div>

                        <div style={styles.importacaoItem}>
                            <h4>🔗 Integração com ERP</h4>
                            <p>Conecte com seu sistema ERP para sincronização automática</p>
                            <button style={styles.secondaryButton}>Configurar ERP</button>
                        </div>

                        <div style={styles.importacaoItem}>
                            <h4>📋 Modelo de CSV</h4>
                            <p>Baixe nosso modelo para importação em lote</p>
                            <button style={styles.secondaryButton}>📥 Baixar Modelo</button>
                        </div>
                    </div>
                </div>
            )}

            {/* LISTA DE PRODUTOS */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>
                    Lista de Produtos ({produtos.length})
                    <span style={styles.badge}>
                        {produtos.filter(p => p.estoque <= p.estoqueMinimo).length} com estoque baixo
                    </span>
                </h3>

                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Produto</th>
                                <th style={styles.th}>Categoria</th>
                                <th style={styles.th}>Preço</th>
                                <th style={styles.th}>Comissão</th>
                                <th style={styles.th}>Estoque</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(produto => {
                                const status = getStatusEstoque(produto.estoque, produto.estoqueMinimo);
                                return (
                                    <tr key={produto.id}>
                                        <td style={styles.td}>
                                            <strong>{produto.nome}</strong>
                                            <br />
                                            <small style={styles.sku}>{produto.sku}</small>
                                        </td>
                                        <td style={styles.td}>{produto.categoria}</td>
                                        <td style={styles.td}>R$ {produto.preco.toFixed(2)}</td>
                                        <td style={styles.td}>{produto.comissao}%</td>
                                        <td style={styles.td}>
                                            {produto.estoque} / {produto.estoqueMinimo}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{ ...styles.status, backgroundColor: status.cor === '#dc3545' ? '#f8d7da' : status.cor === '#ffc107' ? '#fff3cd' : '#d4edda', color: status.cor }}>
                                                {status.texto}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button 
                                                onClick={() => handleEdit(produto)} 
                                                style={styles.smallButton} 
                                                title="Editar Preço e Comissão"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(produto.id)} 
                                                style={styles.smallButtonDanger} 
                                                title="Excluir Produto"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DE EDIÇÃO (NOVIDADE) */}
            {isModalOpen && produtoEditando && (
                <div style={styles.modalOverlay}>
                    <form onSubmit={handleSaveEdit} style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>Editar: {produtoEditando.nome}</h3>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Novo Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={novoPreco}
                                onChange={(e) => setNovoPreco(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nova Comissão (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={novaComissao}
                                onChange={(e) => setNovaComissao(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.modalActions}>
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)} 
                                style={styles.cancelButton}
                            >
                                Cancelar
                            </button>
                            <button type="submit" style={styles.saveButton}>
                                💾 Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// ... [Restante dos Estilos Mantidos (styles, Object.assign)]
const styles = {
    container: {
        padding: "30px",
        fontFamily: "Inter, sans-serif",
    },
    title: {
        color: "#2c5aa0",
        fontSize: "2rem",
        marginBottom: "10px",
    },
    subtitle: {
        color: "#666",
        fontSize: "1.1rem",
        marginBottom: "30px",
    },
    abas: {
        display: "flex",
        gap: "10px",
        marginBottom: "25px",
    },
    aba: {
        padding: "12px 25px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "all 0.3s ease",
    },
    abaAtiva: {
        backgroundColor: "#2c5aa0",
        color: "white",
        borderColor: "#2c5aa0",
    },
    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid #e9ecef",
        marginBottom: "25px",
    },
    cardTitle: {
        fontSize: "1.3rem",
        color: "#495057",
        marginBottom: "20px",
        fontWeight: "600",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iaBadge: {
        backgroundColor: "#6f42c1",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "0.7rem",
        fontWeight: "600",
    },
    badge: {
        backgroundColor: "#ffc107",
        color: "#333",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "0.8rem",
        fontWeight: "600",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "25px",
    },
    formGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#333",
    },
    iaHint: {
        fontSize: "0.8rem",
        color: "#6f42c1",
        fontWeight: "normal",
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        border: "2px solid #e9ecef",
        borderRadius: "6px",
        fontSize: "1rem",
    },
    sugestoesIA: {
        marginTop: "10px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e3f2fd",
    },
    sugestoesTitulo: {
        margin: "0 0 10px 0",
        fontSize: "0.9rem",
        fontWeight: "600",
        color: "#6f42c1",
    },
    sugestoesLista: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
    },
    sugestaoButton: {
        padding: "8px 12px",
        border: "none",
        borderRadius: "6px",
        fontSize: "0.8rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "5px",
    },
    confianca: {
        fontSize: "0.7rem",
    },
    primaryButton: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "12px 25px",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
    },
    secondaryButton: {
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        fontSize: "0.9rem",
        cursor: "pointer",
    },
    importacao: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
    },
    importacaoItem: {
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #dee2e6",
    },
    fileInput: {
        width: "100%",
        margin: "10px 0",
    },
    tableContainer: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        backgroundColor: "#eaf2ff",
        padding: "12px 15px",
        textAlign: "left",
        fontWeight: "600",
        color: "#2c5aa0",
        borderBottom: "2px solid #2c5aa0",
    },
    td: {
        padding: "12px 15px",
        borderBottom: "1px solid #eee",
        verticalAlign: "top",
    },
    sku: {
        color: "#666",
        fontSize: "0.8rem",
    },
    status: {
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "0.7rem",
        fontWeight: "600",
    },
    smallButton: {
        backgroundColor: "#17a2b8",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "4px",
        fontSize: "0.8rem",
        cursor: "pointer",
        marginRight: "5px",
    },
    smallButtonDanger: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "4px",
        fontSize: "0.8rem",
        cursor: "pointer",
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
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        width: '90%',
        maxWidth: '500px',
    },
    modalTitle: {
        fontSize: '1.5rem',
        color: '#2c5aa0',
        marginBottom: '20px',
    },
    modalActions: {
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        color: '#666'
    },
    error: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
    },
};

// Efeitos hover
Object.assign(styles, {
    input: {
        ...styles.input,
        ":focus": {
            outline: "none",
            borderColor: "#2c5aa0",
        },
    },
    aba: {
        ...styles.aba,
        ":hover": {
            backgroundColor: "#e9ecef",
        },
    },
    abaAtiva: {
        ...styles.abaAtiva,
        ":hover": {
            backgroundColor: "#1e3d6f",
        },
    },
    sugestaoButton: {
        ...styles.sugestaoButton,
        ":hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
    },
    primaryButton: {
        ...styles.primaryButton,
        ":hover": {
            backgroundColor: "#218838",
        },
    },
    secondaryButton: {
        ...styles.secondaryButton,
        ":hover": {
            backgroundColor: "#545b62",
        },
    },
    smallButton: {
        ...styles.smallButton,
        ":hover": {
            backgroundColor: "#138496",
        },
    },
    smallButtonDanger: {
        ...styles.smallButtonDanger,
        ":hover": {
            backgroundColor: "#c82333",
        },
    },
    cancelButton: {
        ...styles.cancelButton,
        ":hover": {
            backgroundColor: '#545b62',
        }
    },
    saveButton: {
        ...styles.saveButton,
        ":hover": {
            backgroundColor: '#218838',
        }
    }
});

export default LojistaProdutosEstoque;