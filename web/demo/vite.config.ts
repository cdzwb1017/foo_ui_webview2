import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  // ⚠️ 易出错点 23: base 必须为相对路径
  base: './',

  build: {
    outDir: 'dist',

    // ⚠️ 易出错点 24: 资源文件名不要包含 hash，便于调试
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },

  server: {
    // 开发时的端口
    port: 5173,

    // ⚠️ 易出错点 25: 需要配置 HMR，否则热更新可能失败
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
});
