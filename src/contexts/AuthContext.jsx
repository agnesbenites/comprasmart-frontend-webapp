// src/contexts/AuthContext.jsx - CORRIGIDO
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        console.log("[AuthContext] Verificando sessão...");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[AuthContext] Erro ao verificar sessão:", error);
          if (isMounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
          }
          return;
        }
        
        if (session?.user) {
          console.log("[AuthContext] Usuário encontrado:", session.user.id);
          if (isMounted) {
            setUser(session.user);
            setLoading(false);
            fetchUserProfile(session.user.id);
          }
        } else {
          console.log("[AuthContext] Nenhuma sessão ativa");
          if (isMounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("[AuthContext] Erro:", error);
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[AuthContext] Auth state changed:", event);
        
        if (!isMounted) return;
        
        if (session?.user) {
          setUser(session.user);
          setLoading(false);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log("[AuthContext] Buscando perfil do usuário:", userId);
      
      // ✅ BUSCA DA LOJA (não de usuarios)
      const { data: loja, error: lojaError } = await supabase
        .from('lojas_corrigida')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (lojaError) {
        console.warn("[AuthContext] Loja não encontrada:", lojaError.message);
        
        // Se não for loja, tenta buscar de outros tipos de usuário
        const { data: usuario, error: usuarioError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (!usuarioError && usuario) {
          console.log("[AuthContext] Usuário encontrado (não-lojista):", usuario);
          setUserProfile(usuario);
        }
        return;
      }
      
      console.log("[AuthContext] Loja encontrada:", loja);
      setUserProfile({
        ...loja,
        tipo: 'loja', // ✅ Marca como loja
        plano: loja.plano,
      });
    } catch (error) {
      console.error("[AuthContext] Erro ao buscar perfil:", error);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log("[AuthContext] Fazendo login...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("[AuthContext] Login bem-sucedido");
      return { success: true, user: data.user };
    } catch (error) {
      console.error("[AuthContext] Erro no login:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      console.log("=".repeat(50));
      console.log("🚪 [LOGOUT] Iniciando logout completo...");
      console.log("=".repeat(50));
      
      // 1. Logout no Supabase Auth
      console.log("1️⃣ Deslogando do Supabase...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("❌ Erro no signOut:", error);
        throw error;
      }
      console.log("✅ SignOut concluído");
      
      // 2. Limpar states do React
      console.log("2️⃣ Limpando states...");
      setUser(null);
      setUserProfile(null);
      console.log("✅ States limpos");
      
      // 3. Limpar localStorage COMPLETAMENTE
      console.log("3️⃣ Limpando localStorage...");
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keysToRemove.push(key);
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log("✅ localStorage limpo:", keysToRemove.length, "chaves removidas");
      
      // 4. Limpar sessionStorage
      console.log("4️⃣ Limpando sessionStorage...");
      sessionStorage.clear();
      console.log("✅ sessionStorage limpo");
      
      // 5. Limpar cookies do Supabase
      console.log("5️⃣ Limpando cookies...");
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      console.log("✅ Cookies limpos");
      
      console.log("=".repeat(50));
      console.log("✅ [LOGOUT] Logout completo! Redirecionando...");
      console.log("=".repeat(50));
      
      // 6. Redirecionar com reload forçado
      setTimeout(() => {
        window.location.href = '/lojista/login';
      }, 500);
      
    } catch (error) {
      console.error("❌ [LOGOUT] Erro ao fazer logout:", error);
      // Mesmo com erro, limpa tudo e redireciona
      setUser(null);
      setUserProfile(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/lojista/login';
    }
  };

  const value = {
    user,
    userProfile,
    profile: userProfile, // ✅ Alias para compatibilidade
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  // Debug
  useEffect(() => {
    console.log("[AuthContext] Estado atual:", { 
      user: user?.id || 'null',
      profile: userProfile?.nome || 'null',
      loading, 
      isAuthenticated: !!user 
    });
  }, [user, userProfile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};