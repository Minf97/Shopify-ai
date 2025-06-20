export const i18nConfig = {
  locales: ['en', 'zh', 'zh-TW', 'ja', 'ko'],
  defaultLocale: 'en',
  localeDomains: [
    {
      domain: 'elitestore.com',
      defaultLocale: 'en',
    },
    {
      domain: 'elitestore.cn',
      defaultLocale: 'zh',
    },
  ],
}

export type Locale = (typeof i18nConfig)['locales'][number]

export const localeNames = {
  en: 'English',
  zh: '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
} as const 