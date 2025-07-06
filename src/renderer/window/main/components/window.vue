<template>
  <div class="window-container">
    <el-alert 
      title="该页面演示窗口管理API的使用，通过preload文件暴露的windowManager接口与主进程通信" 
      type="primary" 
      :closable="false" 
      class="alert-component"
    />
    
    <!-- 窗口操作区域 -->
    <el-card shadow="never" class="operation-card">
      <template #header>
        <div class="card-header">
          <span>窗口操作</span>
          <el-button type="primary" size="small" @click="refreshWindowList">
            刷新窗口列表
          </el-button>
        </div>
      </template>
      
      <div class="operation-section">
        <h4>基础窗口操作</h4>
        <div class="button-group">
          <el-button type="success" @click="createSettingWindow">
            创建设置窗口
          </el-button>
          <el-button type="primary" @click="showAllWindows">
            显示所有窗口
          </el-button>
          <el-button type="warning" @click="hideAllWindows">
            隐藏所有窗口
          </el-button>
          <el-button type="danger" @click="closeAllWindows">
            关闭所有窗口
          </el-button>
        </div>
      </div>

      <div class="operation-section">
        <h4>窗口状态控制</h4>
        <div class="button-group">
          <el-button @click="focusMainWindow">
            聚焦主窗口
          </el-button>
          <el-button @click="minimizeMainWindow">
            最小化主窗口
          </el-button>
          <el-button @click="maximizeMainWindow">
            最大化主窗口
          </el-button>
          <el-button @click="restoreMainWindow">
            恢复主窗口
          </el-button>
        </div>
      </div>

      <div class="operation-section">
        <h4>窗口信息查询</h4>
        <div class="button-group">
          <el-button @click="checkWindowStatus">
            检查窗口状态
          </el-button>
          <el-button @click="getVisibleCount">
            获取可见窗口数
          </el-button>
          <el-button @click="getAllWindows">
            获取所有窗口
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 窗口状态显示区域 -->
    <el-card shadow="never" class="status-card">
      <template #header>
        <span>窗口状态</span>
      </template>
      
      <el-descriptions title="当前窗口信息" :column="2" border>
        <el-descriptions-item label="主窗口存在">
          {{ windowStatus.mainExists ? '是' : '否' }}
        </el-descriptions-item>
        <el-descriptions-item label="主窗口可见">
          {{ windowStatus.mainVisible ? '是' : '否' }}
        </el-descriptions-item>
        <el-descriptions-item label="可见窗口数量">
          {{ windowStatus.visibleCount }}
        </el-descriptions-item>
        <el-descriptions-item label="总窗口数量">
          {{ windowStatus.totalCount }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="window-list" v-if="windowList.length > 0">
        <h4>窗口列表</h4>
        <el-table :data="windowList" style="width: 100%">
          <el-table-column prop="name" label="窗口名称" />
          <el-table-column prop="visible" label="可见状态">
            <template #default="scope">
              <el-tag :type="scope.row.visible ? 'success' : 'info'">
                {{ scope.row.visible ? '可见' : '隐藏' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="focusWindow(scope.row.name)">
                聚焦
              </el-button>
              <el-button size="small" @click="closeWindow(scope.row.name)">
                关闭
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface WindowInfo {
  name: string
  visible: boolean
}

interface WindowStatus {
  mainExists: boolean
  mainVisible: boolean
  visibleCount: number
  totalCount: number
}

const windowManager = (window as any).windowManager
const windowList = ref<WindowInfo[]>([])
const windowStatus = ref<WindowStatus>({
  mainExists: false,
  mainVisible: false,
  visibleCount: 0,
  totalCount: 0
})

// 刷新窗口列表
const refreshWindowList = async () => {
  if (!windowManager) {
    ElMessage.error('windowManager API 不可用')
    return
  }

  try {
    const windowsResponse = await windowManager.getAllWindows()
    if (windowsResponse.success && windowsResponse.data) {
      windowList.value = windowsResponse.data.map((window: any) => ({
        name: window.name,
        visible: window.isVisible
      }))
      windowStatus.value.totalCount = windowList.value.length
    }
    
    const visibleCountResponse = await windowManager.getVisibleWindowCount()
    if (visibleCountResponse.success && typeof visibleCountResponse.data === 'number') {
      windowStatus.value.visibleCount = visibleCountResponse.data
    }
    
    // 检查主窗口状态
    const mainExistsResponse = await windowManager.hasWindow('main')
    if (mainExistsResponse.success && typeof mainExistsResponse.data === 'boolean') {
      windowStatus.value.mainExists = mainExistsResponse.data
    }
    
    const mainVisibleResponse = await windowManager.isWindowVisible('main')
    if (mainVisibleResponse.success && typeof mainVisibleResponse.data === 'boolean') {
      windowStatus.value.mainVisible = mainVisibleResponse.data
    }
    
    ElMessage.success('窗口列表已刷新')
  } catch (error) {
    ElMessage.error('刷新窗口列表失败')
    console.error(error)
  }
}

// 创建测试窗口
const createSettingWindow = async () => {
  if (!windowManager) return
  try {
    const response = await windowManager.createWindow('setting')
  } catch (error) {
    ElMessage.error('创建设置窗口失败')
    console.error(error)
  }
}

// 显示所有窗口
const showAllWindows = async () => {
  if (!windowManager) return
  
  try {
    for (const window of windowList.value) {
      const response = await windowManager.showWindow(window.name)
      if (!response.success) {
        console.warn(`显示窗口 ${window.name} 失败:`, response.error)
      }
    }
    ElMessage.success('所有窗口已显示')
    refreshWindowList()
  } catch (error) {
    ElMessage.error('显示窗口失败')
    console.error(error)
  }
}

// 隐藏所有窗口
const hideAllWindows = async () => {
  if (!windowManager) return
  
  try {
    for (const window of windowList.value) {
      const response = await windowManager.hideWindow(window.name)
      if (!response.success) {
        console.warn(`隐藏窗口 ${window.name} 失败:`, response.error)
      }
    }
    ElMessage.success('所有窗口已隐藏')
    refreshWindowList()
  } catch (error) {
    ElMessage.error('隐藏窗口失败')
    console.error(error)
  }
}

// 关闭所有窗口
const closeAllWindows = async () => {
  if (!windowManager) return
  
  try {
    for (const window of windowList.value) {
      if (window.name !== 'main') { // 不关闭主窗口
        const response = await windowManager.closeWindow(window.name)
        if (!response.success) {
          console.warn(`关闭窗口 ${window.name} 失败:`, response.error)
        }
      }
    }
    ElMessage.success('所有非主窗口已关闭')
    refreshWindowList()
  } catch (error) {
    ElMessage.error('关闭窗口失败')
    console.error(error)
  }
}

// 聚焦主窗口
const focusMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.focusWindow('main')
    if (response.success) {
      ElMessage.success('主窗口已聚焦')
    } else {
      ElMessage.error(response.error || '聚焦主窗口失败')
    }
  } catch (error) {
    ElMessage.error('聚焦主窗口失败')
    console.error(error)
  }
}

// 最小化主窗口
const minimizeMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.minimizeWindow('main')
    if (response.success) {
      ElMessage.success('主窗口已最小化')
    } else {
      ElMessage.error(response.error || '最小化主窗口失败')
    }
  } catch (error) {
    ElMessage.error('最小化主窗口失败')
    console.error(error)
  }
}

