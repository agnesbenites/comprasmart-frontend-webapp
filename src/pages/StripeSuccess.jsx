// src/pages/StripeSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const StripeSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    handleStripeReturn();
  }, []);

  const handleStripeReturn = async () => {
    try {
      const success = searchParams.get('success');
      if (success !== 'true') {
        setStatus('error');
        setTimeout(() => navigate('/cadastro/lojista'), 3000);
        return;
      }

      const cadastroData = localStorage.getItem('cadastro_pendente');
      if (!cadastroData) {
        setStatus('error');
        setTimeout(() => navigate('/lojista/login'), 3000);
        return;
      }

      const { email, senha, plano } = JSON.parse(cadastroData);

      const { error: updateError } = await supabase
        .from('lojas_corrigida')
        .update({
          status: 'ativa',
          plano: plano,
          stripe_subscription_status: 'active'
        })
        .eq('email', email);

      if (updateError) {
        console.error('Erro ao ativar conta:', updateError);
        setStatus('error');
        setTimeout(() => navigate('/lojista/login'), 3000);
        return;
      }

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (loginError) {
        console.error('Erro no login automático:', loginError);
        setStatus('error');
        setTimeout(() => navigate('/lojista/login'), 3000);
        return;
      }

      // Atualizar metadata com role
      await supabase.auth.updateUser({
        data: {
          role: 'lojista',
          plano: plano,
        },
      });

      localStorage.removeItem('cadastro_pendente');

      setStatus('success');
      setTimeout(() => {
        navigate('/lojista/dashboard', { replace: true });
      }, 2000);

    } catch (error) {
      console.error('Erro no processo:', error);
      setStatus('error');
      setTimeout(() => navigate('/lojista/login'), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'processing' && (
          <>
            <div style={styles.spinner}></div>
            <h2 style={styles.title}> Processando pagamento...</h2>
            <p style={styles.text}>Aguarde enquanto ativamos sua conta.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.successIcon}></div>
            <h2 style={styles.title}> Pagamento Confirmado!</h2>
            <p style={styles.text}>Sua conta foi ativada com sucesso!</p>
            <p style={styles.subtext}>Redirecionando para o dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.errorIcon}></div>
            <h2 style={styles.title}>Ops! Algo deu errado</h2>
            <p style={styles.text}>
              Não conseguimos processar seu pagamento automaticamente.
            </p>
            <p style={styles.subtext}>Redirecionando para o login...</p>
            <button 
              onClick={() => navigate('/lojista/login')}
              style={styles.button}
            >
              Ir para Login
            </button>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '60px 40px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  spinner: {
    width: '60px',
    height: '60px',
    margin: '0 auto 30px',
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #bb25a6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  text: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
  subtext: {
    fontSize: '0.95rem',
    color: '#999',
    marginTop: '20px',
  },
  button: {
    marginTop: '30px',
    padding: '14px 32px',
    backgroundColor: '#bb25a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default StripeSuccess;