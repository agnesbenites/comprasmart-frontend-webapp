// src/services/emailService.js
// Serviço para enviar e-mails via API

import { supabase } from '../supabaseClient';
import { getWelcomeEmailTemplate } from '../utils/emailTemplates';

/**
 * Envia e-mail de boas-vindas após cadastro
 * @param {string} nomeLojista - Nome do lojista
 * @param {string} email - E-mail do destinatário
 * @param {string} plano - Plano escolhido (basic, pro, enterprise)
 * @param {string} nomeEmpresa - Nome da empresa
 */
export const enviarEmailBoasVindas = async (nomeLojista, email, plano, nomeEmpresa) => {
  try {
    // 1. Buscar e-mails pendentes para este destinatário
    const { data: emailPendente } = await supabase
      .from('emails_enviados')
      .select('id')
      .eq('destinatario_email', email)
      .eq('tipo_email', 'boas_vindas')
      .eq('status', 'pendente')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!emailPendente) {
      console.warn('Nenhum e-mail pendente encontrado para:', email);
      return { success: false, message: 'E-mail não registrado' };
    }

    // 2. Obter template do e-mail
    const emailTemplate = getWelcomeEmailTemplate(nomeLojista, plano, nomeEmpresa);

    // 3. Enviar via serviço de e-mail (exemplo com API própria ou Resend/SendGrid)
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar e-mail');
    }

    // 4. Marcar como enviado no banco
    await supabase.rpc('marcar_email_enviado', {
      p_email_id: emailPendente.id,
      p_sucesso: true,
    });

    console.log('✅ E-mail de boas-vindas enviado para:', email);
    return { success: true, message: 'E-mail enviado com sucesso' };

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);

    // Registrar erro no banco
    if (emailPendente?.id) {
      await supabase.rpc('marcar_email_enviado', {
        p_email_id: emailPendente.id,
        p_sucesso: false,
        p_erro_mensagem: error.message,
      });
    }

    return { success: false, message: error.message };
  }
};

/**
 * Processar fila de e-mails pendentes
 * Pode ser chamado periodicamente ou via webhook
 */
export const processarFilaEmails = async () => {
  try {
    // Buscar e-mails pendentes
    const { data: emailsPendentes } = await supabase
      .from('emails_pendentes')
      .select('*')
      .limit(10); // Processa 10 por vez

    if (!emailsPendentes || emailsPendentes.length === 0) {
      console.log('📭 Nenhum e-mail pendente');
      return { processados: 0 };
    }

    console.log(`📨 Processando ${emailsPendentes.length} e-mails...`);

    const resultados = await Promise.allSettled(
      emailsPendentes.map(async (email) => {
        const template = getWelcomeEmailTemplate(
          email.destinatario_nome,
          email.plano,
          email.destinatario_nome // Ou buscar nome da empresa
        );

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email.destinatario_email,
            subject: template.subject,
            html: template.html,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        await supabase.rpc('marcar_email_enviado', {
          p_email_id: email.id,
          p_sucesso: true,
        });

        return { email: email.destinatario_email, status: 'enviado' };
      })
    );

    const enviados = resultados.filter(r => r.status === 'fulfilled').length;
    const erros = resultados.filter(r => r.status === 'rejected').length;

    console.log(`✅ Enviados: ${enviados} | ❌ Erros: ${erros}`);

    return { processados: enviados, erros };

  } catch (error) {
    console.error('❌ Erro ao processar fila:', error);
    return { processados: 0, erros: 1 };
  }
};

/**
 * Hook para chamar após cadastro bem-sucedido
 * Uso: import { useEmailBoasVindas } from './services/emailService';
 */
export const useEmailBoasVindas = () => {
  const enviar = async (dadosLojista) => {
    const { nome, email, plano, nomeEmpresa } = dadosLojista;
    
    // Aguardar 2 segundos para garantir que trigger executou
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return enviarEmailBoasVindas(nome, email, plano, nomeEmpresa);
  };

  return { enviar };
};
