<template>
  <div class="window-container">
    <el-alert 
      :title="$t('main.window.alert')" 
      type="primary" 
      :closable="false" 
      class="alert-component"
    />
    
    <!-- 窗口操作区域 -->
    <el-card shadow="never" class="operation-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('main.window.operations.title') }}</span>
          <el-button type="primary" size="small" @click="refreshWindowList">
            {{ $t('main.window.operations.refreshList') }}
          </el-button>
        </div>
      </template>
      
      <div class="operation-section">
        <h4>{{ $t('main.window.operations.basicOperations') }}</h4>
        <div class="button-group">
          <el-button type="success" @click="createSettingWindow">
            {{ $t('main.window.operations.createSetting') }}
          </el-button>
          <el-button type="primary" @click="showAllWindows">
            {{ $t('main.window.operations.showAll') }}
          </el-button>
          <el-button type="warning" @click="hideAllWindows">
            {{ $t('main.window.operations.hideAll') }}
          </el-button>
          <el-button type="danger" @click="closeAllWindows">
            {{ $t('main.window.operations.closeAll') }}
          </el-button>
        </div>
      </div>

      <div class="operation-section">
        <h4>{{ $t('main.window.operations.statusControl') }}</h4>
        <div class="button-group">
          <el-button @click="focusMainWindow">
            {{ $t('main.window.operations.focusMain') }}
          </el-button>
          <el-button @click="minimizeMainWindow">
            {{ $t('main.window.operations.minimizeMain') }}
          </el-button>
          <el-button @click="maximizeMainWindow">
            {{ $t('main.window.operations.maximizeMain') }}
          </el-button>
          <el-button @click="restoreMainWindow">
            {{ $t('main.window.operations.restoreMain') }}
          </el-button>
        </div>
      </div>

      <div class="operation-section">
        <h4>{{ $t('main.window.operations.infoQuery') }}</h4>
        <div class="button-group">
          <el-button @click="checkWindowStatus">
            {{ $t('main.window.operations.checkStatus') }}
          </el-button>
          <el-button @click="getVisibleCount">
            {{ $t('main.window.operations.getVisibleCount') }}
          </el-button>
          <el-button @click="getAllWindows">
            {{ $t('main.window.operations.getAllWindows') }}
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 窗口状态显示区域 -->
    <el-card shadow="never" class="status-card">
      <template #header>
        <span>{{ $t('main.window.status.title') }}</span>
      </template>
      
      <el-descriptions :title="$t('main.window.status.currentWindowInfo')" :column="2" border>
        <el-descriptions-item :label="$t('main.window.status.mainExists')">
          {{ windowStatus.mainExists ? $t('common.yes') : $t('common.no') }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('main.window.status.mainVisible')">
          {{ windowStatus.mainVisible ? $t('common.yes') : $t('common.no') }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('main.window.status.visibleCount')">
          {{ windowStatus.visibleCount }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('main.window.status.totalCount')">
          {{ windowStatus.totalCount }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="window-list" v-if="windowList.length > 0">
        <h4>{{ $t('main.window.status.windowList') }}</h4>
        <el-table :data="windowList" style="width: 100%">
          <el-table-column prop="name" :label="$t('main.window.status.windowName')" />
          <el-table-column prop="visible" :label="$t('main.window.status.visibleStatus')">
            <template #default="scope">
              <el-tag :type="scope.row.visible ? 'success' : 'info'">
                {{ scope.row.visible ? $t('main.window.status.visible') : $t('main.window.status.hidden') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('main.window.status.actions')">
            <template #default="scope">
              <el-button size="small" @click="focusWindow(scope.row.name)">
                {{ $t('main.window.status.focus') }}
              </el-button>
              <el-button size="small" @click="closeWindow(scope.row.name)">
                {{ $t('main.window.status.close') }}
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
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

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
    ElMessage.error(t('main.window.messages.windowManagerUnavailable'))
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
    
    ElMessage.success(t('main.window.messages.listRefreshed'))
  } catch (error) {
    ElMessage.error(t('main.window.messages.refreshFailed'))
    console.error(error)
  }
}

// 创建测试窗口
const createSettingWindow = async () => {
  if (!windowManager) return
  try {
    const response = await windowManager.createWindow('setting')
  } catch (error) {
    ElMessage.error(t('main.window.messages.createSettingFailed'))
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
    ElMessage.success(t('main.window.messages.allWindowsShown'))
    refreshWindowList()
  } catch (error) {
    ElMessage.error(t('main.window.messages.showWindowsFailed'))
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
    ElMessage.success(t('main.window.messages.allWindowsHidden'))
    refreshWindowList()
  } catch (error) {
    ElMessage.error(t('main.window.messages.hideWindowsFailed'))
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
    ElMessage.success(t('main.window.messages.nonMainWindowsClosed'))
    refreshWindowList()
  } catch (error) {
    ElMessage.error(t('main.window.messages.closeWindowsFailed'))
    console.error(error)
  }
}

// 聚焦主窗口
const focusMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.focusWindow('main')
    if (response.success) {
      ElMessage.success(t('main.window.messages.mainWindowFocused'))
    } else {
      ElMessage.error(response.error || t('main.window.messages.focusMainFailed'))
    }
  } catch (error) {
    ElMessage.error(t('main.window.messages.focusMainFailed'))
    console.error(error)
  }
}

// 最小化主窗口
const minimizeMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.minimizeWindow('main')
    if (response.success) {
      ElMessage.success(t('main.window.messages.mainWindowMinimized'))
    } else {
      ElMessage.error(response.error || t('main.window.messages.minimizeMainFailed'))
    }
  } catch (error) {
    ElMessage.error(t('main.window.messages.minimizeMainFailed'))
    console.error(error)
  }
}

