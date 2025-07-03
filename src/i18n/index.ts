import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import type { SupportedLanguages, I18nNamespace } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 语言包缓存
const localeCache = new Map<SupportedLanguages, I18nNamespace>()

// 当前语言
let currentLanguage: SupportedLanguages = 'zh-CN'

// 加载语言包
const loadLocale = (language: SupportedLanguages): I18nNamespace => {
  if (localeCache.has(language)) {
    return localeCache.get(language)!
  }

  try {
    const localePath = join(__dirname, 'locales', `${language}.json`)
    const localeData = readFileSync(localePath, 'utf-8')
    const locale = JSON.parse(localeData) as I18nNamespace
    localeCache.set(language, locale)
    return locale
  } catch (error) {
    console.error(`Failed to load locale: ${language}`, error)
    // 如果加载失败，返回默认的中文语言包
    return loadLocale('zh-CN')
  }
}

// 获取翻译文本
export const t = (key: string, language?: SupportedLanguages): string => {
  const lang = language || currentLanguage
  const locale = loadLocale(lang)
  
  const keys = key.split('.')
  let value: any = locale
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key not found: ${key} for language: ${lang}`)
      return key
    }
  }
  
  return value as string
}

// 设置当前语言
export const setLanguage = (language: SupportedLanguages): void => {
  currentLanguage = language
}

// 获取当前语言
export const getCurrentLanguage = (): SupportedLanguages => {
  return currentLanguage
}

// 获取支持的语言列表
export const getSupportedLanguages = (): SupportedLanguages[] => {
  return ['zh-CN', 'en-US']
}

// 获取语言包
export const getLocale = (language?: SupportedLanguages): I18nNamespace => {
  const lang = language || currentLanguage
  return loadLocale(lang)
}

// 初始化i18n
export const initI18n = (defaultLanguage: SupportedLanguages = 'zh-CN'): void => {
  currentLanguage = defaultLanguage
  // 预加载默认语言包
  loadLocale(defaultLanguage)
} 