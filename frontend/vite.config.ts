import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),

        VitePWA({
            registerType: "autoUpdate",

            manifest: {
                name: "Desapega Campus",
                short_name: "Desapega",
                description:
                    "Marketplace universitário de economia circular para compra, venda e doação de itens.",

                theme_color: "#16794a",
                background_color: "#f7faf8",

                display: "standalone",
                start_url: "/",
                scope: "/",

                icons: [
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                ],
            },

            workbox: {
                globPatterns: [
                    "**/*.{js,css,html,ico,png,svg,webp}",
                ],

                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/images\.unsplash\.com\//,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "unsplash-images",
                            expiration: {
                                maxEntries: 40,
                                maxAgeSeconds: 60 * 60 * 24 * 7,
                            },
                        },
                    },
                ],
            },
        }),
    ],
});