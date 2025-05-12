import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 9999,
    proxy: {
      "/end": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});
