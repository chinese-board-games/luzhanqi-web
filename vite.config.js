import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    resolve: {
      alias: {
        contexts: path.resolve(__dirname, './src/contexts'),
        components: path.resolve(__dirname, './src/components'),
        api: path.resolve(__dirname, './src/api'),
        hooks: path.resolve(__dirname, './src/hooks'),
        utils: path.resolve(__dirname, './src/utils'),
        data: path.resolve(__dirname, './src/data'),
      },
    },

    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['pieces/flag.svg'],
        manifest: {
          name: 'Luzhanqi',
          short_name: 'LZQ',
          description: 'A Classic Chinese Boardgame',
          start_url: '.',
          display: 'standalone',
          theme_color: '#000000',
          background_color: '#ffffff',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            {
              src: '/icons/icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
  };
});
