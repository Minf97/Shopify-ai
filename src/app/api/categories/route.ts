import { NextResponse } from 'next/server'
import { fetchCollections } from '@/lib/shopify'

export async function GET() {
  try {
    const result = await fetchCollections()
    
    if (result.status === 200) {
      const collections = result.body?.data?.collections?.edges?.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description,
        image: edge.node.image?.url
      })) || []

      return NextResponse.json({ collections })
    } else {
      console.error('Failed to fetch collections:', result.error)
      return NextResponse.json(
        { error: 'Failed to fetch collections' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 