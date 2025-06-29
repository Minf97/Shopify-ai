import { type Metadata } from 'next'
import { getDictionary } from '@/lib/i18n'
import { type Locale } from '@/lib/i18n/config'

export async function generateMetadata(locale: Locale): Promise<Metadata> {
  const dict = await getDictionary(locale)

  return {
    title: `${dict.cart.detailsTitle} | Grace`,
    description: dict.cart.basedOnCart,
    keywords: [
      dict.cart.title,
      dict.cart.detailsTitle,
      dict.cart.recommendedProducts,
      dict.nav.cart,
      'shopping cart',
      'ecommerce'
    ],
    openGraph: {
      title: `${dict.cart.detailsTitle} | Grace`,
      description: dict.cart.basedOnCart,
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.cart.detailsTitle} | Grace`,
      description: dict.cart.basedOnCart,
    },
  }
} 