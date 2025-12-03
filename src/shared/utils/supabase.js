import { createClient } from '@supabase/supabase-js';

// Agora usando variáveis de ambiente para segurança
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vluxffbornrlxcepqmzr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdXhmZmJvcm5ybHhjZXBxbXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjMwNjYsImV4cCI6MjA3NzMyMzA2Nn0.7IgS0b1O6evLN7QMvWu4BhI6awxNs_Eb0yuTAEmJHas';

// ----------------------------------------------------------------------
// CORREÇÃO PARA O AVISO "Multiple GoTrueClient instances detected"
// 
// Em ambientes de desenvolvimento (como Vite/React com HMR), este módulo
// pode ser re-executado. Armazenar a instância no objeto global (window
// ou globalThis) garante que createClient seja chamado apenas uma vez.
// ----------------------------------------------------------------------
const globalSupabase = globalThis.supabaseInstance;
let supabase;

if (globalSupabase) {
    // Se a instância já existe no globalThis (HMR ocorreu), a reutilize.
    supabase = globalSupabase;
} else {
    // Caso contrário, crie a nova instância e a armazene no globalThis.
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    globalThis.supabaseInstance = supabase;
}

export { supabase };

// Mantendo suas funções de utilidade, mas usando o export nomeado padrão:
export const fetchAnalytics = async (consultantId) => {
    // Note: Esta função ainda é exportada, mas o cliente 'supabase' usado
    // é agora a instância única garantida acima.
    const { count: totalMessages, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('user_type', 'consultant'); 

    if (countError) {
        console.error('Erro ao buscar analytics:', countError);
        return {};
    }
    const dailyCount = Math.floor(totalMessages / 5); 

    const avgTime = dailyCount > 0 ? `${(45 / dailyCount).toFixed(1)} min` : '0 min';
    const commissionValue = `R$ ${(dailyCount * 12.50).toFixed(2)}`;

    return {
        dailyCount: dailyCount,
        avgTime: avgTime,
        commissionValue: commissionValue,
        closedSales: 8,             
        qrCodesSent: 25,            
        indicatedConsultants: 3,    
        rating: 4.8,                
        associatedStores: ['Magazine X', 'Loja Y'], 
        associatedSegments: ['Eletrônicos', 'Decoração']
    };
};