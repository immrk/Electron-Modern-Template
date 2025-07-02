import { ipcMain, shell, clipboard, nativeTheme } from 'electron'
import { wrapAsyncOperation } from '../utils/response.js'

/**
 * 系统相关的IPC处理器
 */
export const setupSystemHandlers = (): void => {
  // 打开外部链接
  ipcMain.handle('system:openExternal', async (event, url: string) => {
    return wrapAsyncOperation(async () => {
      await shell.openExternal(url)
      return undefined
    })
  })

  // 打开文件
  ipcMain.handle('system:openPath', async (event, path: string) => {
    return wrapAsyncOperation(async () => {
      await shell.openPath(path)
      return undefined
    })
  })

  // 显示文件在文件管理器中
  ipcMain.handle('system:showItemInFolder', async (event, path: string) => {
    return wrapAsyncOperation(async () => {
      shell.showItemInFolder(path)
      return undefined
    })
  })

  // 复制到剪贴板
  ipcMain.handle('system:writeText', async (event, text: string) => {
    return wrapAsyncOperation(async () => {
      clipboard.writeText(text)
      return undefined
    })
  })

  // 从剪贴板读取
  ipcMain.handle('system:readText', async () => {
    return wrapAsyncOperation(async () => {
      return clipboard.readText()
    })
  })

  // 获取系统主题
  ipcMain.handle('system:getTheme', async () => {
    return wrapAsyncOperation(async () => {
      return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    })
  })

  // 获取系统信息
  ipcMain.handle('system:getInfo', async () => {
    return wrapAsyncOperation(async () => {
      return {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        nodeVersion: process.versions.node,
        chromeVersion: process.versions.chrome,
        electronVersion: process.versions.electron
      }
    })
  })

  // 获取内存使用情况
  ipcMain.handle('system:getMemoryInfo', async () => {
    return wrapAsyncOperation(async () => {
      return process.getSystemMemoryInfo()
    })
  })
} 