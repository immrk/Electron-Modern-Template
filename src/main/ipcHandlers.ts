import { ipcMain } from 'electron'
import { windowManager } from './windowManager.js'
import { WINDOW_NAMES } from '../config/windowConfig.js'

// 设置 IPC 处理器
export const setupIpcHandlers = (): void => {
  // 创建窗口
  ipcMain.handle('window:create', async (event, windowName: string, options?: any) => {
    try {
      const instance = windowManager.createWindow(windowName, options)
      if (instance) {
        // 只返回可序列化的数据，不包含 BrowserWindow 实例
        const serializableInstance = {
          name: instance.name,
          isVisible: instance.isVisible
        }
        return { success: true, data: serializableInstance }
      } else {
        return { success: false, error: '窗口创建失败' }
      }
    } catch (error) {
      console.error('创建窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 显示窗口
  ipcMain.handle('window:show', async (event, windowName: string) => {
    try {
      windowManager.showWindow(windowName)
      return { success: true }
    } catch (error) {
      console.error('显示窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 隐藏窗口
  ipcMain.handle('window:hide', async (event, windowName: string) => {
    try {
      windowManager.hideWindow(windowName)
      return { success: true }
    } catch (error) {
      console.error('隐藏窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 关闭窗口
  ipcMain.handle('window:close', async (event, windowName: string) => {
    try {
      windowManager.closeWindow(windowName)
      return { success: true }
    } catch (error) {
      console.error('关闭窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 聚焦窗口
  ipcMain.handle('window:focus', async (event, windowName: string) => {
    try {
      windowManager.focusWindow(windowName)
      return { success: true }
    } catch (error) {
      console.error('聚焦窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 最小化窗口
  ipcMain.handle('window:minimize', async (event, windowName: string) => {
    try {
      windowManager.minimizeWindow(windowName)
      return { success: true }
    } catch (error) {
      console.error('最小化窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 最大化窗口
  ipcMain.handle('window:maximize', async (event, windowName: string) => {
    try {
      windowManager.maximizeWindow(windowName)
      return { success: true }
    } catch (error) {
      console.error('最大化窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 恢复窗口
  ipcMain.handle('window:restore', async (event, windowName: string) => {
    try {
      windowManager.restoreWindow(windowName)
      return { success: true }
    } catch (error) {
      console.error('恢复窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 检查窗口是否存在
  ipcMain.handle('window:has', async (event, windowName: string) => {
    try {
      const hasWindow = windowManager.hasWindow(windowName)
      return { success: true, data: hasWindow }
    } catch (error) {
      console.error('检查窗口存在失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 检查窗口是否可见
  ipcMain.handle('window:isVisible', async (event, windowName: string) => {
    try {
      const isVisible = windowManager.isWindowVisible(windowName)
      return { success: true, data: isVisible }
    } catch (error) {
      console.error('检查窗口可见性失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 获取所有窗口
  ipcMain.handle('window:getAll', async () => {
    try {
      const windows = windowManager.getAllWindows()
      // 只返回可序列化的数据，不包含 BrowserWindow 实例
      const serializableWindows = windows.map(instance => ({
        name: instance.name,
        isVisible: instance.isVisible
      }))
      return { success: true, data: serializableWindows }
    } catch (error) {
      console.error('获取所有窗口失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 获取可见窗口数量
  ipcMain.handle('window:getVisibleCount', async () => {
    try {
      const count = windowManager.getVisibleWindowCount()
      return { success: true, data: count }
    } catch (error) {
      console.error('获取可见窗口数量失败:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // 基础 ping 测试
  ipcMain.handle('ping', () => 'pong')
} 