import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/rondreis/", // GitHub Pages base (matches repo name)

  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "France War Trails — Iepe & Sietze",
        short_name: "War Trails",
        description: "A father-son road trip through France's war memorials, museums and battlefields",
        theme_color: "#D9D2C0",
        background_color: "#D9D2C0",
        display: "standalone",
        orientation: "portrait",
        start_url: "/rondreis/",
        scope: "/rondreis/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
