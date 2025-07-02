<template>
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentWindowName = ref('setting')
const visibleWindowCount = ref(0)
const allWindows = ref<any[]>([])

// 窗口管理函数
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
    const result = await windowManager.createWindow('setting')
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
    await windowManager.minimizeWindow('setting')
  } catch (error) {
    console.error('最小化窗口时出错:', error)
  }
}

const maximizeCurrent = async () => {
  try {
    await windowManager.maximizeWindow('setting')
  } catch (error) {
    console.error('最大化窗口时出错:', error)
  }
}

const closeCurrent = async () => {
  try {
    await windowManager.closeWindow('setting')
  } catch (error) {
    console.error('关闭窗口时出错:', error)
  }
}

// 更新窗口信息
const updateWindowInfo = async () => {
  try {
    const [visibleCount, allWindowsResult] = await Promise.all([
      windowManager.getVisibleWindowCount(),
      windowManager.getAllWindows()
    ])
    
    visibleWindowCount.value = visibleCount.data || 0
    allWindows.value = allWindowsResult.data || []
  } catch (error) {
    console.error('更新窗口信息时出错:', error)
  }
}

// 监听窗口状态变化
const handleWindowStateChanged = (event: any, data: any) => {
  console.log('窗口状态变化:', data)
  updateWindowInfo()
}

// 生命周期
onMounted(() => {
  updateWindowInfo()
  // 监听窗口状态变化
  windowManager.onWindowStateChanged(handleWindowStateChanged)
})

onUnmounted(() => {
  // 移除监听器
  windowManager.removeWindowStateListener()
})
</script>

<style scoped>
.setting-app {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-size: 24px;
}

h2 {
  color: #555;
  margin-bottom: 15px;
  font-size: 18px;
}

.window-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.window-info p {
  margin: 5px 0;
  color: #666;
}

.window-controls {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.window-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.window-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f3f4;
}

.window-item:last-child {
  border-bottom: none;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
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
</style> 