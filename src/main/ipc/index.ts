import { setupWindowHandlers } from './handlers/window.js'
import { setupAppHandlers } from './handlers/app.js'
import { setupSystemHandlers } from './handlers/system.js'

/**
 * 设置所有IPC处理器
 * 这是IPC模块的主入口，统一管理所有IPC通信
 */
export const setupIpcHandlers = (): void => {
  console.log('正在设置IPC处理器...')
  
  // 设置窗口管理相关的IPC处理器
  setupWindowHandlers()
  
  // 设置应用生命周期相关的IPC处理器
  setupAppHandlers()
  
  // 设置系统相关的IPC处理器
  setupSystemHandlers()
  
  console.log('IPC处理器设置完成')
}

// 导出类型定义，供其他模块使用
export * from './types/index.js'
export * from './utils/response.js'
