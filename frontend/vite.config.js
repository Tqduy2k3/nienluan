import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true
      },
      '/public': {
        target: 'http://localhost:3000/',
        changeOrigin: true
      },
      '/chat': {
        target: 'http://localhost:5005/webhooks/rest/webhook',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chat/, '')
      }
    }
  }
});
