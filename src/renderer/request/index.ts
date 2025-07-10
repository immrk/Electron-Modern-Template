import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 响应数据接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  showError?: boolean
  retry?: number
  retryDelay?: number
}

const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("baseURL", baseURL);

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL, // 使用相对路径，让请求发送到当前开发服务器
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return instance
}

// 请求拦截器
const setupRequestInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      // 添加token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // 添加时间戳防止缓存
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }
      }

      console.log('🚀 发送请求:', config.method?.toUpperCase(), config.url)
      return config
    },
    (error) => {
      console.error('❌ 请求错误:', error)
      return Promise.reject(error)
    }
  )
}

// 响应拦截器
const setupResponseInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      console.log('✅ 响应成功:', response.config.url, response.data)
      
      // 处理业务状态码
      const { code, message, data, success } = response.data
      
      if (code === 200 || success) {
        return data
      } else {
        // 业务错误
        const error = new Error(message || '请求失败')
        error.name = 'BusinessError'
        return Promise.reject(error)
      }
    },
    (error: AxiosError) => {
      console.error('❌ 响应错误:', error.config?.url, error.message)
      
      let errorMessage = '网络请求失败'
      
      if (error.response) {
        // 服务器响应了错误状态码
        const { status, data } = error.response
        
        switch (status) {
          case 401:
            errorMessage = '未授权，请重新登录'
            // 清除token并跳转到登录页
            localStorage.removeItem('token')
            // 这里可以触发登录跳转逻辑
            break
          case 403:
            errorMessage = '拒绝访问'
            break
          case 404:
            errorMessage = '请求的资源不存在'
            break
          case 500:
            errorMessage = '服务器内部错误'
            break
          default:
            errorMessage = (data as any)?.message || `请求失败 (${status})`
        }
      } else if (error.request) {
        // 请求已发出但没有收到响应
        errorMessage = '网络连接失败，请检查网络设置'
      } else {
        // 请求配置出错
        errorMessage = error.message || '请求配置错误'
      }
      
      const customError = new Error(errorMessage)
      customError.name = 'NetworkError'
      return Promise.reject(customError)
    }
  )
}

// 重试机制
const retryRequest = async (
  instance: AxiosInstance,
  config: RequestConfig,
  retryCount: number = 0
): Promise<any> => {
  try {
    return await instance.request(config)
  } catch (error) {
    const maxRetries = config.retry || 0
    const retryDelay = config.retryDelay || 1000
    
    if (retryCount < maxRetries) {
      console.log(`🔄 重试请求 (${retryCount + 1}/${maxRetries}):`, config.url)
      
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return retryRequest(instance, config, retryCount + 1)
    }
    
    throw error
  }
}

// 创建HTTP客户端类
export class HttpClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = createAxiosInstance()
    setupRequestInterceptors(this.instance)
    setupResponseInterceptors(this.instance)
  }

  // GET请求
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  // POST请求
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  // PUT请求
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  // DELETE请求
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  // PATCH请求
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  // 通用请求方法
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // 显示加载状态
      if (config.showLoading !== false) {
        // 这里可以集成loading状态管理
        console.log('⏳ 请求开始:', config.url)
      }

      const response = await retryRequest(this.instance, config)
      
      // 隐藏加载状态
      if (config.showLoading !== false) {
        console.log('✅ 请求完成:', config.url)
      }

      return response
    } catch (error) {
      // 隐藏加载状态
      if (config.showLoading !== false) {
        console.log('❌ 请求失败:', config.url)
      }

      // 错误处理
      if (config.showError !== false) {
        this.handleError(error)
      }

      throw error
    }
  }

  // 错误处理方法
  private handleError(error: any) {
    // 这里可以集成错误提示组件，比如Element Plus的ElMessage
    console.error('请求错误:', error.message)
    
    // 示例：使用Element Plus的ElMessage显示错误
    // import { ElMessage } from 'element-plus'
    // ElMessage.error(error.message)
  }

  // 设置请求头
  setHeader(key: string, value: string) {
    this.instance.defaults.headers.common[key] = value
  }

  // 移除请求头
  removeHeader(key: string) {
    delete this.instance.defaults.headers.common[key]
  }

  // 设置token
  setToken(token: string) {
    this.setHeader('Authorization', `Bearer ${token}`)
  }

  // 清除token
  clearToken() {
    this.removeHeader('Authorization')
  }
}

// 创建默认实例
export const http = new HttpClient()

// 导出便捷方法
export const request = {
  get: <T = any>(url: string, config?: RequestConfig) => http.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => http.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => http.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: RequestConfig) => http.delete<T>(url, config),
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) => http.patch<T>(url, data, config),
}

// 导出类型
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError }
export default http
