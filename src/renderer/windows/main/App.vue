<template>
  <div class="app">
    <!-- 头部导航 -->
    <header class="app-header" v-if="windowType === 'main'">
      <div class="header-content">
        <h1 class="app-title">
          <span class="logo">⚡</span>
          Electron + Vue 应用
        </h1>
        <nav class="nav-menu">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['nav-button', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="app-main" v-if="windowType === 'main'">
      <!-- 首页 -->
      <div v-if="activeTab === 'home'" class="tab-content">
        <div class="welcome-section">
          <h2>欢迎使用 Vue + Electron</h2>
          <p>这是一个基于 Vue 3 + TypeScript + Vite 的 Electron 应用框架</p>
          
          <div class="feature-cards">
            <div class="card">
              <h3>🚀 现代技术栈</h3>
              <p>Vue 3 + TypeScript + Vite</p>
            </div>
            <div class="card">
              <h3>⚡ 快速开发</h3>
              <p>热重载和快速构建</p>
            </div>
            <div class="card">
              <h3>🎨 响应式设计</h3>
              <p>现代化的UI界面</p>
            </div>
          </div>
          
          <!-- 组件演示 -->
          <HelloWorld 
            title="组件化开发演示" 
            message="这是一个可复用的Vue组件，支持props传递和双向数据绑定"
          />
        </div>
      </div>

      <!-- 计数器演示 -->
      <div v-if="activeTab === 'counter'" class="tab-content">
        <div class="counter-section">
          <h2>计数器演示</h2>
          <div class="counter-display">
            <span class="counter-value">{{ count }}</span>
          </div>
          <div class="counter-controls">
            <button @click="decrement" class="btn btn-secondary">-</button>
            <button @click="reset" class="btn btn-outline">重置</button>
            <button @click="increment" class="btn btn-primary">+</button>
          </div>
        </div>
      </div>

      <!-- 系统信息 -->
      <div v-if="activeTab === 'info'" class="tab-content">
        <div class="info-section">
          <h2>系统信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>用户代理：</label>
              <span>{{ userAgent }}</span>
            </div>
            <div class="info-item">
              <label>平台：</label>
              <span>{{ platform }}</span>
            </div>
            <div class="info-item">
              <label>语言：</label>
              <span>{{ language }}</span>
            </div>
            <div class="info-item">
              <label>屏幕分辨率：</label>
              <span>{{ screenResolution }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 窗口管理 -->
      <div v-if="activeTab === 'windows'" class="tab-content">
        <div class="windows-section">
          <h2>窗口管理</h2>
          
          <div class="window-info">
            <h3>窗口信息</h3>
            <p>当前窗口: {{ currentWindowName }}</p>
            <p>可见窗口数量: {{ visibleWindowCount }}</p>
          </div>

          <div class="window-controls">
            <h3>窗口控制</h3>
            <div class="button-group">
              <button @click="createMainWindow" class="btn btn-primary">
                创建主窗口
              </button>
              <button @click="createSettingWindow" class="btn btn-secondary">
                创建设置窗口
              </button>
            </div>
            
            <div class="button-group">
              <button @click="minimizeCurrent" class="btn btn-warning">
                最小化当前窗口
              </button>
              <button @click="maximizeCurrent" class="btn btn-info">
                最大化当前窗口
              </button>
            </div>
          </div>

          <div class="window-list" v-if="allWindows.length > 0">
            <h3>所有窗口</h3>
            <ul>
              <li v-for="window in allWindows" :key="window.name" class="window-item">
                <span>{{ window.name }}</span>
                <span :class="['status', window.isVisible ? 'visible' : 'hidden']">
                  {{ window.isVisible ? '可见' : '隐藏' }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- 设置窗口内容 -->
    <div v-if="windowType === 'setting'" class="setting-window">
      <div class="setting-app">
        <h1>设置窗口</h1>
        
        <div class="window-info">
          <h2>窗口信息</h2>
          <p>当前窗口: {{ currentWindowName }}</p>
          <p>可见窗口数量: {{ visibleWindowCount }}</p>
        </div>

        <div class="window-controls">
          <h2>窗口控制</h2>
          <div class="button-group">
            <button @click="createMainWindow" class="btn btn-primary">
              创建主窗口
            </button>
            <button @click="createSettingWindow" class="btn btn-secondary">
              创建设置窗口
            </button>
          </div>
          
          <div class="button-group">
            <button @click="minimizeCurrent" class="btn btn-warning">
              最小化当前窗口
            </button>
            <button @click="maximizeCurrent" class="btn btn-info">
              最大化当前窗口
            </button>
          </div>
          
          <div class="button-group">
            <button @click="closeCurrent" class="btn btn-danger">
              关闭当前窗口
            </button>
          </div>
        </div>

        <div class="window-list" v-if="allWindows.length > 0">
          <h2>所有窗口</h2>
          <ul>
            <li v-for="window in allWindows" :key="window.name" class="window-item">
              <span>{{ window.name }}</span>
              <span :class="['status', window.isVisible ? 'visible' : 'hidden']">
                {{ window.isVisible ? '可见' : '隐藏' }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <footer class="app-footer" v-if="windowType === 'main'">
      <div class="footer-content">
        <span>当前时间: {{ currentTime }}</span>
        <span>状态: 运行中</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

// 响应式数据
const activeTab = ref('home')
const count = ref(0)
const currentTime = ref('')
const userAgent = ref('')
const platform = ref('')
const language = ref('')
const screenResolution = ref('')

// 窗口管理相关数据
const currentWindowName = ref('main')
const visibleWindowCount = ref(0)
const allWindows = ref<any[]>([])

// 检测当前窗口类型
const urlParams = new URLSearchParams(window.location.search)
const windowType = urlParams.get('window') || 'main'
currentWindowName.value = windowType

// 导航标签页
const tabs = [
  { id: 'home', name: '首页' },
  { id: 'counter', name: '计数器' },
  { id: 'info', name: '系统信息' },
  { id: 'windows', name: '窗口管理' }
]

// 计数器方法
const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0

// 窗口管理方法
const createMainWindow = async () => {
  try {
    const result = await windowManager.createWindow('main')
    if (result.success) {
      console.log('主窗口创建成功')
      updateWindowInfo()
    } else {
      console.error('主窗口创建失败:', result.error)
    }
  } catch (error) {
    console.error('创建主窗口时出错:', error)
  }
}

const createSettingWindow = async () => {
  try {
    const result = await window.windowManager.createWindow('setting')
    if (result.success) {
      console.log('设置窗口创建成功')
      updateWindowInfo()
    } else {
      console.error('设置窗口创建失败:', result.error)
    }
  } catch (error) {
    console.error('创建设置窗口时出错:', error)
  }
}

const minimizeCurrent = async () => {
  try {
    const windowName = windowType === 'setting' ? 'setting' : 'main'
    await window.windowManager.minimizeWindow(windowName)
  } catch (error) {
    console.error('最小化窗口时出错:', error)
  }
}

const maximizeCurrent = async () => {
  try {
    const windowName = windowType === 'setting' ? 'setting' : 'main'
    await window.windowManager.maximizeWindow(windowName)
  } catch (error) {
    console.error('最大化窗口时出错:', error)
  }
}

const closeCurrent = async () => {
  try {
    const windowName = windowType === 'setting' ? 'setting' : 'main'
    await window.windowManager.closeWindow(windowName)
  } catch (error) {
    console.error('关闭窗口时出错:', error)
  }
}

// 更新窗口信息
const updateWindowInfo = async () => {
  try {
    const [visibleCount, allWindowsResult] = await Promise.all([
      window.windowManager.getVisibleWindowCount(),
      window.windowManager.getAllWindows()
    ])
    
    visibleWindowCount.value = visibleCount.data || 0
    allWindows.value = allWindowsResult.data || []
  } catch (error) {
    console.error('更新窗口信息时出错:', error)
  }
}

// 时间更新
let timeInterval: number | null = null

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

const updateSystemInfo = () => {
  userAgent.value = navigator.userAgent
  platform.value = navigator.platform
  language.value = navigator.language
  screenResolution.value = `${screen.width} x ${screen.height}`
}

// 生命周期
onMounted(() => {
  // 调试信息
  console.log('=== 渲染进程调试信息 ===')
  console.log('window.versions:', window.versions)
  console.log('window.windowManager:', window.windowManager)
  console.log('typeof window.versions:', typeof window.versions)
  console.log('typeof window.windowManager:', typeof window.windowManager)
  
  // 测试 versions API
  if (window.versions) {
    console.log('versions.node():', window.versions.node())
    console.log('versions.chrome():', window.versions.chrome())
    console.log('versions.electron():', window.versions.electron())
  }
  
  updateTime()
  updateSystemInfo()
  updateWindowInfo()
  timeInterval = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-size: 1.5rem;
}

.logo {
  font-size: 2rem;
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.nav-button:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.nav-button.active {
  background: #667eea;
  color: white;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.tab-content {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.welcome-section h2 {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.welcome-section p {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  background: rgba(255, 255, 255, 0.8);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.card p {
  margin: 0;
  color: #666;
}

.counter-section {
  text-align: center;
}

.counter-section h2 {
  color: #333;
  margin-bottom: 2rem;
}

.counter-display {
  margin: 2rem 0;
}

.counter-value {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
  display: inline-block;
  min-width: 120px;
}

.counter-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  min-width: 80px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.info-section h2 {
  color: #333;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
}

.info-item label {
  font-weight: bold;
  color: #333;
}

.info-item span {
  color: #666;
  word-break: break-all;
}

/* 窗口管理样式 */
.windows-section h2 {
  color: #333;
  margin-bottom: 2rem;
}

.windows-section h3 {
  color: #555;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.window-info {
  background: rgba(255, 255, 255, 0.5);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.window-info p {
  margin: 0.5rem 0;
  color: #666;
}

.window-controls {
  background: rgba(255, 255, 255, 0.5);
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.window-list {
  background: rgba(255, 255, 255, 0.5);
  padding: 1.5rem;
  border-radius: 6px;
}

.window-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.window-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.window-item:last-child {
  border-bottom: none;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status.visible {
  background-color: #d4edda;
  color: #155724;
}

.status.hidden {
  background-color: #f8d7da;
  color: #721c24;
}

/* 设置窗口样式 */
.setting-window {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-app {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.setting-app h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-size: 24px;
}

.setting-app h2 {
  color: #555;
  margin-bottom: 15px;
  font-size: 18px;
}

.setting-app .window-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.setting-app .window-info p {
  margin: 5px 0;
  color: #666;
}

.setting-app .window-controls {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.setting-app .button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.setting-app .btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.setting-app .btn-primary {
  background-color: #007bff;
  color: white;
}

.setting-app .btn-primary:hover {
  background-color: #0056b3;
}

.setting-app .btn-secondary {
  background-color: #6c757d;
  color: white;
}

.setting-app .btn-secondary:hover {
  background-color: #545b62;
}

.setting-app .btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.setting-app .btn-warning:hover {
  background-color: #e0a800;
}

.setting-app .btn-info {
  background-color: #17a2b8;
  color: white;
}

.setting-app .btn-info:hover {
  background-color: #138496;
}

.setting-app .btn-danger {
  background-color: #dc3545;
  color: white;
}

.setting-app .btn-danger:hover {
  background-color: #c82333;
}

.setting-app .window-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.setting-app .window-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.setting-app .window-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.setting-app .window-item:last-child {
  border-bottom: none;
}

.setting-app .status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.setting-app .status.visible {
  background-color: #d4edda;
  color: #155724;
}

.setting-app .status.hidden {
  background-color: #f8d7da;
  color: #721c24;
}

.app-footer {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  padding: 1rem 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .app-main {
    padding: 1rem;
  }
  
  .tab-content {
    padding: 1rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .counter-controls {
    flex-wrap: wrap;
  }
  
  .info-item {
    grid-template-columns: 1fr;
  }
}
</style>
