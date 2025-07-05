<template>
  <div class="setting-app">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="主题" name="theme">
        <el-radio-group v-model="themeColor">
          <el-radio value="light">明亮</el-radio>
          <el-radio value="dark">暗黑</el-radio>
          <el-radio value="system">跟随系统</el-radio>
        </el-radio-group>
      </el-tab-pane>
      <el-tab-pane label="语言" name="language">
        <el-form :model="form">
          <el-form-item label="语言">
            <el-select v-model="form.language" placeholder="请选择语言">
              <el-option label="中文" value="zh-CN" />
              <el-option label="英文" value="en-US" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { TabsPaneContext } from 'element-plus'

const activeName = ref('theme')

const form = ref({
  themeColor: 'light',
  language: 'zh-CN'
})

const themeColor = ref('light')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style scoped>
.setting-app {
  padding: 0 20px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
