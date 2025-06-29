import type { Metadata } from 'next'

const faqTranslations = {
  zh: {
    title: '常见问题 - 智能客服助手',
    description: '我们的智能助手可以帮您解答关于产品、订单、配送等各种问题'
  },
  en: {
    title: 'FAQ - AI Customer Service',
    description: 'Our intelligent assistant can help you with product, order, shipping and other questions'
  },
  ja: {
    title: 'よくある質問 - AIカスタマーサービス',
    description: '当社のインテリジェントアシスタントが商品、注文、配送などの様々な質問にお答えします'
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params
  const lang = locale.startsWith('zh') ? 'zh' : locale.startsWith('ja') ? 'ja' : 'en'
  const t = faqTranslations[lang as keyof typeof faqTranslations]
  
  return {
    title: t.title,
    description: t.description,
    keywords: ['FAQ', '常见问题', '客服', '智能助手', 'AI客服', '购物帮助'],
    openGraph: {
      title: t.title,
      description: t.description,
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
    alternates: {
      canonical: `/${locale}/faq`,
      languages: {
        'zh-CN': '/zh/faq',
        'en-US': '/en/faq',
        'ja-JP': '/ja/faq'
      }
    }
  }
} 