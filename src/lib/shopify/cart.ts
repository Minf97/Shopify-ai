// Shopify Cart API functions

export interface CartItem {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    image?: {
      url: string
      altText?: string
    }
    product: {
      title: string
      handle: string
    }
    priceV2: {
      amount: string
      currencyCode: string
    }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: Array<{
      node: CartItem
    }>
  }
}

// Create a new cart
export async function createCart(lines: Array<{ merchandiseId: string; quantity: number }> = []): Promise<Cart | null> {
  try {
    const response = await fetch('/api/shopify/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lines }),
    })

    if (!response.ok) {
      throw new Error('Failed to create cart')
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error('Error creating cart:', error)
    return null
  }
}

// Add item to cart
export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<Cart | null> {
  try {
    const response = await fetch('/api/shopify/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartId, variantId, quantity }),
    })

    if (!response.ok) {
      throw new Error('Failed to add item to cart')
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error('Error adding to cart:', error)
    return null
  }
}

// Get cart by ID
export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const response = await fetch(`/api/shopify/cart/${cartId}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch cart')
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error('Error fetching cart:', error)
    return null
  }
}

// Update cart item quantity
export async function updateCartItem(cartId: string, lineId: string, quantity: number): Promise<Cart | null> {
  try {
    const response = await fetch('/api/shopify/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartId, lineId, quantity }),
    })

    if (!response.ok) {
      throw new Error('Failed to update cart item')
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error('Error updating cart item:', error)
    return null
  }
}

// Remove item from cart
export async function removeFromCart(cartId: string, lineId: string): Promise<Cart | null> {
  try {
    const response = await fetch('/api/shopify/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartId, lineId }),
    })

    if (!response.ok) {
      throw new Error('Failed to remove item from cart')
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error('Error removing from cart:', error)
    return null
  }
}

// Supabase 相关函数
export async function syncCartToUser(shopifyCartId: string, cartData: Cart): Promise<boolean> {
  try {
    const response = await fetch('/api/user/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shopifyCartId, cartData }),
    })

    return response.ok
  } catch (error) {
    console.error('Error syncing cart to user:', error)
    return false
  }
}

export async function getUserCart(): Promise<any> {
  try {
    const response = await fetch('/api/user/cart', {
      method: 'GET',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error('Error fetching user cart:', error)
    return null
  }
} 