import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { manualChunks } from "./tools/manual-chunks.mjs";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  server: {
    host: "::",
    port: 8112,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
}));
