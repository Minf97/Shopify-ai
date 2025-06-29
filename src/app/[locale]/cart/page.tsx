import { type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n'
import { generateMetadata as generateCartMetadata } from './metadata'
import CartDetailsClient from './client'

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { locale } = await params
  return generateCartMetadata(locale)
}

export default async function CartDetailsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <CartDetailsClient dict={dict} locale={locale} />
} 