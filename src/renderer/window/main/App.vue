<template>
  <title-bar />
  <div class="main-layout">
    <div class="left-bar">
      <left-bar />
    </div>
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import titleBar from "./components/titlebar.vue";
import leftBar from './components/leftBar.vue';
import { useTheme } from '../../composables/useThemeVue';
import { useLanguage } from '../../composables/useLanguageVue';

// 使用统一的主题管理
const { themeColor } = useTheme();
console.log("main themeColor:", themeColor.value);

// 使用统一的语言管理
const { currentLanguage } = useLanguage();
console.log("main currentLanguage:", currentLanguage.value);
</script>

<style scoped>
.main-layout {
  height: 100%;
  margin: 0 !important;
  display: flex;
}
.left-bar {
  height: 100%;
}
.main-content {
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color);
}
</style>