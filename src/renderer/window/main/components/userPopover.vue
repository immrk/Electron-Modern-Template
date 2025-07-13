<template>
  <div class="main-container">
    <div v-if="isLogin">
      <p>{{ $t('main.login.logined') }}</p>
    </div>
    <div class="login-container" v-else>
      <p>{{ $t('main.login.unlogin') }}</p>
      <el-button style="width: 100%" type="primary" @click="handleLogin">{{ $t('main.login.toLogin') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLogin: boolean;
}>();

const handleLogin = () => {
  (window as any).windowManager.createWindow("login");
};
</script>

<style scoped>
.main-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>