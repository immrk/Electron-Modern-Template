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
import { ref, onMounted } from 'vue';
import leftBar from './components/leftBar.vue';
import home from './components/home.vue';
import system from './components/system.vue';
import windowComponent from './components/window.vue';
import { MenuEnum } from './constants';
import { useTheme } from '../../composables/useThemeVue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const currentMenu = ref(MenuEnum.HOME);

const handleMenuClick = (name: MenuEnum) => {
  currentMenu.value = name;
};

// 使用统一的主题管理
const { themeColor } = useTheme();
console.log("main themeColor:", themeColor.value);

onMounted(async () => {
  // 获取当前语言
  const language = await window.i18n.getCurrentLanguage();
  locale.value = language;
  console.log("main language:", language);
  // 监听主进程语言变化事件
  window.i18n.onLanguageChanged((language: string) => {
    locale.value = language;
    console.log("main language changed:", language);
  });
});
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