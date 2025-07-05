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
              <div class="card-icon">
                <component :is="item.icon" />
              </div>
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
import { ref } from "vue";

const featureList = ref([
  {
    title: "现代化开发体验",
    description: "基于Vue 3 + TypeScript + Vite构建，提供热重载、类型安全等现代化开发体验",
    icon: "Monitor"
  },
  {
    title: "跨平台兼容",
    description: "支持Windows、macOS、Linux三大主流操作系统，一次开发，多平台部署",
    icon: "Platform"
  },
  {
    title: "丰富的UI组件",
    description: "集成Element Plus组件库，提供美观且功能丰富的用户界面组件",
    icon: "Brush"
  },
  {
    title: "开发工具集成",
    description: "内置调试工具、打包配置、代码规范检查，提升开发效率",
    icon: "Tools"
  },
  {
    title: "安全性保障",
    description: "遵循Electron安全最佳实践，提供安全的桌面应用开发方案",
    icon: "Shield"
  },
  {
    title: "性能优化",
    description: "优化的构建配置和运行时性能，确保应用流畅运行",
    icon: "Zap"
  }
]);
</script>

<style scoped>
.home {
  height: 100%;
  width: 100%;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #ffffff;
  overflow-y: auto;
}

.hero-section {
  padding: 80px 40px 60px;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
}

.logo-container {
  max-width: 600px;
  margin: 0 auto;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 32px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.description {
  font-size: 20px;
  font-weight: 400;
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.content-section {
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 48px;
  color: #1e293b;
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.feature-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
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
  color: #ffffff;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.feature-card :deep(.el-card__body) {
  padding: 24px;
  background: #ffffff;
}

.card-content {
  color: #333333;
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

/* 添加一些动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card {
  animation: fadeInUp 0.6s ease-out;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:nth-child(5) { animation-delay: 0.5s; }
.feature-card:nth-child(6) { animation-delay: 0.6s; }
</style>
