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
import { useDark } from '@vueuse/core';

const currentMenu = ref(MenuEnum.HOME);

const handleMenuClick = (name: MenuEnum) => {
  currentMenu.value = name;
};

const isDark = useDark();
const themeColor = ref("system");

const initTheme = () => {
  window.system
    .getTheme()
    .then((theme: { data: { storeTheme: string | undefined; systemTheme: string } }) => {
      themeColor.value = theme.data.storeTheme || "system";
      if (themeColor.value === "system") {
        isDark.value = theme.data.systemTheme === "dark";
      } else {
        isDark.value = themeColor.value === "dark";
      }
    });
};

onMounted(() => {
  // 初始化主题
  initTheme();
  // 监听主题变化
  window.system.onChangeTheme((theme: string) => {
    initTheme();
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