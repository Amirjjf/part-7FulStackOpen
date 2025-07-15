import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // Enable Vitest globals
    environment: 'jsdom',    // Simulate browser environment
    mockReset: true,         // Reset mocks before each test
    setupFiles: './vitest.setup.js' // Optional setup file
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
});
