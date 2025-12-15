import React, { useEffect, useState } from "react";
import styles from "./produtos.styles";

/**
 * Modal de edição de preço e comissão
 * Regra permanece IGUAL ao componente original
 */
const ProdutosModal = ({
    isOpen,
    produto,
    onClose,
    onSave,
}) => {
    const [novoPreco, setNovoPreco] = useState("");
    const [novaComissao, setNovaComissao] = useState("");

    useEffect(() => {
        if (produto) {
            setNovoPreco(produto.preco?.toFixed(2) ?? "");
            setNovaComissao(produto.comissao?.toFixed(1) ?? "");
        }
    }, [produto]);

    if (!isOpen || !produto) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const precoFinal = parseFloat(novoPreco);
        const comissaoFinal = parseFloat(novaComissao);

        if (isNaN(precoFinal) || isNaN(comissaoFinal)) {
            alert("Preço ou comissão inválidos.");
            return;
        }

        onSave(produto.id, precoFinal, comissaoFinal);
    };

    return (
        <div style={styles.modalOverlay} data-cy="produto-modal">
            <form
                onSubmit={handleSubmit}
                style={styles.modalContent}
                data-cy="produto-modal-form"
            >
                <h3 style={styles.modalTitle}>
                    Editar: {produto.nome}
                </h3>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Novo Preço (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={novoPreco}
                        onChange={(e) => setNovoPreco(e.target.value)}
                        required
                        style={styles.input}
                        data-cy="modal-preco"
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
                        data-cy="modal-comissao"
                    />
                </div>

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
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProdutosModal;
