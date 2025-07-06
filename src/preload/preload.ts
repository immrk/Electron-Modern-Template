import { exposeWindowManagerAPI } from './apis/windowManager.js'
import { exposeVersionsAPI } from './apis/versions.js'
import { exposeStoreAPI } from './apis/store.js'
import { exposeSystemAPI } from './apis/system.js'
import { exposeI18nAPI } from './apis/i18n.js'

console.log('Preload 脚本开始执行')

try {
  // 版本信息 API
  exposeVersionsAPI()

  // 窗口管理 API
  exposeWindowManagerAPI()

  // Store API
  exposeStoreAPI()

  // System API
  exposeSystemAPI()

  // I18n API
  exposeI18nAPI()
  
  console.log('Preload 脚本执行完成')
} catch (error) {
  console.error('Preload 脚本执行出错:', error)
}