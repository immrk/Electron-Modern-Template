import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: './src/renderer',
  plugins: [vue()],
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/renderer/windows/main/index.html'),
        setting: path.resolve(__dirname, 'src/renderer/windows/setting/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '~': path.resolve(__dirname, 'src/renderer'),
    },
  },
  server: {
    port: 11069,
    strictPort: true,
  },
  // 多窗口开发配置
  define: {
    __WINDOW_NAME__: JSON.stringify(process.env.WINDOW_NAME || 'main'),
  },
})

// 为设置窗口创建单独的配置
export const settingConfig = defineConfig({
  root: './src/renderer',
  plugins: [vue()],
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: false, // 不清理输出目录，避免覆盖主窗口文件
    rollupOptions: {
      input: {
        setting: path.resolve(__dirname, 'src/renderer/windows/setting/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '~': path.resolve(__dirname, 'src/renderer'),
    },
  },
  server: {
    port: 11070,
    strictPort: true,
  },
  define: {
    __WINDOW_NAME__: JSON.stringify('setting'),
  },
})
