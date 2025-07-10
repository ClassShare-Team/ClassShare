// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/lectures': 'http://localhost:5000', // ← 이 줄 추가!
    },
  },
});
