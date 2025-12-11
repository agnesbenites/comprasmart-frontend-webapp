// src/hooks/useInactivityTimeout.js
// Hook para logout automatico apos periodo de inatividade

import { useEffect, useCallback, useRef } from 'react';
// REMOVIDO: Supabase migrado para Supabase

/**
 * Hook que monitora inatividade do usuario e faz logout automatico
 * @param {number} timeoutMinutes - Minutos de inatividade antes do logout (padrao: 10)
 * @param {boolean} enabled - Se o hook esta ativo (padrao: true)
 */
export const useInactivityTimeout = (timeoutMinutes = 10, enabled = true) => {
  const { logout, isAuthenticated } = useAuth();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  
  // Tempo em milissegundos
  const TIMEOUT_MS = timeoutMinutes * 60 * 1000;
  const WARNING_BEFORE_MS = 60 * 1000; // Aviso 1 minuto antes

  // Funcao de logout
  const handleLogout = useCallback(() => {
    console.log('° Logout por inatividade');
    
    // Limpar dados locais
    localStorage.removeItem('lastActivity');
    
    // Fazer logout do Supabase
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }, [logout]);

  // Mostrar aviso antes do logout
  const showWarning = useCallback(() => {
    // Criar modal de aviso
    const existingModal = document.getElementById('inactivity-warning-modal');
    if (existingModal) return;

    const modal = document.createElement('div');
    modal.id = 'inactivity-warning-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 400px;
          animation: fadeIn 0.3s ease;
        ">
          <div style="font-size: 48px; margin-bottom: 15px;">°</div>
          <h2 style="margin: 0 0 10px; color: #e74c3c; font-size: 1.5rem;">
            Sessao expirando!
          </h2>
          <p style="color: #666; margin-bottom: 20px; font-size: 1rem;">
            Voca sera desconectado em <strong>60 segundos</strong> por inatividade.
          </p>
          <button 
            id="stay-logged-in-btn"
            style="
              background: #2c5aa0;
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.3s;
            "
          >
            Continuar conectado
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);

    // Botao para continuar
    const btn = document.getElementById('stay-logged-in-btn');
    if (btn) {
      btn.onclick = () => {
        modal.remove();
        resetTimer();
      };
    }
  }, []);

  // Resetar timer de inatividade
  const resetTimer = useCallback(() => {
    // Limpar timeouts existentes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    // Remover modal de aviso se existir
    const modal = document.getElementById('inactivity-warning-modal');
    if (modal) modal.remove();

    if (!enabled || !isAuthenticated) return;

    // Salvar ultima atividade
    localStorage.setItem('lastActivity', Date.now().toString());

    // Timer para mostrar aviso (1 minuto antes do logout)
    warningTimeoutRef.current = setTimeout(() => {
      showWarning();
    }, TIMEOUT_MS - WARNING_BEFORE_MS);

    // Timer para logout
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, TIMEOUT_MS);

  }, [enabled, isAuthenticated, TIMEOUT_MS, WARNING_BEFORE_MS, handleLogout, showWarning]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    // Eventos que indicam atividade do usuario
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'wheel'
    ];

    // Throttle para nao resetar a cada movimento minimo
    let lastReset = Date.now();
    const THROTTLE_MS = 1000; // Resetar no maximo 1x por segundo

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastReset > THROTTLE_MS) {
        lastReset = now;
        resetTimer();
      }
    };

    // Adicionar listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Verificar se ja estava inativo (ex: voltou de outra aba)
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity);
      if (elapsed > TIMEOUT_MS) {
        handleLogout();
        return;
      }
    }

    // Iniciar timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [enabled, isAuthenticated, resetTimer, handleLogout, TIMEOUT_MS]);

  // Retornar funcao para resetar manualmente se necessario
  return { resetTimer };
};

export default useInactivityTimeout;


