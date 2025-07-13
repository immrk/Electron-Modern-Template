<template>
  <title-bar />
  <login-box />
</template>

<script lang="ts" setup>
import LoginBox from "./components/loginBox.vue";
import titleBar from "./components/titlebar.vue";
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
</style>
