import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo.png',
        'logo-wide.png',
        'audio-artwork.png',
        'audio-artwork-512.png',
        'audio-artwork-192.png',
        'fonts/UthmanicHafs1Ver18.woff2',
      ],
      manifest: {
        id: '/',
        name: 'يقين — معرفة تُثمر يقيناً',
        short_name: 'يقين',
        description: 'منصة قرآنية إسلامية تجمع القرآن الكريم والتفسير والتلاوات والإذاعات والسيرة والأذكار.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#F3EEE4',
        background_color: '#F3EEE4',
        lang: 'ar',
        dir: 'rtl',
        categories: ['books', 'education', 'lifestyle'],
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/audio-artwork-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        widgets: [
          {
            name: 'يقين — مشغل القرآن الكريم',
            short_name: 'مشغل يقين',
            description: 'التحكم في تلاوة القرآن الكريم ومتابعة الاستماع مباشرة من سطح المكتب أو الشاشة الرئيسية',
            tag: 'yaqeen-audio-widget',
            template: 'widget-template',
            ms_ac_template: 'widget-adaptive-card.json',
            data: '/api/widget-data',
            type: 'application/json',
            screenshots: [
              {
                src: '/audio-artwork-512.png',
                sizes: '512x512',
                label: 'مشغل يقين القرآني',
              },
            ],
            icons: [
              {
                src: '/audio-artwork-192.png',
                sizes: '192x192',
              },
            ],
            auth: false,
            update: 86400,
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//, /\.mp3$/],
        runtimeCaching: [
          {
            urlPattern: /\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              rangeRequests: true,
              cacheableResponse: {
                statuses: [0, 200, 206],
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-api-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setupTests.ts'],
  },
});
