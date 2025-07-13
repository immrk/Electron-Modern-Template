import { createApp } from 'vue'
import App from './App.vue'
import i18n from '../../i18n'
import ElementPlus from 'element-plus'

// 由于使用了按需引入，以下组件样式会丢失，暂时需要手动引入
// import "element-plus/theme-chalk/el-message-box.css"
// import "element-plus/theme-chalk/el-loading.css"
// import "element-plus/theme-chalk/el-message.css"
// import "element-plus/theme-chalk/el-notification.css"

createApp(App).use(ElementPlus).use(i18n).mount('#app') 