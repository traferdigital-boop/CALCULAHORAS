import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        sobre: 'sobre.html',
        contato: 'contato.html',
        termos: 'termos.html',
        privacy: 'privacy.html'
      }
    }
  }
});