import React, { useState, useEffect } from "react";
import api from '../../../api/adminToken.js';

// =================================================================================
// LINKS E CONFIGURACOES DO STRIPE
// =================================================================================

const STRIPE_LINKS = {
    BASIC: "https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01",
    PRO: "https://buy.stripe.com/dRm8wP7Tq1A011c1qhgQE02",
    ENTERPRISE: "https://buy.stripe.com/3cI3cv2z6fqQaBM8SJgQE03",
    ADICIONAL_BASIC: "https://buy.stripe.com/00w7sL2z6ceE11cd8ZgQE01",
    ADICIONAL_VENDEDOR: "https://buy.stripe.com/6oU4gz6Pm1A0cJUed3gQE05",
    ADICIONAL_FILIAL: "https://buy.stripe.com/7sY28r6PmguUcJUglbgQE06",
    ADICIONAL_PRODUTOS: "https://buy.stripe.com/aFa3cv6Pm2E47pAglbgQE00",
    ADICIONAL_MARKETING: "https://buy.stripe.com/aFa28rehOdiIfW60mdgQE04",
    ADICIONAL_ERP: "https://buy.stripe.com/3cI9ATc9G7YodNYfh7gQE08"
};

const PLANS_DETAILS = {
    'Plano Basico': {
        nome: 'Plano Basico',
        valor: 99.90,
        recursos: [
            'Limite de 1 Filial (compravel)',
            'Limite de 10 Vendedores (compravel)',
            '5 Consultores Ativos',
            'Relatorios Padrao Incluidos',
            'Suporte por Email (SLA 48h)'
        ],
        upgradeUrl: STRIPE_LINKS.PRO,
    },
    'Plano Pro': {
        nome: 'Plano Pro',
        valor: 199.90,
        recursos: [
            'Limite de 5 Filiais',
            'Limite de 50 Vendedores',
            'Consultores Ilimitados',
            'Relatorios Avancados e BI',
            'Suporte Prioritario (SLA 4h)',
            'Gerenciamento de Fluxo de Caixa'
        ],
        upgradeUrl: STRIPE_LINKS.ENTERPRISE,
    },
    'Plano Enterprise': {
        nome: 'Plano Enterprise',
        valor: 360.00,
        recursos: [
            'Filiais Ilimitadas',
            'Vendedores Ilimitados',
            'Consultores Ilimitados',
            'Relatorios Avancados e BI',
            'Suporte 24/7 Dedicado',
            'Multiplas Contas Stripe Conectadas',
            'Integracao de Sistemas Legados'
        ],
        upgradeUrl: null,
    }
};

const ADDONS_DETAILS = [
    {
        nome: 'Basic Adicional',
        preco: 49.90,
        link: STRIPE_LINKS.ADICIONAL_BASIC,
        descricao: 'Recursos basicos adicionais para complementar seu plano.',
        emBreve: false
    },
    {
        nome: 'Vendedor Adicional',
        preco: 15.00,
        link: STRIPE_LINKS.ADICIONAL_VENDEDOR,
        descricao: 'Contrate mais vagas para sua equipe de vendas.',
        emBreve: false
    },
    {
        nome: 'Filial Adicional',
        preco: 25.00,
        link: STRIPE_LINKS.ADICIONAL_FILIAL,
        descricao: 'Permite cadastrar e gerenciar uma nova unidade (filial) em sua conta.',
        emBreve: false
    },
    {
        nome: '20 Produtos Adicionais',
        preco: 10.00,
        link: STRIPE_LINKS.ADICIONAL_PRODUTOS,
        descricao: 'Adicione mais 20 produtos ao catalogo da sua loja.',
        emBreve: false
    },
    {
        nome: 'Campanha de Marketing',
        preco: 25.90,
        link: STRIPE_LINKS.ADICIONAL_MARKETING,
        descricao: 'Execute campanhas de engajamento e fidelidade automatizadas.',
        emBreve: false
    },
    {
        nome: 'Modulo ERP',
        preco: 59.90,
        link: STRIPE_LINKS.ADICIONAL_ERP,
        descricao: 'Gerencie pedidos, estoque e faturamento de forma completa.',
        emBreve: false
    }
];

