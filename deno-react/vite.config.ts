import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import deno from '@deno/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), deno()],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
