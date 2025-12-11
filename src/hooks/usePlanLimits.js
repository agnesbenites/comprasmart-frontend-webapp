// app-frontend/src/hooks/usePlanLimits.js

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Hook para verificar limites do plano antes de executar acoes
 */
export function usePlanLimits(lojistaId) {
    const [planInfo, setPlanInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (lojistaId) {
            fetchPlanInfo();
        }
    }, [lojistaId]);

    const fetchPlanInfo = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/planos/info/${lojistaId}`);
            setPlanInfo(response.data);
        } catch (error) {
            console.error('Erro ao buscar info do plano:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Verifica se uma acao pode ser executada
     */
    const canPerformAction = async (action, data = {}) => {
        try {
            const response = await axios.post(`${API_URL}/api/planos/validate`, {
                lojistaId,
                action,
                ...data
            });

            return {
                allowed: response.data.allowed,
                error: response.data.error,
                needsUpgrade: response.data.needsUpgrade,
                tempoRestante: response.data.tempoRestante,
                diasRestantes: response.data.diasRestantes,
                addon: response.data.addon
            };
        } catch (error) {
            if (error.response?.status === 403) {
                return {
                    allowed: false,
                    error: error.response.data.error,
                    needsUpgrade: error.response.data.needsUpgrade,
                    tempoRestante: error.response.data.tempoRestante,
                    diasRestantes: error.response.data.diasRestantes,
                    addon: error.response.data.addon
                };
            }
            return { allowed: false, error: 'Erro ao verificar permissoes' };
        }
    };

    /**
     * Retorna limites atuais vs maximos
     */
    const getLimits = () => {
        if (!planInfo) return null;

        const { plano, uso } = planInfo;

        return {
            produtos: {
                usado: uso.total_produtos || 0,
                maximo: plano.max_produtos + (uso.pacotes_adicionais_ativos * plano.pacote_adicional_produtos),
                percentual: ((uso.total_produtos || 0) / plano.max_produtos) * 100
            },
            filiais: {
                usado: uso.total_filiais || 0,
                maximo: plano.max_filiais + (uso.pacotes_adicionais_ativos * plano.pacote_adicional_filiais),
                percentual: ((uso.total_filiais || 0) / plano.max_filiais) * 100
            },
            vendedores: {
                usado: uso.total_vendedores || 0,
                maximo: plano.max_vendedores + (uso.pacotes_adicionais_ativos * plano.pacote_adicional_vendedores),
                percentual: ((uso.total_vendedores || 0) / plano.max_vendedores) * 100
            },
            consultores: {
                usado: uso.total_consultores || 0,
                maximo: plano.max_consultores,
                percentual: ((uso.total_consultores || 0) / plano.max_consultores) * 100
            },
            chamadasVideo: {
                usado: uso.chamadas_video_mes || 0,
                maximo: plano.chamadas_video_mes === 999999 ? 'ˆ' : plano.chamadas_video_mes,
                percentual: plano.chamadas_video_mes === 999999 ? 0 : ((uso.chamadas_video_mes || 0) / plano.chamadas_video_mes) * 100
            }
        };
    };

    return {
        planInfo,
        loading,
        canPerformAction,
        getLimits,
        refetch: fetchPlanInfo
    };
}
