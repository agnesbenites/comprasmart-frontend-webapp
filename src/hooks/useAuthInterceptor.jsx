// src/hooks/useAuthInterceptor.js

import { useEffect } from 'react';
// REMOVIDO: Supabase migrado para Supabase
import api from '../api/axiosConfig';

// Este hook injeta o token JWT do Supabase em todas as requisicoes do Axios
export const useAuthInterceptor = () => {
    const { getAccessTokenSilently } = useAuth();

    useEffect(() => {
        // 1. Cria o interceptor
        const interceptor = api.interceptors.request.use(async (config) => {
            
            // Tenta obter o Access Token do Supabase
            try {
                // audience CRTICO: Deve ser o seu VITE_Supabase_AUDIENCE
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_Supabase_AUDIENCE, 
                    },
                });

                // 2. Adiciona o token ao cabecalho (Formato Bearer)
                config.headers.Authorization = `Bearer ${token}`;
            
            } catch (error) {
                console.error("Erro ao obter o Access Token do Supabase:", error);
                // Se o token falhar, a requisicao sera enviada sem token (e deve retornar 401)
            }

            return config;
        });

        // 3. Funcao de limpeza: remove o interceptor quando o componente desmonta
        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [getAccessTokenSilently]);

    // O hook nao retorna nada, apenas configura o Axios globalmente.
};


