import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 1000,  // Poll every second
      binaryInterval: 3000  // Important for WSL
    },
    hmr: {
      clientPort: 5173  // Important when behind reverse proxy
    }
  }
});
