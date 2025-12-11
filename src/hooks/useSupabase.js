// src/hooks/useSupabase.js
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se o cliente foi inicializado corretamente
    if (supabase && supabase.auth) {
      setIsLoading(false);
    } else {
      setError('Supabase nao inicializado corretamente');
      setIsLoading(false);
    }
  }, []);

  return {
    supabase,
    isLoading,
    error
  };
};
