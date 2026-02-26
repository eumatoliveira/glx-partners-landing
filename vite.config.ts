import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, "/");

          // Page-level code splitting
          if (normalized.includes("/client/src/pages/admin/")) return "admin-pages";
          if (normalized.includes("/client/src/pages/client/")) return "client-pages";
          if (
            normalized.includes("/client/src/pages/Dashboard.tsx") ||
            normalized.includes("/client/src/features/control-tower/")
          ) {
            return "dashboard-control-tower";
          }
          if (
            normalized.includes("/client/src/pages/Home.tsx") ||
            normalized.includes("/client/src/components/Hero.tsx") ||
            normalized.includes("/client/src/components/InsightsSection.tsx")
          ) {
            return "landing-core";
          }

          // Vendor splitting for optimal caching
          if (normalized.includes("framer-motion")) return "vendor-motion";
          if (
            normalized.includes("react-chartjs-2") ||
            normalized.includes("chart.js") ||
            normalized.includes("recharts")
          ) {
            return "vendor-charts";
          }
          if (normalized.includes("@radix-ui")) return "vendor-radix";
          if (normalized.includes("node_modules")) return "vendor";

          return undefined;
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
