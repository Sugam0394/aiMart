import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Local development mein Google Login error fix karne ke liye
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // apna backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
}); 