const AVAILABLE_UPGRADES = ['Plano Pro', 'Plano Enterprise'];

// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================

const LojistaPlanosAssinaturas = () => {
    const [planoAtual, setPlanoAtual] = useState(null);
    const [faturas, setFaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userData, setUserData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    useEffect(() => {
        carregarDadosPagamentos();
    }, []);

    // Funcao para buscar dados do Stripe
    const carregarDadosPagamentos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Buscar ID do lojista logado (ajuste conforme seu auth)
            const lojistaId = localStorage.getItem('lojistaId') || '1';

            // Tentar buscar dados reais da API
            try {
                const response = await api.get(`/api/stripe/lojista/${lojistaId}/dados-pagamento`);

                if (response.data.success) {
                    const { user, planoAtual: plano, faturas: faturasData } = response.data;

                    const planoConfig = PLANS_DETAILS[plano?.nome] || PLANS_DETAILS['Plano Basico'];

                    setUserData(user);
                    setPlanoAtual({
                        ...plano,
                        recursos: planoConfig.recursos,
                        upgradeUrl: planoConfig.upgradeUrl
                    });
                    setFaturas(faturasData || []);
                    return;
                }
            } catch (apiError) {
                console.log('API nao disponivel, usando dados de demonstracao');
            }

            // Fallback para dados mock
            setDadosMockados('Plano Basico');

        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError('Erro ao conectar com o servidor. Usando dados de demonstracao.');
            setDadosMockados('Plano Basico');
        } finally {
            setLoading(false);
        }
    };

    // Dados mockados para desenvolvimento
    const setDadosMockados = (planoNome) => {
        setUserData({
            id: 1,
            email: 'lojista@exemplo.com',
            nome: 'Empresa Teste',
            stripe_account_id: null
        });

        const planoConfig = PLANS_DETAILS[planoNome] || PLANS_DETAILS['Plano Basico'];

        setPlanoAtual({
            nome: planoNome,
            valor: planoConfig.valor,
            status: 'active',
            recursos: planoConfig.recursos,
            upgradeUrl: planoConfig.upgradeUrl,
        });

        // Faturas mock - em producao virao do Stripe
        setFaturas([
            {
                id: 'inv_demo_001',
                number: 'FAT-2024-001',
                date: new Date().toISOString(),
                amount: planoConfig.valor,
                status: 'paid',
                invoice_pdf: null,
                hosted_invoice_url: null
            },
            {
                id: 'inv_demo_002',
                number: 'FAT-2024-002',
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                amount: planoConfig.valor,
                status: 'paid',
                invoice_pdf: null,
                hosted_invoice_url: null
            }
        ]);
    };

    const redirecionarParaLinkDeVenda = (url) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('Link de Checkout indisponivel ou funcionalidade em desenvolvimento.');
        }
    };

    const enviarFaturaPorEmail = async (faturaId) => {
        try {
            // Em producao, chamar API
            // await api.post(`/api/stripe/faturas/${faturaId}/enviar-email`);
            setSuccess(`Fatura ${faturaId} enviada por e-mail com sucesso!`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Erro ao enviar fatura por e-mail');
        }
    };

    const showPlanDetailsModal = (targetPlanName) => {
        const currentPlan = PLANS_DETAILS[planoAtual.nome];
        const targetPlan = PLANS_DETAILS[targetPlanName];

        if (!currentPlan || !targetPlan) {
            setError(`Configuracao do plano ${targetPlanName} nao encontrada.`);
            return;
        }

        if (currentPlan.valor >= targetPlan.valor) {
            alert(`Voce ja esta no Plano ${currentPlan.nome} ou superior.`);
            return;
        }

        const currentResources = currentPlan.recursos;
        const targetResources = targetPlan.recursos;

        const incrementos = targetResources.filter(recurso =>
            !currentResources.includes(recurso) || recurso.includes('Ilimitados')
        );
        const recursosMantidos = targetResources.filter(recurso =>
            currentResources.includes(recurso) && !recurso.includes('Ilimitados')
        );

        setModalContent({
            title: `Upgrade para ${targetPlanName}`,
            message: `Ao fazer o upgrade, voce tera um aumento de R$ ${(targetPlan.valor - currentPlan.valor).toFixed(2)} na mensalidade e ganhara os seguintes beneficios:`,
            incrementos: incrementos,
            mantidos: recursosMantidos,
            targetUrl: targetPlan.upgradeUrl,
            confirmText: `Contratar ${targetPlanName} (${formatarValor(targetPlan.valor)})`,
            cancelText: 'Voltar',
            isUpgrade: true
        });
        setModalOpen(true);
    };

    const baixarFatura = (faturaId, invoicePdfUrl) => {
        if (invoicePdfUrl) {
            window.open(invoicePdfUrl, '_blank');
        } else {
            setError('Link de download nao disponivel para esta fatura.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const visualizarFatura = (hostedInvoiceUrl) => {
        if (hostedInvoiceUrl) {
            window.open(hostedInvoiceUrl, '_blank');
        } else {
            setError('Link de visualizacao nao disponivel para esta fatura.');
            setTimeout(() => setError(null), 3000);
        }
    };

    const abrirPortalStripe = async () => {
        try {
            if (!userData?.stripe_customer_id) {
                setError('Conta Stripe nao configurada.');
                return;
            }

            const response = await api.post('/api/stripe/portal-session', {
                customerId: userData.stripe_customer_id,
                returnUrl: window.location.href
            });

            if (response.data.success) {
                window.open(response.data.url, '_blank');
            }
        } catch (err) {
            setError('Erro ao abrir portal de pagamentos');
        }
    };

    const criarContaStripe = async () => {
        try {
            // Em producao, redirecionar para Stripe Connect onboarding
            const onboardingUrl = "https://connect.stripe.com/setup";
            window.open(onboardingUrl, '_blank');
            setSuccess('Redirecionando para configuracao do Stripe...');
        } catch (err) {
            setError('Erro ao iniciar configuracao do Stripe');
        }
    };

    const formatarData = (dataString) => {
        try {
            return new Date(dataString).toLocaleDateString('pt-BR');
        } catch {
            return dataString;
        }
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    const proximaCobranca = faturas.length > 0 && faturas[0].status === 'paid'
        ? new Date(new Date(faturas[0].date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (loading || !planoAtual) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <p>Carregando informacoes de plano e pagamento...</p>
                </div>
            </div>
        );
    }

    // Modal Component
    const ModalComponent = ({ content, onClose }) => {
        if (!modalOpen) return null;

        return (
            <div style={modalStyles.backdrop}>
                <div style={modalStyles.modal}>
                    <h3 style={modalStyles.title}>{content.title}</h3>
                    <p style={modalStyles.message}>{content.message}</p>

                    {content.isUpgrade && (
                        <div style={modalStyles.upgradeDetails}>
                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.sectionTitleIncremento}>Novos Recursos:</h4>
                                <ul style={modalStyles.recursosList}>
                                    {content.incrementos.map((inc, i) => (
                                        <li key={`inc-${i}`} style={modalStyles.recursoItemIncremento}>+ {inc}</li>
                                    ))}
                                </ul>
                            </div>
                            <div style={modalStyles.section}>
                                <h4 style={modalStyles.sectionTitleMantido}>Beneficios Mantidos:</h4>
                                <ul style={modalStyles.recursosList}>
                                    {content.mantidos.map((mant, i) => (
                                        <li key={`mant-${i}`} style={modalStyles.recursoItemMantido}>* {mant}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div style={modalStyles.actions}>
                        <button onClick={onClose} style={{ ...modalStyles.button, backgroundColor: '#6c757d' }}>
                            {content.cancelText}
                        </button>
                        <button
                            onClick={() => redirecionarParaLinkDeVenda(content.targetUrl)}
                            style={{ ...modalStyles.button, backgroundColor: '#2c5aa0' }}
                        >
                            {content.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // AddOn Card Component
    const AddOnCard = ({ nome, preco, link, descricao, emBreve }) => (
        <div style={styles.addonCard}>
            <h4 style={styles.addonTitle}>{nome}</h4>
            <p style={styles.addonDescription}>{descricao}</p>
            <p style={styles.addonPrice}>
                {emBreve ? 'Em Breve' : formatarValor(preco) + '/mes'}
            </p>
            <button
                style={emBreve ? styles.disabledButton : styles.addonButton}
                onClick={() => !emBreve && redirecionarParaLinkDeVenda(link)}
                disabled={emBreve}
            >
                {emBreve ? 'Aguarde' : 'Comprar Agora'}
            </button>
        </div>
    );

    // Upgrade Plan Card Component
    const UpgradePlanCard = ({ planName, currentPlanName }) => {
        const targetPlan = PLANS_DETAILS[planName];
        if (!targetPlan || targetPlan.valor <= PLANS_DETAILS[currentPlanName].valor) return null;

        return (
            <div style={styles.planCard} onClick={() => showPlanDetailsModal(planName)}>
                <h4 style={styles.planCardTitle}>{targetPlan.nome}</h4>
                <p style={styles.planCardPrice}>{formatarValor(targetPlan.valor)}/mes</p>
                <div style={styles.planCardBenefits}>
                    {targetPlan.recursos.slice(0, 4).map((recurso, index) => (
                        <p key={index} style={styles.planCardBenefitItem}>{recurso}</p>
                    ))}
                    <p style={styles.planCardBenefitItemBold}>... e mais.</p>
                </div>
                <button style={styles.planCardButton}>Ver Beneficios e Mudar</button>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <ModalComponent content={modalContent} onClose={() => setModalOpen(false)} />

            <h1 style={styles.title}>Planos e Assinaturas</h1>

            {error && (<div style={styles.errorMessage}>{error}</div>)}
            {success && (<div style={styles.successMessage}>{success}</div>)}

            {/* Plano Atual */}
            <div style={styles.card}>
                <div style={styles.planoHeader}>
                    <div style={styles.planoInfo}>
                        <h2 style={styles.planoNome}>Seu Plano Atual: {planoAtual.nome}</h2>
                        <p style={styles.planoValor}>{formatarValor(planoAtual.valor)}/mes</p>
                        <p style={styles.planoData}>Proxima cobranca: {formatarData(proximaCobranca)}</p>
                        <span style={planoAtual.status === 'active' ? styles.statusBadge : styles.statusInativo}>
                            {planoAtual.status === 'active' ? 'Assinatura Ativa' : 'Assinatura Inativa'}
                        </span>

                        <h3 style={styles.recursosTitle}>Beneficios Inclusos:</h3>
                        <ul style={styles.recursosList}>
                            {(planoAtual.recursos || []).map((recurso, index) => (
                                <li key={index} style={styles.recursoItem}>{recurso}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div style={styles.buttonGroup}>
                    {userData?.stripe_customer_id && (
                        <button style={styles.primaryButton} onClick={abrirPortalStripe}>
                            Gerenciar Pagamentos
                        </button>
                    )}

                    {!userData?.stripe_account_id && (
                        <div style={styles.infoBox}>
                            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                                Repasses Pendentes: Sua conta Stripe ainda nao esta conectada.
                            </p>
                            <button style={{ ...styles.successButton, flex: 'none' }} onClick={criarContaStripe}>
                                Configurar Conta Stripe
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Opcoes de Upgrade */}
            {planoAtual.upgradeUrl && (
                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>Opcoes de Upgrade</h3>
                    <p style={styles.addonSubtitle}>Clique em um plano para ver os beneficios e iniciar a contratacao.</p>
                    <div style={styles.upgradeGrid}>
                        {AVAILABLE_UPGRADES
                            .filter(p => PLANS_DETAILS[p].valor > planoAtual.valor)
                            .map(planName => (
                                <UpgradePlanCard
                                    key={planName}
                                    planName={planName}
                                    currentPlanName={planoAtual.nome}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* Funcionalidades Adicionais */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Funcionalidades Adicionais (Add-ons)</h3>
                <p style={styles.addonSubtitle}>Compre recursos avulsos para complementar seu plano atual.</p>
                <div style={styles.addonGrid}>
                    {ADDONS_DETAILS.map(addon => (
                        <AddOnCard key={addon.nome} {...addon} />
                    ))}
                </div>
            </div>

            {/* Historico de Faturas */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Historico de Faturas</h3>

                {faturas.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                        Nenhuma fatura encontrada.
                    </p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Numero</th>
                                <th style={styles.th}>Data</th>
                                <th style={styles.th}>Valor</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faturas.map(fatura => (
                                <tr key={fatura.id}>
                                    <td style={styles.td}>{fatura.number || fatura.id}</td>
                                    <td style={styles.td}>{formatarData(fatura.date)}</td>
                                    <td style={styles.td}>{formatarValor(fatura.amount)}</td>
                                    <td style={{
                                        ...styles.td,
                                        ...(fatura.status === 'paid' ? styles.statusPaga : styles.statusAberta)
                                    }}>
                                        {fatura.status === 'paid' ? 'Paga' :
                                            fatura.status === 'open' ? 'Aberta' : fatura.status}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {fatura.invoice_pdf && (
                                                <button
                                                    style={styles.secondaryButtonSmall}
                                                    onClick={() => baixarFatura(fatura.id, fatura.invoice_pdf)}
                                                >
                                                    Download
                                                </button>
                                            )}

                                            {fatura.hosted_invoice_url && (
                                                <button
                                                    style={styles.secondaryButtonSmall}
                                                    onClick={() => visualizarFatura(fatura.hosted_invoice_url)}
                                                >
                                                    Visualizar
                                                </button>
                                            )}

                                            {fatura.status === 'paid' && (
                                                <button
                                                    style={styles.secondaryButtonSmall}
                                                    onClick={() => enviarFaturaPorEmail(fatura.number || fatura.id)}
                                                >
                                                    Enviar por E-mail
                                                </button>
                                            )}

                                            {!fatura.invoice_pdf && !fatura.hosted_invoice_url && (
                                                <span style={{ color: '#999', fontSize: '12px' }}>
                                                    Links disponiveis apos pagamento via Stripe
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// =================================================================================
// ESTILOS
// =================================================================================
const modalStyles = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.6rem',
        color: '#2c5aa0',
        marginBottom: '10px',
    },
    message: {
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '20px',
    },
    upgradeDetails: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        padding: '15px 0',
        marginBottom: '25px',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee'
    },
    section: {
        textAlign: 'left',
        padding: '10px',
        borderRadius: '8px',
    },
    sectionTitleIncremento: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: '10px',
    },
    sectionTitleMantido: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#6c757d',
        marginBottom: '10px',
    },
    recursosList: {
        listStyle: 'none',
        padding: 0,
    },
    recursoItemIncremento: {
        color: '#155724',
        backgroundColor: '#d4edda',
        padding: '5px 8px',
        borderRadius: '5px',
        margin: '5px 0',
        fontSize: '0.9rem',
    },
    recursoItemMantido: {
        color: '#6c757d',
        padding: '5px 0',
        fontSize: '0.9rem',
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    }
};

const styles = {
    container: {
        padding: "30px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh"
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        color: '#666'
    },
    title: {
        color: "#2c5aa0",
        fontSize: "2rem",
        marginBottom: "20px",
    },
    sectionTitle: {
        fontSize: "1.5rem",
        color: "#333",
        marginBottom: "15px",
        fontWeight: "600",
    },
    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        marginBottom: "25px",
        border: "1px solid #e9ecef",
    },
    planoHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "20px"
    },
    planoInfo: {
        flex: 1
    },
    planoNome: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#2c5aa0",
        margin: "0 0 10px 0"
    },
    planoValor: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#2c5aa0",
        margin: "0 0 5px 0"
    },
    planoData: {
        color: "#666",
        margin: "0 0 15px 0"
    },
    infoBox: {
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        width: '100%'
    },
    statusBadge: {
        backgroundColor: "#d4edda",
        color: "#155724",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "600",
        border: "1px solid #c3e6cb",
    },
    statusInativo: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "600",
        border: "1px solid #f5c6cb",
    },
    recursosTitle: {
        fontSize: "1.1rem",
        color: "#333",
        fontWeight: "600",
        marginTop: "15px",
    },
    recursosList: {
        listStyle: "none",
        padding: 0,
        margin: "10px 0 20px 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "5px 15px"
    },
    recursoItem: {
        padding: "3px 0",
        color: "#555",
        fontSize: "0.95rem"
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
        flexWrap: "wrap"
    },
    primaryButton: {
        backgroundColor: "#2c5aa0",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "background-color 0.2s",
    },
    secondaryButtonSmall: {
        backgroundColor: "white",
        color: "#333",
        border: "1px solid #ccc",
        padding: "6px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
        transition: "background-color 0.2s",
    },
    successButton: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "background-color 0.2s",
    },
    upgradeGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginTop: "20px"
    },
    planCard: {
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        backgroundColor: "#fcfcfc",
        cursor: "pointer",
        textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    planCardTitle: {
        fontSize: "1.4rem",
        color: "#2c5aa0",
        marginBottom: "5px",
        fontWeight: "700"
    },
    planCardPrice: {
        fontSize: "1.8rem",
        fontWeight: "bold",
        color: "#28a745",
        marginBottom: "15px"
    },
    planCardBenefits: {
        textAlign: "left",
        marginBottom: "15px"
    },
    planCardBenefitItem: {
        fontSize: "0.9rem",
        color: "#333",
        margin: "5px 0"
    },
    planCardBenefitItemBold: {
        fontSize: "0.9rem",
        color: "#2c5aa0",
        margin: "5px 0",
        fontWeight: 'bold'
    },
    planCardButton: {
        backgroundColor: "#2c5aa0",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        fontWeight: "bold",
        width: "100%",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    addonGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginTop: "20px"
    },
    addonCard: {
        padding: "15px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fcfcfc",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    addonTitle: {
        fontSize: "1.1rem",
        color: "#333",
        marginBottom: "5px",
        fontWeight: "600"
    },
    addonSubtitle: {
        color: "#666",
        marginBottom: "20px",
        fontSize: "1rem",
        textAlign: "left"
    },
    addonDescription: {
        fontSize: "0.9rem",
        color: "#555",
        marginBottom: "15px",
        flexGrow: 1
    },
    addonPrice: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#2c5aa0",
        marginBottom: "15px"
    },
    addonButton: {
        backgroundColor: "#17a2b8",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    disabledButton: {
        backgroundColor: "#f0f0f0",
        color: "#999",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "not-allowed"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        backgroundColor: "#eaf2ff",
        borderBottom: "2px solid #2c5aa0",
        padding: "12px 15px",
        textAlign: "left",
        color: "#2c5aa0",
        fontSize: "0.9rem",
        fontWeight: "700",
    },
    td: {
        padding: "12px 15px",
        borderBottom: "1px solid #eee",
    },
    statusPaga: {
        color: "#28a745",
        fontWeight: "bold"
    },
    statusAberta: {
        color: "#dc3545",
        fontWeight: "bold"
    },
    errorMessage: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
    },
    successMessage: {
        color: '#155724',
        backgroundColor: '#d4edda',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
    },
};

export default LojistaPlanosAssinaturas;