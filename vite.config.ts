
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './',  <-- Kita hapus atau comment ini karena Vercel lebih suka default '/'
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
