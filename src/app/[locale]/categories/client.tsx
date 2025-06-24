"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { type Locale } from "@/lib/i18n/config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductsGrid } from "@/components/products-grid"
import { ProductsGridSkeleton } from "@/components/products-grid-skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Collection {
  id: string
  title: string
  handle: string
  description?: string
  image?: string
}

interface Product {
  id: string
  title: string
  handle: string
  description: string
  price: string
  image: string
  productType: string
  tags: string[]
  variants: Array<{
    id: string
    title: string
    price: string
    available: boolean
  }>
}

interface CollectionWithProducts {
  collection: Collection
  products: Product[]
}

interface CategoriesClientProps {
  locale: Locale
  dict: Record<string, any>
}

export function CategoriesClient({ locale, dict }: CategoriesClientProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [collectionData, setCollectionData] = useState<Record<string, CollectionWithProducts>>({})
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  // 获取分类列表
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (response.ok) {
          setCollections(data.collections || [])
          // 默认选择第一个分类
          if (data.collections && data.collections.length > 0) {
            setActiveTab(data.collections[0].handle)
          }
        } else {
          setError(data.error || 'Failed to fetch collections')
        }
      } catch (err) {
        console.error('Error fetching collections:', err)
        setError('Network error')
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // 获取指定分类的商品
  const fetchProductsByCollection = async (handle: string) => {
    if (collectionData[handle] || loadingProducts[handle]) return

    try {
      setLoadingProducts(prev => ({ ...prev, [handle]: true }))
      const response = await fetch(`/api/categories/${handle}`)
      const data = await response.json()
      
      if (response.ok) {
        setCollectionData(prev => ({
          ...prev,
          [handle]: data
        }))
      } else {
        console.error('Failed to fetch products:', data.error)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoadingProducts(prev => ({ ...prev, [handle]: false }))
    }
  }

  // 当切换分类时获取商品
  useEffect(() => {
    if (activeTab && activeTab !== "all") {
      fetchProductsByCollection(activeTab)
    }
  }, [activeTab])

  // 面包屑导航
  const breadcrumbItems = [
    { label: dict?.nav?.categories || '分类', active: true }
  ]

  const handleRetry = () => {
    setError(null)
    window.location.reload()
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {dict.categories?.errorLoading || '加载失败，请重试'}
          </div>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {dict.common?.tryAgain || '重试'}
          </Button>
        </div>
      </div>
    )
  }

  // JSON-LD 结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": dict.categories?.title || '商品分类',
    "description": dict.categories?.description || '浏览我们的商品分类，发现您喜爱的产品',
    "url": `/${locale}/categories`,
    "mainEntity": {
      "@type": "ItemList", 
      "itemListElement": collections.map((collection, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "ProductCollection",
          "name": collection.title,
          "description": collection.description,
          "url": `/${locale}/categories#${collection.handle}`,
          ...(collection.image && { "image": collection.image })
        }
      }))
    }
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
            {dict.categories?.title || '商品分类'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {dict.categories?.description || '浏览我们的商品分类，发现您喜爱的产品'}
          </p>
        </div>

        {loading ? (
          <ProductsGridSkeleton count={8} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* 分类标签 */}
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 h-auto mb-8">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {dict.categories?.allCategories || '全部分类'}
              </TabsTrigger>
              {collections.map((collection) => (
                <TabsTrigger 
                  key={collection.handle} 
                  value={collection.handle}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {collection.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* 全部分类概览 */}
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div 
                    key={collection.id}
                    className="group cursor-pointer bg-card hover:bg-card/80 rounded-2xl overflow-hidden border border-border hover:border-border/60 shadow-sm transition-all duration-200"
                    onClick={() => setActiveTab(collection.handle)}
                  >
                    {/* 分类图片 */}
                    {collection.image && (
                      <div className="relative aspect-video bg-muted">
                        <Image
                          src={collection.image}
                          alt={collection.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    
                    {/* 分类信息 */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
                        {collection.title}
                      </h3>
                      {collection.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 各分类的商品 */}
            {collections.map((collection) => (
              <TabsContent key={collection.handle} value={collection.handle} className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-muted-foreground">
                      {collection.description}
                    </p>
                  )}
                </div>

                {loadingProducts[collection.handle] ? (
                  <ProductsGridSkeleton count={12} />
                ) : collectionData[collection.handle] ? (
                  <div>
                    {collectionData[collection.handle].products.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <p className="text-muted-foreground">
                            {collectionData[collection.handle].products.length} {dict.categories?.productsCount || '件商品'}
                          </p>
                        </div>
                        <ProductsGrid 
                          products={collectionData[collection.handle].products} 
                          locale={locale}
                        />
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-muted-foreground text-lg">
                          {dict.categories?.noProducts || '该分类暂无商品'}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <ProductsGridSkeleton count={12} />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </>
  )
} 