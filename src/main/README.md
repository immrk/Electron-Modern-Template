# 菜单系统说明

这个菜单系统被拆解成了多个文件，便于管理和维护。

## 文件结构

- `main.ts` - 主进程文件，负责创建窗口和初始化菜单
- `menu.ts` - 菜单逻辑文件，负责创建和应用菜单
- `menuConfig.ts` - 菜单配置文件，定义菜单结构和选项

## 功能特性

### 1. 主菜单栏
- **文件菜单**: 新建窗口、关闭/退出
- **编辑菜单**: 撤销、重做、剪切、复制、粘贴等
- **视图菜单**: 重新加载、开发者工具、缩放、全屏等
- **窗口菜单**: 最小化、关闭、前置等
- **Help菜单**: 开发者工具、关于

### 2. 右键上下文菜单
- 复制、粘贴
- 开发者工具

### 3. 平台适配
- macOS: 包含应用菜单、语音功能等
- Windows/Linux: 适配相应的菜单结构

## 使用方法

### 添加新的菜单项

1. 在 `menuConfig.ts` 中定义新的菜单配置：

```typescript
export const customMenuConfig: MenuConfig = {
  label: '自定义',
  submenu: [
    {
      label: '新功能',
      click: () => {
        console.log('执行新功能')
      }
    }
  ]
}
```

2. 在 `getAllMenuConfigs()` 函数中添加新配置：

```typescript
export const getAllMenuConfigs = (): MenuConfig[] => {
  return [
    fileMenuConfig,
    editMenuConfig,
    viewMenuConfig,
    windowMenuConfig,
    helpMenuConfig,
    customMenuConfig  // 添加新菜单
  ]
}
```

### 修改现有菜单

直接编辑 `menuConfig.ts` 中对应的菜单配置即可。

### 快捷键

- 开发者工具: `Cmd+Option+I` (macOS) / `Ctrl+Shift+I` (Windows/Linux)
- 新建窗口: `CmdOrCtrl+N`

## 扩展功能

### 添加右键菜单项

在 `menu.ts` 的 `createContextMenu()` 函数中添加新的菜单项：

```typescript
export const createContextMenu = (): Menu => {
  const contextMenu = Menu.buildFromTemplate([
    // 现有菜单项...
    {
      label: '新功能',
      click: () => {
        console.log('右键菜单新功能')
      }
    }
  ])
  
  return contextMenu
}
```

### 动态菜单

可以根据应用状态动态显示/隐藏菜单项：

```typescript
export const getDynamicMenuConfig = (isLoggedIn: boolean): MenuConfig => {
  return {
    label: '用户',
    submenu: [
      ...(isLoggedIn ? [
        { label: '个人资料', click: () => {} },
        { label: '退出登录', click: () => {} }
      ] : [
        { label: '登录', click: () => {} }
      ])
    ]
  }
}
```

# 多窗口支持实现

本项目实现了完整的 Electron 多窗口支持，包括窗口管理、IPC 通信和用户界面。

## 架构概览

### 1. 窗口管理器 (WindowManager)

位置：`src/main/windowManager.ts`

核心功能：
- 窗口创建和管理
- 窗口状态跟踪
- 窗口配置管理
- 开发和生产环境的不同加载策略

主要方法：
- `createWindow(windowName, options)` - 创建窗口
- `showWindow(windowName)` - 显示窗口
- `hideWindow(windowName)` - 隐藏窗口
- `closeWindow(windowName)` - 关闭窗口
- `focusWindow(windowName)` - 聚焦窗口
- `minimizeWindow(windowName)` - 最小化窗口
- `maximizeWindow(windowName)` - 最大化窗口
- `restoreWindow(windowName)` - 恢复窗口
- `hasWindow(windowName)` - 检查窗口是否存在
- `isWindowVisible(windowName)` - 检查窗口是否可见
- `getAllWindows()` - 获取所有窗口
- `getVisibleWindowCount()` - 获取可见窗口数量

### 2. 窗口配置 (WindowConfig)

位置：`src/config/windowConfig.ts`

配置内容：
- 窗口名称常量
- 窗口尺寸和属性配置
- 支持动态配置扩展

当前配置的窗口：
- `main` - 主窗口 (800x600)
- `setting` - 设置窗口 (400x300)

### 3. IPC 通信 (IPC Handlers)

位置：`src/main/ipcHandlers.ts`

功能：
- 处理渲染进程的窗口管理请求
- 提供安全的窗口操作接口
- 错误处理和状态返回

