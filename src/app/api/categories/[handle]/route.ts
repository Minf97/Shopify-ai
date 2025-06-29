import { NextRequest, NextResponse } from 'next/server'
import { fetchProductsByCollection } from '@/lib/shopify'

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params
    const { searchParams } = new URL(request.url)
    const first = parseInt(searchParams.get('first') || '12')
    
    const result = await fetchProductsByCollection(handle, first)
    
    if (result.status === 200) {
      const collection = result.body?.data?.collection
      
      if (!collection) {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        )
      }

      const products = collection.products?.edges?.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description,
        price: edge.node.priceRange?.minVariantPrice?.amount || '0',
        currencyCode: edge.node.priceRange?.minVariantPrice?.currencyCode || 'USD',
        image: edge.node.images?.edges?.[0]?.node?.url || '',
        productType: edge.node.productType,
        tags: edge.node.tags,
        variants: edge.node.variants?.edges?.map((variantEdge: any) => ({
          id: variantEdge.node.id,
          title: variantEdge.node.title,
          price: variantEdge.node.price?.amount || '0',
          available: variantEdge.node.availableForSale
        })) || []
      })) || []

      const collectionInfo = {
        id: collection.id,
        title: collection.title,
        description: collection.description,
        image: collection.image?.url
      }

      return NextResponse.json({
        collection: collectionInfo,
        products
      })
    } else {
      console.error('Failed to fetch products by collection:', result.error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Category products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 