// 最大化主窗口
const maximizeMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.maximizeWindow('main')
    if (response.success) {
      ElMessage.success('主窗口已最大化')
    } else {
      ElMessage.error(response.error || '最大化主窗口失败')
    }
  } catch (error) {
    ElMessage.error('最大化主窗口失败')
    console.error(error)
  }
}

// 恢复主窗口
const restoreMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.restoreWindow('main')
    if (response.success) {
      ElMessage.success('主窗口已恢复')
    } else {
      ElMessage.error(response.error || '恢复主窗口失败')
    }
  } catch (error) {
    ElMessage.error('恢复主窗口失败')
    console.error(error)
  }
}

// 检查窗口状态
const checkWindowStatus = async () => {
  await refreshWindowList()
  ElMessage.info('窗口状态已检查')
}

// 获取可见窗口数
const getVisibleCount = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.getVisibleWindowCount()
    if (response.success && typeof response.data === 'number') {
      ElMessage.info(`当前可见窗口数量: ${response.data}`)
    } else {
      ElMessage.error(response.error || '获取可见窗口数失败')
    }
  } catch (error) {
    ElMessage.error('获取可见窗口数失败')
    console.error(error)
  }
}

// 获取所有窗口
const getAllWindows = async () => {
  await refreshWindowList()
  ElMessage.info(`当前共有 ${windowList.value.length} 个窗口`)
}

// 聚焦指定窗口
const focusWindow = async (windowName: string) => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.focusWindow(windowName)
    if (response.success) {
      ElMessage.success(`窗口 ${windowName} 已聚焦`)
    } else {
      ElMessage.error(response.error || `聚焦窗口 ${windowName} 失败`)
    }
  } catch (error) {
    ElMessage.error(`聚焦窗口 ${windowName} 失败`)
    console.error(error)
  }
}

// 关闭指定窗口
const closeWindow = async (windowName: string) => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.closeWindow(windowName)
    if (response.success) {
      ElMessage.success(`窗口 ${windowName} 已关闭`)
      refreshWindowList()
    } else {
      ElMessage.error(response.error || `关闭窗口 ${windowName} 失败`)
    }
  } catch (error) {
    ElMessage.error(`关闭窗口 ${windowName} 失败`)
    console.error(error)
  }
}

// 监听窗口状态变化
const handleWindowStateChanged = (event: any, data: any) => {
  console.log('窗口状态变化:', data)
  ElMessage.info(`窗口状态变化: ${data.windowName} - ${data.action}`)
  refreshWindowList()
}

onMounted(() => {
  refreshWindowList()
  
  // 添加窗口状态变化监听
  if (windowManager && windowManager.onWindowStateChanged) {
    windowManager.onWindowStateChanged(handleWindowStateChanged)
  }
})

onUnmounted(() => {
  // 移除监听器
  if (windowManager && windowManager.removeWindowStateListener) {
    windowManager.removeWindowStateListener()
  }
})
</script>

<style scoped>
.window-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
  overflow-x: hidden;
}

.alert-component {
  flex-shrink: 0;
}

.operation-card,
.status-card,
.api-card {
  /* margin-bottom: 20px; */
  flex-shrink: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operation-section {
  margin-bottom: 24px;
}

.operation-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.window-list {
  margin-top: 20px;
}

.window-list h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.api-item {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.api-item h5 {
  margin: 0 0 8px 0;
  color: #409eff;
  font-size: 14px;
}

.api-item p {
  margin: 0;
  color: #606266;
  font-size: 13px;
}
</style>
