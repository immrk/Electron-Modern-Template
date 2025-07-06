import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

export const SUPPORT_LOCALES = ['zh-CN', 'en-US']

function getLocale(): string {
  const saved = localStorage.getItem('locale')
  if (saved && SUPPORT_LOCALES.includes(saved)) return saved
  const browserLang = navigator.language.split('-')[0]
  return SUPPORT_LOCALES.includes(browserLang) ? browserLang : 'zh-CN'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: getLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
  globalInjection: true, // 允许在模板中直接使用 $t
})

export default i18n
