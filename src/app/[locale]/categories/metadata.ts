import { Metadata } from 'next'
import { type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n'

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}): Promise<Metadata> {
  const dict = await getDictionary(locale)
  
  const title = dict.categories?.title || 'Product Categories'
  const description = dict.categories?.description || 'Browse our product categories and discover your favorite items'
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : locale === 'ja' ? 'ja_JP' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/categories`,
      languages: {
        'zh': '/zh/categories',
        'en': '/en/categories', 
        'ja': '/ja/categories',
      }
    }
  }
} 