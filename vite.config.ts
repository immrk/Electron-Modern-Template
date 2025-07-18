import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { vitePluginFakeServer } from 'vite-plugin-fake-server'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function rendererConfig() {
  // 渲染进程vite配置
  /* 1. 当前窗口名称（默认为 main） */
  const currentWindow = process.env.WINDOW_NAME || "main";

  /* 2. 读取 .cache/windowConfig.mjs */
  const windowConfigPath = path.resolve(__dirname, ".cache/windowConfig.mjs");
  const { WINDOW_LIST } = await import(`file://${windowConfigPath}`);
  const windowConfig = WINDOW_LIST[currentWindow];
  if (!windowConfig) {
    throw new Error(`未找到窗口配置：${currentWindow}`);
  }

  /* 3. 窗口根目录（含 index.html） */
  const windowRoot = path.resolve(
    __dirname,
    `src/renderer/window/${currentWindow}`
  );

  /* 4. 打包输出路径 */
  const outDir = path.resolve(
    __dirname,
    `dist/renderer/window/${currentWindow}`
  );

  return {
    root: windowRoot,
    base: "./",
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          ElementPlusResolver({ importStyle: "sass" }),
          IconsResolver({
            prefix: "Icon",
          }),
        ],
        dts: "types/auto-imports.d.ts",
      }),
      Components({
        resolvers: [
          ElementPlusResolver({ importStyle: "sass" }),
          IconsResolver({
            enabledCollections: ["ep", "mdi"],
          }),
        ],
        dts: "types/components.d.ts",
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 引入element-plus自定义覆盖样式以及暗色模式样式
          additionalData: `@use "~/styles/element/index.scss" as *; 
              @use "element-plus/theme-chalk/dark/css-vars.css" as *; 
              @use "~/styles/element/dark-vars.css" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/renderer"),
        "~": path.resolve(__dirname, "src/renderer"),
      },
    },
    server: {
      port: windowConfig.devPort,
      strictPort: true,
      host: "localhost",
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
}

async function mockConfig() {
  // mock 数据vite配置
  console.log('Mock config - current dir:', __dirname);
  
  return {
    root: __dirname, // 使用项目根目录作为mock服务器的根目录
    plugins: [
      vitePluginFakeServer({
        include: ['mock'], // 使用相对路径
        infixName: false,
        enableProd: false,
        logger: true, // 启用日志
      }),
    ],
    server: {
      port: 3000, // mock服务器端口
      strictPort: true,
      host: "localhost",
      cors: true,
    },
  }
}

export default defineConfig(async ({mode}) => {
  if(mode === "renderer") {
    // 渲染进程
    return rendererConfig();
  } else if (mode === "mock") {
    // mock 数据
    return mockConfig();
  } else {
    // 默认渲染进程
    return rendererConfig();
  }
});
