import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true // show source file of css on dev tool
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
})
