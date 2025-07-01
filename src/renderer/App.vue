<template>
  <div class="app">
    <!-- 头部导航 -->
    <header class="app-header">
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
    <main class="app-main">
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
    </main>

    <!-- 底部状态栏 -->
    <footer class="app-footer">
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

// 导航标签页
const tabs = [
  { id: 'home', name: '首页' },
  { id: 'counter', name: '计数器' },
  { id: 'info', name: '系统信息' }
]

// 计数器方法
const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0

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
  updateTime()
  updateSystemInfo()
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
