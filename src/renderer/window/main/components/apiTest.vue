<template>
  <div class="api-test-container">
    <h2>API 测试页面</h2>
    <div class="test-section">
      <el-button 
        type="primary" 
        @click="handleGetRequest"
        :loading="loading"
      >
        {{ loading ? '请求中...' : '发送 GET 请求' }}
      </el-button>
      
      <div v-if="response" class="response-section">
        <h3>响应结果：</h3>
        <el-card>
          <pre>{{ JSON.stringify(response, null, 2) }}</pre>
        </el-card>
      </div>
      
      <div v-if="error" class="error-section">
        <h3>错误信息：</h3>
        <el-alert 
          :title="error" 
          type="error" 
          show-icon 
          :closable="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCommon } from '../../../service'

const loading = ref(false)
const response = ref(null)
const error = ref('')

const handleGetRequest = async () => {
  loading.value = true
  error.value = ''
  response.value = null
  
  try {
    // 这里可以替换为实际的API地址
    const result = await getCommon()
    response.value = result
  } catch (err: any) {
    error.value = err.message || '请求失败'
    console.error('API请求错误:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.api-test-container {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
}

.test-section {
  margin-top: 20px;
}

.response-section {
  margin-top: 20px;
}

.response-section pre {
  width: 100%;
  background-color: var(--el-bg-color-page);
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

.error-section {
  margin-top: 20px;
}
</style> 