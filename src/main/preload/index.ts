import { exposeWindowManagerAPI } from './apis/windowManager.js'
import { exposeVersionsAPI } from './apis/versions.js'
import { exposeStoreAPI } from './apis/store.js'
import { exposeSystemAPI } from './apis/system.js'
import { exposeApiRequestAPI } from './apis/apiRequest.js'
import { exposeAuthAPI } from './apis/auth.js'

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

  // API请求 API
  exposeApiRequestAPI()

  // Auth API
  exposeAuthAPI()
  
  console.log('Preload 脚本执行完成')
} catch (error) {
  console.error('Preload 脚本执行出错:', error)
}