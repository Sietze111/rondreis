import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/yevheniiainlondon/", // 👈 ADD THIS

  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Yevheniia's London Passport",
        short_name: "London Passport",
        description: "A Self-Guided Walking & Wonder Map · Hidden gems in Bern",
        theme_color: "#F3ECD9",
        background_color: "#F3ECD9",
        display: "standalone",
        orientation: "portrait",
        start_url: "/yevheniiainlondon/",
        scope: "/yevheniiainlondon/",
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
