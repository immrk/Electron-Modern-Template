<template>
    <div class="login-app">
    <div class="logo-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="top" style="width: 60%;">
      <el-form-item :label="$t('login.email')" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
    </el-form>  
    <div class="button-container">
      <el-button type="primary" @click="handleLogin" :loading="loading">{{ $t('login.login') }}</el-button>
      <el-button @click="handleRegister">{{ $t('login.register') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { login } from '../../../service';

const rules = ref({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})

const form = ref({
  email: '',
  password: '',
});

const loading = ref(false);
const formRef = ref<FormInstance>();

const handleLogin = async () => {
  await formRef.value?.validate();
  loading.value = true;
  login(form.value).then(async (res) => {
    await window.auth.login(res);
    ElMessage.success('登录成功');
    setTimeout(() => {
      window.windowManager.closeWindow('login')
    }, 500)
  }).catch((error) => {
    ElMessage.error(error.message);
  }).finally(() => {
    loading.value = false;
  });
};

const handleRegister = () => {
  ElMessage.warning('暂未开放注册');
};
</script>

<style scoped>
.login-app {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 24px;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.button-container {
  display: flex;
  gap: 10px;
}
</style>