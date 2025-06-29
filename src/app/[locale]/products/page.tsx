import { type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n"
import { ProductsClient } from "./client"

// Metadata 导出
export { generateMetadata } from './metadata'

interface ProductsPageProps {
  params: {
    locale: Locale
  }
}

export default async function ProductsPage({ params: { locale } }: ProductsPageProps) {
  const dict = await getDictionary(locale)
  
  return <ProductsClient locale={locale} dict={dict} />
} 