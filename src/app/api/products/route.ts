import { NextRequest, NextResponse } from 'next/server'
import { fetchProductList } from '@/lib/shopify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const first = parseInt(searchParams.get('first') || '20')
    const limit = parseInt(searchParams.get('limit') || '20')
    const after = searchParams.get('after')
    const sortKey = searchParams.get('sortKey') || 'CREATED_AT'
    const reverse = searchParams.get('reverse') === 'true'
    const productType = searchParams.get('productType')
    const handle = searchParams.get('handle')
    
    // 使用limit参数覆盖first参数（为了推荐功能）
    const actualFirst = limit < first ? limit : first
    
    // 构建查询参数
    let cursor = ''
    if (after) {
      cursor = `, after: "${after}"`
    }
    
    // 构建查询字符串
    let queryString = ''
    if (productType) {
      queryString = `, query: "product_type:${productType}"`
    } else if (handle) {
      queryString = `, query: "handle:${handle}"`
    }
    
    const productsQuery = `
      query {
        products(first: ${actualFirst}${cursor}, sortKey: ${sortKey}, reverse: ${reverse}${queryString}) {
          edges {
            cursor
            node {
              id
              title
              handle
              description
              tags
              productType
              createdAt
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `

    // 使用现有的 shopifyFetch 函数
    const { shopifyFetch } = await import('@/lib/shopify')
    const result = await shopifyFetch(productsQuery)
    
    if (result.status === 200 && result.body) {
      const responseData = result.body as any
      const products = responseData?.data?.products?.edges?.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description,
        price: edge.node.priceRange?.minVariantPrice?.amount || '0',
        currencyCode: edge.node.priceRange?.minVariantPrice?.currencyCode || 'USD',
        image: edge.node.images?.edges?.[0]?.node?.url || '',
        productType: edge.node.productType,
        tags: edge.node.tags,
        createdAt: edge.node.createdAt,
        cursor: edge.cursor,
        variants: edge.node.variants?.edges?.map((variantEdge: any) => ({
          id: variantEdge.node.id,
          title: variantEdge.node.title,
          price: variantEdge.node.price?.amount || '0',
          available: variantEdge.node.availableForSale
        })) || []
      })) || []

      const pageInfo = responseData?.data?.products?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null
      }

      return NextResponse.json({
        products,
        pageInfo,
        totalCount: products.length
      })
    } else {
      console.error('Failed to fetch products:', result.error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 