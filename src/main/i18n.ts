import path from 'path'
import { fileURLToPath } from 'url'
import i18next, { InitOptions, TOptions } from 'i18next'
import Backend from 'i18next-fs-backend'
import type { SupportedLanguages } from '../i18n/types.js'

/* -------------------------------------------------------------------------- */
/*  Paths & Constants                                                         */
/* -------------------------------------------------------------------------- */

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ⽀持的语⾔列表，如需新增，请在此处维护后再补充 locale JSON
export const SUPPORTED_LANGUAGES: SupportedLanguages[] = ['zh-CN', 'en-US']
const DEFAULT_LANGUAGE: SupportedLanguages = 'en-US'

/** 返回某语⾔包在磁盘中的绝对路径（⽅便后续插件或脚本采⽤） */
const localePath = (lng: string) =>
  path.join(__dirname, '../i18n/locales', `${lng}.json`)

/** 把语⾔写⼊进程环境变量，避免系统语⾔影响 i18next */
const patchProcessEnv = (lng: SupportedLanguages) => {
  Object.assign(process.env, {
    LANG: lng,
    LANGUAGE: lng,
    LC_ALL: lng,
  })
}

/* -------------------------------------------------------------------------- */
/*  Core Init                                                                 */
/* -------------------------------------------------------------------------- */

let initialized = false

export const initMainI18n = async (
  language: string,
): Promise<void> => {
  if (initialized) return // 避免重复初始化

  // 获取系统语言
  const lng = isLanguageSupported(language) ? language : DEFAULT_LANGUAGE
  patchProcessEnv(lng)

  const options: InitOptions = {
    lng,
    fallbackLng: {
      zh: ['zh-CN'],
      'zh-CN': ['zh-CN'],
      'zh-TW': ['zh-CN'],
      'zh-HK': ['zh-CN'],
      en: ['en-US'],
      'en-US': ['en-US'],
      'en-GB': ['en-US'],
      default: [DEFAULT_LANGUAGE],
    },
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['menu'],
    defaultNS: 'menu',
    backend: {
      loadPath: path.join(__dirname, '../i18n/locales/{{lng}}.json'),
      addPath: path.join(__dirname, '../i18n/locales/{{lng}}.json'),
    },
    interpolation: { escapeValue: false },
    debug: process.env.NODE_ENV === 'development',
    initImmediate: false,
  }

  await i18next.use(Backend).init(options)
  initialized = true
}

/* -------------------------------------------------------------------------- */
/*  Helpers & Public API                                                      */
/* -------------------------------------------------------------------------- */

export const t = (key: string, options?: TOptions): string =>
  (i18next.t(key, options) as string) ?? key

export const setLanguage = async (
  language: SupportedLanguages,
): Promise<void> => {
  if (!isLanguageSupported(language)) return
  await i18next.changeLanguage(language)
}

export const getCurrentLanguage = (): SupportedLanguages =>
  (i18next.language ?? DEFAULT_LANGUAGE) as SupportedLanguages

export const getSupportedLanguages = (): SupportedLanguages[] => SUPPORTED_LANGUAGES

export const isLanguageSupported = (lng: string): lng is SupportedLanguages =>
  SUPPORTED_LANGUAGES.includes(lng as SupportedLanguages)