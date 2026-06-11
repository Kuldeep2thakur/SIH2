import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_BASE_URL || 'https://symbiomedbackend.onrender.com';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/fhir': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: target,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
