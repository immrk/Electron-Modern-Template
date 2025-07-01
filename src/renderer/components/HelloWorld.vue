<template>
  <div class="hello-world">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <div class="interactive-demo">
      <input 
        v-model="inputText" 
        placeholder="输入一些文字..."
        class="input-field"
      />
      <p v-if="inputText" class="echo-text">
        你输入的内容: <strong>{{ inputText }}</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '这是一个示例组件',
  message: '这个组件演示了Vue 3的基本功能'
})

const inputText = ref('')
</script>

<style scoped>
.hello-world {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
}

.hello-world h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.hello-world p {
  color: #666;
  margin-bottom: 1rem;
}

.interactive-demo {
  margin-top: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.echo-text {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
  color: #333;
}
</style> 