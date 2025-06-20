import { i18nConfig, type Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
  'zh-TW': () => import('./dictionaries/zh.json').then((module) => module.default), // 暂时使用简体中文
  ko: () => import('./dictionaries/en.json').then((module) => module.default), // 暂时使用英文
}

export const getDictionary = async (locale: Locale) => {
  const validLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale
  return dictionaries[validLocale as keyof typeof dictionaries]?.() ?? dictionaries[i18nConfig.defaultLocale as keyof typeof dictionaries]()
}

export const getLocaleFromUrl = (pathname: string): Locale => {
  const segments = pathname.split('/')
  const potentialLocale = segments[1] as Locale
  
  if (i18nConfig.locales.includes(potentialLocale)) {
    return potentialLocale
  }
  
  return i18nConfig.defaultLocale
}

export const removeLocaleFromUrl = (pathname: string): string => {
  const segments = pathname.split('/')
  const potentialLocale = segments[1] as Locale
  
  if (i18nConfig.locales.includes(potentialLocale)) {
    return '/' + segments.slice(2).join('/')
  }
  
  return pathname
}

export const addLocaleToUrl = (pathname: string, locale: Locale): string => {
  const cleanPath = removeLocaleFromUrl(pathname)
  
  if (locale === i18nConfig.defaultLocale) {
    return cleanPath || '/'
  }
  
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
} 