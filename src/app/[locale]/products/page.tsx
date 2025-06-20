"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";

export default function ProductsPage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getDictionary(locale).then(setDict);
  }, [locale]);

  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{locale === 'zh' ? '加载中...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {dict.nav.products}
          </h1>
          <p className="text-muted-foreground text-lg">
            {locale === 'zh' && '浏览我们精心挑选的产品系列'}
            {locale === 'ja' && '厳選された商品コレクションをご覧ください'}
            {locale === 'en' && 'Browse our carefully curated product collection'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 示例产品卡片 */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-card rounded-lg p-6 border">
              <div className="aspect-square bg-muted rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">
                {locale === 'zh' && `产品 ${item}`}
                {locale === 'ja' && `商品 ${item}`}
                {locale === 'en' && `Product ${item}`}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {locale === 'zh' && '这是一个示例产品描述。'}
                {locale === 'ja' && 'これはサンプル商品の説明です。'}
                {locale === 'en' && 'This is a sample product description.'}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">$99.99</span>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                  {dict.sections.addToCart}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center bg-card border rounded-lg p-4">
            <div className="mr-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-left">
              <div className="font-medium">
                {locale === 'zh' && '重定向测试成功！'}
                {locale === 'ja' && 'リダイレクトテスト成功！'}
                {locale === 'en' && 'Redirect Test Successful!'}
              </div>
              <div className="text-sm text-muted-foreground">
                {locale === 'zh' && `当前语言: 中文 (${locale})`}
                {locale === 'ja' && `現在の言語: 日本語 (${locale})`}
                {locale === 'en' && `Current language: English (${locale})`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 