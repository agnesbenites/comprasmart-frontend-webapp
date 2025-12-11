// app-frontend/src/hooks/useBlockedCheck.js

// REMOVIDO: Supabase migrado para Supabase
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useBlockedCheck = () => {
  const { user, isAuthenticated } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkIfBlocked = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('/api/user/status');
        setIsBlocked(response.data.status === 'bloqueado');
      } catch (error) {
        console.error('Erro ao verificar bloqueio:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkIfBlocked();
  }, [isAuthenticated, user]);
  
  return { isBlocked, loading };
};

