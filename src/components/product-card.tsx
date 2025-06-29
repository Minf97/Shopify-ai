"use client"

import { useState } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface Product {
  id: string
  title: string
  price: string
  image: string
  handle: string
  description: string
  variants?: Array<{
    id: string
    title: string
    price: string
    available: boolean
  }>
}

interface ProductCardProps {
  product: Product
  locale: string
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    try {
      // 获取变体ID，如果没有变体则使用产品ID
      const variantId = product.variants?.[0]?.id || product.id

      console.log(variantId, "variantId");
      
      
      // 调试信息
      console.log('=== Add to Cart Debug ===')
      console.log('Product:', product.title)
      console.log('Product ID:', product.id)
      console.log('Variants:', product.variants)
      console.log('Selected Variant ID:', variantId)
      console.log('==========================')
      
      if (!variantId) {
        throw new Error('No variant ID available')
      }
      
      const success = await addToCart(variantId, 1)
      
      if (success) {
        toast.success(
          locale === 'zh' ? `${product.title} 已添加到购物车` :
          locale === 'ja' ? `${product.title} がカートに追加されました` :
          `${product.title} added to cart`
        )
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(
        locale === 'zh' ? '添加失败，请重试' :
        locale === 'ja' ? '追加に失敗しました。再試行してください' :
        'Failed to add item. Please try again.'
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-square bg-card hover:bg-card/80 active:bg-card/60 rounded-2xl overflow-hidden mb-4 border border-border hover:border-border/60 active:border-border/40 shadow-sm transition-colors duration-200">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
        
        {/* Add to Cart Button */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-200 flex items-center justify-center">
          <Button 
            size="sm"
            className="bg-primary hover:bg-primary/80 active:bg-primary/70 text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full shadow-lg cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {locale === 'zh' && '添加中...'}
                {locale === 'ja' && '追加中...'}
                {locale === 'en' && 'Adding...'}
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {locale === 'zh' && '加入购物车'}
                {locale === 'ja' && 'カートに追加'}
                {locale === 'en' && 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-foreground text-lg group-hover:text-primary transition-colors duration-200">
          {product.title}
        </h3>
        <p className="font-semibold text-foreground text-xl">
          ${parseFloat(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  )
} 