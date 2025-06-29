"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const params = useParams()
  const locale = params.locale as Locale
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())
  const { cart, isLoading, isInitializing, error, updateQuantity, removeItem, totalItems, subtotal } = useCart()

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  // 处理数量变更
  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    setLoadingItems(prev => new Set(prev).add(lineId))
    
    try {
      const success = await updateQuantity(lineId, newQuantity)
      if (!success) {
        toast.error(dict?.cart?.updateFailed || 'Update failed')
      }
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(lineId)
        return newSet
      })
    }
  }

  // 处理商品删除
  const handleRemoveItem = async (lineId: string) => {
    setLoadingItems(prev => new Set(prev).add(lineId))
    
    try {
      const success = await removeItem(lineId)
      if (!success) {
        toast.error(dict?.cart?.removeFailed || 'Remove failed')
      }
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(lineId)
        return newSet
      })
    }
  }

  // 获取购物车商品列表
  const cartItems = cart?.lines.edges.map(({ node }) => ({
    id: node.id,
    lineId: node.id,
    title: node.merchandise.product.title,
    variantTitle: node.merchandise.title,
    price: node.merchandise.priceV2.amount,
    currencyCode: node.merchandise.priceV2.currencyCode,
    quantity: node.quantity,
    image: node.merchandise.image?.url,
    imageAlt: node.merchandise.image?.altText || node.merchandise.product.title
  })) || []

  if (!dict) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-96 bg-background border-l shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                {dict.cart?.title || dict.nav?.cart || 'Shopping Cart'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {isInitializing ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {dict.common?.loading || 'Loading...'}
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-destructive mb-4" />
                <p className="text-destructive text-sm">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  {dict.cart?.retry || dict.common?.tryAgain || 'Retry'}
                </Button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {dict.cart?.empty || 'Your cart is empty'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const isItemLoading = loadingItems.has(item.lineId)
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`flex gap-3 p-3 bg-card rounded-lg border transition-opacity ${
                        isItemLoading ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            className="object-cover"
                          />
                        )}
                        {isItemLoading && (
                          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                        {item.variantTitle !== item.title && (
                          <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold">
                            {item.currencyCode === 'USD' ? '$' : item.currencyCode + ' '}
                            {parseFloat(item.price).toFixed(2)}
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              disabled={isItemLoading}
                              onClick={() => handleQuantityChange(item.lineId, item.quantity - 1)}
                            >
                              {isItemLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Minus className="h-3 w-3" />
                              )}
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              disabled={isItemLoading}
                              onClick={() => handleQuantityChange(item.lineId, item.quantity + 1)}
                            >
                              {isItemLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isInitializing && !error && cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>
                  {dict.cart?.subtotal || 'Subtotal'}
                </span>
                <span>
                  {cart?.cost.totalAmount.currencyCode === 'USD' ? '$' : cart?.cost.totalAmount.currencyCode + ' '}
                  {subtotal.toFixed(2)}
                </span>
              </div>

              {/* Item Count */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {totalItems} {dict.cart?.items || 'items'}
                </span>
              </div>

              {/* Shipping Note */}
              <p className="text-xs text-muted-foreground">
                {dict.cart?.shippingNote || 'Shipping calculated at checkout'}
              </p>

              {/* Checkout Button */}
              <Button 
                asChild 
                className="w-full" 
                disabled={isInitializing || cartItems.length === 0 || loadingItems.size > 0}
              >
                <Link href={cart?.checkoutUrl || '#'} onClick={onClose}>
                  {isInitializing || loadingItems.size > 0 ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {dict.cart?.processing || 'Processing...'}
                    </>
                  ) : (
                    dict.cart?.checkout || 'Checkout'
                  )}
                </Link>
              </Button>

              {/* Continue Shopping */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                {dict.cart?.continueShopping || 'Continue Shopping'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 