import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

/**
 * Modal COMPLETO de edição de produto
 * Permite editar: nome, preço, comissão, estoque, descrição e fotos
 */
const ProdutosModal = ({
    isOpen,
    produto,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        nome: "",
        preco: "",
        comissao: "",
        estoque: "",
        descricao: "",
        fotos: [],
    });
    const [uploadingFotos, setUploadingFotos] = useState(false);
    const [fotosPreviews, setFotosPreviews] = useState([]);

    // Carregar dados do produto quando abrir modal
    useEffect(() => {
        if (produto) {
            setFormData({
                nome: produto.nome || "",
                preco: produto.preco?.toFixed(2) || "",
                comissao: produto.comissao?.toFixed(1) || "",
                estoque: produto.estoque?.toString() || "",
                descricao: produto.descricao || "",
                fotos: produto.fotos || [],
            });
            setFotosPreviews(produto.fotos || []);
        }
    }, [produto]);

    if (!isOpen || !produto) return null;

    // Upload de novas fotos
    const uploadFoto = async (file, lojaId) => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${lojaId}/${fileName}`;

            const { data, error } = await supabase.storage
                .from('produtos-fotos')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('produtos-fotos')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('[Upload] Erro:', error);
            throw error;
        }
    };

    // Handler para adicionar fotos
    const handleFotosChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const totalFotos = formData.fotos.length + files.length;
        if (totalFotos > 5) {
            alert('⚠️ Máximo 5 fotos por produto');
            return;
        }

        setUploadingFotos(true);

        try {
            const urls = [];
            for (const file of files) {
                const url = await uploadFoto(file, produto.loja_id);
                urls.push(url);
            }

            setFormData(prev => ({
                ...prev,
                fotos: [...prev.fotos, ...urls]
            }));

            const previews = files.map(file => URL.createObjectURL(file));
            setFotosPreviews(prev => [...prev, ...previews]);

            alert(`✅ ${files.length} foto(s) adicionada(s)!`);
        } catch (error) {
            console.error('[Upload] Erro:', error);
            alert('❌ Erro ao fazer upload');
        } finally {
            setUploadingFotos(false);
        }
    };

    // Handler para remover foto
    const handleRemoverFoto = (index) => {
        setFormData(prev => ({
            ...prev,
            fotos: prev.fotos.filter((_, i) => i !== index)
        }));
        setFotosPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Handler para mudanças nos campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Submeter alterações
    const handleSubmit = (e) => {
        e.preventDefault();

        const precoFinal = parseFloat(formData.preco);
        const comissaoFinal = parseFloat(formData.comissao);
        const estoqueFinal = parseInt(formData.estoque);

        if (isNaN(precoFinal) || isNaN(comissaoFinal) || isNaN(estoqueFinal)) {
            alert("❌ Valores inválidos nos campos numéricos.");
            return;
        }

        if (!formData.nome.trim()) {
            alert("❌ O nome do produto não pode estar vazio.");
            return;
        }

        // Chamar onSave com todos os dados
        onSave(produto.id, {
            nome: formData.nome.trim(),
            preco: precoFinal,
            comissao: comissaoFinal,
            estoque: estoqueFinal,
            descricao: formData.descricao.trim(),
            fotos: formData.fotos,
        });
    };

    // Calcular valores do preview
    const valorComissao = (parseFloat(formData.preco) * parseFloat(formData.comissao)) / 100;
    const valorFinal = parseFloat(formData.preco) - valorComissao;

    return (
        <div style={styles.modalOverlay} data-cy="produto-modal">
            <form
                onSubmit={handleSubmit}
                style={styles.modalContent}
                data-cy="produto-modal-form"
            >
                <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>✏️ Editar Produto</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={styles.closeButton}
                    >
                        ✕
                    </button>
                </div>

                <div style={styles.modalBody}>
                    {/* Nome */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>📝 Nome do Produto *</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            data-cy="modal-nome"
                            placeholder="Ex: Camiseta Básica Preta"
                        />
                    </div>

                    {/* Preço e Comissão - lado a lado */}
                    <div style={styles.formRow}>
                        <div style={styles.formGroupHalf}>
                            <label style={styles.label}>💰 Preço (R$) *</label>
                            <input
                                type="number"
                                name="preco"
                                step="0.01"
                                min="0"
                                value={formData.preco}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                data-cy="modal-preco"
                            />
                        </div>

                        <div style={styles.formGroupHalf}>
                            <label style={styles.label}>📊 Comissão (%) *</label>
                            <input
                                type="number"
                                name="comissao"
                                step="0.1"
                                min="0"
                                max="100"
                                value={formData.comissao}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                data-cy="modal-comissao"
                            />
                        </div>
                    </div>

                    {/* Estoque */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>📦 Estoque *</label>
                        <input
                            type="number"
                            name="estoque"
                            min="0"
                            value={formData.estoque}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            data-cy="modal-estoque"
                        />
                    </div>

                    {/* Preview da Venda */}
                    {!isNaN(valorComissao) && !isNaN(valorFinal) && (
                        <div style={styles.previewBox}>
                            <strong style={styles.previewTitle}>📊 Preview da Venda</strong>
                            <div style={styles.previewRow}>
                                <span>Preço:</span>
                                <span>R$ {parseFloat(formData.preco).toFixed(2)}</span>
                            </div>
                            <div style={styles.previewRow}>
                                <span>Comissão:</span>
                                <span style={{ color: '#dc3545' }}>- R$ {valorComissao.toFixed(2)}</span>
                            </div>
                            <div style={{ ...styles.previewRow, ...styles.previewTotal }}>
                                <strong>Você recebe:</strong>
                                <strong style={{ color: '#bb25a6' }}>R$ {valorFinal.toFixed(2)}</strong>
                            </div>
                        </div>
                    )}

                    {/* Descrição */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>📄 Descrição</label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            rows="4"
                            style={styles.textarea}
                            data-cy="modal-descricao"
                            placeholder="Descrição detalhada do produto..."
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            💡 Uma boa descrição ajuda o consultor a vender!
                        </small>
                    </div>

                    {/* Fotos */}
                    <div style={styles.fotosSection}>
                        <label style={styles.label}>
                            📸 Fotos do Produto
                            <span style={styles.fotosCount}>
                                ({formData.fotos.length}/5)
                            </span>
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFotosChange}
                            disabled={uploadingFotos || formData.fotos.length >= 5}
                            style={styles.fileInput}
                        />

                        {formData.fotos.length > 0 && (
                            <div style={styles.fotosGrid}>
                                {formData.fotos.map((url, index) => (
                                    <div key={index} style={styles.fotoItem}>
                                        <img
                                            src={url}
                                            alt={`Foto ${index + 1}`}
                                            style={styles.fotoImg}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoverFoto(index)}
                                            style={styles.fotoRemove}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {uploadingFotos && (
                            <div style={styles.uploading}>
                                ⏳ Fazendo upload...
                            </div>
                        )}
                    </div>
                </div>

                {/* Ações */}
                <div style={styles.modalActions}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={styles.cancelButton}
                        data-cy="modal-cancelar"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        style={styles.saveButton}
                        data-cy="modal-salvar"
                        disabled={uploadingFotos}
                    >
                        💾 Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

// Estilos
const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "600px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        borderBottom: "2px solid #e9ecef",
    },
    modalTitle: {
        margin: 0,
        fontSize: "1.3rem",
        color: "#495057",
        fontWeight: "600",
    },
    closeButton: {
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
        color: "#6c757d",
        padding: "0",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        transition: "all 0.2s",
    },
    modalBody: {
        padding: "20px",
        overflowY: "auto",
        flex: 1,
    },
    formGroup: {
        marginBottom: "20px",
    },
    formRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginBottom: "20px",
    },
    formGroupHalf: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#333",
        fontSize: "14px",
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        border: "2px solid #e9ecef",
        borderRadius: "6px",
        fontSize: "14px",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    },
    textarea: {
        width: "100%",
        padding: "10px 12px",
        border: "2px solid #e9ecef",
        borderRadius: "6px",
        fontSize: "14px",
        boxSizing: "border-box",
        fontFamily: "inherit",
        resize: "vertical",
    },
    previewBox: {
        backgroundColor: "#f8f9fa",
        border: "2px solid #dee2e6",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px",
    },
    previewTitle: {
        display: "block",
        marginBottom: "10px",
        color: "#495057",
        fontSize: "14px",
    },
    previewRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        fontSize: "14px",
    },
    previewTotal: {
        borderTop: "2px solid #dee2e6",
        marginTop: "8px",
        paddingTop: "8px",
    },
    fotosSection: {
        marginTop: "25px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
    },
    fotosCount: {
        marginLeft: "10px",
        color: "#6c757d",
        fontSize: "13px",
        fontWeight: "normal",
    },
    fileInput: {
        width: "100%",
        padding: "10px",
        border: "2px dashed #dee2e6",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "15px",
    },
    fotosGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: "10px",
        marginTop: "15px",
    },
    fotoItem: {
        position: "relative",
    },
    fotoImg: {
        width: "100%",
        height: "100px",
        objectFit: "cover",
        borderRadius: "6px",
        border: "2px solid #dee2e6",
    },
    fotoRemove: {
        position: "absolute",
        top: "-8px",
        right: "-8px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "bold",
    },
    uploading: {
        color: "#6f42c1",
        fontWeight: "600",
        marginTop: "10px",
        fontSize: "14px",
    },
    modalActions: {
        display: "flex",
        gap: "10px",
        padding: "20px",
        borderTop: "2px solid #e9ecef",
    },
    cancelButton: {
        flex: 1,
        padding: "12px 20px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },
    saveButton: {
        flex: 1,
        padding: "12px 20px",
        backgroundColor: "#bb25a6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },
};

export default ProdutosModal;