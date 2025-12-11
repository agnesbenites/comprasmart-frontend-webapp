// src/pages/VendedorDashboard/pages/VendedorProfile.jsx
import React, { useState } from "react";
// REMOVIDO: Supabase migrado para Supabase
import { useNavigate } from "react-router-dom";

// Cores do Vendedor (mesmo padrao do dashboard)
const VENDOR_PRIMARY = "#4a6fa5";
const VENDOR_PRIMARY_DARK = "#2c3e50";
const VENDOR_LIGHT_BG = "#eaf2ff";

const VendedorProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Estados para os campos editaveis
    const [nome, setNome] = useState(user?.name || "Ana Vendedora");
    const [email, setEmail] = useState(user?.email || "vendedor@exemplo.com");
    const [fotoPerfil, setFotoPerfil] = useState(user?.picture || null);
    
    // Estados para controle de edicao
    const [editando, setEditando] = useState({
        nome: false,
        email: false,
        senha: false
    });
    
    // Estados para senhas
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    
    // Estado para mensagens
    const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
    const [loading, setLoading] = useState(false);

    // Funcao para mostrar mensagem temporaria
    const mostrarMensagem = (tipo, texto) => {
        setMensagem({ tipo, texto });
        setTimeout(() => setMensagem({ tipo: "", texto: "" }), 3000);
    };

    // Funcao para salvar nome
    const salvarNome = async () => {
        if (!nome.trim()) {
            mostrarMensagem("erro", "O nome nao pode estar vazio.");
            return;
        }
        
        setLoading(true);
        try {
            // Simulacao de chamada   API
            await new Promise(resolve => setTimeout(resolve, 500));
            localStorage.setItem("userName", nome);
            setEditando({ ...editando, nome: false });
            mostrarMensagem("sucesso", "Nome atualizado com sucesso!");
        } catch (error) {
            mostrarMensagem("erro", "Erro ao atualizar nome.");
        } finally {
            setLoading(false);
        }
    };

    // Funcao para salvar email
    const salvarEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarMensagem("erro", "Por favor, insira um e-mail valido.");
            return;
        }
        
        setLoading(true);
        try {
            // Simulacao de chamada   API
            await new Promise(resolve => setTimeout(resolve, 500));
            setEditando({ ...editando, email: false });
            mostrarMensagem("sucesso", "E-mail atualizado! Verifique sua caixa de entrada para confirmar.");
        } catch (error) {
            mostrarMensagem("erro", "Erro ao atualizar e-mail.");
        } finally {
            setLoading(false);
        }
    };

    // Funcao para alterar senha
    const alterarSenha = async () => {
        if (!senhaAtual) {
            mostrarMensagem("erro", "Digite sua senha atual.");
            return;
        }
        if (novaSenha.length < 6) {
            mostrarMensagem("erro", "A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (novaSenha !== confirmarSenha) {
            mostrarMensagem("erro", "As senhas nao coincidem.");
            return;
        }
        
        setLoading(true);
        try {
            // Simulacao de chamada   API
            await new Promise(resolve => setTimeout(resolve, 500));
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");
            setEditando({ ...editando, senha: false });
            mostrarMensagem("sucesso", "Senha alterada com sucesso!");
        } catch (error) {
            mostrarMensagem("erro", "Erro ao alterar senha.");
        } finally {
            setLoading(false);
        }
    };

    // Funcao para upload de foto
    const handleFotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                mostrarMensagem("erro", "A imagem deve ter no maximo 2MB.");
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPerfil(reader.result);
                mostrarMensagem("sucesso", "Foto de perfil atualizada!");
            };
            reader.readAsDataURL(file);
        }
    };

    // FUNCAO DE LOGOUT
    const handleLogout = () => {
        if (window.confirm("Tem certeza que deseja sair?")) {
            // Limpar dados do localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('vendedorId');
            
            // Redirecionar para a pagina de login
            navigate('/entrar');
        }
    };

    return (
        <div style={styles.container}>
            {/* HEADER COM LOGOUT */}
            <div style={styles.header}>
                <h1 style={styles.title}> Meu Perfil</h1>
                <button onClick={handleLogout} style={styles.logoutButton}>
                     Sair
                </button>
            </div>
            
            {/* Mensagem de feedback */}
            {mensagem.texto && (
                <div style={{
                    ...styles.mensagem,
                    backgroundColor: mensagem.tipo === "sucesso" ? "#d4edda" : "#f8d7da",
                    color: mensagem.tipo === "sucesso" ? "#155724" : "#721c24",
                    borderColor: mensagem.tipo === "sucesso" ? "#c3e6cb" : "#f5c6cb"
                }}>
                    {mensagem.tipo === "sucesso" ? "" : ""} {mensagem.texto}
                </div>
            )}

            {/* Card de Foto de Perfil */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}> Foto de Perfil</h2>
                
                <div style={styles.fotoContainer}>
                    <div style={styles.fotoWrapper}>
                        {fotoPerfil ? (
                            <img src={fotoPerfil} alt="Foto de perfil" style={styles.foto} />
                        ) : (
                            <div style={styles.fotoPlaceholder}>
                                {nome.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div style={styles.fotoActions}>
                        <label style={styles.uploadButton}>
                             Alterar Foto
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFotoUpload}
                                style={{ display: "none" }}
                            />
                        </label>
                        <p style={styles.fotoHint}>JPG, PNG ou GIF. Maximo 2MB.</p>
                    </div>
                </div>
            </div>

            {/* Card de Nome */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}> Nome</h2>
                
                {editando.nome ? (
                    <div style={styles.editContainer}>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            style={styles.input}
                            placeholder="Seu nome completo"
                        />
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={salvarNome}
                                disabled={loading}
                                style={styles.saveButton}
                            >
                                {loading ? "Salvando..." : " Salvar"}
                            </button>
                            <button
                                onClick={() => {
                                    setNome(user?.name || "Ana Vendedora");
                                    setEditando({ ...editando, nome: false });
                                }}
                                style={styles.cancelButton}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={styles.viewContainer}>
                        <span style={styles.value}>{nome}</span>
                        <button
                            onClick={() => setEditando({ ...editando, nome: true })}
                            style={styles.editButton}
                        >
                             Editar
                        </button>
                    </div>
                )}
            </div>

            {/* Card de E-mail */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}> E-mail</h2>
                
                {editando.email ? (
                    <div style={styles.editContainer}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="seu@email.com"
                        />
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={salvarEmail}
                                disabled={loading}
                                style={styles.saveButton}
                            >
                                {loading ? "Salvando..." : " Salvar"}
                            </button>
                            <button
                                onClick={() => {
                                    setEmail(user?.email || "vendedor@exemplo.com");
                                    setEditando({ ...editando, email: false });
                                }}
                                style={styles.cancelButton}
                            >
                                Cancelar
                            </button>
                        </div>
                        <p style={styles.hint}>
                              Voca recebera um e-mail de confirmacao no novo endereco.
                        </p>
                    </div>
                ) : (
                    <div style={styles.viewContainer}>
                        <span style={styles.value}>{email}</span>
                        <button
                            onClick={() => setEditando({ ...editando, email: true })}
                            style={styles.editButton}
                        >
                             Editar
                        </button>
                    </div>
                )}
            </div>

            {/* Card de Senha */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}> Senha</h2>
                
                {editando.senha ? (
                    <div style={styles.editContainer}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Senha Atual</label>
                            <input
                                type="password"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                style={styles.input}
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nova Senha</label>
                            <input
                                type="password"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                style={styles.input}
                                placeholder="Minimo 6 caracteres"
                            />
                        </div>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirmar Nova Senha</label>
                            <input
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                style={styles.input}
                                placeholder="Repita a nova senha"
                            />
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={alterarSenha}
                                disabled={loading}
                                style={styles.saveButton}
                            >
                                {loading ? "Salvando..." : " Alterar Senha"}
                            </button>
                            <button
                                onClick={() => {
                                    setSenhaAtual("");
                                    setNovaSenha("");
                                    setConfirmarSenha("");
                                    setEditando({ ...editando, senha: false });
                                }}
                                style={styles.cancelButton}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={styles.viewContainer}>
                        <span style={styles.value}>********</span>
                        <button
                            onClick={() => setEditando({ ...editando, senha: true })}
                            style={styles.editButton}
                        >
                             Alterar Senha
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Estilos
const styles = {
    container: {
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        flexWrap: "wrap",
        gap: "15px",
    },
    title: {
        color: VENDOR_PRIMARY,
        fontSize: "1.8rem",
        marginBottom: "0",
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "0.95rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)",
    },
    mensagem: {
        padding: "12px 20px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid",
        fontWeight: "500",
    },
    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginBottom: "20px",
        border: "1px solid #e9ecef",
    },
    cardTitle: {
        color: VENDOR_PRIMARY_DARK,
        fontSize: "1.1rem",
        marginTop: 0,
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "2px solid " + VENDOR_LIGHT_BG,
    },
    viewContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
    },
    value: {
        fontSize: "1.1rem",
        color: "#333",
    },
    editButton: {
        backgroundColor: VENDOR_LIGHT_BG,
        color: VENDOR_PRIMARY,
        border: "1px solid " + VENDOR_PRIMARY,
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s",
    },
    editContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        width: "100%",
        padding: "12px 15px",
        fontSize: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    label: {
        fontSize: "14px",
        color: "#666",
        fontWeight: "500",
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    },
    saveButton: {
        backgroundColor: VENDOR_PRIMARY,
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "background-color 0.2s",
    },
    cancelButton: {
        backgroundColor: "#f8f9fa",
        color: "#666",
        border: "1px solid #ddd",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
    },
    hint: {
        fontSize: "13px",
        color: "#666",
        margin: 0,
        fontStyle: "italic",
    },
    fotoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "25px",
        flexWrap: "wrap",
    },
    fotoWrapper: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid " + VENDOR_LIGHT_BG,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    foto: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    fotoPlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: VENDOR_PRIMARY,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2.5rem",
        fontWeight: "bold",
    },
    fotoActions: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    uploadButton: {
        backgroundColor: VENDOR_PRIMARY,
        color: "white",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        textAlign: "center",
        transition: "background-color 0.2s",
    },
    fotoHint: {
        fontSize: "12px",
        color: "#999",
        margin: 0,
    },
};

export default VendedorProfile;


