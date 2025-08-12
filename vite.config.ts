import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Otimizações de build para performance
    minify: mode === 'production' ? 'terser' : 'esbuild', // Usar terser só em produção
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs apenas em produção
          drop_debugger: true,
          pure_funcs: ['console.log'], // Remove console.log especificamente
        },
      },
    }),
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar dependências grandes em chunks separados para melhor caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast', '@radix-ui/react-alert-dialog'],
          router: ['react-router-dom'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Otimizar tamanho do chunk
    chunkSizeWarningLimit: 1000,
    // Comprimir assets
    assetsInlineLimit: 4096,
  },
  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@lovable/tagger'],
  },
}));
