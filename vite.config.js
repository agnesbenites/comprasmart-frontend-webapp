import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    
    // Tenta usar terser, se não conseguir, desativa
    minify: process.env.VITE_MINIFY !== 'false' ? 'terser' : false,
    
    sourcemap: false,
    
    // Configuração opcional do terser
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true
      }
    }
  }
});