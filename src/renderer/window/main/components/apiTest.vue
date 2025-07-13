<template>
  <div class="api-test-container">
    <h2>{{ $t('main.apiTest.title') }}</h2>
    <el-alert 
      :title="$t('main.apiTest.description')" 
      type="primary" 
      :closable="false" 
      class="alert-component"
    />
    <div class="test-section">
      <el-button 
        type="primary" 
        @click="handleGetRequestRenderer"
        :loading="loadingRenderer"
      >
        {{ loadingRenderer ? $t('main.apiTest.loading') : $t('main.apiTest.testGetRenderer') }}
      </el-button>

      <el-button 
        type="primary" 
        @click="handleGetRequestMain"
        :loading="loadingMain"
      >
        {{ loadingMain ? $t('main.apiTest.loading') : $t('main.apiTest.testGetMain') }}
      </el-button>
      
      <div v-if="response" class="response-section">
        <h3>{{ $t('main.apiTest.testResult') }}</h3>
        <el-card>
          <pre>{{ JSON.stringify(response, null, 2) }}</pre>
        </el-card>
      </div>
      
      <div v-if="error" class="error-section">
        <h3>{{ $t('main.apiTest.testFailed') }}</h3>
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

const response = ref(null)
const error = ref('')
const loadingRenderer = ref(false)
const loadingMain = ref(false)

const handleGetRequestRenderer = async () => {
  loadingRenderer.value = true
  error.value = ''
  response.value = null
  
  try {
    // 这里可以替换为实际的API地址
    const result = await getCommon({
      from: 'renderer',
    })
    response.value = result
  } catch (err: any) {
    error.value = err.message || '请求失败'
    console.error('API请求错误:', err)
  } finally {
    loadingRenderer.value = false
  }
}

const handleGetRequestMain = async () => {
  loadingMain.value = true
  error.value = ''
  response.value = null

  try {
    const result = await window.apiRequest.getCommon({
      from: 'main',
      
    })
    response.value = result
  } catch (err: any) {
    error.value = err.message || '请求失败'
    console.error('API请求错误:', err)
  } finally {
    loadingMain.value = false
  }
}
</script>

<style scoped>
.api-test-container {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.test-section {
  margin-top: 20px;
}

.response-section {
  width: 100%;
  margin-top: 20px;
}

.response-section pre {
  width: 100%;
  background-color: var(--el-bg-color-page);
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  box-sizing: border-box;
}

.error-section {
  margin-top: 20px;
}
</style> 