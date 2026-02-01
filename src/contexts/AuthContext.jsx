// src/contexts/AuthContext.jsx
// Context de autenticação com validação de sessão

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
    // Verifica sessão inicial
    checkSession();

    // Listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        } else if (event === "TOKEN_REFRESHED") {
          setUser(session?.user || null);
        } else if (event === "USER_UPDATED") {
          setUser(session?.user || null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      // Pega a sessão atual
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro ao verificar sessão:", error);
        // Limpa sessão inválida
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      if (session && session.user) {
        // Verifica se a sessão não expirou
        const expiresAt = session.expires_at;
        const now = Math.floor(Date.now() / 1000);
        
        if (expiresAt && expiresAt < now) {
          console.log("Sessão expirada, fazendo logout...");
          await supabase.auth.signOut();
          setUser(null);
        } else {
          console.log("Sessão válida encontrada:", session.user.email);
          setUser(session.user);
        }
      } else {
        console.log("Nenhuma sessão encontrada");
        setUser(null);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    setUser(data.user);
    return data;
  };

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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    
    // Limpa localStorage
    localStorage.removeItem("cadastro_pendente");
    localStorage.removeItem("cadastro_lojista_pendente");
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