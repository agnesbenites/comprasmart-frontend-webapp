// src/pages/LojistaDashboard/pages/LojistaRegisterPage.jsx
// Cadastro Completo de Lojista - COM Validação Biométrica + Planos + Supabase

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BiometricValidation from "../../../components/BiometricValidation";
import { cadastrarLojista } from "../../../services/lojista.service";

// Links do Stripe para os planos
const STRIPE_LINKS = {
  basic: "https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01",
  pro: "https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02",
  enterprise: "https://buy.stripe.com/3cI3cv2z6fqQaBM8SJgQE03",
};

const LojistaRegisterPage = () => {
  const navigate = useNavigate();
  
  const [etapa, setEtapa] = useState(1);
  const [validacaoConcluida, setValidacaoConcluida] = useState(false);
  const [dadosValidados, setDadosValidados] = useState(null);
  const [tipoPessoa, setTipoPessoa] = useState("PJ");
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  
  // Dados PJ
  const [dadosPJ, setDadosPJ] = useState({
    cnpj: "",
    nomeFantasia: "",
    razaoSocial: "",
    nomeRepresentante: "",
    cpfRepresentante: "",
    emailRepresentante: "",
    telefoneRepresentante: "",
    cartoeCNPJ: null,
    contratoSocial: null,
    docRepresentante: null,
  });
  
  // Dados PF
  const [dadosPF, setDadosPF] = useState({
    cpf: "",
    rg: "",
    nomeCompleto: "",
    nomeLoja: "",
    email: "",
    telefone: "",
    dataNascimento: "",
  });
  
  // Endereço
  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  
  // Senha
  const [acesso, setAcesso] = useState({
    senha: "",
    confirmarSenha: "",
  });
  
  // Vendedores
  const [vendedores, setVendedores] = useState([]);
  const [novoVendedor, setNovoVendedor] = useState({
    nome: "",
    cpf: "",
    matricula: "",
    email: "",
  });
  
  // Filiais
  const [filiais, setFiliais] = useState([]);
  const [novaFilial, setNovaFilial] = useState({
    nome: "",
    cnpj: "",
    cidade: "",
    estado: "",
  });
  
  // Integração ERP
  const [integracao, setIntegracao] = useState({
    erpSelecionado: "",
    urlAPI: "",
    apiKey: "",
  });
  
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);

  // PLANOS
  const PLANOS = [
    {
      id: "basic",
      nome: "Basic",
      preco: "R$ 99",
      periodo: "/mês",
      cor: "#6c757d",
      recursos: [
        "✓ 1 Loja",
        "✓ Até 3 Vendedores",
        "✓ Dashboard básico",
        "✗ Filiais",
        "✗ Integração ERP",
      ],
      limites: { vendedores: 3, filiais: 0, erp: false }
    },
    {
      id: "pro",
      nome: "Pro",
      preco: "R$ 299",
      periodo: "/mês",
      cor: "#bb25a6",
      popular: true,
      recursos: [
        "✓ 1 Loja",
        "✓ Até 15 Vendedores",
        "✓ Até 5 Filiais",
        "✓ Integração ERP (1)",
        "✓ Relatórios completos",
      ],
      limites: { vendedores: 15, filiais: 5, erp: true, erpLimite: 1 }
    },
    {
      id: "enterprise",
      nome: "Enterprise",
      preco: "R$ 499",
      periodo: "/mês",
      cor: "#bb25a6",
      recursos: [
        "✓ Lojas Ilimitadas",
        "✓ Vendedores Ilimitados",
        "✓ Filiais Ilimitadas",
        "✓ Múltiplas Integrações ERP",
        "✓ Suporte 24/7",
      ],
      limites: { vendedores: 999, filiais: 999, erp: true, erpLimite: 999 }
    },
  ];

  const ERPS_DISPONIVEIS = [
    { id: "sap", nome: "SAP", logo: "🔷" },
    { id: "totvs", nome: "TOTVS", logo: "🟢" },
    { id: "bling", nome: "BLING", logo: "🟡" },
    { id: "omie", nome: "OMIE", logo: "🔵" },
  ];

  const ESTADOS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  // Callback biometria
  const handleValidationComplete = (result) => {
    if (result.aprovado) {
      setValidacaoConcluida(true);
      setDadosValidados(result.dados);
      
      setDadosPF({
        ...dadosPF,
        cpf: result.dados.cpf || "",
        rg: result.dados.rg || "",
        nomeCompleto: result.dados.nome || "",
        dataNascimento: result.dados.data_nascimento || "",
      });
      
      setEtapa(2);
      alert("✅ Identidade validada! Score: " + result.score + "%");
    }
  };

  // TEMPORÁRIO: Pular validação biométrica para testes
  const pularValidacao = () => {
    setValidacaoConcluida(true);
    setDadosValidados({
      cpf: "000.000.000-00",
      nome: "Usuário Teste",
      score: 95,
    });
    setEtapa(2);
  };

  // Handlers
  const handleChangePJ = (e) => {
    const { name, value } = e.target;
    setDadosPJ({ ...dadosPJ, [name]: value });
  };

  const handleChangePF = (e) => {
    const { name, value } = e.target;
    setDadosPF({ ...dadosPF, [name]: value });
  };

  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;
    setEndereco({ ...endereco, [name]: value });
  };

  const handleChangeAcesso = (e) => {
    const { name, value } = e.target;
    setAcesso({ ...acesso, [name]: value });
  };

  const handleFileChange = (e, campo) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErro("Arquivo muito grande. Máximo 10MB.");
        return;
      }
      // Validar tipo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!tiposPermitidos.includes(file.type)) {
        setErro("Tipo de arquivo não permitido. Use imagens ou PDF.");
        return;
      }
      setDadosPJ({ ...dadosPJ, [campo]: file });
      setErro("");
    }
  };

  // Buscar CEP
  const buscarCEP = async () => {
    const cepLimpo = endereco.cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco({
            ...endereco,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          });
        } else {
          setErro("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro CEP:", error);
        setErro("Erro ao buscar CEP");
      }
    }
  };

  // Formatadores
  const formatarCNPJ = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const formatarCPF = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .substring(0, 14);
  };

  const formatarCEP = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  // Vendedores
  const adicionarVendedor = () => {
    if (!novoVendedor.nome || !novoVendedor.email || !novoVendedor.cpf) {
      setErro("Preencha Nome, CPF e E-mail do vendedor");
      return;
    }
    const plano = PLANOS.find(p => p.id === planoSelecionado);
    if (vendedores.length >= plano.limites.vendedores) {
      setErro(`Plano permite máximo ${plano.limites.vendedores} vendedores`);
      return;
    }
    setVendedores([...vendedores, { ...novoVendedor, id: Date.now() }]);
    setNovoVendedor({ nome: "", cpf: "", matricula: "", email: "" });
    setErro("");
  };

  const removerVendedor = (id) => {
    setVendedores(vendedores.filter(v => v.id !== id));
  };

  // Filiais
  const adicionarFilial = () => {
    if (!novaFilial.nome || !novaFilial.cidade) {
      setErro("Preencha Nome e Cidade da filial");
      return;
    }
    const plano = PLANOS.find(p => p.id === planoSelecionado);
    if (filiais.length >= plano.limites.filiais) {
      setErro(`Plano permite máximo ${plano.limites.filiais} filiais`);
      return;
    }
    setFiliais([...filiais, { ...novaFilial, id: Date.now() }]);
    setNovaFilial({ nome: "", cnpj: "", cidade: "", estado: "" });
    setErro("");
  };

  const removerFilial = (id) => {
    setFiliais(filiais.filter(f => f.id !== id));
  };

  // Validações
  const validarEtapa2 = () => {
    if (tipoPessoa === "PJ") {
      if (!dadosPJ.cnpj || !dadosPJ.razaoSocial || !dadosPJ.nomeFantasia) {
        setErro("Preencha CNPJ, Razão Social e Nome Fantasia");
        return false;
      }
      if (dadosPJ.cnpj.replace(/\D/g, "").length !== 14) {
        setErro("CNPJ inválido");
        return false;
      }
      if (!dadosPJ.cartoeCNPJ) {
        setErro("Faça upload do Cartão CNPJ");
        return false;
      }
    } else {
      if (!dadosPF.cpf || !dadosPF.nomeCompleto || !dadosPF.nomeLoja) {
        setErro("Preencha todos os campos obrigatórios");
        return false;
      }
    }
    setErro("");
    return true;
  };

  const validarEtapa3 = () => {
    if (tipoPessoa === "PJ") {
      if (!dadosPJ.nomeRepresentante || !dadosPJ.emailRepresentante || !dadosPJ.cpfRepresentante) {
        setErro("Preencha todos os dados do representante");
        return false;
      }
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dadosPJ.emailRepresentante)) {
        setErro("E-mail inválido");
        return false;
      }
    } else {
      if (!dadosPF.email || !dadosPF.telefone) {
        setErro("Preencha Email e Telefone");
        return false;
      }
    }
    setErro("");
    return true;
  };

  const validarEtapa4 = () => {
    if (!endereco.cep || !endereco.logradouro || !endereco.numero || !endereco.cidade || !endereco.estado) {
      setErro("Preencha o endereço completo");
      return false;
    }
    setErro("");
    return true;
  };

  const validarEtapa5 = () => {
    if (!planoSelecionado) {
      setErro("Selecione um plano");
      return false;
    }
    setErro("");
    return true;
  };

  const validarEtapa7 = () => {
    if (!acesso.senha || acesso.senha.length < 6) {
      setErro("Senha deve ter mínimo 6 caracteres");
      return false;
    }
    if (acesso.senha !== acesso.confirmarSenha) {
      setErro("Senhas não coincidem");
      return false;
    }
    if (!termosAceitos) {
      setErro("Você precisa aceitar os termos de uso");
      return false;
    }
    setErro("");
    return true;
  };

  const proximaEtapa = () => {
    let valido = true;
    
    if (etapa === 2) valido = validarEtapa2();
    else if (etapa === 3) valido = validarEtapa3();
    else if (etapa === 4) valido = validarEtapa4();
    else if (etapa === 5) valido = validarEtapa5();
    else if (etapa === 7) valido = validarEtapa7();
    
    if (valido) {
      if (etapa < 7) {
        setEtapa(etapa + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const etapaAnterior = () => {
    if (etapa > 2) {
      setEtapa(etapa - 1);
      window.scrollTo(0, 0);
    }
  };

  // SUBMIT - Salva no Supabase e redireciona para Stripe
  const handleSubmit = async () => {
    setLoading(true);
    setErro("");

    try {
      const resultado = await cadastrarLojista({
        tipoPessoa,
        dadosPJ,
        dadosPF,
        endereco,
        plano: planoSelecionado,
        vendedores,
        filiais,
        integracao,
        validacaoBiometrica: {
          aprovado: true,
          score: dadosValidados?.score || 95,
          dados: dadosValidados,
        },
        senha: acesso.senha,
      });

      if (resultado.success) {
        // ✅ Salva dados temporários para após o pagamento (incluindo senha)
        localStorage.setItem("cadastro_pendente", JSON.stringify({
          email: tipoPessoa === "PJ" ? dadosPJ.emailRepresentante : dadosPF.email,
          senha: acesso.senha,
          plano: planoSelecionado,
          lojaId: resultado.loja.id,
          userId: resultado.user.id,
          timestamp: Date.now()
        }));

        // ✅ Configura URLs de retorno do Stripe
        const baseUrl = window.location.origin;
        const successUrl = `${baseUrl}/stripe-success?success=true`;
        const cancelUrl = `${baseUrl}/cadastro/lojista`;
        
        // ✅ Adiciona parâmetros de retorno na URL do Stripe
        const stripeBaseUrl = STRIPE_LINKS[planoSelecionado];
        const stripeUrl = `${stripeBaseUrl}?success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
        
        if (stripeBaseUrl) {
          alert(
            `✅ Cadastro realizado com sucesso!\n\n` +
            `Você será redirecionado para o pagamento do plano ${PLANOS.find(p => p.id === planoSelecionado)?.nome}.\n\n` +
            `Após o pagamento, seu acesso será liberado automaticamente.`
          );
          
          // Redireciona para o Stripe com URLs de retorno
          window.location.href = stripeUrl;
        } else {
          // Plano gratuito ou erro - vai direto pro login
          alert(
            `✅ Cadastro realizado com sucesso!\n\n` +
            `Um email de confirmação foi enviado para ${tipoPessoa === "PJ" ? dadosPJ.emailRepresentante : dadosPF.email}`
          );
          navigate("/lojista/login");
        }
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      
      // Mensagens de erro amigáveis
      if (error.message?.includes("already registered")) {
        setErro("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
      } else if (error.message?.includes("Password")) {
        setErro("Senha muito fraca. Use letras, números e caracteres especiais.");
      } else if (error.message?.includes("User already registered")) {
        setErro("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
      } else {
        setErro(`Erro ao realizar cadastro: ${error.message || "Tente novamente."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const planoAtual = PLANOS.find(p => p.id === planoSelecionado);

  return (
    <div style={styles.container}>
      {/* ETAPA 1: VALIDAÇÃO BIOMÉTRICA */}
      {etapa === 1 && !validacaoConcluida && (
        <>
          <BiometricValidation
            onValidationComplete={handleValidationComplete}
            userType="lojista"
          />
          {/* BOTÃO TEMPORÁRIO PARA TESTES */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={pularValidacao}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ⏭️ Pular Validação (Modo Teste)
            </button>
          </div>
        </>
      )}

      {/* ETAPAS 2-7: FORMULÁRIO */}
      {etapa >= 2 && validacaoConcluida && (
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>🏪 Cadastro de Lojista</h1>
            <p style={styles.subtitle}>Configure sua loja e escolha o plano</p>
            
            {/* Badge validação */}
            <div style={styles.validatedBadge}>
              ✅ Identidade Verificada - Score: {dadosValidados?.score || 95}%
            </div>

            {/* Progress */}
            <div style={styles.progressBar}>
              {[1,2,3,4,5,6,7].map(num => (
                <div key={num} style={{
                  ...styles.progressStep,
                  backgroundColor: etapa >= num ? "#bb25a6" : "#e0e0e0"
                }}>
                  {num === 1 ? "✓" : num}
                </div>
              ))}
            </div>
            <div style={styles.progressLabels}>
              <span style={styles.labelActive}>Bio</span>
              <span style={etapa >= 2 ? styles.labelActive : styles.label}>Dados</span>
              <span style={etapa >= 3 ? styles.labelActive : styles.label}>Contato</span>
              <span style={etapa >= 4 ? styles.labelActive : styles.label}>End.</span>
              <span style={etapa >= 5 ? styles.labelActive : styles.label}>Plano</span>
              <span style={etapa >= 6 ? styles.labelActive : styles.label}>Config</span>
              <span style={etapa >= 7 ? styles.labelActive : styles.label}>Senha</span>
            </div>
          </div>

          <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* ETAPA 2: TIPO PJ/PF + DADOS */}
            {etapa === 2 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>📋 Dados da Empresa</h2>
                
                {/* Toggle */}
                <div style={styles.toggleGroup}>
                  <button type="button" onClick={() => setTipoPessoa("PJ")} style={{
                    ...styles.toggleButton,
                    backgroundColor: tipoPessoa === "PJ" ? "#bb25a6" : "#f8f9fa",
                    color: tipoPessoa === "PJ" ? "white" : "#666"
                  }}>
                    🏢 Pessoa Jurídica (CNPJ)
                  </button>
                  <button type="button" onClick={() => setTipoPessoa("PF")} style={{
                    ...styles.toggleButton,
                    backgroundColor: tipoPessoa === "PF" ? "#bb25a6" : "#f8f9fa",
                    color: tipoPessoa === "PF" ? "white" : "#666"
                  }}>
                    👤 Pessoa Física (MEI)
                  </button>
                </div>

                {/* Form PJ */}
                {tipoPessoa === "PJ" && (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>CNPJ *</label>
                      <input 
                        type="text" 
                        name="cnpj" 
                        value={dadosPJ.cnpj} 
                        onChange={(e) => setDadosPJ({...dadosPJ, cnpj: formatarCNPJ(e.target.value)})}
                        placeholder="00.000.000/0000-00" 
                        style={styles.input} 
                        maxLength={18}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Razão Social *</label>
                      <input type="text" name="razaoSocial" value={dadosPJ.razaoSocial} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome Fantasia *</label>
                      <input type="text" name="nomeFantasia" value={dadosPJ.nomeFantasia} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    
                    <h3 style={{...styles.label, marginTop: "24px", marginBottom: "16px"}}>📎 Documentos</h3>
                    
                    <div style={styles.fileUpload}>
                      <label style={styles.label}>📄 Cartão CNPJ *</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "cartoeCNPJ")} style={styles.fileInput} />
                      {dadosPJ.cartoeCNPJ && <span style={styles.fileName}>✅ {dadosPJ.cartoeCNPJ.name}</span>}
                    </div>
                    
                    <div style={styles.fileUpload}>
                      <label style={styles.label}>📄 Contrato Social (opcional)</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "contratoSocial")} style={styles.fileInput} />
                      {dadosPJ.contratoSocial && <span style={styles.fileName}>✅ {dadosPJ.contratoSocial.name}</span>}
                    </div>
                  </>
                )}

                {/* Form PF */}
                {tipoPessoa === "PF" && (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>CPF *</label>
                      <input 
                        type="text" 
                        name="cpf" 
                        value={dadosPF.cpf} 
                        style={{...styles.input, backgroundColor: "#e8f5e9"}} 
                        readOnly 
                      />
                      <span style={styles.autoFilled}>✅ Extraído do documento</span>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome Completo *</label>
                      <input 
                        type="text" 
                        name="nomeCompleto" 
                        value={dadosPF.nomeCompleto} 
                        style={{...styles.input, backgroundColor: "#e8f5e9"}} 
                        readOnly 
                      />
                      <span style={styles.autoFilled}>✅ Extraído do documento</span>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome da Loja *</label>
                      <input type="text" name="nomeLoja" value={dadosPF.nomeLoja} onChange={handleChangePF} style={styles.input} placeholder="Como sua loja será conhecida" />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ETAPA 3: CONTATO/REPRESENTANTE */}
            {etapa === 3 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>{tipoPessoa === "PJ" ? "👔 Representante Legal" : "📞 Contato"}</h2>
                {tipoPessoa === "PJ" ? (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome do Representante *</label>
                      <input type="text" name="nomeRepresentante" value={dadosPJ.nomeRepresentante} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>CPF do Representante *</label>
                      <input 
                        type="text" 
                        name="cpfRepresentante" 
                        value={dadosPJ.cpfRepresentante} 
                        onChange={(e) => setDadosPJ({...dadosPJ, cpfRepresentante: formatarCPF(e.target.value)})}
                        placeholder="000.000.000-00"
                        style={styles.input} 
                        maxLength={14}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Email *</label>
                      <input type="email" name="emailRepresentante" value={dadosPJ.emailRepresentante} onChange={handleChangePJ} style={styles.input} placeholder="email@empresa.com" />
                      <small style={{color: "#666"}}>Este será o email de acesso ao sistema</small>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Telefone *</label>
                      <input type="tel" name="telefoneRepresentante" value={dadosPJ.telefoneRepresentante} onChange={handleChangePJ} style={styles.input} placeholder="(00) 00000-0000" />
                    </div>
                    
                    <div style={styles.fileUpload}>
                      <label style={styles.label}>📄 Documento do Representante (opcional)</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "docRepresentante")} style={styles.fileInput} />
                      {dadosPJ.docRepresentante && <span style={styles.fileName}>✅ {dadosPJ.docRepresentante.name}</span>}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>E-mail *</label>
                      <input type="email" name="email" value={dadosPF.email} onChange={handleChangePF} style={styles.input} placeholder="seu@email.com" />
                      <small style={{color: "#666"}}>Este será o email de acesso ao sistema</small>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Telefone *</label>
                      <input type="tel" name="telefone" value={dadosPF.telefone} onChange={handleChangePF} style={styles.input} placeholder="(00) 00000-0000" />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ETAPA 4: ENDEREÇO */}
            {etapa === 4 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>📍 Endereço da Loja</h2>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>CEP *</label>
                  <div style={styles.cepGroup}>
                    <input 
                      type="text" 
                      name="cep" 
                      value={endereco.cep} 
                      onChange={(e) => setEndereco({...endereco, cep: formatarCEP(e.target.value)})}
                      onBlur={buscarCEP} 
                      placeholder="00000-000" 
                      style={{...styles.input, marginBottom: 0}} 
                      maxLength={9}
                    />
                    <button type="button" onClick={buscarCEP} style={styles.cepButton}>🔍 Buscar</button>
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Logradouro *</label>
                  <input type="text" name="logradouro" value={endereco.logradouro} onChange={handleChangeEndereco} style={styles.input} />
                </div>
                <div style={styles.row}>
                  <div style={{...styles.inputGroup, flex: 1}}>
                    <label style={styles.label}>Número *</label>
                    <input type="text" name="numero" value={endereco.numero} onChange={handleChangeEndereco} style={styles.input} />
                  </div>
                  <div style={{...styles.inputGroup, flex: 2}}>
                    <label style={styles.label}>Complemento</label>
                    <input type="text" name="complemento" value={endereco.complemento} onChange={handleChangeEndereco} style={styles.input} placeholder="Sala, andar, etc." />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Bairro *</label>
                  <input type="text" name="bairro" value={endereco.bairro} onChange={handleChangeEndereco} style={styles.input} />
                </div>
                <div style={styles.row}>
                  <div style={{...styles.inputGroup, flex: 3}}>
                    <label style={styles.label}>Cidade *</label>
                      <input type="text" name="cidade" value={endereco.cidade} onChange={handleChangeEndereco} style={styles.input} />
                  </div>
                  <div style={{...styles.inputGroup, flex: 1}}>
                    <label style={styles.label}>Estado *</label>
                    <select name="estado" value={endereco.estado} onChange={handleChangeEndereco} style={styles.input}>
                      <option value="">UF</option>
                      {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 5: PLANOS */}
            {etapa === 5 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>💎 Escolha seu Plano</h2>
                <div style={styles.planosGrid}>
                  {PLANOS.map(plano => (
                    <div key={plano.id} onClick={() => setPlanoSelecionado(plano.id)} style={{
                      ...styles.planoCard,
                      border: planoSelecionado === plano.id ? `3px solid ${plano.cor}` : "2px solid #e0e0e0",
                      transform: planoSelecionado === plano.id ? "scale(1.02)" : "scale(1)",
                      cursor: "pointer"
                    }}>
                      {plano.popular && <div style={styles.popularBadge}>⭐ POPULAR</div>}
                      <h3 style={{...styles.planoNome, color: plano.cor}}>{plano.nome}</h3>
                      <div style={styles.planoPreco}>
                        <span style={styles.preco}>{plano.preco}</span>
                        <span style={styles.periodo}>{plano.periodo}</span>
                      </div>
                      <ul style={styles.recursosList}>
                        {plano.recursos.map((r, i) => (
                          <li key={i} style={{
                            ...styles.recursoItem,
                            color: r.startsWith("✗") ? "#999" : "#333"
                          }}>{r}</li>
                        ))}
                      </ul>
                      {planoSelecionado === plano.id && <div style={styles.selecionadoCheck}>✅ Selecionado</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ETAPA 6: CONFIGURAÇÕES */}
            {etapa === 6 && planoAtual && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>⚙️ Configurações Iniciais</h2>
                <p style={styles.subtitle}>Configure vendedores, filiais e integrações (opcional - pode fazer depois)</p>

                {/* VENDEDORES */}
                {planoAtual.limites.vendedores > 0 && (
                  <div style={styles.secao}>
                    <h3 style={styles.secaoTitle}>👥 Vendedores ({vendedores.length}/{planoAtual.limites.vendedores})</h3>
                    <div style={styles.formInline}>
                      <input type="text" placeholder="Nome" value={novoVendedor.nome} onChange={(e) => setNovoVendedor({...novoVendedor, nome: e.target.value})} style={styles.inputInline} />
                      <input type="text" placeholder="CPF" value={novoVendedor.cpf} onChange={(e) => setNovoVendedor({...novoVendedor, cpf: formatarCPF(e.target.value)})} style={styles.inputInline} maxLength={14} />
                      <input type="email" placeholder="Email" value={novoVendedor.email} onChange={(e) => setNovoVendedor({...novoVendedor, email: e.target.value})} style={styles.inputInline} />
                      <button type="button" onClick={adicionarVendedor} style={styles.addButton}>+ Adicionar</button>
                    </div>
                    <p style={styles.helperText}>📧 O vendedor receberá um email com link para configurar a senha</p>
                    {vendedores.length > 0 && (
                      <div style={styles.lista}>
                        {vendedores.map(v => (
                          <div key={v.id} style={styles.listaItem}>
                            <div><strong>{v.nome}</strong> - {v.email}</div>
                            <button type="button" onClick={() => removerVendedor(v.id)} style={styles.removeButton}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* FILIAIS */}
                {planoAtual.limites.filiais > 0 && (
                  <div style={styles.secao}>
                    <h3 style={styles.secaoTitle}>🏢 Filiais ({filiais.length}/{planoAtual.limites.filiais})</h3>
                    <div style={styles.formInline}>
                      <input type="text" placeholder="Nome da Filial" value={novaFilial.nome} onChange={(e) => setNovaFilial({...novaFilial, nome: e.target.value})} style={styles.inputInline} />
                      <input type="text" placeholder="CNPJ (opcional)" value={novaFilial.cnpj} onChange={(e) => setNovaFilial({...novaFilial, cnpj: formatarCNPJ(e.target.value)})} style={styles.inputInline} maxLength={18} />
                      <input type="text" placeholder="Cidade" value={novaFilial.cidade} onChange={(e) => setNovaFilial({...novaFilial, cidade: e.target.value})} style={styles.inputInline} />
                      <select value={novaFilial.estado} onChange={(e) => setNovaFilial({...novaFilial, estado: e.target.value})} style={styles.inputInline}>
                        <option value="">UF</option>
                        {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                      <button type="button" onClick={adicionarFilial} style={styles.addButton}>+ Adicionar</button>
                    </div>
                    {filiais.length > 0 && (
                      <div style={styles.lista}>
                        {filiais.map(f => (
                          <div key={f.id} style={styles.listaItem}>
                            <div><strong>{f.nome}</strong> - {f.cidade}/{f.estado}</div>
                            <button type="button" onClick={() => removerFilial(f.id)} style={styles.removeButton}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ERP */}
                {planoAtual.limites.erp && (
                  <div style={styles.secao}>
                    <h3 style={styles.secaoTitle}>🔗 Integração ERP</h3>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Selecione o ERP</label>
                      <select value={integracao.erpSelecionado} onChange={(e) => setIntegracao({...integracao, erpSelecionado: e.target.value})} style={styles.input}>
                        <option value="">Nenhum (configurar depois)</option>
                        {ERPS_DISPONIVEIS.map(erp => <option key={erp.id} value={erp.id}>{erp.logo} {erp.nome}</option>)}
                      </select>
                    </div>
                    {integracao.erpSelecionado && (
                      <>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>URL da API</label>
                          <input type="url" placeholder="https://api.seu-erp.com" value={integracao.urlAPI} onChange={(e) => setIntegracao({...integracao, urlAPI: e.target.value})} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>API Key</label>
                          <input type="password" placeholder="Sua chave de API" value={integracao.apiKey} onChange={(e) => setIntegracao({...integracao, apiKey: e.target.value})} style={styles.input} />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ETAPA 7: SENHA + RESUMO */}
            {etapa === 7 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>🔐 Finalizar Cadastro</h2>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Senha *</label>
                  <input type="password" name="senha" value={acesso.senha} onChange={handleChangeAcesso} placeholder="Mínimo 6 caracteres" style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirmar Senha *</label>
                  <input type="password" name="confirmarSenha" value={acesso.confirmarSenha} onChange={handleChangeAcesso} placeholder="Repita a senha" style={styles.input} />
                </div>

                <div style={styles.resumo}>
                  <h3 style={styles.resumoTitle}>📋 Resumo do Cadastro</h3>
                  <p><strong>Plano:</strong> {planoAtual?.nome} - {planoAtual?.preco}{planoAtual?.periodo}</p>
                  <p><strong>{tipoPessoa === "PJ" ? "Empresa" : "Loja"}:</strong> {tipoPessoa === "PJ" ? dadosPJ.nomeFantasia : dadosPF.nomeLoja}</p>
                  {tipoPessoa === "PJ" && <p><strong>CNPJ:</strong> {dadosPJ.cnpj}</p>}
                  <p><strong>Cidade:</strong> {endereco.cidade}/{endereco.estado}</p>
                  <p><strong>Email:</strong> {tipoPessoa === "PJ" ? dadosPJ.emailRepresentante : dadosPF.email}</p>
                  {vendedores.length > 0 && <p><strong>Vendedores:</strong> {vendedores.length}</p>}
                  {filiais.length > 0 && <p><strong>Filiais:</strong> {filiais.length}</p>}
                  {integracao.erpSelecionado && <p><strong>ERP:</strong> {ERPS_DISPONIVEIS.find(e => e.id === integracao.erpSelecionado)?.nome}</p>}
                  <p><strong>Validação:</strong> ✅ Aprovada ({dadosValidados?.score || 95}%)</p>
                </div>

                <div style={styles.termos}>
                  <label style={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={termosAceitos}
                      onChange={(e) => setTermosAceitos(e.target.checked)}
                    />
                    <span style={{marginLeft: "8px"}}>
                      Li e aceito os <a href="/termos" target="_blank" style={styles.link}>Termos de Uso</a> e <a href="/privacidade" target="_blank" style={styles.link}>Política de Privacidade</a>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ERRO */}
            {erro && <div style={styles.erro}>❌ {erro}</div>}

            {/* BOTÕES */}
            <div style={styles.buttonGroup}>
              {etapa > 2 && (
                <button type="button" onClick={etapaAnterior} style={styles.buttonSecondary} disabled={loading}>
                  ← Voltar
                </button>
              )}
              <button 
                type="button" 
                onClick={proximaEtapa} 
                style={{...styles.buttonPrimary, opacity: loading ? 0.6 : 1}} 
                disabled={loading}
              >
                {loading ? "⏳ Processando..." : etapa === 7 ? "✅ Finalizar Cadastro" : "Próximo →"}
              </button>
            </div>

            {/* LINK LOGIN */}
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Já tem conta? <button type="button" onClick={() => navigate("/lojista/login")} style={styles.linkButton}>Faça login</button>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" },
  card: { maxWidth: "900px", margin: "0 auto", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  header: { padding: "32px", textAlign: "center", borderBottom: "2px solid #f0f0f0" },
  title: { fontSize: "2rem", fontWeight: "700", color: "#bb25a6", marginBottom: "8px" },
  subtitle: { fontSize: "1rem", color: "#666", marginBottom: "16px" },
  validatedBadge: { display: "inline-block", padding: "8px 16px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "600", marginBottom: "20px", border: "2px solid #c3e6cb" },
  progressBar: { display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" },
  progressStep: { width: "35px", height: "35px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "0.85rem", transition: "background-color 0.3s" },
  progressLabels: { display: "flex", justifyContent: "center", gap: "24px", fontSize: "0.75rem", marginTop: "8px" },
  label: { color: "#999", display: "block", marginBottom: "6px", fontWeight: "600" },
  labelActive: { color: "#bb25a6", fontWeight: "600" },
  form: { padding: "32px" },
  etapa: { marginBottom: "24px" },
  etapaTitle: { fontSize: "1.3rem", fontWeight: "600", color: "#333", marginBottom: "20px" },
  toggleGroup: { display: "flex", gap: "12px", marginBottom: "24px" },
  toggleButton: { flex: 1, padding: "14px", border: "2px solid #e0e0e0", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
  inputGroup: { marginBottom: "18px" },
  input: { width: "100%", padding: "12px 16px", fontSize: "1rem", border: "2px solid #e0e0e0", borderRadius: "8px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  row: { display: "flex", gap: "16px" },
  fileUpload: { marginBottom: "20px" },
  fileInput: { width: "100%", padding: "12px", border: "2px dashed #e0e0e0", borderRadius: "8px", cursor: "pointer", backgroundColor: "#fafafa" },
  fileName: { display: "block", marginTop: "8px", fontSize: "0.9rem", color: "#bb25a6", fontWeight: "600" },
  autoFilled: { display: "block", marginTop: "4px", fontSize: "0.8rem", color: "#bb25a6", fontWeight: "600" },
  cepGroup: { display: "flex", gap: "8px" },
  cepButton: { padding: "12px 20px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap", fontWeight: "600" },
  planosGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" },
  planoCard: { padding: "24px", borderRadius: "12px", transition: "all 0.3s", position: "relative", backgroundColor: "white" },
  popularBadge: { position: "absolute", top: "10px", right: "10px", backgroundColor: "#ffc107", color: "#000", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" },
  planoNome: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "12px" },
  planoPreco: { marginBottom: "20px" },
  preco: { fontSize: "2rem", fontWeight: "700" },
  periodo: { fontSize: "1rem", color: "#666" },
  recursosList: { listStyle: "none", padding: 0, marginBottom: "16px" },
  recursoItem: { padding: "6px 0", fontSize: "0.9rem" },
  selecionadoCheck: { textAlign: "center", padding: "10px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "6px", fontWeight: "600" },
  secao: { marginBottom: "32px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" },
  secaoTitle: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "16px", color: "#333" },
  formInline: { display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" },
  inputInline: { flex: 1, minWidth: "140px", padding: "10px", border: "2px solid #e0e0e0", borderRadius: "6px", fontSize: "0.9rem" },
  addButton: { padding: "10px 20px", backgroundColor: "#bb25a6", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  helperText: { fontSize: "0.8rem", color: "#666", marginTop: "8px" },
  lista: { marginTop: "16px" },
  listaItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "white", borderRadius: "6px", marginBottom: "8px", border: "1px solid #e0e0e0" },
  removeButton: { padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "600" },
  resumo: { backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" },
  resumoTitle: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "12px" },
  termos: { marginTop: "20px", padding: "16px", backgroundColor: "#f0f0f0", borderRadius: "8px" },
  checkboxLabel: { display: "flex", alignItems: "flex-start", fontSize: "0.9rem", cursor: "pointer" },
  link: { color: "#bb25a6", fontWeight: "600" },
  erro: { padding: "12px 16px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "16px", border: "1px solid #ef9a9a", fontWeight: "500" },
  buttonGroup: { display: "flex", gap: "12px", marginTop: "24px" },
  buttonPrimary: { flex: 1, padding: "16px", backgroundColor: "#bb25a6", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" },
  buttonSecondary: { padding: "16px 24px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  footer: { marginTop: "24px", padding: "20px", borderTop: "1px solid #e0e0e0", textAlign: "center" },
  footerText: { fontSize: "0.9rem", color: "#666" },
  linkButton: { background: "none", border: "none", color: "#bb25a6", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", textDecoration: "underline" },
};

export default LojistaRegisterPage;