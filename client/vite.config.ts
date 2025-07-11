// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        {
          name: 'copy-redirects',
          writeBundle() {
            fs.copyFileSync(
              path.resolve(__dirname, 'public/_redirects'),
              path.resolve(__dirname, 'dis/_redirects')
            );
          },
        },
      ],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
