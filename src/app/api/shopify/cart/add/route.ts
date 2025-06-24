import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
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
    const { cartId, variantId, quantity = 1 } = body

    if (!cartId || !variantId) {
      console.error('Missing required fields:', { cartId: !!cartId, variantId: !!variantId })
      return NextResponse.json(
        { error: 'Cart ID and Variant ID are required' },
        { status: 400 }
      )
    }

    const variables = {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity
        }
      ]
    }

    const result = await shopifyFetch(CART_LINES_ADD_MUTATION, variables)

    if (result.status !== 200 || result.error) {
      return NextResponse.json(
        { error: result.error || 'Failed to add item to cart' },
        { status: result.status || 500 }
      )
    }

    interface CartResponse {
      data?: {
        cartLinesAdd?: {
          cart?: any
          userErrors?: Array<{ message: string }>
        }
      }
    }

    const cartData = (result.body as CartResponse)?.data?.cartLinesAdd

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
    console.error('Error adding item to cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 