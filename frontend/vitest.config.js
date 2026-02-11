import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { transformWithEsbuild } from 'vite';

// Custom plugin to handle JSX in .js files (Next.js convention)
function jsxInJs() {
  return {
    name: 'jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.js') || id.includes('node_modules')) return null;
      return transformWithEsbuild(code, id.replace(/\.js$/, '.jsx'), {
        jsx: 'automatic',
      });
    },
  };
}

export default defineConfig({
  plugins: [jsxInJs(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
