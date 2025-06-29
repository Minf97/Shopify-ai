import { Suspense } from 'react'
import { generateMetadata } from './metadata'
import FAQClient from './client'
import { Skeleton } from '@/components/ui/skeleton'

export { generateMetadata }

const faqTranslations = {
  zh: {
    title: '常见问题',
    description: '我们的智能助手可以帮您解答关于产品、订单、配送等各种问题'
  },
  en: {
    title: 'Frequently Asked Questions',
    description: 'Our intelligent assistant can help you with product, order, shipping and other questions'
  },
  ja: {
    title: 'よくある質問',
    description: '当社のインテリジェントアシスタントが商品、注文、配送などの様々な質問にお答えします'
  }
}

export default async function FAQPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const lang = locale.startsWith('zh') ? 'zh' : locale.startsWith('ja') ? 'ja' : 'en'
  const t = faqTranslations[lang as keyof typeof faqTranslations]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 elite-gradient-text">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Chat Interface */}
        <Suspense fallback={<FAQSkeleton />}>
          <FAQClient locale={lang} />
        </Suspense>
      </div>
    </div>
  )
}

function FAQSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border rounded-2xl shadow-lg p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-4 mb-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-3/4 ml-auto" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
} 