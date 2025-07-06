<template>
  <div class="home">
    <div class="hero-section">
      <div class="logo-container">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="title">Electron-Modern-Template</h1>
        <p class="description">现代化Electron开发框架，让桌面应用开发更简单高效</p>
      </div>
    </div>
    
    <div class="content-section">
      <h2 class="section-title">核心特性</h2>
      <div class="feature-grid">
        <el-card
          class="feature-card"
          shadow="hover"
          v-for="item in featureList"
          :key="item.title"
        >
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon" :size="30" color="#fff">
                <component :is="item.icon" />
              </el-icon>
              <span class="card-title">{{ item.title }}</span>
            </div>
          </template>
          <div class="card-content">
            <p class="card-description">{{ item.description }}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { Platform, Monitor, Brush, Tools } from "@element-plus/icons-vue";

const featureList = ref([
  {
    title: "现代化开发体验",
    description: "基于Vue3(即将支持React) + TypeScript + Vite构建，提供热重载、类型安全等现代化开发体验",
    icon: () => h(Monitor)
  },
  {
    title: "跨平台兼容",
    description: "支持Windows、macOS、Linux三大主流操作系统，一次开发，多平台部署",
    icon: () => h(Platform)
  },
  {
    title: "自动按需导入的UI组件",
    description: "集成Element Plus组件库，提供美观且功能丰富的用户界面组件的同时, 无需手动导入，支持自定义主题",
    icon: () => h(Brush)
  },
  {
    title: "i18n国际化支持",
    description: "Electron主进程、渲染进程、UI组件均已集成国际化，支持多语言切换；快速构建多语言应用",
    icon: () => h(Tools)
  },
]);
</script>

<style scoped>
.home {
  height: 100%;
  width: 100%;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--el-bg-color);
  overflow-y: auto;
}

.hero-section {
  padding: 80px 40px 60px;
  text-align: center;
  background: linear-gradient(135deg, var(--el-bg-color) 0%, var(--el-bg-color) 100%);
  border-bottom: 1px solid var(--el-border-color);
}

.logo-container {
  max-width: 600px;
  margin: 0 auto;
}

.logo-icon {
  width: 80px;
  height: 80px;
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

.title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.description {
  font-size: 20px;
  margin: 0;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.content-section {
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 48px;
  color: var(--el-text-color-regular);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
  justify-items: center;
}

.feature-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 24px;
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-light);
}

.feature-card :deep(.el-card__body) {
  padding: 24px;
}

.card-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px 40px;
  }
  
  .title {
    font-size: 36px;
  }
  
  .description {
    font-size: 18px;
  }
  
  .content-section {
    padding: 40px 20px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-card {
    max-width: 100%;
  }
}
</style>
