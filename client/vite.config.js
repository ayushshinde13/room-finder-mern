import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to copy build output to server/public so Render/backend continues to work
function copyToServerPlugin() {
  return {
    name: 'copy-to-server',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'dist')
      const destDir = path.resolve(__dirname, '../server/public')
      if (fs.existsSync(path.resolve(__dirname, '../server'))) {
        fs.cpSync(srcDir, destDir, { recursive: true, force: true })
        console.log('✓ Copied build output to ../server/public')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyToServerPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'utils-vendor': ['axios']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})