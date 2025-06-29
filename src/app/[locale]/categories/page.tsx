import { type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n"
import { CategoriesClient } from "./client"

// Metadata 导出
export { generateMetadata } from './metadata'

interface CategoriesPageProps {
  params: {
    locale: Locale
  }
}

export default async function CategoriesPage({ params: { locale } }: CategoriesPageProps) {
  const dict = await getDictionary(locale)
  
  return <CategoriesClient locale={locale} dict={dict} />
}
