import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// import svgIconsPlugin from 'vite-plugin-svg-icons';
import path from 'path';
import * as svgIconsPlugin from 'vite-plugin-svg-icons';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';


// https://vite.dev/config/
export default defineConfig({

  
  plugins: [
    vue(),
    vueDevTools(),
    // svgIconsPlugin({
    //   iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    //   symbolId: 'icon-[dir]-[name]',
    // }),
    // svgIconsPlugin.default({
    //   iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    //   symbolId: 'icon-[dir]-[name]',
    // })
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://114.55.234.144:5000',
        changeOrigin: true,
        // Keep the /api prefix in the path
        // rewrite: (path) => path.replace(/^\/api/, ''),
        timeout: 10000,
        headers: {
          Connection: 'keep-alive',
          // 确保 Authorization 头被传递
          'Access-Control-Allow-Headers': 'Authorization, Content-Type'
        },
        ws: true,
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
        }
      }
    }
  }
})

