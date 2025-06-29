import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - 获取用户的心愿单
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const { data: wishlistItems, error } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: '获取心愿单失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      wishlist: wishlistItems || []
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
}

// POST - 添加商品到心愿单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productData } = body

    if (!productId) {
      return NextResponse.json(
        { error: '商品ID是必需的' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // 检查是否已经在心愿单中
    const { data: existingItem } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existingItem) {
      return NextResponse.json(
        { error: '商品已在心愿单中' },
        { status: 400 }
      )
    }

    // 添加到心愿单
    const { error } = await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        product_id: productId,
        product_data: productData
      })

    if (error) {
      return NextResponse.json(
        { error: '添加到心愿单失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '已添加到心愿单'
    })

  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
}

// DELETE - 从心愿单中移除商品
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: '商品ID是必需的' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      return NextResponse.json(
        { error: '从心愿单中移除失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '已从心愿单中移除'
    })

  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
} 