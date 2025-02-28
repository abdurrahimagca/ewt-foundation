import { defineConfig } from "vite";

export default defineConfig({
  root: "./src/frontend", // index.html'nin bulunduğu klasör
  build: {
    outDir: "../../html", // Çıkış klasörü
    assetsDir: "assets", // Assetlerin bulunduğu klasör
    emptyOutDir: true, // Her build öncesinde klasörü temizle
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
