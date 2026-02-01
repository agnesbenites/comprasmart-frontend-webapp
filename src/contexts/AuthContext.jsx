// src/contexts/AuthContext.jsx
// Context de autenticação ROBUSTO com limpeza automática

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
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // 1. Verificar sessão ao montar
    initializeAuth();

    // 2. Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔐 Auth event:", event);
        
        if (event === "SIGNED_IN") {
          console.log("✅ Usuário logado:", session?.user?.email);
          setUser(session?.user || null);
          setLoading(false);
        } 
        else if (event === "SIGNED_OUT") {
          console.log("🚪 Usuário deslogado");
          await cleanupSession();
          setUser(null);
          setLoading(false);
        } 
        else if (event === "TOKEN_REFRESHED") {
          console.log("🔄 Token renovado");
          setUser(session?.user || null);
        }
        else if (event === "USER_UPDATED") {
          console.log("👤 Usuário atualizado");
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Inicializa autenticação com limpeza automática
  const initializeAuth = async () => {
    try {
      console.log("🔍 Verificando sessão...");
      
      // Pegar sessão atual
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Erro ao verificar sessão:", error);
        await cleanupSession();
        setUser(null);
        setLoading(false);
        setSessionChecked(true);
        return;
      }

      if (session && session.user) {
        // Verificar se a sessão expirou
        const expiresAt = session.expires_at;
        const now = Math.floor(Date.now() / 1000);
        
        if (expiresAt && expiresAt < now) {
          console.log("⏰ Sessão expirada, limpando...");
          await cleanupSession();
          setUser(null);
        } else {
          console.log("✅ Sessão válida:", session.user.email);
          setUser(session.user);
        }
      } else {
        console.log("ℹ️ Nenhuma sessão encontrada");
        await cleanupSession(); // Limpa qualquer lixo
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Erro na inicialização:", error);
      await cleanupSession();
      setUser(null);
    } finally {
      setLoading(false);
      setSessionChecked(true);
    }
  };

  // Limpa sessão e localStorage
  const cleanupSession = async () => {
    try {
      // Fazer signOut no Supabase
      await supabase.auth.signOut();
      
      // Limpar localStorage (apenas chaves específicas)
      const keysToRemove = [
        'cadastro_pendente',
        'cadastro_lojista_pendente',
        'lojistaCNPJ',
        'lojistaNome',
        'plano',
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log("🧹 Sessão limpa");
    } catch (error) {
      console.error("Erro ao limpar sessão:", error);
    }
  };

  // Login
  const signIn = async (email, password) => {
    try {
      // Limpar qualquer sessão antiga primeiro
      await cleanupSession();
      
      // Fazer novo login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("✅ Login bem-sucedido:", data.user.email);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  };

  // Registro
  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      throw error;
    }
  };

  // Logout
  const signOut = async () => {
    try {
      await cleanupSession();
      setUser(null);
      console.log("🚪 Logout realizado");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      throw error;
    }
  };

  // Refresh manual da sessão
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (session && session.user) {
        setUser(session.user);
        console.log("🔄 Sessão renovada");
        return session;
      }
      
      return null;
    } catch (error) {
      console.error("❌ Erro ao renovar sessão:", error);
      await cleanupSession();
      setUser(null);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    sessionChecked,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;