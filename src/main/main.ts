import { app, BrowserWindow } from 'electron'
import { createMenu } from './menu.js'
import { windowManager } from './windowManager.js'
import { WINDOW_NAMES } from '../config/windowConfig.js'
import { setupIpcHandlers } from './ipc/index.js'
import { initMainI18n } from './i18n/index.js'
import '../utils/logger.js'

app.whenReady().then(async () => {
  // 初始化i18n
  await initMainI18n() 

  // 设置 IPC 处理器
  setupIpcHandlers()

  // 创建菜单，传递窗口管理器
  createMenu(windowManager)
  
  // 创建主窗口
  windowManager.createWindow(WINDOW_NAMES.main)

  app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createWindow(WINDOW_NAMES.main)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})