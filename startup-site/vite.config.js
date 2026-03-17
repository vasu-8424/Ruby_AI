import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      webp: {
        quality: 80,
      },
      avif: {
        quality: 80,
      },
    }),
  ],
  build: {
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap']
        }
      }
    }
  }
});
