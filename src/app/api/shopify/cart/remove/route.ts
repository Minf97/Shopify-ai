import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    handle
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId, lineId } = body

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: 'Cart ID and Line ID are required' },
        { status: 400 }
      )
    }

    const variables = {
      cartId,
      lineIds: [lineId]
    }

    const result = await shopifyFetch(CART_LINES_REMOVE_MUTATION, variables)

    if (result.status !== 200 || result.error) {
      return NextResponse.json(
        { error: result.error || 'Failed to remove item from cart' },
        { status: result.status || 500 }
      )
    }

    interface CartResponse {
      data?: {
        cartLinesRemove?: {
          cart?: Record<string, unknown>
          userErrors?: Array<{ message: string }>
        }
      }
    }

    const cartData = (result.body as CartResponse)?.data?.cartLinesRemove

    if (cartData?.userErrors?.length && cartData.userErrors.length > 0) {
      return NextResponse.json(
        { error: cartData.userErrors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      cart: cartData?.cart
    })

  } catch (error) {
    console.error('Error removing item from cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 