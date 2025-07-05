import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async () => {
  /* 1. 当前窗口名称（默认为 main） */
  const currentWindow = process.env.WINDOW_NAME || 'main';

  /* 2. 读取 .cache/windowConfig.mjs */
  const windowConfigPath = path.resolve(__dirname, '.cache/windowConfig.mjs');
  const { WINDOW_LIST } = await import(`file://${windowConfigPath}`);
  const windowConfig = WINDOW_LIST[currentWindow];
  if (!windowConfig) {
    throw new Error(`未找到窗口配置：${currentWindow}`);
  }

  /* 3. 窗口根目录（含 index.html） */
  const windowRoot = path.resolve(__dirname, `src/renderer/windows/${currentWindow}`);

  /* 4. 打包输出路径 */
  const outDir = path.resolve(__dirname, `dist/renderer/${currentWindow}`);

  return {
    root: windowRoot,
    base: './',
    plugins: [
      vue(),
      AutoImport({ resolvers: [ElementPlusResolver()], dts: false }),
      Components({ resolvers: [ElementPlusResolver()], dts: false }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer'),
        '~': path.resolve(__dirname, 'src/renderer'),
      },
    },
    server: {
      port: windowConfig.devPort,
      strictPort: true,
      host: 'localhost',
      hmr: { port: windowConfig.devPort },
    },
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,
    },
    define: {
      __WINDOW_NAME__: JSON.stringify(currentWindow),
    },
  };
});
