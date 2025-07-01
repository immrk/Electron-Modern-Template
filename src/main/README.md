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