// src/utils/emailTemplates.js
// Templates de e-mail de boas-vindas por plano

export const getWelcomeEmailTemplate = (nomeLojista, plano, nomeEmpresa) => {
  const templates = {
    basic: {
      subject: '🚀 Bem-vindo à CompraSmart - Seu Manual do Plano Básico',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f8f9fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  
                  <!-- HEADER -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 2rem; font-weight: 800;">CompraSmart</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 0.95rem;">O Uber das Vendas</p>
                    </td>
                  </tr>

                  <!-- CONTEÚDO -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 1.5rem;">Olá, ${nomeLojista}! 👋</h2>
                      <p style="color: #64748b; margin: 0 0 20px 0; font-size: 1rem; line-height: 1.6;">
                        É um prazer ter <strong>${nomeEmpresa}</strong> conosco!
                      </p>
                      
                      <p style="color: #475569; margin: 0 0 25px 0; font-size: 1rem; line-height: 1.6;">
                        Você acaba de dar o passo que separa as lojas que <em>"esperam o cliente entrar"</em> das lojas que <strong>vão até o cliente</strong>.
                      </p>

                      <div style="background-color: #e0f2fe; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px;">
                        <p style="color: #0c4a6e; margin: 0; font-weight: 600; font-size: 0.95rem;">
                          💡 Enquanto seu ERP cuida da burocracia, nós cuidaremos do que mais importa: colocar dinheiro no seu caixa.
                        </p>
                      </div>

                      <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 1.3rem;">O que fazer agora? 🎯</h3>

                      <!-- PASSO 1 -->
                      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 1.1rem;">
                          1️⃣ Conecte seu Catálogo
                        </h4>
                        <p style="color: #475569; margin: 0; font-size: 0.95rem; line-height: 1.6;">
                          Acesse seu painel e importe seus produtos (via CSV ou manualmente). 
                          <strong>Lembre-se:</strong> você tem <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 4px; font-weight: 600;">15 minutos de correção livre</span> 
                          após cada cadastro para garantir que tudo esteja perfeito!
                        </p>
                      </div>

                      <!-- PASSO 2 -->
                      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #10b981; margin: 0 0 10px 0; font-size: 1.1rem;">
                          2️⃣ Configure sua Equipe
                        </h4>
                        <p style="color: #475569; margin: 0; font-size: 0.95rem; line-height: 1.6;">
                          Adicione seus vendedores próprios e comece a receber suporte de nossa rede de <strong>10 consultores especialistas</strong> 
                          que atendem por áudio e imagem quando seu time estiver ocupado.
                        </p>
                      </div>

                      <!-- PASSO 3 -->
                      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #f59e0b; margin: 0 0 10px 0; font-size: 1.1rem;">
                          3️⃣ Acompanhe suas Vendas
                        </h4>
                        <p style="color: #475569; margin: 0; font-size: 0.95rem; line-height: 1.6;">
                          No seu dashboard, você verá em tempo real as vendas geradas pela plataforma e quanto está economizando 
                          com nossa rede de apoio vs contratar mais funcionários.
                        </p>
                      </div>

                      <!-- DICA DE OURO -->
                      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 30px 0;">
                        <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 1.15rem;">
                          💡 Dica de Ouro da CompraSmart
                        </h4>
                        <p style="color: #78350f; margin: 0; font-size: 0.95rem; line-height: 1.6;">
                          Neste exato momento, milhares de clientes estão abandonando carrinhos em sites frios. 
                          A partir de hoje, <strong>seus clientes serão recebidos com vídeos, áudios e consultoria real</strong>.
                        </p>
                      </div>

                      <!-- BOTÃO CTA -->
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="https://suacomprssmart.com/lojista/dashboard" 
                           style="display: inline-block; background-color: #3b82f6; color: white; padding: 16px 40px; 
                                  text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 1.05rem;
                                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                          🚀 Acessar Meu Painel de Controle
                        </a>
                      </div>

                      <p style="color: #64748b; margin: 30px 0 0 0; font-size: 0.95rem; line-height: 1.6; text-align: center;">
                        Estamos ansiosos para ver seu primeiro relatório de <strong>Receita Incremental</strong>!
                      </p>

                      <p style="color: #64748b; margin: 20px 0 0 0; font-size: 0.95rem; text-align: center;">
                        Boas vendas,<br>
                        <strong style="color: #1e293b;">Equipe CompraSmart</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #94a3b8; margin: 0; font-size: 0.85rem;">
                        Precisa de ajuda? Respondemos em minutos: 
                        <a href="mailto:suporte@comprasmart.com" style="color: #3b82f6; text-decoration: none;">suporte@comprasmart.com</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    },

    pro: {
      subject: '⭐ Bem-vindo ao Plano Pro - Transbordo Inteligente Ativado!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f8f9fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  
                  <!-- HEADER PRO -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 2rem; font-weight: 800;">CompraSmart PRO ⭐</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 0.95rem;">Transbordo Inteligente Ativado</p>
                    </td>
                  </tr>

                  <!-- CONTEÚDO PRO -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 1.5rem;">Parabéns, ${nomeLojista}! 🎉</h2>
                      <p style="color: #64748b; margin: 0 0 20px 0; font-size: 1rem; line-height: 1.6;">
                        <strong>${nomeEmpresa}</strong> agora opera com o <strong>sistema anti-perda de vendas</strong> mais avançado do mercado!
                      </p>

                      <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px;">
                        <p style="color: #065f46; margin: 0; font-weight: 600; font-size: 0.95rem;">
                          ⚡ Seu time nunca mais perderá uma venda por estar ocupado. Nossa rede assume automaticamente!
                        </p>
                      </div>

                      <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 1.3rem;">Configure seu SLA de 5 Minutos 🎯</h3>

                      <!-- SLA CONFIG -->
                      <div style="background-color: #f0fdf4; border: 3px solid #10b981; border-radius: 12px; padding: 25px; margin: 20px 0;">
                        <h4 style="color: #10b981; margin: 0 0 15px 0; font-size: 1.2rem;">
                          ⏱️ Como Funciona o Transbordo Inteligente:
                        </h4>
                        <ol style="color: #475569; margin: 0; padding-left: 20px; font-size: 0.95rem; line-height: 1.8;">
                          <li>Cliente entra em contato via plataforma</li>
                          <li><strong>Seu vendedor interno</strong> tem 5 minutos para responder</li>
                          <li>Se não responder, <strong>nossa rede de 30 consultores</strong> assume automaticamente</li>
                          <li>Venda garantida, sem perda por demora!</li>
                        </ol>
                      </div>

                      <!-- PASSOS PRO -->
                      <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 1.3rem;">Próximos Passos:</h3>

                      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #10b981; margin: 0 0 10px 0;">1️⃣ Configure o SLA de Transbordo</h4>
                        <p style="color: #475569; margin: 0; font-size: 0.95rem;">
                          Acesse <strong>Configurações → Transbordo</strong> e defina o tempo ideal (recomendamos 5 minutos).
                        </p>
                      </div>

                      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #10b981; margin: 0 0 10px 0;">2️⃣ Integre seu ERP (Semanal)</h4>
                        <p style="color: #475569; margin: 0; font-size: 0.95rem;">
                          No Plano Pro, você tem sincronização semanal automática. Configure uma vez e esqueça!
                        </p>
                      </div>

                      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #10b981; margin: 0 0 10px 0;">3️⃣ Ative Vídeo-Chamadas</h4>
                        <p style="color: #475569; margin: 0; font-size: 0.95rem;">
                          Consultores Pro podem atender por vídeo para produtos técnicos. Taxa de conversão 60% maior!
                        </p>
                      </div>

                      <!-- CTA -->
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="https://suacomprasmart.com/lojista/dashboard/configuracoes" 
                           style="display: inline-block; background-color: #10b981; color: white; padding: 16px 40px; 
                                  text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 1.05rem;
                                  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                          ⚙️ Configurar SLA Agora
                        </a>
                      </div>

                      <p style="color: #64748b; margin: 30px 0 0 0; text-align: center;">
                        Boas vendas (e zero perdas!),<br>
                        <strong style="color: #1e293b;">Equipe CompraSmart Pro</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 25px 30px; text-align: center;">
                      <p style="color: #94a3b8; margin: 0; font-size: 0.85rem;">
                        Suporte Priority Pro: <a href="mailto:pro@comprasmart.com" style="color: #10b981;">pro@comprasmart.com</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    },

    enterprise: {
      subject: '🏆 Bem-vindo ao Enterprise - Liquidez de Estoque Ativada!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f8f9fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden;">
                  
                  <!-- HEADER ENTERPRISE -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 2rem; font-weight: 800;">CompraSmart ENTERPRISE 🏆</h1>
                      <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0;">Gestão de Elite + Liquidez Total</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1e293b; margin: 0 0 10px 0;">Bem-vindo à Elite, ${nomeLojista}! 🎖️</h2>
                      <p style="color: #64748b; margin: 0 0 20px 0; line-height: 1.6;">
                        <strong>${nomeEmpresa}</strong> agora tem acesso ao sistema mais completo de <strong>recuperação de capital parado</strong>!
                      </p>

                      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 8px;">
                        <p style="color: #78350f; margin: 0; font-weight: 600;">
                          💰 Produtos parados 60+ dias? Nosso BI identifica e aciona missões de venda ativa automaticamente!
                        </p>
                      </div>

                      <h3 style="color: #1e293b; margin: 30px 0 15px 0;">Recursos Enterprise Exclusivos:</h3>

                      <!-- RECURSO 1 -->
                      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fb923c; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #f59e0b; margin: 0 0 10px 0;">📊 BI Avançado de Stock Parado</h4>
                        <p style="color: #78350f; margin: 0; font-size: 0.95rem;">
                          Identifica automaticamente produtos sem giro há 60+ dias e calcula o ROI de missões específicas para escoá-los.
                        </p>
                      </div>

                      <!-- RECURSO 2 -->
                      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fb923c; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #f59e0b; margin: 0 0 10px 0;">🔄 Sincronização Real-Time</h4>
                        <p style="color: #78350f; margin: 0; font-size: 0.95rem;">
                          Integração contínua via API com seu ERP. Estoque, preços e disponibilidade sempre atualizados.
                        </p>
                      </div>

                      <!-- RECURSO 3 -->
                      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fb923c; border-radius: 12px; padding: 20px; margin: 15px 0;">
                        <h4 style="color: #f59e0b; margin: 0 0 10px 0;">🏢 Gestão Multi-Filiais</h4>
                        <p style="color: #78350f; margin: 0; font-size: 0.95rem;">
                          Visão consolidada de todas as filiais. Dashboard de ROI por unidade em tempo real.
                        </p>
                      </div>

                      <!-- PRÓXIMOS PASSOS -->
                      <h3 style="color: #1e293b; margin: 30px 0 15px 0;">Configure Agora:</h3>

                      <ol style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li><strong>Conecte sua API:</strong> Acesse Integrações → API Enterprise</li>
                        <li><strong>Configure Missões de Stock:</strong> Defina comissão turbinada (15-20%) para produtos parados</li>
                        <li><strong>Ative Multi-Filiais:</strong> Adicione CNPJs das unidades para visão consolidada</li>
                      </ol>

                      <!-- CTA -->
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="https://suacomprasmart.com/lojista/dashboard/enterprise" 
                           style="display: inline-block; background-color: #f59e0b; color: white; padding: 16px 40px; 
                                  text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 1.05rem;
                                  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                          🚀 Acessar Dashboard Enterprise
                        </a>
                      </div>

                      <p style="color: #64748b; margin: 30px 0 0 0; text-align: center;">
                        Seu capital parado volta a circular!<br>
                        <strong style="color: #1e293b;">Equipe CompraSmart Enterprise</strong>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background-color: #fffbeb; padding: 25px 30px; text-align: center;">
                      <p style="color: #92400e; margin: 0; font-size: 0.85rem; font-weight: 600;">
                        🎯 Suporte Enterprise VIP: <a href="mailto:vip@comprasmart.com" style="color: #f59e0b;">vip@comprasmart.com</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }
  };

  return templates[plano.toLowerCase()] || templates.basic;
};