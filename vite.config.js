// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Mantido para o uso dos aliases de path

export default defineConfig({
  plugins: [react()],
  
  // 🚨 CORREÇÕES CRÍTICAS PARA VERCEL/PRODUÇÃO:
  // 1. Base Path: Garante que todos os assets (JS/CSS) sejam carregados a partir da raiz ('/').
  //    Isso corrige o erro de MIME type ("text/html" em vez de "text/javascript").
  base: '/', 
  
  // 2. Otimização de Dependência: Força o Vite/Rollup a pré-processar o uuid.
  optimizeDeps: {
    include: ['uuid'],
  },

  // === ALIASES DE PATHS (MANTIDOS) ===
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    }
  },

  build: {
    // Garante que a saída seja na pasta 'dist', conforme esperado pelo vercel.json
    outDir: 'dist',
    // Mantido para compatibilidade, se necessário
    rollupOptions: {},
  },
});