支持的 IPC 通道：
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

位置：`src/preload/preload.ts`

功能：
- 暴露安全的窗口管理 API 到渲染进程
- 提供类型安全的接口
- 处理 IPC 通信细节

暴露的 API：
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

## 使用方法

### 1. 在渲染进程中创建窗口

```typescript
// 创建主窗口
const result = await window.windowManager.createWindow('main')
if (result.success) {
  console.log('窗口创建成功')
} else {
  console.error('窗口创建失败:', result.error)
}

// 创建设置窗口
const result = await window.windowManager.createWindow('setting')
```

### 2. 窗口操作

```typescript
// 显示窗口
await window.windowManager.showWindow('setting')

// 隐藏窗口
await window.windowManager.hideWindow('setting')

// 关闭窗口
await window.windowManager.closeWindow('setting')

// 聚焦窗口
await window.windowManager.focusWindow('setting')

// 最小化窗口
await window.windowManager.minimizeWindow('setting')

// 最大化窗口
await window.windowManager.maximizeWindow('setting')
```

### 3. 获取窗口信息

```typescript
// 检查窗口是否存在
const hasWindow = await window.windowManager.hasWindow('setting')

// 检查窗口是否可见
const isVisible = await window.windowManager.isWindowVisible('setting')

// 获取所有窗口
const allWindows = await window.windowManager.getAllWindows()

// 获取可见窗口数量
const visibleCount = await window.windowManager.getVisibleWindowCount()
```

### 4. 监听窗口状态变化

```typescript
// 监听窗口状态变化
window.windowManager.onWindowStateChanged((event, data) => {
  console.log('窗口状态变化:', data)
})

// 移除监听器
window.windowManager.removeWindowStateListener()
```

## 开发环境配置

### 1. 多端口开发服务器

在开发环境中，不同窗口使用不同的端口：

- 主窗口：`http://localhost:11069`
- 设置窗口：`http://localhost:11070`

### 2. 生产环境

在生产环境中，窗口加载对应的 HTML 文件：

- 主窗口：`src/renderer/windows/main/index.html`
- 设置窗口：`src/renderer/windows/setting/index.html`

## 扩展新窗口

### 1. 添加窗口配置

在 `src/config/windowConfig.ts` 中添加新窗口配置：

```typescript
export const WINDOW_NAMES = {
  main: 'main',
  setting: 'setting',
  newWindow: 'newWindow', // 新增
}

export const WINDOW_LIST: { [key: string]: any } = {
  [WINDOW_NAMES.main]: {
    width: 800,
    height: 600,
    title: '主窗口',
  },
  [WINDOW_NAMES.setting]: {
    width: 400,
    height: 300,
    title: '设置窗口',
  },
  [WINDOW_NAMES.newWindow]: { // 新增
    width: 600,
    height: 400,
    title: '新窗口',
  }
}
```

### 2. 创建窗口文件

在 `src/renderer/windows/` 下创建新窗口的目录和文件：

```
src/renderer/windows/newWindow/
├── App.vue
├── index.html
└── main.ts
```

### 3. 在开发环境中添加端口配置

在 `src/main/windowManager.ts` 的 `loadWindowContent` 方法中添加端口配置：

```typescript
const ports: { [key: string]: number } = {
  [WINDOW_NAMES.main]: 11069,
  [WINDOW_NAMES.setting]: 11070,
  [WINDOW_NAMES.newWindow]: 11071, // 新增
}
```

## 注意事项

1. **窗口名称唯一性**：每个窗口必须有唯一的名称
2. **错误处理**：所有窗口操作都应该包含适当的错误处理
3. **内存管理**：关闭窗口时会自动清理相关资源
4. **状态同步**：窗口状态变化会通过 IPC 通知所有相关窗口
5. **安全性**：所有窗口操作都通过预加载脚本进行，确保安全性

## 故障排除

### 常见问题

1. **窗口创建失败**
   - 检查窗口配置是否存在
   - 确认窗口名称是否正确
   - 查看控制台错误信息

2. **IPC 通信失败**
   - 确认预加载脚本正确加载
   - 检查 IPC 处理器是否正确设置
   - 验证通道名称是否正确

3. **窗口不显示**
   - 检查窗口是否被隐藏
   - 确认窗口位置是否在屏幕外
   - 验证窗口配置是否正确

### 调试技巧

1. 使用开发者工具查看控制台输出
2. 检查 IPC 通信日志
3. 验证窗口管理器状态
4. 确认预加载脚本 API 可用性 