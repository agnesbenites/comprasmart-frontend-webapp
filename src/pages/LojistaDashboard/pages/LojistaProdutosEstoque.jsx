import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient"; // USA O CLIENTE CENTRALIZADO
import { v4 as uuidv4 } from 'uuid';

const API_URL = "https://plataforma-consultoria-mvp.onrender.com";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const LojistaProdutosEstoque = () => {
    const [userId, setUserId] = useState("858f50c0-f472-4d1d-9e6e-21952f40c7e5"); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [produtos, setProdutos] = useState([]);
    
    const [novoProduto, setNovoProduto] = useState({
        nome: "",
        categoria: "",
        preco: "",
        estoque: "",
        estoqueMinimo: "",
        comissao: "",
        sku: ""
    });
    const [modoImportacao, setModoImportacao] = useState(false);
    const [categoriasSugeridas, setCategoriasSugeridas] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [novoPreco, setNovoPreco] = useState('');
    const [novaComissao, setNovaComissao] = useState('');

    useEffect(() => {
        setLoading(false);
    }, []);
    
    const buscarProdutos = async () => {
        if (!userId) return;

        try {
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .eq('lojista_id', userId);

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
            setError('Erro ao buscar produtos. Verifique a conexao do Supabase.');
            console.error("Fetch Error:", e);
        }
    };

    useEffect(() => {
        if (!userId) return;
        buscarProdutos();
    }, [userId]);

    const categorizarProduto = (nomeProduto) => {
        const palavras = nomeProduto.toLowerCase();

        const categoriasIA = [
            { nome: "Eletroeletronicos", palavras: ["smartphone", "tv", "celular", "tablet", "fone", "audio", "som", "televisao"] },
            { nome: "Informatica", palavras: ["notebook", "computador", "mouse", "teclado", "monitor", "impressora", "tablet"] },
            { nome: "Moveis", palavras: ["guarda-roupa", "cama", "mesa", "cadeira", "sofa", "estante", "armario", "movel"] },
            { nome: "Eletrodomesticos", palavras: ["geladeira", "fogao", "microondas", "lavadora", "ar condicionado", "ventilador"] },
            { nome: "Esportes", palavras: ["bola", "tenis", "chuteira", "academia", "suplemento", "bicicleta"] },
            { nome: "Vestuario", palavras: ["camisa", "calca", "bermuda", "vestido", "blusa", "jaqueta", "roupa"] },
            { nome: "Material Escritorio", palavras: ["caneta", "lapis", "caderno", "borracha", "papel", "pincel"] },
            { nome: "Cama Mesa Banho", palavras: ["toalha", "lencol", "edredom", "travesseiro", "cobre-leito"] },
            { nome: "Cozinha", palavras: ["panela", "faca", "prato", "copos", "talheres", "utensilios"] },
            { nome: "Automotivo", palavras: ["pneu", "bateria", "oleo", "acessorio", "carro", "moto"] }
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
            setError('Usuario nao autenticado.');
            return;
        }
        
        try {
            const produtoData = {
                id: uuidv4(),
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
            
            const { error } = await supabase
                .from('produtos')
                .insert([produtoData]); 

            if (error) throw error;

            setNovoProduto({
                nome: "", categoria: "", preco: "", estoque: "", estoqueMinimo: "", comissao: "", sku: ""
            });
            setCategoriasSugeridas([]);
            buscarProdutos();
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

    const handleDelete = async (produtoId) => {
        const confirmDelete = window.confirm("Tem certeza que deseja EXCLUIR este produto?");
        if (!confirmDelete || !userId) return;

        try {
            const { error } = await supabase
                .from('produtos')
                .delete()
                .eq('id', produtoId)
                .eq('lojista_id', userId); 

            if (error) throw error;
            
            buscarProdutos(); 
            alert("Produto excluido com sucesso!");
        } catch (e) {
            setError("Erro ao excluir produto no Supabase.");
            console.error("Delete Error:", e);
        }
    };

    const handleEdit = (produto) => {
        setProdutoEditando(produto);
        setNovoPreco(produto.preco.toFixed(2));
        setNovaComissao(produto.comissao.toFixed(1));
        setIsModalOpen(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!userId || !produtoEditando) return;

        const precoFinal = parseFloat(novoPreco);
        const comissaoFinal = parseFloat(novaComissao);
        
        if (isNaN(precoFinal) || isNaN(comissaoFinal)) {
             alert("Preco ou comissao invalidos.");
             return;
        }
        
        try {
            const { error } = await supabase
                .from('produtos')
                .update({
                    preco: precoFinal,
                    commission_rate: comissaoFinal
                })
                .eq('id', produtoEditando.id)
                .eq('lojista_id', userId); 

            if (error) throw error;

            alert(`Produto ${produtoEditando.nome} atualizado!`);
            
            buscarProdutos(); 
            setIsModalOpen(false);
            setProdutoEditando(null);
            
        } catch (e) {
            setError("Erro ao salvar edicao no Supabase.");
            console.error("Save Edit Error:", e);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Conectando ao banco de dados...</div>;
    }
    
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Produtos e Estoque</h1>
            <p style={styles.subtitle}>Gerencie seu catalogo de produtos e controle de estoque (ID Lojista: {userId})</p>
            
            <div style={styles.abas}>
                <button
                    style={modoImportacao ? styles.aba : { ...styles.aba, ...styles.abaAtiva }}
                    onClick={() => setModoImportacao(false)}
                >
                    Cadastrar Produto
                </button>
                <button
                    style={modoImportacao ? { ...styles.aba, ...styles.abaAtiva } : styles.aba}
                    onClick={() => setModoImportacao(true)}
                >
                    Importar do ERP/CSV
                </button>
            </div>

            {!modoImportacao ? (
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>
                        Cadastrar Novo Produto
                        <span style={styles.iaBadge}>IA</span>
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

                                {categoriasSugeridas.length > 0 && (
                                    <div style={styles.sugestoesIA}>
                                        <p style={styles.sugestoesTitulo}>Categorias Sugeridas:</p>
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
                                    <option value="Eletroeletronicos">Eletroeletronicos</option>
                                    <option value="Informatica">Informatica</option>
                                    <option value="Moveis">Moveis</option>
                                    <option value="Eletrodomesticos">Eletrodomesticos</option>
                                    <option value="Esportes">Esportes</option>
                                    <option value="Vestuario">Vestuario</option>
                                    <option value="Material Escritorio">Material Escritorio</option>
                                    <option value="Cama Mesa Banho">Cama Mesa Banho</option>
                                    <option value="Cozinha">Cozinha</option>
                                    <option value="Automotivo">Automotivo</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Preco (R$) *</label>
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
                                <label style={styles.label}>Comissao (%) *</label>
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
                                <label style={styles.label}>Estoque Minimo *</label>
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
                                <label style={styles.label}>SKU/Codigo</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={novoProduto.sku}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Codigo interno"
                                />
                            </div>
                        </div>

                        <button type="submit" style={styles.primaryButton}>
                            Cadastrar Produto
                        </button>
                    </form>
                </div>
            ) : (
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Importar Produtos</h3>
                    <div style={styles.importacao}>
                        <div style={styles.importacaoItem}>
                            <h4>Upload de Arquivo CSV</h4>
                            <p>Faca upload de um arquivo CSV com os dados dos produtos</p>
                            <input type="file" accept=".csv" style={styles.fileInput} />
                            <button style={styles.secondaryButton}>Processar CSV</button>
                        </div>

                        <div style={styles.importacaoItem}>
                            <h4>Integracao com ERP</h4>
                            <p>Conecte com seu sistema ERP para sincronizacao automatica</p>
                            <button style={styles.secondaryButton}>Configurar ERP</button>
                        </div>

                        <div style={styles.importacaoItem}>
                            <h4>Modelo de CSV</h4>
                            <p>Baixe nosso modelo para importacao em lote</p>
                            <button style={styles.secondaryButton}>Baixar Modelo</button>
                        </div>
                    </div>
                </div>
            )}

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
                                <th style={styles.th}>Preco</th>
                                <th style={styles.th}>Comissao</th>
                                <th style={styles.th}>Estoque</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Acoes</th>
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
                                                title="Editar Preco e Comissao"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(produto.id)} 
                                                style={styles.smallButtonDanger} 
                                                title="Excluir Produto"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && produtoEditando && (
                <div style={styles.modalOverlay}>
                    <form onSubmit={handleSaveEdit} style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>Editar: {produtoEditando.nome}</h3>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Novo Preco (R$)</label>
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
                            <label style={styles.label}>Nova Comissao (%)</label>
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
                                Salvar Alteracoes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

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
        boxSizing: "border-box",
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
};

export default LojistaProdutosEstoque;