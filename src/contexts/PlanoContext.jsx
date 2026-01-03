// src/contexts/PlanoContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const PlanoContext = createContext();

export const PlanoProvider = ({ children }) => {
  const [plano, setPlano] = useState('basico');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarPlano();
  }, []);

  const buscarPlano = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: loja } = await supabase
          .from('lojas_corrigida')
          .select('plano')
          .eq('user_id', user.id)
          .single();
        
        if (loja?.plano) {
          const planoNormalizado = loja.plano.toLowerCase();
          setPlano(planoNormalizado);
          
          // ✅ SALVA NO LOCALSTORAGE
          localStorage.setItem('plano', planoNormalizado);
          
          console.log('[PlanoContext] Plano detectado:', planoNormalizado);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlanoContext.Provider value={{ plano, loading, buscarPlano }}>
      {children}
    </PlanoContext.Provider>
  );
};

export const usePlano = () => {
  const context = useContext(PlanoContext);
  if (!context) {
    throw new Error('usePlano deve ser usado dentro de PlanoProvider');
  }
  return context;
};