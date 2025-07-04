# Electron-Modern-Template
Modern Electron development framework: supports Vue, React, TS and i18n
现代化Electron开发框架：同时支持Vue、React、TS以及i18n国际化

## 1. Development Mode 开发模式

### 1.1 Install Dependencies 依赖库安装
```bash
npm i
```

### 1.2 Start Main Process: Watch Mode 启动进程代码：watch模式（单独一个进程）
Real-time compilation of file modifications except for renderer pages, but changes require app restart to take effect
实时编译除了renderer页面外的文件修改，但变更需要重启app才能生效

```bash
npm run watch
```

### 1.3 Start Renderer Process: Vue Dev Mode 启动渲染层：vue项目dev模式（单独一个进程）
Vue runs on the interface in dev mode, requiring Electron to be started in development mode (use DEBUG-Electron TS Development to start in dev mode)
dev模式vue运行在接口上，需要以development模式启动electron（使用DEBUG-Electron TS Development即可以dev模式启动）

```bash
npm run dev
```

### 1.4 Start Electron Application 启动electron应用（单独一个进程）
- **Debug Launch**: 
  - Electron TS Development: starts dev mode (uses vite interface) / Electron TS Production (uses packaged code in dist)
  - Debug启动：Electron TS Development启动dev模式(使用vite接口) / Electron TS Production(使用dist内打包代码)
- **Command Launch**: `npm run start`
  - 命令启动: npm run start

## 2. Build 打包

```bash
npm run make
```

## 3. Project Structure 项目结构

```
electron-study/
├── src/
│   ├── main/           # Main process code 主进程代码
│   ├── renderer/       # Renderer process code 渲染进程代码
│   ├── preload/        # Preload scripts 预加载脚本
│   └── config/         # Configuration files 配置文件
├── package.json        # Project dependencies 项目依赖
├── forge.config.ts     # Electron Forge configuration Electron Forge配置
└── vite.config.ts      # Vite configuration Vite配置
```

## 4. Features 特性

- **Modern Development**: Built with TypeScript, Vue 3, and Vite
- **现代化开发**: 基于TypeScript、Vue 3和Vite构建
- **Multi-window Support**: Configurable window management
- **多窗口支持**: 可配置的窗口管理
- **Hot Reload**: Fast development experience with hot module replacement
- **热重载**: 快速开发体验，支持热模块替换
- **Internationalization**: Built-in i18n support
- **国际化**: 内置i18n支持
- **Cross-platform**: Works on Windows, macOS, and Linux
- **跨平台**: 支持Windows、macOS和Linux

## 5. Development Workflow 开发工作流

1. **Install dependencies** 安装依赖 → `npm i`
2. **Start main process** 启动主进程 → `npm run watch`
3. **Start renderer process** 启动渲染进程 → `npm run dev`
4. **Launch Electron app** 启动Electron应用 → Debug with VS Code or `npm run start`
5. **Build for production** 生产环境构建 → `npm run make`
