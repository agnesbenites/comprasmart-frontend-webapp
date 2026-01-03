// src/contexts/AuthContext.jsx
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
      console.log("[AuthContext] Fazendo logout...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      
      window.location.href = '/entrar';
    } catch (error) {
      console.error("[AuthContext] Erro ao fazer logout:", error);
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
      profile: userProfile,
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