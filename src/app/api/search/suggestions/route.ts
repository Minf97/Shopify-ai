import { NextRequest, NextResponse } from 'next/server'
import { fetchProductSuggestions, fetchCollections } from '@/lib/shopify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const collectionHandle = searchParams.get('collection')
    
    // 如果没有查询参数，返回分类列表
    if (!query) {
      const collectionsResult = await fetchCollections()
      if (collectionsResult.status === 200) {
        const collections = collectionsResult.body?.data?.collections?.edges?.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
          description: edge.node.description,
          image: edge.node.image?.url,
          type: 'collection'
        })) || []

        return NextResponse.json({
          suggestions: [],
          collections: collections.slice(0, 6), // 限制返回数量
          popular: collections.slice(0, 4).map((col: any) => ({
            name: col.title,
            handle: col.handle,
            count: Math.floor(Math.random() * 20) + 5 // Mock 商品数量
          }))
        })
      }
    }

    // 获取商品建议
    const result = await fetchProductSuggestions(query || undefined, collectionHandle || undefined)
    
    if (result.status === 200) {
      let products: any[] = []
      
      if (collectionHandle && result.body?.data?.collection?.products?.edges) {
        products = result.body.data.collection.products.edges
      } else if (result.body?.data?.products?.edges) {
        products = result.body.data.products.edges
      }

      const suggestions = products.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        category: edge.node.collections?.edges?.[0]?.node?.title || edge.node.productType || '其他',
        image: edge.node.images?.edges?.[0]?.node?.url,
        type: 'product'
      }))

      return NextResponse.json({
        suggestions,
        collections: [],
        popular: []
      })
    } else {
      console.error('Failed to fetch suggestions:', result.error)
      return NextResponse.json(
        { error: 'Failed to fetch suggestions' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Search suggestions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 