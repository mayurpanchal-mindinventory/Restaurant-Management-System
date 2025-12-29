import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0' to listen on all addresses
  },
});
