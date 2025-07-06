# Vue-i18n 封装方案总结

## 概述

我为你的 Electron + Vue 项目创建了一个完整的 Vue-i18n 封装方案，支持在多窗口（多个Vue项目）中调用，实现了主进程与渲染进程之间的语言同步。

## 解决的问题

1. **多窗口语言同步** - 在任意窗口切换语言时，所有窗口自动同步
2. **主进程通信** - 通过 IPC 与主进程同步语言设置
3. **响应式更新** - 使用 Vue 3 Composition API 实现响应式语言切换
4. **类型安全** - 完整的 TypeScript 支持
5. **异步初始化** - 解决 Vue-i18n 异步初始化的类型问题

## 架构设计

```
┌─────────────────┐    IPC     ┌─────────────────┐
│   主进程 i18n   │ ←──────→   │   渲染进程 i18n │
│   (i18next)     │            │   (vue-i18n)    │
└─────────────────┘            └─────────────────┘
         │                              │
         │                              │
    ┌────▼────┐                   ┌─────▼─────┐
    │  Store  │                   │  Vue App  │
    │(持久化) │                   │(多窗口)   │
    └─────────┘                   └───────────┘
```

## 核心文件结构

```
src/
├── preload/
│   └── apis/
│       └── i18n.ts              # i18n API 暴露
├── renderer/
│   ├── composables/
│   │   └── useI18n.ts           # i18n Composable
│   ├── components/
│   │   └── LanguageSwitcher.vue # 语言切换组件
│   ├── plugins/
│   │   └── i18n.ts              # Vue i18n 插件
│   ├── i18n/
│   │   ├── index.ts             # i18n 核心逻辑
│   │   ├── locales/             # 语言包文件
│   │   └── README.md            # 使用文档
│   └── examples/                # 使用示例
└── vite-env.d.ts               # 类型定义
```

## 主要特性

### 1. 响应式语言切换

```typescript
const { locale, changeLocale } = useI18n()

// 切换语言，所有窗口自动同步
await changeLocale('en-US')
```

### 2. 多窗口支持

- 在任意窗口切换语言，所有窗口自动更新
- 主进程与渲染进程通过 IPC 通信
- 语言设置持久化存储

### 3. 类型安全

```typescript
// 完整的 TypeScript 支持
interface I18nAPI {
  getCurrentLanguage: () => Promise<{ data: string }>
  setLanguage: (language: string) => Promise<{ success: boolean }>
  // ...
}
```

### 4. 简单易用

```vue
<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <p>{{ $t('greeting', { name: 'World' }) }}</p>
    <LanguageSwitcher />
  </div>
</template>
```

## 使用方法

### 1. 在 Vue 应用中安装

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { installI18nPlugin } from './plugins/i18n.js'

async function bootstrap() {
  const app = createApp(App)
  await installI18nPlugin(app)
  app.mount('#app')
}

bootstrap()
```

### 2. 在组件中使用

```vue
<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <LanguageSwitcher />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n.js'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { locale, changeLocale } = useI18n()
</script>
```

### 3. 使用 Composable

```typescript
const { 
  locale,           // 当前语言（响应式）
  loading,          // 加载状态
  changeLocale,     // 切换语言
  t,               // 翻译函数
  getSupportedLocales, // 获取支持的语言列表
} = useI18n()
```

## 支持的语言

- `zh-CN` - 中文（简体）
- `en-US` - 英文（美国）
- `system` - 跟随系统

## 语言包格式

```json
{
  "hello": "你好，世界",
  "welcome": "欢迎使用",
  "greeting": "你好，{name}！",
  "i18n": {
    "title": "Vue-i18n 封装示例",
    "basicUsage": "基本用法"
  }
}
```

## 最佳实践

### 1. 组件中使用

```vue
<template>
  <!-- 推荐：使用 $t 在模板中 -->
  <h1>{{ $t('page.title') }}</h1>
  
  <!-- 推荐：使用 computed 处理复杂逻辑 -->
  <p>{{ greetingText }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

// 推荐：使用 computed 处理带参数的翻译
const greetingText = computed(() => {
  return t('greeting', { name: 'World' })
})
</script>
```

### 2. 错误处理

```typescript
const { changeLocale } = useI18n()

const switchLanguage = async (newLocale: string) => {
  try {
    await changeLocale(newLocale)
    ElMessage.success('语言切换成功')
  } catch (error) {
    ElMessage.error('语言切换失败')
    console.error('Language switch failed:', error)
  }
}
```

## 扩展性

### 添加新语言

1. 在 `i18nConfig.ts` 中添加语言代码
2. 创建对应的语言包文件 `locales/xx-XX.json`
3. 在 `useI18n.ts` 中导入新的语言包

### 自定义功能

- 可以扩展 `useI18n` composable 添加更多功能
- 可以自定义语言切换组件
- 可以添加更多语言包

## 优势

1. **统一管理** - 所有窗口使用同一个 i18n 实例
2. **自动同步** - 语言切换自动同步到所有窗口
3. **类型安全** - 完整的 TypeScript 支持
4. **易于使用** - 简单的 API 设计
5. **可扩展** - 支持添加新语言和功能
6. **性能优化** - 响应式更新，避免不必要的重渲染

## 总结

这个 Vue-i18n 封装方案提供了一个完整的解决方案，支持在 Electron 多窗口环境中使用，实现了：

- ✅ 多窗口语言同步
- ✅ 响应式语言切换
- ✅ 主进程与渲染进程通信
- ✅ TypeScript 支持
- ✅ Vue 3 Composition API
- ✅ 自动语言检测
- ✅ 语言持久化存储

通过这个封装，你可以在多个 Vue 项目中轻松使用统一的国际化功能，实现良好的用户体验。 