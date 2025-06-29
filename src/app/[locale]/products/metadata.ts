import { Metadata } from 'next'
import { type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n'

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}): Promise<Metadata> {
  const dict = await getDictionary(locale)
  
  const title = dict.products?.title || 'All Products'
  const description = dict.products?.description || 'Browse our carefully curated product collection'
  
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
      canonical: `/${locale}/products`,
      languages: {
        'zh': '/zh/products',
        'en': '/en/products', 
        'ja': '/ja/products',
      }
    }
  }
} 