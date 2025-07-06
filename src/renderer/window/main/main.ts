import { createApp } from 'vue'
import App from './App.vue'
import i18n from '../../i18n'
import ElementPlus from 'element-plus'

createApp(App).use(ElementPlus).use(i18n).mount('#app')