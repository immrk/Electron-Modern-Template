import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { createMenu, setupContextMenu } from './menu.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // 预加载文件(用于隔离渲染进程和主进程，并进行通信)
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  console.log("运行环境:", process.env.NODE_ENV);
  
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:11069')
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // 设置右键上下文菜单
  setupContextMenu(win)
}

app.whenReady().then(() => {
  createMenu() // 创建菜单
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})