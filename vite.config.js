import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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
      },
    },

    plugins: [react()],
  };
});
