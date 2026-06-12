import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const token = env.VITE_FOOTBALL_DATA_TOKEN || '';

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          headers: token ? { 'X-Auth-Token': token } : {},
        },
      },
    },
  };
});
