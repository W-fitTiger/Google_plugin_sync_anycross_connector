import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    cors: {
      credentials: true
    },
    host: 'localhost',
    port: 8080,
    proxy:{
      "/online/":{
        target:"https://anycross.feishu.cn",
        changeOrigin: true,
        followRedirects: true,// 重点在这里
        rewrite: (path) => path.replace(/^\/online/, ''),
      },
      "/boe/":{
        target:"https://anycross.feishu-boe.cn",
        changeOrigin: true,
        followRedirects: true,// 重点在这里
        rewrite: (path) => path.replace(/^\/boe/, ''),
      },
     
    },
    hmr:{
      overlay:false
    }
  },
  base:"./"

})
