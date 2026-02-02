// src/contexts/AuthContext.jsx
// AuthContext CORRETO - SEM loop infinito

import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("🔐 Auth event:", _event);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Limpa localStorage (SEM fazer signOut)
  const cleanLocalStorage = () => {
    const keysToRemove = [
      'cadastro_pendente',
      'cadastro_lojista_pendente',
      'lojistaCNPJ',
      'lojistaNome',
      'plano',
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log("🧹 localStorage limpo");
  };

  // Login
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    console.log("✅ Login bem-sucedido:", data.user.email);
    return data;
  };

  // Registro
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
    return data;
  };

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    cleanLocalStorage();
    console.log("🚪 Logout realizado");
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;