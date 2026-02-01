// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  base: "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    // ✅ NOVO: Proxy para Supabase (evita bloqueio)
    proxy: {
      '/supabase': {
        target: 'https://vluxffbornnlxcenqmzp.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
        secure: true,
      },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    minify: process.env.VITE_MINIFY === "false" ? false : "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // ✅ NOVO: Otimizações de build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});