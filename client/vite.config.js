import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0' to listen on all addresses
    proxy: {
      "/api": {
        target: "http://192.168.1.214:5000",
        changeOrigin: true,
      },
    },
  },
});
