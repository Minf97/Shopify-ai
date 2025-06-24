"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { ProductsGridSkeleton } from '@/components/products-grid-skeleton'
import { ProductCard } from '@/components/product-card'
import { 
  ShoppingBag, 
  Minus, 
  Plus, 
  X, 
  ArrowLeft,
  Heart
} from 'lucide-react'
import { type CartItem } from '@/lib/shopify/cart'

// API返回的产品类型（已扁平化）
interface ApiProduct {
  id: string
  title: string
  handle: string
  description: string
  price: string
  image: string
  productType: string
  variants: Array<{
    id: string
    title: string
    price: string
    available: boolean
  }>
}

interface CartDetailsClientProps {
  dict: Record<string, any>
  locale: string
}

export default function CartDetailsClient({ dict, locale }: CartDetailsClientProps) {
  const { 
    cart, 
    updateQuantity, 
    removeItem, 
    isInitializing,
    totalItems,
    subtotal
  } = useCart()
  
  const [recommendedProducts, setRecommendedProducts] = useState<ApiProduct[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  // 获取购物车商品列表
  const items = cart?.lines.edges.map(edge => edge.node) || []

  // 获取推荐商品 - 只在购物车ID变化时触发
  useEffect(() => {
    const fetchRecommendations = async () => {
      // 如果没有购物车商品，则不请求推荐商品
      if (items.length === 0) {
        setRecommendedProducts([])
        return
      }

      setIsLoadingRecommendations(true)
      try {
        // 简单地获取一些随机商品作为推荐
        const response = await fetch(`/api/products?limit=8&sortKey=CREATED_AT&reverse=true`)
        if (response.ok) {
          const data = await response.json()
          // 过滤掉已在购物车中的商品
          const cartProductHandles = items.map((item: CartItem) => item.merchandise.product.handle)
          const filtered = data.products?.filter((product: ApiProduct) => 
            !cartProductHandles.includes(product.handle)
          ) || []
          
          // 随机选择4个商品
          const shuffled = filtered.sort(() => 0.5 - Math.random())
          setRecommendedProducts(shuffled.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      } finally {
        setIsLoadingRecommendations(false)
      }
    }

    // 只在购物车ID变化时触发，避免无限循环
    if (cart?.id) {
      fetchRecommendations()
    }
  }, [cart?.id]) // 只依赖购物车ID

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ProductsGridSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {dict.cart.backToShopping}
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {dict.cart.detailsTitle}
          </h1>
          <p className="text-muted-foreground mt-2">
            {totalItems > 0 ? `${totalItems} ${dict.cart.items}` : dict.cart.empty}
          </p>
        </div>

        {items.length === 0 ? (
          /* 空购物车状态 */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {dict.cart.empty}
            </h2>
            <p className="text-muted-foreground mb-8">
              {dict.cart.continueShopping}
            </p>
            <Button asChild>
              <Link href={`/${locale}/products`}>
                {dict.cart.continueShopping}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 购物车商品列表 */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {dict.cart.title}
                </h2>
                
                                 <div className="space-y-6">
                   {items.map((item: CartItem) => (
                     <div key={item.id} className="flex gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0">
                       {/* 商品图片 */}
                       <div className="relative w-24 h-24 flex-shrink-0">
                         <Image
                           src={item.merchandise.image?.url || '/placeholder-product.jpg'}
                           alt={item.merchandise.title}
                           fill
                           className="object-cover rounded-md"
                         />
                       </div>
                       
                       {/* 商品信息 */}
                       <div className="flex-1 min-w-0">
                         <h3 className="font-medium text-foreground truncate">
                           {item.merchandise.product.title}
                         </h3>
                         {item.merchandise.title !== item.merchandise.product.title && (
                           <p className="text-sm text-muted-foreground">
                             {item.merchandise.title}
                           </p>
                         )}
                         <p className="text-lg font-semibold text-foreground mt-2">
                           ${item.merchandise.priceV2.amount}
                         </p>
                        
                        {/* 数量控制 */}
                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex items-center border border-input rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4 mr-1" />
                            {dict.cart.remove}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 购物车汇总 */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {dict.cart.cartSummary}
                </h2>
                
                                 <div className="space-y-4">
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">{dict.cart.subtotal}</span>
                     <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                   </div>
                   
                   <div className="text-sm text-muted-foreground">
                     {dict.cart.shippingCalculated}
                   </div>
                   
                   <hr className="border-border" />
                   
                   <div className="flex justify-between text-lg font-semibold">
                     <span className="text-foreground">{dict.cart.total}</span>
                     <span className="text-foreground">${subtotal.toFixed(2)}</span>
                   </div>
                  
                  <Button className="w-full" size="lg">
                    {dict.cart.proceedToCheckout}
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/${locale}/products`}>
                      {dict.cart.continueShopping}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 推荐商品区域 */}
        {items.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {dict.cart.recommendedProducts}
              </h2>
              <p className="text-muted-foreground">
                {dict.cart.basedOnCart}
              </p>
            </div>

            {isLoadingRecommendations ? (
              <ProductsGridSkeleton />
            ) : recommendedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {dict.cart.similarProducts}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 