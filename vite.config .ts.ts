import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        contato: resolve(__dirname, 'contato.html'),
        termos: resolve(__dirname, 'termos.html'),
        privacy: resolve(__dirname, 'privacy.html')
      }
    }
  }
});