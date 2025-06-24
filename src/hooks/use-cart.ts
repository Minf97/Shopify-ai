"use client"

import { useState, useEffect, useCallback } from 'react'
import { 
  createCart, 
  addToCart as addToCartApi, 
  getCart, 
  updateCartItem, 
  removeFromCart,
  syncCartToUser,
  getUserCart,
  type Cart 
} from '@/lib/shopify/cart'

const CART_ID_KEY = 'shopify-cart-id'

export interface CartHookReturn {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  addToCart: (variantId: string, quantity?: number) => Promise<boolean>
  updateQuantity: (lineId: string, quantity: number) => Promise<boolean>
  removeItem: (lineId: string) => Promise<boolean>
  clearCart: () => void
  refreshCart: () => Promise<void>
  totalItems: number
  subtotal: number
}

export function useCart(): CartHookReturn {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取购物车总商品数量
  const totalItems = cart?.totalQuantity || 0

  // 计算小计
  const subtotal = cart ? parseFloat(cart.cost.totalAmount.amount) : 0

  // 从本地存储获取购物车ID
  const getCartId = useCallback((): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(CART_ID_KEY)
  }, [])

  // 设置购物车ID到本地存储
  const setCartId = useCallback((cartId: string | null) => {
    if (typeof window === 'undefined') return
    if (cartId) {
      localStorage.setItem(CART_ID_KEY, cartId)
    } else {
      localStorage.removeItem(CART_ID_KEY)
    }
  }, [])

  // 刷新购物车数据
  const refreshCart = useCallback(async () => {
    const cartId = getCartId()
    if (!cartId) return

    setIsLoading(true)
    setError(null)

    try {
      const cartData = await getCart(cartId)
      if (cartData) {
        setCart(cartData)
      } else {
        // 如果购物车不存在，清除本地存储
        setCartId(null)
        setCart(null)
      }
    } catch (err) {
      setError('获取购物车失败')
      console.error('Error refreshing cart:', err)
    } finally {
      setIsLoading(false)
    }
  }, [getCartId, setCartId])

  // 创建新购物车
  const createNewCart = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const newCart = await createCart()
      if (newCart) {
        setCart(newCart)
        setCartId(newCart.id)
        return newCart
      }
      throw new Error('创建购物车失败')
    } catch (err) {
      setError('创建购物车失败')
      console.error('Error creating cart:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [setCartId])

  // 添加商品到购物车
  const addToCart = useCallback(async (variantId: string, quantity: number = 1): Promise<boolean> => {
    console.log('=== useCart addToCart ===')
    console.log('Variant ID:', variantId)
    console.log('Quantity:', quantity)
    console.log('Current cart:', cart)
    console.log('Current cartId:', getCartId())
    
    setIsLoading(true)
    setError(null)

    try {
      let currentCart = cart
      let cartId = getCartId()

      // 如果没有购物车，先创建一个
      if (!cartId || !currentCart) {
        console.log('Creating new cart...')
        currentCart = await createNewCart()
        if (!currentCart) {
          console.error('Failed to create new cart')
          return false
        }
        cartId = currentCart.id
        console.log('New cart created:', cartId)
      }

      console.log('Adding to cart with ID:', cartId)
      const updatedCart = await addToCartApi(cartId, variantId, quantity)
      
      if (updatedCart) {
        console.log('Cart updated successfully:', updatedCart)
        setCart(updatedCart)
        
        // 同步到用户账户（如果已登录）
        try {
          await syncCartToUser(cartId, updatedCart)
          console.log('Cart synced to user account')
        } catch (syncError) {
          // 同步失败不影响购物车功能，只记录警告
          console.warn('同步购物车到用户账户失败:', syncError)
        }
        
        return true
      }
      throw new Error('添加商品失败')
    } catch (err) {
      setError('添加商品到购物车失败')
      console.error('Error adding to cart:', err)
      return false
    } finally {
      setIsLoading(false)
      console.log('=== addToCart completed ===')
    }
  }, [cart, getCartId, createNewCart])

  // 更新商品数量
  const updateQuantity = useCallback(async (lineId: string, quantity: number): Promise<boolean> => {
    const cartId = getCartId()
    if (!cartId) return false

    setIsLoading(true)
    setError(null)

    try {
      if (quantity === 0) {
        // 如果数量为0，删除商品
        return await removeItem(lineId)
      }

      const updatedCart = await updateCartItem(cartId, lineId, quantity)
      if (updatedCart) {
        setCart(updatedCart)
        
        // 同步到用户账户
        try {
          await syncCartToUser(cartId, updatedCart)
        } catch (syncError) {
          console.warn('同步购物车到用户账户失败:', syncError)
        }
        
        return true
      }
      throw new Error('更新数量失败')
    } catch (err) {
      setError('更新商品数量失败')
      console.error('Error updating quantity:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [getCartId])

  // 删除商品
  const removeItem = useCallback(async (lineId: string): Promise<boolean> => {
    const cartId = getCartId()
    if (!cartId) return false

    setIsLoading(true)
    setError(null)

    try {
      const updatedCart = await removeFromCart(cartId, lineId)
      if (updatedCart) {
        setCart(updatedCart)
        
        // 同步到用户账户
        try {
          await syncCartToUser(cartId, updatedCart)
        } catch (syncError) {
          console.warn('同步购物车到用户账户失败:', syncError)
        }
        
        return true
      }
      throw new Error('删除商品失败')
    } catch (err) {
      setError('删除商品失败')
      console.error('Error removing item:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [getCartId])

  // 清空购物车
  const clearCart = useCallback(() => {
    setCart(null)
    setCartId(null)
    setError(null)
  }, [setCartId])

  // 初始化购物车
  useEffect(() => {
    const initializeCart = async () => {
      // 尝试从用户账户获取购物车
      try {
        const userCart = await getUserCart()
        if (userCart && userCart.shopify_cart_id) {
          setCartId(userCart.shopify_cart_id)
          await refreshCart()
          return
        }
      } catch (err) {
        console.warn('获取用户购物车失败:', err)
      }

      // 如果没有用户购物车，尝试从本地存储获取
      const localCartId = getCartId()
      if (localCartId) {
        await refreshCart()
      }
    }

    initializeCart()
  }, [getCartId, refreshCart, setCartId])

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
    totalItems,
    subtotal
  }
} 