"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n"

interface CartItem {
  id: string
  title: string
  price: string
  quantity: number
  image?: string
  variant?: string
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const params = useParams()
  const locale = params.locale as Locale
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Mock data for demonstration
    {
      id: "1",
      title: "Ceramic Mug",
      price: "25.00",
      quantity: 1,
      image: "https://picsum.photos/150/150?random=1",
      variant: "Black/Wood"
    },
    {
      id: "2", 
      title: "Leather Tote Bag",
      price: "89.00",
      quantity: 2,
      image: "https://picsum.photos/150/150?random=2",
      variant: "Brown"
    }
  ])

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const subtotal = cartItems.reduce((sum, item) => 
    sum + parseFloat(item.price) * item.quantity, 0
  )

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
                {dict.nav?.cart || 'Shopping Cart'}
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
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {locale === 'zh' && '购物车为空'}
                  {locale === 'ja' && 'カートは空です'}
                  {locale === 'en' && 'Your cart is empty'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-card rounded-lg border">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold">${item.price}</span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>
                  {locale === 'zh' && '小计'}
                  {locale === 'ja' && '小計'}
                  {locale === 'en' && 'Subtotal'}
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping Note */}
              <p className="text-xs text-muted-foreground">
                {locale === 'zh' && '运费将在结账时计算'}
                {locale === 'ja' && '送料は決済時に計算されます'}
                {locale === 'en' && 'Shipping calculated at checkout'}
              </p>

              {/* Checkout Button */}
              <Button asChild className="w-full">
                <Link href={`/${locale}/checkout`} onClick={onClose}>
                  {locale === 'zh' && '结账'}
                  {locale === 'ja' && '決済へ進む'}
                  {locale === 'en' && 'Checkout'}
                </Link>
              </Button>

              {/* Continue Shopping */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                {locale === 'zh' && '继续购物'}
                {locale === 'ja' && 'ショッピングを続ける'}
                {locale === 'en' && 'Continue Shopping'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 