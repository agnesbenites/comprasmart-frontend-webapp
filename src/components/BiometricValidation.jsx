// src/components/BiometricValidation.jsx
// Componente de Validacao Biometrica - Integracao com Unico Check
// CORRECAO: Removido o atributo 'style' duplicado nas divs de canto.

import React, { useState, useRef } from "react";

const BiometricValidation = ({ onValidationComplete, userType = "lojista" }) => {
  const [etapa, setEtapa] = useState("inicio"); // inicio, documento, selfie, processando, resultado
  const [documentoFrente, setDocumentoFrente] = useState(null);
  const [documentoVerso, setDocumentoVerso] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const [modoCaptura, setModoCaptura] = useState(null); // 'documento-frente', 'documento-verso', 'selfie'

  // Iniciar c¢mera
  const iniciarCamera = async (modo) => {
    try {
      setModoCaptura(modo);
      const constraints = {
        video: {
          // Usa c¢mera frontal para selfie e traseira/ambiente para documento
          facingMode: modo === 'selfie' ? 'user' : 'environment', 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCamera(stream);
      }
    } catch (error) {
      setErro("Erro ao acessar c¢mera. Verifique as permissoes.");
      console.error("Erro c¢mera:", error);
    }
  };

  // Parar c¢mera
  const pararCamera = () => {
    if (camera) {
      camera.getTracks().forEach(track => track.stop());
      setCamera(null);
    }
  };

  // Capturar foto
  const capturarFoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `${modoCaptura}.jpg`, { type: 'image/jpeg' });
      
      if (modoCaptura === 'documento-frente') {
        setDocumentoFrente(file);
        setEtapa("documento-verso");
      } else if (modoCaptura === 'documento-verso') {
        setDocumentoVerso(file);
        setEtapa("selfie");
      } else if (modoCaptura === 'selfie') {
        setSelfie(file);
        setEtapa("processando");
        processarValidacao(documentoFrente, documentoVerso, file);
      }
      
      pararCamera();
    }, 'image/jpeg', 0.9);
  };

  // Upload manual de arquivo
  const handleFileUpload = (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    if (tipo === 'documento-frente') {
      setDocumentoFrente(file);
    } else if (tipo === 'documento-verso') {
      setDocumentoVerso(file);
    } else if (tipo === 'selfie') {
      setSelfie(file);
    }
  };

  // Processar validacao com API
  const processarValidacao = async (docFrente, docVerso, selfieFile) => {
    setLoading(true);
    setErro("");

    try {
      // Criar FormData
      const formData = new FormData();
      formData.append('documento_frente', docFrente);
      formData.append('documento_verso', docVerso);
      formData.append('selfie', selfieFile);
      formData.append('tipo_usuario', userType);

      // TODO: Integrar com API real (Unico, Combateafraude, etc)

      // Simular validacao (remover em producao)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulacao de resposta
      const mockResponse = {
        sucesso: Math.random() > 0.2, // 80% de sucesso
        score: Math.floor(Math.random() * 30) + 70, // Score 70-100
        dados_extraidos: {
          nome: "Joao Silva Santos",
          cpf: "123.456.789-00",
          rg: "12.345.678-9",
          data_nascimento: "15/03/1990",
          documento_valido: true,
          foto_match: true,
          liveness_check: true,
        },
        erros: []
      };

      if (mockResponse.sucesso && mockResponse.score >= 70) {
        setResultado({
          status: 'aprovado',
          score: mockResponse.score,
          dados: mockResponse.dados_extraidos,
          mensagem: 'Validacao biometrica aprovada!'
        });
        
        // Callback para componente pai
        if (onValidationComplete) {
          onValidationComplete({
            aprovado: true,
            dados: mockResponse.dados_extraidos,
            score: mockResponse.score
          });
        }
      } else {
        setResultado({
          status: 'reprovado',
          score: mockResponse.score,
          mensagem: 'Nao foi possivel validar sua identidade. Tente novamente.'
        });
      }

      setEtapa("resultado");
    } catch (error) {
      setErro("Erro ao processar validacao. Tente novamente.");
      console.error("Erro validacao:", error);
      setEtapa("inicio");
    } finally {
      setLoading(false);
    }
  };

  // Reiniciar processo
  const reiniciar = () => {
    setEtapa("inicio");
    setDocumentoFrente(null);
    setDocumentoVerso(null);
    setSelfie(null);
    setResultado(null);
    setErro("");
    pararCamera();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* ETAPA: INCIO */}
        {etapa === "inicio" && (
          <>
            <div style={styles.header}>
              <div style={styles.icon}></div>
              <h2 style={styles.title}>Validacao Biometrica</h2>
              <p style={styles.subtitle}>
                Para sua seguranca, precisamos validar sua identidade
              </p>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.infoTitle}> Voca vai precisar de:</h3>
              <ul style={styles.infoList}>
                <li> Documento oficial com foto (RG ou CNH)</li>
                <li> Um ambiente bem iluminado</li>
                <li> Permissao para usar a c¢mera</li>
              </ul>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.infoTitle}> Seus dados estao seguros</h3>
              <p style={styles.infoText}>
                Utilizamos tecnologia de ponta para validacao facial.
                Suas imagens sao processadas com criptografia e nao sao armazenadas.
              </p>
            </div>

            {erro && <div style={styles.erro}> {erro}</div>}

            <button
              onClick={() => setEtapa("documento-frente")}
              style={styles.buttonPrimary}
            >
               Iniciar Validacao
            </button>
          </>
        )}

        {/* ETAPA: DOCUMENTO FRENTE */}
        {etapa === "documento-frente" && (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}> Documento - Frente</h2>
              <p style={styles.subtitle}>
                Tire uma foto da frente do seu documento
              </p>
            </div>

            {camera ? (
              <div style={styles.cameraContainer}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={styles.video}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <div style={styles.cameraOverlay}>
                  <div style={styles.documentFrame}>
                    {/* CORRECAO: Mesclando estilos em um unico atributo 'style' */}
                    <div style={{ ...styles.corner, ...styles.cornerTL }} />
                    <div style={{ ...styles.corner, ...styles.cornerTR }} />
                    <div style={{ ...styles.corner, ...styles.cornerBL }} />
                    <div style={{ ...styles.corner, ...styles.cornerBR }} />
                  </div>
                  <p style={styles.cameraInstructions}>
                    Posicione o documento dentro da moldura
                  </p>
                </div>

                <div style={styles.cameraButtons}>
                  <button onClick={pararCamera} style={styles.buttonSecondary}>
                     Cancelar
                  </button>
                  <button onClick={capturarFoto} style={styles.buttonCapture}>
                     Capturar
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.uploadContainer}>
                <div style={styles.uploadOption}>
                  <button
                    onClick={() => iniciarCamera('documento-frente')}
                    style={styles.uploadButton}
                  >
                     Usar C¢mera
                  </button>
                </div>

                <div style={styles.divider}>OU</div>

                <div style={styles.uploadOption}>
                  <label style={styles.uploadButton}>
                     Enviar Arquivo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileUpload(e, 'documento-frente');
                        if (e.target.files[0]) {
                          setEtapa("documento-verso");
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {documentoFrente && (
                  <div style={styles.preview}>
                    <img
                      src={URL.createObjectURL(documentoFrente)}
                      alt="Documento Frente"
                      style={styles.previewImage}
                    />
                    <button
                      onClick={() => setEtapa("documento-verso")}
                      style={styles.buttonPrimary}
                    >
                      Continuar &#8592;’
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ETAPA: DOCUMENTO VERSO */}
        {etapa === "documento-verso" && (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}> Documento - Verso</h2>
              <p style={styles.subtitle}>
                Agora tire uma foto do verso do documento
              </p>
            </div>

            {camera ? (
              <div style={styles.cameraContainer}>
                <video ref={videoRef} autoPlay playsInline style={styles.video} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <div style={styles.cameraOverlay}>
                  <div style={styles.documentFrame}>
                    {/* CORRECAO: Mesclando estilos em um unico atributo 'style' */}
                    <div style={{ ...styles.corner, ...styles.cornerTL }} />
                    <div style={{ ...styles.corner, ...styles.cornerTR }} />
                    <div style={{ ...styles.corner, ...styles.cornerBL }} />
                    <div style={{ ...styles.corner, ...styles.cornerBR }} />
                  </div>
                  <p style={styles.cameraInstructions}>
                    Posicione o verso do documento
                  </p>
                </div>

                <div style={styles.cameraButtons}>
                  <button onClick={pararCamera} style={styles.buttonSecondary}> Cancelar</button>
                  <button onClick={capturarFoto} style={styles.buttonCapture}> Capturar</button>
                </div>
              </div>
            ) : (
              <div style={styles.uploadContainer}>
                <div style={styles.uploadOption}>
                  <button onClick={() => iniciarCamera('documento-verso')} style={styles.uploadButton}>
                     Usar C¢mera
                  </button>
                </div>

                <div style={styles.divider}>OU</div>

                <div style={styles.uploadOption}>
                  <label style={styles.uploadButton}>
                     Enviar Arquivo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileUpload(e, 'documento-verso');
                        if (e.target.files[0]) {
                          setEtapa("selfie");
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {documentoVerso && (
                  <div style={styles.preview}>
                    <img src={URL.createObjectURL(documentoVerso)} alt="Documento Verso" style={styles.previewImage} />
                    <button onClick={() => setEtapa("selfie")} style={styles.buttonPrimary}>
                      Continuar &#8592;’
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ETAPA: SELFIE */}
        {etapa === "selfie" && (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}> Selfie com Documento</h2>
              <p style={styles.subtitle}>
                Segure seu documento proximo ao rosto e tire uma selfie
              </p>
            </div>

            {camera ? (
              <div style={styles.cameraContainer}>
                <video ref={videoRef} autoPlay playsInline style={styles.video} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <div style={styles.cameraOverlay}>
                  <div style={styles.faceFrame}>
                    <div style={styles.faceOval} />
                  </div>
                  <p style={styles.cameraInstructions}>
                    Posicione seu rosto no centro<br />
                    Segure o documento ao lado
                  </p>
                </div>

                <div style={styles.cameraButtons}>
                  <button onClick={pararCamera} style={styles.buttonSecondary}> Cancelar</button>
                  <button onClick={capturarFoto} style={styles.buttonCapture}> Capturar</button>
                </div>
              </div>
            ) : (
              <div style={styles.uploadContainer}>
                <div style={styles.uploadOption}>
                  <button onClick={() => iniciarCamera('selfie')} style={styles.uploadButton}>
                     Usar C¢mera Frontal
                  </button>
                </div>

                <div style={styles.divider}>OU</div>

                <div style={styles.uploadOption}>
                  <label style={styles.uploadButton}>
                     Enviar Arquivo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileUpload(e, 'selfie');
                        if (e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelfie(file);
                          setEtapa("processando");
                          processarValidacao(documentoFrente, documentoVerso, file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        {/* ETAPA: PROCESSANDO */}
        {etapa === "processando" && (
          <div style={styles.processingContainer}>
            <div style={styles.spinner} />
            <h2 style={styles.title}> Validando sua Identidade...</h2>
            <p style={styles.subtitle}>
              Estamos verificando seus documentos e comparando com sua foto.
              Isso pode levar alguns segundos.
            </p>
            <div style={styles.processingSteps}>
              <div style={styles.processingStep}> Documento recebido</div>
              <div style={styles.processingStep}> Leitura OCR em andamento</div>
              <div style={styles.processingStep}>o Analise facial...</div>
              <div style={styles.processingStep}>o Validacao biometrica...</div>
            </div>
          </div>
        )}

        {/* ETAPA: RESULTADO */}
        {etapa === "resultado" && resultado && (
          <div style={styles.resultContainer}>
            {resultado.status === 'aprovado' ? (
              <>
                <div style={styles.successIcon}></div>
                <h2 style={styles.successTitle}>Validacao Aprovada!</h2>
                <p style={styles.successText}>
                  Sua identidade foi verificada com sucesso
                </p>

                <div style={styles.scoreBox}>
                  <div style={styles.scoreCircle}>
                    <span style={styles.scoreValue}>{resultado.score}%</span>
                  </div>
                  <p style={styles.scoreLabel}>Score de Confianca</p>
                </div>

                <div style={styles.dadosExtraidos}>
                  <h3 style={styles.dadosTitle}> Dados Extraidos:</h3>
                  <div style={styles.dadoItem}>
                    <strong>Nome:</strong> {resultado.dados.nome}
                  </div>
                  <div style={styles.dadoItem}>
                    <strong>CPF:</strong> {resultado.dados.cpf}
                  </div>
                  <div style={styles.dadoItem}>
                    <strong>RG:</strong> {resultado.dados.rg}
                  </div>
                  <div style={styles.dadoItem}>
                    <strong>Data Nasc:</strong> {resultado.dados.data_nascimento}
                  </div>
                </div>

                <div style={styles.checksBox}>
                  <div style={styles.checkItem}>
                    {resultado.dados.documento_valido ? '' : ''} Documento Valido
                  </div>
                  <div style={styles.checkItem}>
                    {resultado.dados.foto_match ? '' : ''} Foto Corresponde
                  </div>
                  <div style={styles.checkItem}>
                    {resultado.dados.liveness_check ? '' : ''} Prova de Vida
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onValidationComplete) {
                      onValidationComplete({
                        aprovado: true,
                        dados: resultado.dados,
                        score: resultado.score
                      });
                    }
                  }}
                  style={styles.buttonSuccess}
                >
                   Continuar Cadastro
                </button>
              </>
            ) : (
              <>
                <div style={styles.errorIcon}></div>
                <h2 style={styles.errorTitle}>Validacao Nao Aprovada</h2>
                <p style={styles.errorText}>{resultado.mensagem}</p>

                <div style={styles.scoreBox}>
                  <div style={{...styles.scoreCircle, borderColor: '#dc3545'}}>
                    <span style={{...styles.scoreValue, color: '#dc3545'}}>{resultado.score}%</span>
                  </div>
                  <p style={styles.scoreLabel}>Score de Confianca (minimo 70%)</p>
                </div>

                <div style={styles.helpBox}>
                  <h3 style={styles.helpTitle}> Dicas para melhorar:</h3>
                  <ul style={styles.helpList}>
                    <li>Use um ambiente bem iluminado</li>
                    <li>Certifique-se que o documento esta legivel</li>
                    <li>Mantenha o rosto visivel na selfie</li>
                    <li>Segure o documento proximo ao rosto</li>
                  </ul>
                </div>

                <button onClick={reiniciar} style={styles.buttonRetry}>
                   Tentar Novamente
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    padding: "32px",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  icon: {
    fontSize: "4rem",
    marginBottom: "16px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  infoTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#333",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  infoText: {
    fontSize: "0.95rem",
    color: "#666",
    lineHeight: "1.5",
  },
  erro: {
    padding: "12px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    marginBottom: "16px",
    border: "1px solid #ef9a9a",
  },
  buttonPrimary: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonSecondary: {
    padding: "12px 24px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonCapture: {
    padding: "12px 32px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonSuccess: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "24px",
  },
  buttonRetry: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "24px",
  },
  uploadContainer: {
    marginTop: "24px",
  },
  uploadOption: {
    marginBottom: "16px",
  },
  uploadButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "block",
    textAlign: "center",
  },
  divider: {
    textAlign: "center",
    color: "#999",
    fontSize: "0.9rem",
    margin: "16px 0",
  },
  preview: {
    marginTop: "20px",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  cameraContainer: {
    position: "relative",
  },
  video: {
    width: "100%",
    borderRadius: "8px",
    backgroundColor: "#000",
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  documentFrame: {
    width: "80%",
    height: "50%",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: "40px",
    height: "40px",
    border: "4px solid #28a745",
  },
  cornerTL: { top: 0, left: 0, borderRight: "none", borderBottom: "none" },
  cornerTR: { top: 0, right: 0, borderLeft: "none", borderBottom: "none" },
  cornerBL: { bottom: 0, left: 0, borderRight: "none", borderTop: "none" },
  cornerBR: { bottom: 0, right: 0, borderLeft: "none", borderTop: "none" },
  faceFrame: {
    width: "200px",
    height: "250px",
    position: "relative",
  },
  faceOval: {
    width: "100%",
    height: "100%",
    border: "4px solid #28a745",
    borderRadius: "50%",
  },
  cameraInstructions: {
    marginTop: "20px",
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.9rem",
  },
  cameraButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "16px",
  },
  processingContainer: {
    textAlign: "center",
    padding: "40px 20px",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #28a745",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px",
  },
  processingSteps: {
    marginTop: "32px",
    textAlign: "left",
  },
  processingStep: {
    padding: "10px",
    fontSize: "0.95rem",
    color: "#666",
  },
  resultContainer: {
    textAlign: "center",
    padding: "20px",
  },
  successIcon: {
    fontSize: "5rem",
    marginBottom: "20px",
  },
  successTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#28a745",
    marginBottom: "12px",
  },
  successText: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "24px",
  },
  errorIcon: {
    fontSize: "5rem",
    marginBottom: "20px",
  },
  errorTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#dc3545",
    marginBottom: "12px",
  },
  errorText: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "24px",
  },
  scoreBox: {
    marginBottom: "24px",
  },
  scoreCircle: {
    width: "120px",
    height: "120px",
    border: "8px solid #28a745",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  scoreValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#28a745",
  },
  scoreLabel: {
    fontSize: "0.9rem",
    color: "#666",
  },
  dadosExtraidos: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "left",
  },
  dadosTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "12px",
  },
  dadoItem: {
    padding: "8px 0",
    fontSize: "0.95rem",
    color: "#333",
  },
  checksBox: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  checkItem: {
    fontSize: "0.9rem",
    color: "#666",
  },
  helpBox: {
    backgroundColor: "#fff3cd",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "left",
  },
  helpTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#856404",
  },
  helpList: {
    fontSize: "0.9rem",
    color: "#856404",
    lineHeight: "1.8",
  },
};

// CSS para animacao do spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default BiometricValidation;
