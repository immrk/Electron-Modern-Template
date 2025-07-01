import { Menu, MenuItemConstructorOptions, BrowserWindow, app } from 'electron'
import { getAllMenuConfigs } from './menuConfig.js'

// 创建主菜单模板
const createMainMenuTemplate = (): MenuItemConstructorOptions[] => {
  const isMac = process.platform === 'darwin'

  const template: MenuItemConstructorOptions[] = [
    // macOS 应用菜单
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' as const },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const }
      ]
    }] : []),
    
    // 使用配置文件中的菜单
    ...getAllMenuConfigs()
  ]

  return template
}

// 创建主菜单
export const createMenu = (): void => {
  const template = createMainMenuTemplate()
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// 创建右键上下文菜单
export const createContextMenu = (): Menu => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '复制',
      role: 'copy' as const
    },
    {
      label: '粘贴',
      role: 'paste' as const
    },
    { type: 'separator' as const },
    {
      label: '开发者工具',
      click: (menuItem, browserWindow) => {
        if (browserWindow && browserWindow instanceof BrowserWindow) {
          browserWindow.webContents.toggleDevTools()
        }
      }
    }
  ])
  
  return contextMenu
}

// 为特定窗口设置上下文菜单
export const setupContextMenu = (window: BrowserWindow): void => {
  const contextMenu = createContextMenu()
  
  window.webContents.on('context-menu', (event, params) => {
    contextMenu.popup({ window })
  })
} 