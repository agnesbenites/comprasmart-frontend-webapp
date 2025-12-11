// vite.config.js - VERIFIQUE SE ESTÁ ASSIM:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    }
  },
  build: {
    outDir: 'dist',
    minify: process.env.VITE_MINIFY !== 'false' ? 'terser' : false,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});