// 最大化主窗口
const maximizeMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.maximizeWindow('main')
    if (response.success) {
      ElMessage.success(t('main.window.messages.mainWindowMaximized'))
    } else {
      ElMessage.error(response.error || t('main.window.messages.maximizeMainFailed'))
    }
  } catch (error) {
    ElMessage.error(t('main.window.messages.maximizeMainFailed'))
    console.error(error)
  }
}

// 恢复主窗口
const restoreMainWindow = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.restoreWindow('main')
    if (response.success) {
      ElMessage.success(t('main.window.messages.mainWindowRestored'))
    } else {
      ElMessage.error(response.error || t('main.window.messages.restoreMainFailed'))
    }
  } catch (error) {
    ElMessage.error(t('main.window.messages.restoreMainFailed'))
    console.error(error)
  }
}

// 检查窗口状态
const checkWindowStatus = async () => {
  await refreshWindowList()
  ElMessage.info(t('main.window.messages.statusChecked'))
}

// 获取可见窗口数
const getVisibleCount = async () => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.getVisibleWindowCount()
    if (response.success && typeof response.data === 'number') {
      ElMessage.info(t('main.window.messages.visibleCountInfo', { count: response.data }))
    } else {
      ElMessage.error(response.error || t('main.window.messages.getVisibleCountFailed'))
    }
  } catch (error) {
    ElMessage.error(t('main.window.messages.getVisibleCountFailed'))
    console.error(error)
  }
}

// 获取所有窗口
const getAllWindows = async () => {
  await refreshWindowList()
  ElMessage.info(t('main.window.messages.totalWindowsInfo', { count: windowList.value.length }))
}

// 聚焦指定窗口
const focusWindow = async (windowName: string) => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.focusWindow(windowName)
    if (response.success) {
      ElMessage.success(t('main.window.messages.windowFocused', { name: windowName }))
    } else {
      ElMessage.error(response.error || t('main.window.messages.focusWindowFailed', { name: windowName }))
    }
  } catch (error) {
    ElMessage.error(t('main.window.messages.focusWindowFailed', { name: windowName }))
    console.error(error)
  }
}

// 关闭指定窗口
const closeWindow = async (windowName: string) => {
  if (!windowManager) return
  
  try {
    const response = await windowManager.closeWindow(windowName)
    if (response.success) {
      ElMessage.success(t('main.window.messages.windowClosed', { name: windowName }))
      refreshWindowList()
    } else {
      ElMessage.error(response.error || t('main.window.messages.closeWindowFailed', { name: windowName }))
    }
  } catch (error) {
    ElMessage.error(t('main.window.messages.closeWindowFailed', { name: windowName }))
    console.error(error)
  }
}

// 监听窗口状态变化
const handleWindowStateChanged = (event: any, data: any) => {
  console.log('窗口状态变化:', data)
  ElMessage.info(t('main.window.messages.windowStateChanged', { windowName: data.windowName, action: data.action }))
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
