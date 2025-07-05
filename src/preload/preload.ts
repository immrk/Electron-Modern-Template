import { exposeWindowManagerAPI } from './apis/windowManager.js'
import { exposeVersionsAPI } from './apis/versions.js'

console.log('Preload 脚本开始执行')

try {
  // 版本信息 API
  exposeVersionsAPI()

  // 窗口管理 API
  exposeWindowManagerAPI()
  
  console.log('Preload 脚本执行完成')
} catch (error) {
  console.error('Preload 脚本执行出错:', error)
}