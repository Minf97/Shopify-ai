import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch } from '@/lib/shopify'

// GraphQL mutation to create a new cart
const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
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
    const { lines = [] } = body

    const variables = {
      input: {
        lines
      }
    }

    const result = await shopifyFetch(CREATE_CART_MUTATION, variables)

    if (result.status !== 200 || result.error) {
      return NextResponse.json(
        { error: result.error || 'Failed to create cart' },
        { status: result.status || 500 }
      )
    }

    interface CartResponse {
      data?: {
        cartCreate?: {
          cart?: Record<string, unknown>
          userErrors?: Array<{ message: string }>
        }
      }
    }

    const cartData = (result.body as CartResponse)?.data?.cartCreate


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
    console.error('Error creating cart:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 