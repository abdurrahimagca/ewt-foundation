import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  root: "./src/frontend",
  optimizeDeps: {
    include: [
      "@shopware-ag/meteor-admin-sdk",
      "@shopware-ag/meteor-component-library",
    ],
  },
  appType: "custom",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/frontend/src"),
    },
  },
  build: {
    outDir: "../../dist/frontend",
    assetsDir: "assets",
    minify: "false",
    sourcemap: true,

    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  base: "/public/frontend/",
});
