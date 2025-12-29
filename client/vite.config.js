import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'
// https://vite.dev/config/
dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [react()],
  server: {

    host: true, // or use '0.0.0.0'

    port: 5173, // (optional) specify a port,
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://192.168.1.214:5000/',
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path to remove '/api' prefix
      },

    }

  }
})
