/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 窗口管理 API 类型定义
interface WindowManagerAPI {
  createWindow: (windowName: string, options?: any) => Promise<{ success: boolean; data?: any; error?: string }>
  showWindow: (windowName: string) => Promise<{ success: boolean; error?: string }>
  hideWindow: (windowName: string) => Promise<{ success: boolean; error?: string }>
  closeWindow: (windowName: string) => Promise<{ success: boolean; error?: string }>
  focusWindow: (windowName: string) => Promise<{ success: boolean; error?: string }>
  minimizeWindow: (windowName: string) => Promise<{ success: boolean; error?: string }>
  maximizeWindow: (windowName: string) => Promise<{ success: boolean; error?: string }>
  restoreWindow: (windowName: string) => Promise<{ success: boolean; error?: string }>
  hasWindow: (windowName: string) => Promise<{ success: boolean; data?: boolean; error?: string }>
  isWindowVisible: (windowName: string) => Promise<{ success: boolean; data?: boolean; error?: string }>
  getAllWindows: () => Promise<{ success: boolean; data?: any[]; error?: string }>
  getVisibleWindowCount: () => Promise<{ success: boolean; data?: number; error?: string }>
  onWindowStateChanged: (callback: (data: any) => void) => void
  removeWindowStateListener: () => void
}

// 版本信息 API 类型定义
interface VersionsAPI {
  node: () => string
  chrome: () => string
  electron: () => string
  ping: () => Promise<string>
}

// 扩展 Window 接口
declare global {
  interface Window {
    windowManager: WindowManagerAPI
    versions: VersionsAPI
  }
}

