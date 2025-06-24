"use client"

import { useState, useEffect } from "react"
import { type Locale } from "@/lib/i18n/config"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductsGrid } from "@/components/products-grid"
import { ProductsGridSkeleton } from "@/components/products-grid-skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, Filter, SortDesc } from "lucide-react"

interface Product {
  id: string
  title: string
  handle: string
  description: string
  price: string
  currencyCode: string
  image: string
  productType: string
  tags: string[]
  createdAt: string
  cursor: string
  variants: Array<{
    id: string
    title: string
    price: string
    available: boolean
  }>
}

interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

interface ProductsClientProps {
  locale: Locale
  dict: Record<string, any>
}

export function ProductsClient({ locale, dict }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null
  })
  const [sortKey, setSortKey] = useState<string>('CREATED_AT')
  const [reverse, setReverse] = useState(true)

  // 获取商品列表
  const fetchProducts = async (append = false, after?: string) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setProducts([])
      }

      const params = new URLSearchParams({
        first: '20',
        sortKey,
        reverse: reverse.toString()
      })
      
      if (after) {
        params.append('after', after)
      }

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        if (append) {
          setProducts(prev => [...prev, ...data.products])
        } else {
          setProducts(data.products || [])
        }
        setPageInfo(data.pageInfo || {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null
        })
      } else {
        setError(data.error || 'Failed to fetch products')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Network error')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchProducts()
  }, [sortKey, reverse])

  // 加载更多
  const loadMore = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      fetchProducts(true, pageInfo.endCursor)
    }
  }

  // 重试
  const handleRetry = () => {
    setError(null)
    fetchProducts()
  }

  // 改变排序
  const handleSortChange = (newSortKey: string, newReverse: boolean) => {
    setSortKey(newSortKey)
    setReverse(newReverse)
  }

  // 面包屑导航
  const breadcrumbItems = [
    { label: dict?.nav?.products || '商品', active: true }
  ]

  // JSON-LD 结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": dict.products?.title || '所有商品',
    "description": dict.products?.description || '浏览我们精心挑选的产品系列',
    "url": `/${locale}/products`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.title,
          "description": product.description,
          "image": product.image,
          "url": `/${locale}/products/${product.handle}`,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": product.currencyCode,
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    }
  }

  if (error) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {dict.products?.errorLoading || '商品加载失败'}
            </div>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {dict.common?.tryAgain || '重试'}
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* 页面标题和描述 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {dict.products?.title || '所有商品'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {dict.products?.description || '浏览我们精心挑选的产品系列'}
          </p>
        </div>

        {/* 工具栏 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            {!loading && (
              <span>
                {products.length} {dict.products?.productsCount || '件商品'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* 排序按钮 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {dict.products?.sortBy || '排序方式'}:
              </span>
              <Button
                variant={sortKey === 'TITLE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('TITLE', false)}
              >
                <SortDesc className="h-3 w-3 mr-1" />
                {dict.products?.sortByTitle || '按名称'}
              </Button>
              <Button
                variant={sortKey === 'PRICE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('PRICE', false)}
              >
                <SortDesc className="h-3 w-3 mr-1" />
                {dict.products?.sortByPrice || '按价格'}
              </Button>
              <Button
                variant={sortKey === 'CREATED_AT' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('CREATED_AT', true)}
              >
                <SortDesc className="h-3 w-3 mr-1" />
                {dict.products?.sortByCreated || '按时间'}
              </Button>
            </div>
          </div>
        </div>

        {/* 商品网格 */}
        {loading ? (
          <ProductsGridSkeleton count={20} />
        ) : products.length > 0 ? (
          <>
            <ProductsGrid products={products} locale={locale} />
            
            {/* 加载更多按钮 */}
            {pageInfo.hasNextPage && (
              <div className="text-center mt-12">
                <Button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {dict.common?.loading || '加载中...'}
                    </>
                  ) : (
                    dict.products?.loadMore || '加载更多'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">
              {dict.products?.noProducts || '暂无商品'}
            </div>
          </div>
        )}
      </div>
    </>
  )
} 