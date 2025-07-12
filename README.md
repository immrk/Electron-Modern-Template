# Electron-Modern-Template

<div align="center">

![Electron](https://img.shields.io/badge/Electron-36.5.0-47848F?style=for-the-badge&logo=electron)
![Vue](https://img.shields.io/badge/Vue-3.5.17-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)

**现代化Electron开发框架：支持Vue3、TypeScript、多窗口管理、国际化、主题切换等特性**

[English](./README_EN.md) | 中文

</div>

## ✨ 核心特性

### 🚀 现代化开发体验

- **Vue3 + TypeScript + Vite** 技术栈，提供热重载、类型安全等现代化开发体验
- **自动按需导入** UI组件和图标，无需手动导入，支持自定义主题
- **多窗口开发环境** 支持同时开发多个窗口，每个窗口独立热重载
- **Mock数据服务** 内置开发环境下的模拟数据服务

### 🌍 国际化支持

- **完整i18n解决方案** 主进程、渲染进程、UI组件均已集成国际化
- **多语言切换** 支持中文、英文，可扩展更多语言
- **系统语言跟随** 自动检测系统语言并应用
- **实时语言切换** 无需重启应用即可切换语言

### 🎨 主题系统

- **明暗主题切换** 支持明亮、暗黑、跟随系统三种模式
- **Element Plus集成** 完美适配Element Plus组件库主题
- **自定义主题色** 支持自定义主色调和功能色
- **响应式主题** 实时响应系统主题变化

### 🪟 多窗口管理

- **统一窗口管理器** 提供完整的窗口生命周期管理
- **窗口状态同步** 实时同步窗口状态，支持窗口间通信
- **灵活窗口配置** 支持自定义窗口大小、样式、行为
- **跨平台兼容** 完美适配Windows、macOS、Linux

### 🔧 开发工具

- **TypeScript支持** 完整的类型定义和类型安全
- **ESLint配置** 代码质量检查和格式化
- **热重载开发** 开发环境下的快速迭代
- **调试友好** 支持VSCode调试和开发者工具

## 📦 技术栈


| 技术           | 版本   | 说明                     |
| -------------- | ------ | ------------------------ |
| Electron       | 36.5.0 | 跨平台桌面应用框架       |
| Vue            | 3.5.17 | 渐进式JavaScript框架     |
| TypeScript     | 5.0+   | 类型安全的JavaScript超集 |
| Vite           | 6.3.5  | 下一代前端构建工具       |
| Element Plus   | 2.10.3 | Vue3组件库               |
| Vue Router     | 4.5.1  | Vue官方路由管理器        |
| Vue I18n       | 11.1.9 | Vue国际化插件            |
| i18next        | 25.3.1 | 国际化框架               |
| Electron Forge | 7.8.1  | Electron应用打包工具     |

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 创建环境变量文件.env

复制.env.example文件并重命名为.env

```
VITE_MOCK=true
VITE_API_BASE_URL=http://localhost:3000
```

### 开发模式

```bash
# 启动开发环境（所有窗口与MOCK服务-需要在.env中配置开启）
npm run dev

# 仅启动特定窗口
npm run dev -- --only=main,setting

# 启动Mock服务
将.env文件中设置 VITE_MOCK=true
npm run dev
```

### 构建应用

```bash
# 单独构建渲染进程
npm run build:renderer

# 单独构建主进程
npm run build:main

# 一键构建并打包（默认构建当前运行系统对应的软件与安装包）
npm run make
```

### 运行应用

```bash
# 运行指令
npm run start

# 以VSCODE DEBUG模式运行
VSCODE->DEBUG功能->选择Electron TS Development / Electron TS Production 两种模式
两种DEBUG模式分别对应渲染层的dev(接口运行模式)和生产构建模式
```

## 📁 项目结构

```
electron-modern-template/
├── src/
│   ├── main/                 # 主进程代码
│   │   ├── i18n/            # 主进程国际化
│   │   ├── ipc/             # IPC通信处理
│   │   ├── preload/         # 预加载脚本
│   │   ├── windowManager.ts # 窗口管理器
│   │   └── main.ts          # 主进程入口
│   ├── renderer/            # 渲染进程代码
│   │   ├── window/          # 窗口页面
│   │   │   ├── main/        # 主窗口
│   │   │   └── setting/     # 设置窗口
│   │   ├── composables/     # Vue组合式函数
│   │   ├── i18n/            # 渲染进程国际化
│   │   └── styles/          # 样式文件
│   ├── config/              # 配置文件
│   └── utils/               # 工具函数
├── scripts/                 # 构建脚本
├── mock/                    # Mock数据
├── dist/                    # 构建输出
└── out/                     # 打包输出
```

## 🎯 核心功能

### 多窗口管理

项目采用统一窗口管理器，支持动态创建、管理多个窗口：

```typescript
// 创建窗口
windowManager.createWindow('main')
windowManager.createWindow('setting')

// 窗口操作
windowManager.showWindow('main')
windowManager.hideWindow('setting')
windowManager.closeWindow('setting')
```

### 国际化系统

完整的国际化解决方案，支持主进程和渲染进程：

```typescript
// 主进程国际化
import { t } from './i18n/index.js'
console.log(t('menu.file'))

// 渲染进程国际化
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
console.log(t('main.home.title'))
```

### 主题管理

响应式主题系统，支持明暗主题切换：

```typescript
// 使用主题管理
import { useTheme } from '@/composables/useThemeVue'
const { themeColor, changeTheme } = useTheme()

// 切换主题
changeTheme('dark')
```

### 语言管理

智能语言管理系统，支持系统语言跟随：

```typescript
// 使用语言管理
import { useLanguage } from '@/composables/useLanguageVue'
const { currentLanguage, changeLanguage } = useLanguage()

// 切换语言
changeLanguage('en-US')
```

## 🔧 配置说明

### 窗口配置

在 `src/config/windowConfig.ts` 中配置窗口属性：

```typescript
export const WINDOW_LIST = {
  main: {
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',
    devPort: 11069,
  },
  setting: {
    width: 500,
    height: 400,
    titleBarStyle: 'hidden',
    devPort: 11070,
  }
}
```

### 国际化配置

在 `src/config/i18nConfig.ts` 中配置支持的语言：

```typescript
export const i18nConfig = {
  locales: ['system', 'en-US', 'zh-CN'],
  defaultLocale: 'system',
}
```

### 主题配置

在 `src/renderer/styles/element/index.scss` 中自定义主题色：

```scss
@forward "element-plus/theme-chalk/src/common/var.scss" with (
  $colors: (
    "primary": (
      "base": #6a7ade,
      "light-3": #6e53a7,
    ),
  )
);
```

## 🛠️ 开发指南

### 添加新窗口

1. 在 `src/config/windowConfig.ts` 中添加窗口配置
2. 在 `src/renderer/window/` 下创建窗口目录
3. 在 `src/main/menu.ts` 中添加菜单项

### 添加新语言

1. 在 `src/config/i18nConfig.ts` 中添加语言代码
2. 在 `src/main/i18n/locales/` 和 `src/renderer/i18n/locales/` 中添加语言文件
3. 更新语言选择器组件

### 自定义主题

1. 修改 `src/renderer/styles/element/index.scss` 中的颜色变量
2. 在 `src/renderer/styles/element/dark-vars.css` 中配置暗色主题
3. 在设置页面中添加主题选择器

## 📦 打包部署

### 开发环境打包

```bash
# 单独构建单一资源
npm run build:main（会清空dist目录，包括renderer构建内容，故执行后需要重新执行npm run build:renderer或运行dev端口模式）
npm run build:renderer

# 运行渲染层生产版本
npm run start
```

### 生产环境打包

```bash
# 完整打包（包含安装包）
npm run make
```

打包后的文件位于 `out/` 目录下。

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 配置的代码规范
- 添加适当的注释和文档
- 确保所有测试通过

## 📄 许可证

本项目采用 [ISC License](LICENSE) 许可证。

## 🙏 致谢

- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue3组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

## 📞 联系我们

- 作者：Keyajian
- 邮箱：keyajian@gmail.com
- 项目地址：https://github.com/immrk/electron-modern-template
