import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

const GET_CART_QUERY = `
  query cart($cartId: ID!) {
    cart(id: $cartId) {
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
  }
`

export async function GET(
  request: NextRequest,
  { params }: { params: { cartId: string } }
) {
  try {
    const { cartId } = params

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    const variables = { cartId }
    const result = await shopifyFetch(GET_CART_QUERY, variables)

    if (result.status !== 200 || result.error) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch cart' },
        { status: result.status || 500 }
      )
    }

    interface CartResponse {
      data?: {
        cart?: Record<string, unknown>
      }
    }

    const cartData = (result.body as CartResponse)?.data?.cart

    if (!cartData) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      cart: cartData
    })

  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 