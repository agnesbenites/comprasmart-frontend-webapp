// src/pages/LojistaProfile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LojistaProfile = () => {
  const navigate = useNavigate();
  
  const [empresa, setEmpresa] = useState({
    nome: "Empresa Teste Compra Smart",
    cnpj: "12.345.678/0001-95",
    email: "carlos@empresa.com",
    telefone: "(11) 99999-9999",
    endereco: "Rua Exemplo, 123 - Sao Paulo, SP",
    site: "www.empresateste.com.br"
  });

  const [configComissao, setConfigComissao] = useState({
    tipo: "por-produto",
    percentualGlobal: 8.0
  });

  // CARTOES - Conforme sua imagem
  const [cartoes, setCartoes] = useState([
    {
      id: 1,
      ultimosDigitos: "4222",
      bandeira: "visa",
      titular: "CARLOS SILVA",
      vencimento: "12/25",
      principal: true
    }
  ]);

  const [notificacoes, setNotificacoes] = useState({
    emailVendas: true,
    emailEstoque: true,
    emailFinanceiro: true,
    smsAlertas: false,
    pushVendas: true
  });

  // Segmentos da empresa (exemplo Kalunga)
  const [segmentos, setSegmentos] = useState([
    {
      id: 1,
      nome: " Material Escritorio",
      produtos: ["Canetas", "Lapis", "Borracha", "Pinceis"],
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=segmento-1-escritorio",
      corredor: "A1",
      vendedor: "Ana Silva"
    },
    {
      id: 2,
      nome: " Informatica",
      produtos: ["Notebooks", "Tablets", "Acessorios"],
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=segmento-2-informatica",
      corredor: "B2",
      vendedor: "Paulo Santos"
    }
  ]);

  const handleEmpresaChange = (e) => {
    setEmpresa({
      ...empresa,
      [e.target.name]: e.target.value
    });
  };

  const handleComissaoChange = (e) => {
    setConfigComissao({
      ...configComissao,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificacoesChange = (e) => {
    setNotificacoes({
      ...notificacoes,
      [e.target.name]: e.target.checked
    });
  };

  const salvarConfiguracoes = (tipo) => {
    alert(`${tipo} salvos com sucesso!`);
  };

  const baixarQRCode = (segmento) => {
    const link = document.createElement('a');
    link.href = segmento.qrCode;
    link.download = `qr-code-${segmento.nome.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    link.click();
  };

  const copiarLinkQRCode = (segmento) => {
    navigator.clipboard.writeText(`https://comprasmart.com/segmento/${segmento.id}`);
    alert("Link copiado para a area de transferancia!");
  };

  // FUNCAO DE LOGOUT
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      // Limpar dados do localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('lojistaId');
      
      // Redirecionar para a pagina de login
      navigate('/entrar');
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER COM LOGOUT */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}> Perfil do Administrador</h1>
          <p style={styles.subtitle}>Gerencie suas informacoes e configuracoes da empresa</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
           Sair
        </button>
      </div>

      <div style={styles.grid}>
        {/* Dados da Empresa */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> Dados da Empresa</h3>
          <form>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome da Empresa</label>
              <input
                type="text"
                name="nome"
                value={empresa.nome}
                onChange={handleEmpresaChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={empresa.cnpj}
                readOnly
                style={styles.inputReadonly}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>E-mail</label>
              <input
                type="email"
                name="email"
                value={empresa.email}
                onChange={handleEmpresaChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Telefone</label>
              <input
                type="tel"
                name="telefone"
                value={empresa.telefone}
                onChange={handleEmpresaChange}
                style={styles.input}
              />
            </div>

            <button 
              type="button" 
              style={styles.primaryButton}
              onClick={() => salvarConfiguracoes("Dados da empresa")}
            >
               Salvar Dados
            </button>
          </form>
        </div>

        {/* Cartoes Cadastrados - CONFORME SUA IMAGEM */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> Cartoes de Credito</h3>
          
          {cartoes.map(cartao => (
            <div key={cartao.id} style={styles.cartaoItem}>
              <div style={styles.cartaoIcon}></div>
              <div style={styles.cartaoInfo}>
                <div style={styles.cartaoBandeira}>
                  <strong>VISA **** {cartao.ultimosDigitos}</strong>
                </div>
                <div style={styles.cartaoDetalhes}>
                  {cartao.titular} - Expira {cartao.vencimento}
                </div>
                {cartao.principal && (
                  <div style={styles.cartaoPrincipal}>Principal</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Configuracoes de Comissao */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> Configuracoes de Comissao</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Comissao</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="por-produto"
                  checked={configComissao.tipo === "por-produto"}
                  onChange={handleComissaoChange}
                  style={styles.radio}
                />
                Por Produto (Individual)
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo"
                  value="global"
                  checked={configComissao.tipo === "global"}
                  onChange={handleComissaoChange}
                  style={styles.radio}
                />
                Percentual Global
              </label>
            </div>
          </div>

          {configComissao.tipo === "global" && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Percentual Global de Comissao</label>
              <div style={styles.inputWithSuffix}>
                <input
                  type="number"
                  name="percentualGlobal"
                  value={configComissao.percentualGlobal}
                  onChange={handleComissaoChange}
                  style={styles.input}
                  step="0.1"
                  min="0"
                  max="50"
                />
                <span style={styles.suffix}>%</span>
              </div>
            </div>
          )}

          <button 
            type="button" 
            style={styles.primaryButton}
            onClick={() => salvarConfiguracoes("Configuracoes de comissao")}
          >
             Salvar Configuracoes
          </button>
        </div>

        {/* Segmentos e QR Codes */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> Segmentos da Loja</h3>
          <p style={styles.cardSubtitle}>QR Codes para cada setor</p>
          
          <div style={styles.segmentosGrid}>
            {segmentos.map(segmento => (
              <div key={segmento.id} style={styles.segmentoCard}>
                <div style={styles.segmentoHeader}>
                  <h4 style={styles.segmentoNome}>{segmento.nome}</h4>
                  <span style={styles.corredorTag}>Corredor {segmento.corredor}</span>
                </div>
                
                <div style={styles.qrCodeSection}>
                  <img 
                    src={segmento.qrCode} 
                    alt={`QR Code ${segmento.nome}`}
                    style={styles.qrCodeImage}
                  />
                  <div style={styles.qrCodeActions}>
                    <button 
                      style={styles.smallButton}
                      onClick={() => baixarQRCode(segmento)}
                    >
                       Baixar
                    </button>
                    <button 
                      style={styles.smallButtonSecondary}
                      onClick={() => copiarLinkQRCode(segmento)}
                    >
                       Copiar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuracoes de Notificacao */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> Preferancias de Notificacao</h3>
          
          <div style={styles.notificacoesList}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="emailVendas"
                checked={notificacoes.emailVendas}
                onChange={handleNotificacoesChange}
                style={styles.checkbox}
              />
              E-mail de novas vendas
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="emailEstoque"
                checked={notificacoes.emailEstoque}
                onChange={handleNotificacoesChange}
                style={styles.checkbox}
              />
              Alertas de estoque baixo
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="emailFinanceiro"
                checked={notificacoes.emailFinanceiro}
                onChange={handleNotificacoesChange}
                style={styles.checkbox}
              />
              Notificacoes financeiras
            </label>
          </div>

          <button 
            type="button" 
            style={styles.primaryButton}
            onClick={() => salvarConfiguracoes("Preferancias de notificacao")}
          >
             Salvar Preferancias
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Inter, sans-serif",
    maxWidth: "1400px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px"
  },
  title: {
    color: "#2c5aa0",
    fontSize: "2rem",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    fontSize: "1.1rem",
    marginBottom: "0",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
  },
  cardTitle: {
    fontSize: "1.3rem",
    color: "#495057",
    marginBottom: "20px",
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
  },
  inputReadonly: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#f8f9fa",
    color: "#666",
  },
  inputWithSuffix: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  suffix: {
    position: "absolute",
    right: "15px",
    color: "#666",
    fontWeight: "600",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  radio: {
    margin: 0,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  checkbox: {
    margin: 0,
  },
  primaryButton: {
    backgroundColor: "#2c5aa0",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
  },
  // CARTOES
  cartaoItem: {
    display: "flex",
    alignItems: "flex-start",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    marginBottom: "10px",
    border: "1px solid #e9ecef",
  },
  cartaoIcon: {
    fontSize: "24px",
    marginRight: "15px",
    marginTop: "2px"
  },
  cartaoInfo: {
    flex: 1,
  },
  cartaoBandeira: {
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px",
    fontSize: "1rem"
  },
  cartaoDetalhes: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "5px"
  },
  cartaoPrincipal: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.7rem",
    fontWeight: "600",
    display: "inline-block"
  },
  // Segmentos e QR Codes
  segmentosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  segmentoCard: {
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    textAlign: "center"
  },
  segmentoHeader: {
    marginBottom: "10px",
  },
  segmentoNome: {
    margin: "0 0 5px 0",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
  },
  corredorTag: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.7rem",
    fontWeight: "600",
  },
  qrCodeSection: {
    textAlign: "center",
  },
  qrCodeImage: {
    width: "100px",
    height: "100px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  qrCodeActions: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
  smallButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  smallButtonSecondary: {
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  notificacoesList: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
};

export default LojistaProfile;
