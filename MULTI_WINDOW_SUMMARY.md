# 多窗口支持实现总结

## 🎯 实现目标

为 Electron 应用添加完整的多窗口支持，包括：
- 窗口管理器
- IPC 通信
- 用户界面
- 开发环境配置

## 📁 文件结构

```
src/
├── config/
│   └── windowConfig.ts          # 窗口配置
├── main/
│   ├── main.ts                  # 主进程入口
│   ├── windowManager.ts         # 窗口管理器
│   ├── ipcHandlers.ts           # IPC 处理器
│   ├── menu.ts                  # 菜单管理
│   └── README.md               # 详细文档
├── preload/
│   └── preload.ts              # 预加载脚本
└── renderer/
    └── windows/
        ├── main/
        │   ├── App.vue         # 主窗口界面
        │   ├── index.html
        │   └── main.ts
        └── setting/
            ├── App.vue         # 设置窗口界面
            ├── index.html
            └── main.ts
```

## 🚀 核心功能

### 1. 窗口管理器 (WindowManager)

**位置**: `src/main/windowManager.ts`

**主要功能**:
- ✅ 窗口创建和管理
- ✅ 窗口状态跟踪
- ✅ 开发/生产环境适配
- ✅ 错误处理和日志记录

**关键方法**:
```typescript
createWindow(windowName, options)     // 创建窗口
showWindow(windowName)                // 显示窗口
hideWindow(windowName)                // 隐藏窗口
closeWindow(windowName)               // 关闭窗口
focusWindow(windowName)               // 聚焦窗口
minimizeWindow(windowName)            // 最小化窗口
maximizeWindow(windowName)            // 最大化窗口
restoreWindow(windowName)             // 恢复窗口
hasWindow(windowName)                 // 检查窗口存在
isWindowVisible(windowName)           // 检查窗口可见性
getAllWindows()                       // 获取所有窗口
getVisibleWindowCount()               // 获取可见窗口数量
```

### 2. 窗口配置 (WindowConfig)

**位置**: `src/config/windowConfig.ts`

**配置内容**:
```typescript
export const WINDOW_NAMES = {
  main: 'main',
  setting: 'setting',
}

export const WINDOW_LIST = {
  main: {
    width: 800,
    height: 600,
    title: '主窗口',
  },
  setting: {
    width: 400,
    height: 300,
    title: '设置窗口',
  }
}
```

### 3. IPC 通信 (IPC Handlers)

**位置**: `src/main/ipcHandlers.ts`

**支持的通道**:
- `window:create` - 创建窗口
- `window:show` - 显示窗口
- `window:hide` - 隐藏窗口
- `window:close` - 关闭窗口
- `window:focus` - 聚焦窗口
- `window:minimize` - 最小化窗口
- `window:maximize` - 最大化窗口
- `window:restore` - 恢复窗口
- `window:has` - 检查窗口存在
- `window:isVisible` - 检查窗口可见性
- `window:getAll` - 获取所有窗口
- `window:getVisibleCount` - 获取可见窗口数量

### 4. 预加载脚本 (Preload)

**位置**: `src/preload/preload.ts`

**暴露的 API**:
```typescript
window.windowManager = {
  createWindow,
  showWindow,
  hideWindow,
  closeWindow,
  focusWindow,
  minimizeWindow,
  maximizeWindow,
  restoreWindow,
  hasWindow,
  isWindowVisible,
  getAllWindows,
  getVisibleWindowCount,
  onWindowStateChanged,
  removeWindowStateListener
}
```

## 🎨 用户界面

### 主窗口功能
- ✅ 首页展示
- ✅ 计数器演示
- ✅ 系统信息
- ✅ **窗口管理** (新增)

### 设置窗口功能
- ✅ 窗口信息显示
- ✅ 窗口控制按钮
- ✅ 窗口列表展示
- ✅ 实时状态更新

## ⚙️ 开发环境配置

### 1. 多端口开发服务器

**package.json 脚本**:
```json
{
  "dev:main": "vite --port 11069",
  "dev:setting": "vite --port 11070",
  "dev:multi": "concurrently \"npm run dev:main\" \"npm run dev:setting\""
}
```

**端口配置**:
- 主窗口: `http://localhost:11069`
- 设置窗口: `http://localhost:11070`

### 2. Vite 配置

**vite.config.ts**:
- 支持多入口构建
- 环境变量注入
- 端口配置

## 📋 使用方法

### 1. 启动开发环境

```bash
# 安装依赖
npm install

# 启动多窗口开发服务器
npm run dev:multi

# 编译 TypeScript (新终端)
npm run watch

# 启动 Electron 应用 (新终端)
npm start
```

### 2. 在渲染进程中使用

```typescript
// 创建窗口
const result = await window.windowManager.createWindow('setting')

// 窗口操作
await window.windowManager.showWindow('setting')
await window.windowManager.hideWindow('setting')
await window.windowManager.closeWindow('setting')

// 获取窗口信息
const allWindows = await window.windowManager.getAllWindows()
const visibleCount = await window.windowManager.getVisibleWindowCount()
```

### 3. 菜单操作

- `Cmd/Ctrl + N` - 创建新主窗口
- `Cmd/Ctrl + ,` - 打开设置窗口

## 🔧 扩展新窗口

### 1. 添加窗口配置

```typescript
// src/config/windowConfig.ts
export const WINDOW_NAMES = {
  main: 'main',
  setting: 'setting',
  newWindow: 'newWindow', // 新增
}

export const WINDOW_LIST = {
  // ... 现有配置
  [WINDOW_NAMES.newWindow]: {
    width: 600,
    height: 400,
    title: '新窗口',
  }
}
```

### 2. 创建窗口文件

```
src/renderer/windows/newWindow/
├── App.vue
├── index.html
└── main.ts
```

### 3. 更新开发配置

```typescript
// src/main/windowManager.ts
const ports: { [key: string]: number } = {
  [WINDOW_NAMES.main]: 11069,
  [WINDOW_NAMES.setting]: 11070,
  [WINDOW_NAMES.newWindow]: 11071, // 新增
}
```

## 🧪 测试

### 运行测试

```bash
npm run test:multi-window
```

### 手动测试

1. 启动应用
2. 点击菜单创建新窗口
3. 测试窗口控制功能
4. 验证窗口状态同步

## 📝 注意事项

1. **窗口名称唯一性**: 每个窗口必须有唯一的名称
2. **错误处理**: 所有窗口操作都包含错误处理
3. **内存管理**: 关闭窗口时自动清理资源
4. **状态同步**: 窗口状态变化通过 IPC 通知
5. **安全性**: 所有操作通过预加载脚本进行

## 🎉 完成状态

- ✅ 窗口管理器实现
- ✅ IPC 通信实现
- ✅ 用户界面实现
- ✅ 开发环境配置
- ✅ 文档和测试
- ✅ 错误处理
- ✅ 类型安全

## 🚀 下一步

1. 添加窗口间通信功能
2. 实现窗口拖拽和调整大小
3. 添加窗口主题支持
4. 实现窗口布局保存/恢复
5. 添加更多窗口类型支持 