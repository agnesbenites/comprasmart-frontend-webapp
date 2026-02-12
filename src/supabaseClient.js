import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mantive seus logs para você conferir no console se as variáveis carregaram
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key existe:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variaveis de ambiente Supabase nao configuradas!");
}

// Simplificamos a criação: o Supabase já entende que o schema é 'public' 
// e já envia os headers de Content-Type e apikey sozinho.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});