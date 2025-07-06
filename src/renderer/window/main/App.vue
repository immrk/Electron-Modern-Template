<template>
  <div class="main-layout">
    <div class="left-bar">
      <left-bar @menuClick="handleMenuClick" />
    </div>
    <div class="main-content">
      <component :is="currentMenu === MenuEnum.HOME ? home : currentMenu === MenuEnum.SYSTEM ? system : windowComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import leftBar from './components/leftBar.vue';
import home from './components/home.vue';
import system from './components/system.vue';
import windowComponent from './components/window.vue';
import { MenuEnum } from './constants';
import { useTheme } from '../../composables/useThemeVue';
import { useLanguage } from '../../composables/useLanguageVue';

const currentMenu = ref(MenuEnum.HOME);

const handleMenuClick = (name: MenuEnum) => {
  currentMenu.value = name;
};

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