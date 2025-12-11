// src/pages/LojistaDashboard/pages/LojistaRegisterPage.jsx
// Cadastro Completo de Lojista - COM Validacao Biometrica + Planos

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BiometricValidation from "../../../components/BiometricValidation";

const LojistaRegisterPage = () => {
  const navigate = useNavigate();
  
  const [etapa, setEtapa] = useState(1); // 1:Biometria, 2:Tipo PJ/PF, 3:Contato, 4:Endereco, 5:Plano, 6:Config, 7:Senha
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
  
  // Endereco
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
  
  // Integracao ERP
  const [integracao, setIntegracao] = useState({
    erpSelecionado: "",
    urlAPI: "",
    apiKey: "",
  });
  
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // PLANOS
  const PLANOS = [
    {
      id: "basic",
      nome: "Basic",
      preco: "R$ 99",
      periodo: "/mas",
      cor: "#6c757d",
      recursos: [
        " 1 Loja",
        " Ate 3 Vendedores",
        " Dashboard basico",
        " Filiais",
        " Integracao ERP",
      ],
      limites: { vendedores: 3, filiais: 0, erp: false }
    },
    {
      id: "pro",
      nome: "Pro",
      preco: "R$ 299",
      periodo: "/mas",
      cor: "#007bff",
      popular: true,
      recursos: [
        " 1 Loja",
        " Ate 15 Vendedores",
        " Ate 5 Filiais",
        " Integracao ERP (1)",
        " Relatorios completos",
      ],
      limites: { vendedores: 15, filiais: 5, erp: true, erpLimite: 1 }
    },
    {
      id: "enterprise",
      nome: "Enterprise",
      preco: "R$ 799",
      periodo: "/mas",
      cor: "#28a745",
      recursos: [
        " Lojas Ilimitadas",
        " Vendedores Ilimitados",
        " Filiais Ilimitadas",
        " Multiplas Integracoes ERP",
        " Suporte 24/7",
      ],
      limites: { vendedores: 999, filiais: 999, erp: true, erpLimite: 999 }
    },
  ];

  const ERPS_DISPONIVEIS = [
    { id: "sap", nome: "SAP", logo: "" },
    { id: "totvs", nome: "TOTVS", logo: "" },
    { id: "bling", nome: "BLING", logo: "" },
    { id: "omie", nome: "OMIE", logo: "" },
  ];

  // Callback biometria
  const handleValidationComplete = (result) => {
    if (result.aprovado) {
      setValidacaoConcluida(true);
      setDadosValidados(result.dados);
      
      // Preencher dados PF
      setDadosPF({
        ...dadosPF,
        cpf: result.dados.cpf || "",
        rg: result.dados.rg || "",
        nomeCompleto: result.dados.nome || "",
        dataNascimento: result.dados.data_nascimento || "",
      });
      
      setEtapa(2);
      alert(" Identidade validada! Score: " + result.score + "%");
    }
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
    setDadosPJ({ ...dadosPJ, [campo]: file });
  };

  // Buscar CEP
  const buscarCEP = async () => {
    if (endereco.cep.replace(/\D/g, "").length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${endereco.cep.replace(/\D/g, "")}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco({
            ...endereco,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          });
        }
      } catch (error) {
        console.error("Erro CEP:", error);
      }
    }
  };

  // Vendedores
  const adicionarVendedor = () => {
    if (!novoVendedor.nome || !novoVendedor.email || !novoVendedor.cpf) {
      setErro("Preencha Nome, CPF e E-mail");
      return;
    }
    const plano = PLANOS.find(p => p.id === planoSelecionado);
    if (vendedores.length >= plano.limites.vendedores) {
      setErro(`Plano permite maximo ${plano.limites.vendedores} vendedores`);
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
      setErro("Preencha Nome e Cidade");
      return;
    }
    const plano = PLANOS.find(p => p.id === planoSelecionado);
    if (filiais.length >= plano.limites.filiais) {
      setErro(`Plano permite maximo ${plano.limites.filiais} filiais`);
      return;
    }
    setFiliais([...filiais, { ...novaFilial, id: Date.now() }]);
    setNovaFilial({ nome: "", cnpj: "", cidade: "", estado: "" });
    setErro("");
  };

  const removerFilial = (id) => {
    setFiliais(filiais.filter(f => f.id !== id));
  };

  // Validacoes
  const validarEtapa2 = () => {
    if (tipoPessoa === "PJ") {
      if (!dadosPJ.cnpj || !dadosPJ.razaoSocial || !dadosPJ.nomeFantasia) {
        setErro("Preencha CNPJ, Razao Social e Nome Fantasia");
        return false;
      }
      if (!dadosPJ.cartoeCNPJ) {
        setErro("Faca upload do Cartao CNPJ");
        return false;
      }
    } else {
      if (!dadosPF.cpf || !dadosPF.nomeCompleto || !dadosPF.nomeLoja) {
        setErro("Preencha todos os campos obrigatorios");
        return false;
      }
    }
    setErro("");
    return true;
  };

  const validarEtapa3 = () => {
    if (tipoPessoa === "PJ") {
      if (!dadosPJ.nomeRepresentante || !dadosPJ.emailRepresentante) {
        setErro("Preencha dados do representante");
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
    if (!endereco.cep || !endereco.logradouro || !endereco.cidade) {
      setErro("Preencha o endereco completo");
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
      setErro("Senha minimo 6 caracteres");
      return false;
    }
    if (acesso.senha !== acesso.confirmarSenha) {
      setErro("Senhas nao coincidem");
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
    if (etapa > 2) { // Nao volta para biometria
      setEtapa(etapa - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        tipoPessoa,
        plano: planoSelecionado,
        dados: tipoPessoa === "PJ" ? dadosPJ : dadosPF,
        endereco,
        senha: acesso.senha,
        vendedores,
        filiais,
        integracao,
        validacao_biometrica: {
          aprovado: true,
          score: dadosValidados?.score || 95,
          dados: dadosValidados,
        },
      };

      console.log("Enviando:", payload);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular envio emails vendedores
      vendedores.forEach(v => {
        console.log(` Email enviado para ${v.email}`);
      });

      alert(` Cadastro realizado!\n\nPlano: ${PLANOS.find(p => p.id === planoSelecionado).nome}\nVendedores: ${vendedores.length}\nEmails enviados!`);
      navigate("/lojista/login");
    } catch (error) {
      setErro("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const planoAtual = PLANOS.find(p => p.id === planoSelecionado);

  return (
    <div style={styles.container}>
      {/* ETAPA 1: VALIDACAO BIOM‰TRICA */}
      {etapa === 1 && !validacaoConcluida && (
        <BiometricValidation
          onValidationComplete={handleValidationComplete}
          userType="lojista"
        />
      )}

      {/* ETAPAS 2-7: FORMULRIO */}
      {etapa >= 2 && validacaoConcluida && (
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}> Cadastro de Lojista</h1>
            <p style={styles.subtitle}>Configure sua loja e escolha o plano</p>
            
            {/* Badge validacao */}
            <div style={styles.validatedBadge}>
               Identidade Verificada - Score: {dadosValidados?.score || 95}%
            </div>

            {/* Progress */}
            <div style={styles.progressBar}>
              {[1,2,3,4,5,6,7].map(num => (
                <div key={num} style={{
                  ...styles.progressStep,
                  backgroundColor: etapa >= num ? "#28a745" : "#e0e0e0"
                }}>
                  {num === 1 ? "“" : num}
                </div>
              ))}
            </div>
            <div style={styles.progressLabels}>
              <span style={styles.labelActive}>Bio</span>
              <span style={etapa >= 2 ? styles.labelActive : styles.label}>Dados</span>
              <span style={etapa >= 3 ? styles.labelActive : styles.label}>Contato</span>
              <span style={etapa >= 4 ? styles.labelActive : styles.label}>End</span>
              <span style={etapa >= 5 ? styles.labelActive : styles.label}>Plano</span>
              <span style={etapa >= 6 ? styles.labelActive : styles.label}>Config</span>
              <span style={etapa >= 7 ? styles.labelActive : styles.label}>Senha</span>
            </div>
          </div>

          <form style={styles.form}>
            {/* ETAPA 2: TIPO PJ/PF + DADOS */}
            {etapa === 2 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}> Dados da Empresa</h2>
                
                {/* Toggle */}
                <div style={styles.toggleGroup}>
                  <button type="button" onClick={() => setTipoPessoa("PJ")} style={{
                    ...styles.toggleButton,
                    backgroundColor: tipoPessoa === "PJ" ? "#28a745" : "#f8f9fa",
                    color: tipoPessoa === "PJ" ? "white" : "#666"
                  }}>
                     Pessoa Juridica (CNPJ)
                  </button>
                  <button type="button" onClick={() => setTipoPessoa("PF")} style={{
                    ...styles.toggleButton,
                    backgroundColor: tipoPessoa === "PF" ? "#28a745" : "#f8f9fa",
                    color: tipoPessoa === "PF" ? "white" : "#666"
                  }}>
                     Pessoa Fisica (MEI)
                  </button>
                </div>

                {/* Form PJ */}
                {tipoPessoa === "PJ" && (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>CNPJ *</label>
                      <input type="text" name="cnpj" value={dadosPJ.cnpj} onChange={handleChangePJ} placeholder="00.000.000/0000-00" style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Razao Social *</label>
                      <input type="text" name="razaoSocial" value={dadosPJ.razaoSocial} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome Fantasia *</label>
                      <input type="text" name="nomeFantasia" value={dadosPJ.nomeFantasia} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    <div style={styles.fileUpload}>
                      <label style={styles.label}> Cartao CNPJ *</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "cartoeCNPJ")} style={styles.fileInput} />
                      {dadosPJ.cartoeCNPJ && <span style={styles.fileName}> {dadosPJ.cartoeCNPJ.name}</span>}
                    </div>
                  </>
                )}

                {/* Form PF */}
                {tipoPessoa === "PF" && (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>CPF *</label>
                      <input type="text" name="cpf" value={dadosPF.cpf} onChange={handleChangePF} style={{...styles.input, backgroundColor: "#e8f5e9"}} readOnly />
                      <span style={styles.autoFilled}> Extraido do documento</span>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome Completo *</label>
                      <input type="text" name="nomeCompleto" value={dadosPF.nomeCompleto} onChange={handleChangePF} style={{...styles.input, backgroundColor: "#e8f5e9"}} readOnly />
                      <span style={styles.autoFilled}> Extraido do documento</span>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome da Loja *</label>
                      <input type="text" name="nomeLoja" value={dadosPF.nomeLoja} onChange={handleChangePF} style={styles.input} />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ETAPA 3: CONTATO/REPRESENTANTE */}
            {etapa === 3 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}>{tipoPessoa === "PJ" ? " Representante Legal" : " Contato"}</h2>
                {tipoPessoa === "PJ" ? (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nome Representante *</label>
                      <input type="text" name="nomeRepresentante" value={dadosPJ.nomeRepresentante} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>CPF Representante *</label>
                      <input type="text" name="cpfRepresentante" value={dadosPJ.cpfRepresentante} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Email *</label>
                      <input type="email" name="emailRepresentante" value={dadosPJ.emailRepresentante} onChange={handleChangePJ} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Telefone *</label>
                      <input type="tel" name="telefoneRepresentante" value={dadosPJ.telefoneRepresentante} onChange={handleChangePJ} style={styles.input} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>E-mail *</label>
                      <input type="email" name="email" value={dadosPF.email} onChange={handleChangePF} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Telefone *</label>
                      <input type="tel" name="telefone" value={dadosPF.telefone} onChange={handleChangePF} style={styles.input} />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ETAPA 4: ENDERECO */}
            {etapa === 4 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}> Endereco da Loja</h2>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>CEP *</label>
                  <div style={styles.cepGroup}>
                    <input type="text" name="cep" value={endereco.cep} onChange={handleChangeEndereco} onBlur={buscarCEP} placeholder="00000-000" style={{...styles.input, marginBottom: 0}} />
                    <button type="button" onClick={buscarCEP} style={styles.cepButton}></button>
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Logradouro *</label>
                  <input type="text" name="logradouro" value={endereco.logradouro} onChange={handleChangeEndereco} style={styles.input} />
                </div>
                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Numero *</label>
                    <input type="text" name="numero" value={endereco.numero} onChange={handleChangeEndereco} style={styles.input} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Complemento</label>
                    <input type="text" name="complemento" value={endereco.complemento} onChange={handleChangeEndereco} style={styles.input} />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Bairro *</label>
                  <input type="text" name="bairro" value={endereco.bairro} onChange={handleChangeEndereco} style={styles.input} />
                </div>
                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Cidade *</label>
                    <input type="text" name="cidade" value={endereco.cidade} onChange={handleChangeEndereco} style={styles.input} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Estado *</label>
                    <select name="estado" value={endereco.estado} onChange={handleChangeEndereco} style={styles.input}>
                      <option value="">UF</option>
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 5: PLANOS */}
            {etapa === 5 && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}> Escolha seu Plano</h2>
                <div style={styles.planosGrid}>
                  {PLANOS.map(plano => (
                    <div key={plano.id} onClick={() => setPlanoSelecionado(plano.id)} style={{
                      ...styles.planoCard,
                      border: planoSelecionado === plano.id ? `3px solid ${plano.cor}` : "2px solid #e0e0e0",
                      transform: planoSelecionado === plano.id ? "scale(1.02)" : "scale(1)",
                      cursor: "pointer"
                    }}>
                      {plano.popular && <div style={styles.popularBadge}>i POPULAR</div>}
                      <h3 style={{...styles.planoNome, color: plano.cor}}>{plano.nome}</h3>
                      <div style={styles.planoPreco}>
                        <span style={styles.preco}>{plano.preco}</span>
                        <span style={styles.periodo}>{plano.periodo}</span>
                      </div>
                      <ul style={styles.recursosList}>
                        {plano.recursos.map((r, i) => <li key={i} style={styles.recursoItem}>{r}</li>)}
                      </ul>
                      {planoSelecionado === plano.id && <div style={styles.selecionadoCheck}> Selecionado</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ETAPA 6: CONFIGURACOES (Vendedores/Filiais/ERP) */}
            {etapa === 6 && planoAtual && (
              <div style={styles.etapa}>
                <h2 style={styles.etapaTitle}> Configuracoes Iniciais</h2> {/* CORRIGIDO */}
                <p style={styles.subtitle}>Configure vendedores, filiais e integracoes (opcional)</p>

                {/* VENDEDORES */}
                {planoAtual.limites.vendedores > 0 && (
                  <div style={styles.secao}>
                    <h3 style={styles.secaoTitle}> Vendedores ({vendedores.length}/{planoAtual.limites.vendedores})</h3>
                    <div style={styles.formInline}>
                      <input type="text" placeholder="Nome" value={novoVendedor.nome} onChange={(e) => setNovoVendedor({...novoVendedor, nome: e.target.value})} style={styles.inputInline} />
                      <input type="text" placeholder="CPF" value={novoVendedor.cpf} onChange={(e) => setNovoVendedor({...novoVendedor, cpf: e.target.value})} style={styles.inputInline} />
                      <input type="text" placeholder="Matricula" value={novoVendedor.matricula} onChange={(e) => setNovoVendedor({...novoVendedor, matricula: e.target.value})} style={styles.inputInline} />
                      <input type="email" placeholder="Email" value={novoVendedor.email} onChange={(e) => setNovoVendedor({...novoVendedor, email: e.target.value})} style={styles.inputInline} />
                      <button type="button" onClick={adicionarVendedor} style={styles.addButton}>O</button>
                    </div>
                    <p style={styles.helperText}> Vendedor recebera email com link para configurar senha</p>
                    {vendedores.length > 0 && (
                      <div style={styles.lista}>
                        {vendedores.map(v => (
                          <div key={v.id} style={styles.listaItem}>
                            <div><strong>{v.nome}</strong> - {v.email}</div>
                            <button type="button" onClick={() => removerVendedor(v.id)} style={styles.removeButton}></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* FILIAIS */}
                {planoAtual.limites.filiais > 0 && (
                  <div style={styles.secao}>
                    <h3 style={styles.secaoTitle}> Filiais ({filiais.length}/{planoAtual.limites.filiais})</h3>
                    <div style={styles.formInline}>
                      <input type="text" placeholder="Nome" value={novaFilial.nome} onChange={(e) => setNovaFilial({...novaFilial, nome: e.target.value})} style={styles.inputInline} />
                      <input type="text" placeholder="Cidade" value={novaFilial.cidade} onChange={(e) => setNovaFilial({...novaFilial, cidade: e.target.value})} style={styles.inputInline} />
                      <button type="button" onClick={adicionarFilial} style={styles.addButton}>O</button>
                    </div>
                    {filiais.length > 0 && (
                      <div style={styles.lista}>
                        {filiais.map(f => (
                          <div key={f.id} style={styles.listaItem}>
                            <div><strong>{f.nome}</strong> - {f.cidade}</div>
                            <button type="button" onClick={() => removerFilial(f.id)} style={styles.removeButton}></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ERP */}
                {planoAtual.limites.erp && (
                  <div style={styles.secao}>
                    <h3 style={styles.secaoTitle}> Integracao ERP</h3>
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
                <h2 style={styles.etapaTitle}> Finalizar Cadastro</h2>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Senha *</label>
                  <input type="password" name="senha" value={acesso.senha} onChange={handleChangeAcesso} placeholder="Minimo 6 caracteres" style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirmar Senha *</label>
                  <input type="password" name="confirmarSenha" value={acesso.confirmarSenha} onChange={handleChangeAcesso} placeholder="Repita a senha" style={styles.input} />
                </div>

                <div style={styles.resumo}>
                  <h3 style={styles.resumoTitle}> Resumo</h3>
                  <p><strong>Plano:</strong> {planoAtual?.nome} - {planoAtual?.preco}/mas</p>
                  <p><strong>{tipoPessoa === "PJ" ? "Empresa" : "Loja"}:</strong> {tipoPessoa === "PJ" ? dadosPJ.nomeFantasia : dadosPF.nomeLoja}</p>
                  <p><strong>Cidade:</strong> {endereco.cidade}/{endereco.estado}</p>
                  {vendedores.length > 0 && <p><strong>Vendedores:</strong> {vendedores.length}</p>}
                  {filiais.length > 0 && <p><strong>Filiais:</strong> {filiais.length}</p>}
                  {integracao.erpSelecionado && <p><strong>ERP:</strong> {ERPS_DISPONIVEIS.find(e => e.id === integracao.erpSelecionado)?.nome}</p>}
                  <p><strong>Validacao:</strong>  Aprovada ({dadosValidados?.score || 95}%)</p>
                </div>

                <div style={styles.termos}>
                  <label style={styles.checkboxLabel}>
                    <input type="checkbox" required />
                    Aceito os <a href="/termos" style={styles.link}>Termos de Uso</a> e <a href="/privacidade" style={styles.link}>Politica de Privacidade</a>
                  </label>
                </div>
              </div>
            )}

            {/* ERRO */}
            {erro && <div style={styles.erro}> {erro}</div>}

            {/* BOTOES */}
            <div style={styles.buttonGroup}>
              {etapa > 2 && <button type="button" onClick={etapaAnterior} style={styles.buttonSecondary} disabled={loading}>&#8592; Voltar</button>}
              <button type="button" onClick={proximaEtapa} style={{...styles.buttonPrimary, opacity: loading ? 0.6 : 1}} disabled={loading}>
                {loading ? "Enviando..." : etapa === 7 ? " Finalizar" : "Proximo &#8592;’"}
              </button>
            </div>

            {/* LINK LOGIN */}
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Ja tem conta? <button type="button" onClick={() => navigate("/lojista/login")} style={styles.linkButton}>Faca login</button>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Styles (mantendo os mesmos do anterior, apenas ajustando cores)
const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" },
  card: { maxWidth: "900px", margin: "0 auto", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  header: { padding: "32px", textAlign: "center", borderBottom: "2px solid #f0f0f0" },
  title: { fontSize: "2rem", fontWeight: "700", color: "#28a745", marginBottom: "8px" },
  subtitle: { fontSize: "1rem", color: "#666", marginBottom: "16px" },
  validatedBadge: { display: "inline-block", padding: "8px 16px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "600", marginBottom: "20px", border: "2px solid #c3e6cb" },
  progressBar: { display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" },
  progressStep: { width: "35px", height: "35px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "0.85rem", transition: "background-color 0.3s" },
  progressLabels: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: "8px", maxWidth: "500px", margin: "0 auto" },
  label: { color: "#999" },
  labelActive: { color: "#28a745", fontWeight: "600" },
  form: { padding: "32px" },
  etapa: { marginBottom: "24px" },
  etapaTitle: { fontSize: "1.3rem", fontWeight: "600", color: "#333", marginBottom: "20px" },
  toggleGroup: { display: "flex", gap: "12px", marginBottom: "24px" },
  toggleButton: { flex: 1, padding: "12px", border: "2px solid #e0e0e0", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
  inputGroup: { marginBottom: "18px" },
  input: { width: "100%", padding: "12px 16px", fontSize: "1rem", border: "2px solid #e0e0e0", borderRadius: "8px", outline: "none", boxSizing: "border-box" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  fileUpload: { marginBottom: "20px" },
  fileInput: { width: "100%", padding: "12px", border: "2px dashed #e0e0e0", borderRadius: "8px", cursor: "pointer" },
  fileName: { display: "block", marginTop: "8px", fontSize: "0.9rem", color: "#28a745", fontWeight: "600" },
  autoFilled: { display: "block", marginTop: "4px", fontSize: "0.8rem", color: "#28a745", fontWeight: "600" },
  cepGroup: { display: "flex", gap: "8px" },
  cepButton: { padding: "12px 20px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap" },
  planosGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  planoCard: { padding: "24px", borderRadius: "12px", transition: "all 0.3s", position: "relative" },
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
  inputInline: { flex: 1, minWidth: "150px", padding: "10px", border: "2px solid #e0e0e0", borderRadius: "6px", fontSize: "0.9rem" },
  addButton: { padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  helperText: { fontSize: "0.8rem", color: "#666", marginTop: "4px" },
  lista: { marginTop: "16px" },
  listaItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "white", borderRadius: "6px", marginBottom: "8px", border: "1px solid #e0e0e0" },
  removeButton: { padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" },
  resumo: { backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" },
  resumoTitle: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "12px" },
  termos: { marginTop: "20px" },
  checkboxLabel: { display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.9rem" },
  link: { color: "#28a745", fontWeight: "600" },
  erro: { padding: "12px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "16px", border: "1px solid #ef9a9a" },
  buttonGroup: { display: "flex", gap: "12px", marginTop: "24px" },
  buttonPrimary: { flex: 1, padding: "14px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  buttonSecondary: { padding: "14px 24px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  footer: { marginTop: "24px", padding: "20px", borderTop: "1px solid #e0e0e0", textAlign: "center" },
  footerText: { fontSize: "0.9rem", color: "#666" },
  linkButton: { background: "none", border: "none", color: "#28a745", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", textDecoration: "underline" },
};

export default LojistaRegisterPage;
